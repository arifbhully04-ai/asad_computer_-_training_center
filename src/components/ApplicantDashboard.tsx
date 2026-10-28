import React, { useState } from 'react';
import {
  Search,
  FileText,
  Briefcase,
  CheckCircle,
  Download,
  ExternalLink,
  ShieldCheck,
  LogOut,
  X,
  Bell,
  Eye,
  UserPlus,
  Edit,
  Printer,
  Sparkles,
  Paperclip,
  ArrowRight,
  Send,
  Clock,
  Filter,
  CreditCard,
  Smartphone,
  MessageCircle,
  Info,
} from 'lucide-react';
import { ApplicantAccount, NoticeItem, JobApplication } from '../types.ts';
import { NoticePdfViewerModal } from './NoticePdfViewerModal.tsx';
import { ApplicantBioDataModal } from './ApplicantBioDataModal.tsx';
import { ApplicationPermissionModal } from './ApplicationPermissionModal.tsx';
import { JobPortalModal } from './JobPortalModal.tsx';
import { ApplicationStatusBadge, isApplicationCompleted } from './ApplicationStatusBadge.tsx';
import { PaymentModal, PaymentDetails } from './PaymentModal.tsx';

interface ApplicantDashboardProps {
  onLogout: () => void;
  onBackToHome: () => void;
  onOpenJobPortal?: () => void;
  applicantData?: ApplicantAccount;
  onUpdateApplicant?: (applicant: ApplicantAccount) => void;
  notices?: NoticeItem[];
  jobApplications?: JobApplication[];
  onApplyJob?: (postName: string, circularTitle: string) => void;
  initialPendingCircular?: string | null;
  onClearInitialPendingCircular?: () => void;
  onUpdateJobApplication?: (app: JobApplication) => void;
}

