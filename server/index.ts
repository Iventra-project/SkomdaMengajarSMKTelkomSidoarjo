import 'dotenv/config';
import express from 'express';
import {
  type AuthenticatedRequest,
  type UserRole,
  createSession,
  deleteSession,
  hashPassword,
  normalizeGroupNumber,
  requireAuth,
  requireGroupAccess,
  requireRole,
  verifyPassword,
} from './auth.ts';
import { getDatabasePath, getDb } from './db/index.ts';
import { seedDatabase } from './db/seed.ts';

const app = express();
const PORT = Number(process.env.API_PORT || 3001);

app.use(express.json());

// Initialize and seed SQLite on server startup
seedDatabase(false);

interface GroupRow {
  id: string;
  number: string;
  school_name: string;
  school_address: string;
  district: string;
  leader_name: string;
  mentor_name: string;
  member_count: number;
  featured_module: string;
  status: string;
  status_label: string;
  target_date: string;
  progress_percent: number;
  current_step: number;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step5: string;
  step6: string;
  notes: string | null;
  banner_status: string;
  banner_feedback: string;
  supervisor_memo: string;
  show_memo_to_leader: number;
}

function mapGroupRow(row: GroupRow) {
  return {
    id: row.id,
    number: row.number,
    schoolName: row.school_name,
    schoolAddress: row.school_address,
    district: row.district,
    leaderName: row.leader_name,
    mentorName: row.mentor_name,
    memberCount: row.member_count,
    featuredModule: row.featured_module,
    status: row.status,
    statusLabel: row.status_label,
    targetDate: row.target_date,
    progressPercent: row.progress_percent,
    currentStep: row.current_step,
    steps: {
      step1: row.step1,
      step2: row.step2,
      step3: row.step3,
      step4: row.step4,
      step5: row.step5,
      step6: row.step6,
    },
    notes: row.notes ?? undefined,
    bannerStatus: row.banner_status,
    bannerFeedback: row.banner_feedback,
    supervisorMemo: row.supervisor_memo,
    showMemoToLeader: Boolean(row.show_memo_to_leader),
  };
}

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'SYC-2027 API Server berjalan. Buka frontend di http://localhost:3000 (npm run dev).',
    endpoints: [
      '/api/health',
      '/api/auth/register',
      '/api/auth/login',
      '/api/auth/me',
      '/api/groups',
    ],
  });
});

app.get('/api/health', (_req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT 1 as ok').get() as { ok: number };
  res.json({ ok: row.ok === 1, database: getDatabasePath() });
});

