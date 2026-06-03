import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../middleware/auth';
import { extractTextFromFile, extractStructuredData, splitTextIntoChunks } from '../utils/parser';
import { scoreResumeAgainstJob, buildTextEmbedding, cosineSimilarity } from '../utils/scoring';
import { VectorDatabase, VectorRecord } from '../utils/vectorDb';
import NodeCache from 'node-cache';
import { CandidateScore } from '../types';
import crypto from 'crypto';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const cache = new NodeCache({ stdTTL: Number(process.env.CACHE_TTL_SECONDS || 300) });
const candidates: CandidateScore[] = [];
const vectorDb = new VectorDatabase();

function getTopChunks(chunks: VectorRecord[], queryEmbedding: number[], topK: number) {
  return chunks
    .map(chunk => ({
      text: chunk.text,
      score: cosineSimilarity(chunk.embedding, queryEmbedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.text);
}

function getCacheKey(jobDescription: string, fileNames: string[]) {
  return crypto.createHash('sha256').update(jobDescription + fileNames.join(',')).digest('hex');
}

router.post('/upload', authenticateToken, upload.array('resumes', 20), async (req, res) => {
  try {
    const jobDescription = String(req.body.jobDescription || '');
    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' });
    }

    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'At least one resume file is required' });
    }

    if (files.length > 20) {
      return res.status(400).json({ message: 'Please upload no more than 20 resumes at a time.' });
    }

    const cacheKey = getCacheKey(jobDescription, files.map(file => file.originalname));
    const cached = cache.get<CandidateScore[]>(cacheKey);
    if (cached) {
      return res.json({ results: cached, cached: true });
    }

    const jobEmbedding = await buildTextEmbedding(jobDescription);
    const parsedResumes: CandidateScore[] = [];

    for (const file of files) {
      const text = await extractTextFromFile(file);
      const structured = extractStructuredData(text);
      const score = await scoreResumeAgainstJob(structured, jobDescription, jobEmbedding);

      const chunks = splitTextIntoChunks(text, 800);
      const chunkEmbeddings = await Promise.all(chunks.map(chunk => buildTextEmbedding(chunk)));
      const candidateId = crypto.randomUUID();

      chunkEmbeddings.forEach((embedding, index) => {
        vectorDb.add({
          id: crypto.randomUUID(),
          candidateId,
          fileName: file.originalname,
          text: chunks[index],
          embedding
        });
      });

      const ragHighlights = vectorDb
        .queryByCandidate(candidateId, jobEmbedding, 3)
        .map(chunk => chunk.text);

      const candidate: CandidateScore = {
        id: candidateId,
        fileName: file.originalname,
        resume: structured,
        score,
        ragHighlights
      };
      parsedResumes.push(candidate);
    }

    parsedResumes.sort((a, b) => b.score.overall - a.score.overall);
    cache.set(cacheKey, parsedResumes);
    candidates.splice(0, candidates.length, ...parsedResumes);

    res.json({ results: parsedResumes, cached: false });
  } catch (error) {
    console.error('Resume upload error', error);
    res.status(500).json({ message: 'Unable to process resumes', error: error instanceof Error ? error.message : String(error) });
  }
});

router.get('/rankings', authenticateToken, (req, res) => {
  res.json({ rankings: candidates });
});

router.post('/retrieve', authenticateToken, async (req, res) => {
  try {
    const { jobDescription, candidateId, topK = 5 } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' });
    }

    const queryEmbedding = await buildTextEmbedding(String(jobDescription));
    const results = candidateId
      ? vectorDb.queryByCandidate(String(candidateId), queryEmbedding, Number(topK))
      : vectorDb.query(queryEmbedding, Number(topK));

    res.json({ results });
  } catch (error) {
    console.error('Retrieve error', error);
    res.status(500).json({ message: 'Unable to retrieve relevant chunks', error: error instanceof Error ? error.message : String(error) });
  }
});

router.post('/score-text', authenticateToken, async (req, res) => {
  try {
    const { text, jobDescription } = req.body;
    if (!text || !jobDescription) {
      return res.status(400).json({ message: 'Text and job description are required' });
    }

    const structured = extractStructuredData(text);
    const jobEmbedding = await buildTextEmbedding(jobDescription);
    const score = await scoreResumeAgainstJob(structured, jobDescription, jobEmbedding);
    res.json({ resume: structured, score });
  } catch (error) {
    console.error('Score text error', error);
    res.status(500).json({ message: 'Unable to score text', error: error instanceof Error ? error.message : String(error) });
  }
});

export default router;
