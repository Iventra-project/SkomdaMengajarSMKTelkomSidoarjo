import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { getDb } from './db/index.ts';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  groupNumber?: string;
  schoolName?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
  authToken?: string;
}

/**
 * Hashes a plaintext password with a random 16-byte salt using scrypt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a plaintext password against a stored `salt:hash` string.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;
  const keyBuf = Buffer.from(key, 'hex');
  const derivedBuf = crypto.scryptSync(password, salt, 64);
  if (keyBuf.length !== derivedBuf.length) return false;
  return crypto.timingSafeEqual(keyBuf, derivedBuf);
}

/**
 * Creates a new session token valid for 7 days in SQLite.
 */
export function createSession(userId: number): string {
  const db = getDb();
  const token = crypto.randomBytes(32).toString('hex');
  db.prepare(
    `INSERT INTO sessions (token, user_id, expires_at)
     VALUES (?, ?, datetime('now', '+7 days'))`
  ).run(token, userId);
  return token;
}

/**
 * Removes a session token from SQLite.
 */
export function deleteSession(token: string): void {
  const db = getDb();
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

/**
 * Resolves a valid, unexpired session token to an AuthUser.
 */
export function getUserByToken(token: string): AuthUser | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT u.id, u.name, u.email, u.role, u.group_number, u.school_name
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > datetime('now')`
    )
    .get(token) as
    | {
        id: number;
        name: string;
        email: string;
        role: UserRole;
        group_number: string | null;
        school_name: string | null;
      }
    | undefined;

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    groupNumber: row.group_number ?? undefined,
    schoolName: row.school_name ?? undefined,
  };
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  const headerToken = req.headers['x-auth-token'];
  if (typeof headerToken === 'string' && headerToken.trim()) {
    return headerToken.trim();
  }
  return null;
}

/**
 * Express middleware requiring a valid authenticated session.
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ error: 'Autentikasi diperlukan. Silakan login terlebih dahulu.' });
    return;
  }

  const user = getUserByToken(token);
  if (!user) {
    res.status(401).json({ error: 'Sesi tidak valid atau telah kedaluwarsa.' });
    return;
  }

  req.user = user;
  req.authToken = token;
  next();
}

/**
 * Normalizes group number to a 2-digit string (e.g. "1" -> "01").
 */
export function normalizeGroupNumber(groupNumber?: string | null): string {
  const cleaned = (groupNumber || '03').trim().replace(/^0+/, '');
  const num = Number.parseInt(cleaned || '3', 10);
  if (Number.isNaN(num) || num < 1) return '03';
  return String(num).padStart(2, '0');
}

/**
 * Express middleware restricting access to specific user roles.
 */
export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Autentikasi diperlukan.' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: `Akses ditolak. Diperlukan role: ${roles.join(' atau ')}.`,
      });
      return;
    }
    next();
  };
}

/**
 * Ensures a 'user' role can only access resources belonging to their own groupNumber.
 * Admins can access any group.
 */
export function requireGroupAccess(paramName = 'groupId') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Autentikasi diperlukan.' });
      return;
    }
    if (req.user.role === 'admin') {
      next();
      return;
    }
    const requestedGroup = normalizeGroupNumber(req.params[paramName]);
    const userGroup = normalizeGroupNumber(req.user.groupNumber);
    if (requestedGroup !== userGroup) {
      res.status(403).json({
        error: `Akses ditolak: Akun Anda terdaftar di Kelompok ${userGroup}, tidak dapat mengakses Kelompok ${requestedGroup}.`,
      });
      return;
    }
    next();
  };
}
