import React, { useState } from 'react';
import {
  Search,
  Folder,
  FileText,
  Share2,
  MoreHorizontal,
  Settings,
  LogOut,
  Upload,
  Plus,
  BookOpen,
  Award,
  Video,
  FileCode,
  HardDrive,
  Download,
  CheckCircle,
  ExternalLink,
  DollarSign,
  AlertCircle,
  Eye,
  EyeOff,
  Bell,
  User,
  KeyRound,
  ShieldCheck,
  Phone,
  MapPin,
  Calendar,
  BadgeCheck,
  CreditCard,
  Clock,
  Smartphone,
  MessageCircle,
} from 'lucide-react';
import { StudentAccount, NoticeItem } from '../types.ts';
import { NoticePdfViewerModal } from './NoticePdfViewerModal.tsx';
import { PaymentModal, PaymentDetails } from './PaymentModal.tsx';

interface StudentDashboardProps {
  onLogout: () => void;
  onBackToHome: () => void;
  studentData?: StudentAccount;
  notices?: NoticeItem[];
  onUpdateStudent?: (student: StudentAccount) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onLogout,
  onBackToHome,
  studentData,
  notices = [],
  onUpdateStudent,
}) => {
  const [activeTab, setActiveTab] = useState<'drive' | 'fees' | 'notices' | 'typing' | 'profile'>('drive');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);
  const [selectedNoticeForPdf, setSelectedNoticeForPdf] = useState<NoticeItem | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentToast, setPaymentToast] = useState<string | null>(null);

  // Active student state (defaults to Sabbir Ahmed if no specific account passed)
  const student: StudentAccount = studentData || {
    id: 1,
    name: 'Sabbir Ahmed',
    rollNo: 'ACTC-2026-084',
    course: 'Computer Office Application (6 Months)',
    batch: 'Morning Batch (10:00 AM - 12:00 PM)',
    phone: '01712-345678',
    email: 'sabbir.student@gmail.com',
    totalFee: 4000,
    paidFee: 2500,
    dueFee: 1500,
    lastPaymentDate: '15 Oct 2026',
    typingSpeed: '42 WPM (English) / 30 WPM (Bangla)',
    attendance: '96%',
    status: 'Active',
  };

  const recentFiles = [
    {
      id: 1,
      name: 'MS_Word_Official_Letterhead_Assignment',
      type: 'DOCX file',
      size: '2.4 MB',
      date: 'Today, 10:30 AM',
      color: 'bg-blue-500',
    },
    {
      id: 2,
      name: 'MS_Excel_Salary_Sheet_Formula_Project',
      type: 'XLSX file',
      size: '4.8 MB',
      date: 'Yesterday',
      color: 'bg-emerald-500',
    },
    {
      id: 3,
      name: 'PowerPoint_Business_Presentation_Slides',
      type: 'PPTX file',
      size: '12.5 MB',
      date: '18 Oct 2026',
      color: 'bg-amber-500',
    },
    {
      id: 4,
      name: 'Access_Student_Database_Record_Lab',
      type: 'ACCDB file',
      size: '1.2 MB',
      date: '14 Oct 2026',
      color: 'bg-purple-500',
    },
  ];

  const handleStudentPaymentSubmit = (details: PaymentDetails) => {
    const updatedStudent: StudentAccount = {
      ...student,
      paymentMethod: details.paymentMethod,
      senderPhone: details.senderPhone,
      transactionId: details.transactionId,
      pendingPaymentAmount: details.amount,
      paymentVerificationStatus: 'PendingVerification',
      paymentSubmissionDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    if (onUpdateStudent) {
      onUpdateStudent(updatedStudent);
    }

    setPaymentToast(
      `কোর্স ফি পেমেন্ট তথ্য সাবমিট হয়েছে (TrxID: ${details.transactionId}, ৳${details.amount})। এডমিনের WhatsApp এ মেসেজ পাঠানো হয়েছে, এডমিন যাচাই করে একাউন্টে ফি যুক্ত করে দেবেন।`
    );
    setTimeout(() => setPaymentToast(null), 8000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFiles((prev) => [file.name, ...prev]);
      setAssignmentSuccess(true);
      setTimeout(() => setAssignmentSuccess(false), 3000);
    }
  };

  const filteredFiles = recentFiles.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="min-h-screen bg-[#dce4f2] p-2 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center font-sans antialiased">
        <div className="w-full max-w-7xl bg-[#f0f4fa] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-white/60 min-h-[750px]">
          
          {/* 1. Left Dark Sidebar */}
          <aside className="w-full lg:w-60 bg-[#161a2b] text-stone-300 p-6 flex flex-col justify-between shrink-0">
            <div>
              {/* Student Avatar & Identity */}
              <div className="flex flex-col items-center pb-6 border-b border-white/10 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 p-0.5 shadow-lg mb-2.5">
                  <div className="w-full h-full rounded-full bg-[#161a2b] flex items-center justify-center text-white font-bold text-xl">
                    {student.name.charAt(0)}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">{student.name}</h3>
                <span className="text-[11px] text-teal-400 font-mono mt-0.5">{student.rollNo}</span>
                <span className="text-[10px] text-stone-400 mt-1 px-2 py-0.5 bg-white/5 rounded-full">
                  Student Portal
                </span>
              </div>

              {/* Navigation Menu */}
              <nav className="mt-6 space-y-1 text-xs">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-blue-600/20 text-blue-400 font-bold border-l-2 border-blue-500'
                      : 'text-stone-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <User className="w-4 h-4 text-sky-400" />
                  <span>My Profile & Info (ভর্তি তথ্য)</span>
                </button>

                <button
                  onClick={() => setActiveTab('drive')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                    activeTab === 'drive'
                      ? 'bg-blue-600/20 text-blue-400 font-bold border-l-2 border-blue-500'
                      : 'text-stone-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <HardDrive className="w-4 h-4" />
                  <span>My Drive / Course</span>
                </button>

                <button
                  onClick={() => setActiveTab('fees')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                    activeTab === 'fees'
                      ? 'bg-blue-600/20 text-blue-400 font-bold border-l-2 border-blue-500'
                      : 'text-stone-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>Course Fees & Balance</span>
                </button>

                <button
                  onClick={() => setActiveTab('notices')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                    activeTab === 'notices'
                      ? 'bg-blue-600/20 text-blue-400 font-bold border-l-2 border-blue-500'
                      : 'text-stone-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Bell className="w-4 h-4 text-rose-400" />
                  <span>Notice Board ({notices.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('typing')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                    activeTab === 'typing'
                      ? 'bg-blue-600/20 text-blue-400 font-bold border-l-2 border-blue-500'
                      : 'text-stone-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Typing Speed Score</span>
                </button>
              </nav>
            </div>

            {/* Bottom Actions */}
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

          {/* 2. Middle Main Content Area */}
          <main className="flex-1 p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Search Bar */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search course materials, typing tests, fee receipt..."
                    className="w-full bg-white rounded-full py-2.5 pl-10 pr-4 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 shadow-xs border border-stone-200 outline-none focus:border-blue-400 transition-colors"
                  />
                </div>

                <div className="hidden sm:flex items-center space-x-2 text-xs text-stone-600 bg-white px-3.5 py-1.5 rounded-full shadow-xs border border-stone-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{student.course}</span>
                </div>
              </div>

              {/* TAB 1: STUDENT PROFILE & ADMISSION BIO-DATA */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Profile Header Card */}
                  <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-stone-200">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pb-5 border-b border-stone-100">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 p-0.5 shadow-md shrink-0 overflow-hidden flex items-center justify-center">
                        {student.photoUrl ? (
                          <img
                            src={student.photoUrl}
                            alt={student.name}
                            className="w-full h-full object-cover rounded-2xl"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#161a2b] flex items-center justify-center text-white font-bold text-2xl rounded-2xl">
                            {student.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="text-center sm:text-left flex-1">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <h3 className="text-xl font-bold text-stone-900">{student.name}</h3>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                            <BadgeCheck className="w-3 h-3 text-emerald-600" />
                            <span>{student.status || 'Active Student'}</span>
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          {student.course} · {student.batch}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                          <span className="font-mono bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded font-semibold border border-stone-200">
                            Roll: {student.rollNo}
                          </span>
                          <span className="text-stone-400">·</span>
                          <span className="text-stone-600 flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            <span>ভর্তি তারিখ: {student.admissionDate || student.lastPaymentDate || 'Recorded'}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Login Credentials Alert Card */}
                    <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-sky-200">
                      <div className="flex items-center space-x-2 text-sky-950 font-bold text-xs uppercase tracking-wider mb-2">
                        <KeyRound className="w-4 h-4 text-sky-600" />
                        <span>স্টুডেন্ট লগইন তথ্য ও পাসওয়ার্ড (Login Credentials)</span>
                      </div>
                      <p className="text-xs text-sky-900/80 mb-3 leading-relaxed">
                        ভর্তি ফরমের দেওয়া মোবাইল নম্বরই আপনার <strong>লগইন আইডি</strong> এবং আপনার নির্ধারিত পাসওয়ার্ড নিচে দেওয়া হলো:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-lg border border-sky-200/80 shadow-2xs">
                          <span className="text-[10px] font-bold text-stone-500 uppercase block">
                            লগইন আইডি (মোবাইল নম্বর)
                          </span>
                          <span className="text-sm font-extrabold text-stone-900 font-mono mt-0.5 block">
                            {student.phone}
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-sky-200/80 shadow-2xs">
                          <span className="text-[10px] font-bold text-stone-500 uppercase block">
                            পাসওয়ার্ড (Password)
                          </span>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-sm font-extrabold text-stone-900 font-mono">
                              {showPassword ? (student.password || 'password123') : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-stone-500 hover:text-stone-800 text-xs flex items-center space-x-1 cursor-pointer"
                            >
                              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              <span>{showPassword ? 'Hide' : 'Show'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Personal & Admission Bio-Data */}
                  <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-stone-200">
                    <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100 flex items-center space-x-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>ভর্তি ফরমের ব্যক্তিগত বিবরণ (Personal & Admission Information)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-stone-400 block text-[11px]">পিতার নাম</span>
                        <span className="font-semibold text-stone-800 mt-0.5 block">{student.fatherName || 'Not recorded'}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px]">মাতার নাম</span>
                        <span className="font-semibold text-stone-800 mt-0.5 block">{student.motherName || 'Not recorded'}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px]">জন্ম তারিখ</span>
                        <span className="font-semibold text-stone-800 mt-0.5 block">{student.birthDate || 'Not recorded'}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px]">লিঙ্গ</span>
                        <span className="font-semibold text-stone-800 mt-0.5 block">{student.gender || 'Male'}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px]">ধর্ম ও জাতীয়তা</span>
                        <span className="font-semibold text-stone-800 mt-0.5 block">{student.religion || 'Islam'} / {student.nationality || 'Bangladeshi'}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px]">এনআইডি / জন্ম নিবন্ধন</span>
                        <span className="font-semibold text-stone-800 mt-0.5 block">{student.nidNumber || 'Verified'}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px]">রক্তের গ্রুপ</span>
                        <span className="font-semibold text-stone-800 mt-0.5 block">{student.bloodGroup || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px]">পেশা</span>
                        <span className="font-semibold text-stone-800 mt-0.5 block">{student.occupation || 'Student'}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[11px]">ইমেইল এড্রেস</span>
                        <span className="font-semibold text-stone-800 mt-0.5 block">{student.email || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                        <span className="text-[10px] font-bold text-stone-500 uppercase block mb-1">বর্তমান ঠিকানা</span>
                        <p className="text-stone-700 font-medium">
                          {student.presentAddress ? `${student.presentAddress}, ` : ''}
                          {student.presentUpazila ? `${student.presentUpazila}, ` : ''}
                          {student.presentDistrict || 'Thakurgaon'}
                        </p>
                      </div>
                      <div className="bg-stone-50 p-3 rounded-lg border border-stone-200">
                        <span className="text-[10px] font-bold text-stone-500 uppercase block mb-1">স্থায়ী ঠিকানা</span>
                        <p className="text-stone-700 font-medium">
                          {student.permanentAddress ? `${student.permanentAddress}, ` : ''}
                          {student.permanentUpazila ? `${student.permanentUpazila}, ` : ''}
                          {student.permanentDistrict || 'Thakurgaon'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MY DRIVE & COURSE OVERVIEW */}
              {activeTab === 'drive' && (
                <>
                  {/* Student Fee Account Banner */}
                  <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-amber-200/60 mb-3">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-amber-700" />
                        <span className="font-bold text-xs uppercase tracking-wider text-amber-950">
                          Course Fee & Payment Status (আমার ফি ও বকেয়া হিসাব)
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-800 font-medium">
                        Last Payment: {student.lastPaymentDate || 'Recorded'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-white p-3 rounded-xl border border-amber-100 shadow-2xs">
                        <span className="text-[11px] text-stone-500 block">Total Course Fee</span>
                        <span className="text-lg font-bold text-stone-900 font-mono">
                          ৳ {student.totalFee.toLocaleString()}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs">
                        <span className="text-[11px] text-emerald-700 block font-medium">Total Paid (জমা টাকা)</span>
                        <span className="text-lg font-bold text-emerald-700 font-mono">
                          ৳ {student.paidFee.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-2 font-bold">
                          Paid
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-rose-100 shadow-2xs">
                        <span className="text-[11px] text-rose-700 block font-medium">Due Balance (বাকি টাকা)</span>
                        <span className="text-lg font-bold text-rose-700 font-mono">
                          ৳ {student.dueFee.toLocaleString()}
                        </span>
                        {student.dueFee > 0 ? (
                          <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded ml-2 font-bold">
                            Due
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-2 font-bold">
                            Full Cleared
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pending Verification Notice */}
                    {student.paymentVerificationStatus === 'PendingVerification' && (
                      <div className="mt-3 p-3 bg-amber-100/90 border border-amber-300 rounded-xl text-amber-950 text-xs flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-amber-700 animate-pulse shrink-0" />
                          <span>
                            আপনার ৳{student.pendingPaymentAmount || student.dueFee} টাকার পেমেন্ট সাবমিশন <strong>যাচাই প্রক্রিয়াধীন (TrxID: {student.transactionId})</strong> রয়েছে। এডমিন ভেরিফাই করলেই ফি জমা হয়ে যাবে।
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPaymentModalOpen(true)}
                          className="text-[11px] font-bold text-amber-900 underline hover:text-amber-950 shrink-0 ml-2"
                        >
                          তথ্য পরিবর্তন
                        </button>
                      </div>
                    )}

                    {/* Online Pay Button */}
                    <div className="mt-3 pt-3 border-t border-amber-200/80 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-amber-900 font-medium">
                        বিকাশ ও রকেট: <strong>01773733654</strong> · নগদ: <strong>01864399871</strong> (Send Money)
                      </span>
                      <button
                        type="button"
                        onClick={() => setPaymentModalOpen(true)}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-[#E2136E] to-[#E85D04] hover:opacity-90 text-white font-bold text-xs rounded-lg transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>
                          {student.paymentVerificationStatus === 'PendingVerification'
                            ? 'পেমেন্ট ট্রানজেকশন পরিবর্তন / আপডেট'
                            : 'বিকাশ/নগদে ফি পরিশোধ করুন (Send Money)'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Colored Category Cards */}
                  <div className="mb-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      <div className="bg-[#ff5b57] text-white p-4 rounded-2xl shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-2.5">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-semibold">Theory Classes</div>
                        <div className="text-[11px] text-white/80">32 Lessons completed</div>
                      </div>

                      <div className="bg-[#00b4d8] text-white p-4 rounded-2xl shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-2.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-semibold">Practical Labs</div>
                        <div className="text-[11px] text-white/80">30 Files submitted</div>
                      </div>

                      <div className="bg-[#ffb703] text-stone-950 p-4 rounded-2xl shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center mb-2.5 text-stone-900">
                          <Award className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-bold">Typing Speed</div>
                        <div className="text-[11px] text-stone-800">{student.typingSpeed}</div>
                      </div>

                      <div className="bg-[#2a68ff] text-white p-4 rounded-2xl shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-2.5">
                          <FileCode className="w-4 h-4" />
                        </div>
                        <div className="text-xs font-semibold">Attendance</div>
                        <div className="text-[11px] text-white/80">{student.attendance} Present</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Files Table */}
                  <div>
                    <h4 className="text-xs font-bold text-stone-800 tracking-wider mb-3 uppercase">
                      Course Practice Modules & Assignments
                    </h4>
                    <div className="space-y-2">
                      {filteredFiles.map((file) => (
                        <div
                          key={file.id}
                          className="bg-white p-3 sm:p-3.5 rounded-xl shadow-xs border border-stone-200 hover:shadow-sm transition-shadow flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className={`w-8 h-8 rounded-lg ${file.color} text-white flex items-center justify-center shrink-0`}>
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-stone-900 truncate">{file.name}</div>
                              <div className="text-[10px] text-stone-400">{file.date}</div>
                            </div>
                          </div>

                          <div className="hidden sm:block text-stone-500 text-[11px] w-24">
                            {file.type}
                          </div>

                          <div className="flex items-center space-x-2 text-stone-400">
                            <button
                              onClick={() => alert(`Downloading practice file: ${file.name}`)}
                              className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded flex items-center space-x-1 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* TAB 3: FEES & BALANCE DETAILS */}
              {activeTab === 'fees' && (
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200 space-y-6">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <div>
                      <h4 className="font-bold text-stone-900 text-base">Student Fee Breakdown & Official Ledger</h4>
                      <p className="text-xs text-stone-500 mt-0.5">Asad Computer & Training Center, Bhully Bazar</p>
                    </div>
                    <span className="font-mono text-xs bg-stone-100 px-3 py-1 rounded text-stone-700 border border-stone-200">
                      ID: {student.rollNo}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-xs text-amber-800 block">Total Course Fee</span>
                      <span className="text-2xl font-black text-amber-950 font-mono mt-1 block">৳ {student.totalFee.toLocaleString()}</span>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                      <span className="text-xs text-emerald-800 block">Total Paid to Date</span>
                      <span className="text-2xl font-black text-emerald-950 font-mono mt-1 block">৳ {student.paidFee.toLocaleString()}</span>
                    </div>
                    <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                      <span className="text-xs text-rose-800 block">Due Balance</span>
                      <span className="text-2xl font-black text-rose-950 font-mono mt-1 block">৳ {student.dueFee.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Pending Verification Notice */}
                  {student.paymentVerificationStatus === 'PendingVerification' && (
                    <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-950 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-amber-700 animate-pulse shrink-0" />
                        <span className="font-bold text-sm">
                          পেমেন্ট যাচাই প্রক্রিয়াধীন (Payment Verification Pending)
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-amber-200">
                        <div>
                          <span className="text-stone-500 block">মাধ্যম ও পরিমাণ:</span>
                          <span className="font-bold text-stone-800">{student.paymentMethod || 'bKash'} — ৳{student.pendingPaymentAmount || student.dueFee}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block">প্রেরক মোবাইল নম্বর:</span>
                          <span className="font-mono font-bold text-stone-800">{student.senderPhone || student.phone}</span>
                        </div>
                        <div>
                          <span className="text-stone-500 block">ট্রানজেকশন আইডি (TrxID):</span>
                          <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">{student.transactionId}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-amber-800 pt-1">
                        এডমিনের WhatsApp এ আপনার পেমেন্টের নোটিফিকেশন পাঠানো হয়েছে। এডমিন ভেরিফাই করে একাউন্টে জমা করে দিলে স্ট্যাটাস পেইড দেখাবে।
                      </p>
                    </div>
                  )}

                  {/* Payment History Ledger / Records */}
                  <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-xs uppercase tracking-wider text-stone-800">
                          পেমেন্ট ট্রানজেকশন ও মানি রিসিট (Payment History & Receipts)
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 self-start sm:self-auto">
                        মোট জমা: ৳ {student.paidFee.toLocaleString()} · বকেয়া: ৳ {student.dueFee.toLocaleString()}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 text-[10px] uppercase font-bold tracking-wider">
                            <th className="p-2.5">তারিখ (Date)</th>
                            <th className="p-2.5">বিবরণ / নোট</th>
                            <th className="p-2.5">মাধ্যম (Method)</th>
                            <th className="p-2.5">TrxID / স্লিপ</th>
                            <th className="p-2.5 text-right">জমা পরিমাণ (৳)</th>
                            <th className="p-2.5 text-center">স্ট্যাটাস</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 font-medium">
                          {student.paymentHistory && student.paymentHistory.length > 0 ? (
                            student.paymentHistory.map((rec, i) => (
                              <tr key={rec.id || `rec-${i}`} className="hover:bg-stone-50/60 transition-colors">
                                <td className="p-2.5 text-stone-700 font-mono text-[11px]">{rec.date}</td>
                                <td className="p-2.5 text-stone-800">{rec.note || 'কোর্স ফি জমা'}</td>
                                <td className="p-2.5 text-stone-600">{rec.method}</td>
                                <td className="p-2.5 font-mono text-[11px] text-stone-500">{rec.trxId || 'OFFICE-REC'}</td>
                                <td className="p-2.5 text-right font-bold text-emerald-700 font-mono text-sm">
                                  + ৳{rec.amount.toLocaleString()}
                                </td>
                                <td className="p-2.5 text-center">
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    ✓ পরিশোধিত
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr className="hover:bg-stone-50/60 transition-colors">
                              <td className="p-2.5 text-stone-700 font-mono text-[11px]">{student.lastPaymentDate || student.admissionDate || 'ভর্তিকালীন'}</td>
                              <td className="p-2.5 text-stone-800">ভর্তিকালীন প্রাথমিক ফি ও কিস্তি</td>
                              <td className="p-2.5 text-stone-600">{student.paymentMethod || 'অফিস ক্যাশ (Cash)'}</td>
                              <td className="p-2.5 font-mono text-[11px] text-stone-500">{student.transactionId || 'ACTC-REC-01'}</td>
                              <td className="p-2.5 text-right font-bold text-emerald-700 font-mono text-sm">
                                + ৳{student.paidFee.toLocaleString()}
                              </td>
                              <td className="p-2.5 text-center">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  ✓ পরিশোধিত
                                </span>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Online Payment Card with Send Money numbers */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 border border-amber-200 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center space-x-1.5">
                          <Smartphone className="w-4 h-4 text-rose-600" />
                          <span>অনলাইন ফি পরিশোধ (bKash / Nagad / Rocket Send Money)</span>
                        </span>
                        <p className="text-xs text-stone-600 mt-1">
                          নিচের যেকোনো নম্বরে বিকাশ, নগদ বা রকেট থেকে <strong>Send Money</strong> করে ট্রানজেকশন আইডি সাবমিট করুন।
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPaymentModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-[#E2136E] to-[#E85D04] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-2 cursor-pointer transition-all shrink-0"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>ফি পরিশোধ ও TrxID সাবমিট করুন</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-white rounded-xl border border-pink-200 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#E2136E]">বিকাশ (bKash)</span>
                          <span className="text-[10px] bg-pink-100 text-[#E2136E] px-1.5 py-0.5 rounded font-bold">Personal</span>
                        </div>
                        <span className="font-mono text-sm font-bold text-stone-900 block mt-1">01773733654</span>
                        <span className="text-[11px] text-stone-500 block">Send Money করুন</span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-orange-200 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#E85D04]">নগদ (Nagad)</span>
                          <span className="text-[10px] bg-orange-100 text-[#E85D04] px-1.5 py-0.5 rounded font-bold">Personal</span>
                        </div>
                        <span className="font-mono text-sm font-bold text-stone-900 block mt-1">01864399871</span>
                        <span className="text-[11px] text-stone-500 block">Send Money করুন</span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-purple-200 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#8C3494]">রকেট (Rocket)</span>
                          <span className="text-[10px] bg-purple-100 text-[#8C3494] px-1.5 py-0.5 rounded font-bold">Personal</span>
                        </div>
                        <span className="font-mono text-sm font-bold text-stone-900 block mt-1">01773733654</span>
                        <span className="text-[11px] text-stone-500 block">Send Money করুন</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                    <span className="font-bold text-stone-800 block">পেমেন্ট ও অফিস সংক্রান্ত তথ্যাবলী:</span>
                    <p className="text-stone-600 leading-relaxed">
                      অনলাইনে Send Money করার পর ট্রানজেকশন আইডি (TrxID) ও প্রেরক মোবাইল নম্বর সাবমিট করলেই সেন্টারের অফিস হোয়াটসঅ্যাপে নোটিফিকেশন পৌঁছে যাবে এবং অফিস অ্যাডমিন ভেরিফাই করে আপনার একাউন্টে ফি জমা রিসিভ করবেন। অথবা সরাসরি আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টারের অফিস ডেস্ক (বটতলী, ভুল্লী বাজার, ঠাকুরগাঁও) এ যোগাযোগ করতে পারেন। হেল্পলাইন: <strong>01773-733654</strong>।
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: NOTICES */}
              {activeTab === 'notices' && (
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200 space-y-4">
                  <h4 className="font-bold text-stone-900 text-base border-b border-stone-100 pb-3 flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-rose-500" />
                    <span>Official Notices for Students (নোটিশ বোর্ড)</span>
                  </h4>
                  <div className="space-y-3">
                    {notices.map((n) => (
                      <div key={n.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                              {n.category}
                            </span>
                            <h5 className="font-bold text-stone-900 text-sm mt-1.5">{n.title}</h5>
                            <p className="text-xs text-stone-600 mt-1 leading-relaxed">{n.description}</p>
                          </div>
                          <button
                            onClick={() => setSelectedNoticeForPdf(n)}
                            className="shrink-0 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </button>
                        </div>
                        <div className="text-[11px] text-stone-400 mt-3 pt-2 border-t border-stone-200 flex items-center justify-between">
                          <span>Date: {n.date}</span>
                          <span>Post Office Affiliated Center</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: TYPING SCORECARD */}
              {activeTab === 'typing' && (
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200 space-y-5">
                  <h4 className="font-bold text-stone-900 text-base border-b border-stone-100 pb-3 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span>Computer Typing Speed Scorecard</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                      <span className="text-xs font-bold text-blue-900 uppercase">English Typing Speed</span>
                      <div className="text-3xl font-black text-blue-950 font-mono mt-1">42 WPM</div>
                      <span className="text-[11px] text-blue-700 mt-1 block">Accuracy: 98% · Certified benchmark passed</span>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-xs font-bold text-emerald-900 uppercase">Bangla Typing Speed (Bijoy / Avro)</span>
                      <div className="text-3xl font-black text-emerald-950 font-mono mt-1">30 WPM</div>
                      <span className="text-[11px] text-emerald-700 mt-1 block">Accuracy: 96% · Meets government job requirement</span>
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200">
                    * প্রতিদিন ল্যাবে এসে টাইপিং প্র্যাকটিস সম্পন্ন করুন। সরকারি চাকুরীর পরীক্ষায় বাংলায় সর্বনিম্ন ২০-২৫ WPM এবং ইংরেজিতে সর্বনিম্ন ৩০-৩৫ WPM টাইপিং স্পিড থাকতে হবে।
                  </p>
                </div>
              )}

            </div>
          </main>

          {/* 3. Right Sidebar */}
          <aside className="w-full lg:w-72 bg-white/60 p-5 sm:p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-stone-200 shrink-0">
            <div className="space-y-6">
              
              {/* Upload Box */}
              <div className="bg-white rounded-2xl p-6 text-center border-2 border-dashed border-sky-300 shadow-xs">
                <label className="cursor-pointer block">
                  <div className="w-12 h-12 mx-auto rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h5 className="text-sm font-bold text-stone-800">Submit New Assignment</h5>
                  <p className="text-[11px] text-stone-400 mt-1">Upload DOCX, XLSX, PPTX or PDF files</p>
                  <span className="inline-block mt-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs">
                    Browse Files
                  </span>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {/* Official Notices from Admin with PDF View & Download */}
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-xs font-bold text-stone-800 tracking-wider uppercase flex items-center space-x-1.5">
                    <Bell className="w-3.5 h-3.5 text-rose-500" />
                    <span>Official Notices (পিডিএফ নোটিশ)</span>
                  </h5>
                </div>
                
                <div className="space-y-2.5">
                  {notices.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                    >
                      <div className="font-semibold text-stone-900 leading-tight mb-1">
                        {n.title}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-100">
                        <span>{n.date}</span>
                        <button
                          onClick={() => setSelectedNoticeForPdf(n)}
                          className="text-rose-600 hover:text-rose-800 font-bold flex items-center space-x-1 cursor-pointer hover:underline"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View PDF</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-stone-200 text-center text-[11px] text-stone-500">
              Instructor Helpline: <strong>01773-733654</strong><br />
              Bottola, Bhully Bazar, Thakurgaon
            </div>
          </aside>

        </div>
      </div>

      {/* Notice PDF Viewer Modal */}
      <NoticePdfViewerModal
        isOpen={Boolean(selectedNoticeForPdf)}
        onClose={() => setSelectedNoticeForPdf(null)}
        notice={selectedNoticeForPdf}
      />

      {/* Online Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="কোর্স ফি অনলাইন পেমেন্ট (Course Fee Send Money)"
        userType="student"
        userName={student.name}
        userPhone={student.phone}
        userRollOrRef={student.rollNo}
        amount={student.dueFee > 0 ? student.dueFee : 1000}
        itemTitle={student.course}
        onPaymentSubmit={handleStudentPaymentSubmit}
      />

      {/* Toast Notification */}
      {paymentToast && (
        <div className="fixed bottom-6 right-6 max-w-md bg-stone-900 text-white p-4 rounded-xl shadow-2xl z-50 border border-stone-700 animate-bounce text-xs flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block text-emerald-400 mb-0.5">পেমেন্ট সাবমিশন সফল!</span>
            <span className="text-stone-300 leading-relaxed">{paymentToast}</span>
          </div>
          <button
            onClick={() => setPaymentToast(null)}
            className="text-stone-400 hover:text-white font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

