import React, { useRef } from 'react';
import {
  X,
  Printer,
  FileText,
  User,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Clock,
  Award,
} from 'lucide-react';
import { StudentAccount } from '../types.ts';
import { BangladeshPostLogo } from './BangladeshPostLogo.tsx';

interface StudentAdmissionCopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentAccount | null;
}

export const StudentAdmissionCopyModal: React.FC<StudentAdmissionCopyModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  const isFeeCleared = student.paidFee >= student.totalFee;

  return (
    <div
      className="fixed inset-0 z-70 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-start sm:items-center justify-center p-2 sm:p-4 md:p-6 py-4 sm:py-8 print:p-0 print:bg-white print:overflow-visible print:block"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white shadow-2xl rounded-2xl border border-stone-300 my-auto print:my-0 print:border-none print:shadow-none print:rounded-none overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Control Bar (Hidden on print) */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 bg-stone-900 text-white shadow-md print:hidden">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-100 flex items-center space-x-1.5">
                <span>শিক্ষার্থী ভর্তি ফরম ও অফিশিয়াল কপি</span>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-mono">
                  {student.rollNo}
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">
                এডমিন ও শিক্ষার্থী কপি · প্রিন্ট বা পিডিএফ হিসেবে সংরক্ষণ করুন
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              title="পিডিএফ হিসেবে ডাউনলোড বা প্রিন্ট করুন"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট / পিডিএফ ডাউনলোড (PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Admission Form Sheet */}
        <div
          ref={printAreaRef}
          className="p-6 sm:p-10 bg-white text-stone-900 font-sans print:p-6"
        >
          {/* Institutional Document Header */}
          <div className="border-b-2 border-stone-900 pb-4 mb-5">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Bangladesh Post Office Official Logo */}
              <div className="w-20 sm:w-24 shrink-0 flex flex-col items-center text-center">
                <BangladeshPostLogo size={64} />
                <span className="text-[9px] font-bold text-emerald-900 mt-1 uppercase leading-tight font-bengali">
                  বাংলাদেশ ডাক বিভাগ
                </span>
              </div>

              {/* Center: Institute Details & Title */}
              <div className="flex-1 text-center px-2">
                <h1 className="text-lg sm:text-2xl font-black uppercase tracking-wide text-stone-950 font-serif-academic">
                  ASAD COMPUTER & TRAINING CENTER
                </h1>
                <p className="text-xs sm:text-sm font-bold text-emerald-800 font-bengali mt-0.5">
                  বাংলাদেশ ডাক বিভাগের (Bangladesh Post Office) আওতাধীন পরিচালিত প্রশিক্ষণ কেন্দ্র
                </p>
                <p className="text-[10px] sm:text-[11px] text-stone-600 font-medium mt-0.5">
                  বটতলা, ভুল্লী বাজার, ভুল্লী, ঠাকুরগাঁও - ৫১০ | মোবাইল: ০১৭৭৩-৭৩৩৬৫৪, ০১৮৬৪-৩৯৯৮৭১
                </p>
                <div className="inline-block mt-2 px-5 py-1 bg-stone-950 text-white font-bold text-xs uppercase tracking-widest rounded-xs shadow-xs">
                  ভর্তি ফরম ও স্টুডেন্ট কপি (STUDENT ADMISSION COPY)
                </div>
              </div>

              {/* Right: Student Passport Photo Box */}
              <div className="w-24 shrink-0 text-center">
                <div className="w-24 h-28 border-2 border-stone-800 bg-stone-50 overflow-hidden flex items-center justify-center relative shadow-xs">
                  {student.photoUrl ? (
                    <img
                      src={student.photoUrl}
                      alt={student.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2 text-stone-400">
                      <User className="w-8 h-8 text-stone-300 mb-1" />
                      <span className="text-[8px] font-bold uppercase tracking-wider text-stone-400">
                        PASSPORT PHOTO
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-[9px] font-mono text-stone-500 block mt-1">
                  ছবি (Photo)
                </span>
              </div>
            </div>

            {/* Quick Identifier Strip */}
            <div className="mt-4 pt-3 border-t border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="bg-stone-50 p-2 rounded border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">রোল নম্বর (Roll No):</span>
                <strong className="text-stone-900 text-sm font-bold">{student.rollNo}</strong>
              </div>
              <div className="bg-stone-50 p-2 rounded border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">ভর্তি তারিখ (Reg Date):</span>
                <strong className="text-stone-900">{student.admissionDate || student.lastPaymentDate || 'চলতি শিক্ষাবর্ষ'}</strong>
              </div>
              <div className="bg-stone-50 p-2 rounded border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">স্টুডেন্ট মোবাইল (লগইন আইডি):</span>
                <strong className="text-stone-900 font-bold">{student.phone}</strong>
              </div>
              <div className="bg-stone-50 p-2 rounded border border-stone-200">
                <span className="text-[10px] text-stone-500 block font-sans">শিক্ষার্থী স্ট্যাটাস:</span>
                <strong className="text-emerald-700 font-bold font-sans">
                  {student.status === 'Certified' ? '✓ উত্তীর্ণ ও সনদপ্রাপ্ত' : '✓ নিয়মিত শিক্ষার্থী (Active)'}
                </strong>
              </div>
            </div>
          </div>

          {/* Section 1: Basic & Personal Information */}
          <div className="mb-5">
            <div className="bg-stone-800 text-white px-3 py-1 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
              <span>১. শিক্ষার্থীর ব্যক্তিগত বিবরণ (Personal Information)</span>
              <span className="text-[10px] text-stone-300 font-normal">ফরম আইডি: {student.id}</span>
            </div>
            <table className="w-full text-xs border border-stone-300 border-t-0">
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="w-1/4 p-2.5 font-bold bg-stone-50 text-stone-700 border-r border-stone-200">
                    শিক্ষার্থীর পূর্ণ নাম
                  </td>
                  <td className="w-3/4 p-2.5 font-extrabold text-stone-900 uppercase text-sm">
                    {student.name}
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold bg-stone-50 text-stone-700 border-r border-stone-200">
                    পিতার নাম (Father's Name)
                  </td>
                  <td className="p-2.5 font-medium text-stone-900">
                    {student.fatherName || '—'}
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold bg-stone-50 text-stone-700 border-r border-stone-200">
                    মাতার নাম (Mother's Name)
                  </td>
                  <td className="p-2.5 font-medium text-stone-900">
                    {student.motherName || '—'}
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold bg-stone-50 text-stone-700 border-r border-stone-200">
                    জন্ম তারিখ (Date of Birth)
                  </td>
                  <td className="p-2.5 text-stone-900 font-medium">
                    <span className="font-mono">{student.birthDate || '—'}</span>
                    <span className="mx-3 text-stone-300">|</span>
                    <span className="font-bold text-stone-700">লিঙ্গ (Gender): </span>
                    <span>{student.gender || '—'}</span>
                    <span className="mx-3 text-stone-300">|</span>
                    <span className="font-bold text-stone-700">ধর্ম (Religion): </span>
                    <span>{student.religion || 'Islam'}</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold bg-stone-50 text-stone-700 border-r border-stone-200">
                    জাতীয়তা ও রক্তের গ্রুপ
                  </td>
                  <td className="p-2.5 text-stone-900 font-medium">
                    <span className="font-bold text-stone-700">জাতীয়তা: </span>
                    <span>{student.nationality || 'Bangladeshi'}</span>
                    <span className="mx-3 text-stone-300">|</span>
                    <span className="font-bold text-stone-700">রক্তের গ্রুপ: </span>
                    <span className="font-mono font-bold text-rose-700">{student.bloodGroup || '—'}</span>
                    <span className="mx-3 text-stone-300">|</span>
                    <span className="font-bold text-stone-700">বৈবাহিক অবস্থা: </span>
                    <span>{student.maritalStatus || 'Single'}</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold bg-stone-50 text-stone-700 border-r border-stone-200">
                    এনআইডি / জন্ম নিবন্ধন নম্বর
                  </td>
                  <td className="p-2.5 font-mono font-bold text-stone-900">
                    {student.nidNumber || '—'}
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold bg-stone-50 text-stone-700 border-r border-stone-200">
                    যোগাযোগ নম্বর ও ইমেইল
                  </td>
                  <td className="p-2.5 text-stone-900 font-medium">
                    <span className="font-bold text-stone-700">মোবাইল: </span>
                    <span className="font-mono font-bold text-stone-950">{student.phone}</span>
                    <span className="mx-3 text-stone-300">|</span>
                    <span className="font-bold text-stone-700">ইমেইল: </span>
                    <span className="font-mono text-stone-700">{student.email || '—'}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 2: Address Information */}
          <div className="mb-5">
            <div className="bg-stone-800 text-white px-3 py-1 font-bold text-xs uppercase tracking-wider">
              ২. যোগাযোগের ঠিকানা (Address Information)
            </div>
            <table className="w-full text-xs border border-stone-300 border-t-0">
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="w-1/4 p-2.5 font-bold bg-stone-50 text-stone-700 border-r border-stone-200">
                    বর্তমান ঠিকানা (Present Address)
                  </td>
                  <td className="w-3/4 p-2.5 text-stone-900 font-medium">
                    {student.presentAddress ? (
                      <div>
                        {student.presentAddress}
                        {student.presentUpazila && <span>, উপজেলা: {student.presentUpazila}</span>}
                        {student.presentDistrict && <span>, জেলা: {student.presentDistrict}</span>}
                      </div>
                    ) : (
                      'বটতলা, ভুল্লী বাজার, ঠাকুরগাঁও সদর, ঠাকুরগাঁও'
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold bg-stone-50 text-stone-700 border-r border-stone-200">
                    স্থায়ী ঠিকানা (Permanent Address)
                  </td>
                  <td className="p-2.5 text-stone-900 font-medium">
                    {student.permanentAddress ? (
                      <div>
                        {student.permanentAddress}
                        {student.permanentUpazila && <span>, উপজেলা: {student.permanentUpazila}</span>}
                        {student.permanentDistrict && <span>, জেলা: {student.permanentDistrict}</span>}
                      </div>
                    ) : (
                      'বটতলা, ভুল্লী বাজার, ঠাকুরগাঁও সদর, ঠাকুরগাঁও'
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3: Course & Fee Accounts Details */}
          <div className="mb-6">
            <div className="bg-stone-800 text-white px-3 py-1 font-bold text-xs uppercase tracking-wider flex items-center justify-between">
              <span>৩. কোর্স ও ফি হিসাব বিবরণী (Course & Fee Accounts)</span>
              <span className="text-[10px] text-amber-300 font-mono">অফিসিয়াল কোর্স ফি: ৳{student.totalFee}</span>
            </div>
            <table className="w-full text-xs border border-stone-300 border-t-0">
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="w-1/4 p-2.5 font-bold bg-stone-50 text-stone-700 border-r border-stone-200">
                    কোর্সের নাম ও মেয়াদ
                  </td>
                  <td className="w-3/4 p-2.5 text-stone-900 font-bold">
                    {student.course}
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold bg-stone-50 text-stone-700 border-r border-stone-200">
                    ব্যাচ ও সময়সূচি (Batch Schedule)
                  </td>
                  <td className="p-2.5 text-stone-900 font-medium">
                    {student.batch}
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold bg-stone-50 text-stone-700 border-r border-stone-200">
                    ফি পরিশোধের সংক্ষিপ্ত বিবরণ
                  </td>
                  <td className="p-2.5 text-stone-900">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-1">
                      <div className="p-2 bg-stone-100 rounded border border-stone-200">
                        <span className="text-[10px] text-stone-600 block">মোট কোর্স ফি:</span>
                        <strong className="text-stone-900 text-sm font-bold font-mono">৳{student.totalFee}</strong>
                      </div>
                      <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
                        <span className="text-[10px] text-emerald-800 block font-semibold">জমা হয়েছে (Paid):</span>
                        <strong className="text-emerald-700 text-sm font-bold font-mono">৳{student.paidFee}</strong>
                      </div>
                      <div className="p-2 bg-rose-50 rounded border border-rose-200">
                        <span className="text-[10px] text-rose-800 block font-semibold">বকেয়া রয়েছে (Due):</span>
                        <strong className="text-rose-700 text-sm font-bold font-mono">৳{student.dueFee}</strong>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold bg-stone-50 text-stone-700 border-r border-stone-200">
                    ফি স্ট্যাটাস ও ট্রানজেকশন
                  </td>
                  <td className="p-2.5 text-stone-900">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isFeeCleared
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : student.paidFee > 0
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {isFeeCleared
                          ? '✓ সম্পূর্ণ পরিশোধিত (Full Paid)'
                          : student.paidFee > 0
                          ? `আংশিক পরিশোধিত (Paid ৳${student.paidFee})`
                          : 'ফি জমা হয়নি (Unpaid - বকেয়া ৳৩৫০০)'}
                      </span>
                      {student.lastPaymentDate && (
                        <span className="text-[11px] text-stone-600 font-mono">
                          সর্বশেষ পরিশোধ: {student.lastPaymentDate}
                        </span>
                      )}
                      {student.transactionId && (
                        <span className="text-[11px] text-stone-600 font-mono bg-stone-100 px-2 py-0.5 rounded">
                          TrxID: {student.transactionId}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Payment history list if records exist */}
            {student.paymentHistory && student.paymentHistory.length > 0 && (
              <div className="mt-3 border border-stone-300">
                <div className="bg-stone-100 px-3 py-1 font-bold text-[11px] text-stone-700 border-b border-stone-300">
                  অফিসিয়াল পেমেন্ট হিস্ট্রি (Payment Audit Trail)
                </div>
                <table className="w-full text-[11px] text-left">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[9px]">
                      <th className="p-1.5">তারিখ</th>
                      <th className="p-1.5">জমা পরিমাণ</th>
                      <th className="p-1.5">মাধ্যম</th>
                      <th className="p-1.5">TrxID / নোট</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 font-mono">
                    {student.paymentHistory.map((pay, pIdx) => (
                      <tr key={pIdx}>
                        <td className="p-1.5">{pay.date}</td>
                        <td className="p-1.5 font-bold text-emerald-700">৳{pay.amount}</td>
                        <td className="p-1.5 font-sans">{pay.method}</td>
                        <td className="p-1.5 text-stone-600 font-sans">{pay.trxId || pay.note || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 4: Declaration & Official Signatures */}
          <div className="pt-6 border-t-2 border-stone-300">
            <p className="text-[10px] sm:text-[11px] text-stone-600 leading-relaxed italic mb-8">
              ঘোষণা: আমি এই মর্মে নিশ্চয়তা দিচ্ছি যে, উপরে বর্ণিত যাবতীয় তথ্য সম্পূর্ণ সত্য ও সঠিক। প্রতিষ্ঠানের সকল নিয়ম-শৃঙ্খলা মেনে প্রশিক্ষণ গ্রহণ করব।
            </p>

            <div className="grid grid-cols-2 gap-8 items-end pt-4">
              {/* Student Signature */}
              <div className="text-center">
                <div className="h-12 flex items-center justify-center mb-1">
                  {student.signatureUrl ? (
                    <img
                      src={student.signatureUrl}
                      alt="Student Signature"
                      className="h-10 max-w-[160px] object-contain"
                    />
                  ) : (
                    <div className="text-[11px] text-stone-400 italic font-mono">
                      {student.name}
                    </div>
                  )}
                </div>
                <div className="border-t border-dotted border-stone-600 pt-1">
                  <span className="text-xs font-bold text-stone-800 block">
                    শিক্ষার্থীর স্বাক্ষর (Student's Signature)
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">
                    মোবাইল: {student.phone}
                  </span>
                </div>
              </div>

              {/* Institute Authority Signature & Seal */}
              <div className="text-center">
                <div className="h-12 flex items-center justify-center mb-1">
                  <div className="border-2 border-emerald-700 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-wider rotate-[-2deg] bg-emerald-50/50">
                    ✓ APPROVED & VERIFIED
                  </div>
                </div>
                <div className="border-t border-dotted border-stone-600 pt-1">
                  <span className="text-xs font-bold text-stone-900 block font-bengali">
                    মোঃ আসাদুজ্জামান (পরিচালক / কেন্দ্র ইনচার্জ)
                  </span>
                  <span className="text-[10px] text-stone-600 block">
                    আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টার, ঠাকুরগাঁও
                  </span>
                  <span className="text-[9px] text-emerald-800 font-semibold block">
                    (বাংলাদেশ ডাক বিভাগের আওতাধীন)
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Footer Note */}
            <div className="mt-8 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between text-[10px] text-stone-500 font-mono">
              <div>System Record: {student.rollNo} | ACTC Portal</div>
              <div>Generated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              <div className="font-sans">ওয়েবসাইট: asadcomputer.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
