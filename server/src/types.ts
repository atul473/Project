export interface ParsedResume {
  fileName: string;
  text: string;
  name?: string;
  email?: string;
  phone?: string;
  skills: string[];
  education: string[];
  experience: string[];
  summary: string;
}

export interface ScoreBreakdown {
  overall: number;
  skills: number;
  experience: number;
  education: number;
  insights: string[];
}

export interface CandidateScore {
  id: string;
  fileName: string;
  resume: ParsedResume;
  score: ScoreBreakdown;
  ragHighlights?: string[];
}
