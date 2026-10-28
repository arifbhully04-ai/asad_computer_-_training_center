import { ApplicantAccount, StudentAccount, NoticeItem, JobApplication, PasswordResetRequest, StudentTestimonial, AdminCredentials, WebsiteSeoConfig } from '../types.ts';

// Known keys used across different versions/deployments to ensure NO user is ever lost
const SEO_CONFIG_STORAGE_KEYS = [
  'actc_permanent_seo_config',
  'actc_seo_config_v2',
  'actc_seo_config_v1',
  'actc_seo_config',
];

const ADMIN_CREDENTIALS_STORAGE_KEYS = [
  'actc_permanent_admin_credentials',
  'actc_admin_credentials_v2',
  'actc_admin_credentials_v1',
  'actc_admin_credentials',
];

const PASSWORD_REQUEST_STORAGE_KEYS = [
  'actc_permanent_password_requests',
  'actc_password_requests',
];

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

const TESTIMONIAL_STORAGE_KEYS = [
  'actc_permanent_testimonials',
  'actc_testimonials_v2',
  'actc_testimonials_v1',
  'actc_testimonials',
];

const SESSION_STORAGE_KEYS = [
  'actc_permanent_session',
  'actc_session_v2',
  'actc_session',
];

// Helper to normalize phone numbers for deduplication and matching
const cleanPhone = (p?: string): string => {
  if (!p) return '';
  let digits = p.replace(/[^0-9]/g, '');
  if (digits.startsWith('880')) {
    digits = digits.slice(2);
  }
  return digits;
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
 * Preserves user-created passwords and accounts permanently across all updates and reloads.
 */
export const loadPersistentStudents = (defaultList: StudentAccount[]): StudentAccount[] => {
  const mergedMap = new Map<string, StudentAccount>();

  defaultList.forEach((s) => {
    const key = cleanPhone(s.phone) || (s.rollNo ? s.rollNo.toLowerCase() : String(s.id));
    mergedMap.set(key, s);
  });

  STUDENT_STORAGE_KEYS.forEach((storageKey) => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((item: StudentAccount) => {
            if (item && (item.phone || item.rollNo || item.id)) {
              const phoneKey = cleanPhone(item.phone);
              const rollKey = item.rollNo ? item.rollNo.toLowerCase() : '';
              
              // Find if already keyed either by phone or roll
              let matchKey = '';
              if (phoneKey && mergedMap.has(phoneKey)) {
                matchKey = phoneKey;
              } else if (rollKey && mergedMap.has(rollKey)) {
                matchKey = rollKey;
              } else {
                matchKey = phoneKey || rollKey || String(item.id);
              }

              if (mergedMap.has(matchKey)) {
                const existing = mergedMap.get(matchKey)!;
                mergedMap.set(matchKey, {
                  ...existing,
                  ...item,
                  // STRICTLY keep user's created password
                  password: item.password || existing.password || 'password123',
                  name: item.name || existing.name,
                  course: item.course || existing.course,
                  batch: item.batch || existing.batch,
                  status: item.status || existing.status,
                });
              } else {
                mergedMap.set(matchKey, item);
              }
            }
          });
        }
      }
    } catch (e) {
      console.warn('[ACTC Storage] Error reading students from key', storageKey, e);
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
 * Load and save Password Reset Requests
 */
export const loadPersistentPasswordRequests = (): PasswordResetRequest[] => {
  const requestsMap = new Map<number, PasswordResetRequest>();
  PASSWORD_REQUEST_STORAGE_KEYS.forEach((key) => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((req: PasswordResetRequest) => {
            if (req && req.id) {
              requestsMap.set(req.id, req);
            }
          });
        }
      }
    } catch (e) {
      console.warn(`[ACTC Storage] Error reading key ${key}:`, e);
    }
  });

  return Array.from(requestsMap.values()).sort((a, b) => b.id - a.id);
};

export const savePersistentPasswordRequests = (requests: PasswordResetRequest[]): void => {
  try {
    const payload = JSON.stringify(requests);
    PASSWORD_REQUEST_STORAGE_KEYS.forEach((key) => {
      try {
        localStorage.setItem(key, payload);
      } catch (err) {
        console.warn(`[ACTC Storage] Error saving key ${key}:`, err);
      }
    });
  } catch (e) {
    console.error('[ACTC Storage] Failed to serialize password requests:', e);
  }
};

/**
 * Default Student Testimonials (Success Stories)
 */
