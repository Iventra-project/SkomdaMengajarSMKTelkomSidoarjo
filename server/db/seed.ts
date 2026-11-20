import {
  activityFeed,
  groupsData,
  initialMembersKelompok03,
  initialSprintTasks,
  showcaseProjects,
  urgentAlerts,
} from '../../src/data/mockData.ts';
import { hashPassword } from '../auth.ts';
import { getDatabasePath, getDb } from './index.ts';

const STAGE_TITLES = [
  'Bentuk Tim Relawan',
  'Pilih & Tetapkan Ketua',
  'Susun Modul & Materi',
  'Siapkan Desain & Banner',
  'Mengajar di SMP Mitra',
  'Laporan Akhir & Evaluasi',
];

function mapStepToAccStatus(stepVal: string): 'pending' | 'submitted' | 'approved' | 'revision' {
  if (stepVal === 'done') return 'approved';
  if (stepVal === 'review') return 'submitted';
  if (stepVal === 'revisi' || stepVal === 'revision') return 'revision';
  return 'pending';
}

/**
 * Ensures initial RBAC mentor accounts, mentor_groups plotting, and progress_stages exist.
 */
export function ensureRbacSeedData(): void {
  const db = getDb();

  const mentorInsert = db.prepare(`
    INSERT OR IGNORE INTO users (name, email, password_hash, role, group_number, school_name)
    VALUES (?, ?, ?, 'mentor', NULL, 'SMK Telkom Sidoarjo')
  `);
  mentorInsert.run('Dra. Sri Wahyuni, M.Pd', 'sri.wahyuni@smktelkom-sda.sch.id', hashPassword('Skomda2026!'));
  mentorInsert.run('Budi Hartono, S.Kom', 'budi.hartono@smktelkom-sda.sch.id', hashPassword('Skomda2026!'));

  // Ensure canonical admin email also exists
  db.prepare(`
    INSERT OR IGNORE INTO users (name, email, password_hash, role, group_number, school_name)
    VALUES ('Admin Kurikulum', 'admin@smktelkom-sda.sch.id', ?, 'admin', NULL, 'SMK Telkom Sidoarjo')
  `).run(hashPassword('Skomda2026!'));

  const mentorGroupCount = db.prepare('SELECT COUNT(*) as count FROM mentor_groups').get() as { count: number };
  if (mentorGroupCount.count === 0) {
    const sri = db
      .prepare(`SELECT id FROM users WHERE lower(email) = 'sri.wahyuni@smktelkom-sda.sch.id' AND role = 'mentor'`)
      .get() as { id: number } | undefined;
    const budi = db
      .prepare(`SELECT id FROM users WHERE lower(email) = 'budi.hartono@smktelkom-sda.sch.id' AND role = 'mentor'`)
      .get() as { id: number } | undefined;

    const plotStmt = db.prepare('INSERT OR IGNORE INTO mentor_groups (mentor_id, group_id) VALUES (?, ?)');
    if (sri) {
      for (const gid of ['01', '02', '03', '04']) {
        plotStmt.run(sri.id, gid);
      }
    }
    if (budi) {
      for (const gid of ['05', '06', '07', '08']) {
        plotStmt.run(budi.id, gid);
      }
    }
  }

  const stagesCount = db.prepare('SELECT COUNT(*) as count FROM progress_stages').get() as { count: number };
  if (stagesCount.count === 0) {
    const insertStage = db.prepare(`
      INSERT OR IGNORE INTO progress_stages (
        group_id, stage_number, title, submission_url, submission_note, acc_status, reviewer_note
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const group of groupsData) {
      const stepsArr = [
        group.steps.step1,
        group.steps.step2,
        group.steps.step3,
        group.steps.step4,
        group.steps.step5,
        group.steps.step6,
      ];
      for (let i = 0; i < 6; i++) {
        const stgNum = i + 1;
        const accStatus = mapStepToAccStatus(stepsArr[i]);
        const subUrl =
          accStatus === 'approved' || accStatus === 'submitted' || accStatus === 'revision'
            ? `https://drive.google.com/skomda/kel-${group.number}/tahap-0${stgNum}.pdf`
            : null;
        const subNote =
          accStatus === 'submitted'
            ? `Berkas Tahap 0${stgNum} siap ditinjau oleh Guru Pembimbing.`
            : accStatus === 'approved'
              ? `Diselesaikan oleh Kelompok ${group.number}.`
              : '';
        const revNote =
          accStatus === 'approved'
            ? 'Sesuai standar kurikulum Skomda Mengajar.'
            : accStatus === 'revision'
              ? 'Mohon perbaiki format layout sebelum dicetak.'
              : '';
        insertStage.run(group.id, stgNum, STAGE_TITLES[i], subUrl, subNote, accStatus, revNote);
      }
    }
  }
}

