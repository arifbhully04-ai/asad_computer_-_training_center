import React, { useState, useEffect } from 'react';
import {
  X,
  KeyRound,
  MessageCircle,
  Phone,
  Copy,
  Check,
  ExternalLink,
  ShieldAlert,
  GraduationCap,
  UserCheck,
  Send,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { StudentAccount, ApplicantAccount, PasswordResetRequest } from '../types.ts';
import {
  loadPersistentStudents,
  loadPersistentApplicants,
  loadPersistentPasswordRequests,
  savePersistentPasswordRequests,
} from '../utils/storageManager.ts';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: 'student' | 'applicant';
  initialIdentifier?: string;
  students?: StudentAccount[];
  applicants?: ApplicantAccount[];
  onBackToLogin?: () => void;
  onRequestSubmitted?: (req: PasswordResetRequest) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'student',
  initialIdentifier = '',
  students = [],
  applicants = [],
  onBackToLogin,
  onRequestSubmitted,
}) => {
  const [role, setRole] = useState<'student' | 'applicant'>(initialRole);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [courseOrJob, setCourseOrJob] = useState('');
  const [notes, setNotes] = useState('আমি আমার পাসওয়ার্ড ভুলে গিয়েছি। অনুগ্রহ করে আমার একাউন্ট যাচাই করে পাসওয়ার্ডটি মেসেজে পাঠিয়ে দিন।');
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<PasswordResetRequest | null>(null);
  const [matchedAccount, setMatchedAccount] = useState<{ name: string; info: string; password?: string } | null>(null);

  // Load latest students & applicants if props are empty
  const allStudents = students.length > 0 ? students : loadPersistentStudents([]);
  const allApplicants = applicants.length > 0 ? applicants : loadPersistentApplicants([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setRole(initialRole);
      setIdentifier(initialIdentifier || '');
      setPhone(initialIdentifier && /^[0-9+ -]+$/.test(initialIdentifier) ? initialIdentifier : '');
      setErrorMessage(null);
      setIsSuccess(false);
      setSubmittedRequest(null);
      setCopiedMessage(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialRole, initialIdentifier]);

  // Real-time lookup to help reassure user and detect matched account
  useEffect(() => {
    const cleanPhoneInput = phone.replace(/[^0-9]/g, '');
    const cleanIdInput = identifier.trim().toLowerCase();

    if (role === 'student') {
      const match = allStudents.find((s) => {
        const sPhone = (s.phone || '').replace(/[^0-9]/g, '');
        const phoneMatch = cleanPhoneInput.length >= 8 && (sPhone.includes(cleanPhoneInput) || cleanPhoneInput.includes(sPhone));
        const rollMatch = cleanIdInput && s.rollNo && s.rollNo.toLowerCase().includes(cleanIdInput);
        return phoneMatch || rollMatch;
      });

      if (match) {
        setMatchedAccount({
          name: match.name,
          info: `কোর্স: ${match.course} (রোল: ${match.rollNo})`,
          password: match.password || 'password123',
        });
        if (!fullName) setFullName(match.name);
        if (!courseOrJob) setCourseOrJob(match.course);
        if (!identifier && match.rollNo) setIdentifier(match.rollNo);
        return;
      }
    } else {
      const match = allApplicants.find((a) => {
        const aPhone = (a.phone || '').replace(/[^0-9]/g, '');
        const phoneMatch = cleanPhoneInput.length >= 8 && (aPhone.includes(cleanPhoneInput) || cleanPhoneInput.includes(aPhone));
        const emailMatch = cleanIdInput && a.email && a.email.toLowerCase().includes(cleanIdInput);
        const rollMatch = cleanIdInput && a.rollNo && a.rollNo.toLowerCase().includes(cleanIdInput);
        return phoneMatch || emailMatch || rollMatch;
      });

      if (match) {
        setMatchedAccount({
          name: match.applicantName,
          info: `আবেদিত পদ: ${match.jobTitle || 'চাকুরী আবেদন'} (রোল: ${match.rollNo || 'N/A'})`,
          password: match.password || 'applicantpass',
        });
        if (!fullName) setFullName(match.applicantName);
        if (!courseOrJob) setCourseOrJob(match.jobTitle || '');
        if (!identifier && (match.rollNo || match.email)) setIdentifier(match.rollNo || match.email);
        return;
      }
    }

    setMatchedAccount(null);
  }, [phone, identifier, role, allStudents, allApplicants]);

  if (!isOpen) return null;

  const generateWhatsAppMessage = (req: PasswordResetRequest) => {
    return `*🔐 পাসওয়ার্ড ভুলে যাওয়া সংক্রান্ত আবেদন - Asad Computer & Training Center*
━━━━━━━━━━━━━━━━━━
👤 *আবেদনকারীর নাম:* ${req.name}
📌 *অ্যাকাউন্ট ধরণ:* ${req.role === 'student' ? 'কোর্স শিক্ষার্থী (Student)' : 'চাকুরী আবেদনকারী (Applicant)'}
📱 *রেজিস্টার্ড মোবাইল:* ${req.phone}
🆔 *আইডি / রোল / ইমেইল:* ${req.identifier || 'প্রযোজ্য নয়'}
📝 *কোর্স / আবেদনকৃত পদ:* ${req.courseOrJob || 'সাধারণ'}
📅 *আবেদনের সময়:* ${req.requestDate}
💬 *বার্তা:* ${req.notes || 'আমি আমার পাসওয়ার্ড ভুলে গিয়েছি, অনুগ্রহ করে যাচাই করে পাঠিয়ে দিন।'}
━━━━━━━━━━━━━━━━━━
*অনুরোধ:* দয়া করে আমার তথ্যটি যাচাই করে আমার নম্বরে মেসেজ অথবা হোয়াটসঅ্যাপে পাসওয়ার্ডটি পাঠিয়ে দিন। ধন্যবাদ!`;
  };

  const getWhatsAppUrl = (req: PasswordResetRequest, targetNumber: string = '8801773733654') => {
    const text = encodeURIComponent(generateWhatsAppMessage(req));
    return `https://wa.me/${targetNumber}?text=${text}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanInputPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanInputPhone || cleanInputPhone.length < 10) {
      setErrorMessage('অনুগ্রহ করে আপনার সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (যে নম্বর দিয়ে ভর্তি বা আবেদন করেছিলেন)।');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।');
      return;
    }

    const todayDate = new Date().toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newRequest: PasswordResetRequest = {
      id: Date.now(),
      name: fullName.trim(),
      phone: phone.trim(),
      role: role,
      identifier: identifier.trim() || undefined,
      courseOrJob: courseOrJob.trim() || undefined,
      requestDate: todayDate,
      notes: notes.trim(),
      status: 'Pending',
      recoveredPassword: matchedAccount?.password,
    };

    // Save in persistent storage
    const existing = loadPersistentPasswordRequests();
    const updated = [newRequest, ...existing];
    savePersistentPasswordRequests(updated);

    if (onRequestSubmitted) {
      onRequestSubmitted(newRequest);
    }

    setSubmittedRequest(newRequest);
    setIsSuccess(true);

    // Open WhatsApp link
    const waUrl = getWhatsAppUrl(newRequest);
    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch {
      // Fallback
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-70 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#161a2b] text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white tracking-wide">
                পাসওয়ার্ড ভুলে গেছেন? (Forgot Password)
              </h3>
              <p className="text-[11px] text-stone-300">
                তথ্য পূরণ করে পাঠান, হোয়াটসঅ্যাপে আপনার পাসওয়ার্ড পাঠিয়ে দেওয়া হবে
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess && submittedRequest ? (
          /* Success Screen */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                রিকোয়েস্ট গ্রহণ করা হয়েছে (Request Submitted)
              </span>
              <h4 className="text-xl font-bold text-stone-900 mt-2">
                পাসওয়ার্ড রিকভারি তথ্য সফলভাবে সাবমিট হয়েছে!
              </h4>
              <p className="text-xs text-stone-600 mt-1.5 max-w-md mx-auto leading-relaxed">
                আপনার নাম <strong>{submittedRequest.name}</strong> ও মোবাইল নম্বর <strong>{submittedRequest.phone}</strong> আমাদের সিস্টেমে সংরক্ষিত হয়েছে এবং আসাদ কম্পিউটারের হোয়াটসঅ্যাপে মেসেজ প্রস্তুত করা হয়েছে।
              </p>
            </div>

            {/* Request Summary */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-left text-xs max-w-md mx-auto space-y-2">
              <div className="flex justify-between border-b border-stone-200 pb-1.5">
                <span className="text-stone-500">অ্যাকাউন্ট ধরণ:</span>
                <span className="font-bold text-stone-900">
                  {submittedRequest.role === 'student' ? 'কোর্স শিক্ষার্থী (Student)' : 'চাকুরী আবেদনকারী (Applicant)'}
                </span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-1.5">
                <span className="text-stone-500">নাম:</span>
                <span className="font-bold text-stone-900">{submittedRequest.name}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-1.5">
                <span className="text-stone-500">রেজিস্টার্ড মোবাইল:</span>
                <span className="font-mono font-bold text-blue-700">{submittedRequest.phone}</span>
              </div>
              {submittedRequest.identifier && (
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-500">আইডি / রোল:</span>
                  <span className="font-mono font-bold text-stone-900">{submittedRequest.identifier}</span>
                </div>
              )}
              {submittedRequest.courseOrJob && (
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-500">কোর্স / পদ:</span>
                  <span className="font-bold text-stone-800">{submittedRequest.courseOrJob}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-stone-500">স্ট্যাটাস:</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                  প্রক্রিয়াধীন - দ্রুত পাসওয়ার্ড পাঠানো হবে
                </span>
              </div>
            </div>

            {/* Guidance banner */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-xs text-left space-y-1">
              <div className="font-bold flex items-center space-x-1.5 text-emerald-800">
                <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>পরবর্তী ধাপ (Next Steps):</span>
              </div>
              <p className="leading-relaxed text-[11px] text-emerald-900">
                আমাদের এডমিন প্যানেল থেকে আপনার তথ্য ও রেজিস্টার্ড নম্বরটি মিলিয়ে দেখা হচ্ছে। এরপর আপনার হোয়াটসঅ্যাপ বা এসএমএস-এ আপনার আসল পাসওয়ার্ডটি পাঠিয়ে দেওয়া হবে।
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <a
                href={getWhatsAppUrl(submittedRequest, '8801773733654')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp এ মেসেজ পাঠান</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => handleCopyText(generateWhatsAppMessage(submittedRequest))}
                className="w-full sm:w-auto px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border border-stone-300"
              >
                {copiedMessage ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-600" />
                    <span>মেসেজ কপি করুন</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onBackToLogin) onBackToLogin();
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 hover:bg-black text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
              >
                লগইন স্ক্রিনে ফিরে যান
              </button>
            </div>

            <div className="pt-2 text-[11px] text-stone-500">
              জরুরি প্রয়োজনে সরাসরি কল করুন: <a href="tel:01773733654" className="font-bold text-emerald-700 hover:underline">01773-733654</a> (আসাদ কম্পিউটার ও ট্রেনিং সেন্টার)
            </div>
          </div>
        ) : (
          /* Input Form */
          <div className="p-5 sm:p-7 max-h-[82vh] overflow-y-auto space-y-4 text-xs">
            {/* Account Type Selection */}
            <div>
              <label className="block font-bold text-stone-700 mb-1.5 text-xs">
                আপনার অ্যাকাউন্ট ধরণ নির্বাচন করুন (Account Role) <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-3 rounded-xl border flex items-center space-x-2.5 transition-all cursor-pointer ${
                    role === 'student'
                      ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-xs ring-2 ring-blue-500/20 font-bold'
                      : 'border-stone-200 bg-white hover:border-blue-200 text-stone-700'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${role === 'student' ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-500'}`}>
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-xs">কোর্স শিক্ষার্থী (Student)</div>
                    <div className="text-[10px] text-stone-500">কম্পিউটার অফিস অ্যাপ্লিকেশন</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('applicant')}
                  className={`p-3 rounded-xl border flex items-center space-x-2.5 transition-all cursor-pointer ${
                    role === 'applicant'
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 shadow-xs ring-2 ring-emerald-500/20 font-bold'
                      : 'border-stone-200 bg-white hover:border-emerald-200 text-stone-700'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${role === 'applicant' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-500'}`}>
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-xs">চাকুরী আবেদনকারী (Applicant)</div>
                    <div className="text-[10px] text-stone-500">সরকারি/অনলাইন সার্কুলার</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Matched Account Reassurance Badge */}
            {matchedAccount && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center space-x-2.5 text-emerald-900 animate-in fade-in duration-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="flex-1 text-[11px]">
                  <span className="font-bold block">✓ আপনার প্রোফাইল পাওয়া গেছে: {matchedAccount.name}</span>
                  <span className="text-emerald-700 block">{matchedAccount.info}</span>
                  <span className="text-[10px] text-emerald-800">সাবমিট বাটনে ক্লিক করলেই এডমিনের হোয়াট্সএ্যাপে আপনার তথ্য পৌছে যাবে এবং এডমিন আপনাকে পাসওয়ার্ড পাঠিয়ে দেবেন।</span>
                </div>
              </div>
            )}

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  আপনার পূর্ণ নাম (Full Name) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ভর্তি ফরম বা আবেদনে দেওয়া নাম লিখুন"
                  className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 placeholder:text-stone-400 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  রেজিস্টার্ড মোবাইল নম্বর (Registered Mobile Number) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="যেমন: 017xxxxxxxx"
                  className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 placeholder:text-stone-400 focus:border-amber-500 outline-none font-mono"
                />
                <span className="text-[10px] text-stone-500 block mt-0.5">
                  ভর্তি ফরম পূরণ বা চাকুরীর আবেদনে যে ১১ সংখ্যার মোবাইল নম্বর দিয়েছিলেন
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    রোল / রেফারেন্স নম্বর বা ইমেইল (যদি জানা থাকে)
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={role === 'student' ? 'যেমন: ACTC-2026-084' : 'রোল বা ইমেইল'}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 placeholder:text-stone-400 focus:border-amber-500 outline-none font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    কোর্স অথবা আবেদনকৃত পদ
                  </label>
                  <input
                    type="text"
                    value={courseOrJob}
                    onChange={(e) => setCourseOrJob(e.target.value)}
                    placeholder={role === 'student' ? 'কম্পিউটার অফিস অ্যাপ্লিকেশন' : 'পদের নাম'}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 placeholder:text-stone-400 focus:border-amber-500 outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  অতিরিক্ত বার্তা বা বিবরণ (Message to Admin)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="আপনার কোনো সমস্যা থাকলে এখানে লিখে জানাতে পারেন"
                  className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 placeholder:text-stone-400 focus:border-amber-500 outline-none text-xs resize-none"
                />
              </div>

              {/* Informational Guidance */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-600 text-[11px] space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-stone-800">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>পাসওয়ার্ড রিকভারির নিয়মাবলী:</span>
                </div>
                <p className="leading-relaxed">
                  সাবমিট বাটনে ক্লিক করলে আপনার তথ্য সরাসরি সংরক্ষিত হবে এবং আমাদের অফিসিয়াল হোয়াটসঅ্যাপ নম্বরে (<span className="font-mono font-bold text-emerald-700">01773-733654</span>) একটি ফরম্যাটেড মেসেজ চলে যাবে। আমরা ডাটাবেজ যাচাই করে আপনার নম্বরে মেসেজ করে পাসওয়ার্ড পাঠিয়ে দেব।
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onBackToLogin) onBackToLogin();
                  }}
                  className="text-stone-500 hover:text-stone-800 font-medium text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <span>লগইন-এ ফিরে যান</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 border border-stone-300 rounded-xl text-stone-600 font-medium hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center space-x-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>সাবমিট ও WhatsApp মেসেজ পাঠান</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
