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
  Key,
  Upload,
  Paperclip,
  Check,
  AlertCircle,
} from 'lucide-react';
import { NoticeItem, StudentAccount, ApplicantAccount } from '../types.ts';
import { NoticePdfViewerModal } from './NoticePdfViewerModal.tsx';
import { StudentProfileModal } from './StudentProfileModal.tsx';
import { ApplicantProfileModal } from './ApplicantProfileModal.tsx';

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
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notices' | 'students' | 'applicants'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Notice Control State (Fallbacks if props not passed)
  const defaultNotices: NoticeItem[] = [
    {
      id: 1,
      title: 'New Computer Office Application Batch starts from 1st of next month',
      category: 'Student',
      date: '24 Oct 2026',
      description: 'Morning and Evening batches admission is ongoing. Limited seats for 3-Month & 6-Month courses. Technical Education Board certified curriculum.',
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
      title: 'Govt Technical Education Board 6-Month Certificate Verification Open',
      category: 'General',
      date: '18 Oct 2026',
      description: 'Roll verification and registration card distribution for July-December semester is open. Contact institute office at Bottola, Bhully Bazar.',
      urgent: false,
      pdfName: 'BTEB_Certificate_Verification_Process.pdf',
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
  const defaultApplicants: ApplicantAccount[] = [
    {
      id: 1,
      applicantName: 'Rashidul Islam',
      phone: '01773-733654',
      email: 'rashidul.applicant@gmail.com',
      jobTitle: 'Primary DPE Computer Operator',
      feeStatus: 'Paid',
      feeAmount: 220,
      admitStatus: 'Ready',
      appliedDate: '18 Oct 2026',
      rollNo: '819204',
      password: 'applicantpass',
    },
    {
      id: 2,
      applicantName: 'Kamrul Hasan',
      phone: '01864-399871',
      email: 'kamrul.railway@gmail.com',
      jobTitle: 'Bangladesh Railway Office Assistant',
      feeStatus: 'Paid',
      feeAmount: 150,
      admitStatus: 'Processing',
      appliedDate: '16 Oct 2026',
      rollNo: 'BR-92014',
      password: 'applicantpass',
    },
    {
      id: 3,
      applicantName: 'Farhana Akter',
      phone: '01911-223344',
      email: 'farhana.akter@gmail.com',
      jobTitle: 'DGHS Office Assistant cum Typist',
      feeStatus: 'Pending',
      feeAmount: 200,
      admitStatus: 'Processing',
      appliedDate: '15 Oct 2026',
      rollNo: 'DGHS-4401',
      password: 'applicantpass',
    },
    {
      id: 4,
      applicantName: 'Sohel Rana',
      phone: '01755-667788',
      email: 'sohel.admission@gmail.com',
      jobTitle: 'Dhaka University Online Admission',
      feeStatus: 'Paid',
      feeAmount: 1000,
      admitStatus: 'Ready',
      appliedDate: '10 Oct 2026',
      rollNo: 'DU-891024',
      password: 'applicantpass',
    },
  ];

  const [localApplicants, setLocalApplicants] = useState<ApplicantAccount[]>(defaultApplicants);
  const applicants = propApplicants || localApplicants;

  // Applicant Modal
  const [selectedApplicantForEdit, setSelectedApplicantForEdit] = useState<ApplicantAccount | null>(null);

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
                  onClick={() => setActiveTab('applicants')}
                  className="bg-[#00b4d8] text-white p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="text-xs font-semibold">Job Applicants</div>
                  <div className="text-xl font-bold mt-1">{applicants.length} Applications</div>
                  <div className="text-[10px] text-white/80 mt-1">Govt & Private Circulars</div>
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
                              title="Toggle Board Certification"
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
                      <span>Applicant Control Panel (এপ্লিকেন্ট প্রোফাইল ও পাসওয়ার্ড)</span>
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      View applicant details, edit job submissions, reset passwords, update payment, and issue admit cards.
                    </p>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    Total: {applicants.length} Submissions
                  </span>
                </div>

                {/* Applicants Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-100/80 text-stone-600 border-b border-stone-200 uppercase text-[10px] tracking-wider font-semibold">
                        <th className="p-3">Applicant Name</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Applied Job / Circular</th>
                        <th className="p-3">Fee Status</th>
                        <th className="p-3">Admit Card</th>
                        <th className="p-3 text-right">Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredApplicants.map((app) => (
                        <tr key={app.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="p-3 font-bold text-stone-900">
                            <div>{app.applicantName}</div>
                            {app.rollNo && (
                              <span className="text-[10px] text-stone-400 font-mono block">Roll: {app.rollNo}</span>
                            )}
                          </td>
                          <td className="p-3 font-mono text-stone-600">
                            <div>{app.phone}</div>
                            <div className="text-[10px] text-stone-400 truncate max-w-[140px]">{app.email}</div>
                          </td>
                          <td className="p-3 font-medium text-stone-800">{app.jobTitle}</td>
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
                            <button
                              onClick={() => handleToggleAdmitStatus(app)}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                app.admitStatus === 'Ready'
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              }`}
                              title="Click to toggle Ready/Processing"
                            >
                              {app.admitStatus}
                            </button>
                          </td>
                          <td className="p-3 text-right space-x-1.5">
                            {/* Edit Applicant & Password Modal Trigger */}
                            <button
                              onClick={() => setSelectedApplicantForEdit(app)}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded font-bold text-[11px] transition-colors cursor-pointer border border-emerald-200 inline-flex items-center space-x-1"
                              title="View & Edit applicant details and reset password"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Edit / Password</span>
                            </button>

                            <button
                              onClick={() => alert(`Printing official applicant copy for ${app.applicantName} (${app.jobTitle})`)}
                              className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              Print Copy
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DEFAULT VIEW: OVERVIEW SUMMARY */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              </div>
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

      {/* Applicant Profile, Credentials & Password Reset Modal */}
      <ApplicantProfileModal
        isOpen={Boolean(selectedApplicantForEdit)}
        onClose={() => setSelectedApplicantForEdit(null)}
        applicant={selectedApplicantForEdit}
        onSaveApplicant={handleSaveApplicantFromModal}
      />

    </div>
  );
};