// ========================
// Auth Routes (Login, Register, Logout, Me)
// ========================
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role, groupNumber, schoolName } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    groupNumber?: string;
    schoolName?: string;
  };

  if (!name?.trim() || !email?.trim() || !password) {
    res.status(400).json({ error: 'Nama, email, dan kata sandi wajib diisi.' });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: 'Kata sandi minimal 6 karakter.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const assignedRole: UserRole = role === 'admin' ? 'admin' : 'user';
  const db = getDb();

  const existing = db.prepare('SELECT id FROM users WHERE lower(email) = ?').get(normalizedEmail);
  if (existing) {
    res.status(409).json({ error: 'Email sudah terdaftar. Silakan login.' });
    return;
  }

  const passwordHash = hashPassword(password);
  const normalizedGroup = assignedRole === 'user' ? normalizeGroupNumber(groupNumber) : null;
  const matchedGroup = normalizedGroup
    ? (db.prepare('SELECT school_name FROM groups WHERE number = ?').get(normalizedGroup) as
        | { school_name: string }
        | undefined)
    : undefined;
  const resolvedSchool =
    schoolName?.trim() ||
    matchedGroup?.school_name ||
    (assignedRole === 'admin' ? 'SMK Telkom Sidoarjo' : 'SMPN 1 Sidoarjo');

  const result = db
    .prepare(
      `INSERT INTO users (name, email, password_hash, role, group_number, school_name)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(name.trim(), normalizedEmail, passwordHash, assignedRole, normalizedGroup, resolvedSchool);

  const userId = Number(result.lastInsertRowid);
  const token = createSession(userId);

  res.status(201).json({
    token,
    user: {
      id: userId,
      name: name.trim(),
      email: normalizedEmail,
      role: assignedRole,
      groupNumber: normalizedGroup ?? undefined,
      schoolName: resolvedSchool,
    },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email?.trim() || !password) {
    res.status(400).json({ error: 'Email dan kata sandi wajib diisi.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const db = getDb();
  const user = db
    .prepare('SELECT id, name, email, password_hash, role, group_number, school_name FROM users WHERE lower(email) = ?')
    .get(normalizedEmail) as
    | {
        id: number;
        name: string;
        email: string;
        password_hash: string;
        role: UserRole;
        group_number: string | null;
        school_name: string | null;
      }
    | undefined;

  if (!user || !verifyPassword(password, user.password_hash)) {
    res.status(401).json({ error: 'Email atau kata sandi salah.' });
    return;
  }

  const token = createSession(user.id);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      groupNumber: user.group_number ?? undefined,
      schoolName: user.school_name ?? undefined,
    },
  });
});

app.post('/api/auth/logout', requireAuth, (req: AuthenticatedRequest, res) => {
  if (req.authToken) {
    deleteSession(req.authToken);
  }
  res.json({ ok: true });
});

app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

app.get('/api/groups', (_req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM groups ORDER BY number ASC').all() as unknown as GroupRow[];
  res.json(rows.map(mapGroupRow));
});

app.get('/api/groups/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM groups WHERE id = ?').get(req.params.id) as unknown as GroupRow | undefined;
  if (!row) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }
  res.json(mapGroupRow(row));
});

app.post('/api/groups', requireAuth, requireRole('admin'), (req, res) => {
  const {
    number,
    schoolName,
    schoolAddress = '',
    district = 'Sidoarjo',
    leaderName = '—',
    mentorName = 'Pak Indra, S.Kom',
    memberCount = 5,
    featuredModule = 'Literasi Digital & AI',
    status = 'ontrack',
    statusLabel = 'Berjalan',
    targetDate = '21 Feb 2026',
    progressPercent = 66,
    currentStep = 4,
    notes = '',
  } = req.body as Record<string, unknown>;

  if (!number || !schoolName) {
    res.status(400).json({ error: 'Nomor kelompok dan nama SMP wajib diisi.' });
    return;
  }

  const numStr = normalizeGroupNumber(String(number));
  const db = getDb();

  const existing = db.prepare('SELECT id FROM groups WHERE id = ? OR number = ?').get(numStr, numStr);
  if (existing) {
    res.status(409).json({ error: `Kelompok ${numStr} sudah terdaftar.` });
    return;
  }

  const dbStatus =
    status === 'review' || status === 'revisi' || status === 'overdue' || status === 'ontrack'
      ? status
      : 'ontrack';

  db.prepare(
    `INSERT INTO groups (
      id, number, school_name, school_address, district, leader_name, mentor_name,
      member_count, featured_module, status, status_label, target_date, progress_percent,
      current_step, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    numStr,
    numStr,
    String(schoolName).trim(),
    String(schoolAddress || `Jl. Raya ${district}, Sidoarjo`).trim(),
    String(district).trim(),
    String(leaderName || '—').trim(),
    String(mentorName).trim(),
    Number(memberCount) || 5,
    String(featuredModule).trim(),
    dbStatus,
    String(statusLabel),
    String(targetDate),
    Number(progressPercent) || 0,
    Number(currentStep) || 1,
    notes ? String(notes) : null
  );

  const created = db.prepare('SELECT * FROM groups WHERE id = ?').get(numStr) as unknown as GroupRow;
  res.status(201).json(mapGroupRow(created));
});

