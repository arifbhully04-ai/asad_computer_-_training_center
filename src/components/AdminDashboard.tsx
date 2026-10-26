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
} from 'lucide-react';
import { NoticeItem, StudentAccount, ApplicantAccount, JobApplication } from '../types.ts';
import { NoticePdfViewerModal } from './NoticePdfViewerModal.tsx';
import { StudentProfileModal } from './StudentProfileModal.tsx';
import { ApplicantProfileModal } from './ApplicantProfileModal.tsx';
import { ApplicantBioDataModal } from './ApplicantBioDataModal.tsx';
import { ApplicationStatusBadge, isApplicationCompleted } from './ApplicationStatusBadge.tsx';
import { downloadDatabaseBackupFile } from '../utils/storageManager.ts';

export interface AdminDashboardProps {
  onLogout: () => void;
  onBackToHome: () => void;
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
  onExportDatabase?: () => void;
  onRestoreDatabase?: (jsonStr: string) => boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onBackToHome,
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
  onExportDatabase,
  onRestoreDatabase,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notices' | 'students' | 'applicants' | 'credentials'>('overview');
  const [applicantSubTab, setApplicantSubTab] = useState<'applications' | 'profiles'>('applications');
  const [jobAppStatusFilter, setJobAppStatusFilter] = useState<'all' | 'processing' | 'completed'>('all');
  const [credentialFilter, setCredentialFilter] = useState<'all' | 'applicants' | 'students'>('all');
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [restoreMessage, setRestoreMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [adminStatusToast, setAdminStatusToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
  const [newNoticePdfFile, setNewNoticePdfFile] = useState<File | null>(null);
  const [newNoticePdfName, setNewNoticePdfName] = useState<string>('');
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [selectedNoticeForPdf, setSelectedNoticeForPdf] = useState<NoticeItem | null>(null);

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
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRoll, setNewStudentRoll] = useState('');
  const [newStudentCourse, setNewStudentCourse] = useState('Computer Office Application (6 Months)');
  const [newStudentBatch, setNewStudentBatch] = useState('Morning (10 AM - 12 PM)');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentFee, setNewStudentFee] = useState<number>(4000);
  const [newStudentPaid, setNewStudentPaid] = useState<number>(1500);

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

    const newNotice: NoticeItem = {
      id: Date.now(),
      title: newNoticeTitle,
      category: newNoticeCategory,
      date: 'Today',
      description: newNoticeDescription.trim() || undefined,
      urgent: false,
      pdfUrl: generatedPdfUrl,
      pdfName: newNoticePdfName || (newNoticePdfFile ? newNoticePdfFile.name : undefined),
    };

    if (onAddNotice) {
      onAddNotice(newNotice);
    } else {
      setLocalNotices([newNotice, ...localNotices]);
    }

    // Reset Form
    setNewNoticeTitle('');
    setNewNoticeDescription('');
    setNewNoticePdfFile(null);
    setNewNoticePdfName('');
    setShowAddNoticeModal(false);
  };

  const handleDeleteNoticeClick = (id: number) => {
    if (onDeleteNotice) {
      onDeleteNotice(id);
    } else {
      setLocalNotices(localNotices.filter((n) => n.id !== id));
    }
  };

  // Student Handlers
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const total = newStudentFee || 4000;
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
    setNewStudentFee(4000);
    setNewStudentPaid(1500);
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

  const handleDeleteStudentClick = (id: number) => {
    if (onDeleteStudent) {
      onDeleteStudent(id);
    } else {
      setLocalStudents(localStudents.filter((s) => s.id !== id));
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

  const handleDeleteJobAppClick = (id: number) => {
    if (confirm('আপনি কি এই চাকুরীর আবেদনটি মুছে ফেলতে চান?')) {
      onDeleteJobApplication?.(id);
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
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-rose-600 p-0.5 shadow-lg mb-2.5">
                <div className="w-full h-full rounded-full bg-[#161a2b] flex items-center justify-center text-white font-bold text-lg">
                  ACTC
                </div>
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
                            <div className="space-y-0.5">
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
                          <td className="p-3 text-right space-x-1.5">
                            {/* Edit Profile & Password Modal Trigger */}
                            <button
                              onClick={() => setSelectedStudentForEdit(student)}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded font-bold text-[11px] transition-colors cursor-pointer border border-blue-200 inline-flex items-center space-x-1"
                              title="Edit profile, update fees, change password"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Edit / Password</span>
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
                                    কখনোই ডিলিট হবে না
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
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => setSelectedStudentForEdit(cred.rawStudent)}
                                      className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded font-bold text-[10px] transition-colors cursor-pointer border border-blue-200"
                                    >
                                      এডিট / পাসওয়ার্ড
                                    </button>
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
                    if (c.includes('6 Months')) setNewStudentFee(4000);
                    else setNewStudentFee(2500);
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
      />

      {/* Applicant Quick Credentials & Password Reset Modal */}
      <ApplicantProfileModal
        isOpen={Boolean(selectedApplicantForEdit)}
        onClose={() => setSelectedApplicantForEdit(null)}
        applicant={selectedApplicantForEdit}
        onSaveApplicant={handleSaveApplicantFromModal}
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

    </div>
  );
};
