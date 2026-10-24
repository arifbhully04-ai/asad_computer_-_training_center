import React, { useState } from 'react';
import {
  Search,
  FileText,
  Briefcase,
  CheckCircle,
  Download,
  Upload,
  ExternalLink,
  ShieldCheck,
  LogOut,
  Bell,
  Eye,
} from 'lucide-react';
import { ApplicantAccount, NoticeItem } from '../types.ts';
import { NoticePdfViewerModal } from './NoticePdfViewerModal.tsx';

interface ApplicantDashboardProps {
  onLogout: () => void;
  onBackToHome: () => void;
  onOpenJobPortal?: () => void;
  applicantData?: ApplicantAccount;
  notices?: NoticeItem[];
}

export const ApplicantDashboard: React.FC<ApplicantDashboardProps> = ({
  onLogout,
  onBackToHome,
  onOpenJobPortal,
  applicantData,
  notices = [],
}) => {
  const [activeTab, setActiveTab] = useState('applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoticeForPdf, setSelectedNoticeForPdf] = useState<NoticeItem | null>(null);

  const applicant = applicantData || {
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
  };

  const applications = [
    {
      id: 1,
      title: applicant.jobTitle,
      status: applicant.admitStatus === 'Ready' ? 'Admit Card Available' : 'Application Verified',
      statusColor: applicant.admitStatus === 'Ready' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-blue-100 text-blue-800 border-blue-300',
      feeStatus: `${applicant.feeStatus} (৳${applicant.feeAmount})`,
      date: `Applied: ${applicant.appliedDate}`,
      rollNo: applicant.rollNo ? `Roll: ${applicant.rollNo}` : 'Roll: Pending',
      admitReady: applicant.admitStatus === 'Ready',
      cardColor: 'bg-emerald-500',
    },
    {
      id: 2,
      title: 'Bangladesh Railway (BR) - Data Entry Assistant',
      status: 'Application Verified',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-300',
      feeStatus: 'Paid (৳150)',
      date: 'Applied: 12 Oct 2026',
      rollNo: 'User ID: BR92014',
      admitReady: false,
      cardColor: 'bg-blue-500',
    },
    {
      id: 3,
      title: 'DGHS Office Assistant cum Typist',
      status: 'Admit Card Available',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      feeStatus: 'Paid (৳200)',
      date: 'Applied: 05 Oct 2026',
      rollNo: 'Roll: 390142',
      admitReady: true,
      cardColor: 'bg-amber-500',
    },
  ];

  const filteredApps = applications.filter((app) =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                    {applicant.applicantName.charAt(0)}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">{applicant.applicantName}</h3>
                <span className="text-[11px] text-emerald-400 font-mono mt-0.5">{applicant.phone}</span>
                <span className="text-[10px] text-stone-400 mt-1 px-2 py-0.5 bg-white/5 rounded-full">
                  Applicant Portal
                </span>
              </div>

              <nav className="mt-6 space-y-1 text-xs">
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                    activeTab === 'applications'
                      ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500'
                      : 'text-stone-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>My Applications</span>
                </button>

                <button
                  onClick={() => setActiveTab('notices')}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors cursor-pointer ${
                    activeTab === 'notices'
                      ? 'bg-emerald-600/20 text-emerald-400 font-bold border-l-2 border-emerald-500'
                      : 'text-stone-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Bell className="w-4 h-4 text-rose-400" />
                  <span>Job Notices ({notices.length})</span>
                </button>

                <button
                  onClick={() => onOpenJobPortal?.()}
                  className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-emerald-400" />
                  <span>Job Portal / Notice</span>
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
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search applied jobs, roll numbers, status..."
                    className="w-full bg-white rounded-full py-2.5 pl-10 pr-4 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 shadow-xs border border-stone-200 outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>

                <div className="hidden sm:flex items-center space-x-2 text-xs text-stone-600 bg-white px-3 py-1.5 rounded-full shadow-xs border border-stone-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Applicant Account</span>
                </div>
              </div>

              {/* 4 Category Cards */}
              <div className="mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-[#ff5b57] text-white p-4 rounded-2xl shadow-sm">
                    <div className="text-xs font-semibold">Total Applied</div>
                    <div className="text-xl font-bold mt-1">3 Circulars</div>
                    <div className="text-[10px] text-white/80 mt-1">All verified</div>
                  </div>

                  <div className="bg-[#00b4d8] text-white p-4 rounded-2xl shadow-sm">
                    <div className="text-xs font-semibold">Fee Status</div>
                    <div className="text-xl font-bold mt-1">{applicant.feeStatus}</div>
                    <div className="text-[10px] text-white/80 mt-1">bKash/Teletalk</div>
                  </div>

                  <div className="bg-[#ffb703] text-stone-950 p-4 rounded-2xl shadow-sm">
                    <div className="text-xs font-bold">Admit Card</div>
                    <div className="text-xl font-bold mt-1">{applicant.admitStatus}</div>
                    <div className="text-[10px] text-stone-800 mt-1">Ready for exam</div>
                  </div>

                  <div className="bg-[#2a68ff] text-white p-4 rounded-2xl shadow-sm">
                    <div className="text-xs font-semibold">Center Support</div>
                    <div className="text-xl font-bold mt-1">Bhully Bazar</div>
                    <div className="text-[10px] text-white/80 mt-1">Help desk open</div>
                  </div>
                </div>
              </div>

              {/* Applications List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-stone-800 tracking-wider uppercase">
                    My Submitted Applications & Admit Cards
                  </h4>
                  <button
                    onClick={() => onOpenJobPortal?.()}
                    className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer"
                  >
                    + Apply in New Circular
                  </button>
                </div>

                <div className="space-y-3">
                  {filteredApps.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white p-4 sm:p-5 rounded-xl shadow-xs border border-stone-200 hover:shadow-sm transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-lg ${app.cardColor} text-white flex items-center justify-center shrink-0`}>
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-stone-900 text-sm truncate">{app.title}</h5>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500 mt-1">
                            <span className="font-mono font-medium text-stone-700">{app.rollNo}</span>
                            <span>·</span>
                            <span>{app.date}</span>
                            <span>·</span>
                            <span className="text-emerald-700 font-semibold">{app.feeStatus}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 self-end sm:self-auto">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${app.statusColor}`}>
                          {app.status}
                        </span>

                        {app.admitReady ? (
                          <button
                            onClick={() => alert(`Downloading Admit Card for ${app.title}`)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded transition-colors flex items-center space-x-1 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Admit Card</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => alert(`Downloading Submitted Application Copy`)}
                            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded transition-colors flex items-center space-x-1 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Applicant Copy</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="w-full lg:w-72 bg-white/60 p-5 sm:p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-stone-200 shrink-0">
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-xs font-bold text-stone-800 tracking-wider uppercase flex items-center space-x-1.5">
                    <Bell className="w-3.5 h-3.5 text-rose-500" />
                    <span>Official Job Circular Notices</span>
                  </h5>
                </div>
                
                <div className="space-y-2.5">
                  {notices.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                    >
                      <div className="font-semibold text-stone-900 leading-tight mb-1">{n.title}</div>
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

              <div className="bg-white rounded-2xl p-5 shadow-xs border border-stone-200">
                <h5 className="text-xs font-bold text-stone-800 tracking-wider uppercase mb-2">
                  Asad Computer Support
                </h5>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Bring your application copy to our center for exam syllabus and admit card printing.
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

      <NoticePdfViewerModal
        isOpen={Boolean(selectedNoticeForPdf)}
        onClose={() => setSelectedNoticeForPdf(null)}
        notice={selectedNoticeForPdf}
      />
    </>
  );
};