app.put('/api/groups/:id', requireAuth, requireRole('admin'), (req, res) => {
  const groupId = normalizeGroupNumber(req.params.id);
  const db = getDb();
  const existing = db.prepare('SELECT * FROM groups WHERE id = ?').get(groupId) as unknown as GroupRow | undefined;

  const {
    schoolName,
    district,
    leaderName,
    memberCount,
    status,
    statusLabel,
    currentStep,
    progressPercent,
  } = req.body as Record<string, unknown>;

  const dbStatus =
    status === 'review' || status === 'revisi' || status === 'overdue' || status === 'ontrack'
      ? status
      : existing?.status || 'ontrack';

  if (existing) {
    db.prepare(
      `UPDATE groups
       SET school_name = ?,
           district = ?,
           leader_name = ?,
           member_count = ?,
           status = ?,
           status_label = ?,
           current_step = ?,
           progress_percent = ?,
           updated_at = datetime('now')
       WHERE id = ?`
    ).run(
      schoolName ? String(schoolName).trim() : existing.school_name,
      district ? String(district).trim() : existing.district,
      leaderName !== undefined ? String(leaderName).trim() : existing.leader_name,
      memberCount !== undefined ? Number(memberCount) : existing.member_count,
      dbStatus,
      statusLabel ? String(statusLabel) : existing.status_label,
      currentStep !== undefined ? Number(currentStep) : existing.current_step,
      progressPercent !== undefined ? Number(progressPercent) : existing.progress_percent,
      groupId
    );
    const updated = db.prepare('SELECT * FROM groups WHERE id = ?').get(groupId) as unknown as GroupRow;
    res.json(mapGroupRow(updated));
    return;
  }

  res.json({ id: groupId, updated: true });
});

app.delete('/api/groups/:id', requireAuth, requireRole('admin'), (req, res) => {
  const rawId = req.params.id.replace(/^KEL-/i, '');
  const groupId = normalizeGroupNumber(rawId);
  const db = getDb();
  db.prepare('DELETE FROM groups WHERE id = ? OR number = ?').run(groupId, groupId);
  res.json({ ok: true, id: groupId });
});

app.patch('/api/groups/:id/banner-decision', requireAuth, requireRole('admin'), (req, res) => {
  const { decision, notes } = req.body as { decision?: 'approved' | 'revision'; notes?: string };
  if (decision !== 'approved' && decision !== 'revision') {
    res.status(400).json({ error: 'Invalid decision. Must be "approved" or "revision".' });
    return;
  }
  const db = getDb();
  const result = db
    .prepare(
      `UPDATE groups
       SET banner_status = ?, banner_feedback = ?, updated_at = datetime('now')
       WHERE id = ?`
    )
    .run(decision, notes ?? '', req.params.id);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }
  res.json({ id: req.params.id, bannerStatus: decision, bannerFeedback: notes ?? '' });
});

app.patch('/api/groups/:id/memo', requireAuth, requireRole('admin'), (req, res) => {
  const { memo, shareWithLeader } = req.body as { memo?: string; shareWithLeader?: boolean };
  const db = getDb();
  const result = db
    .prepare(
      `UPDATE groups
       SET supervisor_memo = ?, show_memo_to_leader = ?, updated_at = datetime('now')
       WHERE id = ?`
    )
    .run(memo ?? '', shareWithLeader ? 1 : 0, req.params.id);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }
  res.json({ id: req.params.id, supervisorMemo: memo ?? '', showMemoToLeader: Boolean(shareWithLeader) });
});

app.get('/api/groups/:groupId/members', requireAuth, requireGroupAccess('groupId'), (req, res) => {
  const db = getDb();
  const groupId = normalizeGroupNumber(req.params.groupId);
  const rows = db
    .prepare(
      `SELECT id, group_id as groupId, name, role, instagram_url as instagramUrl, status, initials
       FROM members WHERE group_id = ? ORDER BY id ASC`
    )
    .all(groupId);
  res.json(rows);
});

app.patch(
  '/api/groups/:groupId/members/:memberId/toggle',
  requireAuth,
  requireGroupAccess('groupId'),
  (req, res) => {
    const db = getDb();
    const groupId = normalizeGroupNumber(req.params.groupId);
    const member = db
      .prepare('SELECT id, status, instagram_url FROM members WHERE id = ? AND group_id = ?')
      .get(req.params.memberId, groupId) as
      | { id: string; status: 'valid' | 'pending'; instagram_url: string | null }
      | undefined;

    if (!member) {
      res.status(404).json({ error: 'Member not found' });
      return;
    }

    const nextStatus = member.status === 'valid' ? 'pending' : 'valid';
    const nextInstagramUrl =
      member.status === 'pending' && !member.instagram_url
        ? `instagram.com/p/C3${member.id}test`
        : member.instagram_url;

    db.prepare('UPDATE members SET status = ?, instagram_url = ? WHERE id = ? AND group_id = ?').run(
      nextStatus,
      nextInstagramUrl,
      req.params.memberId,
      groupId
    );

    res.json({ id: member.id, status: nextStatus, instagramUrl: nextInstagramUrl });
  }
);

