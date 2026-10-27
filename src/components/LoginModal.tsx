import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  GraduationCap,
  UserCheck,
  Building,
  UserPlus,
  ArrowRight,
  Lock,
  User,
  Phone,
  Mail,
  Briefcase,
} from 'lucide-react';
import { StudentAccount, ApplicantAccount, PasswordResetRequest } from '../types.ts';
import { loadPersistentStudents } from '../utils/storageManager.ts';
import { ForgotPasswordModal } from './ForgotPasswordModal.tsx';

export type LoginRole = 'student' | 'applicant' | 'institute';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: LoginRole;
  initialMode?: 'login' | 'register';
  initialJobTitle?: string;
  initialEmailOrId?: string;
  students?: StudentAccount[];
  applicants?: ApplicantAccount[];
  onRegisterApplicant?: (newApplicant: ApplicantAccount) => void;
  onLoginSuccess?: (role: LoginRole, user?: StudentAccount | ApplicantAccount) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'applicant',
  initialMode = 'login',
  initialJobTitle,
  initialEmailOrId,
  students = [],
  applicants = [],
  onRegisterApplicant,
  onLoginSuccess,
}) => {
  const scrollOverlayRef = useRef<HTMLDivElement>(null);

  const [role, setRole] = useState<LoginRole>(initialRole);
  const [isRegisterMode, setIsRegisterMode] = useState(initialMode === 'register');
  const [emailOrId, setEmailOrId] = useState(initialEmailOrId || '');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [targetJob, setTargetJob] = useState(initialJobTitle || '');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Status & Error messaging states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [suggestRegistration, setSuggestRegistration] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successInfo, setSuccessInfo] = useState<string>('');

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole]);

  useEffect(() => {
    if (initialEmailOrId) {
      setEmailOrId(initialEmailOrId);
    }
  }, [initialEmailOrId]);

  useEffect(() => {
    setIsRegisterMode(initialMode === 'register');
  }, [initialMode]);

  useEffect(() => {
    if (initialJobTitle) {
      setTargetJob(initialJobTitle);
    }
  }, [initialJobTitle]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setErrorMessage(null);
      setSuggestRegistration(false);
      setSubmitted(false);
      if (scrollOverlayRef.current) {
        scrollOverlayRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = '';
      setErrorMessage(null);
      setSubmitted(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuggestRegistration(false);

    // MODE 1: APPLICANT REGISTRATION
    if (isRegisterMode) {
      if (!fullName.trim() || !phone.trim() || !emailOrId.trim() || !password.trim()) {
        setErrorMessage('অনুগ্রহ করে সকল তথ্য পূরণ করুন।');
        return;
      }

      // Check if applicant already exists with same phone or email
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const existing = applicants.find(
        (a) =>
          a.email.toLowerCase() === emailOrId.trim().toLowerCase() ||
          a.phone.replace(/[^0-9]/g, '') === cleanPhone
      );

      if (existing) {
        setErrorMessage('এই মোবাইল বা ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট রয়েছে! অনুগ্রহ করে সরাসরি লগইন করুন।');
        setSuggestRegistration(false);
        return;
      }

      // Create new Applicant Account
      const newApplicant: ApplicantAccount = {
        id: Date.now(),
        applicantName: fullName.trim(),
        phone: phone.trim(),
        email: emailOrId.trim(),
        password: password,
        jobTitle: targetJob || '',
        feeStatus: 'Paid',
        feeAmount: 220,
        admitStatus: 'Processing',
        appliedDate: 'Today (Online)',
        rollNo: `ACTC-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      if (onRegisterApplicant) {
        onRegisterApplicant(newApplicant);
      }

      setSuccessInfo(`রেজিস্ট্রেশন সফল হয়েছে! স্বাগতম, ${newApplicant.applicantName}। আপনার প্রোফাইলে নিয়ে যাওয়া হচ্ছে...`);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        onClose();
        if (onLoginSuccess) {
          onLoginSuccess('applicant', newApplicant);
        }
      }, 1200);

      return;
    }

    // MODE 2: LOGIN VALIDATION
    const query = emailOrId.trim().toLowerCase();
    const cleanPhoneQuery = emailOrId.replace(/[^0-9]/g, '');

    // A. APPLICANT LOGIN
    if (role === 'applicant') {
      const found = applicants.find(
        (a) =>
          a.email.toLowerCase() === query ||
          (cleanPhoneQuery.length >= 8 && a.phone.replace(/[^0-9]/g, '').includes(cleanPhoneQuery)) ||
          (a.rollNo && a.rollNo.toLowerCase() === query)
      );

      // Rule: "আগে থেকেই ইউজার সেভ না থাকলে লগইন হবেনা রেজিষ্ট্রেশন করতে হবে"
      if (!found) {
        setErrorMessage('এই তথ্য দিয়ে কোনো এপ্লিকেন্ট অ্যাকাউন্ট পাওয়া যায়নি! আগে থেকেই ডাটাবেজে ইউজার সেভ না থাকলে লগইন হবে না। অনুগ্রহ করে প্রথমে রেজিস্ট্রেশন করুন।');
        setSuggestRegistration(true);
        return;
      }

      // Password Validation
      const validPass = found.password || 'applicantpass';
      if (password !== validPass) {
        setErrorMessage('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।');
        return;
      }

      setSuccessInfo(`লগইন সফল হয়েছে! স্বাগতম, ${found.applicantName}। আপনার প্রোফাইলে নিয়ে যাওয়া হচ্ছে...`);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        onClose();
        if (onLoginSuccess) {
          onLoginSuccess('applicant', found);
        }
      }, 1000);

      return;
    }

    // B. STUDENT LOGIN (Login ID = Admission Mobile Number, Password = Admission Set Password)
    if (role === 'student') {
      const allStudents = students && students.length > 0 ? students : loadPersistentStudents([]);
      const cleanInputDigits = emailOrId.replace(/[^0-9]/g, '');
      const inputTrimmed = emailOrId.trim().toLowerCase();

      const found = allStudents.find((s) => {
        const sPhoneDigits = (s.phone || '').replace(/[^0-9]/g, '');
        const isPhoneMatch =
          cleanInputDigits.length >= 8 &&
          (sPhoneDigits === cleanInputDigits ||
            sPhoneDigits.endsWith(cleanInputDigits) ||
            cleanInputDigits.endsWith(sPhoneDigits));
        const isRollMatch = s.rollNo && s.rollNo.trim().toLowerCase() === inputTrimmed;
        const isEmailMatch = s.email && s.email.trim().toLowerCase() === inputTrimmed;
        return isPhoneMatch || isRollMatch || isEmailMatch;
      });

      if (!found) {
        setErrorMessage('এই মোবাইল নম্বর বা রোল দিয়ে কোনো স্টুডেন্ট অ্যাকাউন্ট পাওয়া যায়নি! কোর্সে ভর্তি ফরম পূরণ করার সময় যে মোবাইল নম্বর দিয়েছেন (১১ সংখ্যা) তা দিয়ে চেষ্টা করুন।');
        return;
      }

      const validPass = found.password || 'password123';
      if (password.trim() !== validPass.trim()) {
        setErrorMessage('ভুল পাসওয়ার্ড! কোর্সের ভর্তি ফরমে যে পাসওয়ার্ড সেট করেছিলেন তা সঠিকভাবে প্রদান করুন।');
        return;
      }

      setSuccessInfo(`লগইন সফল হয়েছে! স্বাগতম, ${found.name}। আপনার স্টুডেন্ট ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...`);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        onClose();
        if (onLoginSuccess) {
          onLoginSuccess('student', found);
        }
      }, 1000);

      return;
    }

    // C. INSTITUTE / ADMIN LOGIN
    if (role === 'institute') {
      const validAdmins = ['admin', 'admin@asadcomputer.com', '01773733654', 'bhulli.postoffice@gmail.com'];
      const validPasswords = ['admin123', 'asad2026', '123456'];

      const isAdminUser = validAdmins.includes(query) || validAdmins.includes(cleanPhoneQuery);
      const isPassValid = validPasswords.includes(password);

      if (!isAdminUser || !isPassValid) {
        setErrorMessage('অ্যাডমিন ইউজারনেম বা পাসওয়ার্ড সঠিক নয়! সঠিক তথ্য দিয়ে চেষ্টা করুন।');
        return;
      }

      setSuccessInfo('অ্যাডমিনিস্ট্রেটর লগইন সফল হয়েছে! অ্যাডমিন প্যানেলে নিয়ে যাওয়া হচ্ছে...');
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        onClose();
        if (onLoginSuccess) {
          onLoginSuccess('institute');
        }
      }, 1000);
    }
  };

  const getRoleTitle = () => {
    if (isRegisterMode) return 'Applicant Registration';
    if (role === 'student') return 'Student Login';
    if (role === 'institute') return 'Institute Login';
    return 'Applicant Login';
  };

  const getRoleSubtitle = () => {
    if (isRegisterMode) {
      return 'Create your new applicant account to apply for circulars and track results';
    }
    if (role === 'student') {
      return 'Access your Computer Office Application courses, typing records & fee balance';
    }
    if (role === 'institute') {
      return 'Staff and administrative portal for Asad Computer & Training Center';
    }
    return 'Track your job circular applications, admission forms & admit cards';
  };

  return (
    <div
      ref={scrollOverlayRef}
      className="fixed inset-0 z-60 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-6 py-6 sm:py-10"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl min-h-[560px] sm:min-h-[600px] bg-stone-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row my-auto border border-stone-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors cursor-pointer"
          aria-label="Close Login"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Photo Background with Headline & Subtitle matching reference image */}
        <div className="relative flex-1 p-8 sm:p-12 flex flex-col justify-between overflow-hidden min-h-[260px] md:min-h-auto">
          <img
            src="/src/assets/images/login_interview_handshake_1792830731033.jpg"
            alt="Business handshake"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.52] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60" />

          {/* Top Left Brand Badge */}
          <div className="relative z-10 flex items-center space-x-2">
            <div className="w-12 h-12 rounded-full border border-teal-300/60 bg-teal-900/40 backdrop-blur-xs flex items-center justify-center text-center p-1 shadow-md">
              <span className="font-signature text-teal-200 text-lg leading-none transform -rotate-6">
                Asad
              </span>
            </div>
            <span className="text-xs uppercase tracking-widest text-teal-200 font-cinzel font-semibold drop-shadow-sm">
              Computer & Training
            </span>
          </div>

          {/* Hero Copy */}
          <div className="relative z-10 my-auto py-8">
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-white tracking-tight leading-[1.15] drop-shadow-md">
              Understand. Innovate.<br />
              Exceed
            </h2>
            <p className="mt-4 text-sm sm:text-base text-cyan-300 font-medium drop-shadow-sm max-w-sm">
              A new way to search - curated jobs, just for you.
            </p>
          </div>

          {/* Bottom badge */}
          <div className="relative z-10 text-[11px] text-stone-300 font-light flex items-center justify-between">
            <span>Bottola, Bhully Bazar, Thakurgaon</span>
            <span className="text-teal-300 font-medium">Helpline: 01773-733654</span>
          </div>
        </div>

        {/* Right Side: Floating Form Card */}
        <div className="w-full md:w-[460px] bg-white p-6 sm:p-9 flex flex-col justify-center relative">
          
          {submitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
              <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
              <h3 className="text-2xl font-bold text-stone-900">
                {isRegisterMode ? 'Registration Successful!' : 'Welcome Back!'}
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-xs">
                {successInfo || 'Redirecting to your dashboard profile...'}
              </p>
            </div>
          ) : (
            <div>
              {/* Role Selector Tabs (Student Login | Applicant Login | Institute Login) */}
              {!isRegisterMode && (
                <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-lg mb-5 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('applicant');
                      setErrorMessage(null);
                    }}
                    className={`py-2 px-1 rounded flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      role === 'applicant'
                        ? 'bg-white text-emerald-700 shadow-xs font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span className="truncate">Applicant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRole('student');
                      setErrorMessage(null);
                    }}
                    className={`py-2 px-1 rounded flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      role === 'student'
                        ? 'bg-white text-blue-700 shadow-xs font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span className="truncate">Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRole('institute');
                      setErrorMessage(null);
                    }}
                    className={`py-2 px-1 rounded flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      role === 'institute'
                        ? 'bg-white text-purple-700 shadow-xs font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Building className="w-4 h-4 text-purple-600" />
                    <span className="truncate">Institute</span>
                  </button>
                </div>
              )}

              {/* Title & Subtitle */}
              <div className="mb-4">
                <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                  {getRoleTitle()}
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  {getRoleSubtitle()}
                </p>
              </div>

              {/* Error Message Alert (with Quick Switch to Register) */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold leading-relaxed">{errorMessage}</p>
                      {suggestRegistration && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsRegisterMode(true);
                            setErrorMessage(null);
                            if (emailOrId.includes('@')) {
                              setEmailOrId(emailOrId);
                            } else {
                              setPhone(emailOrId);
                            }
                          }}
                          className="mt-2 inline-flex items-center space-x-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-[11px] transition-colors cursor-pointer"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>এখনই রেজিস্ট্রেশন করুন (Register Now)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                {isRegisterMode ? (
                  <>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Full Name (পূর্ণ নাম)
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="আপনার পূর্ণ নাম লিখুন"
                        className="w-full border border-stone-300 rounded-lg p-2 text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Mobile Number (মোবাইল নম্বর)
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="আপনার ১১ সংখ্যার মোবাইল নম্বর লিখুন"
                        className="w-full border border-stone-300 rounded-lg p-2 text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 outline-none transition-colors font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Email Address (ইমেইল এড্রেস)
                      </label>
                      <input
                        type="email"
                        required
                        value={emailOrId}
                        onChange={(e) => setEmailOrId(e.target.value)}
                        placeholder="আপনার ইমেইল ঠিকানা লিখুন"
                        className="w-full border border-stone-300 rounded-lg p-2 text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Applied Job Circular / Subject
                      </label>
                      <input
                        type="text"
                        value={targetJob}
                        onChange={(e) => setTargetJob(e.target.value)}
                        placeholder="আবেদনের বিষয় বা পদ (ঐচ্ছিক)"
                        className="w-full border border-stone-300 rounded-lg p-2 text-stone-800 bg-stone-50 outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      {role === 'student'
                        ? 'Student Login ID / Mobile Number or Roll (স্টুডেন্ট আইডি / মোবাইল নম্বর বা রোল)'
                        : role === 'institute'
                        ? 'Admin Username, Mobile or Email'
                        : 'Applicant Mobile Number or Email'}
                    </label>
                    <input
                      type="text"
                      required
                      value={emailOrId}
                      onChange={(e) => {
                        setEmailOrId(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder={
                        role === 'student'
                          ? 'ভর্তি ফরমের মোবাইল নম্বর (যেমন: 017xxxxxxxx) বা রোল'
                          : role === 'institute'
                          ? 'admin or email'
                          : 'মোবাইল নম্বর বা ইমেইল ঠিকানা'
                      }
                      className="w-full border border-stone-300 rounded-lg p-2.5 text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 outline-none transition-colors"
                    />
                    {role === 'student' && (
                      <p className="text-[11px] text-sky-700 mt-1.5 font-medium flex items-center space-x-1">
                        <span>💡</span>
                        <span>ভর্তি ফরম পূরণের সময় যে মোবাইল নম্বর ও পাসওয়ার্ড নির্ধারণ করেছেন তা দিয়ে লগইন করুন।</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Password Field */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Password (পাসওয়ার্ড)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorMessage(null);
                      }}
                      placeholder="পাসওয়ার্ড লিখুন"
                      className="w-full border border-stone-300 rounded-lg p-2.5 pr-10 text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 outline-none transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                      aria-label="Toggle password view"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Helper Notes */}
                {!isRegisterMode && (
                  <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                    {role === 'applicant' && (
                      <span>
                        * নতুন আবেদনকারীরা নিচের "Applicant Registration" বাটনে ক্লিক করে একাউন্ট তৈরি করুন।
                      </span>
                    )}
                    {role === 'student' && (
                      <span>
                        * সংরক্ষিত স্টুডেন্ট রোল: <strong>ACTC-2026-084</strong> (পাসওয়ার্ড: <code>password123</code>)
                      </span>
                    )}
                    {role === 'institute' && (
                      <span>
                        * এডমিন ইউজার: <strong>admin</strong> (পাসওয়ার্ড: <code>admin123</code>)
                      </span>
                    )}
                  </div>
                )}

                {/* Keep me logged in & Forgot Password */}
                {!isRegisterMode && (
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center space-x-2 text-stone-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={keepLoggedIn}
                        onChange={(e) => setKeepLoggedIn(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                      />
                      <span>Keep me logged in</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-emerald-700 hover:text-emerald-800 hover:underline font-semibold cursor-pointer transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#00897b] hover:bg-[#00796b] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-md hover:shadow-lg mt-3 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>{isRegisterMode ? 'Complete Registration & Open Profile' : 'Sign In to Profile'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Dedicated Applicant Registration Switch */}
              <div className="mt-4 pt-3 border-t border-stone-200">
                {isRegisterMode ? (
                  <div className="text-center text-xs text-stone-600">
                    ইতিমধ্যে রেজিস্ট্রেশন করা আছে?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterMode(false);
                        setErrorMessage(null);
                      }}
                      className="text-emerald-700 hover:underline font-bold cursor-pointer"
                    >
                      এখানে সরাসরি লগইন করুন
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-1.5">
                    <span className="text-[11px] text-stone-500">নতুন এপ্লিকেন্ট অ্যাকাউন্ট নেই?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRegisterMode(true);
                        setErrorMessage(null);
                      }}
                      className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer border border-stone-300"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Applicant Registration (নতুন রেজিস্ট্রেশন)</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

      {showForgotPassword && (
        <ForgotPasswordModal
          isOpen={showForgotPassword}
          onClose={() => setShowForgotPassword(false)}
          initialRole={role === 'student' ? 'student' : 'applicant'}
          initialIdentifier={emailOrId}
          students={students}
          applicants={applicants}
          onBackToLogin={() => setShowForgotPassword(false)}
        />
      )}
    </div>
  );
};

