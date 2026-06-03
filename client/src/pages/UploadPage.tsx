import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResumes, getRankings } from '../api';

interface Candidate {
  id: string;
  fileName: string;
  score: {
    overall: number;
    skills: number;
    experience: number;
    education: number;
    insights: string[];
  };
  resume: {
    name?: string;
    email?: string;
    phone?: string;
    skills: string[];
    education: string[];
    experience: string[];
    summary: string;
  };
  ragHighlights?: string[];
}

interface UploadPageProps {
  token: string;
  onLogout: () => void;
}

function UploadPage({ token, onLogout }: UploadPageProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<Candidate[]>([]);
  const [rankings, setRankings] = useState<Candidate[]>([]);
  const [status, setStatus] = useState('Upload resumes and compare them to the job description.');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files ? Array.from(event.target.files) : [];
    setFiles(prevFiles => {
      const existingKeys = new Set(prevFiles.map(file => `${file.name}-${file.size}-${file.lastModified}`));
      const newFiles = selectedFiles.filter(file => !existingKeys.has(`${file.name}-${file.size}-${file.lastModified}`));
      return [...prevFiles, ...newFiles].slice(0, 20);
    });
    event.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, fileIndex) => fileIndex !== index));
  };

  const handleClearFiles = () => {
    setFiles([]);
  };

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    if (!jobDescription.trim()) {
      setStatus('Please enter a job description.');
      return;
    }
    if (files.length === 0) {
      setStatus('Please select at least one resume file.');
      return;
    }
    if (files.length > 20) {
      setStatus('You can upload a maximum of 20 resumes at once.');
      return;
    }

    setStatus('Uploading and analyzing resumes...');
    try {
      const response = await uploadResumes(files, jobDescription, token);
      setResults(response.results);
      setStatus('Analysis complete. Review ranked candidates below.');
    } catch (error: any) {
      const responseMessage = error?.response?.data?.message;
      const responseError = error?.response?.data?.error;
      const message = responseMessage || error?.message || 'Upload failed. Confirm the backend is running.';
      const details = responseError ? ` - ${responseError}` : '';
      setStatus(`Upload failed: ${message}${details}`);
      console.error('Upload error:', error);
    }
  };

  const handleLoadRankings = async () => {
    setStatus('Loading ranking cache...');
    try {
      const data = await getRankings(token);
      setRankings(data.rankings);
      setStatus('Rankings loaded.');
    } catch (error) {
      setStatus('Unable to load rankings.');
    }
  };

  const getBadgeClass = (score: number) => {
    if (score >= 75) return 'score-good';
    if (score >= 50) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="app-shell">
      <header>
        <h1>AI Resume Analyzer</h1>
        <p>Upload up to 20 resumes and compare them against your job description.</p>
      </header>

      <section className="card upload-card">
        <div className="page-header-row">
          <h2>Upload Resumes</h2>
          <button className="secondary-button" type="button" onClick={onLogout}>Logout</button>
        </div>
        <form onSubmit={handleUpload}>
          <label>
            Job Description
            <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={8} />
          </label>
          <label>
            Resumes (PDF / DOCX)
            <input type="file" multiple onChange={handleFileChange} accept=".pdf,.docx" />
          </label>
          <p className="hint-text">Selected resumes: {files.length} / 20</p>
          {files.length > 0 && (
            <>
              <button type="button" className="secondary-button" onClick={handleClearFiles}>Clear selection</button>
              <ul className="file-list">
                {files.slice(0, 20).map((file, index) => (
                  <li key={`${file.name}-${file.size}-${file.lastModified}`}> 
                    {file.name}
                    <button type="button" className="remove-file-button" onClick={() => handleRemoveFile(index)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          <button type="submit">Analyze Resumes</button>
        </form>
      </section>

      <section className="card status-card">
        <h2>Status</h2>
        <p>{status}</p>
        <button onClick={handleLoadRankings}>Load Current Rankings</button>
      </section>

      {results.length > 0 && (
        <section className="card results-card">
          <h2>Candidate Scores</h2>
          {results.map(candidate => (
            <div className="candidate-card" key={candidate.id}>
              <h3>
                {candidate.fileName}
                <span className={`score-badge ${getBadgeClass(candidate.score.overall)}`}>
                  {candidate.score.overall}%
                </span>
              </h3>
              <div className="score-grid">
                <div>
                  <strong>Overall score</strong>
                  <p>{candidate.score.overall}%</p>
                </div>
                <div>
                  <strong>Skills score</strong>
                  <p>{candidate.score.skills}%</p>
                </div>
                <div>
                  <strong>Experience score</strong>
                  <p>{candidate.score.experience}%</p>
                </div>
                <div>
                  <strong>Education score</strong>
                  <p>{candidate.score.education}%</p>
                </div>
              </div>
              <div className="insights">
                <strong>Insights:</strong>
                <ul>
                  {candidate.score.insights.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              </div>
              {candidate.ragHighlights && candidate.ragHighlights.length > 0 && (
                <div className="rag-highlights">
                  <strong>RAG highlights:</strong>
                  <ul>
                    {candidate.ragHighlights.map((text, index) => (
                      <li key={index}>{text}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {rankings.length > 0 && (
        <section className="card rankings-card">
          <h2>Stored Rankings</h2>
          {rankings.map(candidate => (
            <div className="candidate-row" key={candidate.id}>
              <span>{candidate.fileName}</span>
              <strong>{candidate.score.overall}%</strong>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default UploadPage;