app.get('/api/groups/:groupId/tasks', requireAuth, requireGroupAccess('groupId'), (req, res) => {
  const db = getDb();
  const groupId = normalizeGroupNumber(req.params.groupId);
  const rows = db
    .prepare(
      `SELECT id, title, column_name as column, priority, assignee,
              assignee_initials as assigneeInitials, due_date as dueDate,
              subtext, is_overdue as isOverdue
       FROM sprint_tasks WHERE group_id = ? ORDER BY created_at DESC`
    )
    .all(groupId) as Array<Record<string, unknown>>;

  res.json(rows.map((r) => ({ ...r, isOverdue: Boolean(r.isOverdue) })));
});

app.post('/api/groups/:groupId/tasks', requireAuth, requireGroupAccess('groupId'), (req, res) => {
  const groupId = normalizeGroupNumber(req.params.groupId);
  const { title, priority = 'medium', assignee = 'Ketua Tim' } = req.body as {
    title?: string;
    priority?: 'high' | 'medium' | 'low';
    assignee?: string;
  };
  if (!title || !title.trim()) {
    res.status(400).json({ error: 'Task title is required' });
    return;
  }
  const id = `task-${Date.now()}`;
  const assigneeInitials = assignee.slice(0, 2).toUpperCase();
  const db = getDb();
  db.prepare(
    `INSERT INTO sprint_tasks (
      id, group_id, title, column_name, priority, assignee, assignee_initials, due_date, subtext
    ) VALUES (?, ?, ?, 'todo', ?, ?, ?, '14 Feb', 'Tugas baru ditambahkan')`
  ).run(id, groupId, title.trim(), priority, assignee, assigneeInitials);

  res.status(201).json({
    id,
    title: title.trim(),
    column: 'todo',
    priority,
    assignee,
    assigneeInitials,
    dueDate: '14 Feb',
    subtext: 'Tugas baru ditambahkan',
  });
});

app.patch('/api/tasks/:taskId/move', requireAuth, (req: AuthenticatedRequest, res) => {
  const { column } = req.body as { column?: 'todo' | 'in_progress' | 'done' };
  if (column !== 'todo' && column !== 'in_progress' && column !== 'done') {
    res.status(400).json({ error: 'Invalid column' });
    return;
  }
  const db = getDb();
  const task = db
    .prepare('SELECT id, group_id FROM sprint_tasks WHERE id = ?')
    .get(req.params.taskId) as { id: string; group_id: string } | undefined;

  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  if (req.user?.role === 'user' && normalizeGroupNumber(req.user.groupNumber) !== task.group_id) {
    res.status(403).json({
      error: `Akses ditolak: Tugas ini milik Kelompok ${task.group_id}.`,
    });
    return;
  }

  db.prepare('UPDATE sprint_tasks SET column_name = ? WHERE id = ?').run(column, req.params.taskId);
  res.json({ id: req.params.taskId, column });
});

app.get('/api/alerts', (_req, res) => {
  const db = getDb();
  const rows = db
    .prepare('SELECT id, group_id as groupId, group_name as groupName, issue, deadline, severity, resolved FROM urgent_alerts')
    .all() as Array<Record<string, unknown>>;
  res.json(rows.map((r) => ({ ...r, resolved: Boolean(r.resolved) })));
});

app.get('/api/activities', (_req, res) => {
  const db = getDb();
  const rows = db
    .prepare('SELECT id, group_id as groupId, title, subtitle, time_ago as timeAgo, author FROM activity_events')
    .all();
  res.json(rows);
});

app.get('/api/showcase', (_req, res) => {
  const db = getDb();
  const rows = db
    .prepare('SELECT id, tag, title, description as desc, school, image_url as image FROM showcase_projects')
    .all();
  res.json(rows);
});

app.listen(PORT, () => {
  console.log(`SYC-2027 API server listening on http://localhost:${PORT}`);
  console.log(`SQLite database: ${getDatabasePath()}`);
});
