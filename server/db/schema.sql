PRAGMA foreign_keys = ON;

-- Users table (Admin, Guru Pembimbing/Mentor, & User/Kelompok)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'mentor', 'user')),
  group_number TEXT,
  school_name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Auth Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Groups (Kelompok SYC)
CREATE TABLE IF NOT EXISTS groups (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  school_name TEXT NOT NULL,
  school_address TEXT NOT NULL,
  district TEXT NOT NULL,
  leader_name TEXT NOT NULL,
  mentor_name TEXT NOT NULL,
  member_count INTEGER NOT NULL DEFAULT 0,
  featured_module TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ontrack', 'review', 'revisi', 'overdue')),
  status_label TEXT NOT NULL,
  target_date TEXT NOT NULL,
  progress_percent INTEGER NOT NULL DEFAULT 0,
  current_step INTEGER NOT NULL DEFAULT 1,
  step1 TEXT NOT NULL DEFAULT 'done',
  step2 TEXT NOT NULL DEFAULT 'done',
  step3 TEXT NOT NULL DEFAULT 'locked',
  step4 TEXT NOT NULL DEFAULT 'locked',
  step5 TEXT NOT NULL DEFAULT 'locked',
  step6 TEXT NOT NULL DEFAULT 'locked',
  notes TEXT,
  banner_status TEXT NOT NULL DEFAULT 'pending' CHECK (banner_status IN ('pending', 'approved', 'revision')),
  banner_feedback TEXT NOT NULL DEFAULT '',
  supervisor_memo TEXT NOT NULL DEFAULT '',
  show_memo_to_leader INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Group Members
CREATE TABLE IF NOT EXISTS members (
  id TEXT NOT NULL,
  group_id TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  instagram_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('valid', 'pending')),
  initials TEXT NOT NULL,
  PRIMARY KEY (id, group_id),
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- Sprint / Kanban Tasks
CREATE TABLE IF NOT EXISTS sprint_tasks (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL,
  title TEXT NOT NULL,
  column_name TEXT NOT NULL DEFAULT 'todo' CHECK (column_name IN ('todo', 'in_progress', 'done')),
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  assignee TEXT NOT NULL,
  assignee_initials TEXT NOT NULL,
  due_date TEXT NOT NULL,
  subtext TEXT NOT NULL,
  is_overdue INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- Activity Feed Events
CREATE TABLE IF NOT EXISTS activity_events (
  id TEXT PRIMARY KEY,
  group_id TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  time_ago TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- Urgent Alerts
CREATE TABLE IF NOT EXISTS urgent_alerts (
  id TEXT PRIMARY KEY,
  group_id TEXT,
  group_name TEXT NOT NULL,
  issue TEXT NOT NULL,
  deadline TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('danger', 'warning', 'info')),
  resolved INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
);

-- Showcase Projects
CREATE TABLE IF NOT EXISTS showcase_projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tag TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  school TEXT NOT NULL,
  image_url TEXT NOT NULL
);

-- Mentor <-> Group Plotting (One-to-Many / Many-to-Many)
CREATE TABLE IF NOT EXISTS mentor_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mentor_id INTEGER NOT NULL,
  group_id TEXT NOT NULL,
  assigned_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (mentor_id, group_id),
  FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- Progress Stages & ACC Status per Group (Tahap 1..6)
CREATE TABLE IF NOT EXISTS progress_stages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id TEXT NOT NULL,
  stage_number INTEGER NOT NULL CHECK (stage_number BETWEEN 1 AND 6),
  title TEXT NOT NULL,
  submission_url TEXT,
  submission_note TEXT,
  acc_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (acc_status IN ('pending', 'submitted', 'approved', 'revision')),
  reviewed_by INTEGER,
  reviewer_note TEXT NOT NULL DEFAULT '',
  reviewed_at TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (group_id, stage_number),
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_members_group_id ON members(group_id);
CREATE INDEX IF NOT EXISTS idx_sprint_tasks_group_id ON sprint_tasks(group_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_group_id ON activity_events(group_id);
CREATE INDEX IF NOT EXISTS idx_mentor_groups_mentor_id ON mentor_groups(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_groups_group_id ON mentor_groups(group_id);
CREATE INDEX IF NOT EXISTS idx_progress_stages_group_id ON progress_stages(group_id);
CREATE INDEX IF NOT EXISTS idx_groups_status ON groups(status);
