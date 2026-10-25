import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Briefcase,
  Users,
  Building2,
  Calendar,
  Award,
  FileText,
  Bookmark,
  LogIn,
  UserPlus,
  ArrowRight,
  Bell,
  Eye,
  Paperclip,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { NoticeItem, StudentAccount, ApplicantAccount } from '../types.ts';
import { LoginRole, LoginModal } from './LoginModal.tsx';
import { CircularViewerModal } from './CircularViewerModal.tsx';
import { NoticePdfViewerModal } from './NoticePdfViewerModal.tsx';

interface JobPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmission?: () => void;
  notices?: NoticeItem[];
  students?: StudentAccount[];
  applicants?: ApplicantAccount[];
  onOpenLogin?: (role?: LoginRole, mode?: 'login' | 'register', jobTitle?: string) => void;
  onRegisterApplicant?: (newApplicant: ApplicantAccount) => void;
  onLoginSuccess?: (role: LoginRole, user?: StudentAccount | ApplicantAccount) => void;
  isLoggedIn?: boolean;
  applicantData?: ApplicantAccount;
  onApplyDirectly?: (circularTitle: string) => void;
}

interface JobItem {
  id: number;
  timeAgo: string;
  title: string;
  organization: string;
  qualification: string;
  vacancies: string;
  deadline: string;
  logoBg: string;
  logoLetter: string;
}

const defaultCircularJobs: JobItem[] = [
  {
    id: 101,
    timeAgo: 'Just Posted',
    title: 'Computer Operator & Office Assistant',
    organization: 'Directorate of Primary Education & Literacy',
    qualification: 'HSC / Degree with Computer Office Application',
    vacancies: '78 Posts',
    deadline: 'Deadline: 30 Nov 2026',
    logoBg: 'bg-emerald-700',
    logoLetter: 'DPE',
  },
  {
    id: 102,
    timeAgo: '15 min ago',
    title: 'Data Entry / Computer Operator',
    organization: 'Bangladesh Railway (BR) General Administration',
    qualification: 'HSC Passed + Typing Speed (Bangla & English)',
    vacancies: '142 Posts',
    deadline: 'Deadline: 15 Dec 2026',
    logoBg: 'bg-red-700',
    logoLetter: 'BR',
  },
  {
    id: 103,
    timeAgo: '1 hour ago',
    title: 'Office Assistant cum Computer Typist',
    organization: 'Directorate General of Health Services (DGHS)',
    qualification: 'HSC / Equivalent with Certified Computer Training',
    vacancies: '95 Posts',
    deadline: 'Deadline: 25 Nov 2026',
    logoBg: 'bg-sky-700',
    logoLetter: 'DGH',
  },
  {
    id: 104,
    timeAgo: 'Today',
    title: 'Junior Officer (General & IT Support)',
    organization: 'Bangladesh Bank & State Bank Consortium',
    qualification: 'Graduate / Degree with Computer Literacy',
    vacancies: '50 Posts',
    deadline: 'Deadline: 20 Dec 2026',
    logoBg: 'bg-amber-700',
    logoLetter: 'BB',
  },
];