export const DEFAULT_TESTIMONIALS: StudentTestimonial[] = [
  {
    id: 1,
    nameBn: 'মোঃ জাহিদ হাসান',
    nameEn: 'Md. Zahid Hasan',
    courseBn: 'কম্পিউটার অফিস অ্যাপ্লিকেশন (৬ মাস মেয়াদী)',
    courseEn: 'Computer Office Application (6 Months)',
    batchBn: 'ব্যাচ-২৮ (সকাল ব্যাচ)',
    batchEn: 'Batch-28 (Morning Shift)',
    roleBn: 'অফিস সহকারী কাম কম্পিউটার মুদ্রাক্ষরিক',
    roleEn: 'Office Assistant cum Computer Typist',
    workplaceBn: 'জেলা প্রশাসকের কার্যালয় (DC Office), ঠাকুরগাঁও',
    workplaceEn: 'Deputy Commissioner\'s Office, Thakurgaon',
    storyBn: 'আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টারের বাস্তবভিত্তিক ল্যাব ও দ্রুত টাইপিং অনুশীলনের ফলেই সরকারি চাকরির কম্পিউটার টেস্টে আমি সহজে প্রথম স্থান অধিকার করে চাকরি পেয়েছি। এখানকার ডাক বিভাগ অনুমোদিত সনদ সর্বত্র বিশ্বস্ত।',
    storyEn: 'Thanks to the practical lab sessions and intensive typing speed training at Asad Computer & Training Center, I easily qualified top in the practical examination for the DC Office. Their Post Office affiliated certification carries highest trust.',
    rating: 5,
    isFeatured: true,
  },
  {
    id: 2,
    nameBn: 'নুসরাত জাহান লিমা',
    nameEn: 'Nusrat Jahan Lima',
    courseBn: 'কম্পিউটার অফিস অ্যাপ্লিকেশন (৩ মাস মেয়াদী)',
    courseEn: 'Computer Office Application (3 Months)',
    batchBn: 'ব্যাচ-৩১ (বিকাল ব্যাচ)',
    batchEn: 'Batch-31 (Evening Shift)',
    roleBn: 'ডাটা এন্ট্রি স্পেশালিস্ট ও ফ্রিল্যান্সার',
    roleEn: 'Data Entry Specialist & Freelancer',
    workplaceBn: 'অনলাইন মার্কেটপ্লেস ও স্থানীয় প্রতিষ্ঠান',
    workplaceEn: 'Online Marketplaces & Local Enterprise',
    storyBn: 'এখানে এমএস ওয়ার্ড, অ্যাডভান্সড এক্সেল এবং বাংলা-ইংরেজি দ্রুত টাইপিং শিখেছি। প্রশিক্ষকদের আন্তরিক সহায়তা আমাকে আত্মবিশ্বাসী করেছে। এখন ঘরে বসেই বিভিন্ন ডিজিটাল কাজ করে স্বাবলম্বী হতে পেরেছি।',
    storyEn: 'I mastered MS Word, advanced Excel, and bilingual high-speed typing here. The instructors were patient and dedicated. Today I can confidently complete freelance data entry assignments and contribute financially from home.',
    rating: 5,
    isFeatured: true,
  },
  {
    id: 3,
    nameBn: 'মোঃ রাসেল রানা',
    nameEn: 'Md. Rasel Rana',
    courseBn: 'কম্পিউটার অফিস অ্যাপ্লিকেশন ও ডিজিটাল সেবা',
    courseEn: 'Computer Office Application & E-Services',
    batchBn: 'ব্যাচ-২৫ (বিশেষ শুক্রবার ব্যাচ)',
    batchEn: 'Batch-25 (Special Friday Batch)',
    roleBn: 'উদ্যোক্তা ও ডিজিটাল সেন্টার পরিচালক',
    roleEn: 'Entrepreneur & Digital Center Lead',
    workplaceBn: 'ডিজিটাল সেবা পয়েন্ট, ভুল্লী',
    workplaceEn: 'Digital Service Point, Bhully',
    storyBn: 'কম্পিউটার কোর্সের পাশাপাশি জমিজমার ই-নামজারি, খতিয়ান এবং চাকরির অনলাইন আবেদনের বাস্তব কাজ শিখে আমি নিজেই একটি সেবা কেন্দ্র পরিচালনা করছি। আসাদ স্যারের সার্বক্ষণিক দিকনির্দেশনা আমার জীবনের বড় শক্তি।',
    storyEn: 'Alongside computer skills, I learned real digital land services, e-mutation, porcha, and job application processing. Today I successfully run my own digital service outlet. Asad Sir\'s guidance is my greatest asset.',
    rating: 5,
    isFeatured: true,
  },
  {
    id: 4,
    nameBn: 'ফারজানা আক্তার',
    nameEn: 'Farzana Akter',
    courseBn: 'কম্পিউটার অফিস অ্যাপ্লিকেশন (৬ মাস মেয়াদী)',
    courseEn: 'Computer Office Application (6 Months)',
    batchBn: 'ব্যাচ-২৯ (সকাল ব্যাচ)',
    batchEn: 'Batch-29 (Morning Shift)',
    roleBn: 'হিসাব সহকারী ও কম্পিউটার অপারেটর',
    roleEn: 'Accounts Assistant & Computer Operator',
    workplaceBn: 'বেসরকারি উন্নয়ন সংস্থা (এনজিও), ঠাকুরগাঁও',
    workplaceEn: 'Non-Government Organization, Thakurgaon',
    storyBn: 'এক্সেল শীটের ফর্মুলা, পে-রোল হিসাব এবং এক্সেস ডাটাবেজের প্রশিক্ষণ সরাসরি আমার ইন্টারভিউতে কাজে লেগেছিল। মেয়েদের জন্য এখানকার শিক্ষার পরিবেশ অত্যন্ত নিরাপদ ও উৎসাহব্যঞ্জক।',
    storyEn: 'Excel formulas, payroll calculations, and database management taught here were directly tested in my job interview. The learning environment for female students is completely safe, modern, and inspiring.',
    rating: 5,
    isFeatured: true,
  },
];

