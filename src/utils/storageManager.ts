import { ApplicantAccount, StudentAccount, NoticeItem, JobApplication } from '../types.ts';

// Known keys used across different versions/deployments to ensure NO user is ever lost
const APPLICANT_STORAGE_KEYS = [
  'actc_permanent_applicants',
  'actc_applicants_v2',
  'actc_applicants_v1',
  'actc_applicants',
  'applicants',
  'actc_users',
  'actc_backup_applicants',
];

const STUDENT_STORAGE_KEYS = [
  'actc_permanent_students',
  'actc_students_v2',
  'actc_students_v1',
  'actc_students',
  'students',
  'actc_backup_students',
];

const JOB_APP_STORAGE_KEYS = [
  'actc_permanent_job_applications',
  'actc_job_applications_v2',
  'actc_job_applications_v1',
  'actc_job_applications',
  'jobApplications',
];

const NOTICE_STORAGE_KEYS = [
  'actc_permanent_notices',
  'actc_notices_v2',
  'actc_notices_v1',
  'actc_notices',
  'notices',
];

const SESSION_STORAGE_KEYS = [
  'actc_permanent_session',
  'actc_session_v2',
  'actc_session',
];

// Helper to normalize phone numbers for deduplication
const cleanPhone = (p?: string): string => {
  if (!p) return '';
  return p.replace(/[^0-9]/g, '');
};

/**
 * Load and deep-merge applicants from ALL possible legacy and current storage keys.
 * User-created accounts and custom passwords are STRICTLY preserved and never overridden.
 */
export const loadPersistentApplicants = (defaultList: ApplicantAccount[]): ApplicantAccount[] => {
  const mergedMap = new Map<string, ApplicantAccount>();

  // 1. First add default applicants
  defaultList.forEach((acc) => {
    const key = acc.phone ? cleanPhone(acc.phone) : String(acc.id);
    mergedMap.set(key, acc);
  });

  // 2. Scan all storage keys and merge user data
  APPLICANT_STORAGE_KEYS.forEach((storageKey) => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((item: ApplicantAccount) => {
            if (item && (item.phone || item.email || item.applicantName || item.id)) {
              const primaryKey = item.phone ? cleanPhone(item.phone) : (item.email?.toLowerCase() || String(item.id));
              
              // If account already exists in map, merge prioritizing user's stored data and password
              if (mergedMap.has(primaryKey)) {
                const existing = mergedMap.get(primaryKey)!;
                mergedMap.set(primaryKey, {
                  ...existing,
                  ...item,
                  // Keep user's custom password if exists
                  password: item.password || existing.password || 'applicantpass',
                  applicantName: item.applicantName || existing.applicantName,
                  isAccountCompleted: item.isAccountCompleted ?? existing.isAccountCompleted,
                  applications: item.applications?.length ? item.applications : existing.applications,
                });
              } else {
                mergedMap.set(primaryKey, item);
              }
            }
          });
        }
      }
    } catch (e) {
      console.warn(`[ACTC Storage] Error reading key ${storageKey}:`, e);
    }
  });

  const result = Array.from(mergedMap.values());

  // Save merged master list back into ALL keys for future resilience
  savePersistentApplicants(result);
  return result;
};

/**
 * Synchronously writes applicant accounts across ALL storage keys so that
 * any website reload, browser update, or code change finds the exact data.
 */
export const savePersistentApplicants = (applicants: ApplicantAccount[]): void => {
  try {
    const payload = JSON.stringify(applicants);
    APPLICANT_STORAGE_KEYS.forEach((key) => {
      try {
        localStorage.setItem(key, payload);
      } catch (err) {
        console.warn(`Failed writing to ${key}:`, err);
      }
    });
  } catch (e) {
    console.error('[ACTC Storage] Error saving applicants:', e);
  }
};

/**
 * Load and deep-merge students across all storage keys.
 */
export const loadPersistentStudents = (defaultList: StudentAccount[]): StudentAccount[] => {
  const mergedMap = new Map<string, StudentAccount>();

  defaultList.forEach((s) => {
    const key = s.rollNo || cleanPhone(s.phone) || String(s.id);
    mergedMap.set(key, s);
  });

  STUDENT_STORAGE_KEYS.forEach((storageKey) => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((item: StudentAccount) => {
            if (item && (item.rollNo || item.phone || item.id)) {
              const key = item.rollNo || cleanPhone(item.phone) || String(item.id);
              if (mergedMap.has(key)) {
                const existing = mergedMap.get(key)!;
                mergedMap.set(key, { ...existing, ...item, password: item.password || existing.password || 'password123' });
              } else {
                mergedMap.set(key, item);
              }
            }
          });
        }
      }
    } catch (e) {
      console.warn(e);
    }
  });

  const result = Array.from(mergedMap.values());
  savePersistentStudents(result);
  return result;
};

export const savePersistentStudents = (students: StudentAccount[]): void => {
  try {
    const payload = JSON.stringify(students);
    STUDENT_STORAGE_KEYS.forEach((key) => {
      try {
        localStorage.setItem(key, payload);
      } catch (err) {
        console.warn(err);
      }
    });
  } catch (e) {
    console.error(e);
  }
};

