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
  let assignedGroupIds: string[] | undefined;
  if (user.role === 'mentor') {
    const plotRows = db
      .prepare('SELECT group_id FROM mentor_groups WHERE mentor_id = ? ORDER BY group_id ASC')
      .all(user.id) as Array<{ group_id: string }>;
    assignedGroupIds = plotRows.map((r) => r.group_id);
  }

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      groupNumber: user.group_number ?? undefined,
      schoolName: user.school_name ?? undefined,
      assignedGroupIds,
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

app.patch('/api/groups/:id/banner-decision', requireAuth, requireRole('admin', 'mentor'), requireGroupAccess('id'), (req, res) => {
  const { decision, notes } = req.body as { decision?: 'approved' | 'revision'; notes?: string };
  if (decision !== 'approved' && decision !== 'revision') {
    res.status(400).json({ error: 'Invalid decision. Must be "approved" or "revision".' });
    return;
  }
  const db = getDb();
  const groupId = normalizeGroupNumber(req.params.id);
  const result = db
    .prepare(
      `UPDATE groups
       SET banner_status = ?, banner_feedback = ?, updated_at = datetime('now')
       WHERE id = ?`
    )
    .run(decision, notes ?? '', groupId);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }
  res.json({ id: groupId, bannerStatus: decision, bannerFeedback: notes ?? '' });
});

app.patch('/api/groups/:id/memo', requireAuth, requireRole('admin', 'mentor'), requireGroupAccess('id'), (req, res) => {
  const { memo, shareWithLeader } = req.body as { memo?: string; shareWithLeader?: boolean };
  const db = getDb();
  const groupId = normalizeGroupNumber(req.params.id);
  const result = db
    .prepare(
      `UPDATE groups
       SET supervisor_memo = ?, show_memo_to_leader = ?, updated_at = datetime('now')
       WHERE id = ?`
    )
    .run(memo ?? '', shareWithLeader ? 1 : 0, groupId);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Group not found' });
    return;
  }
  res.json({ id: groupId, supervisorMemo: memo ?? '', showMemoToLeader: Boolean(shareWithLeader) });
});

// ========================
// RBAC: Admin CRUD Akun Guru Pembimbing & Plotting Kelompok
// ========================
app.get('/api/admin/mentors', requireAuth, requireRole('admin'), (_req, res) => {
  const db = getDb();
  const mentors = db
    .prepare(
      `SELECT id, name, email, role, school_name as schoolName, created_at as createdAt
       FROM users
       WHERE role = 'mentor'
       ORDER BY id ASC`
    )
    .all() as Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    schoolName: string | null;
    createdAt: string;
  }>;

  const getGroups = db.prepare(`
    SELECT g.id, g.number, g.school_name as schoolName
    FROM mentor_groups mg
    JOIN groups g ON g.id = mg.group_id
    WHERE mg.mentor_id = ?
    ORDER BY g.number ASC
  `);

  res.json(
    mentors.map((m) => ({
      ...m,
      assignedGroups: getGroups.all(m.id),
    }))
  );
});

app.post('/api/admin/mentors', requireAuth, requireRole('admin'), (req, res) => {
  const { name, email, password, groupIds = [] } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    groupIds?: string[];
  };

  if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
    res.status(400).json({ error: 'Nama, email, dan kata sandi (minimal 6 karakter) wajib diisi.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE lower(email) = ?').get(normalizedEmail);
  if (existing) {
    res.status(409).json({ error: 'Email tersebut sudah digunakan oleh akun lain.' });
    return;
  }

  const info = db
    .prepare(
      `INSERT INTO users (name, email, password_hash, role, group_number, school_name)
       VALUES (?, ?, ?, 'mentor', NULL, 'SMK Telkom Sidoarjo')`
    )
    .run(name.trim(), normalizedEmail, hashPassword(password));

  const mentorId = Number(info.lastInsertRowid);
  const validGroupIds = Array.isArray(groupIds) ? groupIds.map((g) => normalizeGroupNumber(String(g))) : [];

  if (validGroupIds.length > 0) {
    const plotStmt = db.prepare('INSERT OR IGNORE INTO mentor_groups (mentor_id, group_id) VALUES (?, ?)');
    for (const gid of validGroupIds) {
      plotStmt.run(mentorId, gid);
    }
  }

  res.status(201).json({
    id: mentorId,
    name: name.trim(),
    email: normalizedEmail,
    role: 'mentor',
    assignedGroups: validGroupIds.map((gid) => ({ id: gid, number: gid, schoolName: '' })),
  });
});