/**
 * Load testimonials across storage keys.
 */
export const loadPersistentTestimonials = (defaultList: StudentTestimonial[] = DEFAULT_TESTIMONIALS): StudentTestimonial[] => {
  const mergedMap = new Map<number, StudentTestimonial>();

  defaultList.forEach((t) => mergedMap.set(t.id, t));

  TESTIMONIAL_STORAGE_KEYS.forEach((storageKey) => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((item: StudentTestimonial) => {
            if (item && item.id) {
              mergedMap.set(item.id, item);
            }
          });
        }
      }
    } catch (e) {
      console.warn('[ACTC Storage] Error reading testimonials from', storageKey, e);
    }
  });

  const result = Array.from(mergedMap.values());
  savePersistentTestimonials(result);
  return result;
};

export const savePersistentTestimonials = (testimonials: StudentTestimonial[]): void => {
  try {
    const payload = JSON.stringify(testimonials);
    TESTIMONIAL_STORAGE_KEYS.forEach((key) => {
      try {
        localStorage.setItem(key, payload);
      } catch (err) {
        console.warn(err);
      }
    });
  } catch (e) {
    console.error('[ACTC Storage] Error saving testimonials:', e);
  }
};

/**
 * Admin Credentials Storage & Persistence
 * Allows administrator to change username/ID and password from the Admin Panel
 */
export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  password: 'admin123',
  updatedAt: '2026-01-01T00:00:00.000Z',
  adminName: 'Md. Asaduzzaman',
};

export const loadPersistentAdminCredentials = (): AdminCredentials => {
  for (const storageKey of ADMIN_CREDENTIALS_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.username && parsed.password) {
          return {
            username: String(parsed.username).trim(),
            password: String(parsed.password),
            updatedAt: parsed.updatedAt || new Date().toISOString(),
            adminName: parsed.adminName || 'Md. Asaduzzaman',
          };
        }
      }
    } catch (e) {
      // Continue to next key
    }
  }
  return DEFAULT_ADMIN_CREDENTIALS;
};

export const savePersistentAdminCredentials = (creds: AdminCredentials): void => {
  try {
    const payload = JSON.stringify(creds);
    ADMIN_CREDENTIALS_STORAGE_KEYS.forEach((storageKey) => {
      try {
        localStorage.setItem(storageKey, payload);
      } catch (err) {
        console.warn(err);
      }
    });
  } catch (e) {
    console.error('[ACTC Storage] Error saving admin credentials:', e);
  }
};

/**
 * Website Dynamic SEO, Meta Tags, OpenGraph & Structured Data
 */