export const ApplicantDashboard: React.FC<ApplicantDashboardProps> = ({
  onLogout,
  onBackToHome,
  onOpenJobPortal,
  applicantData,
  onUpdateApplicant,
  notices = [],
  jobApplications = [],
  onApplyJob,
  initialPendingCircular,
  onClearInitialPendingCircular,
  onUpdateJobApplication,
}) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'notices'>('applications');
  const [statusFilter, setStatusFilter] = useState<'all' | 'processing' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoticeForPdf, setSelectedNoticeForPdf] = useState<NoticeItem | null>(null);
  const [showBioDataModal, setShowBioDataModal] = useState(false);
  const [bioDataModalTab, setBioDataModalTab] = useState<'form' | 'copy'>('form');
  const [jobPortalModalOpen, setJobPortalModalOpen] = useState(false);

  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedAppForPayment, setSelectedAppForPayment] = useState<JobApplication | null>(null);
  const [paymentToast, setPaymentToast] = useState<string | null>(null);

  // Application Permission & Post Name Modal State
  const [selectedCircularForApply, setSelectedCircularForApply] = useState<string | null>(null);
  const [appliedSuccessToast, setAppliedSuccessToast] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialPendingCircular) {
      setSelectedCircularForApply(initialPendingCircular);
      onClearInitialPendingCircular?.();
    }
  }, [initialPendingCircular]);

  // Snapshot applicant state for viewing specific applicant copy
  const [bioDataApplicantToView, setBioDataApplicantToView] = useState<ApplicantAccount | null>(null);

  const applicant = applicantData || {
    id: 1,
    applicantName: '',
    phone: '',
    email: '',
    jobTitle: '',
    feeStatus: 'Pending',
    feeAmount: 0,
    admitStatus: 'Processing',
    appliedDate: '',
    rollNo: '',
  };

  // Filter job applications specifically for this applicant
  const myApplications: JobApplication[] = jobApplications.filter(
    (app) => app.applicantId === applicant.id || (!app.applicantId && applicant.phone && app.phone === applicant.phone)
  );

  // If user has traditional jobTitle and no entries in jobApplications yet
  const displayApplications: JobApplication[] =
    myApplications.length > 0
      ? myApplications
      : applicant.jobTitle
      ? [
          {
            id: 1,
            applicantId: applicant.id,
            applicantName: applicant.applicantName || 'Applicant',
            phone: applicant.phone,
            email: applicant.email,
            circularTitle: applicant.jobTitle,
            postName: applicant.jobTitle,
            feeStatus: applicant.feeStatus || 'Paid',
            feeAmount: applicant.feeAmount || 220,
            admitStatus: applicant.admitStatus || 'Processing',
            appliedDate: applicant.appliedDate || 'Online',
            rollNo: applicant.rollNo || 'Pending',
            refNo: applicant.refNo || 'ACTC-APP',
          },
        ]
      : [];

  const processingCount = displayApplications.filter((a) => !isApplicationCompleted(a.admitStatus)).length;
  const completedCount = displayApplications.filter((a) => isApplicationCompleted(a.admitStatus)).length;

  const statusFiltered = displayApplications.filter((app) => {
    if (statusFilter === 'processing') return !isApplicationCompleted(app.admitStatus);
    if (statusFilter === 'completed') return isApplicationCompleted(app.admitStatus);
    return true;
  });

  const filteredApps = statusFiltered.filter((app) =>
    (app.circularTitle + ' ' + app.postName + ' ' + (app.rollNo || '')).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNotices = notices.filter((n) =>
    (n.title + ' ' + (n.description || '')).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartApply = (circularTitle: string) => {
    setSelectedCircularForApply(circularTitle);
  };

  const handleConfirmSubmitApplication = (postName: string, circularTitle: string) => {
    if (onApplyJob) {
      onApplyJob(postName, circularTitle);
    }
    setAppliedSuccessToast(
      `'${circularTitle}' সার্কুলারে '${postName}' পদে আপনার আবেদন সফলভাবে সাবমিট হয়েছে! আবেদনটি বর্তমানে 'প্রক্রিয়াধীন' রয়েছে। আসাদ কম্পিউটার সেন্টারের এডমিন যাচাই করে সম্পন্ন করলে 'সম্পন্ন' ব্যাজ দেখাবে।`
    );
    setActiveTab('applications');
    setStatusFilter('all');
    setTimeout(() => {
      setAppliedSuccessToast(null);
    }, 6000);
  };

  const handleOpenCopyForApplication = (app: JobApplication) => {
    setBioDataApplicantToView({
      ...applicant,
      jobTitle: app.postName,
      rollNo: app.rollNo,
      refNo: app.refNo,
      appliedDate: app.appliedDate,
    });
    setBioDataModalTab('copy');
    setShowBioDataModal(true);
  };

  const handlePaymentSubmit = (details: PaymentDetails) => {
    if (selectedAppForPayment) {
      const updatedApp: JobApplication = {
        ...selectedAppForPayment,
        paymentMethod: details.paymentMethod,
        senderPhone: details.senderPhone,
        transactionId: details.transactionId,
        feeAmount: details.amount,
        paymentVerificationStatus: 'PendingVerification',
        paymentSubmissionDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      };
      if (onUpdateJobApplication) {
        onUpdateJobApplication(updatedApp);
      }
      if (onUpdateApplicant) {
        const updatedApps = (applicant.applications || []).map((a) =>
          a.id === updatedApp.id ? updatedApp : a
        );
        onUpdateApplicant({
          ...applicant,
          paymentMethod: details.paymentMethod,
          senderPhone: details.senderPhone,
          transactionId: details.transactionId,
          paymentVerificationStatus: 'PendingVerification',
          applications: updatedApps.length > 0 ? updatedApps : [updatedApp],
        });
      }
      setPaymentToast(
        `পেমেন্ট তথ্য সাবমিট হয়েছে (TrxID: ${details.transactionId})। এডমিনের WhatsApp নম্বরে মেসেজ পাঠানো হয়েছে, এডমিন যাচাই সম্পন্ন করলে 'Paid' আপডেট হয়ে যাবে।`
      );
      setTimeout(() => setPaymentToast(null), 8000);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#dce4f2] p-2 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center font-sans antialiased">
        <div className="w-full max-w-7xl bg-[#f0f4fa] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-white/60 min-h-[750px]">
          
          {/* Left Dark Sidebar */}
          <aside className="w-full lg:w-60 bg-[#161a2b] text-stone-300 p-6 flex flex-col justify-between shrink-0">
            <div>
              <div className="flex flex-col items-center pb-6 border-b border-white/10 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-600 p-0.5 shadow-lg mb-2.5">
                  <div className="w-full h-full rounded-full bg-[#161a2b] flex items-center justify-center text-white font-bold text-xl">
                    {applicant.applicantName ? applicant.applicantName.charAt(0).toUpperCase() : 'A'}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {applicant.applicantName || 'Applicant (নতুন প্রোফাইল)'}
                </h3>
                {applicant.phone ? (
                  <span className="text-[11px] text-emerald-400 font-mono mt-0.5">
                    {applicant.phone}
                  </span>
                ) : null}
                <span className="text-[10px] text-stone-400 mt-1 px-2 py-0.5 bg-white/5 rounded-full">
                  Applicant Portal
                </span>
              </div>

              <nav className="mt-6 space-y-1.5 text-xs">
                {/* Prominent Creat a Account / Bio-Data button */}
                <button
                  onClick={() => {
                    setBioDataApplicantToView(applicant);
                    setBioDataModalTab('form');
                    setShowBioDataModal(true);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md transition-all cursor-pointer mb-2 border border-emerald-400/30"
                >
                  <div className="flex items-center space-x-2.5">
                    <UserPlus className="w-4 h-4 text-emerald-100" />
                    <span>Creat a Account</span>
                  </div>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-mono">
                    {applicant.isAccountCompleted ? 'Saved' : 'Form'}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('applications')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                    activeTab === 'applications'
                      ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500'
                      : 'text-stone-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-4 h-4" />
                    <span>My Applications</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {completedCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold animate-pulse shadow-2xs">
                        ✓ {completedCount} সম্পন্ন
                      </span>
                    )}
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 font-bold">
                      {displayApplications.length}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('notices')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                    activeTab === 'notices'
                      ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500'
                      : 'text-stone-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Bell className="w-4 h-4 text-rose-400" />
                    <span>Admin Notices & Apply</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold">
                    {notices.length}
                  </span>
                </button>

                <button
                  onClick={() => {
                    setBioDataApplicantToView(applicant);
                    setBioDataModalTab('copy');
                    setShowBioDataModal(true);
                  }}
                  className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-stone-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Applicant's Copy (PDF)</span>
                </button>

                <button
                  onClick={() => {
                    setJobPortalModalOpen(true);
                    onOpenJobPortal?.();
                  }}
                  className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-stone-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <span>Job Portal / Circulars</span>
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

          {/* Middle Main Content */}
          <main className="flex-1 p-5 sm:p-7 md:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Top Search & Actions Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search applied jobs, notices, posts, status..."
                    className="w-full bg-white rounded-full py-2.5 pl-10 pr-4 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 shadow-xs border border-stone-200 outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setBioDataApplicantToView(applicant);
                      setBioDataModalTab('form');
                      setShowBioDataModal(true);
                    }}
                    className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-full shadow-md transition-all cursor-pointer border border-emerald-400/30"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Creat a Account</span>
                  </button>

                  <div className="hidden md:flex items-center space-x-2 text-xs text-stone-600 bg-white px-3 py-1.5 rounded-full shadow-xs border border-stone-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified Applicant</span>
                  </div>
                </div>
              </div>

              {/* Toast Notification for Success */}
              {appliedSuccessToast && (
                <div className="mb-5 p-4 rounded-xl bg-emerald-600 text-white shadow-lg flex items-start space-x-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <CheckCircle className="w-5 h-5 text-emerald-100 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs sm:text-sm font-semibold leading-relaxed">
                    {appliedSuccessToast}
                  </div>
                  <button
                    onClick={() => setAppliedSuccessToast(null)}
                    className="text-white/80 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Account Bio-Data Status Notice Banner */}
              <div className="mb-5 bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-stone-900 text-sm">
                        আবেদনকারীর পূর্ণাঙ্গ বায়োডাটা প্রোফাইল
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {applicant.isAccountCompleted ? '✓ সংরক্ষিত' : 'ফরম পূরণ করুন'}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      একবার পূরণ করলে তথ্য স্থায়ীভাবে সেভ থাকবে। নতুন কোন চাকুরীতে আবেদনের সময় সরাসরি এই তথ্য যাবে।
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      setBioDataApplicantToView(applicant);
                      setBioDataModalTab('form');
                      setShowBioDataModal(true);
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Creat a Account / এডিট</span>
                  </button>

                  <button
                    onClick={() => {
                      setBioDataApplicantToView(applicant);
                      setBioDataModalTab('copy');
                      setShowBioDataModal(true);
                    }}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl border border-stone-300 transition-colors flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-blue-600" />
                    <span>অফিসিয়াল কপি</span>
                  </button>
                </div>
              </div>

              {/* 4 Category Cards with Processing vs Completed Badges */}
              <div className="mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div
                    onClick={() => {
                      setActiveTab('applications');
                      setStatusFilter('all');
                    }}
                    className="bg-[#1e293b] text-white p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow border border-stone-800"
                  >
                    <div className="text-xs font-semibold text-stone-300">মোট আবেদন (Total)</div>
                    <div className="text-xl font-bold mt-1">{displayApplications.length} টি</div>
                    <div className="text-[10px] text-stone-400 mt-1">ক্লিক করে সব দেখুন</div>
                  </div>

                  <div
                    onClick={() => {
                      setActiveTab('applications');
                      setStatusFilter('processing');
                    }}
                    className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-amber-100">
                      <span>প্রক্রিয়াধীন (Processing)</span>
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    </div>
                    <div className="text-xl font-bold mt-1">{processingCount} টি আবেদন</div>
                    <div className="text-[10px] text-amber-100/90 mt-1 flex items-center space-x-1">
                      <Clock className="w-3 h-3 inline" />
                      <span>এডমিন যাচাই চলছে</span>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setActiveTab('applications');
                      setStatusFilter('completed');
                    }}
                    className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-100">
                      <span>সম্পন্ন (Completed)</span>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-200" />
                    </div>
                    <div className="text-xl font-bold mt-1">{completedCount} টি আবেদন</div>
                    <div className="text-[10px] text-emerald-100/90 mt-1">অনুমোদিত ও সম্পন্ন</div>
                  </div>

                  <div
                    onClick={() => setActiveTab('notices')}
                    className="bg-[#2a68ff] text-white p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="text-xs font-semibold">Admin Notices</div>
                    <div className="text-xl font-bold mt-1">{notices.length} Circulars</div>
                    <div className="text-[10px] text-white/80 mt-1">নতুন আবেদন করুন</div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs Bar inside Dashboard */}
              <div className="flex flex-wrap items-center gap-2 border-b border-stone-300 pb-2 mb-4 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
                    activeTab === 'applications'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>আমার আবেদনসমূহ ({displayApplications.length})</span>
                  {completedCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse shadow-2xs">
                      🎉 {completedCount} সম্পন্ন
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('notices')}
                  className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
                    activeTab === 'notices'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>এডমিনের সকল নোটিশ ও আবেদন করুন ({notices.length})</span>
                </button>

                <button
                  onClick={() => setJobPortalModalOpen(true)}
                  className="px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center space-x-2 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Job Portal / Circulars (লাইভ সার্কুলার)</span>
                </button>
              </div>

              {/* TAB 1: MY APPLICATIONS LIST */}
              {activeTab === 'applications' && (
                <div>
                  {/* Status Filter Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
                    <div className="flex items-center space-x-2">
                      <Filter className="w-3.5 h-3.5 text-stone-400" />
                      <span className="text-xs font-bold text-stone-700">স্ট্যাটাস ফিল্টার:</span>
                      
                      <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          statusFilter === 'all'
                            ? 'bg-stone-900 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        সকল ({displayApplications.length})
                      </button>

                      <button
                        onClick={() => setStatusFilter('processing')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                          statusFilter === 'processing'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>প্রক্রিয়াধীন ({processingCount})</span>
                      </button>

                      <button
                        onClick={() => setStatusFilter('completed')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                          statusFilter === 'completed'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                        }`}
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>সম্পন্ন ({completedCount})</span>
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setJobPortalModalOpen(true)}
                        className="text-xs text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg font-bold cursor-pointer flex items-center space-x-1"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                        <span>নতুন সার্কুলার</span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Toast Notification */}
                  {paymentToast && (
                    <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs flex items-center justify-between shadow-xs">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium">{paymentToast}</span>
                      </div>
                      <button onClick={() => setPaymentToast(null)} className="text-emerald-700 hover:text-emerald-950 p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Payment Information Notice Banner */}
                  <div className="mb-4 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-pink-50 via-purple-50 to-orange-50 border border-pink-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-pink-600 text-white shrink-0 shadow-xs">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-stone-900 text-xs sm:text-sm">
                            অনলাইন আবেদন ফি পেমেন্ট (Send Money)
                          </span>
                          <span className="text-[10px] font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full">
                            bKash / Nagad / Rocket
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-700 mt-1 leading-relaxed">
                          বিকাশ ও রকেট: <strong className="font-mono text-stone-900">01773733654</strong> · নগদ: <strong className="font-mono text-stone-900">01864399871</strong> নম্বরে আবেদন ফি (৳২২০) সেন্ড মানি করুন। পেমেন্ট শেষে ট্রানজেকশন আইডি ও মোবাইল নম্বর সাবমিট দিন। এডমিন চেক করে পেইড করে দেবে।
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Notification Banner for Admin Completed Applications */}
                  {completedCount > 0 && (
                    <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-emerald-400/40 animate-in fade-in duration-300">
                      <div className="flex items-start sm:items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
                          <CheckCircle className="w-6 h-6 text-emerald-200" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm sm:text-base">
                              🎉 অভিনন্দন! আপনার {completedCount} টি আবেদন সফলভাবে 'সম্পন্ন' (Completed) হয়েছে!
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-800 shadow-2xs uppercase">
                              Approved
                            </span>
                          </div>
                          <p className="text-xs text-emerald-100 mt-0.5 leading-relaxed">
                            এডমিন আপনার আবেদনটি সফলভাবে সম্পন্ন করেছেন। নিচে 'সম্পন্ন' ব্যাজ চিহ্নিত আবেদনটির অফিসিয়াল কপি বা এডমিট কার্ড ডাউনলোড ও প্রিন্ট করতে পারবেন।
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                        <button
                          onClick={() => setStatusFilter('completed')}
                          className="px-3.5 py-1.5 bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          শুধুমাত্র সম্পন্ন আবেদন ({completedCount})
                        </button>
                      </div>
                    </div>
                  )}

                  {filteredApps.length > 0 ? (
                    <div className="space-y-3">
                      {filteredApps.map((app) => {
                        const isCompleted = isApplicationCompleted(app.admitStatus);
                        return (
                          <div
                            key={`app-card-${app.id}`}
                            className={`p-4 sm:p-5 rounded-xl shadow-xs transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs ${
                              isCompleted
                                ? 'bg-gradient-to-r from-emerald-50/60 via-white to-white border-2 border-emerald-400 shadow-emerald-500/10'
                                : 'bg-white border border-stone-200 hover:shadow-sm'
                            }`}
                          >
                            <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                                isCompleted ? 'bg-emerald-600 text-white' : 'bg-stone-700 text-white'
                              }`}>
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                {/* Clear UI Notification Badge directly above application title */}
                                {isCompleted ? (
                                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-2xs animate-pulse">
                                      <CheckCircle className="w-3 h-3 text-white" />
                                      <span>🎉 সম্পন্ন (Admin Completed & Approved)</span>
                                    </span>
                                    <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200">
                                      ✓ চূড়ান্ত কপি ও এডমিট কার্ড প্রস্তুত
                                    </span>
                                  </div>
                                ) : (
                                  <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-2xs">
                                      <Clock className="w-3 h-3 text-white" />
                                      <span>⏳ প্রক্রিয়াধীন (Processing)</span>
                                    </span>
                                    <span className="text-[10px] text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200">
                                      এডমিন যাচাই চলছে
                                    </span>
                                  </div>
                                )}

                                <h5 className="font-bold text-stone-900 text-sm truncate">
                                  {app.circularTitle}
                                </h5>
                                {app.remarks && (
                                  <div className="mt-1 inline-flex items-center space-x-1.5 text-[11px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                    <Info className="w-3 h-3 text-amber-600 shrink-0" />
                                    <span>মন্তব্য / ফি নোট: {app.remarks}</span>
                                  </div>
                                )}
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                                  <span className="px-2.5 py-0.5 rounded-md font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                    আবেদিত পদ: {app.postName}
                                  </span>
                                  <span className="font-mono text-stone-600 font-medium">
                                    {app.rollNo}
                                  </span>
                                  <span className="text-stone-400">·</span>
                                  <span className="text-stone-500">{app.appliedDate}</span>
                                  <span className="text-stone-400">·</span>
                                  {app.feeStatus === 'Paid' ? (
                                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 flex items-center space-x-1">
                                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                                      <span>Paid (৳{app.feeAmount || 220})</span>
                                    </span>
                                  ) : app.paymentVerificationStatus === 'PendingVerification' ? (
                                    <span className="font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 flex items-center space-x-1">
                                      <Clock className="w-3 h-3 text-amber-700 animate-pulse" />
                                      <span>যাচাই প্রক্রিয়াধীন (TrxID: {app.transactionId})</span>
                                    </span>
                                  ) : (
                                    <span className="font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                                      ফি বাকি (Pending ৳{app.feeAmount || 220})
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                          <div className="flex flex-wrap items-center gap-2.5 self-end sm:self-auto">
                            {/* Color-Coded Processing vs Completed Badge */}
                            <ApplicationStatusBadge
                              status={app.admitStatus}
                              size="sm"
                              showSubtext={true}
                            />

                            {/* Pay / Update Payment Button */}
                            {app.feeStatus !== 'Paid' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedAppForPayment(app);
                                  setPaymentModalOpen(true);
                                }}
                                className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer ${
                                  app.paymentVerificationStatus === 'PendingVerification'
                                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                                    : 'bg-gradient-to-r from-[#E2136E] to-[#E85D04] hover:opacity-90 text-white shadow-sm'
                                }`}
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>
                                  {app.paymentVerificationStatus === 'PendingVerification'
                                    ? 'পেমেন্ট TrxID পরিবর্তন'
                                    : 'অনলাইন ফি দিন (৳' + (app.feeAmount || 220) + ')'}
                                </span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleOpenCopyForApplication(app)}
                              className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1 cursor-pointer border border-stone-300"
                            >
                              <Printer className="w-3.5 h-3.5 text-blue-600" />
                              <span>Applicant Copy (কপি)</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  ) : (
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-dashed border-stone-300 text-center space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="font-bold text-stone-800 text-sm">কোনো আবেদন এখনও জমা হয়নি</h5>
                        <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                          এডমিনের নোটিশ বোর্ড থেকে সরাসরি যেকোনো বিজ্ঞপ্তিতে ক্লিক করে আপনার পদের নাম দিয়ে আবেদন জমা দিন।
                        </p>
                      </div>
                      <div className="flex items-center justify-center space-x-3 pt-2">
                        <button
                          onClick={() => setActiveTab('notices')}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          <span>নোটিশ দেখুন ও আবেদন করুন</span>
                        </button>
                        <button
                          onClick={() => {
                            setBioDataApplicantToView(applicant);
                            setBioDataModalTab('form');
                            setShowBioDataModal(true);
                          }}
                          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-xl border border-stone-300 transition-colors cursor-pointer"
                        >
                          বায়োডাটা পূরণ করুন
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ADMIN PUBLISHED NOTICES WITH DIRECT APPLY */}
              {activeTab === 'notices' && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                        <span>এডমিনের সকল প্রকাশিত নোটিশ ও চাকুরীর সার্কুলার ({notices.length})</span>
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        যেকোনো নোটিশে 'আবেদন করুন' বোতামে ক্লিক করে শুধু পদের নাম লিখলেই আবেদন জমা হয়ে যাবে।
                      </p>
                    </div>

                    <button
                      onClick={() => setJobPortalModalOpen(true)}
                      className="px-3.5 py-2 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer shrink-0"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Job Portal দেখুন</span>
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {filteredNotices.map((notice) => (
                      <div
                        key={`dash-notice-${notice.id}`}
                        className="bg-white rounded-xl border border-stone-200 hover:border-emerald-300 p-4 sm:p-5 shadow-xs hover:shadow-sm transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-200">
                              {notice.category} Notice
                            </span>
                            {notice.urgent && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                Urgent
                              </span>
                            )}
                            <span className="text-[11px] text-stone-400">{notice.date}</span>
                          </div>

                          <h5 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                            {notice.title}
                          </h5>

                          {notice.description && (
                            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                              {notice.description}
                            </p>
                          )}

                          {notice.pdfName && (
                            <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-teal-50 border border-teal-200 text-teal-800 text-[11px]">
                              <Paperclip className="w-3.5 h-3.5 text-teal-600" />
                              <span>সংযুক্ত সার্কুলার ফাইল: <strong>{notice.pdfName}</strong></span>
                            </div>
                          )}
                        </div>

                        {/* Actions for this notice */}
                        <div className="flex items-center space-x-2.5 shrink-0 self-end md:self-auto">
                          {notice.pdfName && (
                            <button
                              onClick={() => setSelectedNoticeForPdf(notice)}
                              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-xl text-xs transition-colors flex items-center space-x-1.5 cursor-pointer border border-stone-300"
                            >
                              <Eye className="w-3.5 h-3.5 text-rose-600" />
                              <span>PDF দেখুন</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleStartApply(notice.title)}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center space-x-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>আবেদন করুন (Apply)</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-72 bg-white/60 p-5 sm:p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-stone-200 shrink-0">
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-xs font-bold text-stone-800 tracking-wider uppercase flex items-center space-x-1.5">
                    <Bell className="w-3.5 h-3.5 text-rose-500" />
                    <span>Official Job Circulars</span>
                  </h5>
                </div>
                
                <div className="space-y-2.5">
                  {notices.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2"
                    >
                      <div className="font-semibold text-stone-900 leading-tight">{n.title}</div>
                      <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-100">
                        <span>{n.date}</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedNoticeForPdf(n)}
                            className="text-stone-600 hover:text-stone-900 font-bold cursor-pointer"
                          >
                            PDF
                          </button>
                          <button
                            onClick={() => handleStartApply(n.title)}
                            className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer underline"
                          >
                            আবেদন
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200">
                <h5 className="text-xs font-bold text-stone-800 tracking-wider uppercase mb-2">
                  Asad Computer Support
                </h5>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Bring your application copy to our center for exam syllabus and admit card color laser printing.
                </p>
              </div>

            </div>

            <div className="pt-4 border-t border-stone-200 text-center text-[11px] text-stone-500">
              Helpline: <strong>01773-733654</strong><br />
              Bottola, Bhully Bazar, Thakurgaon
            </div>
          </aside>

        </div>
      </div>

      {/* Bio-Data Full Form & Applicant Copy Modal */}
      <ApplicantBioDataModal
        isOpen={showBioDataModal}
        onClose={() => setShowBioDataModal(false)}
        applicant={bioDataApplicantToView || applicant}
        initialTab={bioDataModalTab}
        onSaveApplicant={(updated) => {
          onUpdateApplicant?.(updated);
        }}
      />

      {/* PDF Viewer Modal */}
      <NoticePdfViewerModal
        isOpen={Boolean(selectedNoticeForPdf)}
        onClose={() => setSelectedNoticeForPdf(null)}
        notice={selectedNoticeForPdf}
      />

      {/* Application Permission & Post Name Modal */}
      {selectedCircularForApply && (
        <ApplicationPermissionModal
          isOpen={Boolean(selectedCircularForApply)}
          onClose={() => setSelectedCircularForApply(null)}
          circularTitle={selectedCircularForApply}
          applicant={applicant}
          onSubmitApplication={handleConfirmSubmitApplication}
        />
      )}

      {/* Job Portal / Circulars Modal for logged-in applicant */}
      <JobPortalModal
        isOpen={jobPortalModalOpen}
        onClose={() => setJobPortalModalOpen(false)}
        notices={notices}
        isLoggedIn={true}
        applicantData={applicant}
        onApplyDirectly={(circularTitle) => {
          setJobPortalModalOpen(false);
          handleStartApply(circularTitle);
        }}
      />

      {/* Online Payment Modal (bKash / Nagad / Rocket Send Money & WhatsApp Verification) */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
          setSelectedAppForPayment(null);
        }}
        title="চাকুরী আবেদন ফি পরিশোধ (Online Fee Payment)"
        userType="applicant"
        userName={applicant.applicantName || 'Applicant'}
        userPhone={applicant.phone || ''}
        userRollOrRef={selectedAppForPayment?.rollNo || applicant.rollNo || 'APP-ACTC'}
        amount={
          selectedAppForPayment?.feeAmount ||
          notices.find((n) => n.title.trim().toLowerCase() === selectedAppForPayment?.circularTitle.trim().toLowerCase())?.feeAmount ||
          220
        }
        itemTitle={selectedAppForPayment ? `${selectedAppForPayment.circularTitle} (${selectedAppForPayment.postName})` : 'চাকুরী আবেদন ফি'}
        noticeRemarks={
          selectedAppForPayment?.remarks ||
          notices.find((n) => n.title.trim().toLowerCase() === selectedAppForPayment?.circularTitle.trim().toLowerCase())?.remarks
        }
        onPaymentSubmit={handlePaymentSubmit}
      />
    </>
  );
};
