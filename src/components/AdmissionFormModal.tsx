import React, { useState, useRef, useEffect } from 'react';
import { X, Printer, CheckCircle, Upload, RotateCcw } from 'lucide-react';
import { UniversitySeal } from './UniversitySeal.tsx';
import { BANGLADESH_DISTRICTS } from '../data/bangladeshData.ts';

interface AdmissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourse?: string;
}

export const AdmissionFormModal: React.FC<AdmissionFormModalProps> = ({
  isOpen,
  onClose,
  defaultCourse = 'Computer Office Application',
}) => {
  const formRef = useRef<HTMLDivElement>(null);
  const scrollOverlayRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    motherName: '',
    birthDate: '',
    gender: 'Male',
    presentDistrict: 'Thakurgaon',
    presentUpazila: 'Thakurgaon Sadar',
    presentAddress: '',
    permanentDistrict: 'Thakurgaon',
    permanentUpazila: 'Thakurgaon Sadar',
    permanentAddress: '',
    religion: 'Islam',
    nationality: 'Bangladeshi',
    phoneNumber: '',
    emailAddress: '',
    nidNumber: '',
    bloodGroup: '',
    occupation: '',
    maritalStatus: 'Single',
    courseName: defaultCourse,
    declarationAccepted: true,
  });

  const getUpazilasForDistrict = (districtName: string) => {
    const found = BANGLADESH_DISTRICTS.find(
      (d) => d.name.toLowerCase() === (districtName || '').toLowerCase() || d.bnName === districtName
    );
    return found ? found.upazilas : BANGLADESH_DISTRICTS[0].upazilas;
  };

  const handlePresentDistrictChange = (newDistrict: string) => {
    const upazilas = getUpazilasForDistrict(newDistrict);
    setFormData((prev) => ({
      ...prev,
      presentDistrict: newDistrict,
      presentUpazila: upazilas.length > 0 ? upazilas[0].en : '',
    }));
  };

  const handlePermanentDistrictChange = (newDistrict: string) => {
    const upazilas = getUpazilasForDistrict(newDistrict);
    setFormData((prev) => ({
      ...prev,
      permanentDistrict: newDistrict,
      permanentUpazila: upazilas.length > 0 ? upazilas[0].en : '',
    }));
  };

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Immediate scroll reset so the top header, logo and title are 100% visible
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
  };

  return (
    <div
      ref={scrollOverlayRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-start justify-center p-2 sm:p-4 md:p-6 py-4 sm:py-8 print:p-0 print:bg-white print:overflow-visible"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white shadow-2xl rounded-none border border-stone-300 my-2 sm:my-4 print:m-0 print:border-none print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar - Sticky at top so never cut off */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-stone-900 text-white shadow-md print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-cinzel font-semibold">
              Official Admission Form
            </span>
            <span className="text-stone-400 text-xs hidden sm:inline">|</span>
            <span className="text-xs text-stone-300 hidden sm:inline">Asad Computer & Training Center</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#C5A880] hover:bg-[#b5956a] text-stone-950 font-medium text-xs rounded transition-colors"
              title="Print Admission Form"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Form</span>
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Confirmation Toast if submitted */}
        {isSubmitted && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-4 text-emerald-900 flex items-center justify-between print:hidden">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs sm:text-sm">
                <span className="font-semibold">Admission Application Submitted Successfully!</span>
                <p className="text-emerald-700 text-xs mt-0.5">
                  Application Reference: #ACTC-{Math.floor(100000 + Math.random() * 900000)}. Please print a copy and bring it to our center at Bottola, Bhully Bazar, Thakurgaon.
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-emerald-800 underline hover:text-emerald-950 ml-4 shrink-0"
            >
              Edit Form
            </button>
          </div>
        )}

        {/* The Exact Printable Form Sheet */}
        <div
          ref={formRef}
          className="relative bg-white text-stone-900 p-6 sm:p-10 font-sans min-h-[960px] flex flex-col justify-between overflow-hidden print:min-h-0 print:p-8"
        >
          {/* Header Section matching reference image */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b-2 border-sky-400">
              
              {/* Circular Logo matching reference with blue rings */}
              <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-sky-500 p-1 relative bg-white shadow-xs">
                <div className="w-full h-full rounded-full border border-sky-300 flex flex-col items-center justify-center text-center p-1 bg-sky-50/40">
                  <span className="text-[10px] font-bold text-sky-800 uppercase tracking-tighter leading-none">
                    ASAD
                  </span>
                  <span className="text-[8px] font-semibold text-stone-700 tracking-tighter">
                    COMPUTER
                  </span>
                  <div className="w-4 h-[1px] bg-sky-400 my-0.5" />
                  <span className="text-[7px] text-stone-500 font-medium leading-none">
                    ACADEMY
                  </span>
                </div>
              </div>

              {/* Title & Academy Name in center */}
              <div className="flex-1 text-center px-2">
                <h2 className="text-base sm:text-xl font-bold uppercase tracking-wide text-stone-900">
                  ASAD COMPUTER & TRAINING CENTER
                </h2>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-700 mt-0.5">
                  EDUCATIONAL & IT TRAINING ACADEMY
                </p>
                <div className="mt-1 inline-block">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-sky-800 px-3 py-0.5 border-b border-sky-400">
                    ADMISSION FORM
                  </span>
                </div>
              </div>

              {/* Photo Box matching top-right */}
              <div className="flex-shrink-0">
                <label className="w-20 h-24 sm:w-24 sm:h-28 border border-sky-400 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden bg-stone-50 hover:bg-stone-100 transition-colors relative">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Student"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center p-1">
                      <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                        PHOTO
                      </span>
                      <Upload className="w-3.5 h-3.5 text-stone-400 mt-1 print:hidden" />
                      <span className="text-[8px] text-stone-400 mt-0.5 print:hidden">Click upload</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden print:hidden"
                  />
                </label>
              </div>

            </div>

            {/* Form Fields Body */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-3.5 text-xs sm:text-[13px] text-stone-800">
              
              {/* Student's Name */}
              <div className="flex items-end">
                <span className="font-semibold whitespace-nowrap min-w-[130px] sm:min-w-[140px]">
                  Student's Name :
                </span>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="Full name in block letters"
                  className="flex-1 border-b border-dotted border-stone-500 bg-transparent px-2 py-0.5 outline-none font-medium text-stone-900 focus:border-sky-600"
                />
              </div>

              {/* Father's Name */}
              <div className="flex items-end">
                <span className="font-semibold whitespace-nowrap min-w-[130px] sm:min-w-[140px]">
                  Father's Name :
                </span>
                <input
                  type="text"
                  required
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="flex-1 border-b border-dotted border-stone-500 bg-transparent px-2 py-0.5 outline-none font-medium text-stone-900 focus:border-sky-600"
                />
              </div>

              {/* Mother's Name */}
              <div className="flex items-end">
                <span className="font-semibold whitespace-nowrap min-w-[130px] sm:min-w-[140px]">
                  Mother's Name :
                </span>
                <input
                  type="text"
                  required
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  className="flex-1 border-b border-dotted border-stone-500 bg-transparent px-2 py-0.5 outline-none font-medium text-stone-900 focus:border-sky-600"
                />
              </div>

              {/* Birth Date & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-7 flex items-end">
                  <span className="font-semibold whitespace-nowrap min-w-[130px] sm:min-w-[140px]">
                    Birth Date :
                  </span>
                  <input
                    type="date"
                    required
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="flex-1 border-b border-dotted border-stone-500 bg-transparent px-2 py-0.5 outline-none font-medium text-stone-900 focus:border-sky-600"
                  />
                </div>
                <div className="sm:col-span-5 flex items-center space-x-4 pl-0 sm:pl-2">
                  <span className="font-semibold">Gender:</span>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === 'Male'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="accent-sky-600"
                    />
                    <span>Male</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === 'Female'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="accent-sky-600"
                    />
                    <span>Female</span>
                  </label>
                </div>
              </div>

              {/* Dashed Border Box: * Present Address * */}
              <div className="border border-dashed border-stone-400 p-3 sm:p-3.5 relative mt-3 pt-4">
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-3 font-semibold text-stone-800 text-[11px] sm:text-xs">
                  * Present Address (বর্তমান ঠিকানা) *
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold whitespace-nowrap text-xs">District :</span>
                    <select
                      value={formData.presentDistrict}
                      onChange={(e) => handlePresentDistrictChange(e.target.value)}
                      className="flex-1 border-b border-dotted border-stone-500 bg-white px-1 py-1 outline-none font-medium text-xs rounded-none cursor-pointer"
                    >
                      {BANGLADESH_DISTRICTS.map((d) => (
                        <option key={`adm-p-dist-${d.name}`} value={d.name}>
                          {d.name} ({d.bnName})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold whitespace-nowrap text-xs">Upazila :</span>
                    <select
                      value={formData.presentUpazila}
                      onChange={(e) => setFormData({ ...formData, presentUpazila: e.target.value })}
                      className="flex-1 border-b border-dotted border-stone-500 bg-white px-1 py-1 outline-none font-medium text-xs rounded-none cursor-pointer"
                    >
                      {getUpazilasForDistrict(formData.presentDistrict).map((u) => (
                        <option key={`adm-p-up-${u.en}`} value={u.en}>
                          {u.en} ({u.bn})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-end">
                  <span className="font-semibold whitespace-nowrap mr-2 text-xs">Village / Road / Post :</span>
                  <input
                    type="text"
                    required
                    value={formData.presentAddress}
                    onChange={(e) => setFormData({ ...formData, presentAddress: e.target.value })}
                    placeholder="গ্রাম / রাস্তা / পোস্ট অফিস লিখুন"
                    className="flex-1 border-b border-dotted border-stone-500 bg-transparent px-1 py-0.5 outline-none font-medium text-xs"
                  />
                </div>
              </div>

              {/* Dashed Border Box: * Permanent Address * */}
              <div className="border border-dashed border-stone-400 p-3 sm:p-3.5 relative mt-4 pt-4">
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-3 font-semibold text-stone-800 text-[11px] sm:text-xs">
                  * Permanent Address (স্থায়ী ঠিকানা) *
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold whitespace-nowrap text-xs">District :</span>
                    <select
                      value={formData.permanentDistrict}
                      onChange={(e) => handlePermanentDistrictChange(e.target.value)}
                      className="flex-1 border-b border-dotted border-stone-500 bg-white px-1 py-1 outline-none font-medium text-xs rounded-none cursor-pointer"
                    >
                      {BANGLADESH_DISTRICTS.map((d) => (
                        <option key={`adm-perm-dist-${d.name}`} value={d.name}>
                          {d.name} ({d.bnName})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold whitespace-nowrap text-xs">Upazila :</span>
                    <select
                      value={formData.permanentUpazila}
                      onChange={(e) => setFormData({ ...formData, permanentUpazila: e.target.value })}
                      className="flex-1 border-b border-dotted border-stone-500 bg-white px-1 py-1 outline-none font-medium text-xs rounded-none cursor-pointer"
                    >
                      {getUpazilasForDistrict(formData.permanentDistrict).map((u) => (
                        <option key={`adm-perm-up-${u.en}`} value={u.en}>
                          {u.en} ({u.bn})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-end">
                  <span className="font-semibold whitespace-nowrap mr-2 text-xs">Village / Road / Post :</span>
                  <input
                    type="text"
                    required
                    value={formData.permanentAddress}
                    onChange={(e) => setFormData({ ...formData, permanentAddress: e.target.value })}
                    placeholder="স্থায়ী গ্রাম / রাস্তা / পোস্ট অফিস লিখুন"
                    className="flex-1 border-b border-dotted border-stone-500 bg-transparent px-1 py-0.5 outline-none font-medium text-xs"
                  />
                </div>
              </div>

              {/* Religion & Nationality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end pt-1">
                <div className="flex items-end">
                  <span className="font-semibold whitespace-nowrap min-w-[90px]">Religion :</span>
                  <input
                    type="text"
                    value={formData.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    className="flex-1 border-b border-dotted border-stone-500 bg-transparent px-1 py-0.5 outline-none font-medium"
                  />
                </div>
                <div className="flex items-end">
                  <span className="font-semibold whitespace-nowrap min-w-[95px]">Nationality :</span>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="flex-1 border-b border-dotted border-stone-500 bg-transparent px-1 py-0.5 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Phone Number & Email Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                 <div className="flex items-end">
                  <span className="font-semibold whitespace-nowrap min-w-[110px]">Phone Number :</span>
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder=""
                    className="flex-1 border-b border-dotted border-stone-500 bg-transparent px-1 py-0.5 outline-none font-medium"
                  />
                </div>
                <div className="flex items-end">
                  <span className="font-semibold whitespace-nowrap min-w-[105px]">Email Address :</span>
                  <input
                    type="email"
                    value={formData.emailAddress}
                    onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                    placeholder=""
                    className="flex-1 border-b border-dotted border-stone-500 bg-transparent px-1 py-0.5 outline-none font-medium"
                  />
                </div>
              </div>

              {/* NID Number & Blood Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <div className="flex items-end">
                  <span className="font-semibold whitespace-nowrap min-w-[100px]">NID Number :</span>
                  <input
                    type="text"
                    value={formData.nidNumber}
                    onChange={(e) => setFormData({ ...formData, nidNumber: e.target.value })}
                    placeholder="NID or Birth Registration No"
                    className="flex-1 border-b border-dotted border-stone-500 bg-transparent px-1 py-0.5 outline-none font-medium"
                  />
                </div>
                <div className="flex items-end">
                  <span className="font-semibold whitespace-nowrap min-w-[95px]">Blood Group :</span>
                  <input
                    type="text"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="flex-1 border-b border-dotted border-stone-500 bg-transparent px-1 py-0.5 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Occupation & Status (Single / Married) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <div className="flex items-end">
                  <span className="font-semibold whitespace-nowrap min-w-[95px]">Occupation :</span>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="flex-1 border-b border-dotted border-stone-500 bg-transparent px-1 py-0.5 outline-none font-medium"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold">Status:</span>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="maritalStatus"
                      value="Single"
                      checked={formData.maritalStatus === 'Single'}
                      onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                      className="accent-sky-600"
                    />
                    <span>Single</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="maritalStatus"
                      value="Married"
                      checked={formData.maritalStatus === 'Married'}
                      onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                      className="accent-sky-600"
                    />
                    <span>Married</span>
                  </label>
                </div>
              </div>

              {/* Course Name - Pre-filled / Selected */}
              <div className="flex items-end pt-1">
                <span className="font-bold text-sky-900 whitespace-nowrap min-w-[110px]">
                  Course Name :
                </span>
                <input
                  type="text"
                  required
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  className="flex-1 border-b-2 border-dotted border-sky-600 bg-transparent px-2 py-0.5 outline-none font-bold text-stone-900 text-sm"
                />
              </div>

              {/* Declaration Section matching image */}
              <div className="pt-4 border-t border-stone-300 mt-5">
                <div className="text-center">
                  <span className="font-bold uppercase tracking-wider text-stone-900 text-xs">
                    * DECLARATION *
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed text-center mt-1 italic">
                  "I hereby, declaring that I will obey all the rules and regulations of the institution and be fully responsible for violating the rules."
                </p>
              </div>

              {/* Signature Line matching image */}
              <div className="pt-8 flex justify-end">
                <div className="text-center w-52 sm:w-60">
                  <label className="cursor-pointer block">
                    {signaturePreview ? (
                      <img
                        src={signaturePreview}
                        alt="Signature"
                        className="h-10 mx-auto object-contain mb-1"
                      />
                    ) : (
                      <div className="h-8 flex items-center justify-center text-[10px] text-stone-400 border border-dashed border-stone-300 rounded mb-1 print:hidden">
                        Upload or Draw Signature
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureUpload}
                      className="hidden print:hidden"
                    />
                  </label>
                  <div className="border-b border-dotted border-stone-600 w-full mb-1" />
                  <span className="text-[11px] sm:text-xs font-semibold text-stone-700 block">
                    Student's Signature
                  </span>
                </div>
              </div>

              {/* Interactive Submit & Action Buttons (Hidden when printing) */}
              <div className="pt-6 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 print:hidden">
                <div className="text-[11px] text-stone-500">
                  * Fill out and click Submit, or Print directly to submit in-person at Bhully Bazar.
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-medium text-xs rounded transition-colors shadow-sm"
                  >
                    Submit Application
                  </button>
                </div>
              </div>

            </form>
          </div>

          {/* Bottom Wave Graphics matching reference image */}
          <div className="pointer-events-none relative -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 mt-6 h-20 overflow-hidden">
            <svg
              viewBox="0 0 500 150"
              preserveAspectRatio="none"
              className="w-full h-full"
            >
              <path
                d="M-10,120 C100,50 220,160 380,80 L380,160 L-10,160 Z"
                fill="#0284c7"
                opacity="0.85"
              />
              <path
                d="M-10,90 C120,30 250,140 450,50 L450,160 L-10,160 Z"
                fill="#38bdf8"
                opacity="0.65"
              />
              <path
                d="M-10,70 C140,20 280,120 500,40 L500,160 L-10,160 Z"
                fill="#0ea5e9"
                opacity="0.9"
              />
            </svg>
          </div>

        </div>

      </div>
    </div>
  );
};