export const DEFAULT_SEO_CONFIG: WebsiteSeoConfig = {
  metaTitle: 'Asad Computer & Training Center - Computer Office Application & Online Services',
  metaDescription: 'Asad Computer & Training Center offers certified Computer Office Application training under Bangladesh Post Office and complete digital land & online e-services in Bottola, Bhully Bazar, Thakurgaon.',
  metaKeywords: 'computer training, computer office application, bangladesh post office computer certificate, online services, digital land services, e-mutation, khatian, job application, admit card, thakurgaon computer training, bhully bazar, asad computer',
  author: 'Md. Asaduzzaman',
  ogTitle: 'Asad Computer & Training Center',
  ogDescription: 'Certified Computer Training & Complete Digital Land / Online Application Services in Bottola, Bhully Bazar, Thakurgaon.',
  canonicalUrl: 'https://asadcomputer.com',
  robots: 'index, follow',
  lastUpdated: '2026-01-01T00:00:00.000Z',
};

/**
 * Apply SEO metadata, OpenGraph cards, Twitter cards, and Schema.org JSON-LD dynamically to DOM
 */
export const applyWebsiteSeo = (config: WebsiteSeoConfig): void => {
  if (typeof document === 'undefined') return;

  // 1. Page Title
  if (config.metaTitle) {
    document.title = config.metaTitle;
  }

  // 2. Helper to set or create meta tag
  const setMeta = (nameAttr: 'name' | 'property', attrValue: string, content: string) => {
    let el = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(nameAttr, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Standard Meta Tags
  if (config.metaDescription) {
    setMeta('name', 'description', config.metaDescription);
  }
  if (config.metaKeywords) {
    setMeta('name', 'keywords', config.metaKeywords);
  }
  if (config.author) {
    setMeta('name', 'author', config.author);
  }
  setMeta('name', 'robots', config.robots || 'index, follow');

  // OpenGraph Tags
  setMeta('property', 'og:title', config.ogTitle || config.metaTitle);
  setMeta('property', 'og:description', config.ogDescription || config.metaDescription);
  setMeta('property', 'og:type', 'website');
  if (config.canonicalUrl) {
    setMeta('property', 'og:url', config.canonicalUrl);
  }
  const logoUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/assets/aistudio/8fee6d14-342b-408c-880a-68e307e04b81_f55db718.jfif`
    : 'https://asadcomputer.com/assets/aistudio/8fee6d14-342b-408c-880a-68e307e04b81_f55db718.jfif';
  setMeta('property', 'og:image', logoUrl);

  // Twitter Cards
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', config.ogTitle || config.metaTitle);
  setMeta('name', 'twitter:description', config.ogDescription || config.metaDescription);
  setMeta('name', 'twitter:image', logoUrl);

  // Favicon Links
  let iconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
  if (!iconLink) {
    iconLink = document.createElement('link');
    iconLink.setAttribute('rel', 'icon');
    document.head.appendChild(iconLink);
  }
  iconLink.setAttribute('href', '/assets/aistudio/8fee6d14-342b-408c-880a-68e307e04b81_f55db718.jfif');

  let appleIconLink = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement | null;
  if (!appleIconLink) {
    appleIconLink = document.createElement('link');
    appleIconLink.setAttribute('rel', 'apple-touch-icon');
    document.head.appendChild(appleIconLink);
  }
  appleIconLink.setAttribute('href', '/assets/aistudio/8fee6d14-342b-408c-880a-68e307e04b81_f55db718.jfif');

  // Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', config.canonicalUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://asadcomputer.com'));

  // Schema.org Structured Data (JSON-LD)
  let scriptLd = document.getElementById('actc-json-ld');
  if (!scriptLd) {
    scriptLd = document.createElement('script');
    scriptLd.id = 'actc-json-ld';
    scriptLd.setAttribute('type', 'application/ld+json');
    document.head.appendChild(scriptLd);
  }
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Asad Computer & Training Center',
    alternateName: 'আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টার',
    url: config.canonicalUrl || 'https://asadcomputer.com',
    logo: logoUrl,
    image: logoUrl,
    description: config.metaDescription,
    telephone: '+8801773733654',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bottola, Bhully Bazar',
      addressLocality: 'Thakurgaon',
      postalCode: '5100',
      addressCountry: 'BD',
    },
    founder: {
      '@type': 'Person',
      name: config.author || 'Md. Asaduzzaman',
      jobTitle: 'Director',
      telephone: '+8801773733654',
    },
    educationalCredentialAwarded: 'Computer Office Application (3 & 6 Months Certified under Bangladesh Post Office)',
    keywords: config.metaKeywords,
  };
  scriptLd.textContent = JSON.stringify(structuredData);
};

export const loadPersistentSeoConfig = (): WebsiteSeoConfig => {
  for (const storageKey of SEO_CONFIG_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.metaTitle && parsed.metaDescription) {
          return {
            metaTitle: String(parsed.metaTitle),
            metaDescription: String(parsed.metaDescription),
            metaKeywords: String(parsed.metaKeywords || DEFAULT_SEO_CONFIG.metaKeywords),
            author: parsed.author || DEFAULT_SEO_CONFIG.author,
            ogTitle: parsed.ogTitle || parsed.metaTitle,
            ogDescription: parsed.ogDescription || parsed.metaDescription,
            canonicalUrl: parsed.canonicalUrl || DEFAULT_SEO_CONFIG.canonicalUrl,
            robots: parsed.robots || DEFAULT_SEO_CONFIG.robots,
            lastUpdated: parsed.lastUpdated || new Date().toISOString(),
          };
        }
      }
    } catch (e) {
      // Continue
    }
  }
  return DEFAULT_SEO_CONFIG;
};

export const savePersistentSeoConfig = (config: WebsiteSeoConfig): void => {
  try {
    const payload = JSON.stringify(config);
    SEO_CONFIG_STORAGE_KEYS.forEach((storageKey) => {
      try {
        localStorage.setItem(storageKey, payload);
      } catch (err) {
        console.warn(err);
      }
    });
    // Immediately apply changes to active document head
    applyWebsiteSeo(config);
  } catch (e) {
    console.error('[ACTC Storage] Error saving SEO config:', e);
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
  testimonials?: StudentTestimonial[];
  adminCredentials?: AdminCredentials;
  seoConfig?: WebsiteSeoConfig;
}

export const generateDatabaseBackup = (
  applicants: ApplicantAccount[],
  students: StudentAccount[],
  jobApplications: JobApplication[],
  notices: NoticeItem[],
  testimonials?: StudentTestimonial[],
  adminCredentials?: AdminCredentials,
  seoConfig?: WebsiteSeoConfig
): CompleteDatabaseBackup => {
  return {
    version: '2026.1',
    timestamp: new Date().toISOString(),
    centerName: 'Asad Computer & Training Center, Bottola, Bhully Bazar, Thakurgaon',
    applicants,
    students,
    jobApplications,
    notices,
    testimonials: testimonials || loadPersistentTestimonials(),
    adminCredentials: adminCredentials || loadPersistentAdminCredentials(),
    seoConfig: seoConfig || loadPersistentSeoConfig(),
  };
};

export const downloadDatabaseBackupFile = (
  applicants: ApplicantAccount[],
  students: StudentAccount[],
  jobApplications: JobApplication[],
  notices: NoticeItem[],
  testimonials?: StudentTestimonial[],
  adminCredentials?: AdminCredentials,
  seoConfig?: WebsiteSeoConfig
): void => {
  const backup = generateDatabaseBackup(applicants, students, jobApplications, notices, testimonials, adminCredentials, seoConfig);
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
  testimonials?: StudentTestimonial[];
  adminCredentials?: AdminCredentials;
  seoConfig?: WebsiteSeoConfig;
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
    const restoredTestimonials = Array.isArray(data.testimonials) ? data.testimonials : [];
    const restoredAdminCreds = data.adminCredentials && data.adminCredentials.username && data.adminCredentials.password ? data.adminCredentials : undefined;
    const restoredSeo = data.seoConfig && data.seoConfig.metaTitle ? data.seoConfig : undefined;

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
    if (restoredTestimonials.length > 0) {
      savePersistentTestimonials(restoredTestimonials);
    }
    if (restoredAdminCreds) {
      savePersistentAdminCredentials(restoredAdminCreds);
    }
    if (restoredSeo) {
      savePersistentSeoConfig(restoredSeo);
    }

    return {
      success: true,
      applicants: restoredApplicants,
      students: restoredStudents,
      jobApplications: restoredJobApps,
      notices: restoredNotices,
      testimonials: restoredTestimonials,
      adminCredentials: restoredAdminCreds,
      seoConfig: restoredSeo,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || 'ব্যাকআপ ফাইল পড়তে ব্যর্থ হয়েছে।' };
  }
};
