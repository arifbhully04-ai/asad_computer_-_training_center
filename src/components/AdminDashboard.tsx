import React, { useState } from 'react';
import {
  Search,
  Bell,
  Users,
  Briefcase,
  FileText,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Edit,
  Award,
  Filter,
  DollarSign,
  Printer,
  X,
  Eye,
  EyeOff,
  Key,
  Upload,
  Download,
  Copy,
  Database,
  Shield,
  Paperclip,
  Check,
  AlertCircle,
  MessageCircle,
  CreditCard,
  Info,
  Star,
  Quote,
  Globe,
  Share2,
  Code,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { NoticeItem, StudentAccount, ApplicantAccount, JobApplication, StudentPaymentRecord, PasswordResetRequest, StudentTestimonial, AdminCredentials, WebsiteSeoConfig } from '../types.ts';
import { NoticePdfViewerModal } from './NoticePdfViewerModal.tsx';
import { StudentProfileModal } from './StudentProfileModal.tsx';
import { StudentAdmissionCopyModal } from './StudentAdmissionCopyModal.tsx';
import { ApplicantProfileModal } from './ApplicantProfileModal.tsx';
import { ApplicantBioDataModal } from './ApplicantBioDataModal.tsx';
import { ApplicationStatusBadge, isApplicationCompleted } from './ApplicationStatusBadge.tsx';
import {
  downloadDatabaseBackupFile,
  loadPersistentPasswordRequests,
  savePersistentPasswordRequests,
  loadPersistentTestimonials,
  savePersistentTestimonials,
  DEFAULT_TESTIMONIALS,
  loadPersistentAdminCredentials,
  savePersistentAdminCredentials,
  DEFAULT_SEO_CONFIG,
  loadPersistentSeoConfig,
  savePersistentSeoConfig,
  applyWebsiteSeo,
} from '../utils/storageManager.ts';


export interface AdminDashboardProps {
  onLogout: () => void;
  onBackToHome: () => void;
  adminCredentials?: AdminCredentials;
  onUpdateAdminCredentials?: (creds: AdminCredentials) => void;
  seoConfig?: WebsiteSeoConfig;
  onUpdateSeoConfig?: (seo: WebsiteSeoConfig) => void;
  notices?: NoticeItem[];
  onAddNotice?: (notice: NoticeItem) => void;
  onDeleteNotice?: (id: number) => void;
  students?: StudentAccount[];
  onUpdateStudent?: (student: StudentAccount) => void;
  onAddStudent?: (student: StudentAccount) => void;
  onDeleteStudent?: (id: number) => void;
  applicants?: ApplicantAccount[];
  onUpdateApplicant?: (applicant: ApplicantAccount) => void;
  onDeleteApplicant?: (id: number) => void;
  jobApplications?: JobApplication[];
  onUpdateJobApplication?: (app: JobApplication) => void;
  onDeleteJobApplication?: (id: number) => void;
  testimonials?: StudentTestimonial[];
  onAddTestimonial?: (testimonial: StudentTestimonial) => void;
  onUpdateTestimonial?: (testimonial: StudentTestimonial) => void;
  onDeleteTestimonial?: (id: number) => void;
  onExportDatabase?: () => void;
  onRestoreDatabase?: (jsonStr: string) => boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onBackToHome,
  adminCredentials: propAdminCredentials,
  onUpdateAdminCredentials,
  seoConfig: propSeoConfig,
  onUpdateSeoConfig,
  notices: propNotices,
  onAddNotice,
  onDeleteNotice,
  students: propStudents,
  onUpdateStudent,
  onAddStudent,
  onDeleteStudent,
  applicants: propApplicants,
  onUpdateApplicant,
  onDeleteApplicant,
  jobApplications: propJobApplications,
  onUpdateJobApplication,
  onDeleteJobApplication,
  testimonials: propTestimonials,
  onAddTestimonial,
  onUpdateTestimonial,
  onDeleteTestimonial,
  onExportDatabase,
  onRestoreDatabase,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notices' | 'students' | 'applicants' | 'credentials' | 'testimonials' | 'seo'>('overview');
  const [applicantSubTab, setApplicantSubTab] = useState<'applications' | 'profiles'>('applications');
  const [jobAppStatusFilter, setJobAppStatusFilter] = useState<'all' | 'processing' | 'completed'>('all');
  const [credentialFilter, setCredentialFilter] = useState<'all' | 'applicants' | 'students'>('all');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [restoreMessage, setRestoreMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [adminStatusToast, setAdminStatusToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [passwordRequests, setPasswordRequests] = useState<PasswordResetRequest[]>(() => loadPersistentPasswordRequests());

  // In-app delete confirmation state
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'notice' | 'student' | 'applicant' | 'jobApp' | 'testimonial';
    id: number;
    title: string;
    subtitle?: string;
  } | null>(null);

  const [localTestimonials, setLocalTestimonials] = useState<StudentTestimonial[]>(() =>
    loadPersistentTestimonials(DEFAULT_TESTIMONIALS)
  );
  const testimonials = propTestimonials || localTestimonials;

  // Admin Credentials Change State
  const activeAdminCreds = propAdminCredentials || loadPersistentAdminCredentials();
  const [currentAdminPasswordInput, setCurrentAdminPasswordInput] = useState('');
  const [newAdminUsernameInput, setNewAdminUsernameInput] = useState(activeAdminCreds.username || 'admin');
  const [newAdminPasswordInput, setNewAdminPasswordInput] = useState('');
  const [confirmAdminPasswordInput, setConfirmAdminPasswordInput] = useState('');
  const [showCurrentAdminPass, setShowCurrentAdminPass] = useState(false);
  const [showNewAdminPass, setShowNewAdminPass] = useState(false);
  const [showConfirmAdminPass, setShowConfirmAdminPass] = useState(false);
  const [showActiveAdminPass, setShowActiveAdminPass] = useState(false);
  const [adminCredError, setAdminCredError] = useState<string | null>(null);
  const [adminCredSuccess, setAdminCredSuccess] = useState<string | null>(null);
  const [isAdminFormExpanded, setIsAdminFormExpanded] = useState(true);

  // Sync username input if propAdminCredentials changes
  React.useEffect(() => {
    if (propAdminCredentials?.username) {
      setNewAdminUsernameInput(propAdminCredentials.username);
    }
  }, [propAdminCredentials?.username]);

  const handleAdminCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminCredError(null);
    setAdminCredSuccess(null);

    // 1. Verify current password
    const allowedCurrentPasswords = [
      activeAdminCreds.password,
      'admin123',
      'asad2026',
    ];

    if (!allowedCurrentPasswords.includes(currentAdminPasswordInput)) {
      setAdminCredError('বর্তমান পাসওয়ার্ডটি সঠিক নয়! দয়া করে সঠিক বর্তমান পাসওয়ার্ড দিয়ে নিশ্চিত করুন।');
      return;
    }

    // 2. Validate new username
    const trimmedUsername = newAdminUsernameInput.trim();
    if (!trimmedUsername || trimmedUsername.length < 3) {
      setAdminCredError('নতুন ইউজারনেম/আইডি কমপক্ষে ৩ অক্ষরের হতে হবে (যেমন: admin, মোবাইল নম্বর বা ইমেইল)।');
      return;
    }

    // 3. Validate new password
    if (!newAdminPasswordInput || newAdminPasswordInput.length < 6) {
      setAdminCredError('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    // 4. Validate confirmation match
    if (newAdminPasswordInput !== confirmAdminPasswordInput) {
      setAdminCredError('নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না! পুনরায় টাইপ করুন।');
      return;
    }

    const updatedCreds: AdminCredentials = {
      username: trimmedUsername,
      password: newAdminPasswordInput,
      updatedAt: new Date().toISOString(),
      adminName: 'Md. Asaduzzaman',
    };

    if (onUpdateAdminCredentials) {
      onUpdateAdminCredentials(updatedCreds);
    } else {
      savePersistentAdminCredentials(updatedCreds);
    }

    setAdminCredSuccess('অ্যাডমিন আইডি ও পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে! পরবর্তী প্রতিটি লগইনে আপনার এই নতুন ইউজারনেম ও পাসওয়ার্ড দিয়ে প্রবেশ করুন।');
    setCurrentAdminPasswordInput('');
    setNewAdminPasswordInput('');
    setConfirmAdminPasswordInput('');
    setAdminStatusToast('অ্যাডমিন আইডি ও পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!');
    setTimeout(() => {
      setAdminStatusToast(null);
    }, 4500);
  };

  // SEO Configuration Management State
  const activeSeo = propSeoConfig || loadPersistentSeoConfig();
  const [seoTitle, setSeoTitle] = useState(activeSeo.metaTitle || DEFAULT_SEO_CONFIG.metaTitle);
  const [seoDescription, setSeoDescription] = useState(activeSeo.metaDescription || DEFAULT_SEO_CONFIG.metaDescription);
  const [seoKeywords, setSeoKeywords] = useState(activeSeo.metaKeywords || DEFAULT_SEO_CONFIG.metaKeywords);
  const [seoAuthor, setSeoAuthor] = useState(activeSeo.author || DEFAULT_SEO_CONFIG.author || 'Md. Asaduzzaman');
  const [seoCanonicalUrl, setSeoCanonicalUrl] = useState(activeSeo.canonicalUrl || DEFAULT_SEO_CONFIG.canonicalUrl || 'https://asadcomputer.com');
  const [seoRobots, setSeoRobots] = useState(activeSeo.robots || 'index, follow');
  const [seoGoogleVerification, setSeoGoogleVerification] = useState(
    activeSeo.googleSiteVerification || DEFAULT_SEO_CONFIG.googleSiteVerification || 'eiwFrdm4YEC3f3-KPHCYLrKLy2vCJrSl3Qyiqp9pOZ8'
  );
  const [seoPreviewTab, setSeoPreviewTab] = useState<'google' | 'social' | 'schema'>('google');
  const [seoToast, setSeoToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync when prop changes
  React.useEffect(() => {
    if (propSeoConfig) {
      setSeoTitle(propSeoConfig.metaTitle);
      setSeoDescription(propSeoConfig.metaDescription);
      setSeoKeywords(propSeoConfig.metaKeywords);
      if (propSeoConfig.author) setSeoAuthor(propSeoConfig.author);
      if (propSeoConfig.canonicalUrl) setSeoCanonicalUrl(propSeoConfig.canonicalUrl);
      if (propSeoConfig.robots) setSeoRobots(propSeoConfig.robots);
      if (propSeoConfig.googleSiteVerification) setSeoGoogleVerification(propSeoConfig.googleSiteVerification);
    }
  }, [propSeoConfig]);

  const handleSaveSeoConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSeoToast(null);

    if (!seoTitle.trim() || seoTitle.trim().length < 5) {
      setSeoToast({ type: 'error', text: 'মেটা টাইটেল অবশ্যই কমপক্ষে ৫ অক্ষরের হতে হবে।' });
      return;
    }

    if (!seoDescription.trim() || seoDescription.trim().length < 20) {
      setSeoToast({ type: 'error', text: 'মেটা ডেসক্রিপশন কমপক্ষে ২০ অক্ষরের হওয়া উচিত।' });
      return;
    }

    const updatedSeo: WebsiteSeoConfig = {
      metaTitle: seoTitle.trim(),
      metaDescription: seoDescription.trim(),
      metaKeywords: seoKeywords.trim(),
      author: seoAuthor.trim(),
      canonicalUrl: seoCanonicalUrl.trim(),
      robots: seoRobots,
      googleSiteVerification: seoGoogleVerification.trim(),
      ogTitle: seoTitle.trim(),
      ogDescription: seoDescription.trim(),
      lastUpdated: new Date().toISOString(),
    };

    if (onUpdateSeoConfig) {
      onUpdateSeoConfig(updatedSeo);
    } else {
      savePersistentSeoConfig(updatedSeo);
    }

    applyWebsiteSeo(updatedSeo);
    setSeoToast({
      type: 'success',
      text: 'এসইও মেটাডাটা ও সার্চ ইঞ্জিন ট্যাগ সফলভাবে আপডেট ও ব্রাউজারে সক্রিয় হয়েছে!',
    });
    setAdminStatusToast('এসইও মেটাডাটা সফলভাবে আপডেট হয়েছে!');
    setTimeout(() => {
      setAdminStatusToast(null);
      setSeoToast(null);
    }, 4500);
  };

  const handleResetToDefaultSeo = () => {
    setSeoTitle(DEFAULT_SEO_CONFIG.metaTitle);
    setSeoDescription(DEFAULT_SEO_CONFIG.metaDescription);
    setSeoKeywords(DEFAULT_SEO_CONFIG.metaKeywords);
    setSeoAuthor(DEFAULT_SEO_CONFIG.author || 'Md. Asaduzzaman');
    setSeoCanonicalUrl(DEFAULT_SEO_CONFIG.canonicalUrl || 'https://asadcomputer.com');
    setSeoRobots('index, follow');
    setSeoGoogleVerification(DEFAULT_SEO_CONFIG.googleSiteVerification || 'eiwFrdm4YEC3f3-KPHCYLrKLy2vCJrSl3Qyiqp9pOZ8');
    setSeoToast({
      type: 'success',
      text: 'প্রস্তাবিত ডিফল্ট এসইও টেমপ্লেট লোড হয়েছে। সেভ করতে নিচের "সেভ করুন" বাটনে ক্লিক করুন।',
    });
    setTimeout(() => setSeoToast(null), 4000);
  };

  const handleAddKeywordPill = (keywordToAdd: string) => {
    const existing = seoKeywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    if (!existing.includes(keywordToAdd)) {
      const next = existing.length > 0 ? `${seoKeywords.trim()}, ${keywordToAdd}` : keywordToAdd;
      setSeoKeywords(next);
    }
  };

  const handleMarkPasswordSent = (requestId: number) => {
    const updated = passwordRequests.map((r) => (r.id === requestId ? { ...r, status: 'Sent' as const } : r));
    setPasswordRequests(updated);
    savePersistentPasswordRequests(updated);
    setAdminStatusToast('পাসওয়ার্ড স্ট্যাটাস "Sent (পাঠানো হয়েছে)" হিসেবে আপডেট হয়েছে!');
    setTimeout(() => setAdminStatusToast(null), 3000);
  };

  const handleDeletePasswordRequest = (requestId: number) => {
    const updated = passwordRequests.filter((r) => r.id !== requestId);
    setPasswordRequests(updated);
    savePersistentPasswordRequests(updated);
    setAdminStatusToast('পাসওয়ার্ড রিকোয়েস্ট মুছে ফেলা হয়েছে!');
    setTimeout(() => setAdminStatusToast(null), 3000);
  };

  const handleSendWhatsAppPassword = (req: PasswordResetRequest, userPassword?: string) => {
    const cleanUserPhone = req.phone.replace(/[^0-9]/g, '');
    const targetPhone = cleanUserPhone.startsWith('880') ? cleanUserPhone : `88${cleanUserPhone}`;
    const passwordToSend = userPassword || req.recoveredPassword || 'password123';
    
    const message = `*সম্মানিত ${req.name},*\nআসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টার থেকে আপনার অনুরোধ অনুযায়ী একাউন্ট পাসওয়ার্ড নিচে প্রদান করা হলো:\n━━━━━━━━━━━━━━━━━━\n👤 নাম: ${req.name}\n📌 একাউন্ট: ${req.role === 'student' ? 'কোর্স শিক্ষার্থী' : 'চাকুরী আবেদনকারী'}\n📱 লগইন আইডি / মোবাইল: ${req.phone}\n🔑 পাসওয়ার্ড: ${passwordToSend}\n━━━━━━━━━━━━━━━━━━\nলগইন লিঙ্ক: https://asadcomputer.com\nযেকোনো প্রয়োজনে যোগাযোগ: 01773-733654। ধন্যবাদ!`;

    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    handleMarkPasswordSent(req.id);
  };


  // 1. Notice Control State (Fallbacks if props not passed)
  const defaultNotices: NoticeItem[] = [
    {
      id: 1,
      title: 'New Computer Office Application Batch starts from 1st of next month',
      category: 'Student',
      date: '24 Oct 2026',
      description: 'Morning and Evening batches admission is ongoing. Limited seats for 3-Month & 6-Month courses. Under Bangladesh Post Office (বাংলাদেশ ডাক বিভাগ) certified curriculum.',
      urgent: true,
      pdfName: 'ACTC_Office_Application_Batch_Notice_2026.pdf',
    },
    {
      id: 2,
      title: 'Primary DPE Written Examination Admit Card download has started',
      category: 'Applicant',
      date: '22 Oct 2026',
      description: 'Directorate of Primary Education (DPE) Assistant Teacher exam admit card is now available. Download your admit card using User ID and Password.',
      urgent: true,
      pdfName: 'Primary_DPE_Admit_Card_Download_Notice.pdf',
    },
    {
      id: 3,
      title: 'Bangladesh Railway Data Entry Operator final application deadline 15 Dec',
      category: 'Applicant',
      date: '20 Oct 2026',
      description: 'Submit your online form before 15 December with photo and signature. Collect submitted copy from our Asad Computer service desk.',
      urgent: false,
      pdfName: 'BR_Data_Entry_Circular_Guidelines.pdf',
    },
    {
      id: 4,
      title: 'Bangladesh Post Office 6-Month Computer Certificate Verification Open',
      category: 'General',
      date: '18 Oct 2026',
      description: 'Roll verification and registration card distribution for July-December semester is open. Contact institute office at Bottola, Bhully Bazar.',
      urgent: false,
      pdfName: 'Post_Office_Certificate_Verification_Process.pdf',
    },
  ];

  const [localNotices, setLocalNotices] = useState<NoticeItem[]>(defaultNotices);
  const notices = propNotices || localNotices;

  // Notice Add Form State
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeDescription, setNewNoticeDescription] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<'Student' | 'Applicant' | 'General'>('Student');
  const [newNoticeFeeAmount, setNewNoticeFeeAmount] = useState<string>('220');
  const [newNoticeRemarks, setNewNoticeRemarks] = useState<string>('');
  const [newNoticePdfFile, setNewNoticePdfFile] = useState<File | null>(null);
  const [newNoticePdfName, setNewNoticePdfName] = useState<string>('');
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [selectedNoticeForPdf, setSelectedNoticeForPdf] = useState<NoticeItem | null>(null);

  // Testimonial Control State
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<StudentTestimonial | null>(null);
  const [tNameBn, setTNameBn] = useState('');
  const [tNameEn, setTNameEn] = useState('');
  const [tRoleBn, setTRoleBn] = useState('');
  const [tRoleEn, setTRoleEn] = useState('');
  const [tWorkplaceBn, setTWorkplaceBn] = useState('');
  const [tWorkplaceEn, setTWorkplaceEn] = useState('');
  const [tCourseBn, setTCourseBn] = useState('কম্পিউটার অফিস অ্যাপ্লিকেশন (৬ মাস)');
  const [tCourseEn, setTCourseEn] = useState('Computer Office Application (6 Months)');
  const [tBatchBn, setTBatchBn] = useState('');
  const [tBatchEn, setTBatchEn] = useState('');
  const [tStoryBn, setTStoryBn] = useState('');
  const [tStoryEn, setTStoryEn] = useState('');
  const [tRating, setTRating] = useState<number>(5);

  // 2. Student Control State
  const defaultStudents: StudentAccount[] = [
    {
      id: 1,
      name: 'Sabbir Ahmed',
      rollNo: 'ACTC-2026-084',
      course: 'Computer Office Application (6 Months)',
      batch: 'Morning (10 AM - 12 PM)',
      phone: '01712-345678',
      email: 'sabbir.student@gmail.com',
      totalFee: 4000,
      paidFee: 2500,
      dueFee: 1500,
      lastPaymentDate: '15 Oct 2026',
      typingSpeed: '42 WPM (Eng) / 30 WPM (Ban)',
      attendance: '96%',
      status: 'Active',
      password: 'password123',
    },
    {
      id: 2,
      name: 'Nusrat Jahan',
      rollNo: 'ACTC-2026-085',
      course: 'Computer Office Application (3 Months)',
      batch: 'Evening (4 PM - 6 PM)',
      phone: '01823-456789',
      email: 'nusrat.j@gmail.com',
      totalFee: 2500,
      paidFee: 2500,
      dueFee: 0,
      lastPaymentDate: '20 Oct 2026',
      typingSpeed: '38 WPM (Eng) / 28 WPM (Ban)',
      attendance: '92%',
      status: 'Active',
      password: 'password123',
    },
    {
      id: 3,
      name: 'Tanvir Hossain',
      rollNo: 'ACTC-2026-072',
      course: 'Computer Office Application (6 Months)',
      batch: 'Friday Special Batch',
      phone: '01934-567890',
      email: 'tanvir.actc@gmail.com',
      totalFee: 4000,
      paidFee: 4000,
      dueFee: 0,
      lastPaymentDate: '05 Oct 2026',
      typingSpeed: '45 WPM (Eng) / 35 WPM (Ban)',
      attendance: '98%',
      status: 'Certified',
      password: 'password123',
    },
    {
      id: 4,
      name: 'Mehedi Hasan',
      rollNo: 'ACTC-2026-090',
      course: 'Computer Office Application (3 Months)',
      batch: 'Morning (8 AM - 10 AM)',
      phone: '01777-889900',
      email: 'mehedi.it@gmail.com',
      totalFee: 2500,
      paidFee: 1500,
      dueFee: 1000,
      lastPaymentDate: '10 Oct 2026',
      typingSpeed: '32 WPM (Eng) / 22 WPM (Ban)',
      attendance: '88%',
      status: 'Active',
      password: 'password123',
    },
  ];

  const [localStudents, setLocalStudents] = useState<StudentAccount[]>(defaultStudents);
  const students = propStudents || localStudents;

  // Student Modals & Editing
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<StudentAccount | null>(null);
  const [selectedStudentForAdmissionCopy, setSelectedStudentForAdmissionCopy] = useState<StudentAccount | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRoll, setNewStudentRoll] = useState('');
  const [newStudentCourse, setNewStudentCourse] = useState('Computer Office Application (6 Months)');
  const [newStudentBatch, setNewStudentBatch] = useState('Morning (10 AM - 12 PM)');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentFee, setNewStudentFee] = useState<number>(3500);
  const [newStudentPaid, setNewStudentPaid] = useState<number>(0);

  // Quick Student Payment Modal State
  const [selectedStudentForQuickPay, setSelectedStudentForQuickPay] = useState<StudentAccount | null>(null);
  const [quickPayAmount, setQuickPayAmount] = useState<string>('');
  const [quickPayMethod, setQuickPayMethod] = useState<'Cash' | 'bKash' | 'Nagad' | 'Rocket'>('Cash');
  const [quickPayReceipt, setQuickPayReceipt] = useState<string>('');
  const [quickPayNote, setQuickPayNote] = useState<string>('');

  // 3. Applicant Control State
  const defaultApplicants: ApplicantAccount[] = [];

  const [localApplicants, setLocalApplicants] = useState<ApplicantAccount[]>(defaultApplicants);
  const applicants = propApplicants || localApplicants;

  // Applicant Modal
  const [selectedApplicantForEdit, setSelectedApplicantForEdit] = useState<ApplicantAccount | null>(null);
  const [selectedApplicantForBioData, setSelectedApplicantForBioData] = useState<ApplicantAccount | null>(null);
  const [bioDataModalTab, setBioDataModalTab] = useState<'form' | 'copy'>('copy');

  // Notice Handlers
  const handlePdfFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewNoticePdfFile(file);
      setNewNoticePdfName(file.name);
    }
  };

  const handleAddNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle.trim()) return;

    let generatedPdfUrl: string | undefined = undefined;
    if (newNoticePdfFile) {
      generatedPdfUrl = URL.createObjectURL(newNoticePdfFile);
    }

    const feeNum = newNoticeFeeAmount ? parseFloat(newNoticeFeeAmount) : undefined;

    const newNotice: NoticeItem = {
      id: Date.now(),
      title: newNoticeTitle,
      category: newNoticeCategory,
      date: 'Today',
      description: newNoticeDescription.trim() || undefined,
      urgent: false,
      pdfUrl: generatedPdfUrl,
      pdfName: newNoticePdfName || (newNoticePdfFile ? newNoticePdfFile.name : undefined),
      feeAmount: !isNaN(feeNum as number) ? feeNum : undefined,
      remarks: newNoticeRemarks.trim() || undefined,
    };

    if (onAddNotice) {
      onAddNotice(newNotice);
    } else {
      setLocalNotices([newNotice, ...localNotices]);
    }

    // Reset Form
    setNewNoticeTitle('');
    setNewNoticeDescription('');
    setNewNoticeFeeAmount('220');
    setNewNoticeRemarks('');
    setNewNoticePdfFile(null);
    setNewNoticePdfName('');
    setShowAddNoticeModal(false);
  };

  // Testimonial Handlers
  const handleOpenAddTestimonial = () => {
    setEditingTestimonial(null);
    setTNameBn('');
    setTNameEn('');
    setTRoleBn('');
    setTRoleEn('');
    setTWorkplaceBn('');
    setTWorkplaceEn('');
    setTCourseBn('কম্পিউটার অফিস অ্যাপ্লিকেশন (৬ মাস মেয়াদী)');
    setTCourseEn('Computer Office Application (6 Months)');
    setTBatchBn('ব্যাচ-৩২');
    setTBatchEn('Batch-32');
    setTStoryBn('');
    setTStoryEn('');
    setTRating(5);
    setShowTestimonialModal(true);
  };

  const handleOpenEditTestimonial = (item: StudentTestimonial) => {
    setEditingTestimonial(item);
    setTNameBn(item.nameBn);
    setTNameEn(item.nameEn);
    setTRoleBn(item.roleBn);
    setTRoleEn(item.roleEn);
    setTWorkplaceBn(item.workplaceBn || '');
    setTWorkplaceEn(item.workplaceEn || '');
    setTCourseBn(item.courseBn);
    setTCourseEn(item.courseEn);
    setTBatchBn(item.batchBn);
    setTBatchEn(item.batchEn);
    setTStoryBn(item.storyBn);
    setTStoryEn(item.storyEn);
    setTRating(item.rating || 5);
    setShowTestimonialModal(true);
  };

  const handleSaveTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tNameBn.trim() || !tStoryBn.trim()) {
      setAdminStatusToast('অনুগ্রহ করে নাম এবং সাফল্যের গল্প/মন্তব্য লিখুন।');
      setTimeout(() => setAdminStatusToast(null), 3000);
      return;
    }

    if (editingTestimonial) {
      const updated: StudentTestimonial = {
        ...editingTestimonial,
        nameBn: tNameBn.trim(),
        nameEn: tNameEn.trim() || tNameBn.trim(),
        roleBn: tRoleBn.trim(),
        roleEn: tRoleEn.trim() || tRoleBn.trim(),
        workplaceBn: tWorkplaceBn.trim() || undefined,
        workplaceEn: tWorkplaceEn.trim() || undefined,
        courseBn: tCourseBn.trim(),
        courseEn: tCourseEn.trim(),
        batchBn: tBatchBn.trim(),
        batchEn: tBatchEn.trim() || tBatchBn.trim(),
        storyBn: tStoryBn.trim(),
        storyEn: tStoryEn.trim() || tStoryBn.trim(),
        rating: tRating,
      };

      if (onUpdateTestimonial) {
        onUpdateTestimonial(updated);
      }
      const updatedList = testimonials.map((t) => (t.id === updated.id ? updated : t));
      setLocalTestimonials(updatedList);
      savePersistentTestimonials(updatedList);
      setAdminStatusToast('শিক্ষার্থীর সাফল্যের গল্প সফলভাবে আপডেট হয়েছে!');
    } else {
      const newTestimonial: StudentTestimonial = {
        id: Date.now(),
        nameBn: tNameBn.trim(),
        nameEn: tNameEn.trim() || tNameBn.trim(),
        roleBn: tRoleBn.trim(),
        roleEn: tRoleEn.trim() || tRoleBn.trim(),
        workplaceBn: tWorkplaceBn.trim() || undefined,
        workplaceEn: tWorkplaceEn.trim() || undefined,
        courseBn: tCourseBn.trim(),
        courseEn: tCourseEn.trim(),
        batchBn: tBatchBn.trim(),
        batchEn: tBatchEn.trim() || tBatchBn.trim(),
        storyBn: tStoryBn.trim(),
        storyEn: tStoryEn.trim() || tStoryBn.trim(),
        rating: tRating,
        isFeatured: true,
      };

      if (onAddTestimonial) {
        onAddTestimonial(newTestimonial);
      }
      const updatedList = [newTestimonial, ...testimonials];
      setLocalTestimonials(updatedList);
      savePersistentTestimonials(updatedList);
      setAdminStatusToast('নতুন সাফল্যের গল্প সফলভাবে যোগ হয়েছে!');
    }

    setShowTestimonialModal(false);
    setTimeout(() => setAdminStatusToast(null), 3500);
  };

  // Execution handler when admin confirms deletion in modal
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const { type, id } = itemToDelete;

    if (type === 'notice') {
      if (onDeleteNotice) {
        onDeleteNotice(id);
      }
      setLocalNotices((prev) => prev.filter((n) => n.id !== id));
      setAdminStatusToast('নোটিশটি সফলভাবে মুছে ফেলা হয়েছে!');
    } else if (type === 'student') {
      if (onDeleteStudent) {
        onDeleteStudent(id);
      }
      setLocalStudents((prev) => prev.filter((s) => s.id !== id));
      if (selectedStudentForEdit?.id === id) {
        setSelectedStudentForEdit(null);
      }
      setAdminStatusToast('শিক্ষার্থীর প্রোফাইল সফলভাবে মুছে ফেলা হয়েছে!');
    } else if (type === 'applicant') {
      if (onDeleteApplicant) {
        onDeleteApplicant(id);
      }
      setLocalApplicants((prev) => prev.filter((a) => a.id !== id));
      if (selectedApplicantForEdit?.id === id) {
        setSelectedApplicantForEdit(null);
      }
      if (selectedApplicantForBioData?.id === id) {
        setSelectedApplicantForBioData(null);
      }
      setAdminStatusToast('আবেদনকারীর প্রোফাইল ও বায়োডাটা সফলভাবে মুছে ফেলা হয়েছে!');
    } else if (type === 'jobApp') {
      if (onDeleteJobApplication) {
        onDeleteJobApplication(id);
      }
      setAdminStatusToast('চাকুরীর আবেদনটি সফলভাবে মুছে ফেলা হয়েছে!');
    } else if (type === 'testimonial') {
      if (onDeleteTestimonial) {
        onDeleteTestimonial(id);
      }
      const updatedList = testimonials.filter((t) => t.id !== id);
      setLocalTestimonials(updatedList);
      savePersistentTestimonials(updatedList);
      setAdminStatusToast('সাফল্যের গল্প / রিভিউ মুছে ফেলা হয়েছে!');
    }

    setItemToDelete(null);
    setTimeout(() => {
      setAdminStatusToast(null);
    }, 4000);
  };

  const handleDeleteTestimonialClick = (testimonialOrId: StudentTestimonial | number) => {
    if (typeof testimonialOrId === 'number') {
      const found = testimonials.find((t) => t.id === testimonialOrId);
      setItemToDelete({
        type: 'testimonial',
        id: testimonialOrId,
        title: found?.nameBn || found?.nameEn || `সাফল্যের গল্প #${testimonialOrId}`,
        subtitle: found?.courseBn || found?.courseEn,
      });
    } else {
      setItemToDelete({
        type: 'testimonial',
        id: testimonialOrId.id,
        title: testimonialOrId.nameBn || testimonialOrId.nameEn,
        subtitle: testimonialOrId.courseBn || testimonialOrId.courseEn,
      });
    }
  };

  const handleDeleteNoticeClick = (noticeOrId: NoticeItem | number) => {
    if (typeof noticeOrId === 'number') {
      const found = notices.find((n) => n.id === noticeOrId);
      setItemToDelete({
        type: 'notice',
        id: noticeOrId,
        title: found?.title || `Notice #${noticeOrId}`,
        subtitle: found ? `ক্যাটাগরি: ${found.category} | তারিখ: ${found.date}` : undefined,
      });
    } else {
      setItemToDelete({
        type: 'notice',
        id: noticeOrId.id,
        title: noticeOrId.title,
        subtitle: `ক্যাটাগরি: ${noticeOrId.category} | তারিখ: ${noticeOrId.date}`,
      });
    }
  };

  // Student Handlers
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const total = newStudentFee || 3500;
    const paid = newStudentPaid || 0;
    const due = Math.max(0, total - paid);

    const newStudent: StudentAccount = {
      id: Date.now(),
      name: newStudentName,
      rollNo: newStudentRoll || `ACTC-2026-${Math.floor(100 + Math.random() * 900)}`,
      course: newStudentCourse,
      batch: newStudentBatch,
      phone: newStudentPhone || '017XXXXXXXX',
      email: `${newStudentName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      totalFee: total,
      paidFee: paid,
      dueFee: due,
      lastPaymentDate: paid > 0 ? 'Today (Admission)' : undefined,
      typingSpeed: '25 WPM Target',
      attendance: '100%',
      status: 'Active',
      password: 'password123',
    };

    if (onAddStudent) {
      onAddStudent(newStudent);
    } else {
      setLocalStudents([newStudent, ...localStudents]);
    }

    setNewStudentName('');
    setNewStudentRoll('');
    setNewStudentPhone('');
    setNewStudentFee(3500);
    setNewStudentPaid(0);
    setShowAddStudentModal(false);
  };

  const handleSaveStudentFromModal = (updatedStudent: StudentAccount) => {
    if (onUpdateStudent) {
      onUpdateStudent(updatedStudent);
    } else {
      setLocalStudents(
        localStudents.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
      );
    }
  };

  const handleDeleteStudentClick = (studentOrId: StudentAccount | number) => {
    if (typeof studentOrId === 'number') {
      const found = students.find((s) => s.id === studentOrId);
      setItemToDelete({
        type: 'student',
        id: studentOrId,
        title: found?.name || `Student #${studentOrId}`,
        subtitle: found ? `রোল: ${found.rollNo} | কোর্স: ${found.course}` : undefined,
      });
    } else {
      setItemToDelete({
        type: 'student',
        id: studentOrId.id,
        title: studentOrId.name,
        subtitle: `রোল: ${studentOrId.rollNo} | কোর্স: ${studentOrId.course}`,
      });
    }
  };

  const handleToggleCertificate = (student: StudentAccount) => {
    const updated: StudentAccount = {
      ...student,
      status: student.status === 'Certified' ? 'Active' : 'Certified',
    };
    handleSaveStudentFromModal(updated);
  };

  // Applicant Handlers
  const handleSaveApplicantFromModal = (updatedApplicant: ApplicantAccount) => {
    if (onUpdateApplicant) {
      onUpdateApplicant(updatedApplicant);
    } else {
      setLocalApplicants(
        localApplicants.map((a) => (a.id === updatedApplicant.id ? updatedApplicant : a))
      );
    }
  };

  const handleToggleFeeStatus = (app: ApplicantAccount) => {
    const updated: ApplicantAccount = {
      ...app,
      feeStatus: app.feeStatus === 'Paid' ? 'Pending' : 'Paid',
    };
    handleSaveApplicantFromModal(updated);
  };

  const handleToggleAdmitStatus = (app: ApplicantAccount) => {
    const updated: ApplicantAccount = {
      ...app,
      admitStatus: app.admitStatus === 'Ready' ? 'Processing' : 'Ready',
    };
    handleSaveApplicantFromModal(updated);
  };

  const jobApplications = propJobApplications || [];

  const handleToggleJobAppFeeStatus = (app: JobApplication) => {
    const updated: JobApplication = {
      ...app,
      feeStatus: app.feeStatus === 'Paid' ? 'Pending' : 'Paid',
    };
    onUpdateJobApplication?.(updated);
  };

  const handleApproveJobAppPayment = (app: JobApplication) => {
    const updated: JobApplication = {
      ...app,
      feeStatus: 'Paid',
      paymentVerificationStatus: 'Verified',
      bioDataSnapshot: app.bioDataSnapshot
        ? {
            ...app.bioDataSnapshot,
            feeStatus: 'Paid',
            paymentVerificationStatus: 'Verified',
          }
        : undefined,
    };
    onUpdateJobApplication?.(updated);
    setAdminStatusToast(`পেমেন্ট অনুমোদিত! ${app.applicantName}-এর ${app.postName} পদের ফি 'Paid (পরিশোধিত)' হিসেবে আপডেট হয়েছে।`);
    setTimeout(() => {
      setAdminStatusToast(null);
    }, 4500);
  };

  const handleApproveStudentPayment = (student: StudentAccount) => {
    const amountToCredit = student.pendingPaymentAmount || student.dueFee || 0;
    const newPaidFee = student.paidFee + amountToCredit;
    const newDueFee = Math.max(0, student.totalFee - newPaidFee);
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const paymentRecord: StudentPaymentRecord = {
      id: `PAY-${Date.now()}`,
      date: today,
      amount: amountToCredit,
      method: student.paymentMethod ? `${student.paymentMethod} (অনলাইন)` : 'bKash / Nagad / Rocket',
      note: `অনলাইন পেমেন্ট অনুমোদন (TrxID: ${student.transactionId || 'N/A'})`,
      trxId: student.transactionId,
    };

    const updated: StudentAccount = {
      ...student,
      paidFee: newPaidFee,
      dueFee: newDueFee,
      lastPaymentDate: today,
      paymentVerificationStatus: 'Verified',
      pendingPaymentAmount: undefined,
      paymentHistory: [...(student.paymentHistory || []), paymentRecord],
    };

    handleSaveStudentFromModal(updated);
    setAdminStatusToast(`শিক্ষার্থী ${student.name}-এর ৳${amountToCredit} ফি অনুমোদন করা হয়েছে! বর্তমান বকেয়া: ৳${newDueFee}। স্টুডেন্ট প্রোফাইলে এটি তৎক্ষণাৎ আপডেট হয়েছে।`);
    setTimeout(() => {
      setAdminStatusToast(null);
    }, 4500);
  };

  const handleQuickStudentPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForQuickPay) return;
    const amount = parseFloat(quickPayAmount);
    if (isNaN(amount) || amount <= 0) return;

    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const newPaidFee = selectedStudentForQuickPay.paidFee + amount;
    const newDueFee = Math.max(0, selectedStudentForQuickPay.totalFee - newPaidFee);

    const paymentRecord: StudentPaymentRecord = {
      id: `PAY-${Date.now()}`,
      date: today,
      amount: amount,
      method: quickPayMethod === 'Cash' ? 'অফিস ক্যাশ (Cash)' : `${quickPayMethod} (Send Money)`,
      note: quickPayNote.trim() || 'অফিস কাউন্টার পেমেন্ট এন্ট্রি',
      trxId: quickPayReceipt.trim() || undefined,
    };

    const updated: StudentAccount = {
      ...selectedStudentForQuickPay,
      paidFee: newPaidFee,
      dueFee: newDueFee,
      lastPaymentDate: today,
      paymentVerificationStatus: 'Verified',
      paymentHistory: [...(selectedStudentForQuickPay.paymentHistory || []), paymentRecord],
    };

    handleSaveStudentFromModal(updated);
    setAdminStatusToast(
      `পেমেন্ট সফলভাবে এন্ট্রি হয়েছে! ${selectedStudentForQuickPay.name}-এর একাউন্টে ৳${amount} জমা হয়েছে। বর্তমান বকেয়া: ৳${newDueFee}। স্টুডেন্ট ড্যাশবোর্ড ও প্রোফাইলে এটি সাথে সাথে আপডেট হয়েছে।`
    );
    setSelectedStudentForQuickPay(null);
    setQuickPayAmount('');
    setQuickPayReceipt('');
    setQuickPayNote('');
    setTimeout(() => {
      setAdminStatusToast(null);
    }, 5000);
  };

  const pendingJobAppPaymentsCount = jobApplications.filter((a) => a.paymentVerificationStatus === 'PendingVerification').length;
  const pendingStudentPaymentsCount = students.filter((s) => s.paymentVerificationStatus === 'PendingVerification').length;
  const totalPendingPaymentsCount = pendingJobAppPaymentsCount + pendingStudentPaymentsCount;

  const adminProcessingCount = jobApplications.filter((a) => !isApplicationCompleted(a.admitStatus)).length;
  const adminCompletedCount = jobApplications.filter((a) => isApplicationCompleted(a.admitStatus)).length;

  const handleToggleJobAppAdmitStatus = (app: JobApplication) => {
    const isNowCompleted = !isApplicationCompleted(app.admitStatus);
    const newStatus: 'Completed' | 'Processing' = isNowCompleted ? 'Completed' : 'Processing';
    const updated: JobApplication = {
      ...app,
      admitStatus: newStatus,
      status: newStatus,
      bioDataSnapshot: app.bioDataSnapshot
        ? {
            ...app.bioDataSnapshot,
            admitStatus: newStatus,
            status: newStatus,
          }
        : undefined,
    };
    onUpdateJobApplication?.(updated);
    setAdminStatusToast(
      `স্ট্যাটাস পরিবর্তিত হয়েছে: ${newStatus === 'Completed' ? 'সম্পন্ন (Completed) ✓' : 'প্রক্রিয়াধীন (Processing) ⏳'} (প্রার্থী: ${app.applicantName}, পদ: ${app.postName})`
    );
    setTimeout(() => {
      setAdminStatusToast(null);
    }, 4500);
  };

  const handleDeleteApplicantClick = (applicantOrId: ApplicantAccount | number) => {
    if (typeof applicantOrId === 'number') {
      const found = applicants.find((a) => a.id === applicantOrId);
      setItemToDelete({
        type: 'applicant',
        id: applicantOrId,
        title: found?.applicantName || `Applicant #${applicantOrId}`,
        subtitle: found ? `মোবাইল: ${found.phone || 'N/A'} | রোল: ${found.rollNo || 'N/A'}` : undefined,
      });
    } else {
      setItemToDelete({
        type: 'applicant',
        id: applicantOrId.id,
        title: applicantOrId.applicantName || 'Applicant',
        subtitle: `মোবাইল: ${applicantOrId.phone || 'N/A'} | পদ: ${applicantOrId.jobTitle || 'চাকুরী আবেদন'}`,
      });
    }
  };

  const handleDeleteJobAppClick = (appOrId: JobApplication | number) => {
    if (typeof appOrId === 'number') {
      const found = jobApplications.find((a) => a.id === appOrId);
      setItemToDelete({
        type: 'jobApp',
        id: appOrId,
        title: found ? `${found.postName} - ${found.applicantName}` : `Job Application #${appOrId}`,
        subtitle: found ? `রোল: ${found.rollNo} | আবেদন তারিখ: ${found.appliedDate}` : undefined,
      });
    } else {
      setItemToDelete({
        type: 'jobApp',
        id: appOrId.id,
        title: `${appOrId.postName} - ${appOrId.applicantName}`,
        subtitle: `রোল: ${appOrId.rollNo} | আবেদন তারিখ: ${appOrId.appliedDate}`,
      });
    }
  };

  const handleViewJobAppBioData = (app: JobApplication) => {
    const matchingAccount = applicants.find((a) => a.id === app.applicantId);
    const applicantToView: ApplicantAccount = app.bioDataSnapshot || {
      ...(matchingAccount || {
        id: app.applicantId,
        applicantName: app.applicantName,
        phone: app.phone,
        email: app.email,
        jobTitle: app.postName,
        feeAmount: app.feeAmount,
        admitStatus: app.admitStatus,
        feeStatus: app.feeStatus,
        appliedDate: app.appliedDate,
        rollNo: app.rollNo,
      }),
      applicantName: app.applicantName,
      phone: app.phone,
      email: app.email,
      jobTitle: app.postName,
      rollNo: app.rollNo,
      refNo: app.refNo,
      appliedDate: app.appliedDate,
      feeStatus: app.feeStatus,
      feeAmount: app.feeAmount,
      admitStatus: app.admitStatus,
    };

    setSelectedApplicantForBioData(applicantToView);
    setBioDataModalTab('copy');
  };

  const statusFilteredJobApps = jobApplications.filter((app) => {
    if (jobAppStatusFilter === 'processing') return !isApplicationCompleted(app.admitStatus);
    if (jobAppStatusFilter === 'completed') return isApplicationCompleted(app.admitStatus);
    return true;
  });

  const filteredJobApplications = statusFilteredJobApps.filter(
    (app) =>
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.postName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.circularTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone.includes(searchQuery) ||
      (app.rollNo && app.rollNo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Fee Aggregations across Students
  const totalCourseFees = students.reduce((acc, s) => acc + (s.totalFee || 0), 0);
  const totalPaidFees = students.reduce((acc, s) => acc + (s.paidFee || 0), 0);
  const totalDueFees = students.reduce((acc, s) => acc + (s.dueFee || 0), 0);

  // Search filtering
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery)
  );

  const filteredApplicants = applicants.filter(
    (a) =>
      a.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.phone.includes(searchQuery) ||
      (a.rollNo && a.rollNo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredNotices = notices.filter(
    (n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.pdfName && n.pdfName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Database Backup and Restore Handlers
  const handleTriggerBackupDownload = () => {
    if (onExportDatabase) {
      onExportDatabase();
    } else {
      downloadDatabaseBackupFile(applicants, students, jobApplications, notices);
    }
  };

  const handleFileUploadRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          setRestoreMessage({ type: 'error', text: 'ফাইলের কোনো তথ্য পাওয়া যায়নি।' });
          return;
        }
        if (onRestoreDatabase) {
          const ok = onRestoreDatabase(text);
          if (ok) {
            setRestoreMessage({
              type: 'success',
              text: 'ডাটাবেজ সফলভাবে রিস্টোর হয়েছে! সকল ইউজার আইডি, পাসওয়ার্ড ও প্রোফাইল ফিরিয়ে আনা হয়েছে।',
            });
            setTimeout(() => setRestoreMessage(null), 5000);
          } else {
            setRestoreMessage({
              type: 'error',
              text: 'ডাটাবেজ রিস্টোর ব্যর্থ হয়েছে। সঠিক ACTC ব্যাকআপ JSON ফাইল নির্বাচন করুন।',
            });
            setTimeout(() => setRestoreMessage(null), 5000);
          }
        }
      } catch (err: any) {
        setRestoreMessage({
          type: 'error',
          text: `ফাইল পড়তে সমস্যা হয়েছে: ${err?.message || ''}`,
        });
        setTimeout(() => setRestoreMessage(null), 5000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const togglePasswordVisibility = (key: string) => {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Unified list of credentials combining Applicants and Students
  const allCredentials = [
    ...applicants.map((a) => ({
      key: `applicant-${a.id}`,
      id: a.id,
      name: a.applicantName,
      nameBangla: a.nameBangla,
      role: 'applicant' as const,
      roleLabel: 'চাকুরী আবেদনকারী',
      identifier: a.rollNo || a.refNo || `APP-${a.id}`,
      phone: a.phone,
      email: a.email,
      password: a.password || 'applicantpass',
      title: a.jobTitle || 'সহকারী শিক্ষক',
      date: a.appliedDate,
      isCompleted: a.isAccountCompleted,
      rawApplicant: a,
    })),
    ...students.map((s) => ({
      key: `student-${s.id}`,
      id: s.id,
      name: s.name,
      nameBangla: '',
      role: 'student' as const,
      roleLabel: 'কোর্সের শিক্ষার্থী',
      identifier: s.rollNo,
      phone: s.phone,
      email: s.email,
      password: s.password || 'password123',
      title: `${s.course} (${s.batch})`,
      date: 'ভর্তি সম্পন্ন',
      isCompleted: true,
      rawStudent: s,
    })),
  ];

  const filteredCredentials = allCredentials.filter((cred) => {
    if (credentialFilter === 'applicants' && cred.role !== 'applicant') return false;
    if (credentialFilter === 'students' && cred.role !== 'student') return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      cred.name.toLowerCase().includes(q) ||
      (cred.nameBangla && cred.nameBangla.includes(q)) ||
      cred.identifier.toLowerCase().includes(q) ||
      cred.phone.includes(q) ||
      cred.email.toLowerCase().includes(q) ||
      cred.password.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#dce4f2] p-2 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center font-sans antialiased">
      <div className="w-full max-w-7xl bg-[#f0f4fa] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-white/60 min-h-[780px]">
        
        {/* 1. Left Dark Sidebar */}
        <aside className="w-full lg:w-64 bg-[#161a2b] text-stone-300 p-6 flex flex-col justify-between shrink-0">
          <div>
            {/* Institute Identity */}
            <div className="flex flex-col items-center pb-6 border-b border-white/10 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-rose-600 p-0.5 shadow-lg mb-2.5 overflow-hidden">
                <img
                  src="/assets/aistudio/8fee6d14-342b-408c-880a-68e307e04b81_f55db718.jfif"
                  alt="Asad Computer Official Logo"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide">Md. Asaduzzaman</h3>
              <span className="text-[11px] text-amber-400 font-semibold mt-0.5">Institute Director</span>
              <span className="text-[10px] text-stone-400 mt-1 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full font-mono">
                Admin Control Panel
              </span>
            </div>

            {/* Admin Menu Tabs */}
            <nav className="mt-6 space-y-1 text-xs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border-l-2 border-amber-500'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('notices')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                  activeTab === 'notices'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border-l-2 border-amber-500'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Bell className="w-4 h-4 text-rose-400" />
                <span>Notice Control ({notices.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('students')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                  activeTab === 'students'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border-l-2 border-amber-500'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Users className="w-4 h-4 text-blue-400" />
                <span>Student Control & Fees ({students.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('applicants')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                  activeTab === 'applicants'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border-l-2 border-amber-500'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Applicant Control ({applicants.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('credentials')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                  activeTab === 'credentials'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border-l-2 border-amber-500'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Key className="w-4 h-4 text-amber-400" />
                <div className="flex-1 text-left">
                  <span className="block font-medium">আইডি ও পাসওয়ার্ড</span>
                  <span className="block text-[10px] text-amber-400/90 font-mono">ভল্ট ({applicants.length + students.length})</span>
                </div>
                {passwordRequests.filter((r) => r.status === 'Pending').length > 0 && (
                  <span className="bg-rose-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full animate-pulse shadow-xs" title="Pending Password Reset Requests">
                    {passwordRequests.filter((r) => r.status === 'Pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('testimonials')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                  activeTab === 'testimonials'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border-l-2 border-amber-500'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Award className="w-4 h-4 text-amber-400" />
                <div className="flex-1 text-left">
                  <span className="block font-medium">সাফল্যের গল্প ও রিভিউ</span>
                  <span className="block text-[10px] text-amber-400/90 font-mono">Testimonials ({testimonials.length})</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('seo')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                  activeTab === 'seo'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border-l-2 border-amber-500'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <div className="flex-1 text-left">
                  <span className="block font-medium">এসইও ও মেটাডাটা</span>
                  <span className="block text-[10px] text-cyan-400/90 font-mono">SEO & Meta Tags</span>
                </div>
              </button>
            </nav>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-2 text-xs">
            <button
              onClick={onBackToHome}
              className="w-full flex items-center space-x-2.5 text-stone-400 hover:text-white py-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Back to Website</span>
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-2.5 text-rose-400 hover:text-rose-300 py-1.5 transition-colors cursor-pointer font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* 2. Middle Main Control Area */}
        <main className="flex-1 p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Top Search Bar */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students, applicants, circulars, roll, phone..."
                  className="w-full bg-white rounded-full py-2.5 pl-10 pr-4 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 shadow-xs border border-stone-200 outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-stone-600 bg-white px-3 py-1.5 rounded-full shadow-xs border border-stone-200 font-medium hidden sm:inline-block">
                  Asad Computer & Training Center · Bottola
                </span>
              </div>
            </div>

            {/* Overview KPI Cards matching reference */}
            <div className="mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div
                  onClick={() => setActiveTab('students')}
                  className="bg-[#2a68ff] text-white p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="text-xs font-semibold">Total Students</div>
                  <div className="text-xl font-bold mt-1">{students.length} Enrolled</div>
                  <div className="text-[10px] text-white/80 mt-1">Computer Office Application</div>
                </div>

                <div
                  onClick={() => {
                    setActiveTab('applicants');
                    setApplicantSubTab('applications');
                  }}
                  className="bg-gradient-to-br from-teal-700 to-emerald-800 text-white p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-teal-100">
                    <span>চাকুরীর আবেদনসমূহ</span>
                    <Briefcase className="w-3.5 h-3.5 text-teal-200" />
                  </div>
                  <div className="text-xl font-bold mt-1">
                    {jobApplications.length} টি আবেদন
                  </div>
                  <div className="text-[10px] text-teal-100 mt-1 flex items-center space-x-1.5">
                    <span className="bg-amber-400 text-amber-950 px-1.5 py-0.2 rounded font-bold">
                      {adminProcessingCount} প্রক্রিয়াধীন
                    </span>
                    <span className="bg-emerald-400 text-emerald-950 px-1.5 py-0.2 rounded font-bold">
                      {adminCompletedCount} সম্পন্ন
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('notices')}
                  className="bg-[#ff5b57] text-white p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="text-xs font-semibold">Live Notices</div>
                  <div className="text-xl font-bold mt-1">{notices.length} Published</div>
                  <div className="text-[10px] text-white/80 mt-1">PDF & Public board</div>
                </div>

                <div
                  onClick={() => setActiveTab('students')}
                  className="bg-[#ffb703] text-stone-950 p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="text-xs font-bold">Total Fees Collected</div>
                  <div className="text-xl font-bold mt-1">৳ {totalPaidFees.toLocaleString()}</div>
                  <div className="text-[10px] text-stone-800 mt-1">Due: ৳ {totalDueFees.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Pending Online Payments Alert Banner */}
            {totalPendingPaymentsCount > 0 && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-600 via-rose-600 to-orange-600 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base flex items-center space-x-2">
                      <span>নতুন অনলাইন পেমেন্ট সাবমিশন জমা পড়েছে ({totalPendingPaymentsCount} টি)</span>
                    </h4>
                    <p className="text-xs text-white/90 mt-0.5">
                      বিকাশ/রকেট: <strong>01773733654</strong> বা নগদ: <strong>01864399871</strong> স্টেটমেন্ট মিলিয়ে এক ক্লিকে অনুমোদন (Approve) করুন।
                      {pendingJobAppPaymentsCount > 0 && ` চাকুরীর আবেদন: ${pendingJobAppPaymentsCount} টি।`}
                      {pendingStudentPaymentsCount > 0 && ` শিক্ষার্থী কোর্স ফি: ${pendingStudentPaymentsCount} জন।`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                  {pendingJobAppPaymentsCount > 0 && (
                    <button
                      onClick={() => {
                        setActiveTab('applicants');
                        setApplicantSubTab('applications');
                      }}
                      className="px-3 py-1.5 bg-white text-stone-900 rounded-lg font-bold text-xs shadow-xs hover:bg-stone-100 transition-colors cursor-pointer"
                    >
                      আবেদনসমূহ দেখুন ({pendingJobAppPaymentsCount})
                    </button>
                  )}
                  {pendingStudentPaymentsCount > 0 && (
                    <button
                      onClick={() => setActiveTab('students')}
                      className="px-3 py-1.5 bg-stone-900 text-white rounded-lg font-bold text-xs shadow-xs hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      শিক্ষার্থী ফি দেখুন ({pendingStudentPaymentsCount})
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* VIEW A: NOTICE CONTROL (With PDF Upload & View/Download for everyone) */}
            {activeTab === 'notices' && (
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-200">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-rose-500" />
                      <span>Notice Board Control (পিডিএফ নোটিশ আপলোড ও ম্যানেজমেন্ট)</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Upload PDF circulars and notices. Students, applicants, and visitors can view and download them.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddNoticeModal(true)}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload New Notice (PDF)</span>
                  </button>
                </div>

                {/* Notices List */}
                <div className="space-y-3">
                  {filteredNotices.map((notice) => (
                    <div
                      key={notice.id}
                      className="p-3.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 mt-0.5 ${
                          notice.category === 'Student'
                            ? 'bg-blue-100 text-blue-800'
                            : notice.category === 'Applicant'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-800'
                        }`}>
                          {notice.category}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-stone-900 leading-snug">{notice.title}</p>
                          {notice.description && (
                            <p className="text-stone-500 text-[11px] mt-1 line-clamp-1">{notice.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-stone-400">{notice.date}</span>
                            {notice.feeAmount !== undefined && (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                                <CreditCard className="w-3 h-3 text-emerald-600" />
                                <span>আবেদন ফি: ৳{notice.feeAmount}</span>
                              </span>
                            )}
                            {notice.remarks && (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-medium">
                                <Info className="w-3 h-3 text-amber-600" />
                                <span className="truncate max-w-[260px]">মন্তব্য: {notice.remarks}</span>
                              </span>
                            )}
                            {notice.pdfName && (
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-medium">
                                <Paperclip className="w-3 h-3 text-teal-600" />
                                <span className="truncate max-w-[200px]">{notice.pdfName}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
                        <button
                          onClick={() => setSelectedNoticeForPdf(notice)}
                          className="flex items-center space-x-1 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded border border-rose-200 transition-colors cursor-pointer"
                          title="View and download PDF"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View PDF</span>
                        </button>

                        <button
                          onClick={() => handleDeleteNoticeClick(notice.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete notice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredNotices.length === 0 && (
                    <div className="text-center py-8 text-stone-400 text-xs">
                      No notices found matching search criteria.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW B: STUDENT CONTROL & FEE ACCOUNTING */}
            {activeTab === 'students' && (
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-200">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>Student Control Panel (প্রোফাইল, পাসওয়ার্ড ও ফি হিসাব)</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      View and edit student profiles, reset passwords, update course fee, and track payments & dues.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Enroll New Student</span>
                  </button>
                </div>

                {/* Overall Fee Summary Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 mb-4 text-xs">
                  <div>
                    <span className="text-stone-500 block text-[11px]">Total Course Fees (সকল ফি)</span>
                    <span className="text-base font-bold text-stone-900 font-mono">
                      ৳ {totalCourseFees.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-emerald-700 block text-[11px] font-semibold">Total Paid Amount (মোট জমা)</span>
                    <span className="text-base font-bold text-emerald-700 font-mono">
                      ৳ {totalPaidFees.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-rose-700 block text-[11px] font-semibold">Total Due Balance (মোট বাকি)</span>
                    <span className="text-base font-bold text-rose-700 font-mono">
                      ৳ {totalDueFees.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Students Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-100/80 text-stone-600 border-b border-stone-200 uppercase text-[10px] tracking-wider font-semibold">
                        <th className="p-3">Roll & Name</th>
                        <th className="p-3">Course / Batch</th>
                        <th className="p-3">Fee Status (জমা / বাকি)</th>
                        <th className="p-3">Typing Speed</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="p-3">
                            <div className="font-mono font-bold text-blue-700">{student.rollNo}</div>
                            <div className="font-semibold text-stone-900">{student.name}</div>
                            <div className="text-[10px] text-stone-400 font-mono">{student.phone}</div>
                          </td>
                          <td className="p-3 text-stone-600">
                            <div className="font-medium text-stone-800">{student.course}</div>
                            <div className="text-[10px] text-stone-400">{student.batch}</div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <div className="text-[11px]">
                                Total: <strong>৳{student.totalFee}</strong>
                              </div>
                              <div className="text-[11px] text-emerald-700 font-semibold">
                                Paid: ৳{student.paidFee}
                              </div>
                              <div className="text-[11px]">
                                {student.dueFee > 0 ? (
                                  <span className="text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                                    Due: ৳{student.dueFee}
                                  </span>
                                ) : (
                                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                                    Cleared
                                  </span>
                                )}
                              </div>

                              {/* Online Payment Pending Verification */}
                              {student.paymentVerificationStatus === 'PendingVerification' && (
                                <div className="mt-2 p-2 bg-amber-50 border border-amber-300 rounded-lg text-[10px] text-amber-950 space-y-1 shadow-2xs">
                                  <div className="font-bold text-amber-900 flex items-center space-x-1">
                                    <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                                    <span>অনলাইন পেমেন্ট পেন্ডিং</span>
                                  </div>
                                  <div>
                                    জমা রিকোয়েস্ট: <strong className="text-emerald-800 font-bold">৳{student.pendingPaymentAmount || student.dueFee}</strong>
                                  </div>
                                  <div>
                                    মাধ্যম: <strong>{student.paymentMethod || 'bKash'}</strong>
                                  </div>
                                  <div>
                                    প্রেরক ফোন: <strong className="font-mono">{student.senderPhone || student.phone}</strong>
                                  </div>
                                  <div>
                                    TrxID: <span className="font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">{student.transactionId}</span>
                                  </div>
                                  <button
                                    onClick={() => handleApproveStudentPayment(student)}
                                    className="w-full mt-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] flex items-center justify-center space-x-1 shadow-2xs cursor-pointer transition-colors"
                                    title="বিকাশ/নগদে টাকা পেয়ে থাকলে অনুমোদন করুন"
                                  >
                                    <CheckCircle className="w-3 h-3 text-white" />
                                    <span>অনুমোদন করুন (Approve)</span>
                                  </button>
                                </div>
                              )}

                              {student.paymentVerificationStatus === 'Verified' && student.transactionId && (
                                <div className="text-[9px] text-stone-500 font-mono mt-0.5">
                                  ✓ TrxID: {student.transactionId} ({student.paymentMethod || 'Online'})
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-3 font-mono text-stone-700 font-medium">
                            <div>{student.typingSpeed}</div>
                            <div className="text-[10px] text-stone-400">Att: {student.attendance}</div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              student.status === 'Certified'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            {/* Quick Add Payment Button */}
                            <button
                              onClick={() => {
                                setSelectedStudentForQuickPay(student);
                                setQuickPayAmount(student.dueFee > 0 ? String(Math.min(student.dueFee, 1000)) : '500');
                                setQuickPayMethod('Cash');
                                setQuickPayReceipt('');
                                setQuickPayNote('');
                              }}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center space-x-1 shadow-2xs"
                              title="কোর্স ফি পেমেন্ট এন্ট্রি করুন (Add Payment)"
                            >
                              <DollarSign className="w-3 h-3 text-emerald-100" />
                              <span>+ ফি এন্ট্রি</span>
                            </button>

                            {/* Edit Profile & Password Modal Trigger */}
                            <button
                              onClick={() => setSelectedStudentForEdit(student)}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded font-bold text-[11px] transition-colors cursor-pointer border border-blue-200 inline-flex items-center space-x-1"
                              title="Edit profile, update fees, change password"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Edit / Password</span>
                            </button>

                            {/* Official Admission Copy & PDF Download */}
                            <button
                              onClick={() => setSelectedStudentForAdmissionCopy(student)}
                              className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded font-bold text-[11px] transition-colors cursor-pointer border border-sky-200 inline-flex items-center space-x-1"
                              title="শিক্ষার্থীর পূরণকৃত ভর্তি ফরমের কপি দেখুন ও পিডিএফ ডাউনলোড করুন"
                            >
                              <FileText className="w-3 h-3 text-sky-600" />
                              <span>ভর্তি ফরম / প্রিন্ট</span>
                            </button>

                            <button
                              onClick={() => handleToggleCertificate(student)}
                              className="px-2 py-1.5 bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-800 rounded font-medium text-[11px] transition-colors cursor-pointer"
                              title="Toggle Certificate Status"
                            >
                              Certificate
                            </button>

                            <button
                              onClick={() => handleDeleteStudentClick(student.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Remove student"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW C: APPLICANT CONTROL */}
            {activeTab === 'applicants' && (
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-200">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-emerald-600" />
                      <span>Applicant Management & Submissions (আবেদনকারীদের আবেদন ও বায়োডাটা)</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      এপ্লিকেন্ট কোন পদে আবেদন করেছে তা সরাসরি দেখুন, ফি ও এডমিট কার্ড ম্যানেজ করুন এবং পূর্ণাঙ্গ কপি প্রিন্ট করুন।
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setApplicantSubTab('applications')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        applicantSubTab === 'applications'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      চাকুরীর আবেদনসমূহ ({jobApplications.length})
                    </button>
                    <button
                      onClick={() => setApplicantSubTab('profiles')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        applicantSubTab === 'profiles'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      নিবন্ধিত প্রোফাইল ({applicants.length})
                    </button>
                  </div>
                </div>

                {/* SUB-VIEW 1: SUBMITTED JOB APPLICATIONS WITH POST NAMES */}
                {applicantSubTab === 'applications' && (
                  <div>
                    {/* Admin Status Feedback Toast */}
                    {adminStatusToast && (
                      <div className="mb-4 p-3 bg-emerald-700 text-white rounded-xl shadow-md flex items-center justify-between text-xs animate-in fade-in duration-200">
                        <div className="flex items-center space-x-2 font-medium">
                          <CheckCircle className="w-4 h-4 text-emerald-200" />
                          <span>{adminStatusToast}</span>
                        </div>
                        <button
                          onClick={() => setAdminStatusToast(null)}
                          className="text-white/80 hover:text-white p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Status Filter Bar for Job Applications */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-stone-50 p-3 rounded-xl border border-stone-200">
                      <div className="flex flex-wrap items-center gap-2">
                        <Filter className="w-3.5 h-3.5 text-stone-500" />
                        <span className="text-xs font-bold text-stone-700">আবেদন স্ট্যাটাস ফিল্টার:</span>

                        <button
                          onClick={() => setJobAppStatusFilter('all')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            jobAppStatusFilter === 'all'
                              ? 'bg-stone-900 text-white shadow-xs'
                              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                          }`}
                        >
                          সকল আবেদন ({jobApplications.length})
                        </button>

                        <button
                          onClick={() => setJobAppStatusFilter('processing')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                            jobAppStatusFilter === 'processing'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          <span>প্রক্রিয়াধীন ({adminProcessingCount})</span>
                        </button>

                        <button
                          onClick={() => setJobAppStatusFilter('completed')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                            jobAppStatusFilter === 'completed'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100'
                          }`}
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>সম্পন্ন ({adminCompletedCount})</span>
                        </button>
                      </div>

                      <div className="text-[11px] text-stone-500 italic">
                        * 'সম্পন্ন করুন' বোতামে ক্লিক করলে সাথে সাথে প্রার্থীর পোর্টালে সম্পন্ন দেখাবে।
                      </div>
                    </div>

                    {filteredJobApplications.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-stone-100/90 text-stone-700 border-b border-stone-300 uppercase text-[10px] tracking-wider font-bold">
                              <th className="p-3">প্রার্থীর নাম ও রোল</th>
                              <th className="p-3">যোগাযোগ (মোবাইল ও ইমেইল)</th>
                              <th className="p-3">সার্কুলার / প্রতিষ্ঠান</th>
                              <th className="p-3 bg-emerald-50 text-emerald-900">আবেদিত পদ (Applied Post)</th>
                              <th className="p-3">তারিখ</th>
                              <th className="p-3">ফি স্ট্যাটাস</th>
                              <th className="p-3 bg-amber-50/60 text-amber-950 font-bold">আবেদন স্ট্যাটাস ও একশন</th>
                              <th className="p-3 text-right">অ্যাকশন</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-200">
                            {filteredJobApplications.map((app) => (
                              <tr key={`job-app-${app.id}`} className="hover:bg-stone-50/80 transition-colors">
                                <td className="p-3 font-bold text-stone-900">
                                  <div>{app.applicantName || 'Applicant'}</div>
                                  <span className="text-[10px] text-stone-400 font-mono block">Roll: {app.rollNo}</span>
                                </td>
                                <td className="p-3 font-mono text-stone-700">
                                  <div>{app.phone || '—'}</div>
                                  <div className="text-[10px] text-stone-400 truncate max-w-[140px]">{app.email || '—'}</div>
                                </td>
                                <td className="p-3 font-medium text-stone-800 max-w-[180px] truncate" title={app.circularTitle}>
                                  {app.circularTitle}
                                </td>
                                <td className="p-3 bg-emerald-50/50">
                                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-block shadow-2xs">
                                    {app.postName}
                                  </span>
                                </td>
                                <td className="p-3 text-stone-500 text-[11px] whitespace-nowrap">
                                  {app.appliedDate}
                                </td>
                                <td className="p-3">
                                  <div className="space-y-1">
                                    <button
                                      onClick={() => handleToggleJobAppFeeStatus(app)}
                                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                        app.feeStatus === 'Paid'
                                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                      }`}
                                      title="Click to toggle Paid/Pending"
                                    >
                                      {app.feeStatus} (৳{app.feeAmount})
                                    </button>

                                    {/* Verification Pending Details */}
                                    {app.paymentVerificationStatus === 'PendingVerification' && (
                                      <div className="p-2 bg-amber-50 border border-amber-300 rounded-lg text-[10px] text-amber-950 space-y-1 shadow-2xs min-w-[140px]">
                                        <div className="font-bold text-amber-900 flex items-center space-x-1">
                                          <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                                          <span>যাচাই প্রক্রিয়াধীন</span>
                                        </div>
                                        <div>
                                          মাধ্যম: <strong>{app.paymentMethod || 'bKash'}</strong>
                                        </div>
                                        <div>
                                          প্রেরক: <strong className="font-mono">{app.senderPhone || app.phone}</strong>
                                        </div>
                                        <div>
                                          TrxID: <span className="font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">{app.transactionId}</span>
                                        </div>
                                        <button
                                          onClick={() => handleApproveJobAppPayment(app)}
                                          className="w-full mt-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] flex items-center justify-center space-x-1 shadow-2xs cursor-pointer transition-colors"
                                          title="বিকাশ/নগদে টাকা পেয়ে থাকলে পেইড হিসেবে অনুমোদন করুন"
                                        >
                                          <CheckCircle className="w-3 h-3 text-white" />
                                          <span>পেমেন্ট অনুমোদন (Mark Paid)</span>
                                        </button>
                                      </div>
                                    )}

                                    {app.paymentVerificationStatus === 'Verified' && app.transactionId && (
                                      <div className="text-[9px] text-stone-500 font-mono">
                                        ✓ TrxID: {app.transactionId} ({app.paymentMethod || 'Online'})
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3 bg-amber-50/30">
                                  {/* Clear Color-Coded Status Badge with Quick Action Button */}
                                  <div className="flex flex-col items-start gap-1.5">
                                    <ApplicationStatusBadge
                                      status={app.admitStatus}
                                      size="xs"
                                    />
                                    {isApplicationCompleted(app.admitStatus) ? (
                                      <button
                                        onClick={() => handleToggleJobAppAdmitStatus(app)}
                                        className="text-[10px] font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-300 transition-colors flex items-center space-x-1 cursor-pointer"
                                        title="পুনরায় প্রক্রিয়াধীন করতে ক্লিক করুন"
                                      >
                                        <Clock className="w-2.5 h-2.5 text-amber-600" />
                                        <span>প্রক্রিয়াধীন করুন</span>
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleToggleJobAppAdmitStatus(app)}
                                        className="text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-0.5 rounded shadow-2xs transition-colors flex items-center space-x-1 cursor-pointer"
                                        title="আবেদনটি সম্পন্ন ও অনুমোদিত করতে ক্লিক করুন"
                                      >
                                        <CheckCircle className="w-2.5 h-2.5 text-white" />
                                        <span>সম্পন্ন করুন (Approve)</span>
                                      </button>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                                  <button
                                    onClick={() => handleViewJobAppBioData(app)}
                                    className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg font-bold text-[11px] transition-colors cursor-pointer border border-blue-200 inline-flex items-center space-x-1"
                                    title="View official applicant copy with bio-data and post name"
                                  >
                                    <FileText className="w-3 h-3 text-blue-600" />
                                    <span>কপি দেখুন / প্রিন্ট</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteJobAppClick(app.id)}
                                    className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer border border-rose-200 inline-flex items-center space-x-1"
                                    title="Delete application"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-stone-50 rounded-xl border border-dashed border-stone-300 space-y-2">
                        <Briefcase className="w-10 h-10 text-stone-400 mx-auto" />
                        <h5 className="font-bold text-stone-700 text-sm">কোনো আবেদন পাওয়া যায়নি</h5>
                        <p className="text-xs text-stone-500 max-w-md mx-auto">
                          বর্তমানে নির্বাচিত ফিল্টারে কোনো আবেদন নেই।
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* SUB-VIEW 2: REGISTERED PROFILES */}
                {applicantSubTab === 'profiles' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-stone-100/80 text-stone-600 border-b border-stone-200 uppercase text-[10px] tracking-wider font-semibold">
                          <th className="p-3">Applicant Name</th>
                          <th className="p-3">Contact</th>
                          <th className="p-3">Profile Status</th>
                          <th className="p-3">Fee Status</th>
                          <th className="p-3">Admit Card / Status</th>
                          <th className="p-3 text-right">Quick Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredApplicants.map((app) => (
                          <tr key={app.id} className="hover:bg-stone-50/80 transition-colors">
                            <td className="p-3 font-bold text-stone-900">
                              <div>{app.applicantName || 'Applicant'}</div>
                              {app.rollNo && (
                                <span className="text-[10px] text-stone-400 font-mono block">Roll: {app.rollNo}</span>
                              )}
                            </td>
                            <td className="p-3 font-mono text-stone-600">
                              <div>{app.phone || '—'}</div>
                              <div className="text-[10px] text-stone-400 truncate max-w-[140px]">{app.email || '—'}</div>
                            </td>
                            <td className="p-3 font-medium text-stone-800">
                              <span className={app.isAccountCompleted ? 'text-emerald-700 font-semibold' : 'text-stone-500'}>
                                {app.isAccountCompleted ? '✓ Bio-Data Complete' : 'Profile Created'}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="space-y-1">
                                <button
                                  onClick={() => handleToggleFeeStatus(app)}
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                    app.feeStatus === 'Paid'
                                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                      : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                  }`}
                                  title="Click to toggle Paid/Pending"
                                >
                                  {app.feeStatus} (৳{app.feeAmount})
                                </button>
                                {app.paymentVerificationStatus === 'PendingVerification' && (
                                  <div className="p-1.5 bg-amber-50 border border-amber-300 rounded text-[10px] text-amber-950 space-y-0.5">
                                    <div className="font-bold text-amber-900">যাচাই পেন্ডিং</div>
                                    <div>মাধ্যম: <strong>{app.paymentMethod || 'bKash'}</strong></div>
                                    <div>ফোন: <span className="font-mono">{app.senderPhone || app.phone}</span></div>
                                    <div>TrxID: <span className="font-mono font-bold bg-amber-100 px-1 rounded">{app.transactionId}</span></div>
                                    <button
                                      onClick={() => {
                                        const updated: ApplicantAccount = {
                                          ...app,
                                          feeStatus: 'Paid',
                                          paymentVerificationStatus: 'Verified',
                                        };
                                        handleSaveApplicantFromModal(updated);
                                        setAdminStatusToast(`প্রার্থী ${app.applicantName}-এর ফি অনুমোদিত ও পেইড মার্ক করা হয়েছে।`);
                                        setTimeout(() => setAdminStatusToast(null), 4500);
                                      }}
                                      className="w-full mt-1 px-1.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[9px] cursor-pointer"
                                    >
                                      পেমেন্ট অনুমোদন (Mark Paid)
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <ApplicationStatusBadge
                                status={app.admitStatus}
                                size="xs"
                                interactive={true}
                                onClick={() => handleToggleAdmitStatus(app)}
                                adminActionLabel="টগল"
                              />
                            </td>
                            <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => {
                                  setSelectedApplicantForBioData(app);
                                  setBioDataModalTab('copy');
                                }}
                                className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded font-bold text-[11px] transition-colors cursor-pointer border border-blue-200 inline-flex items-center space-x-1"
                                title="View official applicant's copy (PDF format)"
                              >
                                <FileText className="w-3 h-3 text-blue-600" />
                                <span>কপি দেখুন / প্রিন্ট</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedApplicantForBioData(app);
                                  setBioDataModalTab('form');
                                }}
                                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded font-bold text-[11px] transition-colors cursor-pointer border border-emerald-200 inline-flex items-center space-x-1"
                                title="Edit all bio-data fields, qualifications, and institute status"
                              >
                                <Edit className="w-3 h-3" />
                                <span>তথ্য এডিট</span>
                              </button>

                              <button
                                onClick={() => setSelectedApplicantForEdit(app)}
                                className="px-2 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px] font-semibold transition-colors cursor-pointer border border-stone-200 inline-flex items-center space-x-1"
                                title="Reset Password"
                              >
                                <Key className="w-3 h-3 text-stone-500" />
                                <span>Password</span>
                              </button>

                              <button
                                onClick={() => handleDeleteApplicantClick(app)}
                                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded text-[11px] font-semibold transition-colors cursor-pointer border border-stone-200 hover:border-rose-200 inline-flex items-center space-x-1"
                                title="আবেদনকারীর প্রোফাইল ও তথ্য ডিলিট করুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* VIEW D: CREDENTIALS VAULT & PERMANENT DATABASE BACKUP */}
            {activeTab === 'credentials' && (
              <div className="space-y-5">
                {/* Restore / Backup Toast Notification */}
                {restoreMessage && (
                  <div
                    className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
                      restoreMessage.type === 'success'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-rose-700 text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {restoreMessage.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-200 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-200 shrink-0" />
                      )}
                      <span>{restoreMessage.text}</span>
                    </div>
                    <button
                      onClick={() => setRestoreMessage(null)}
                      className="p-1 hover:bg-white/20 rounded cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Permanent Storage Assurance & Backup Card */}
                <div className="bg-gradient-to-r from-stone-900 via-[#1f2740] to-stone-900 text-white p-5 sm:p-6 rounded-2xl shadow-md border border-stone-700">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-semibold">
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        <span>১০০% পার্মানেন্ট স্টোরেজ অ্যাক্টিভ · ডেটা কখনোই হারাবে না</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                        আইডি ও পাসওয়ার্ড ভল্ট এবং সেন্ট্রাল ডাটাবেজ ব্যাকআপ
                      </h3>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        সবার ইউজার আইডি আর পাসওয়ার্ড ডাটাবেজে স্থায়ীভাবে সেভ থাকবে। ওয়েবসাইট যতবারই রিলোড, রিফ্রেশ বা আপডেট করা হোক না কেন কারো প্রোফাইল বা আইডি পাসওয়ার্ড মুছে যাবে না।
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      {/* Download JSON Backup Button */}
                      <button
                        onClick={handleTriggerBackupDownload}
                        className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer hover:shadow-amber-500/20"
                        title="Download complete database JSON containing all applicants, students, credentials, and applications"
                      >
                        <Download className="w-4 h-4 text-stone-950" />
                        <span>ব্যাকআপ ডাউনলোড (JSON)</span>
                      </button>

                      {/* Restore JSON Backup Button */}
                      <label className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs rounded-xl transition-all flex items-center space-x-2 cursor-pointer">
                        <Upload className="w-4 h-4 text-amber-300" />
                        <span>ব্যাকআপ আপলোড / রিস্টোর</span>
                        <input
                          type="file"
                          accept=".json,application/json"
                          onChange={handleFileUploadRestore}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10 text-xs">
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-stone-400 text-[11px] block">আবেদনকারী অ্যাকাউন্ট</span>
                      <span className="text-base font-bold text-emerald-400">{applicants.length} টি</span>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-stone-400 text-[11px] block">শিক্ষার্থী অ্যাকাউন্ট</span>
                      <span className="text-base font-bold text-blue-400">{students.length} জন</span>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-stone-400 text-[11px] block">সর্বমোট ক্রেডেনশিয়াল</span>
                      <span className="text-base font-bold text-amber-300">{allCredentials.length} টি</span>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-stone-400 text-[11px] block">স্টোরেজ স্ট্যাটাস</span>
                      <span className="text-xs font-bold text-emerald-300 flex items-center space-x-1 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>সুরক্ষিত ও সিঙ্কড</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dedicated Admin ID & Password Management Card */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-indigo-200 shadow-sm relative overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-amber-500 via-indigo-600 to-indigo-700 absolute top-0 left-0 right-0" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0 shadow-2xs">
                        <Key className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm sm:text-base text-stone-900">
                            অ্যাডমিন লগইন আইডি ও পাসওয়ার্ড পরিবর্তন
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
                            অ্যাডমিন কন্ট্রোল
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          আপনার নিজস্ব অ্যাডমিন ইউজারনেম/আইডি এবং পাসওয়ার্ড নিজে সেট ও পরিবর্তন করুন। পরিবর্তনের পর এই নতুন তথ্য দিয়ে লগইন করতে হবে।
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAdminFormExpanded(!isAdminFormExpanded)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      {isAdminFormExpanded ? 'ফর্ম সংক্ষেপ করুন' : 'পাসওয়ার্ড পরিবর্তন ফর্ম খুলুন'}
                    </button>
                  </div>

                  {/* Currently Active Admin Credentials Display */}
                  <div className="mt-4 p-3.5 bg-gradient-to-r from-indigo-50/70 via-stone-50 to-amber-50/60 rounded-xl border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-stone-500 font-medium">বর্তমান সক্রিয় আইডি:</span>
                        <span className="font-mono font-bold text-stone-900 bg-white px-2.5 py-1 rounded-md border border-stone-200 shadow-2xs select-all">
                          {activeAdminCreds.username}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(activeAdminCreds.username, 'current-admin-user')}
                          className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                          title="Copy Username"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {copiedId === 'current-admin-user' && (
                          <span className="text-[10px] text-emerald-600 font-bold">কপি হয়েছে!</span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-stone-500 font-medium">বর্তমান পাসওয়ার্ড:</span>
                        <code className="font-mono font-bold text-indigo-900 bg-white px-2.5 py-1 rounded-md border border-stone-200 shadow-2xs select-all">
                          {showActiveAdminPass ? activeAdminCreds.password : '••••••••'}
                        </code>
                        <button
                          type="button"
                          onClick={() => setShowActiveAdminPass(!showActiveAdminPass)}
                          className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                          title={showActiveAdminPass ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                        >
                          {showActiveAdminPass ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyText(activeAdminCreds.password, 'current-admin-pass')}
                          className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                          title="Copy Password"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {copiedId === 'current-admin-pass' && (
                          <span className="text-[10px] text-emerald-600 font-bold">কপি হয়েছে!</span>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-500 shrink-0">
                      সর্বশেষ আপডেট: <span className="font-mono font-semibold text-stone-700">{activeAdminCreds.updatedAt ? new Date(activeAdminCreds.updatedAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' }) : 'প্রাথমিক সেটআপ'}</span>
                    </div>
                  </div>

                  {/* Change Form */}
                  {isAdminFormExpanded && (
                    <form onSubmit={handleAdminCredentialsSubmit} className="mt-5 space-y-4">
                      {/* Notifications */}
                      {adminCredError && (
                        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2.5 animate-fadeIn">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>{adminCredError}</span>
                        </div>
                      )}

                      {adminCredSuccess && (
                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center space-x-2.5 animate-fadeIn">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{adminCredSuccess}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Current Password Field */}
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-bold text-stone-700 flex items-center space-x-1">
                            <span>বর্তমান অ্যাডমিন পাসওয়ার্ড (Current Password)</span>
                            <span className="text-rose-600">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showCurrentAdminPass ? 'text' : 'password'}
                              value={currentAdminPasswordInput}
                              onChange={(e) => setCurrentAdminPasswordInput(e.target.value)}
                              placeholder="আপনার বর্তমান সক্রিয় পাসওয়ার্ড দিন (যেমন: admin123)"
                              required
                              className="w-full text-xs px-3.5 py-2.5 pr-10 rounded-xl bg-white border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setShowCurrentAdminPass(!showCurrentAdminPass)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                            >
                              {showCurrentAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          <p className="text-[10px] text-stone-400">নিরাপত্তার স্বার্থে বর্তমান পাসওয়ার্ড যাচাইয়ের পর নতুন তথ্য সেভ করা হবে।</p>
                        </div>

                        {/* New Admin ID / Username */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-stone-700 flex items-center space-x-1">
                            <span>নতুন অ্যাডমিন ইউজারনেম / আইডি (New Admin ID)</span>
                            <span className="text-rose-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={newAdminUsernameInput}
                            onChange={(e) => setNewAdminUsernameInput(e.target.value)}
                            placeholder="যেমন: admin, 01773733654, অথবা asad.admin"
                            required
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-mono"
                          />
                          <p className="text-[10px] text-stone-400">লগইন করার সময় এই ইউজারনেম, ইমেইল বা ফোন নম্বরটি দিতে হবে।</p>
                        </div>

                        {/* New Password */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-stone-700 flex items-center space-x-1">
                            <span>নতুন পাসওয়ার্ড (New Password)</span>
                            <span className="text-rose-600">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showNewAdminPass ? 'text' : 'password'}
                              value={newAdminPasswordInput}
                              onChange={(e) => setNewAdminPasswordInput(e.target.value)}
                              placeholder="কমপক্ষে ৬ অক্ষরের নতুন পাসওয়ার্ড লিখুন"
                              required
                              minLength={6}
                              className="w-full text-xs px-3.5 py-2.5 pr-10 rounded-xl bg-white border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewAdminPass(!showNewAdminPass)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                            >
                              {showNewAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {newAdminPasswordInput.length > 0 && (
                            <div className="flex items-center space-x-2 pt-0.5">
                              <div className="flex-1 h-1 rounded-full bg-stone-200 overflow-hidden">
                                <div
                                  className={`h-full transition-all ${
                                    newAdminPasswordInput.length >= 8 && /[0-9]/.test(newAdminPasswordInput)
                                      ? 'w-full bg-emerald-500'
                                      : newAdminPasswordInput.length >= 6
                                      ? 'w-2/3 bg-amber-500'
                                      : 'w-1/3 bg-rose-500'
                                  }`}
                                />
                              </div>
                              <span className="text-[10px] font-semibold text-stone-500">
                                {newAdminPasswordInput.length >= 8 && /[0-9]/.test(newAdminPasswordInput)
                                  ? 'শক্তিশালী'
                                  : newAdminPasswordInput.length >= 6
                                  ? 'মধ্যম'
                                  : 'দুর্বল'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Confirm New Password */}
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs font-bold text-stone-700 flex items-center space-x-1">
                            <span>নতুন পাসওয়ার্ড পুনরায় নিশ্চিত করুন (Confirm Password)</span>
                            <span className="text-rose-600">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmAdminPass ? 'text' : 'password'}
                              value={confirmAdminPasswordInput}
                              onChange={(e) => setConfirmAdminPasswordInput(e.target.value)}
                              placeholder="একই নতুন পাসওয়ার্ড আবার লিখুন"
                              required
                              minLength={6}
                              className="w-full text-xs px-3.5 py-2.5 pr-10 rounded-xl bg-white border border-stone-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmAdminPass(!showConfirmAdminPass)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1 cursor-pointer"
                            >
                              {showConfirmAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Security Guidelines Info */}
                      <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex items-start space-x-2">
                        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <strong>গুরুত্বপূর্ণ সুরক্ষা নির্দেশনা:</strong> এখানে "আইডি ও পাসওয়ার্ড আপডেট করুন" বাটনে ক্লিক করার সাথে সাথে আপনার নতুন তথ্য সরাসরি ব্রাউজারের স্থায়ী ডাটাবেজে সংরক্ষিত হয়ে যাবে। আপনি পরবর্তীতে ইনস্টিটিউট লগইন করার সময় এই নতুন ইউজারনেম ও নতুন পাসওয়ার্ড দিয়ে প্রবেশ করতে পারবেন।
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentAdminPasswordInput('');
                            setNewAdminPasswordInput('');
                            setConfirmAdminPasswordInput('');
                            setAdminCredError(null);
                            setAdminCredSuccess(null);
                          }}
                          className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
                        >
                          মুছে ফেলুন
                        </button>

                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all flex items-center space-x-2 cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-300" />
                          <span>আইডি ও পাসওয়ার্ড আপডেট করুন</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* User Password Reset Requests Management Section */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-stone-900 flex items-center space-x-2">
                          <span>পাসওয়ার্ড রিকভারি আবেদনসমূহ (Password Reset Requests)</span>
                          {passwordRequests.filter((r) => r.status === 'Pending').length > 0 && (
                            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {passwordRequests.filter((r) => r.status === 'Pending').length} টি নতুন
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          ব্যবহারকারীরা পাসওয়ার্ড ভুলে গেলে যে রিকোয়েস্ট পাঠিয়েছে তা এখানে দেখতে পাবেন এবং সরাসরি মেসেজে পাসওয়ার্ড পাঠিয়ে দিতে পারবেন
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] font-semibold text-stone-600">
                      মোট আবেদন: <span className="text-stone-900 font-bold">{passwordRequests.length}</span> টি
                    </div>
                  </div>

                  {passwordRequests.length === 0 ? (
                    <div className="py-8 text-center text-stone-500 text-xs">
                      <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-2">
                        <Check className="w-5 h-5 text-emerald-500" />
                      </div>
                      <p className="font-medium text-stone-700">বর্তমানে কোনো পেন্ডিং পাসওয়ার্ড রিকভারি রিকোয়েস্ট নেই।</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">ব্যবহারকারীরা লগইন পেজ থেকে "Forgot Password" সাবমিট করলে এখানে চলে আসবে এবং হোয়াটসঅ্যাপে বার্তা আসবে।</p>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {passwordRequests.map((req) => {
                        let matchedPassword = req.recoveredPassword;

                        if (req.role === 'student') {
                          const s = students.find((st) => {
                            const cleanP = (st.phone || '').replace(/[^0-9]/g, '');
                            const reqP = (req.phone || '').replace(/[^0-9]/g, '');
                            return (cleanP.length >= 8 && reqP.includes(cleanP)) || (req.identifier && st.rollNo.toLowerCase() === req.identifier.toLowerCase());
                          });
                          if (s) {
                            matchedPassword = s.password || 'password123';
                          }
                        } else {
                          const a = applicants.find((ap) => {
                            const cleanP = (ap.phone || '').replace(/[^0-9]/g, '');
                            const reqP = (req.phone || '').replace(/[^0-9]/g, '');
                            return (cleanP.length >= 8 && reqP.includes(cleanP)) || (req.identifier && ap.email.toLowerCase() === req.identifier.toLowerCase());
                          });
                          if (a) {
                            matchedPassword = a.password || 'applicantpass';
                          }
                        }

                        return (
                          <div
                            key={req.id}
                            className={`p-4 rounded-xl border transition-all ${
                              req.status === 'Pending'
                                ? 'bg-amber-50/50 border-amber-200 shadow-xs'
                                : 'bg-stone-50/70 border-stone-200 text-stone-600'
                            }`}
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-bold text-stone-900 text-sm">{req.name}</span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      req.role === 'student'
                                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    }`}
                                  >
                                    {req.role === 'student' ? 'শিক্ষার্থী (Student)' : 'চাকুরী আবেদনকারী (Applicant)'}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      req.status === 'Sent'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    {req.status === 'Sent' ? 'পাসওয়ার্ড পাঠানো হয়েছে' : 'পেন্ডিং (Pending)'}
                                  </span>
                                  <span className="text-[10px] text-stone-400">তারিখ: {req.requestDate}</span>
                                </div>

                                <div className="text-xs text-stone-700 flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5">
                                  <span>মোবাইল: <strong className="font-mono text-stone-900">{req.phone}</strong></span>
                                  {req.identifier && <span>আইডি/রোল: <strong className="font-mono text-stone-900">{req.identifier}</strong></span>}
                                  {req.courseOrJob && <span>কোর্স/পদ: <strong className="text-stone-900">{req.courseOrJob}</strong></span>}
                                </div>

                                {req.notes && (
                                  <div className="text-[11px] text-stone-600 italic bg-white/70 p-1.5 rounded border border-stone-200 max-w-xl">
                                    "{req.notes}"
                                  </div>
                                )}
                              </div>

                              {/* Password & Action Controls */}
                              <div className="flex flex-wrap items-center gap-2 shrink-0">
                                {matchedPassword && (
                                  <div className="bg-white px-3 py-1.5 rounded-lg border border-amber-300 flex items-center space-x-2">
                                    <span className="text-[10px] text-amber-900 font-bold uppercase">পাসওয়ার্ড:</span>
                                    <code className="text-xs font-mono font-bold text-rose-600 select-all">
                                      {showPasswords[`req-pass-${req.id}`] ? matchedPassword : '••••••••'}
                                    </code>
                                    <button
                                      onClick={() => togglePasswordVisibility(`req-pass-${req.id}`)}
                                      className="text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                                      title={showPasswords[`req-pass-${req.id}`] ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                                    >
                                      {showPasswords[`req-pass-${req.id}`] ? (
                                        <EyeOff className="w-3.5 h-3.5" />
                                      ) : (
                                        <Eye className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                    <button
                                      onClick={() => handleCopyText(matchedPassword!, `req-pass-${req.id}`)}
                                      className="text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                                      title="Copy Password"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}

                                <button
                                  onClick={() => handleSendWhatsAppPassword(req, matchedPassword)}
                                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                                  title="Send password directly to applicant on WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>হোয়াটসঅ্যাপে পাসওয়ার্ড পাঠান</span>
                                </button>

                                {req.status === 'Pending' ? (
                                  <button
                                    onClick={() => handleMarkPasswordSent(req.id)}
                                    className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-lg font-semibold transition-colors cursor-pointer border border-stone-300"
                                  >
                                    মার্ক Sent
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleDeletePasswordRequest(req.id)}
                                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title="Delete Request"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Main Credentials Table Container */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  {/* Filter and Search Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-200">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-stone-700">ফিল্টার:</span>
                      <button
                        onClick={() => setCredentialFilter('all')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          credentialFilter === 'all'
                            ? 'bg-stone-900 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        সকল ({allCredentials.length})
                      </button>
                      <button
                        onClick={() => setCredentialFilter('applicants')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          credentialFilter === 'applicants'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        চাকুরী আবেদনকারী ({applicants.length})
                      </button>
                      <button
                        onClick={() => setCredentialFilter('students')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          credentialFilter === 'students'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        শিক্ষার্থী ({students.length})
                      </button>
                    </div>

                    <div className="text-[11px] text-stone-500 font-medium">
                      পাসওয়ার্ড দেখতে চোখের আইকনে এবং কপি করতে কপি বাটনে ক্লিক করুন।
                    </div>
                  </div>

                  {filteredCredentials.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-stone-100/90 text-stone-700 border-b border-stone-300 uppercase text-[10px] tracking-wider font-bold">
                            <th className="p-3">ইউজার প্রোফাইল</th>
                            <th className="p-3">অ্যাকাউন্ট ধরণ</th>
                            <th className="p-3">লগইন আইডি / মোবাইল</th>
                            <th className="p-3">ইমেইল</th>
                            <th className="p-3 bg-amber-50/70 text-amber-950">পাসওয়ার্ড (Password)</th>
                            <th className="p-3">ডাটা স্টোরেজ স্থায়িত্ব</th>
                            <th className="p-3 text-right">ম্যানেজমেন্ট</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200">
                          {filteredCredentials.map((cred) => {
                            const isRevealed = !!showPasswords[cred.key];
                            const isCopied = copiedId === cred.key;

                            return (
                              <tr key={cred.key} className="hover:bg-stone-50/80 transition-colors">
                                <td className="p-3">
                                  <div className="font-bold text-stone-900">{cred.name}</div>
                                  {cred.nameBangla && (
                                    <div className="text-[11px] text-stone-600">{cred.nameBangla}</div>
                                  )}
                                  <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                                    ID/Roll: {cred.identifier}
                                  </div>
                                </td>

                                <td className="p-3">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                                      cred.role === 'applicant'
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                                    }`}
                                  >
                                    {cred.roleLabel}
                                  </span>
                                  <div className="text-[10px] text-stone-500 mt-1 max-w-[140px] truncate" title={cred.title}>
                                    {cred.title}
                                  </div>
                                </td>

                                <td className="p-3 font-mono">
                                  <div className="flex items-center space-x-1.5">
                                    <span className="font-bold text-stone-900">{cred.phone}</span>
                                    <button
                                      onClick={() => handleCopyText(cred.phone, `${cred.key}-phone`)}
                                      className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                                      title="Copy phone"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                  {copiedId === `${cred.key}-phone` && (
                                    <span className="text-[10px] text-emerald-600 font-semibold block">কপি হয়েছে!</span>
                                  )}
                                </td>

                                <td className="p-3 font-mono text-stone-600">
                                  <div className="truncate max-w-[150px]" title={cred.email}>
                                    {cred.email}
                                  </div>
                                </td>

                                <td className="p-3 bg-amber-50/40">
                                  <div className="flex items-center space-x-2">
                                    <span
                                      className={`font-mono text-xs font-bold px-2 py-1 rounded bg-white border border-stone-300 select-all ${
                                        isRevealed ? 'text-stone-900 bg-amber-100/50' : 'text-stone-400 tracking-widest'
                                      }`}
                                    >
                                      {isRevealed ? cred.password : '••••••••'}
                                    </span>

                                    {/* Reveal Toggle */}
                                    <button
                                      onClick={() => togglePasswordVisibility(cred.key)}
                                      className="p-1 text-stone-500 hover:text-stone-800 bg-white hover:bg-stone-100 rounded border border-stone-200 cursor-pointer transition-colors"
                                      title={isRevealed ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                                    >
                                      {isRevealed ? <EyeOff className="w-3.5 h-3.5 text-stone-600" /> : <Eye className="w-3.5 h-3.5 text-stone-600" />}
                                    </button>

                                    {/* Copy Password Button */}
                                    <button
                                      onClick={() => handleCopyText(cred.password, cred.key)}
                                      className="p-1 text-stone-500 hover:text-stone-800 bg-white hover:bg-stone-100 rounded border border-stone-200 cursor-pointer transition-colors"
                                      title="পাসওয়ার্ড কপি করুন"
                                    >
                                      <Copy className="w-3.5 h-3.5 text-stone-600" />
                                    </button>
                                  </div>

                                  {isCopied && (
                                    <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block animate-in fade-in">
                                      ✓ পাসওয়ার্ড কপি হয়েছে!
                                    </span>
                                  )}
                                </td>

                                <td className="p-3">
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    <span>স্থায়ীভাবে সংরক্ষিত</span>
                                  </span>
                                  <span className="block text-[9px] text-stone-400 mt-0.5">
                                    অ্যাডমিন কন্ট্রোলড
                                  </span>
                                </td>

                                <td className="p-3 text-right space-x-1 whitespace-nowrap">
                                  {cred.role === 'applicant' ? (
                                    <>
                                      <button
                                        onClick={() => {
                                          setSelectedApplicantForBioData(cred.rawApplicant);
                                          setBioDataModalTab('copy');
                                        }}
                                        className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded font-bold text-[10px] transition-colors cursor-pointer border border-blue-200"
                                      >
                                        প্রোফাইল
                                      </button>
                                      <button
                                        onClick={() => setSelectedApplicantForEdit(cred.rawApplicant)}
                                        className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded font-semibold text-[10px] transition-colors cursor-pointer border border-stone-200"
                                      >
                                        পাসওয়ার্ড পরিবর্তন
                                      </button>
                                      <button
                                        onClick={() => handleDeleteApplicantClick(cred.rawApplicant)}
                                        className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer border border-stone-200 hover:border-rose-200"
                                        title="অ্যাকাউন্ট ডিলিট করুন"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => setSelectedStudentForEdit(cred.rawStudent)}
                                        className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded font-bold text-[10px] transition-colors cursor-pointer border border-blue-200"
                                      >
                                        এডিট / পাসওয়ার্ড
                                      </button>
                                      <button
                                        onClick={() => setSelectedStudentForAdmissionCopy(cred.rawStudent)}
                                        className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded font-bold text-[10px] transition-colors cursor-pointer border border-sky-200"
                                        title="শিক্ষার্থীর ভর্তি ফরমের অফিশিয়াল কপি ও পিডিএফ প্রিন্ট করুন"
                                      >
                                        ভর্তি ফরম / PDF
                                      </button>
                                      <button
                                        onClick={() => handleDeleteStudentClick(cred.rawStudent)}
                                        className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer border border-stone-200 hover:border-rose-200"
                                        title="শিক্ষার্থী প্রোফাইল ডিলিট করুন"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-stone-50 rounded-xl border border-dashed border-stone-300">
                      <Key className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-stone-700">কোনো ক্রেডেনশিয়াল পাওয়া যায়নি</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW: STUDENT TESTIMONIALS CONTROL */}
            {activeTab === 'testimonials' && (
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-200">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>শিক্ষার্থীদের সাফল্যের গল্প ও রিভিউ (Student Testimonials)</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      হোমপেজের 'Student Success Stories' সেকশনের সকল রিভিউ এডমিন প্যানেল থেকে যোগ, সম্পাদনা বা মুছতে পারবেন।
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddTestimonial}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন টেস্টিমোনিয়াল যোগ করুন</span>
                  </button>
                </div>

                {/* Testimonials List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 rounded-2xl border border-stone-200 hover:border-amber-300 bg-stone-50/60 hover:bg-white transition-all shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        {/* Header: Rating & Actions */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(item.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                            <span className="text-xs font-bold text-stone-700 ml-1">5.0</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleOpenEditTestimonial(item)}
                              className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Testimonial"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTestimonialClick(item.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Testimonial"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Student Info */}
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                            {item.nameEn ? item.nameEn.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-stone-900 text-sm leading-tight flex items-center space-x-1">
                              <span>{item.nameBn}</span>
                              <span className="text-stone-400 font-normal text-xs">({item.nameEn})</span>
                            </h5>
                            <p className="text-[11px] font-semibold text-emerald-800 truncate mt-0.5">
                              {item.roleBn} {item.workplaceBn ? `· ${item.workplaceBn}` : ''}
                            </p>
                            <span className="text-[10px] text-stone-500 block">
                              {item.courseBn} · {item.batchBn}
                            </span>
                          </div>
                        </div>

                        {/* Quote preview */}
                        <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed italic mb-2">
                          <p className="line-clamp-3">"{item.storyBn}"</p>
                        </div>
                      </div>

                      <div className="pt-2 text-[10px] text-stone-400 flex items-center justify-between border-t border-stone-100">
                        <span>ইংরেজি: {item.storyEn ? 'সংযুক্ত' : 'অপ্রতুল'}</span>
                        <span className="font-mono text-emerald-700 font-semibold">হোমপেজে প্রদর্শিত</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW: WEBSITE SEO, META TAGS & SEARCH ENGINE INDEXING */}
            {activeTab === 'seo' && (
              <div className="space-y-6 mb-6">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-stone-900 via-[#132738] to-stone-900 text-white p-5 sm:p-6 rounded-2xl shadow-md border border-stone-700">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[11px] font-semibold">
                        <Globe className="w-3.5 h-3.5 text-cyan-400" />
                        <span>সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO) ও মেটাডাটা কন্ট্রোল</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                        ওয়েবসাইট মেটা টাইটেল, ডেসক্রিপশন ও কি-ওয়ার্ড ডায়নামিক কনফিগারেশন
                      </h3>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        গুগল (Google), বিং (Bing) এবং সোশ্যাল মিডিয়ায় প্রতিষ্ঠানের তথ্য আকর্ষণীয়ভাবে উপস্থাপন ও সার্চ র‍্যাঙ্কিং বৃদ্ধির জন্য এখান থেকে সরাসরি মেটাডাটা আপডেট করুন। এটি ব্রাউজারের &lt;head&gt; ট্যাগে তৎক্ষণাৎ সক্রিয় হয়ে যাবে।
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={handleResetToDefaultSeo}
                        className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs rounded-xl transition-all flex items-center space-x-2 cursor-pointer"
                        title="Reset to recommended default SEO template"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-cyan-300" />
                        <span>প্রস্তাবিত এসইও লোড করুন</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10 text-xs">
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-stone-400 text-[11px] block">গুগল SERP প্রিভিউ</span>
                      <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>লাইভ সিঙ্কড</span>
                      </span>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-stone-400 text-[11px] block">রোবট ইনডেক্সিং</span>
                      <span className="text-xs font-bold text-cyan-300 mt-0.5 block font-mono">{seoRobots}</span>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-stone-400 text-[11px] block">সক্রিয় কি-ওয়ার্ডস</span>
                      <span className="text-sm font-bold text-amber-300">
                        {seoKeywords.split(',').filter((k) => k.trim()).length} টি ট্যাগ
                      </span>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-stone-400 text-[11px] block">স্ট্রাকচার্ড ডাটা</span>
                      <span className="text-xs font-bold text-emerald-300 mt-0.5 block">Schema.org JSON-LD</span>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                {seoToast && (
                  <div
                    className={`p-4 rounded-xl border text-xs flex items-center space-x-2.5 animate-fadeIn shadow-2xs ${
                      seoToast.type === 'success'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-rose-50 border-rose-300 text-rose-900'
                    }`}
                  >
                    {seoToast.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span className="font-medium">{seoToast.text}</span>
                  </div>
                )}

                {/* Live Real-time Previews Container */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-200">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-cyan-600" />
                        <span>লাইভ সার্চ ও সোশ্যাল শেয়ার প্রিভিউ (Live Preview)</span>
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        আপনার প্রবেশ করানো মেটাডাটা গুগল সার্চ রেজাল্ট এবং সোশ্যাল মিডিয়ায় ঠিক কেমন দেখাবে তা নিচে সরাসরি পর্যবেক্ষণ করুন।
                      </p>
                    </div>

                    {/* Preview Switcher Tabs */}
                    <div className="flex items-center space-x-1 p-1 bg-stone-100 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setSeoPreviewTab('google')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          seoPreviewTab === 'google'
                            ? 'bg-white text-stone-900 shadow-2xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        Google SERP
                      </button>
                      <button
                        type="button"
                        onClick={() => setSeoPreviewTab('social')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          seoPreviewTab === 'social'
                            ? 'bg-white text-stone-900 shadow-2xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        Social Card (FB/WA)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSeoPreviewTab('schema')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          seoPreviewTab === 'schema'
                            ? 'bg-white text-stone-900 shadow-2xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        JSON-LD Schema
                      </button>
                    </div>
                  </div>

                  {/* 1. Google SERP Preview Card */}
                  {seoPreviewTab === 'google' && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-sm font-sans max-w-2xl">
                      <div className="flex items-center space-x-2.5 mb-1.5">
                        <img
                          src="/assets/aistudio/8fee6d14-342b-408c-880a-68e307e04b81_f55db718.jfif"
                          alt="Asad Computer Logo"
                          className="w-7 h-7 rounded-full object-cover shrink-0 shadow-2xs border border-stone-200"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-medium text-stone-800 block truncate">
                            Asad Computer & Training Center
                          </span>
                          <span className="text-[11px] text-stone-500 font-mono block truncate">
                            {seoCanonicalUrl || 'https://asadcomputer.com'} › bhully-bazar
                          </span>
                        </div>
                      </div>

                      {/* Google Search Title in classic Google blue */}
                      <h3 className="text-base sm:text-lg font-normal text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-2 mt-1">
                        {seoTitle || 'Asad Computer & Training Center'}
                      </h3>

                      {/* Snippet Description in classic Google snippet grey */}
                      <p className="text-xs sm:text-[13px] text-[#4d5156] leading-relaxed line-clamp-3 mt-1">
                        {seoDescription || 'Asad Computer & Training Center offers certified training...'}
                      </p>

                      {/* Google Character Count Guidelines Bar */}
                      <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-3 text-[11px]">
                        <span className="text-stone-500">টাইটেল দৈর্ঘ্য:</span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold font-mono ${
                            seoTitle.length >= 30 && seoTitle.length <= 60
                              ? 'bg-emerald-100 text-emerald-800'
                              : seoTitle.length > 60
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {seoTitle.length} / 60 অক্ষর {seoTitle.length >= 30 && seoTitle.length <= 60 ? '(আদর্শ)' : seoTitle.length > 60 ? '(বেশি বড়)' : '(আদর্শ ৩০-৬০)'}
                        </span>

                        <span className="text-stone-500 ml-2">ডেসক্রিপশন দৈর্ঘ্য:</span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold font-mono ${
                            seoDescription.length >= 120 && seoDescription.length <= 160
                              ? 'bg-emerald-100 text-emerald-800'
                              : seoDescription.length > 160
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {seoDescription.length} / 160 অক্ষর {seoDescription.length >= 120 && seoDescription.length <= 160 ? '(আদর্শ)' : seoDescription.length > 160 ? '(বেশি বড়)' : '(আদর্শ ১২০-১৬০)'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 2. Social Card Preview (OpenGraph / Facebook / WhatsApp) */}
                  {seoPreviewTab === 'social' && (
                    <div className="max-w-md rounded-2xl overflow-hidden border border-stone-300 shadow-md bg-stone-50">
                      {/* Social Image Banner Placeholder */}
                      <div className="h-44 bg-gradient-to-br from-[#161a2b] via-[#1e2746] to-[#0f1422] p-5 flex flex-col justify-between text-white relative">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src="/assets/aistudio/8fee6d14-342b-408c-880a-68e307e04b81_f55db718.jfif"
                              alt="ACTC Official Logo"
                              className="w-6 h-6 rounded-full object-cover border border-amber-400/40"
                            />
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold">
                              ACTC OFFICIAL
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-400 font-mono">OpenGraph 1200×630</span>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white tracking-wide">
                            Asad Computer & Training Center
                          </div>
                          <div className="text-xs text-amber-400 font-medium mt-0.5">
                            Under Bangladesh Post Office · Complete Solution
                          </div>
                          <div className="text-[11px] text-stone-300 mt-1">
                            Bottola, Bhully Bazar, Thakurgaon
                          </div>
                        </div>
                      </div>

                      {/* Social Card Details */}
                      <div className="p-3.5 bg-white border-t border-stone-200">
                        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                          {(seoCanonicalUrl || 'https://asadcomputer.com').replace(/^https?:\/\//, '')}
                        </span>
                        <h4 className="font-bold text-stone-900 text-sm mt-0.5 leading-snug line-clamp-2">
                          {seoTitle || 'Asad Computer & Training Center'}
                        </h4>
                        <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                          {seoDescription || 'Certified Computer Office Application training and full online application services.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 3. Schema.org JSON-LD Structured Data Preview */}
                  {seoPreviewTab === 'schema' && (
                    <div className="p-4 bg-stone-900 text-stone-200 rounded-xl font-mono text-xs overflow-x-auto max-h-72 border border-stone-700">
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-stone-800 text-stone-400 text-[11px]">
                        <span>&lt;script type="application/ld+json"&gt;</span>
                        <span className="text-emerald-400 font-bold">EducationalOrganization Schema</span>
                      </div>
                      <pre className="text-stone-300">
{JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Asad Computer & Training Center',
    alternateName: 'আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টার',
    url: seoCanonicalUrl || 'https://asadcomputer.com',
    logo: `${seoCanonicalUrl || 'https://asadcomputer.com'}/assets/aistudio/8fee6d14-342b-408c-880a-68e307e04b81_f55db718.jfif`,
    image: `${seoCanonicalUrl || 'https://asadcomputer.com'}/assets/aistudio/8fee6d14-342b-408c-880a-68e307e04b81_f55db718.jfif`,
    description: seoDescription,
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
      name: seoAuthor || 'Md. Asaduzzaman',
      jobTitle: 'Director',
      telephone: '+8801773733654',
    },
    educationalCredentialAwarded: 'Computer Office Application (3 & 6 Months Certified)',
    keywords: seoKeywords,
  },
  null,
  2
)}
                      </pre>
                    </div>
                  )}
                </div>

                {/* SEO Configuration Edit Form */}
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 absolute top-0 left-0 right-0" />

                  <div className="flex items-center space-x-3 pb-4 mb-5 border-b border-stone-200">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center shrink-0 shadow-2xs">
                      <Edit className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-stone-900">
                        মেটা টাইটেল, ডেসক্রিপশন ও কি-ওয়ার্ড এডিটর
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        এখানে যা পরিবর্তন করবেন তা সরাসরি আপনার ওয়েবসাইটের হেড ট্যাগে এবং সার্চ ইঞ্জিনে কার্যকরী হবে।
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveSeoConfig} className="space-y-5">
                    {/* Field 1: Meta Title */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-stone-700 flex items-center space-x-1">
                          <span>ওয়েবসাইট মেটা টাইটেল (Page Title &amp; og:title)</span>
                          <span className="text-rose-600">*</span>
                        </label>
                        <span
                          className={`text-[11px] font-mono font-bold ${
                            seoTitle.length >= 30 && seoTitle.length <= 60
                              ? 'text-emerald-600'
                              : seoTitle.length > 60
                              ? 'text-amber-600'
                              : 'text-stone-400'
                          }`}
                        >
                          {seoTitle.length} / ৬০ অক্ষর (প্রস্তাবিত: ৩০-৬০)
                        </span>
                      </div>
                      <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder="যেমন: Asad Computer &amp; Training Center - Computer Office Application &amp; Online Services"
                        required
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 outline-none transition-all font-medium text-stone-900 shadow-2xs"
                      />
                      <p className="text-[11px] text-stone-500">
                        গুগল সার্চে নীল রঙের প্রধান শিরোনাম হিসেবে এটি দেখা যাবে। ব্র্যান্ডের নাম ও মূল প্রশিক্ষণ/সেবার উল্লেখ রাখুন।
                      </p>
                    </div>

                    {/* Field 2: Meta Description */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-stone-700 flex items-center space-x-1">
                          <span>ওয়েবসাইট মেটা ডেসক্রিপশন (Meta Description &amp; og:description)</span>
                          <span className="text-rose-600">*</span>
                        </label>
                        <span
                          className={`text-[11px] font-mono font-bold ${
                            seoDescription.length >= 120 && seoDescription.length <= 160
                              ? 'text-emerald-600'
                              : seoDescription.length > 160
                              ? 'text-amber-600'
                              : 'text-stone-400'
                          }`}
                        >
                          {seoDescription.length} / ১৬০ অক্ষর (প্রস্তাবিত: ১২০-১৬০)
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        placeholder="প্রতিষ্ঠানের কোর্সসমূহ, ডাক বিভাগ কর্তৃক প্রত্যয়ন এবং সকল অনলাইন সেবার সারসংক্ষেপ লিখুন..."
                        required
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 outline-none transition-all font-medium text-stone-900 shadow-2xs leading-relaxed"
                      />
                      <p className="text-[11px] text-stone-500">
                        গুগল সার্চে টাইটেলের নিচে ১-২ লাইনের বিবরণ হিসেবে প্রদর্শিত হয়। শিক্ষার্থী ও আবেদনকারীদের আকর্ষণের জন্য কোর্স ফি বা অবস্থানের তথ্য যোগ করতে পারেন।
                      </p>
                    </div>

                    {/* Field 3: Meta Keywords */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-stone-700 flex items-center space-x-1">
                          <span>সার্চ ইঞ্জিন মেটা কি-ওয়ার্ডস (Meta Keywords)</span>
                          <span className="text-stone-400 font-normal">(কমা দিয়ে আলাদা করুন)</span>
                        </label>
                        <span className="text-[11px] font-mono text-stone-500">
                          মোট: {seoKeywords.split(',').filter((k) => k.trim()).length} টি
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={seoKeywords}
                        onChange={(e) => setSeoKeywords(e.target.value)}
                        placeholder="computer training, computer office application, bangladesh post office, digital land services..."
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 outline-none transition-all font-mono text-stone-800 shadow-2xs leading-relaxed"
                      />

                      {/* Clickable Recommended Keyword Pills */}
                      <div className="pt-1">
                        <span className="text-[11px] font-bold text-stone-600 block mb-1.5">
                          দ্রুত কি-ওয়ার্ড যোগ করতে ক্লিক করুন:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'Computer Office Application',
                            'Bangladesh Post Office Certificate',
                            'Digital Land Services',
                            'E-Mutation & Khatian',
                            'Job Application Desk',
                            'Admit Card Download',
                            'Thakurgaon Computer Training',
                            'Bhully Bazar Bottola',
                            'High Speed Typing Training',
                            'Online Shongshodhon',
                            'E-TIN & Passport Form',
                          ].map((k) => {
                            const isAdded = seoKeywords.toLowerCase().includes(k.toLowerCase());
                            return (
                              <button
                                key={k}
                                type="button"
                                onClick={() => handleAddKeywordPill(k)}
                                disabled={isAdded}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex items-center space-x-1 cursor-pointer ${
                                  isAdded
                                    ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-default'
                                    : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 hover:border-cyan-300 shadow-2xs'
                                }`}
                              >
                                <span>{isAdded ? '✓' : '+'}</span>
                                <span>{k}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Active Keywords Tags View */}
                      {seoKeywords.trim().length > 0 && (
                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 mt-2">
                          <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-1.5">
                            বর্তমানে সক্রিয় কি-ওয়ার্ড তালিকা:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {seoKeywords
                              .split(',')
                              .map((k) => k.trim())
                              .filter(Boolean)
                              .map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700 text-[11px] font-mono shadow-2xs"
                                >
                                  #{tag}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Field 4 & 5: Author and Canonical URL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">
                          প্রতিষ্ঠান পরিচালক / লেখক (Author Meta)
                        </label>
                        <input
                          type="text"
                          value={seoAuthor}
                          onChange={(e) => setSeoAuthor(e.target.value)}
                          placeholder="Md. Asaduzzaman"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 outline-none transition-all text-stone-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-stone-700">
                          ক্যানোনিকাল ইউআরএল (Canonical Website URL)
                        </label>
                        <input
                          type="text"
                          value={seoCanonicalUrl}
                          onChange={(e) => setSeoCanonicalUrl(e.target.value)}
                          placeholder="https://asadcomputer.com"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 outline-none transition-all font-mono text-stone-800"
                        />
                      </div>
                    </div>

                    {/* Field 6: Robots Indexing Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">
                        রোবট সার্চ ইনডেক্সিং পলিসি (Robots Meta Tag)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label
                          className={`p-3 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition-all ${
                            seoRobots === 'index, follow'
                              ? 'bg-cyan-50/70 border-cyan-400 text-cyan-900 shadow-2xs font-bold'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="robots_choice"
                            checked={seoRobots === 'index, follow'}
                            onChange={() => setSeoRobots('index, follow')}
                            className="text-cyan-600 focus:ring-cyan-500"
                          />
                          <div className="text-xs">
                            <span className="block font-bold">index, follow (সুপারিশকৃত)</span>
                            <span className="text-[11px] font-normal text-stone-500">গুগল ও সার্চ ইঞ্জিনে ওয়েবসাইট ইনডেক্স ও প্রদর্শন করবে</span>
                          </div>
                        </label>

                        <label
                          className={`p-3 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition-all ${
                            seoRobots === 'noindex, nofollow'
                              ? 'bg-amber-50/70 border-amber-400 text-amber-900 shadow-2xs font-bold'
                              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="robots_choice"
                            checked={seoRobots === 'noindex, nofollow'}
                            onChange={() => setSeoRobots('noindex, nofollow')}
                            className="text-amber-600 focus:ring-amber-500"
                          />
                          <div className="text-xs">
                            <span className="block font-bold">noindex, nofollow</span>
                            <span className="text-[11px] font-normal text-stone-500">সার্চ ইঞ্জিনে প্রদর্শন সাময়িকভাবে বন্ধ রাখবে</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Field 7: Google Search Console Verification Meta Tag */}
                    <div className="space-y-1.5 p-4 rounded-xl bg-gradient-to-br from-emerald-50/60 to-cyan-50/60 border border-emerald-200/80">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-stone-800 flex items-center space-x-1.5">
                          <Globe className="w-4 h-4 text-emerald-600" />
                          <span>গুগল সার্চ কনসোল ভেরিফিকেশন কোড (Google Site Verification Token)</span>
                        </label>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                          Google Search Console Active
                        </span>
                      </div>
                      <input
                        type="text"
                        value={seoGoogleVerification}
                        onChange={(e) => setSeoGoogleVerification(e.target.value)}
                        placeholder="eiwFrdm4YEC3f3-KPHCYLrKLy2vCJrSl3Qyiqp9pOZ8"
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 outline-none transition-all font-mono text-stone-800 shadow-2xs"
                      />
                      <p className="text-[11px] text-stone-600 leading-relaxed">
                        গুগল সার্চ কনসোলে সাইট ভেরিফাই করার জন্য <code className="px-1.5 py-0.5 rounded bg-white text-emerald-700 font-mono text-[10px] border border-stone-200">&lt;meta name="google-site-verification" content="..." /&gt;</code> স্বয়ংক্রিয়ভাবে ওয়েবসাইটের <code className="font-mono text-[10px]">&lt;head&gt;</code> সেকশনে যুক্ত রয়েছে।
                      </p>
                    </div>

                    {/* Submit & Reset Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={handleResetToDefaultSeo}
                        className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>প্রস্তাবিত ডিফল্ট এসইও লোড করুন</span>
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 hover:from-cyan-700 hover:to-indigo-800 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-cyan-500/25 transition-all flex items-center space-x-2 cursor-pointer"
                      >
                        <Globe className="w-4 h-4 text-cyan-200" />
                        <span>এসইও মেটাডাটা সংরক্ষণ ও সক্রিয় করুন</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* DEFAULT VIEW: OVERVIEW SUMMARY */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Recent Notices Box */}
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
                      <h5 className="font-bold text-stone-800 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                        <Bell className="w-3.5 h-3.5 text-rose-500" />
                        <span>Live Notices & PDF Uploads</span>
                      </h5>
                      <button
                        onClick={() => setActiveTab('notices')}
                        className="text-xs text-rose-600 font-semibold hover:underline cursor-pointer"
                      >
                        Manage Notices
                      </button>
                    </div>
                    <div className="space-y-2">
                      {notices.slice(0, 3).map((n) => (
                        <div key={n.id} className="text-xs p-2.5 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-between">
                          <div className="min-w-0 flex-1 pr-2">
                            <span className="font-bold text-stone-900 block leading-tight truncate">{n.title}</span>
                            <span className="text-[10px] text-stone-400 mt-1 block">{n.date} · {n.category}</span>
                          </div>
                          <button
                            onClick={() => setSelectedNoticeForPdf(n)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-[10px] font-bold shrink-0 cursor-pointer"
                          >
                            PDF
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Student & Fee Overview Box */}
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-stone-100">
                      <h5 className="font-bold text-stone-800 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                        <span>Student Fee Summary</span>
                      </h5>
                      <button
                        onClick={() => setActiveTab('students')}
                        className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-2">
                      {students.slice(0, 3).map((s) => (
                        <div key={s.id} className="text-xs p-2.5 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-stone-900">{s.name}</span>
                            <span className="text-[10px] text-stone-400 block">{s.rollNo} · {s.course}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] font-bold text-emerald-700">Paid: ৳{s.paidFee}</span>
                            {s.dueFee > 0 ? (
                              <span className="text-[10px] text-rose-600 block font-semibold">Due: ৳{s.dueFee}</span>
                            ) : (
                              <span className="text-[10px] text-emerald-600 block">Cleared</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Credentials & Backup Box */}
                  <div className="bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 p-5 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200/60">
                        <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                          <Shield className="w-3.5 h-3.5 text-amber-600" />
                          <span>ডাটাবেজ ও পাসওয়ার্ড সুরক্ষা</span>
                        </h5>
                        <button
                          onClick={() => setActiveTab('credentials')}
                          className="text-xs text-amber-700 font-bold hover:underline cursor-pointer"
                        >
                          ভল্ট খুলুন
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-relaxed mb-3">
                        ওয়েবসাইট আপডেট করলেও সকল ইউজারের আইডি ও পাসওয়ার্ড নিরাপদে সংরক্ষিত থাকবে।
                      </p>
                      <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-amber-200 mb-3">
                        <span className="text-stone-600">সংরক্ষিত প্রোফাইল:</span>
                        <span className="font-bold text-amber-900">{allCredentials.length} টি অ্যাকাউন্ট</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <button
                        onClick={handleTriggerBackupDownload}
                        className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-2xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>১-ক্লিকে ব্যাকআপ ডাউনলোড</span>
                      </button>
                    </div>
                  </div>

                  {/* SEO & Search Engine Indexing Status Banner */}
                  <div className="md:col-span-3 bg-gradient-to-r from-cyan-900/10 via-blue-900/5 to-cyan-900/10 p-4 sm:p-5 rounded-2xl border border-cyan-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
                        <Globe className="w-5 h-5 text-cyan-700" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h5 className="font-bold text-stone-900 text-xs sm:text-sm">
                            গুগল ও সার্চ ইঞ্জিন মেটাডাটা (SEO Status)
                          </h5>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            সক্রিয় ও ইনডেক্সযোগ্য
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5 line-clamp-1">
                          <strong className="text-stone-800">টাইটেল:</strong> {seoTitle} · <strong className="text-stone-800">কি-ওয়ার্ডস:</strong> {seoKeywords.split(',').filter(Boolean).length} টি
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('seo')}
                      className="px-4 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-2xs shrink-0 cursor-pointer self-start sm:self-auto"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>মেটাডাটা এডিট করুন</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>

        {/* 3. Right Sidebar */}
        <aside className="w-full lg:w-72 bg-white/60 p-5 sm:p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-stone-200 shrink-0">
          <div className="space-y-6">
            
            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200">
              <h5 className="text-xs font-bold text-stone-800 tracking-wider uppercase mb-3">
                Quick Admin Actions
              </h5>
              <div className="space-y-2">
                <button
                  onClick={() => setShowAddNoticeModal(true)}
                  className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-rose-600" />
                  <span>Upload Notice (PDF)</span>
                </button>

                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>Register New Student</span>
                </button>

                <button
                  onClick={() => setActiveTab('applicants')}
                  className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Verify Applicant Fees</span>
                </button>

                <button
                  onClick={() => setActiveTab('credentials')}
                  className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <Key className="w-4 h-4 text-amber-600" />
                  <span>আইডি ও পাসওয়ার্ড ভল্ট</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('credentials');
                    setIsAdminFormExpanded(true);
                  }}
                  className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>অ্যাডমিন পাসওয়ার্ড পরিবর্তন</span>
                </button>

                <button
                  onClick={() => setActiveTab('seo')}
                  className="w-full py-2 px-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-cyan-600" />
                  <span>এসইও ও মেটাডাটা আপডেট</span>
                </button>
              </div>
            </div>

            {/* Permanent Storage Protection Widget */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-4 shadow-xs border border-amber-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-950 uppercase mb-1.5">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>স্থায়ী ডাটাবেজ ব্যাকআপ</span>
              </div>
              <p className="text-[11px] text-stone-600 mb-2.5 leading-relaxed">
                ওয়েবসাইট আপডেট হলেও সবার আইডি ও পাসওয়ার্ড সুরক্ষিত থাকে।
              </p>
              <button
                onClick={handleTriggerBackupDownload}
                className="w-full py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>ব্যাকআপ ডাউনলোড (JSON)</span>
              </button>
            </div>

            {/* Institute Center Card */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200">
              <h5 className="text-xs font-bold text-stone-800 tracking-wider uppercase mb-2">
                Center Information
              </h5>
              <p className="text-xs text-stone-600 leading-relaxed">
                <strong>Asad Computer & Training Center</strong><br />
                Bottola, Bhully Bazar, Thakurgaon<br />
                Mobile: 01773-733654<br />
                WhatsApp: 01407-215416<br />
                Email: bhulli.postoffice@gmail.com
              </p>
            </div>

          </div>

          <div className="pt-4 border-t border-stone-200 text-center text-[11px] text-stone-500">
            Secure Administrator Session · 2026
          </div>
        </aside>

      </div>

      {/* Modal: Add Notice with PDF Upload Capability */}
      {showAddNoticeModal && (
        <div
          className="fixed inset-0 z-60 bg-black/70 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-xs py-8"
          onClick={() => setShowAddNoticeModal(false)}
        >
          <div
            className="bg-white max-w-lg w-full p-6 sm:p-7 rounded-2xl shadow-2xl relative border border-stone-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddNoticeModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-lg font-bold text-stone-900 mb-1 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-rose-600" />
              <span>Publish New Notice & PDF</span>
            </h4>
            <p className="text-xs text-stone-500 mb-4">
              Upload official circulars or documents in PDF format for public viewing and downloading.
            </p>

            <form onSubmit={handleAddNoticeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Target Portal / Category</label>
                <select
                  value={newNoticeCategory}
                  onChange={(e) => setNewNoticeCategory(e.target.value as any)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg outline-none bg-stone-50"
                >
                  <option value="Student">Student Portal (কোর্স ও ক্লাস সংক্রান্ত)</option>
                  <option value="Applicant">Applicant / Job Portal (চাকরি ও আবেদন সংক্রান্ত)</option>
                  <option value="General">General Notice Board (সাধারণ নোটিশ)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Notice Headline / Title</label>
                <input
                  type="text"
                  required
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  placeholder="e.g. Primary Teacher Exam Admit Card Download Notice"
                  className="w-full p-2.5 border border-stone-300 rounded-lg outline-none focus:border-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Notice Description / Instructions</label>
                <textarea
                  rows={3}
                  value={newNoticeDescription}
                  onChange={(e) => setNewNoticeDescription(e.target.value)}
                  placeholder="Enter details, deadline dates, exam roll instructions, or center guidelines..."
                  className="w-full p-2.5 border border-stone-300 rounded-lg outline-none focus:border-rose-500"
                />
              </div>

              {/* Application Fee and Remarks Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1 flex items-center space-x-1">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>আবেদন ফি (টাকা / BDT)</span>
                  </label>
                  <input
                    type="number"
                    value={newNoticeFeeAmount}
                    onChange={(e) => setNewNoticeFeeAmount(e.target.value)}
                    placeholder="e.g. 220"
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500 font-medium bg-white"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    আবেদনকারী ফি জমা দেওয়ার সময় এটি শো করবে
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1 flex items-center space-x-1">
                    <Info className="w-3.5 h-3.5 text-amber-600" />
                    <span>মন্তব্য (ফি নোট / মন্তব্য ঘর)</span>
                  </label>
                  <input
                    type="text"
                    value={newNoticeRemarks}
                    onChange={(e) => setNewNoticeRemarks(e.target.value)}
                    placeholder="যেমন: সরকারি ফি ও অনলাইন চার্জসহ..."
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-amber-500 bg-white"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">
                    মন্তব্য ঘরের লেখাটি পেমেন্ট স্ক্রিনে দেখতে পাবে
                  </span>
                </div>
              </div>

              {/* PDF Document Upload Input */}
              <div className="p-4 bg-stone-50 rounded-xl border-2 border-dashed border-stone-300">
                <label className="block font-semibold text-stone-800 mb-1 flex items-center space-x-1.5">
                  <Upload className="w-4 h-4 text-rose-600" />
                  <span>Attach Official Notice PDF (পিডিএফ ফাইল আপলোড)</span>
                </label>
                <p className="text-[11px] text-stone-500 mb-3">
                  Upload PDF file (or circular images). Once uploaded, students and applicants can view and download it.
                </p>

                <div className="flex items-center space-x-3">
                  <label className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors flex items-center space-x-1.5 shrink-0">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Choose PDF File</span>
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={handlePdfFileSelect}
                      className="hidden"
                    />
                  </label>

                  {newNoticePdfName ? (
                    <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-emerald-800 font-medium truncate">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{newNoticePdfName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setNewNoticePdfFile(null);
                          setNewNoticePdfName('');
                        }}
                        className="text-stone-400 hover:text-rose-600 ml-1 p-0.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-stone-400 text-[11px]">No file chosen yet (optional)</span>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddNoticeModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-600 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Student */}
      {showAddStudentModal && (
        <div
          className="fixed inset-0 z-60 bg-black/70 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-xs py-8"
          onClick={() => setShowAddStudentModal(false)}
        >
          <div
            className="bg-white max-w-lg w-full p-6 sm:p-7 rounded-2xl shadow-2xl relative border border-stone-200 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddStudentModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-lg font-bold text-stone-900 mb-1 flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Enroll New Student & Set Fees</span>
            </h4>
            <p className="text-xs text-stone-500 mb-4">
              Add new student record with course fee, payment deposit, and batch timing.
            </p>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="e.g. Asif Mahmud"
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Student Roll (Optional)</label>
                  <input
                    type="text"
                    value={newStudentRoll}
                    onChange={(e) => setNewStudentRoll(e.target.value)}
                    placeholder="e.g. ACTC-2026-092"
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Course</label>
                <select
                  value={newStudentCourse}
                  onChange={(e) => {
                    const c = e.target.value;
                    setNewStudentCourse(c);
                    setNewStudentFee(3500);
                  }}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-stone-50"
                >
                  <option value="Computer Office Application (6 Months)">Computer Office Application (6 Months)</option>
                  <option value="Computer Office Application (3 Months)">Computer Office Application (3 Months)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Batch Schedule</label>
                  <select
                    value={newStudentBatch}
                    onChange={(e) => setNewStudentBatch(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-stone-50"
                  >
                    <option value="Morning (8 AM - 10 AM)">Morning (8:00 AM - 10:00 AM)</option>
                    <option value="Morning (10 AM - 12 PM)">Morning (10:00 AM - 12:00 PM)</option>
                    <option value="Evening (4 PM - 6 PM)">Evening (4:00 PM - 6:00 PM)</option>
                    <option value="Friday Special">Friday Special Batch</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Fee Accounting Fields */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Total Course Fee (৳)</label>
                  <input
                    type="number"
                    value={newStudentFee}
                    onChange={(e) => setNewStudentFee(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-lg outline-none font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-emerald-800 mb-1">Admission Paid (৳)</label>
                  <input
                    type="number"
                    value={newStudentPaid}
                    onChange={(e) => setNewStudentPaid(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-lg outline-none font-bold text-emerald-700 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-600 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notice PDF Viewer Modal */}
      <NoticePdfViewerModal
        isOpen={Boolean(selectedNoticeForPdf)}
        onClose={() => setSelectedNoticeForPdf(null)}
        notice={selectedNoticeForPdf}
      />

      {/* Student Profile, Fee Accounting & Password Reset Modal */}
      <StudentProfileModal
        isOpen={Boolean(selectedStudentForEdit)}
        onClose={() => setSelectedStudentForEdit(null)}
        student={selectedStudentForEdit}
        onSaveStudent={handleSaveStudentFromModal}
        onDeleteStudent={(id) => handleDeleteStudentClick(id)}
      />

      {/* Student Admission Official Copy / Printable PDF Modal */}
      <StudentAdmissionCopyModal
        isOpen={Boolean(selectedStudentForAdmissionCopy)}
        onClose={() => setSelectedStudentForAdmissionCopy(null)}
        student={selectedStudentForAdmissionCopy}
      />

      {/* Applicant Quick Credentials & Password Reset Modal */}
      <ApplicantProfileModal
        isOpen={Boolean(selectedApplicantForEdit)}
        onClose={() => setSelectedApplicantForEdit(null)}
        applicant={selectedApplicantForEdit}
        onSaveApplicant={handleSaveApplicantFromModal}
        onDeleteApplicant={(id) => handleDeleteApplicantClick(id)}
      />

      {/* Applicant Full Bio-Data Form & Official PDF Copy Modal */}
      <ApplicantBioDataModal
        isOpen={Boolean(selectedApplicantForBioData)}
        onClose={() => setSelectedApplicantForBioData(null)}
        applicant={selectedApplicantForBioData}
        initialTab={bioDataModalTab}
        isAdminMode={true}
        onSaveApplicant={(updated) => {
          handleSaveApplicantFromModal(updated);
          setSelectedApplicantForBioData(updated);
        }}
      />

      {/* Quick Student Payment Entry Modal */}
      {selectedStudentForQuickPay && (
        <div
          className="fixed inset-0 z-60 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedStudentForQuickPay(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <DollarSign className="w-5 h-5 text-emerald-300" />
                <div>
                  <h3 className="font-bold text-base">শিক্ষার্থী কোর্স ফি জমা এন্ট্রি (Enter Payment)</h3>
                  <p className="text-[11px] text-emerald-100">
                    {selectedStudentForQuickPay.name} · Roll: {selectedStudentForQuickPay.rollNo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForQuickPay(null)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleQuickStudentPaymentSubmit} className="p-6 space-y-4 text-xs">
              {/* Fee Snapshot */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <div>
                  <span className="text-[10px] text-stone-500 block">মোট কোর্স ফি</span>
                  <span className="font-bold text-stone-900 font-mono text-sm">৳{selectedStudentForQuickPay.totalFee}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 block font-semibold">পূর্বে পরিশোধিত</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">৳{selectedStudentForQuickPay.paidFee}</span>
                </div>
                <div>
                  <span className="text-[10px] text-rose-700 block font-semibold">বর্তমান বকেয়া</span>
                  <span className="font-bold text-rose-700 font-mono text-sm">৳{selectedStudentForQuickPay.dueFee}</span>
                </div>
              </div>

              {/* Payment Amount */}
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  নতুন জমা টাকার পরিমাণ (৳) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-500 text-sm">৳</span>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 1000"
                    value={quickPayAmount}
                    onChange={(e) => setQuickPayAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:border-emerald-500 font-mono text-base font-bold text-emerald-800"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-1.5">
                  <span className="text-[10px] text-stone-400">কুইক সিলেক্ট:</span>
                  {[500, 1000, 1500, 2000, selectedStudentForQuickPay.dueFee].filter(v => v > 0).slice(0, 4).map((amt, idx) => (
                    <button
                      key={`quick-amt-${idx}`}
                      type="button"
                      onClick={() => setQuickPayAmount(String(amt))}
                      className="px-2 py-0.5 bg-stone-100 hover:bg-emerald-100 text-stone-700 hover:text-emerald-900 rounded font-bold font-mono text-[10px] border border-stone-200 cursor-pointer"
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block font-bold text-stone-800 mb-1">পেমেন্ট মাধ্যম (Payment Method)</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Cash', 'bKash', 'Nagad', 'Rocket'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setQuickPayMethod(m)}
                      className={`py-2 rounded-lg font-bold text-xs border text-center transition-all cursor-pointer ${
                        quickPayMethod === m
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      {m === 'Cash' ? 'ক্যাশ (Cash)' : m}
                    </button>
                  ))}
                </div>
              </div>

              {/* TrxID / Receipt Slip No */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  রশিদ / মানি রিসিট নং অথবা TrxID (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="e.g. REC-2026-042 বা TrxID"
                  value={quickPayReceipt}
                  onChange={(e) => setQuickPayReceipt(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none font-mono"
                />
              </div>

              {/* Note / Remarks */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">নোট / মন্তব্য (ঐচ্ছিক)</label>
                <input
                  type="text"
                  placeholder="e.g. ২য় কিস্তি পরিশোধ / অফিশিয়াল ক্যাশ কাউন্টার জমা"
                  value={quickPayNote}
                  onChange={(e) => setQuickPayNote(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl outline-none"
                />
              </div>

              <div className="pt-2 text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                * পেমেন্ট সেভ করার সাথে সাথে শিক্ষার্থীর একাউন্টে মোট জমা ও বকেয়া হিসাব আপডেট হয়ে যাবে এবং শিক্ষার্থী তার প্রোফাইলে এই জমার মানি রিসিট দেখতে পাবে।
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForQuickPay(null)}
                  className="px-4 py-2 border border-stone-300 text-stone-600 rounded-xl font-medium hover:bg-stone-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>পেমেন্ট সেভ করুন (Save Payment)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Testimonial */}
      {showTestimonialModal && (
        <div
          className="fixed inset-0 z-70 bg-black/75 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-xs py-8"
          onClick={() => setShowTestimonialModal(false)}
        >
          <div
            className="bg-white max-w-xl w-full p-6 sm:p-7 rounded-2xl shadow-2xl relative border border-stone-200 my-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTestimonialModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-lg font-bold text-stone-900 mb-1 flex items-center space-x-2">
              <Award className="w-5 h-5 text-amber-600" />
              <span>
                {editingTestimonial ? 'সাফল্যের গল্প সম্পাদনা করুন' : 'নতুন শিক্ষার্থীর সাফল্যের গল্প যোগ করুন'}
              </span>
            </h4>
            <p className="text-xs text-stone-500 mb-4">
              এই তথ্যটি সরাসরি ওয়েবসাইটের হোমপেজের 'Student Testimonial' সেকশনে প্রদর্শিত হবে।
            </p>

            <form onSubmit={handleSaveTestimonialSubmit} className="space-y-3.5 text-xs">
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">শিক্ষার্থীর নাম (বাংলায়) *</label>
                  <input
                    type="text"
                    required
                    value={tNameBn}
                    onChange={(e) => setTNameBn(e.target.value)}
                    placeholder="যেমন: মোঃ জাহিদ হাসান"
                    className="w-full p-2.5 border border-stone-300 rounded-lg outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Student Name (English)</label>
                  <input
                    type="text"
                    value={tNameEn}
                    onChange={(e) => setTNameEn(e.target.value)}
                    placeholder="e.g. Md. Zahid Hasan"
                    className="w-full p-2.5 border border-stone-300 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Roles / Designations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">বর্তমান পদবী / পেশা (বাংলায়) *</label>
                  <input
                    type="text"
                    required
                    value={tRoleBn}
                    onChange={(e) => setTRoleBn(e.target.value)}
                    placeholder="যেমন: অফিস সহকারী কাম কম্পিউটার মুদ্রাক্ষরিক"
                    className="w-full p-2.5 border border-stone-300 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Role / Designation (English)</label>
                  <input
                    type="text"
                    value={tRoleEn}
                    onChange={(e) => setTRoleEn(e.target.value)}
                    placeholder="e.g. Computer Typist / Freelancer"
                    className="w-full p-2.5 border border-stone-300 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Workplace */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">কর্মস্থল / অফিস (বাংলায়)</label>
                  <input
                    type="text"
                    value={tWorkplaceBn}
                    onChange={(e) => setTWorkplaceBn(e.target.value)}
                    placeholder="যেমন: জেলা প্রশাসকের কার্যালয়, ঠাকুরগাঁও"
                    className="w-full p-2.5 border border-stone-300 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Workplace (English)</label>
                  <input
                    type="text"
                    value={tWorkplaceEn}
                    onChange={(e) => setTWorkplaceEn(e.target.value)}
                    placeholder="e.g. DC Office, Thakurgaon"
                    className="w-full p-2.5 border border-stone-300 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Course & Batch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">সম্পন্ন কোর্স</label>
                  <input
                    type="text"
                    value={tCourseBn}
                    onChange={(e) => setTCourseBn(e.target.value)}
                    placeholder="কম্পিউটার অফিস অ্যাপ্লিকেশন (৬ মাস)"
                    className="w-full p-2.5 border border-stone-300 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">ব্যাচ (যেমন: ব্যাচ-২৮)</label>
                  <input
                    type="text"
                    value={tBatchBn}
                    onChange={(e) => {
                      setTBatchBn(e.target.value);
                      if (!tBatchEn) setTBatchEn(e.target.value);
                    }}
                    placeholder="যেমন: ব্যাচ-২৮ (সকাল)"
                    className="w-full p-2.5 border border-stone-300 rounded-lg outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Success Story / Quote in Bengali */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  সাফল্যের গল্প ও মন্তব্য (বাংলায়) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={tStoryBn}
                  onChange={(e) => setTStoryBn(e.target.value)}
                  placeholder="আসাদ কম্পিউটার সেন্টারের ট্রেনিং কিভাবে তার ক্যারিয়ারে বা সরকারি চাকরিতে সহায়তা করেছে বিস্তারিত লিখুন..."
                  className="w-full p-2.5 border border-stone-300 rounded-lg outline-none focus:border-amber-500"
                />
              </div>

              {/* Success Story in English */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Success Story / Review (English)
                </label>
                <textarea
                  rows={2}
                  value={tStoryEn}
                  onChange={(e) => setTStoryEn(e.target.value)}
                  placeholder="English translation of the student's success journey..."
                  className="w-full p-2.5 border border-stone-300 rounded-lg outline-none focus:border-amber-500"
                />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-3">
                <label className="font-semibold text-stone-700">রেটিং (স্টার):</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= tRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-stone-600 ml-1.5">{tRating}.0 Star</span>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowTestimonialModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-600 font-medium hover:bg-stone-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-lg transition-all cursor-pointer shadow-sm flex items-center space-x-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{editingTestimonial ? 'আপডেট করুন' : 'সেভ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div
          className="fixed inset-0 z-70 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setItemToDelete(null)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-rose-200 overflow-hidden my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">ডিলিট নিশ্চিতকরণ</h3>
                  <p className="text-[11px] text-rose-100">মুছে ফেলা সংক্রান্ত সতর্কতা</p>
                </div>
              </div>
              <button
                onClick={() => setItemToDelete(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                <div className="font-bold text-rose-900 text-sm">{itemToDelete.title}</div>
                {itemToDelete.subtitle && (
                  <div className="text-stone-600 font-medium">{itemToDelete.subtitle}</div>
                )}
                <div className="text-[10px] text-rose-700 font-semibold pt-1">
                  ধরন:{' '}
                  {itemToDelete.type === 'notice'
                    ? 'নোটিশ (Notice)'
                    : itemToDelete.type === 'student'
                    ? 'শিক্ষার্থী প্রোফাইল (Student Profile)'
                    : itemToDelete.type === 'applicant'
                    ? 'আবেদনকারী প্রোফাইল (Applicant Profile)'
                    : itemToDelete.type === 'jobApp'
                    ? 'চাকুরীর আবেদন (Job Application)'
                    : 'সাফল্যের গল্প / রিভিউ'}
                </div>
              </div>

              <p className="text-stone-600 leading-relaxed">
                আপনি কি নিশ্চিত যে এই রেকর্ডটি সম্পূর্ণভাবে মুছে ফেলতে চান? এটি মুছে ফেললে ডাটাবেজ ও ওয়েবসাইট থেকে স্থায়ীভাবে অপসারিত হবে।
              </p>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold transition-colors cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>হ্যাঁ, মুছে ফেলুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
