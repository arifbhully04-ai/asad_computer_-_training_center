import React, { useState, useEffect } from 'react';
import {
  X,
  Printer,
  Save,
  CheckCircle,
  Upload,
  User,
  GraduationCap,
  MapPin,
  Briefcase,
  FileText,
  ShieldCheck,
  Check,
  Plus,
  Trash2,
  Calendar,
  Phone,
  Mail,
  Camera,
  PenTool,
  Download,
} from 'lucide-react';
import { ApplicantAccount, EducationRecord, AddressDetails } from '../types.ts';

interface ApplicantBioDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: ApplicantAccount | null;
  onSaveApplicant: (updated: ApplicantAccount) => void;
  initialTab?: 'form' | 'copy';
  isAdminMode?: boolean;
}

const defaultEducationList: EducationRecord[] = [
  {
    id: '1',
    exam: 'S.S.C / Dakhil / Equivalent',
    board: 'Dinajpur',
    roll: '492014',
    result: 'GPA 4.88 (Out of 5.00)',
    group: 'Science',
    passingYear: '2018',
    duration: '2 Years',
  },
  {
    id: '2',
    exam: 'H.S.C / Alim / Equivalent',
    board: 'Dinajpur',
    roll: '318920',
    result: 'GPA 4.50 (Out of 5.00)',
    group: 'Science',
    passingYear: '2020',
    duration: '2 Years',
  },
  {
    id: '3',
    exam: 'Graduation / Degree / Honors',
    board: 'National University',
    roll: '819204',
    result: 'CGPA 3.42 (Out of 4.00)',
    group: 'B.Sc in Computer Science & Engineering',
    passingYear: '2024',
    duration: '4 Years',
  },
];

