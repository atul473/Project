# Resume Analyzer

Full-stack AI Resume Analyzer for comparing resumes against job descriptions.

## Features

- Upload PDF/DOCX resumes
- Extract resume text and structured data (name, email, skills, experience, education)
- Compare resumes to job descriptions
- Section-wise matching and candidate ranking
- JWT authentication and cache optimization
- RAG-style resume retrieval highlights using chunked embeddings and an in-memory vector DB
- Optional OpenAI / Mistral integration for embeddings and insights

## Setup

1. Install dependencies:
   - `cd server && npm install`
   - `cd client && npm install`

2. Configure environment variables in `server/.env`.

3. Start in development:
   - `npm run dev:server` for backend
   - `npm run dev:client` for frontend

## Notes

- If `MISTRAL_API_KEY` is provided, the server will use Mistral embeddings and AI-assisted scoring, including RAG-style resume chunk retrieval.
- Without Mistral, the server falls back to heuristic matching and scoring.

## Assumptions

- Resumes are reasonably well-structured and primarily in English.
- Uploaded files are PDF or DOCX and not password-protected.
- Job descriptions are provided as plain text and contain relevant keywords for matching.
- This project is intended as a demonstration and not a replacement for full HR/ATS workflows.

## Limitations

- Embeddings rely on the external Mistral API (when configured); network failures or missing API keys will fall back to a simple local embedding heuristic with reduced quality.
- Parsing DOCX/PDF uses heuristic extraction (`mammoth` and `pdf-parse`); results may vary for complex layouts, images, or multi-column resumes.
- Authentication is a simple hard-coded demo user; replace with a proper user store and secure flows for production.

## Future scope

- Replace the in-memory vector DB with a persistent vector store (e.g., Milvus, Pinecone, Weaviate, or a database-backed ANN index) for scalable RAG.
- Add multi-language support and improved OCR for scanned PDFs and images using Tesseract or cloud OCR services.
- Integrate a proper user and organization model with role-based access control and audit logging.
- Add batch processing with background workers (e.g., BullMQ/Redis) to handle large uploads and async embedding generation.
- Provide exportable candidate reports, interview notes, and integration with ATS systems.
- Add unit and integration tests for parsing, embedding fallbacks, and API endpoints.
