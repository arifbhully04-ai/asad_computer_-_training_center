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
} from 'lucide-react';
import { ApplicantAccount, NoticeItem, JobApplication } from '../types.ts';
import { NoticePdfViewerModal } from './NoticePdfViewerModal.tsx';
import { ApplicantBioDataModal } from './ApplicantBioDataModal.tsx';
import { ApplicationPermissionModal } from './ApplicationPermissionModal.tsx';
import { JobPortalModal } from './JobPortalModal.tsx';

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
}) => {
  const [activeTab, setActiveTab] = useState<'applications' | 'notices'>('applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoticeForPdf, setSelectedNoticeForPdf] = useState<NoticeItem | null>(null);
  const [showBioDataModal, setShowBioDataModal] = useState(false);
  const [bioDataModalTab, setBioDataModalTab] = useState<'form' | 'copy'>('form');
  const [jobPortalModalOpen, setJobPortalModalOpen] = useState(false);

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

  const filteredApps = displayApplications.filter((app) =>
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
      `'${circularTitle}' সার্কুলারে '${postName}' পদে আপনার আবেদন সফলভাবে সাবমিট হয়েছে! আসাদ কম্পিউটার সেন্টারে আপনার তথ্য জমা হয়েছে।`
    );
    setActiveTab('applications');
    setTimeout(() => {
      setAppliedSuccessToast(null);
    }, 5000);
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
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 font-bold">
                    {displayApplications.length}
                  </span>
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

              {/* 4 Category Cards */}
              <div className="mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div
                    onClick={() => setActiveTab('applications')}
                    className="bg-[#ff5b57] text-white p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="text-xs font-semibold">Total Applied</div>
                    <div className="text-xl font-bold mt-1">{displayApplications.length} Application{displayApplications.length !== 1 ? 's' : ''}</div>
                    <div className="text-[10px] text-white/80 mt-1">Submitted & Verified</div>
                  </div>

                  <div
                    onClick={() => setActiveTab('notices')}
                    className="bg-[#2a68ff] text-white p-4 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="text-xs font-semibold">Admin Notices</div>
                    <div className="text-xl font-bold mt-1">{notices.length} Circulars</div>
                    <div className="text-[10px] text-white/80 mt-1">Click to Apply Now</div>
                  </div>

                  <div className="bg-[#00b4d8] text-white p-4 rounded-2xl shadow-sm">
                    <div className="text-xs font-semibold">Center Processing</div>
                    <div className="text-xl font-bold mt-1">Active</div>
                    <div className="text-[10px] text-white/80 mt-1">Bhully Bazar Desk</div>
                  </div>

                  <div className="bg-[#ffb703] text-stone-950 p-4 rounded-2xl shadow-sm">
                    <div className="text-xs font-bold">Helpline</div>
                    <div className="text-xl font-bold mt-1">01773-733654</div>
                    <div className="text-[10px] text-stone-800 mt-1">Bottola, Bhully Bazar</div>
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
                  <span>আমার আবেদনসমূহ (My Applications - {displayApplications.length})</span>
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
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h4 className="text-xs font-bold text-stone-800 tracking-wider uppercase">
                      My Submitted Applications & Selected Posts
                    </h4>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setJobPortalModalOpen(true)}
                        className="text-xs text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1.5 rounded-lg font-bold cursor-pointer flex items-center space-x-1"
                      >
                        <Briefcase className="w-3.5 h-3.5 text-teal-600" />
                        <span>Job Portal / Circulars</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('notices')}
                        className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer flex items-center space-x-1"
                      >
                        <span>+ এডমিন নোটিশ</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {filteredApps.length > 0 ? (
                    <div className="space-y-3">
                      {filteredApps.map((app) => (
                        <div
                          key={`app-card-${app.id}`}
                          className="bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-stone-200 hover:shadow-sm transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                        >
                          <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-stone-900 text-sm truncate">
                                {app.circularTitle}
                              </h5>
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
                                <span className="text-emerald-700 font-semibold">{app.feeStatus} (৳{app.feeAmount})</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 self-end sm:self-auto">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-blue-50 text-blue-800 border-blue-200">
                              {app.admitStatus === 'Ready' ? 'Admit Card Ready' : 'Application Submitted'}
                            </span>

                            <button
                              onClick={() => handleOpenCopyForApplication(app)}
                              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1 cursor-pointer border border-stone-300"
                            >
                              <Printer className="w-3.5 h-3.5 text-blue-600" />
                              <span>Applicant Copy</span>
                            </button>

                            {app.admitStatus === 'Ready' && (
                              <button
                                onClick={() => {
                                  alert(`Admit Card for ${app.postName} (${app.circularTitle}) is ready. Roll: ${app.rollNo}. Visit Asad Computer desk at Bottola, Bhully Bazar for laser print!`);
                                }}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Admit Card</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
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
    </>
  );
};