export const ApplicantBioDataModal: React.FC<ApplicantBioDataModalProps> = ({
  isOpen,
  onClose,
  applicant,
  onSaveApplicant,
  initialTab = 'form',
  isAdminMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'copy'>(initialTab);
  const [formData, setFormData] = useState<ApplicantAccount | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);

  useEffect(() => {
    if (applicant) {
      // Pre-fill or provide sensible defaults from existing applicant
      const initialPresent: AddressDetails = applicant.presentAddress || {
        careOf: applicant.fatherName || 'Md. Rafiqul Islam',
        village: 'Bottola, Bhully Bazar',
        district: 'Thakurgaon',
        upazila: 'Thakurgaon Sadar',
        postOffice: 'Bhully',
        postCode: '5100',
      };

      const initialPermanent: AddressDetails = applicant.permanentAddress || {
        careOf: applicant.fatherName || 'Md. Rafiqul Islam',
        village: 'Bottola, Bhully Bazar',
        district: 'Thakurgaon',
        upazila: 'Thakurgaon Sadar',
        postOffice: 'Bhully',
        postCode: '5100',
      };

      setFormData({
        ...applicant,
        nameBangla: applicant.nameBangla || 'রাশিদুল ইসলাম',
        fatherName: applicant.fatherName || 'Md. Rafiqul Islam',
        fatherNameBangla: applicant.fatherNameBangla || 'মোঃ রফিকুল ইসলাম',
        motherName: applicant.motherName || 'Mst. Rokeya Begum',
        motherNameBangla: applicant.motherNameBangla || 'মোছাঃ রোকেয়া বেগম',
        dob: applicant.dob || '1998-05-14',
        ageText: applicant.ageText || '28 Years 05 Months 10 Days',
        gender: applicant.gender || 'Male',
        nationality: applicant.nationality || 'Bangladeshi',
        religion: applicant.religion || 'Islam',
        nidNumber: applicant.nidNumber || '19989419400000124',
        birthRegNo: applicant.birthRegNo || '19989419400012345',
        passportId: applicant.passportId || 'N/A',
        maritalStatus: applicant.maritalStatus || 'Single',
        spouseName: applicant.spouseName || '',
        quota: applicant.quota || 'Non-Quota',
        departmentalStatus: applicant.departmentalStatus || 'None',
        presentAddress: initialPresent,
        permanentAddress: initialPermanent,
        educationList: applicant.educationList && applicant.educationList.length > 0 ? applicant.educationList : defaultEducationList,
        typingSpeedBangla: applicant.typingSpeedBangla || '30 WPM',
        typingSpeedEnglish: applicant.typingSpeedEnglish || '40 WPM',
        computerExperience: applicant.computerExperience || '6-Months Govt Certified Computer Office Application (MS Word, Excel, Access, Internet)',
        photoUrl: applicant.photoUrl || '/assets/aistudio/passport_photo_sample.jpg',
        signatureUrl: applicant.signatureUrl || '/assets/aistudio/signature_sample.jpg',
        refNo: applicant.refNo || `ACTC-APP-${applicant.id.toString().padStart(4, '0')}`,
        isAccountCompleted: true,
      });

      if (applicant.isAccountCompleted && initialTab !== 'form') {
        setActiveTab('copy');
      } else {
        setActiveTab(initialTab);
      }
    }
  }, [applicant, isOpen, initialTab]);

  if (!isOpen || !formData) return null;

  const handlePresentAddressChange = (field: keyof AddressDetails, value: string) => {
    const updatedPresent = { ...formData.presentAddress!, [field]: value };
    if (sameAddress) {
      setFormData({
        ...formData,
        presentAddress: updatedPresent,
        permanentAddress: { ...updatedPresent },
      });
    } else {
      setFormData({
        ...formData,
        presentAddress: updatedPresent,
      });
    }
  };

  const handlePermanentAddressChange = (field: keyof AddressDetails, value: string) => {
    setFormData({
      ...formData,
      permanentAddress: { ...formData.permanentAddress!, [field]: value },
    });
  };

  const handleToggleSameAddress = (checked: boolean) => {
    setSameAddress(checked);
    if (checked && formData.presentAddress) {
      setFormData({
        ...formData,
        permanentAddress: { ...formData.presentAddress },
      });
    }
  };

  const handleAddEducation = () => {
    const newEdu: EducationRecord = {
      id: Date.now().toString(),
      exam: 'Certificate Course',
      board: 'BTEB (Technical)',
      roll: '6012',
      result: 'A+',
      group: 'Computer Office Application',
      passingYear: '2024',
      duration: '6 Months',
    };
    setFormData({
      ...formData,
      educationList: [...(formData.educationList || []), newEdu],
    });
  };

  const handleRemoveEducation = (id: string) => {
    setFormData({
      ...formData,
      educationList: (formData.educationList || []).filter((e) => e.id !== id),
    });
  };

  const handleEducationChange = (id: string, field: keyof EducationRecord, value: string) => {
    setFormData({
      ...formData,
      educationList: (formData.educationList || []).map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedAccount: ApplicantAccount = {
      ...formData,
      isAccountCompleted: true,
    };
    onSaveApplicant(updatedAccount);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setActiveTab('copy'); // Switch to view copy after save
    }, 900);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-60 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex items-start sm:items-center justify-center p-2 sm:p-4 py-4 sm:py-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="bg-[#161a2b] text-white px-5 sm:px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
              AC
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm sm:text-base text-white tracking-wide">
                  Create a Account · আবেদনকারীর পূর্ণাঙ্গ বায়োডাটা ফরম
                </h3>
                {formData.isAccountCompleted && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Saved & Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-400">
                আবেদনকারীর তথ্য স্থায়ীভাবে সংরক্ষিত থাকে — একবার পূরণ করলেই সব চাকুরীতে স্বয়ংক্রিয়ভাবে ব্যবহৃত হবে
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action / View Switcher Bar */}
        <div className="bg-stone-100 border-b border-stone-200 px-5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'form'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>১. বায়োডাটা ফরম পূরণ / সম্পাদনা</span>
            </button>

            <button
              onClick={() => setActiveTab('copy')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'copy'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-300'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>২. অফিসিয়াল এপ্লিকেন্ট কপি (PDF View)</span>
            </button>
          </div>

          {activeTab === 'copy' && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>প্রিন্ট / ডাউনলোড (Print Copy)</span>
              </button>
            </div>
          )}
        </div>

        {/* Success Alert Banner */}
        {saveSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 text-emerald-800 text-xs flex items-center space-x-2 animate-fadeIn shrink-0">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">
              আপনার বায়োডাটা ও আবেদন সফলভাবে সংরক্ষিত হয়েছে! তথ্যটি এডমিন ড্যাশবোর্ডে সাথে সাথে হালনাগাদ হয়ে গেছে।
            </span>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50">
          
          {/* TAB 1: FORM FILL-UP MODE */}
          {activeTab === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-6 max-w-4xl mx-auto">
              
              {/* Form Header Info Box */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-xs">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Asad Computer & Training Center · Bottola, Bhully Bazar
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-stone-900 mt-1.5">
                      অনলাইন চাকুরীর আবেদন ও জীবনবৃত্তান্ত (Bio-Data Profile Form)
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      এখানে আপনার সকল তথ্য সঠিকভাবে পূরণ করুন। এটি আপনার মূল প্রোফাইল হিসেবে সংরক্ষণ থাকবে।
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono text-stone-500 block">User ID / Roll:</span>
                    <span className="text-xs font-bold font-mono text-stone-800 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      {formData.rollNo || formData.refNo || 'AC-2026-APP'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Special Controls (if admin mode) */}
              {isAdminMode && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs">
                  <h5 className="font-bold text-amber-900 mb-2 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>এডমিন কন্ট্রোল প্যানেল (ইনস্টিটিউট আপডেট)</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Fee Status</label>
                      <select
                        value={formData.feeStatus}
                        onChange={(e) => setFormData({ ...formData, feeStatus: e.target.value as any })}
                        className="w-full p-2 bg-white border border-amber-300 rounded-lg font-bold"
                      >
                        <option value="Paid">Fee Paid</option>
                        <option value="Pending">Fee Pending</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Fee Amount (৳)</label>
                      <input
                        type="number"
                        value={formData.feeAmount}
                        onChange={(e) => setFormData({ ...formData, feeAmount: parseFloat(e.target.value) || 0 })}
                        className="w-full p-2 bg-white border border-amber-300 rounded-lg font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Admit Card Status</label>
                      <select
                        value={formData.admitStatus}
                        onChange={(e) => setFormData({ ...formData, admitStatus: e.target.value as any })}
                        className="w-full p-2 bg-white border border-amber-300 rounded-lg font-bold"
                      >
                        <option value="Ready">Ready (Downloadable)</option>
                        <option value="Processing">Processing</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 1: Basic Information */}
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
                <div className="border-b border-stone-200 pb-2.5">
                  <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>১. সাধারণ ও ব্যক্তিগত তথ্য (Basic & Personal Details)</span>
                  </h5>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      পদের নাম (Name of the Post) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500 font-medium"
                      placeholder="e.g. Computer Operator / Office Assistant"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      আবেদনকারীর নাম (Applicant's Name - English) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.applicantName}
                      onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      আবেদনকারীর নাম (বাংলায়)
                    </label>
                    <input
                      type="text"
                      value={formData.nameBangla || ''}
                      onChange={(e) => setFormData({ ...formData, nameBangla: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500"
                      placeholder="রাশিদুল ইসলাম"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      পিতার নাম (Father's Name - English) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fatherName || ''}
                      onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      পিতার নাম (বাংলায়)
                    </label>
                    <input
                      type="text"
                      value={formData.fatherNameBangla || ''}
                      onChange={(e) => setFormData({ ...formData, fatherNameBangla: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      মাতার নাম (Mother's Name - English) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.motherName || ''}
                      onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      মাতার নাম (বাংলায়)
                    </label>
                    <input
                      type="text"
                      value={formData.motherNameBangla || ''}
                      onChange={(e) => setFormData({ ...formData, motherNameBangla: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      জন্ম তারিখ (Date of Birth) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dob || ''}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      বয়স (Age as on Circular Date)
                    </label>
                    <input
                      type="text"
                      value={formData.ageText || ''}
                      onChange={(e) => setFormData({ ...formData, ageText: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500"
                      placeholder="e.g. 26 Years 04 Months"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">লিঙ্গ (Gender)</label>
                    <select
                      value={formData.gender || 'Male'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-stone-50"
                    >
                      <option value="Male">Male (পুরুষ)</option>
                      <option value="Female">Female (মহিলা)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">ধর্ম (Religion)</label>
                    <select
                      value={formData.religion || 'Islam'}
                      onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-stone-50"
                    >
                      <option value="Islam">Islam (ইসলাম)</option>
                      <option value="Hinduism">Hinduism (হিন্দুধর্ম)</option>
                      <option value="Buddhism">Buddhism (বৌদ্ধধর্ম)</option>
                      <option value="Christianity">Christianity (খ্রিস্টধর্ম)</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      জাতীয় পরিচয়পত্র নম্বর (NID No) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nidNumber || ''}
                      onChange={(e) => setFormData({ ...formData, nidNumber: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500 font-mono"
                      placeholder="10 / 17 digit NID number"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      জন্ম নিবন্ধন নম্বর (Birth Reg. No)
                    </label>
                    <input
                      type="text"
                      value={formData.birthRegNo || ''}
                      onChange={(e) => setFormData({ ...formData, birthRegNo: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">বৈবাহিক অবস্থা (Marital Status)</label>
                    <select
                      value={formData.maritalStatus || 'Single'}
                      onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value as any })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-stone-50"
                    >
                      <option value="Single">Single (অবিবাহিত)</option>
                      <option value="Married">Married (বিবাহিত)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {formData.maritalStatus === 'Married' && (
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">স্বামী/স্ত্রীর নাম (Spouse Name)</label>
                      <input
                        type="text"
                        value={formData.spouseName || ''}
                        onChange={(e) => setFormData({ ...formData, spouseName: e.target.value })}
                        className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">কোটা (Quota)</label>
                    <select
                      value={formData.quota || 'Non-Quota'}
                      onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-stone-50"
                    >
                      <option value="Non-Quota">Non-Quota (সাধারণ)</option>
                      <option value="Freedom Fighter">Freedom Fighter (মুক্তিযোদ্ধা)</option>
                      <option value="Child of Freedom Fighter">Child of Freedom Fighter (মুক্তিযোদ্ধা সন্তান)</option>
                      <option value="Grandchild of Freedom Fighter">Grandchild of Freedom Fighter (মুক্তিযোদ্ধা নাতি/নাতনি)</option>
                      <option value="Physical Handicapped">Physical Handicapped (প্রতিবন্ধী)</option>
                      <option value="Orphan">Orphan (এতিম)</option>
                      <option value="Ethnic Minority">Ethnic Minority (ক্ষুদ্র নৃ-গোষ্ঠী)</option>
                      <option value="Ansar-VDP">Ansar-VDP (আনসার-ভিডিপি)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">বিভাগীয় প্রার্থীর তথ্য (Departmental Status)</label>
                    <select
                      value={formData.departmentalStatus || 'None'}
                      onChange={(e) => setFormData({ ...formData, departmentalStatus: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-stone-50"
                    >
                      <option value="None">None (প্রযোজ্য নয়)</option>
                      <option value="Govt. Employee">Govt. Employee (সরকারি কর্মচারী)</option>
                      <option value="Semi-Govt Employee">Semi-Govt Employee (আধা-সরকারি)</option>
                      <option value="Autonomous">Autonomous (স্বায়ত্তশাসিত)</option>
                      <option value="Departmental Candidate">Departmental Candidate (বিভাগীয় প্রার্থী)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      মোবাইল নম্বর (Mobile Number) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500 font-mono font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">ইমেইল ঠিকানা (Email)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Address Information */}
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
                <div className="border-b border-stone-200 pb-2.5 flex items-center justify-between">
                  <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>২. ঠিকানার বিবরণ (Present & Permanent Address)</span>
                  </h5>
                  <label className="flex items-center space-x-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAddress}
                      onChange={(e) => handleToggleSameAddress(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Same as Present Address (উভয় ঠিকানা একই)</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  {/* Present Address */}
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                    <div className="font-bold text-stone-800 border-b border-stone-200 pb-1 text-xs">
                      বর্তমান ঠিকানা (Present Address)
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Care of (অভিভাবক/পিতা)</label>
                      <input
                        type="text"
                        value={formData.presentAddress?.careOf || ''}
                        onChange={(e) => handlePresentAddressChange('careOf', e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded-lg outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">গ্রাম/মহল্লা/রাস্তা (Village/Road)</label>
                      <input
                        type="text"
                        value={formData.presentAddress?.village || ''}
                        onChange={(e) => handlePresentAddressChange('village', e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded-lg outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">জেলা (District)</label>
                        <input
                          type="text"
                          value={formData.presentAddress?.district || ''}
                          onChange={(e) => handlePresentAddressChange('district', e.target.value)}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">উপজেলা/থানা (Upazila)</label>
                        <input
                          type="text"
                          value={formData.presentAddress?.upazila || ''}
                          onChange={(e) => handlePresentAddressChange('upazila', e.target.value)}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">ডাকঘর (Post Office)</label>
                        <input
                          type="text"
                          value={formData.presentAddress?.postOffice || ''}
                          onChange={(e) => handlePresentAddressChange('postOffice', e.target.value)}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">পোস্ট কোড (Post Code)</label>
                        <input
                          type="text"
                          value={formData.presentAddress?.postCode || ''}
                          onChange={(e) => handlePresentAddressChange('postCode', e.target.value)}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg outline-none focus:border-emerald-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Permanent Address */}
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                    <div className="font-bold text-stone-800 border-b border-stone-200 pb-1 text-xs">
                      স্থায়ী ঠিকানা (Permanent Address)
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Care of (অভিভাবক/পিতা)</label>
                      <input
                        type="text"
                        disabled={sameAddress}
                        value={formData.permanentAddress?.careOf || ''}
                        onChange={(e) => handlePermanentAddressChange('careOf', e.target.value)}
                        className={`w-full p-2 border rounded-lg outline-none ${
                          sameAddress ? 'bg-stone-100 text-stone-500' : 'bg-white border-stone-300 focus:border-emerald-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">গ্রাম/মহল্লা/রাস্তা (Village/Road)</label>
                      <input
                        type="text"
                        disabled={sameAddress}
                        value={formData.permanentAddress?.village || ''}
                        onChange={(e) => handlePermanentAddressChange('village', e.target.value)}
                        className={`w-full p-2 border rounded-lg outline-none ${
                          sameAddress ? 'bg-stone-100 text-stone-500' : 'bg-white border-stone-300 focus:border-emerald-500'
                        }`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">জেলা (District)</label>
                        <input
                          type="text"
                          disabled={sameAddress}
                          value={formData.permanentAddress?.district || ''}
                          onChange={(e) => handlePermanentAddressChange('district', e.target.value)}
                          className={`w-full p-2 border rounded-lg outline-none ${
                            sameAddress ? 'bg-stone-100 text-stone-500' : 'bg-white border-stone-300 focus:border-emerald-500'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">উপজেলা/থানা (Upazila)</label>
                        <input
                          type="text"
                          disabled={sameAddress}
                          value={formData.permanentAddress?.upazila || ''}
                          onChange={(e) => handlePermanentAddressChange('upazila', e.target.value)}
                          className={`w-full p-2 border rounded-lg outline-none ${
                            sameAddress ? 'bg-stone-100 text-stone-500' : 'bg-white border-stone-300 focus:border-emerald-500'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">ডাকঘর (Post Office)</label>
                        <input
                          type="text"
                          disabled={sameAddress}
                          value={formData.permanentAddress?.postOffice || ''}
                          onChange={(e) => handlePermanentAddressChange('postOffice', e.target.value)}
                          className={`w-full p-2 border rounded-lg outline-none ${
                            sameAddress ? 'bg-stone-100 text-stone-500' : 'bg-white border-stone-300 focus:border-emerald-500'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">পোস্ট কোড (Post Code)</label>
                        <input
                          type="text"
                          disabled={sameAddress}
                          value={formData.permanentAddress?.postCode || ''}
                          onChange={(e) => handlePermanentAddressChange('postCode', e.target.value)}
                          className={`w-full p-2 border rounded-lg outline-none font-mono ${
                            sameAddress ? 'bg-stone-100 text-stone-500' : 'bg-white border-stone-300 focus:border-emerald-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Educational Qualifications */}
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
                <div className="border-b border-stone-200 pb-2.5 flex items-center justify-between">
                  <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span>৩. শিক্ষাগত যোগ্যতার বিবরণ (Academic Qualifications)</span>
                  </h5>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-300 flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন সার্টিফিকেট যুক্ত করুন</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-stone-200 rounded-lg overflow-hidden">
                    <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                      <tr>
                        <th className="p-2.5">পরীক্ষার নাম (Exam)</th>
                        <th className="p-2.5">বোর্ড / বিশ্ববিদ্যালয়</th>
                        <th className="p-2.5">রোল নং</th>
                        <th className="p-2.5">ফলাফল (Result/GPA)</th>
                        <th className="p-2.5">বিভাগ / বিষয়</th>
                        <th className="p-2.5">পাশের সন</th>
                        <th className="p-2.5 text-center">মুছুন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {(formData.educationList || []).map((edu) => (
                        <tr key={edu.id} className="hover:bg-stone-50">
                          <td className="p-2">
                            <input
                              type="text"
                              value={edu.exam}
                              onChange={(e) => handleEducationChange(edu.id, 'exam', e.target.value)}
                              className="w-full p-1.5 border border-stone-300 rounded bg-white text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={edu.board}
                              onChange={(e) => handleEducationChange(edu.id, 'board', e.target.value)}
                              className="w-full p-1.5 border border-stone-300 rounded bg-white text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={edu.roll}
                              onChange={(e) => handleEducationChange(edu.id, 'roll', e.target.value)}
                              className="w-full p-1.5 border border-stone-300 rounded bg-white text-xs font-mono"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={edu.result}
                              onChange={(e) => handleEducationChange(edu.id, 'result', e.target.value)}
                              className="w-full p-1.5 border border-stone-300 rounded bg-white text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={edu.group}
                              onChange={(e) => handleEducationChange(edu.id, 'group', e.target.value)}
                              className="w-full p-1.5 border border-stone-300 rounded bg-white text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={edu.passingYear}
                              onChange={(e) => handleEducationChange(edu.id, 'passingYear', e.target.value)}
                              className="w-full p-1.5 border border-stone-300 rounded bg-white text-xs font-mono"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveEducation(edu.id)}
                              className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 4: Computer Skills & Typing Speed */}
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
                <div className="border-b border-stone-200 pb-2.5">
                  <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    <span>৪. কম্পিউটার দক্ষতা ও টাইপিং স্পিড (Computer Knowledge & Skills)</span>
                  </h5>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      বাংলা টাইপিং স্পিড (Bangla WPM)
                    </label>
                    <input
                      type="text"
                      value={formData.typingSpeedBangla || ''}
                      onChange={(e) => setFormData({ ...formData, typingSpeedBangla: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500 font-mono"
                      placeholder="e.g. 30 WPM"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      ইংরেজি টাইপিং স্পিড (English WPM)
                    </label>
                    <input
                      type="text"
                      value={formData.typingSpeedEnglish || ''}
                      onChange={(e) => setFormData({ ...formData, typingSpeedEnglish: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500 font-mono"
                      placeholder="e.g. 40 WPM"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      কম্পিউটার কোর্স / অভিজ্ঞতা
                    </label>
                    <input
                      type="text"
                      value={formData.computerExperience || ''}
                      onChange={(e) => setFormData({ ...formData, computerExperience: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500"
                      placeholder="MS Office, Internet, Windows"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Photo & Signature */}
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
                <div className="border-b border-stone-200 pb-2.5">
                  <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>৫. ছবি ও স্বাক্ষর (Photo & Signature 300x300 & 300x80)</span>
                  </h5>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center space-x-4">
                    <div className="w-24 h-24 bg-white border border-stone-300 rounded shadow-xs flex items-center justify-center overflow-hidden shrink-0">
                      {formData.photoUrl ? (
                        <img
                          src={formData.photoUrl}
                          alt="Applicant"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as any).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
                          }}
                        />
                      ) : (
                        <User className="w-10 h-10 text-stone-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-stone-800">পাসপোর্ট সাইজ ছবি (300 x 300)</div>
                      <div className="text-[11px] text-stone-500 mt-1">
                        সরকারি আবেদনের স্ট্যান্ডার্ড সাইজ (Max 100 KB)
                      </div>
                      <label className="mt-2.5 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg text-[11px] font-bold text-stone-700 cursor-pointer shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>ছবি আপলোড / পরিবর্তন</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              setFormData({ ...formData, photoUrl: url });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center space-x-4">
                    <div className="w-32 h-14 bg-white border border-stone-300 rounded shadow-xs flex items-center justify-center overflow-hidden shrink-0 p-1">
                      {formData.signatureUrl ? (
                        <div className="text-center font-serif italic text-stone-800 text-sm font-bold border-b border-stone-400 pb-0.5 px-2">
                          {formData.applicantName}
                        </div>
                      ) : (
                        <PenTool className="w-6 h-6 text-stone-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-stone-800">প্রার্থীর স্বাক্ষর (300 x 80)</div>
                      <div className="text-[11px] text-stone-500 mt-1">
                        স্বাক্ষর ছবি আপলোড করুন (Max 60 KB)
                      </div>
                      <label className="mt-2.5 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg text-[11px] font-bold text-stone-700 cursor-pointer shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>স্বাক্ষর আপলোড</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              setFormData({ ...formData, signatureUrl: url });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
                <div className="text-xs text-stone-500 text-center sm:text-left">
                  <span className="font-semibold text-emerald-700">★ আসাদ কম্পিউটার সেবা ডেস্ক:</span> একবার সংরক্ষণ করলে আপনার তথ্য আমাদের ডাটাবেজে স্থায়ীভাবে থাকবে।
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/2 sm:w-auto px-4 py-2.5 border border-stone-300 rounded-xl text-stone-600 font-semibold hover:bg-stone-100 text-xs cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>

                  <button
                    type="submit"
                    className="w-1/2 sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>তথ্য সংরক্ষণ ও একাউন্ট তৈরি করুন</span>
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* TAB 2: OFFICIAL APPLICANT'S COPY (PDF / PRINT VIEW) */}
          {activeTab === 'copy' && (
            <div className="bg-white p-6 sm:p-10 rounded-xl border border-stone-300 shadow-md max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 text-stone-900 font-sans">
              
              {/* Document Header matching DSS_D4ZSN8HKJ_713de03b.pdf */}
              <div className="border-b-2 border-stone-900 pb-4 mb-4 text-center">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-full border border-stone-300 flex items-center justify-center p-1">
                    <div className="w-full h-full rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs text-center leading-tight">
                      ASAD
                    </div>
                  </div>

                  <div className="text-center flex-1 px-4">
                    <h2 className="text-lg sm:text-2xl font-black tracking-tight text-stone-900 uppercase">
                      ASAD COMPUTER & TRAINING CENTER
                    </h2>
                    <p className="text-[11px] sm:text-xs font-semibold text-stone-700 mt-0.5">
                      Government Approved Digital Service & Computer Training Center · Reg No: ACTC-5100
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-stone-600">
                      Bottola, Bhully Bazar, Thakurgaon | Online Job Application & Registration Cell
                    </p>
                    <div className="inline-block mt-2 px-4 py-1 bg-stone-900 text-white font-bold text-xs tracking-wider uppercase rounded-xs">
                      APPLICANT'S COPY (আবেদনকারী কপি)
                    </div>
                  </div>

                  <div className="w-20 text-right shrink-0">
                    <div className="w-20 h-24 border border-stone-400 bg-stone-50 overflow-hidden flex items-center justify-center">
                      <img
                        src={formData.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                        alt="Applicant"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as any).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>
                    <span className="text-[9px] text-stone-500 font-mono block mt-0.5">Photo 300x300</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs font-mono font-semibold">
                  <div>
                    Tracking / Ref: <span className="font-bold text-stone-900">{formData.refNo || 'ACTC-APP-8192'}</span>
                  </div>
                  <div>
                    User ID / Roll: <span className="font-bold text-stone-900">{formData.rollNo || '819204'}</span>
                  </div>
                  <div>
                    Date: <span className="text-stone-800">{formData.appliedDate}</span>
                  </div>
                </div>
              </div>

              {/* Main Applicant Bio-Data Table */}
              <div className="space-y-4 text-xs">
                
                {/* 1. Basic Information Table */}
                <div className="border border-stone-400">
                  <div className="bg-stone-200 px-3 py-1 font-bold text-stone-900 border-b border-stone-400 uppercase tracking-wider text-[11px]">
                    1. Basic Information (সাধারণ তথ্য)
                  </div>
                  <table className="w-full text-left border-collapse text-xs">
                    <tbody>
                      <tr className="border-b border-stone-300">
                        <td className="w-1/4 p-2 font-semibold bg-stone-50 border-r border-stone-300">Name of the Post</td>
                        <td className="p-2 font-bold text-stone-900" colSpan={3}>{formData.jobTitle}</td>
                      </tr>
                      <tr className="border-b border-stone-300">
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300">Applicant's Name</td>
                        <td className="p-2 font-bold uppercase">{formData.applicantName}</td>
                        <td className="w-1/4 p-2 font-semibold bg-stone-50 border-r border-stone-300 border-l">প্রার্থীর নাম (বাংলায়)</td>
                        <td className="p-2 font-medium">{formData.nameBangla || '—'}</td>
                      </tr>
                      <tr className="border-b border-stone-300">
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300">Father's Name</td>
                        <td className="p-2 font-medium">{formData.fatherName}</td>
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300 border-l">পিতার নাম (বাংলায়)</td>
                        <td className="p-2 font-medium">{formData.fatherNameBangla || '—'}</td>
                      </tr>
                      <tr className="border-b border-stone-300">
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300">Mother's Name</td>
                        <td className="p-2 font-medium">{formData.motherName}</td>
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300 border-l">মাতার নাম (বাংলায়)</td>
                        <td className="p-2 font-medium">{formData.motherNameBangla || '—'}</td>
                      </tr>
                      <tr className="border-b border-stone-300">
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300">Date of Birth</td>
                        <td className="p-2 font-mono">{formData.dob}</td>
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300 border-l">Age on Circular</td>
                        <td className="p-2">{formData.ageText || '—'}</td>
                      </tr>
                      <tr className="border-b border-stone-300">
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300">Gender & Religion</td>
                        <td className="p-2">{formData.gender} · {formData.religion}</td>
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300 border-l">Nationality</td>
                        <td className="p-2">{formData.nationality || 'Bangladeshi'}</td>
                      </tr>
                      <tr className="border-b border-stone-300">
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300">National ID (NID)</td>
                        <td className="p-2 font-mono font-bold">{formData.nidNumber || '—'}</td>
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300 border-l">Birth Reg. No</td>
                        <td className="p-2 font-mono">{formData.birthRegNo || '—'}</td>
                      </tr>
                      <tr className="border-b border-stone-300">
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300">Marital Status</td>
                        <td className="p-2">{formData.maritalStatus} {formData.spouseName ? `(${formData.spouseName})` : ''}</td>
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300 border-l">Quota (কোটা)</td>
                        <td className="p-2 font-medium">{formData.quota || 'Non-Quota'}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300">Mobile & Email</td>
                        <td className="p-2 font-mono font-bold text-emerald-800">{formData.phone}</td>
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300 border-l">Dept. Status</td>
                        <td className="p-2">{formData.departmentalStatus || 'None'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 2. Address Details Table */}
                <div className="border border-stone-400">
                  <div className="bg-stone-200 px-3 py-1 font-bold text-stone-900 border-b border-stone-400 uppercase tracking-wider text-[11px]">
                    2. Address Information (ঠিকানা)
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-stone-400">
                    <div className="p-3 space-y-1">
                      <div className="font-bold text-stone-900 underline text-[11px] mb-1">Present Address (বর্তমান ঠিকানা):</div>
                      <div><strong>Care of:</strong> {formData.presentAddress?.careOf}</div>
                      <div><strong>Village/Road:</strong> {formData.presentAddress?.village}</div>
                      <div><strong>Upazila & District:</strong> {formData.presentAddress?.upazila}, {formData.presentAddress?.district}</div>
                      <div><strong>Post Office & Code:</strong> {formData.presentAddress?.postOffice} - {formData.presentAddress?.postCode}</div>
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="font-bold text-stone-900 underline text-[11px] mb-1">Permanent Address (স্থায়ী ঠিকানা):</div>
                      <div><strong>Care of:</strong> {formData.permanentAddress?.careOf}</div>
                      <div><strong>Village/Road:</strong> {formData.permanentAddress?.village}</div>
                      <div><strong>Upazila & District:</strong> {formData.permanentAddress?.upazila}, {formData.permanentAddress?.district}</div>
                      <div><strong>Post Office & Code:</strong> {formData.permanentAddress?.postCode ? `${formData.permanentAddress?.postOffice} - ${formData.permanentAddress?.postCode}` : formData.permanentAddress?.postOffice}</div>
                    </div>
                  </div>
                </div>

                {/* 3. Academic Qualifications Table */}
                <div className="border border-stone-400">
                  <div className="bg-stone-200 px-3 py-1 font-bold text-stone-900 border-b border-stone-400 uppercase tracking-wider text-[11px]">
                    3. Academic Qualifications (শিক্ষাগত যোগ্যতা)
                  </div>
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-stone-100 font-bold border-b border-stone-400">
                      <tr>
                        <th className="p-2 border-r border-stone-300">Examination</th>
                        <th className="p-2 border-r border-stone-300">Board / University</th>
                        <th className="p-2 border-r border-stone-300">Roll No</th>
                        <th className="p-2 border-r border-stone-300">Result</th>
                        <th className="p-2 border-r border-stone-300">Group / Discipline</th>
                        <th className="p-2">Passing Year</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-300">
                      {(formData.educationList || []).map((edu) => (
                        <tr key={edu.id}>
                          <td className="p-2 font-medium border-r border-stone-300">{edu.exam}</td>
                          <td className="p-2 border-r border-stone-300">{edu.board}</td>
                          <td className="p-2 font-mono border-r border-stone-300">{edu.roll}</td>
                          <td className="p-2 font-bold border-r border-stone-300">{edu.result}</td>
                          <td className="p-2 border-r border-stone-300">{edu.group}</td>
                          <td className="p-2 font-mono">{edu.passingYear}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 4. Experience & Computer Skills */}
                <div className="border border-stone-400">
                  <div className="bg-stone-200 px-3 py-1 font-bold text-stone-900 border-b border-stone-400 uppercase tracking-wider text-[11px]">
                    4. Professional Skills & Computer Knowledge (দক্ষতা)
                  </div>
                  <div className="p-3 space-y-1 text-xs">
                    <div><strong>Typing Speed:</strong> Bangla: <span className="font-mono font-bold text-emerald-800">{formData.typingSpeedBangla || '30 WPM'}</span>, English: <span className="font-mono font-bold text-emerald-800">{formData.typingSpeedEnglish || '40 WPM'}</span></div>
                    <div><strong>Computer Diploma/Certification:</strong> {formData.computerExperience || 'Computer Office Application 6 Months Course certified by Bangladesh Technical Education Board.'}</div>
                    <div><strong>Fee Payment Status:</strong> <span className="font-bold text-emerald-700">{formData.feeStatus} (৳ {formData.feeAmount})</span> · Admit Card: <span className="font-bold">{formData.admitStatus}</span></div>
                  </div>
                </div>

                {/* 5. Declaration & Signature */}
                <div className="pt-2">
                  <p className="text-[10px] text-stone-600 leading-relaxed text-justify italic">
                    Declaration: I declare that the information provided in this form is true, complete and correct. In the event of any information being found false or incorrect at any stage, my candidature shall be liable to cancellation and administrative/legal action.
                  </p>

                  <div className="flex items-end justify-between pt-6 mt-4">
                    <div className="text-center">
                      <div className="w-32 border-t border-stone-600 pt-1 text-[11px] font-semibold text-stone-800">
                        Institute Seal & Verify
                      </div>
                      <div className="text-[9px] text-stone-500">Asad Computer Center</div>
                    </div>

                    <div className="text-center">
                      <div className="font-serif italic text-sm font-bold text-stone-800 mb-1 border-b border-stone-400 pb-0.5 px-3">
                        {formData.applicantName}
                      </div>
                      <div className="w-36 border-t border-stone-600 pt-1 text-[11px] font-bold text-stone-900">
                        Applicant's Signature
                      </div>
                      <div className="text-[9px] text-stone-500 font-mono">Date: {formData.appliedDate}</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* STRICT USER REQUIREMENT FOOTER */}
              <div className="mt-8 pt-4 border-t-2 border-stone-800 text-center text-xs space-y-1">
                <div className="font-bold text-stone-900 text-sm">
                  আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টার (Asad Computer & Training Center)
                </div>
                <div className="text-stone-700 font-medium">
                  ঠিকানা: বটতলী, ভূল্লী বাজার, ঠাকুরগাঁও (Bottola, Bhully Bazar, Thakurgaon)
                </div>
                <div className="text-stone-600 font-mono text-[11px]">
                  যোগাযোগ: মোবাইল: <strong className="text-stone-900">01773-733654</strong>, <strong className="text-stone-900">01864-399871</strong> · WhatsApp: <strong className="text-stone-900">01407-215416</strong> · Email: <strong className="text-stone-900">bhulli.postoffice@gmail.com</strong>
                </div>
                <div className="text-[10px] text-stone-500 pt-1">
                  সকল সরকারি/বেসরকারি চাকুরীর অনলাইন আবেদন, প্রবেশপত্র ও ফলাফল প্রিন্ট এবং কম্পিউটার প্রশিক্ষণের নির্ভরযোগ্য প্রতিষ্ঠান।
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
