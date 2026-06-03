import { cosineSimilarity } from './scoring';

export interface VectorRecord {
  id: string;
  candidateId: string;
  fileName: string;
  text: string;
  embedding: number[];
}

export interface VectorHit {
  id: string;
  candidateId: string;
  fileName: string;
  text: string;
  score: number;
}

export class VectorDatabase {
  private records: VectorRecord[] = [];

  add(record: VectorRecord) {
    this.records.push(record);
  }

  query(queryEmbedding: number[], topK = 5): VectorHit[] {
    return this.records
      .map(record => ({
        id: record.id,
        candidateId: record.candidateId,
        fileName: record.fileName,
        text: record.text,
        score: cosineSimilarity(record.embedding, queryEmbedding)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  queryByCandidate(candidateId: string, queryEmbedding: number[], topK = 5): VectorHit[] {
    return this.records
      .filter(record => record.candidateId === candidateId)
      .map(record => ({
        id: record.id,
        candidateId: record.candidateId,
        fileName: record.fileName,
        text: record.text,
        score: cosineSimilarity(record.embedding, queryEmbedding)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  clear() {
    this.records = [];
  }
}
