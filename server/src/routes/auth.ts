import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();
const TEST_USER = {
  id: 'user-1',
  email: 'atulparjapati@gmail.com',
  password: 'password123',
  name: 'Recruiter'
};

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email !== TEST_USER.email || password !== TEST_USER.password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'JWT secret not configured' });
  }

  const token = jwt.sign({ userId: TEST_USER.id, email: TEST_USER.email }, secret, {
    expiresIn: '8h'
  });

  res.json({ token, user: { email: TEST_USER.email, name: TEST_USER.name } });
});

export default router;
