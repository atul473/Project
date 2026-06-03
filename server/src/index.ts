import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import resumeRouter from './routes/resumes';

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not configured in server/.env');
} else {
  console.log('JWT_SECRET loaded from environment.');
}

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/resumes', resumeRouter);

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok' });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error', err);
  res.status(500).json({ message: 'Internal server error', details: err.message });
});

app.listen(port, () => {
  console.log(`Resume Analyzer backend listening on http://localhost:${port}`);
});