app.put('/api/admin/mentors/:id', requireAuth, requireRole('admin'), (req, res) => {
  const mentorId = Number(req.params.id);
  const { name, email, password } = req.body as { name?: string; email?: string; password?: string };

  if (!name?.trim() || !email?.trim()) {
    res.status(400).json({ error: 'Nama dan email wajib diisi.' });
    return;
  }
  if (password && password.length < 6) {
    res.status(400).json({ error: 'Kata sandi baru minimal 6 karakter.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const db = getDb();
  const existing = db
    .prepare(`SELECT id FROM users WHERE id = ? AND role = 'mentor'`)
    .get(mentorId) as { id: number } | undefined;
  if (!existing) {
    res.status(404).json({ error: 'Akun Guru Pembimbing tidak ditemukan.' });
    return;
  }

  const dupEmail = db
    .prepare('SELECT id FROM users WHERE lower(email) = ? AND id != ?')
    .get(normalizedEmail, mentorId);
  if (dupEmail) {
    res.status(409).json({ error: 'Email sudah digunakan akun lain.' });
    return;
  }

  if (password) {
    db.prepare(`UPDATE users SET name = ?, email = ?, password_hash = ? WHERE id = ?`).run(
      name.trim(),
      normalizedEmail,
      hashPassword(password),
      mentorId
    );
  } else {
    db.prepare(`UPDATE users SET name = ?, email = ? WHERE id = ?`).run(
      name.trim(),
      normalizedEmail,
      mentorId
    );
  }

  res.json({ id: mentorId, name: name.trim(), email: normalizedEmail, role: 'mentor' });
});

app.delete('/api/admin/mentors/:id', requireAuth, requireRole('admin'), (req, res) => {
  const mentorId = Number(req.params.id);
  const db = getDb();
  const result = db.prepare(`DELETE FROM users WHERE id = ? AND role = 'mentor'`).run(mentorId);
  if (result.changes === 0) {
    res.status(404).json({ error: 'Akun Guru Pembimbing tidak ditemukan.' });
    return;
  }
  res.json({ ok: true, id: mentorId });
});

app.put('/api/admin/mentors/:id/groups', requireAuth, requireRole('admin'), (req, res) => {
  const mentorId = Number(req.params.id);
  const { groupIds } = req.body as { groupIds?: string[] };
  if (!Array.isArray(groupIds)) {
    res.status(400).json({ error: 'groupIds harus berupa array.' });
    return;
  }

  const db = getDb();
  const mentor = db
    .prepare(`SELECT id, name FROM users WHERE id = ? AND role = 'mentor'`)
    .get(mentorId) as { id: number; name: string } | undefined;
  if (!mentor) {
    res.status(404).json({ error: 'Akun Guru Pembimbing tidak ditemukan.' });
    return;
  }

  const normalizedIds = Array.from(new Set(groupIds.map((g) => normalizeGroupNumber(String(g)))));
  db.exec('BEGIN');
  try {
    db.prepare('DELETE FROM mentor_groups WHERE mentor_id = ?').run(mentorId);
    const insertPlot = db.prepare('INSERT OR IGNORE INTO mentor_groups (mentor_id, group_id) VALUES (?, ?)');
    const updateMentorName = db.prepare('UPDATE groups SET mentor_name = ? WHERE id = ?');
    for (const gid of normalizedIds) {
      insertPlot.run(mentorId, gid);
      updateMentorName.run(mentor.name, gid);
    }
    db.exec('COMMIT');
    res.json({ ok: true, mentorId, groupIds: normalizedIds });
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
});

// ========================
// RBAC: Guru Pembimbing Filtered Groups & Progress Stages ACC
// ========================
app.get('/api/mentor/groups', requireAuth, requireRole('admin', 'mentor'), (req: AuthenticatedRequest, res) => {
  const db = getDb();
  if (req.user?.role === 'admin') {
    const rows = db.prepare('SELECT * FROM groups ORDER BY number ASC').all() as unknown as GroupRow[];
    res.json(rows.map(mapGroupRow));
    return;
  }

  const rows = db
    .prepare(
      `SELECT g.*
       FROM mentor_groups mg
       JOIN groups g ON g.id = mg.group_id
       WHERE mg.mentor_id = ?
       ORDER BY g.number ASC`
    )
    .all(req.user!.id) as unknown as GroupRow[];

  res.json(rows.map(mapGroupRow));
});

app.get('/api/groups/:groupId/stages', requireAuth, requireGroupAccess('groupId'), (req, res) => {
  const db = getDb();
  const groupId = normalizeGroupNumber(req.params.groupId);
  const rows = db
    .prepare(
      `SELECT ps.id, ps.group_id as groupId, ps.stage_number as stageNumber, ps.title,
              ps.submission_url as submissionUrl, ps.submission_note as submissionNote,
              ps.acc_status as accStatus, ps.reviewed_by as reviewedBy,
              u.name as reviewerName, ps.reviewer_note as reviewerNote,
              ps.reviewed_at as reviewedAt, ps.updated_at as updatedAt
       FROM progress_stages ps
       LEFT JOIN users u ON u.id = ps.reviewed_by
       WHERE ps.group_id = ?
       ORDER BY ps.stage_number ASC`
    )
    .all(groupId);
  res.json(rows);
});

app.post(
  '/api/groups/:groupId/stages/:stageNumber/submit',
  requireAuth,
  requireRole('user'),
  requireGroupAccess('groupId'),
  (req, res) => {
    const groupId = normalizeGroupNumber(req.params.groupId);
    const stageNumber = Number(req.params.stageNumber);
    const { submissionUrl, submissionNote = '' } = req.body as {
      submissionUrl?: string;
      submissionNote?: string;
    };

    if (!Number.isInteger(stageNumber) || stageNumber < 1 || stageNumber > 6) {
      res.status(400).json({ error: 'Nomor tahapan tidak valid (1–6).' });
      return;
    }
    if (!submissionUrl?.trim()) {
      res.status(400).json({ error: 'Tautan / berkas progres wajib diisi.' });
      return;
    }

    const db = getDb();
    db.prepare(
      `UPDATE progress_stages
       SET submission_url = ?, submission_note = ?, acc_status = 'submitted', updated_at = datetime('now')
       WHERE group_id = ? AND stage_number = ?`
    ).run(submissionUrl.trim(), submissionNote.trim(), groupId, stageNumber);

    res.json({ groupId, stageNumber, accStatus: 'submitted', submissionUrl: submissionUrl.trim() });
  }
);

app.patch(
  '/api/groups/:groupId/stages/:stageNumber/review',
  requireAuth,
  requireRole('admin', 'mentor'),
  requireGroupAccess('groupId'),
  (req: AuthenticatedRequest, res) => {
    const groupId = normalizeGroupNumber(req.params.groupId);
    const stageNumber = Number(req.params.stageNumber);
    const { decision, reviewerNote = '' } = req.body as {
      decision?: 'approved' | 'revision';
      reviewerNote?: string;
    };

    if (!Number.isInteger(stageNumber) || stageNumber < 1 || stageNumber > 6) {
      res.status(400).json({ error: 'Nomor tahapan tidak valid (1–6).' });
      return;
    }
    if (decision !== 'approved' && decision !== 'revision') {
      res.status(400).json({ error: 'Keputusan harus "approved" atau "revision".' });
      return;
    }

    const db = getDb();
    const result = db
      .prepare(
        `UPDATE progress_stages
         SET acc_status = ?, reviewer_note = ?, reviewed_by = ?, reviewed_at = datetime('now'), updated_at = datetime('now')
         WHERE group_id = ? AND stage_number = ?`
      )
      .run(decision, reviewerNote.trim(), req.user!.id, groupId, stageNumber);

    if (result.changes === 0) {
      res.status(404).json({ error: 'Tahapan kelompok tidak ditemukan.' });
      return;
    }

    // Sync group step & progress percentage
    const stepCol = `step${stageNumber}`;
    const stepVal = decision === 'approved' ? 'done' : 'revision';
    db.prepare(`UPDATE groups SET ${stepCol} = ?, updated_at = datetime('now') WHERE id = ?`).run(stepVal, groupId);

    const approvedRow = db
      .prepare(`SELECT COUNT(*) as cnt FROM progress_stages WHERE group_id = ? AND acc_status = 'approved'`)
      .get(groupId) as { cnt: number };
    const pct = Math.round((approvedRow.cnt / 6) * 100);
    db.prepare('UPDATE groups SET progress_percent = ? WHERE id = ?').run(pct, groupId);

    res.json({
      groupId,
      stageNumber,
      accStatus: decision,
      reviewerNote: reviewerNote.trim(),
      reviewerName: req.user!.name,
      progressPercent: pct,
    });
  }
);

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
  if (req.user?.role === 'mentor') {
    const plotted = db
      .prepare('SELECT 1 FROM mentor_groups WHERE mentor_id = ? AND group_id = ?')
      .get(req.user.id, task.group_id);
    if (!plotted) {
      res.status(403).json({
        error: `Akses ditolak: Kelompok ${task.group_id} bukan kelompok bimbingan Anda.`,
      });
      return;
    }
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
