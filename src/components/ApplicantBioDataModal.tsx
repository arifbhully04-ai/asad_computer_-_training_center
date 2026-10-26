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
  Plus,
  Trash2,
  Camera,
  PenTool,
} from 'lucide-react';
import { ApplicantAccount, EducationRecord, AddressDetails } from '../types.ts';
import {
  BANGLADESH_DISTRICTS,
  EDUCATION_BOARDS,
  UNIVERSITIES,
  PASSING_YEARS,
  EDUCATION_LEVELS,
} from '../data/bangladeshData.ts';
import { ApplicationStatusBadge } from './ApplicationStatusBadge.tsx';

interface ApplicantBioDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: ApplicantAccount | null;
  onSaveApplicant: (updated: ApplicantAccount) => void;
  initialTab?: 'form' | 'copy';
  isAdminMode?: boolean;
}

// Default 4-level blank education list including Masters
const defaultEmptyEducationList: EducationRecord[] = [
  {
    id: 'ssc',
    exam: 'S.S.C',
    board: 'Dinajpur',
    roll: '',
    result: '',
    group: 'Science',
    passingYear: '',
    duration: '2 Years',
  },
  {
    id: 'hsc',
    exam: 'H.S.C',
    board: 'Dinajpur',
    roll: '',
    result: '',
    group: 'Science',
    passingYear: '',
    duration: '2 Years',
  },
  {
    id: 'graduation',
    exam: 'Graduation / Degree / Honors',
    board: 'National University (জাতীয় বিশ্ববিদ্যালয়)',
    roll: '',
    result: '',
    group: 'Computer Science & Engineering (CSE)',
    passingYear: '',
    duration: '4 Years',
  },
  {
    id: 'masters',
    exam: 'Masters',
    board: 'National University (জাতীয় বিশ্ববিদ্যালয়)',
    roll: '',
    result: '',
    group: 'Computer Science & Engineering (CSE)',
    passingYear: '',
    duration: '1 Year',
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

  // Helper to determine the education level type for dynamic exam/group mapping
  const getExamCategory = (exam: string, index: number): 'ssc' | 'hsc' | 'graduation' | 'masters' => {
    if (exam.includes('S.S.C') || exam.includes('Dakhil') || exam.includes('O Level')) return 'ssc';
    if (exam.includes('H.S.C') || exam.includes('Alim') || exam.includes('Diploma') || exam.includes('A Level')) return 'hsc';
    if (exam.includes('Graduation') || exam.includes('Degree') || exam.includes('B.Sc') || exam.includes('B.A') || exam.includes('B.S.S') || exam.includes('B.B.A') || exam.includes('Fazil') || exam.includes('L.L.B')) return 'graduation';
    if (exam.includes('Masters') || exam.includes('M.Sc') || exam.includes('M.A') || exam.includes('M.S.S') || exam.includes('M.B.A') || exam.includes('Kamil') || exam.includes('M.Ed')) return 'masters';
    if (index === 0) return 'ssc';
    if (index === 1) return 'hsc';
    if (index === 2) return 'graduation';
    return 'masters';
  };

  useEffect(() => {
    if (applicant) {
      // Ensure initial address does NOT pre-populate fake/dummy data
      const initialPresent: AddressDetails = {
        careOf: applicant.presentAddress?.careOf || '',
        village: applicant.presentAddress?.village || '',
        district: applicant.presentAddress?.district || 'Thakurgaon',
        upazila: applicant.presentAddress?.upazila || 'Thakurgaon Sadar',
        postOffice: applicant.presentAddress?.postOffice || '',
        postCode: applicant.presentAddress?.postCode || '',
      };

      const initialPermanent: AddressDetails = {
        careOf: applicant.permanentAddress?.careOf || '',
        village: applicant.permanentAddress?.village || '',
        district: applicant.permanentAddress?.district || 'Thakurgaon',
        upazila: applicant.permanentAddress?.upazila || 'Thakurgaon Sadar',
        postOffice: applicant.permanentAddress?.postOffice || '',
        postCode: applicant.permanentAddress?.postCode || '',
      };

      // Check if applicant already has education list with Masters
      let initialEduList = applicant.educationList && applicant.educationList.length > 0
        ? [...applicant.educationList]
        : defaultEmptyEducationList.map(e => ({ ...e }));

      // Ensure Masters row is included if missing
      const hasMasters = initialEduList.some((e) =>
        e.exam.toLowerCase().includes('master') ||
        e.exam.toLowerCase().includes('m.sc') ||
        e.exam.toLowerCase().includes('m.a') ||
        e.exam.toLowerCase().includes('m.b.a') ||
        e.id === 'masters'
      );

      if (!hasMasters) {
        initialEduList.push({
          id: 'masters',
          exam: 'Masters',
          board: 'National University (জাতীয় বিশ্ববিদ্যালয়)',
          roll: '',
          result: '',
          group: 'Computer Science & Engineering (CSE)',
          passingYear: '',
          duration: '1 Year',
        });
      }

      setFormData({
        ...applicant,
        // Empty out sample text if not explicitly set by the applicant
        applicantName: applicant.applicantName || '',
        nameBangla: applicant.nameBangla || '',
        fatherName: applicant.fatherName || '',
        fatherNameBangla: applicant.fatherNameBangla || '',
        motherName: applicant.motherName || '',
        motherNameBangla: applicant.motherNameBangla || '',
        dob: applicant.dob || '',
        ageText: applicant.ageText || '',
        gender: applicant.gender || 'Male',
        nationality: applicant.nationality || 'Bangladeshi',
        religion: applicant.religion || 'Islam',
        nidNumber: applicant.nidNumber || '',
        birthRegNo: applicant.birthRegNo || '',
        passportId: applicant.passportId || '',
        maritalStatus: applicant.maritalStatus || 'Single',
        spouseName: applicant.spouseName || '',
        quota: applicant.quota || 'Non-Quota',
        departmentalStatus: applicant.departmentalStatus || 'None',
        phone: applicant.phone || '',
        email: applicant.email || '',
        presentAddress: initialPresent,
        permanentAddress: initialPermanent,
        educationList: initialEduList,
        typingSpeedBangla: applicant.typingSpeedBangla || '',
        typingSpeedEnglish: applicant.typingSpeedEnglish || '',
        computerExperience: applicant.computerExperience || '',
        photoUrl: applicant.photoUrl || '',
        signatureUrl: applicant.signatureUrl || '',
        refNo: applicant.refNo || `ACTC-APP-${Math.floor(1000 + Math.random() * 9000)}`,
        isAccountCompleted: Boolean(applicant.isAccountCompleted),
      });

      if (applicant.isAccountCompleted && initialTab !== 'form') {
        setActiveTab('copy');
      } else {
        setActiveTab(initialTab);
      }
    }
  }, [applicant, isOpen, initialTab]);

  if (!isOpen || !formData) return null;

  // District options and helper for current upazilas
  const getUpazilasForDistrict = (districtName: string) => {
    const found = BANGLADESH_DISTRICTS.find(
      (d) => d.name.toLowerCase() === (districtName || '').toLowerCase() || d.bnName === districtName
    );
    return found ? found.upazilas : BANGLADESH_DISTRICTS[0].upazilas;
  };

  const handlePresentDistrictChange = (newDistrict: string) => {
    const upazilas = getUpazilasForDistrict(newDistrict);
    const newUpazila = upazilas.length > 0 ? upazilas[0].en : '';

    const updatedPresent = {
      ...formData.presentAddress!,
      district: newDistrict,
      upazila: newUpazila,
    };

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

  const handlePermanentDistrictChange = (newDistrict: string) => {
    const upazilas = getUpazilasForDistrict(newDistrict);
    const newUpazila = upazilas.length > 0 ? upazilas[0].en : '';

    setFormData({
      ...formData,
      permanentAddress: {
        ...formData.permanentAddress!,
        district: newDistrict,
        upazila: newUpazila,
      },
    });
  };

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

  // Add extra certificate row if user wants
  const handleAddEducation = () => {
    const newEdu: EducationRecord = {
      id: Date.now().toString(),
      exam: 'Certificate Course',
      board: 'Bangladesh Post Office (বাংলাদেশ ডাক বিভাগ)',
      roll: '',
      result: '',
      group: 'Computer Office Application',
      passingYear: '2025',
      duration: '6 Months',
    };
    setFormData({
      ...formData,
      educationList: [...(formData.educationList || []), newEdu],
    });
  };

  const handleRemoveEducation = (id: string) => {
    // Keep at least 1 row
    if ((formData.educationList || []).length <= 1) return;
    setFormData({
      ...formData,
      educationList: (formData.educationList || []).filter((e) => e.id !== id),
    });
  };

  const handleEducationExamChange = (id: string, newExam: string, index: number) => {
    const category = getExamCategory(newExam, index);
    const availableGroups = EDUCATION_LEVELS[category].getGroups(newExam);
    const defaultGroup = availableGroups[0] || 'General';

    setFormData({
      ...formData,
      educationList: (formData.educationList || []).map((e) =>
        e.id === id ? { ...e, exam: newExam, group: defaultGroup } : e
      ),
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
      setActiveTab('copy');
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-60 overflow-y-auto bg-stone-900/80 backdrop-blur-xs flex items-start sm:items-center justify-center p-2 sm:p-4 py-4 sm:py-8 print:p-0 print:bg-white print:overflow-visible"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="bg-[#161a2b] text-white px-5 sm:px-6 py-3.5 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
              AC
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm sm:text-base text-white tracking-wide">
                  আবেদনকারীর পূর্ণাঙ্গ বায়োডাটা ও তথ্য ফরম (Job Applicant Form)
                </h3>
                {formData.isAccountCompleted && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Saved & Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-400">
                সকল জেলা-উপজেলা ও শিক্ষাগত যোগ্যতার সঠিক অটো-সিলেকশন ড্রপডাউন সহ
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
        <div className="bg-stone-100 border-b border-stone-200 px-5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0 print:hidden">
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
              <span>২. অফিসিয়াল এপ্লিকেন্ট কপি (Applicant Copy)</span>
            </button>
          </div>

          {activeTab === 'copy' && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-400" />
                <span>প্রিন্ট / ডাউনলোড (Print Copy)</span>
              </button>
            </div>
          )}
        </div>

        {/* Success Alert Banner */}
        {saveSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 text-emerald-800 text-xs flex items-center space-x-2 animate-fadeIn shrink-0 print:hidden">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">
              আপনার বায়োডাটা সফলভাবে সংরক্ষিত হয়েছে! এপ্লিকেন্ট কপিতে সকল তথ্য প্রদর্শিত হচ্ছে।
            </span>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50 print:p-0 print:bg-white print:overflow-visible">
          
          {/* TAB 1: FORM FILL-UP MODE */}
          {activeTab === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-6 max-w-5xl mx-auto">
              
              {/* Form Header Info Box */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Asad Computer & Training Center · Bottola, Bhully Bazar
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-stone-900 mt-1.5">
                      চাকুরী ও প্রশিক্ষণ আবেদন ফরম (খালি ফরম - আপনার তথ্য লিখুন)
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      জেলা, উপজেলা, বোর্ড ও পাশের সন সরাসরি ড্রপডাউন থেকে সিলেক্ট করুন।
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[11px] font-mono text-stone-500 block">Application Tracking Ref:</span>
                    <span className="text-xs font-bold font-mono text-stone-800 bg-stone-100 px-2.5 py-1 rounded border border-stone-200">
                      {formData.refNo || 'ACTC-APP-NEW'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Special Controls (if in admin mode) */}
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
                    <span>১. সাধারণ ও ব্যক্তিগত তথ্য (Personal Details)</span>
                  </h5>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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
                      placeholder="Enter full name in English (CAPITAL LETTERS)"
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
                      placeholder="বাংলায় পূর্ণ নাম লিখুন"
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
                      placeholder="Father's full name"
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
                      placeholder="পিতার নাম বাংলায় লিখুন"
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
                      placeholder="Mother's full name"
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
                      placeholder="মাতার নাম বাংলায় লিখুন"
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
                      placeholder="e.g. 24 Years 06 Months"
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
                      <option value="Other">Other (অন্যান্য)</option>
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
                      placeholder="১০ বা ১৭ সংখ্যার জাতীয় পরিচয়পত্র নম্বর"
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
                      placeholder="১৭ সংখ্যার জন্ম নিবন্ধন নম্বর (যদি থাকে)"
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
                        placeholder="স্বামী বা স্ত্রীর পূর্ণ নাম"
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
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500 font-mono font-medium"
                      placeholder=""
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">ইমেইল ঠিকানা (Email)</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500 font-mono"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Address Information with Auto-Cascading District & Upazila */}
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
                <div className="border-b border-stone-200 pb-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>২. ঠিকানার বিবরণ (জেলা ও উপজেলা অটো-সিলেক্ট)</span>
                  </h5>
                  <label className="flex items-center space-x-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAddress}
                      onChange={(e) => handleToggleSameAddress(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span>Same as Present Address (উভয় ঠিকানা একই)</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  {/* Present Address */}
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                    <div className="font-bold text-stone-800 border-b border-stone-200 pb-1 text-xs flex items-center justify-between">
                      <span>বর্তমান ঠিকানা (Present Address)</span>
                      <span className="text-[10px] text-emerald-700 font-normal">জেলা সিলেক্ট করলে উপজেলা চলে আসবে</span>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Care of (অভিভাবক/পিতা)</label>
                      <input
                        type="text"
                        value={formData.presentAddress?.careOf || ''}
                        onChange={(e) => handlePresentAddressChange('careOf', e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded-lg outline-none focus:border-emerald-500"
                        placeholder="পিতার নাম অথবা প্রযোজ্য অভিভাবকের নাম"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">গ্রাম/মহল্লা/রাস্তা (Village/Road)</label>
                      <input
                        type="text"
                        value={formData.presentAddress?.village || ''}
                        onChange={(e) => handlePresentAddressChange('village', e.target.value)}
                        className="w-full p-2 bg-white border border-stone-300 rounded-lg outline-none focus:border-emerald-500"
                        placeholder="গ্রাম বা পাড়া / রাস্তার নাম ও বাড়ি নং"
                      />
                    </div>

                    {/* Auto Cascading District & Upazila Selectors */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          জেলা (District) <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.presentAddress?.district || 'Thakurgaon'}
                          onChange={(e) => handlePresentDistrictChange(e.target.value)}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg outline-none focus:border-emerald-500 font-medium"
                        >
                          {BANGLADESH_DISTRICTS.map((d) => (
                            <option key={`pres-dist-${d.name}`} value={d.name}>
                              {d.name} ({d.bnName})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">
                          উপজেলা/থানা (Upazila) <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={formData.presentAddress?.upazila || ''}
                          onChange={(e) => handlePresentAddressChange('upazila', e.target.value)}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg outline-none focus:border-emerald-500 font-medium"
                        >
                          {getUpazilasForDistrict(formData.presentAddress?.district || 'Thakurgaon').map((u) => (
                            <option key={`pres-up-${u.en}`} value={u.en}>
                              {u.en} ({u.bn})
                            </option>
                          ))}
                        </select>
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
                          placeholder="e.g. Bhully / ভূল্লী"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">পোস্ট কোড (Post Code)</label>
                        <input
                          type="text"
                          value={formData.presentAddress?.postCode || ''}
                          onChange={(e) => handlePresentAddressChange('postCode', e.target.value)}
                          className="w-full p-2 bg-white border border-stone-300 rounded-lg outline-none focus:border-emerald-500 font-mono"
                          placeholder="e.g. 5100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Permanent Address */}
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                    <div className="font-bold text-stone-800 border-b border-stone-200 pb-1 text-xs flex items-center justify-between">
                      <span>স্থায়ী ঠিকানা (Permanent Address)</span>
                      {sameAddress && <span className="text-[10px] text-emerald-700">✓ বর্তমান ঠিকানার অনুলিপি</span>}
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
                        placeholder="পিতার নাম বা স্থায়ী অভিভাবক"
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
                        placeholder="স্থায়ী গ্রামের নাম"
                      />
                    </div>

                    {/* Permanent District & Upazila Selectors */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">জেলা (District)</label>
                        <select
                          disabled={sameAddress}
                          value={formData.permanentAddress?.district || 'Thakurgaon'}
                          onChange={(e) => handlePermanentDistrictChange(e.target.value)}
                          className={`w-full p-2 border rounded-lg outline-none font-medium ${
                            sameAddress ? 'bg-stone-100 text-stone-500' : 'bg-white border-stone-300 focus:border-emerald-500'
                          }`}
                        >
                          {BANGLADESH_DISTRICTS.map((d) => (
                            <option key={`perm-dist-${d.name}`} value={d.name}>
                              {d.name} ({d.bnName})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">উপজেলা/থানা (Upazila)</label>
                        <select
                          disabled={sameAddress}
                          value={formData.permanentAddress?.upazila || ''}
                          onChange={(e) => handlePermanentAddressChange('upazila', e.target.value)}
                          className={`w-full p-2 border rounded-lg outline-none font-medium ${
                            sameAddress ? 'bg-stone-100 text-stone-500' : 'bg-white border-stone-300 focus:border-emerald-500'
                          }`}
                        >
                          {getUpazilasForDistrict(formData.permanentAddress?.district || 'Thakurgaon').map((u) => (
                            <option key={`perm-up-${u.en}`} value={u.en}>
                              {u.en} ({u.bn})
                            </option>
                          ))}
                        </select>
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
                          placeholder="স্থায়ী ডাকঘর"
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
                          placeholder="পোস্ট কোড"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Educational Qualifications with Dynamic Groups and Masters row */}
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
                <div className="border-b border-stone-200 pb-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                      <span>৩. শিক্ষাগত যোগ্যতার বিবরণ (এসএসসি, এইচএসসি, স্নাতক ও মাস্টার্স)</span>
                    </h5>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      পরীক্ষা সিলেক্ট করলে সংশ্লিষ্ট বিভাগ/বিষয় আসবে। পাশের সন ও বোর্ড ড্রপডাউন থেকে সিলেক্ট করুন।
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-300 flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>অন্যান্য সার্টিফিকেট যুক্ত করুন</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-stone-200 rounded-lg overflow-hidden min-w-[760px]">
                    <thead className="bg-stone-100 text-stone-800 font-bold border-b border-stone-300">
                      <tr>
                        <th className="p-2.5 w-[20%]">পরীক্ষার নাম (Exam)</th>
                        <th className="p-2.5 w-[22%]">বিভাগ / বিষয় (Group / Subject)</th>
                        <th className="p-2.5 w-[22%]">বোর্ড / বিশ্ববিদ্যালয়</th>
                        <th className="p-2.5 w-[12%]">রোল নং</th>
                        <th className="p-2.5 w-[14%]">ফলাফল (Result/GPA)</th>
                        <th className="p-2.5 w-[10%]">পাশের সন</th>
                        <th className="p-2.5 text-center">মুছুন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 bg-white">
                      {(formData.educationList || []).map((edu, idx) => {
                        const category = getExamCategory(edu.exam, idx);
                        const examList = EDUCATION_LEVELS[category].exams;
                        const groupList = EDUCATION_LEVELS[category].getGroups(edu.exam);
                        const isUniversityLevel = category === 'graduation' || category === 'masters';

                        return (
                          <tr key={edu.id} className="hover:bg-stone-50">
                            {/* Exam Dropdown */}
                            <td className="p-2">
                              <select
                                value={edu.exam}
                                onChange={(e) => handleEducationExamChange(edu.id, e.target.value, idx)}
                                className="w-full p-1.5 border border-stone-300 rounded bg-white text-xs font-semibold focus:border-emerald-500"
                              >
                                {examList.map((ex) => (
                                  <option key={`${edu.id}-ex-${ex}`} value={ex}>
                                    {ex}
                                  </option>
                                ))}
                                {!examList.includes(edu.exam) && (
                                  <option value={edu.exam}>{edu.exam}</option>
                                )}
                              </select>
                              <span className="text-[10px] text-stone-400 block mt-0.5 font-medium">
                                {category === 'ssc' && 'Secondary Level'}
                                {category === 'hsc' && 'Higher Secondary'}
                                {category === 'graduation' && 'Graduation Level'}
                                {category === 'masters' && 'Post-Graduation (মাস্টার্স)'}
                              </span>
                            </td>

                            {/* Dynamic Group / Subject Dropdown */}
                            <td className="p-2">
                              <select
                                value={edu.group}
                                onChange={(e) => handleEducationChange(edu.id, 'group', e.target.value)}
                                className="w-full p-1.5 border border-stone-300 rounded bg-white text-xs font-medium focus:border-emerald-500"
                              >
                                {groupList.map((grp) => (
                                  <option key={`${edu.id}-grp-${grp}`} value={grp}>
                                    {grp}
                                  </option>
                                ))}
                                {!groupList.includes(edu.group) && edu.group && (
                                  <option value={edu.group}>{edu.group}</option>
                                )}
                              </select>
                            </td>

                            {/* Board / University Dropdown */}
                            <td className="p-2">
                              <select
                                value={edu.board}
                                onChange={(e) => handleEducationChange(edu.id, 'board', e.target.value)}
                                className="w-full p-1.5 border border-stone-300 rounded bg-white text-xs focus:border-emerald-500"
                              >
                                {isUniversityLevel ? (
                                  UNIVERSITIES.map((u) => (
                                    <option key={`${edu.id}-uni-${u}`} value={u}>
                                      {u}
                                    </option>
                                  ))
                                ) : (
                                  EDUCATION_BOARDS.map((b) => (
                                    <option key={`${edu.id}-brd-${b}`} value={b}>
                                      {b}
                                    </option>
                                  ))
                                )}
                              </select>
                            </td>

                            {/* Roll Number Input (Blank by default) */}
                            <td className="p-2">
                              <input
                                type="text"
                                value={edu.roll}
                                onChange={(e) => handleEducationChange(edu.id, 'roll', e.target.value)}
                                placeholder="রোল নং"
                                className="w-full p-1.5 border border-stone-300 rounded bg-white text-xs font-mono"
                              />
                            </td>

                            {/* Result Input / Preset */}
                            <td className="p-2">
                              <input
                                type="text"
                                value={edu.result}
                                onChange={(e) => handleEducationChange(edu.id, 'result', e.target.value)}
                                placeholder="GPA / CGPA"
                                className="w-full p-1.5 border border-stone-300 rounded bg-white text-xs font-medium"
                              />
                            </td>

                            {/* Passing Year Dropdown */}
                            <td className="p-2">
                              <select
                                value={edu.passingYear}
                                onChange={(e) => handleEducationChange(edu.id, 'passingYear', e.target.value)}
                                className="w-full p-1.5 border border-stone-300 rounded bg-white text-xs font-mono font-medium"
                              >
                                <option value="">বছর</option>
                                {PASSING_YEARS.map((yr) => (
                                  <option key={`${edu.id}-yr-${yr}`} value={yr}>
                                    {yr}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* Delete Row */}
                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveEducation(edu.id)}
                                title="মুছুন"
                                className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
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
                      placeholder="Computer Office Application 6 Months (Under Bangladesh Post Office)"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Photo & Signature */}
              <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
                <div className="border-b border-stone-200 pb-2.5">
                  <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>৫. ছবি ও স্বাক্ষর (Photo & Signature)</span>
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
                        />
                      ) : (
                        <User className="w-10 h-10 text-stone-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-stone-800">পাসপোর্ট সাইজ ছবি (300 x 300)</div>
                      <div className="text-[11px] text-stone-500 mt-1">
                        অনলাইন আবেদনের ছবি (Max 100 KB)
                      </div>
                      <label className="mt-2.5 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg text-[11px] font-bold text-stone-700 cursor-pointer shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>ছবি আপলোড করুন</span>
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
                        <img
                          src={formData.signatureUrl}
                          alt="Signature"
                          className="h-full object-contain"
                        />
                      ) : formData.applicantName ? (
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
                        স্বাক্ষরের ছবি আপলোড করুন (Max 60 KB)
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
                  <span className="font-semibold text-emerald-700">★ আসাদ কম্পিউটার সেবা ডেস্ক:</span> ফরম পূরণ করে সংরক্ষণে ক্লিক করলেই স্বয়ংক্রিয় এপ্লিকেন্ট কপি তৈরি হবে।
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-1/2 sm:w-auto px-4 py-2.5 border border-stone-300 rounded-xl text-stone-600 font-semibold hover:bg-stone-100 text-xs cursor-pointer"
                  >
                    বাতিল
                  </button>

                  <button
                    type="submit"
                    className="w-1/2 sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>তথ্য সংরক্ষণ ও কপি দেখুন</span>
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* TAB 2: OFFICIAL APPLICANT'S COPY (PRINT & PDF VIEW) */}
          {activeTab === 'copy' && (
            <div className="bg-white p-6 sm:p-10 rounded-xl border border-stone-300 shadow-md max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 text-stone-900 font-sans">
              
              {/* Document Header */}
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
                      {formData.photoUrl ? (
                        <img
                          src={formData.photoUrl}
                          alt="Applicant"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-[9px] text-stone-400 text-center p-1 font-mono">
                          PHOTO<br />300x300
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-stone-500 font-mono block mt-0.5">Photo</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs font-mono font-semibold gap-2">
                  <div>
                    Tracking / Ref: <span className="font-bold text-stone-900">{formData.refNo || 'ACTC-APP'}</span>
                  </div>
                  <div>
                    User ID / Roll: <span className="font-bold text-stone-900">{formData.rollNo || formData.refNo || '—'}</span>
                  </div>
                  {formData.jobTitle && (
                    <div className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-300 font-sans font-bold text-[11px]">
                      আবেদিত পদ: {formData.jobTitle}
                    </div>
                  )}
                  <div>
                    <ApplicationStatusBadge status={formData.admitStatus} size="xs" />
                  </div>
                  <div>
                    Date: <span className="text-stone-800">{formData.appliedDate || 'Online Submission'}</span>
                  </div>
                </div>
              </div>

              {/* Main Applicant Bio-Data Tables */}
              <div className="space-y-4 text-xs">
                
                {/* 1. Basic Information Table */}
                <div className="border border-stone-400">
                  <div className="bg-stone-200 px-3 py-1 font-bold text-stone-900 border-b border-stone-400 uppercase tracking-wider text-[11px]">
                    1. Basic Information (সাধারণ তথ্য)
                  </div>
                  <table className="w-full text-left border-collapse text-xs">
                    <tbody>
                      <tr className="border-b border-stone-300">
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300">Applicant's Name</td>
                        <td className="p-2 font-bold uppercase">{formData.applicantName || '—'}</td>
                        <td className="w-1/4 p-2 font-semibold bg-stone-50 border-r border-stone-300 border-l">প্রার্থীর নাম (বাংলায়)</td>
                        <td className="p-2 font-medium">{formData.nameBangla || '—'}</td>
                      </tr>
                      <tr className="border-b border-stone-300">
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300">Father's Name</td>
                        <td className="p-2 font-medium">{formData.fatherName || '—'}</td>
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300 border-l">পিতার নাম (বাংলায়)</td>
                        <td className="p-2 font-medium">{formData.fatherNameBangla || '—'}</td>
                      </tr>
                      <tr className="border-b border-stone-300">
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300">Mother's Name</td>
                        <td className="p-2 font-medium">{formData.motherName || '—'}</td>
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300 border-l">মাতার নাম (বাংলায়)</td>
                        <td className="p-2 font-medium">{formData.motherNameBangla || '—'}</td>
                      </tr>
                      <tr className="border-b border-stone-300">
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300">Date of Birth</td>
                        <td className="p-2 font-mono">{formData.dob || '—'}</td>
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300 border-l">Age on Circular</td>
                        <td className="p-2">{formData.ageText || '—'}</td>
                      </tr>
                      <tr className="border-b border-stone-300">
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300">Gender & Religion</td>
                        <td className="p-2">{formData.gender || '—'} · {formData.religion || '—'}</td>
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
                        <td className="p-2">{formData.maritalStatus || 'Single'} {formData.spouseName ? `(${formData.spouseName})` : ''}</td>
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300 border-l">Quota (কোটা)</td>
                        <td className="p-2 font-medium">{formData.quota || 'Non-Quota'}</td>
                      </tr>
                      <tr className="border-b border-stone-300">
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300">Mobile Number</td>
                        <td className="p-2 font-mono font-bold text-emerald-800">{formData.phone || '—'}</td>
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300 border-l">Email Address</td>
                        <td className="p-2 font-mono">{formData.email || '—'}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300">Dept. Status</td>
                        <td className="p-2">{formData.departmentalStatus || 'None'}</td>
                        <td className="p-2 font-semibold bg-stone-50 border-r border-stone-300 border-l">Computer Training</td>
                        <td className="p-2">{formData.computerExperience || '—'}</td>
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
                      <div><strong>Care of:</strong> {formData.presentAddress?.careOf || '—'}</div>
                      <div><strong>Village/Road:</strong> {formData.presentAddress?.village || '—'}</div>
                      <div><strong>Upazila & District:</strong> {formData.presentAddress?.upazila || '—'}, {formData.presentAddress?.district || '—'}</div>
                      <div><strong>Post Office & Code:</strong> {formData.presentAddress?.postOffice || '—'} {formData.presentAddress?.postCode ? `- ${formData.presentAddress.postCode}` : ''}</div>
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="font-bold text-stone-900 underline text-[11px] mb-1">Permanent Address (স্থায়ী ঠিকানা):</div>
                      <div><strong>Care of:</strong> {formData.permanentAddress?.careOf || '—'}</div>
                      <div><strong>Village/Road:</strong> {formData.permanentAddress?.village || '—'}</div>
                      <div><strong>Upazila & District:</strong> {formData.permanentAddress?.upazila || '—'}, {formData.permanentAddress?.district || '—'}</div>
                      <div><strong>Post Office & Code:</strong> {formData.permanentAddress?.postOffice || '—'} {formData.permanentAddress?.postCode ? `- ${formData.permanentAddress.postCode}` : ''}</div>
                    </div>
                  </div>
                </div>

                {/* 3. Academic Qualifications Table (Includes Masters row) */}
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
                          <td className="p-2 font-medium border-r border-stone-300">{edu.exam || '—'}</td>
                          <td className="p-2 border-r border-stone-300">{edu.board || '—'}</td>
                          <td className="p-2 font-mono border-r border-stone-300">{edu.roll || '—'}</td>
                          <td className="p-2 font-bold border-r border-stone-300">{edu.result || '—'}</td>
                          <td className="p-2 border-r border-stone-300">{edu.group || '—'}</td>
                          <td className="p-2 font-mono">{edu.passingYear || '—'}</td>
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
                    <div>
                      <strong>Typing Speed:</strong> Bangla: <span className="font-mono font-bold text-emerald-800">{formData.typingSpeedBangla || '—'}</span>, English: <span className="font-mono font-bold text-emerald-800">{formData.typingSpeedEnglish || '—'}</span>
                    </div>
                    <div>
                      <strong>Computer Certification / Training:</strong> {formData.computerExperience || 'Certified in Computer Office Application (Microsoft Office, Excel, Access, Internet)'}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <div>
                        <strong>ফি স্ট্যাটাস (Fee Status):</strong> <span className="font-bold text-emerald-700">{formData.feeStatus || 'Paid'} (৳ {formData.feeAmount || 220})</span>
                      </div>
                      <span className="text-stone-300">|</span>
                      <div className="flex items-center space-x-1.5">
                        <strong>আবেদন স্ট্যাটাস:</strong>
                        <ApplicationStatusBadge status={formData.admitStatus} size="xs" />
                      </div>
                    </div>
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
                      <div className="h-9 flex items-center justify-center">
                        {formData.signatureUrl ? (
                          <img
                            src={formData.signatureUrl}
                            alt="Signature"
                            className="h-8 object-contain"
                          />
                        ) : (
                          <div className="font-serif italic text-sm font-bold text-stone-800 border-b border-stone-400 pb-0.5 px-3">
                            {formData.applicantName || 'Signature'}
                          </div>
                        )}
                      </div>
                      <div className="w-36 border-t border-stone-600 pt-1 text-[11px] font-bold text-stone-900">
                        Applicant's Signature
                      </div>
                      <div className="text-[9px] text-stone-500 font-mono">Date: {formData.appliedDate || 'Online'}</div>
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
