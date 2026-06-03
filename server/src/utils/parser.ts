import { ParsedResume } from '../types';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

function normalizeText(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

export async function extractTextFromFile(file: Express.Multer.File): Promise<string> {
  const extension = file.originalname.split('.').pop()?.toLowerCase();
  const buffer = file.buffer;

  if (extension === 'pdf') {
    const data = await pdfParse(buffer);
    return normalizeText(data.text || '');
  }

  if (extension === 'docx') {
    const result = await mammoth.extractRawText({ buffer });
    return normalizeText(result.value || '');
  }

  return normalizeText(buffer.toString('utf8'));
}

function extractSection(text: string, label: string): string[] {
  const regex = new RegExp(`${label}([\s\S]*?)(?:\n\s*\n|$)`, 'i');
  const match = text.match(regex);
  if (!match) {
    return [];
  }
  return match[1]
    .split(/\n|,|•|\u2022|\r/) .map(token => token.trim())
    .filter(Boolean);
}

function extractItems(lines: string[], limit = 20) {
  return Array.from(new Set(lines)).slice(0, limit);
}

function extractEmails(text: string) {
  const match = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/g);
  return match?.[0] || '';
}

function extractName(text: string) {
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (lines.length === 0) {
    return '';
  }
  const firstLine = lines[0];
  if (firstLine.split(' ').length <= 5 && /[A-Za-z]/.test(firstLine)) {
    return firstLine;
  }
  return '';
}

export function splitTextIntoChunks(text: string, chunkSize = 800): string[] {
  const normalized = text.replace(/\r/g, '\n').replace(/\s+/g, ' ').trim();
  if (normalized.length <= chunkSize) {
    return [normalized];
  }

  const sentences = normalized.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if (!sentence.trim()) {
      continue;
    }
    if (current.length + sentence.length + 1 <= chunkSize) {
      current = current ? `${current} ${sentence}` : sentence;
      continue;
    }

    if (current) {
      chunks.push(current.trim());
    }
    current = sentence;
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

export function extractStructuredData(text: string): ParsedResume {
  const normalized = text.replace(/\r/g, '\n');
  const skills = extractItems([...extractSection(normalized, 'Skills'), ...extractSection(normalized, 'Technical Skills')], 40);
  const education = extractItems(extractSection(normalized, 'Education'), 20);
  const experience = extractItems(extractSection(normalized, 'Experience'), 40);
  const summary = extractSection(normalized, 'Summary').join(' ') || normalized.slice(0, 300);

  return {
    fileName: 'uploaded',
    text: normalized,
    name: extractName(text),
    email: extractEmails(text),
    phone: (text.match(/\+?\d{1,2}[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/)?.[0] || ''),
    skills,
    education,
    experience,
    summary
  };
}