/**
 * Seeds the SQLite database with initial project data from src/data/mockData.ts.
 * Skips seeding if data already exists unless `force` is true.
 */
export function seedDatabase(force = false): { seeded: boolean; dbPath: string } {
  const db = getDb();
  const dbPath = getDatabasePath();

  const existingCount = db.prepare('SELECT COUNT(*) as count FROM groups').get() as { count: number };
  if (existingCount.count > 0 && !force) {
    ensureRbacSeedData();
    return { seeded: false, dbPath };
  }

  db.exec('BEGIN');
  try {
    if (force) {
      db.exec(`
        DELETE FROM sessions;
        DELETE FROM progress_stages;
        DELETE FROM mentor_groups;
        DELETE FROM activity_events;
        DELETE FROM urgent_alerts;
        DELETE FROM sprint_tasks;
        DELETE FROM members;
        DELETE FROM showcase_projects;
        DELETE FROM groups;
        DELETE FROM users;
      `);
    }

    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO users (name, email, password_hash, role, group_number, school_name)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertUser.run(
      'Admin Kurikulum',
      'admin@telkomsda.sch.id',
      hashPassword('admin123'),
      'admin',
      null,
      'SMK Telkom Sidoarjo'
    );
    insertUser.run(
      'Raffi Akbar Pratama',
      'raffi.01@telkomsda.sch.id',
      hashPassword('user123'),
      'user',
      '01',
      'SMPN 1 Sidoarjo'
    );
    insertUser.run(
      'Nabila Putri Ramadhani',
      'nabila.03@telkomsda.sch.id',
      hashPassword('user123'),
      'user',
      '03',
      'SMPN 1 Buduran'
    );

    const insertGroup = db.prepare(`
      INSERT INTO groups (
        id, number, school_name, school_address, district, leader_name, mentor_name,
        member_count, featured_module, status, status_label, target_date, progress_percent,
        current_step, step1, step2, step3, step4, step5, step6, notes,
        supervisor_memo, show_memo_to_leader
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const defaultMemo =
      'Harap perhatikan penataan sound system aula SMPN 1 Buduran dan pastikan roll banner diletakkan di samping pintu masuk lab komputer.';

    for (const group of groupsData) {
      insertGroup.run(
        group.id,
        group.number,
        group.schoolName,
        group.schoolAddress,
        group.district,
        group.leaderName,
        group.mentorName,
        group.memberCount,
        group.featuredModule,
        group.status,
        group.statusLabel,
        group.targetDate,
        group.progressPercent,
        group.currentStep,
        group.steps.step1,
        group.steps.step2,
        group.steps.step3,
        group.steps.step4,
        group.steps.step5,
        group.steps.step6,
        group.notes ?? null,
        group.id === '03' ? defaultMemo : '',
        group.id === '03' ? 1 : 0
      );
    }

    const insertMember = db.prepare(`
      INSERT INTO members (id, group_id, name, role, instagram_url, status, initials)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const member of initialMembersKelompok03) {
      insertMember.run(
        member.id,
        '03',
        member.name,
        member.role,
        member.instagramUrl ?? null,
        member.status,
        member.initials
      );
    }

    const insertTask = db.prepare(`
      INSERT INTO sprint_tasks (
        id, group_id, title, column_name, priority, assignee, assignee_initials, due_date, subtext, is_overdue
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const task of initialSprintTasks) {
      insertTask.run(
        task.id,
        '03',
        task.title,
        task.column,
        task.priority ?? null,
        task.assignee,
        task.assigneeInitials,
        task.dueDate,
        task.subtext,
        task.isOverdue ? 1 : 0
      );
    }

    // Seed isolated members & sprint tasks for all other groups (01, 02, 04..14)
    for (const group of groupsData) {
      if (group.id === '03') continue;
      const leaderInitials = group.leaderName
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0] || '')
        .join('')
        .toUpperCase();

      insertMember.run(
        '01',
        group.id,
        group.leaderName,
        'Ketua Regu',
        `instagram.com/p/C3Kel${group.id}01`,
        'valid',
        leaderInitials
      );

      for (let i = 1; i < initialMembersKelompok03.length; i++) {
        const tmpl = initialMembersKelompok03[i];
        insertMember.run(
          tmpl.id,
          group.id,
          tmpl.name,
          tmpl.role,
          tmpl.instagramUrl ?? null,
          tmpl.status,
          tmpl.initials
        );
      }

      insertTask.run(
        `task-${group.id}-1`,
        group.id,
        `Finalisasi X-Banner & materi modul ${group.schoolName}`,
        'todo',
        'high',
        group.leaderName,
        leaderInitials,
        group.targetDate.slice(0, 6),
        'Menunggu acc kurikulum',
        0
      );
      insertTask.run(
        `task-${group.id}-2`,
        group.id,
        `Verifikasi feed Instagram anggota Kelompok ${group.number}`,
        'in_progress',
        'medium',
        group.leaderName,
        leaderInitials,
        group.targetDate.slice(0, 6),
        `Target sekolah: ${group.schoolName}`,
        0
      );
      insertTask.run(
        `task-${group.id}-3`,
        group.id,
        `Survei lokasi & ruang kelas ${group.schoolName}`,
        'done',
        'low',
        group.leaderName,
        leaderInitials,
        '08 Feb',
        '08 Feb 2026 · Arsip tersimpan',
        0
      );
    }

    const insertActivity = db.prepare(`
      INSERT INTO activity_events (id, group_id, title, subtitle, time_ago, author)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const event of activityFeed) {
      insertActivity.run(event.id, event.groupId, event.title, event.subtitle, event.timeAgo, event.author);
    }

    const alertGroupMap: Record<string, string> = {
      '1': '07',
      '2': '09',
      '3': '03',
      '4': '06',
      '5': '05',
    };
    const insertAlert = db.prepare(`
      INSERT INTO urgent_alerts (id, group_id, group_name, issue, deadline, severity)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const alert of urgentAlerts) {
      insertAlert.run(
        alert.id,
        alertGroupMap[alert.id] ?? null,
        alert.groupName,
        alert.issue,
        alert.deadline,
        alert.severity
      );
    }

    const insertShowcase = db.prepare(`
      INSERT INTO showcase_projects (tag, title, description, school, image_url)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const project of showcaseProjects) {
      insertShowcase.run(project.tag, project.title, project.desc, project.school, project.image);
    }

    db.exec('COMMIT');
    ensureRbacSeedData();
    return { seeded: true, dbPath };
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

// Run directly when executed via CLI: `tsx server/db/seed.ts [--force]`
const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
if (isMain) {
  const force = process.argv.includes('--force');
  const result = seedDatabase(force);
  if (result.seeded) {
    console.log(`SQLite database initialized & seeded at: ${result.dbPath}`);
  } else {
    console.log(`SQLite database already seeded at: ${result.dbPath} (use --force to reseed)`);
  }
}