/**
 * Load and deep-merge job applications across all storage keys.
 */
export const loadPersistentJobApplications = (defaultList: JobApplication[]): JobApplication[] => {
  const mergedMap = new Map<number | string, JobApplication>();

  defaultList.forEach((app) => {
    mergedMap.set(app.id, app);
  });

  JOB_APP_STORAGE_KEYS.forEach((storageKey) => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((item: JobApplication) => {
            if (item && item.id) {
              mergedMap.set(item.id, item);
            }
          });
        }
      }
    } catch (e) {
      console.warn(e);
    }
  });

  const result = Array.from(mergedMap.values());
  savePersistentJobApplications(result);
  return result;
};

export const savePersistentJobApplications = (jobApplications: JobApplication[]): void => {
  try {
    const payload = JSON.stringify(jobApplications);
    JOB_APP_STORAGE_KEYS.forEach((key) => {
      try {
        localStorage.setItem(key, payload);
      } catch (err) {
        console.warn(err);
      }
    });
  } catch (e) {
    console.error(e);
  }
};

/**
 * Load notices across all storage keys.
 */
export const loadPersistentNotices = (defaultList: NoticeItem[]): NoticeItem[] => {
  const mergedMap = new Map<number, NoticeItem>();

  defaultList.forEach((n) => mergedMap.set(n.id, n));

  NOTICE_STORAGE_KEYS.forEach((storageKey) => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((item: NoticeItem) => {
            if (item && item.id) {
              mergedMap.set(item.id, item);
            }
          });
        }
      }
    } catch (e) {
      console.warn(e);
    }
  });

  const result = Array.from(mergedMap.values());
  savePersistentNotices(result);
  return result;
};

export const savePersistentNotices = (notices: NoticeItem[]): void => {
  try {
    const payload = JSON.stringify(notices);
    NOTICE_STORAGE_KEYS.forEach((key) => {
      try {
        localStorage.setItem(key, payload);
      } catch (err) {
        console.warn(err);
      }
    });
  } catch (e) {
    console.error(e);
  }
};

/**
 * Session persistence
 */
export const loadPersistentSession = <T>(fallback: T): T => {
  for (const key of SESSION_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // continue to next key
    }
  }
  return fallback;
};

export const savePersistentSession = (session: Record<string, any>): void => {
  try {
    const payload = JSON.stringify(session);
    SESSION_STORAGE_KEYS.forEach((key) => {
      try {
        localStorage.setItem(key, payload);
      } catch (err) {
        console.warn(err);
      }
    });
  } catch (e) {
    console.error(e);
  }
};

/**
 * Complete Database Backup & Restore Utility
 */
export interface CompleteDatabaseBackup {
  version: string;
  timestamp: string;
  centerName: string;
  applicants: ApplicantAccount[];
  students: StudentAccount[];
  jobApplications: JobApplication[];
  notices: NoticeItem[];
}

export const generateDatabaseBackup = (
  applicants: ApplicantAccount[],
  students: StudentAccount[],
  jobApplications: JobApplication[],
  notices: NoticeItem[]
): CompleteDatabaseBackup => {
  return {
    version: '2026.1',
    timestamp: new Date().toISOString(),
    centerName: 'Asad Computer & Training Center, Bottola, Bhully Bazar, Thakurgaon',
    applicants,
    students,
    jobApplications,
    notices,
  };
};

export const downloadDatabaseBackupFile = (
  applicants: ApplicantAccount[],
  students: StudentAccount[],
  jobApplications: JobApplication[],
  notices: NoticeItem[]
): void => {
  const backup = generateDatabaseBackup(applicants, students, jobApplications, notices);
  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ACTC_Database_Backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const restoreDatabaseFromBackup = (
  backupJson: string
): {
  success: boolean;
  applicants?: ApplicantAccount[];
  students?: StudentAccount[];
  jobApplications?: JobApplication[];
  notices?: NoticeItem[];
  error?: string;
} => {
  try {
    const data = JSON.parse(backupJson);
    if (!data || typeof data !== 'object') {
      return { success: false, error: 'অবৈধ ফাইল ফরম্যাট।' };
    }

    const restoredApplicants = Array.isArray(data.applicants) ? data.applicants : [];
    const restoredStudents = Array.isArray(data.students) ? data.students : [];
    const restoredJobApps = Array.isArray(data.jobApplications) ? data.jobApplications : [];
    const restoredNotices = Array.isArray(data.notices) ? data.notices : [];

    if (restoredApplicants.length > 0) {
      savePersistentApplicants(restoredApplicants);
    }
    if (restoredStudents.length > 0) {
      savePersistentStudents(restoredStudents);
    }
    if (restoredJobApps.length > 0) {
      savePersistentJobApplications(restoredJobApps);
    }
    if (restoredNotices.length > 0) {
      savePersistentNotices(restoredNotices);
    }

    return {
      success: true,
      applicants: restoredApplicants,
      students: restoredStudents,
      jobApplications: restoredJobApps,
      notices: restoredNotices,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'ব্যাকআপ ফাইল পড়তে ব্যর্থ হয়েছে।' };
  }
};
