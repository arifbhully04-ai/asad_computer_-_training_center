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
  Bell,
} from 'lucide-react';
import { StudentAccount, NoticeItem } from '../types.ts';
import { NoticePdfViewerModal } from './NoticePdfViewerModal.tsx';

interface StudentDashboardProps {
  onLogout: () => void;
  onBackToHome: () => void;
  studentData?: StudentAccount;
  notices?: NoticeItem[];
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onLogout,
  onBackToHome,
  studentData,
  notices = [],
}) => {
  const [activeTab, setActiveTab] = useState('drive');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);
  const [selectedNoticeForPdf, setSelectedNoticeForPdf] = useState<NoticeItem | null>(null);

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

              {/* Student Fee Account Banner (Requested: কোন স্টুডেন্ট কত টাকা দিল কত বাকি সেটা তাদের প্রোফাইলে দেখা যাবে) */}
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
                        Payable at Office
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-2 font-bold">
                        Full Cleared
                      </span>
                    )}
                  </div>
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
    </>
  );
};
