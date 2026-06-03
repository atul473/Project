import axios from 'axios';

const client = axios.create({ baseURL: '/api' });

export async function login(email: string, password: string) {
  const response = await client.post('/auth/login', { email, password });
  return response.data;
}

export async function uploadResumes(files: File[], jobDescription: string, token: string) {
  const formData = new FormData();
  files.forEach(file => formData.append('resumes', file));
  formData.append('jobDescription', jobDescription);

  const response = await client.post('/resumes/upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}

export async function getRankings(token: string) {
  const response = await client.get('/resumes/rankings', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}
