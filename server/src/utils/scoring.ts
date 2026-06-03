import { ParsedResume, ScoreBreakdown } from '../types';

const mistralKey = process.env.MISTRAL_API_KEY;
const mistralUrl = process.env.MISTRAL_API_URL?.replace(/\/$/, '') ?? 'https://api.mistral.ai/v1/embeddings';
const mistralModel = process.env.MISTRAL_EMBEDDING_MODEL || 'mistral-embedding-3-large';

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
}

function countMatches(tokens: string[], target: string[]) {
  const set = new Set(target);
  return tokens.filter(token => set.has(token)).length;
}

async function getMistralEmbedding(text: string) {
  if (!mistralKey) {
    throw new Error('MISTRAL_API_KEY is not configured');
  }

  const response = await fetch(mistralUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${mistralKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model: mistralModel, input: text })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Mistral embedding error: ${response.status} ${response.statusText} - ${body}`);
  }

  const data = await response.json();
  if (!data?.data?.[0]?.embedding) {
    throw new Error('Invalid Mistral embedding response');
  }

  return data.data[0].embedding as number[];
}

export async function buildTextEmbedding(text: string) {
  const fallbackEmbedding = normalize(text).slice(0, 300).map(term => term.length).map(Number);
  if (!mistralKey) {
    return fallbackEmbedding;
  }

  try {
    return await getMistralEmbedding(text);
  } catch (error) {
    console.warn('Mistral embedding failed, falling back to local embedding:', error instanceof Error ? error.message : error);
    return fallbackEmbedding;
  }
}

export function cosineSimilarity(a: number[], b: number[]) {
  if (a.length === 0 || b.length === 0) {
    return 0;
  }
  const minLength = Math.min(a.length, b.length);
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < minLength; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return normA === 0 || normB === 0 ? 0 : dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function scoreSection(resume: ParsedResume, jobDescription: string) {
  const jobTokens = normalize(jobDescription);
  const skillsTokens = normalize(resume.skills.join(' '));
  const experienceTokens = normalize(resume.experience.join(' '));
  const educationTokens = normalize(resume.education.join(' '));

  return {
    skills: Math.min(1, countMatches(jobTokens, skillsTokens) / Math.max(1, jobTokens.length)) * 100,
    experience: Math.min(1, countMatches(jobTokens, experienceTokens) / Math.max(1, jobTokens.length)) * 100,
    education: Math.min(1, countMatches(jobTokens, educationTokens) / Math.max(1, jobTokens.length)) * 100
  };
}

function buildInsights(resume: ParsedResume, sectionScores: { skills: number; experience: number; education: number; }) {
  const insights: string[] = [];
  if (sectionScores.skills < 40) {
    insights.push('Add more role-specific technical skills and keywords from the job description.');
  } else {
    insights.push('Skills section is well aligned with the job description.');
  }

  if (sectionScores.experience < 45) {
    insights.push('Expand your experience section with concrete responsibilities and measurable outcomes.');
  }

  if (sectionScores.education < 30) {
    insights.push('Include more education details or training that match the role requirements.');
  }

  if (!resume.email) {
    insights.push('Add a valid email address to the resume header.');
  }

  return insights;
}

export async function scoreResumeAgainstJob(resume: ParsedResume, jobDescription: string, jobEmbedding: number[]): Promise<ScoreBreakdown> {
  const sectionScores = scoreSection(resume, jobDescription);
  const resumeEmbedding = await buildTextEmbedding(resume.text);
  const embeddingScore = cosineSimilarity(resumeEmbedding, jobEmbedding) * 100;

  const overall = Math.round(
    (embeddingScore * 0.45) +
    (sectionScores.skills * 0.30) +
    (sectionScores.experience * 0.15) +
    (sectionScores.education * 0.10)
  );

  const insights = buildInsights(resume, sectionScores);

  return {
    overall: Math.min(100, Math.max(0, overall)),
    skills: Math.round(sectionScores.skills),
    experience: Math.round(sectionScores.experience),
    education: Math.round(sectionScores.education),
    insights
  };
}
