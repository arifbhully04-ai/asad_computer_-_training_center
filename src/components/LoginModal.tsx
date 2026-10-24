import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckCircle,
  Eye,
  EyeOff,
  GraduationCap,
  UserCheck,
  Building,
  UserPlus,
  ArrowRight,
} from 'lucide-react';

export type LoginRole = 'student' | 'applicant' | 'institute';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: LoginRole;
  initialMode?: 'login' | 'register';
  onLoginSuccess?: (role: LoginRole) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'applicant',
  initialMode = 'login',
  onLoginSuccess,
}) => {
  const scrollOverlayRef = useRef<HTMLDivElement>(null);

  const [role, setRole] = useState<LoginRole>(initialRole);
  const [isRegisterMode, setIsRegisterMode] = useState(initialMode === 'register');
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
    }
  }, [initialRole]);

  useEffect(() => {
    setIsRegisterMode(initialMode === 'register');
  }, [initialMode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (scrollOverlayRef.current) {
        scrollOverlayRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = '';
      setSubmitted(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess(role);
      }
    }, 1200);
  };

  const getRoleTitle = () => {
    if (isRegisterMode) return 'Applicant Registration';
    if (role === 'student') return 'Student Login';
    if (role === 'institute') return 'Institute Login';
    return 'Applicant Login';
  };

  const getRoleSubtitle = () => {
    if (isRegisterMode) {
      return 'Create your account to apply for job circulars and admission';
    }
    if (role === 'student') {
      return 'Access your Computer Office Application courses, typing records & certificates';
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
          {/* Background Handshake / Interview Image */}
          <img
            src="/src/assets/images/login_interview_handshake_1792830731033.jpg"
            alt="Business handshake"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.52] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60" />

          {/* Top Left: Circular Stylized Brand Badge matching reference */}
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

          {/* Left Hero Copy matching reference image */}
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

        {/* Right Side: Clean White Floating Form Card matching reference image */}
        <div className="w-full md:w-[460px] bg-white p-6 sm:p-9 flex flex-col justify-center relative">
          
          {submitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
              <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
              <h3 className="text-2xl font-bold text-stone-900">
                {isRegisterMode ? 'Registration Successful!' : 'Welcome Back!'}
              </h3>
              <p className="text-stone-500 text-xs sm:text-sm mt-2">
                {isRegisterMode
                  ? 'Your applicant ID has been created.'
                  : `Authenticated successfully into ${getRoleTitle()}...`}
              </p>
            </div>
          ) : (
            <div>
              {/* Role Selector Tabs (Student Login | Applicant Login | Institute Login) */}
              {!isRegisterMode && (
                <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-lg mb-6 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 px-1 rounded flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      role === 'student'
                        ? 'bg-white text-blue-700 shadow-xs font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span className="truncate">Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('applicant')}
                    className={`py-2 px-1 rounded flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      role === 'applicant'
                        ? 'bg-white text-blue-700 shadow-xs font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span className="truncate">Applicant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('institute')}
                    className={`py-2 px-1 rounded flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      role === 'institute'
                        ? 'bg-white text-blue-700 shadow-xs font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span className="truncate">Institute</span>
                  </button>
                </div>
              )}

              {/* Title & Subtitle */}
              <div className="mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                  {getRoleTitle()}
                </h3>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  {getRoleSubtitle()}
                </p>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegisterMode ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Applicant's Full Name"
                        className="w-full border-b border-stone-300 py-1.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-blue-600 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full border-b border-stone-300 py-1.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-blue-600 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-600 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={emailOrId}
                        onChange={(e) => setEmailOrId(e.target.value)}
                        placeholder="Your@email.com"
                        className="w-full border-b border-stone-300 py-1.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-blue-600 outline-none transition-colors"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 mb-1">
                      {role === 'student'
                        ? 'Student ID or Email'
                        : role === 'institute'
                        ? 'Admin Username / Email'
                        : 'Applicant Mobile or Email'}
                    </label>
                    <input
                      type="text"
                      required
                      value={emailOrId}
                      onChange={(e) => setEmailOrId(e.target.value)}
                      placeholder={
                        role === 'student'
                          ? 'ACTC-2026-001 or Your@email.com'
                          : role === 'institute'
                          ? 'admin@asadcomputer.com'
                          : '017XXXXXXXX or Your@email.com'
                      }
                      className="w-full border-b border-stone-300 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-blue-600 outline-none transition-colors"
                    />
                  </div>
                )}

                {/* Password Field */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-stone-600 mb-1">
                    Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full border-b border-stone-300 py-2 pr-8 text-sm text-stone-900 placeholder:text-stone-400 focus:border-blue-600 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 bottom-2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                    aria-label="Toggle password view"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Keep me logged in & Forgot Password */}
                {!isRegisterMode && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center space-x-2 text-stone-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={keepLoggedIn}
                        onChange={(e) => setKeepLoggedIn(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-stone-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
                      />
                      <span>Keep me logged In</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => alert('Password reset PIN will be sent to your mobile or email.')}
                      className="text-blue-600 hover:underline font-medium cursor-pointer"
                    >
                      Forgot Password
                    </button>
                  </div>
                )}

                {/* Sign In Button: Blue, Rounded-full, uppercase matching reference */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#2f4cb3] hover:bg-[#253e99] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-colors shadow-md hover:shadow-lg mt-5 cursor-pointer"
                >
                  {isRegisterMode ? 'REGISTER APPLICANT ACCOUNT' : 'SIGN IN'}
                </button>
              </form>

              {/* Dedicated Applicant Registration Button / Switch as requested */}
              <div className="mt-6 pt-4 border-t border-stone-200">
                {isRegisterMode ? (
                  <div className="text-center text-xs text-stone-600">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => setIsRegisterMode(false)}
                      className="text-blue-600 hover:underline font-bold cursor-pointer"
                    >
                      Sign In Here
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-[11px] text-stone-500">Need a new applicant profile?</span>
                    <button
                      type="button"
                      onClick={() => setIsRegisterMode(true)}
                      className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer border border-stone-300"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-blue-600" />
                      <span>Applicant Registration</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