export const JobPortalModal: React.FC<JobPortalModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmission,
  notices = [],
  students = [],
  applicants = [],
  onOpenLogin,
  onRegisterApplicant,
  onLoginSuccess,
  isLoggedIn = false,
  applicantData,
  onApplyDirectly,
}) => {
  const scrollOverlayRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'admin-notices' | 'job-circulars'>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  
  // Local fallback login modal state
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<'login' | 'register'>('login');
  const [selectedJobTitleForAuth, setSelectedJobTitleForAuth] = useState<string>('');

  // Circular / Notice PDF Viewer State
  const [circularModalOpen, setCircularModalOpen] = useState(false);
  const [selectedCircular, setSelectedCircular] = useState<JobItem | null>(null);
  const [selectedNoticeForPdf, setSelectedNoticeForPdf] = useState<NoticeItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (scrollOverlayRef.current) {
        scrollOverlayRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleBookmark = (id: number) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleTriggerAuth = (mode: 'login' | 'register', jobTitle?: string) => {
    if (onOpenLogin) {
      // Use parent-level login flow: close JobPortalModal and open LoginModal with target job
      onClose();
      onOpenLogin('applicant', mode, jobTitle);
    } else {
      // Fallback local login modal
      setSelectedJobTitleForAuth(jobTitle || 'Computer Operator & Office Assistant');
      setLoginModalMode(mode);
      setLoginModalOpen(true);
    }
  };

  const handleApplyClick = (jobTitle: string) => {
    if (isLoggedIn && onApplyDirectly) {
      onClose();
      onApplyDirectly(jobTitle);
    } else {
      handleTriggerAuth('login', jobTitle);
    }
  };

  const handleViewCircular = (job: JobItem) => {
    setSelectedCircular(job);
    setCircularModalOpen(true);
  };

  const handleViewNoticePdf = (notice: NoticeItem) => {
    setSelectedNoticeForPdf(notice);
  };

  return (
    <>
      <div
        ref={scrollOverlayRef}
        className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-start justify-center p-2 sm:p-4 md:p-6 py-4 sm:py-8"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-5xl bg-white shadow-2xl rounded-none border border-stone-200 overflow-hidden my-2 sm:my-4 transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Floating Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-40 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
            aria-label="Close Job Portal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 1. Header Bar: Name: Job Portal / Notice */}
          <div className="bg-[#111418] text-white px-6 sm:px-10 py-5 flex items-center justify-between border-b border-white/10">
            {/* Logo with briefcase & notice bell */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-md flex items-center justify-center border border-emerald-500/40 bg-emerald-950/40 shadow-xs">
                <Briefcase className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
                  <span>Job Portal / Notice</span>
                  <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Live Updates
                  </span>
                </span>
                <span className="text-[11px] text-stone-400 block">
                  Asad Computer & Training Center · Bottola, Bhully Bazar
                </span>
              </div>
            </div>

            {/* Header Right: If logged in, show user info; otherwise show Login & Register */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3 pr-8 sm:pr-10">
                <div className="flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="truncate max-w-[140px] sm:max-w-[200px]">
                    {applicantData?.applicantName ? `${applicantData.applicantName} (লগইন করা)` : 'Applicant (Logged In)'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 sm:space-x-4 pr-10">
                <button
                  onClick={() => handleTriggerAuth('login')}
                  className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold text-stone-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-md transition-all duration-200 cursor-pointer shadow-sm"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  <span>Login</span>
                </button>

                <button
                  onClick={() => handleTriggerAuth('register')}
                  className="flex items-center space-x-2 px-5 sm:px-7 py-2.5 bg-[#00897b] hover:bg-[#00796b] text-white text-xs sm:text-sm font-bold rounded-md transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. Hero Section: Headline, subtitle & stats */}
          <div className="relative min-h-[300px] sm:min-h-[340px] flex flex-col items-center justify-center text-center px-6 sm:px-12 py-10 sm:py-14 overflow-hidden bg-stone-900">
            {/* Background image */}
            <img
              src="/src/assets/images/job_portal_hero_1792826919302.jpg"
              alt="Office Team Collaborating"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.40] contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

            {/* Hero Content */}
            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Official Job Portal & Live Notice Board</span>
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-white tracking-tight leading-tight">
                Find Your Dream Job & Official Notices Today!
              </h2>
              <p className="mt-2.5 text-xs sm:text-sm text-stone-300 max-w-xl font-light">
                Connecting Talent with Opportunity · View Verified Government Circulars & Admin Announcements
              </p>

              {/* 3 Stats Counters */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-white">
                <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-xs px-4 py-2 rounded-lg border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-[#00897b]/30 border border-[#00897b]/70 flex items-center justify-center text-teal-300">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-base sm:text-lg leading-tight">25,850+</span>
                    <span className="text-[11px] text-stone-300 uppercase tracking-wider">Jobs</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-xs px-4 py-2 rounded-lg border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-rose-500/30 border border-rose-500/70 flex items-center justify-center text-rose-300">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-base sm:text-lg leading-tight">{notices.length} Live</span>
                    <span className="text-[11px] text-stone-300 uppercase tracking-wider">Admin Notices</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-xs px-4 py-2 rounded-lg border border-white/10">
                  <div className="w-10 h-10 rounded-full bg-amber-500/30 border border-amber-500/70 flex items-center justify-center text-amber-300">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-base sm:text-lg leading-tight">10,250+</span>
                    <span className="text-[11px] text-stone-300 uppercase tracking-wider">Applicants</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 3. Main Section: Filter Tabs + Admin Uploaded Notices + Job Circulars */}
          <div className="p-6 sm:p-10 bg-[#fafafa]">
            
            {/* Header and Filter Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                  Available Circulars & Official Notices
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Admin published notices, official PDF documents, and government job circulars
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center space-x-1.5 p-1 bg-stone-200/80 rounded-lg text-xs font-semibold self-start sm:self-auto">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
                    activeFilter === 'all'
                      ? 'bg-white text-stone-900 shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All ({notices.length + defaultCircularJobs.length})
                </button>
                <button
                  onClick={() => setActiveFilter('admin-notices')}
                  className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center space-x-1 ${
                    activeFilter === 'admin-notices'
                      ? 'bg-rose-600 text-white shadow-xs font-bold'
                      : 'text-stone-600 hover:text-rose-700'
                  }`}
                >
                  <Bell className="w-3 h-3" />
                  <span>Admin Notices ({notices.length})</span>
                </button>
                <button
                  onClick={() => setActiveFilter('job-circulars')}
                  className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center space-x-1 ${
                    activeFilter === 'job-circulars'
                      ? 'bg-emerald-700 text-white shadow-xs font-bold'
                      : 'text-stone-600 hover:text-emerald-800'
                  }`}
                >
                  <Briefcase className="w-3 h-3" />
                  <span>Job Circulars ({defaultCircularJobs.length})</span>
                </button>
              </div>
            </div>

            {/* SECTION A: Admin Published Notices */}
            {(activeFilter === 'all' || activeFilter === 'admin-notices') && notices.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3.5">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                    <span>Official Admin Announcements & Circular Notices ({notices.length})</span>
                  </h4>
                  <span className="text-[11px] text-stone-500">
                    Uploaded directly by Institute Admin
                  </span>
                </div>

                <div className="space-y-3.5">
                  {notices.map((notice) => {
                    return (
                      <div
                        key={`admin-notice-${notice.id}`}
                        className="bg-white rounded-xl border-2 border-rose-200/80 hover:border-rose-300 p-5 shadow-xs hover:shadow-md transition-shadow relative"
                      >
                        {/* Notice Header with Category & Date */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-rose-100 text-rose-800 border border-rose-200">
                              Admin Published · {notice.category} Notice
                            </span>
                            {notice.urgent && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                Urgent
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-400 font-medium">{notice.date}</span>
                        </div>

                        {/* Title and Organization */}
                        <div className="mb-2">
                          <h4 className="text-base sm:text-lg font-bold text-stone-900 hover:text-rose-700 transition-colors">
                            {notice.title}
                          </h4>
                          <p className="text-xs text-stone-600 font-normal mt-1 leading-relaxed">
                            {notice.description ||
                              'Official notice published by Asad Computer & Training Center. All eligible candidates and students are instructed to follow the instructions.'}
                          </p>
                        </div>

                        {/* PDF Attachment Badge if uploaded */}
                        {notice.pdfName && (
                          <div className="mb-3 inline-flex items-center space-x-2 px-3 py-1 rounded bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium">
                            <Paperclip className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>Attached Circular Document: <strong>{notice.pdfName}</strong></span>
                          </div>
                        )}

                        {/* Actions: View Circular (PDF) & Apply Now */}
                        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-100">
                          {/* View PDF Button: opens the official PDF document viewer */}
                          <button
                            onClick={() => handleViewNoticePdf(notice)}
                            className="flex items-center space-x-1.5 px-4 py-2 border border-rose-300 hover:border-rose-500 bg-rose-50/50 hover:bg-rose-100/70 text-rose-800 text-xs font-bold rounded transition-colors cursor-pointer"
                            title="View official notice and download PDF"
                          >
                            <Eye className="w-3.5 h-3.5 text-rose-600" />
                            <span>View Circular / Notice (PDF)</span>
                          </button>

                          {/* Apply Now: direct application if logged in, otherwise auth */}
                          <button
                            onClick={() => handleApplyClick(notice.title)}
                            className="flex items-center space-x-1.5 px-5 py-2 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded transition-colors shadow-xs hover:shadow-md cursor-pointer"
                            title={isLoggedIn ? 'আবেদন করতে ক্লিক করুন' : 'Click to Login and Apply'}
                          >
                            <span>{isLoggedIn ? 'আবেদন করুন (Apply)' : 'Apply Now'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION B: Standard Government & General Job Circulars */}
            {(activeFilter === 'all' || activeFilter === 'job-circulars') && (
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    <span>Government Job Opportunities & Circulars</span>
                  </h4>
                  <span className="text-[11px] text-stone-500">
                    Curated Career Circulars
                  </span>
                </div>

                <div className="space-y-4">
                  {defaultCircularJobs.map((job) => {
                    const isBookmarked = bookmarkedIds.includes(job.id);

                    return (
                      <div
                        key={job.id}
                        className="bg-white rounded-lg border border-stone-200 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow relative group"
                      >
                        {/* Top Row: Tag & Bookmark */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium text-teal-700 bg-teal-50 border border-teal-200">
                            {job.timeAgo}
                          </span>
                          <button
                            onClick={() => toggleBookmark(job.id)}
                            className={`p-1 transition-colors cursor-pointer ${
                              isBookmarked ? 'text-teal-600' : 'text-stone-400 hover:text-stone-700'
                            }`}
                            title={isBookmarked ? 'Remove bookmark' : 'Bookmark circular'}
                          >
                            <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
                          </button>
                        </div>

                        {/* Middle Row: Logo + Title + Organization */}
                        <div className="flex items-start space-x-3 sm:space-x-4 mb-3">
                          <div
                            className={`w-12 h-12 rounded-full ${job.logoBg} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs tracking-tighter`}
                          >
                            {job.logoLetter}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-base sm:text-lg font-bold text-stone-900 group-hover:text-teal-700 transition-colors">
                              {job.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
                              {job.organization}
                            </p>
                          </div>
                        </div>

                        {/* Circular Requirements Info */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-600 mb-4 bg-stone-50 p-2.5 rounded border border-stone-100">
                          <span className="flex items-center space-x-1.5 font-medium text-stone-800">
                            <Award className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>{job.qualification}</span>
                          </span>
                          <span className="text-stone-300 hidden sm:inline">|</span>
                          <span className="flex items-center space-x-1">
                            <Users className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>{job.vacancies}</span>
                          </span>
                          <span className="text-stone-300 hidden sm:inline">|</span>
                          <span className="flex items-center space-x-1 text-rose-700 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>{job.deadline}</span>
                          </span>
                        </div>

                        {/* Action Buttons: View Circular & Apply Now */}
                        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-stone-100">
                          <button
                            onClick={() => handleViewCircular(job)}
                            className="flex items-center space-x-1.5 px-4 py-2 border border-stone-300 hover:border-teal-600 bg-white hover:bg-teal-50/50 text-stone-800 hover:text-teal-800 text-xs font-semibold rounded transition-colors cursor-pointer"
                            title="View Official Job Circular Notice or Uploaded PDF"
                          >
                            <FileText className="w-3.5 h-3.5 text-teal-600" />
                            <span>View Circular</span>
                          </button>

                          <button
                            onClick={() => handleApplyClick(job.title)}
                            className="flex items-center space-x-1.5 px-5 py-2 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded transition-colors shadow-xs hover:shadow-md cursor-pointer"
                            title={isLoggedIn ? 'আবেদন করতে ক্লিক করুন' : 'Click to Login and Apply'}
                          >
                            <span>{isLoggedIn ? 'আবেদন করুন (Apply)' : 'Apply Now'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Official Circular Notice Viewer Modal for pre-set circular jobs */}
      {selectedCircular && (
        <CircularViewerModal
          isOpen={circularModalOpen}
          onClose={() => setCircularModalOpen(false)}
          onOpenLogin={() => handleTriggerAuth('login', selectedCircular.title)}
          jobTitle={selectedCircular.title}
          organization={selectedCircular.organization}
          isLoggedIn={isLoggedIn}
          onApplyDirectly={(title) => {
            setCircularModalOpen(false);
            if (onApplyDirectly) {
              onClose();
              onApplyDirectly(title);
            }
          }}
        />
      )}

      {/* PDF & Official Document Viewer for Admin Uploaded Notices */}
      {selectedNoticeForPdf && (
        <NoticePdfViewerModal
          isOpen={Boolean(selectedNoticeForPdf)}
          onClose={() => setSelectedNoticeForPdf(null)}
          notice={selectedNoticeForPdf}
        />
      )}

      {/* Fallback Login & Register Modal with live authentication & direct profile redirection */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        initialMode={loginModalMode}
        initialJobTitle={selectedJobTitleForAuth}
        students={students}
        applicants={applicants}
        onRegisterApplicant={onRegisterApplicant}
        onLoginSuccess={(role, user) => {
          setLoginModalOpen(false);
          onClose();
          if (onLoginSuccess) {
            onLoginSuccess(role, user);
          }
        }}
      />
    </>
  );
};
