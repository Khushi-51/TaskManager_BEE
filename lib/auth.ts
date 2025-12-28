import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export function verifyToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    return decoded.id;
  } catch {
    return null;
  }
}

export function generateToken(userId: string): string {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '24h',
  });
}
