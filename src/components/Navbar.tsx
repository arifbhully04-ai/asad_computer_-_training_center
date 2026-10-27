import React, { useState } from 'react';
import {
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Briefcase,
  LogIn,
  GraduationCap,
  UserCheck,
  Building,
  UserPlus,
} from 'lucide-react';
import { UniversitySeal } from './UniversitySeal.tsx';
import { LoginRole } from './LoginModal.tsx';
import { useLanguage, LanguageSwitcherButton } from '../context/LanguageContext.tsx';

interface NavbarProps {
  onSelectNavItem: (item: string, details?: string) => void;
  onOpenCourseModal: () => void;
  onOpenAdmission: () => void;
  onOpenJobPortal: () => void;
  onOpenLogin: (role?: LoginRole, mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectNavItem,
  onOpenCourseModal,
  onOpenAdmission,
  onOpenJobPortal,
  onOpenLogin,
}) => {
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const handleNavClick = (e: React.MouseEvent, label: string, details?: string) => {
    e.preventDefault();
    setCoursesDropdownOpen(false);
    setLoginDropdownOpen(false);
    setMobileMenuOpen(false);
    onSelectNavItem(label, details);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/80 via-black/50 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 sm:h-28">
          
          {/* Mobile hamburger button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/90 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Left Nav Links: About Center -> Courses -> Job Portal */}
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-10 flex-1 justify-end pr-6 lg:pr-10">
            <a
              href="#about"
              onClick={(e) =>
                handleNavClick(
                  e,
                  t('aboutCenter'),
                  t('aboutCenterDesc')
                )
              }
              className="text-white/85 hover:text-white text-sm lg:text-[15px] font-normal tracking-wide transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap"
            >
              {t('aboutCenter')}
            </a>

            {/* Courses Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                onBlur={() => setTimeout(() => setCoursesDropdownOpen(false), 250)}
                className="flex items-center space-x-1 text-white/85 hover:text-white text-sm lg:text-[15px] font-normal tracking-wide transition-colors duration-200 py-1 whitespace-nowrap group cursor-pointer"
                aria-expanded={coursesDropdownOpen}
              >
                <span>{t('courses')}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 text-white/70 group-hover:text-white ${
                    coursesDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {coursesDropdownOpen && (
                <div className="absolute left-0 mt-3 w-72 bg-white/98 backdrop-blur-md shadow-2xl border border-stone-200 py-3 px-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="text-[10px] uppercase tracking-widest text-[#B39265] font-cinzel font-bold px-2 mb-2">
                    {t('academicCourses')}
                  </div>
                  
                  {/* Computer Office Application */}
                  <div className="p-3 bg-stone-50 border border-stone-200 hover:border-sky-500 transition-colors">
                    <button
                      onClick={() => {
                        setCoursesDropdownOpen(false);
                        onOpenCourseModal();
                      }}
                      className="w-full text-left font-bold text-stone-900 text-sm hover:text-sky-700 transition-colors block cursor-pointer"
                    >
                      {t('computerOfficeApp')}
                    </button>
                    <p className="text-[11px] text-stone-500 mt-1">
                      {t('courseSummaryShort')}
                    </p>
                    
                    <div className="mt-2.5 pt-2 border-t border-stone-200 flex justify-end">
                      <button
                        onClick={() => {
                          setCoursesDropdownOpen(false);
                          onOpenAdmission();
                        }}
                        className="flex items-center space-x-1 px-3 py-1 bg-[#C5A880] hover:bg-[#b0936b] text-stone-950 font-bold text-[11px] uppercase tracking-wider rounded transition-colors cursor-pointer"
                      >
                        <span>{t('admission')}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-stone-100 flex justify-between px-2">
                    <button
                      onClick={() => {
                        setCoursesDropdownOpen(false);
                        onOpenCourseModal();
                      }}
                      className="text-xs text-stone-600 hover:text-stone-900 underline font-medium cursor-pointer"
                    >
                      {t('viewCourseDetails')}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Job Portal / Notice button */}
            <button
              onClick={() => onOpenJobPortal()}
              className="flex items-center space-x-1.5 text-white/90 hover:text-white text-sm lg:text-[15px] font-medium tracking-wide transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-emerald-400 after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('jobPortalNotice')}</span>
            </button>
          </nav>

          {/* Center University Seal for Asad Computer */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group block"
              aria-label="Asad Computer & Training Center Home"
            >
              <UniversitySeal size={74} className="sm:w-20 sm:h-20" />
            </a>
          </div>

          {/* Desktop Right Nav Links: Online Services -> Login -> Contact -> Language Toggle */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 flex-1 justify-start pl-6 lg:pr-4 lg:pl-10">
            <a
              href="#online-services"
              onClick={(e) =>
                handleNavClick(
                  e,
                  t('onlineServices'),
                  t('onlineServicesDesc')
                )
              }
              className="text-white/85 hover:text-white text-sm lg:text-[15px] font-normal tracking-wide transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap"
            >
              {t('onlineServices')}
            </a>

            {/* Login Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLoginDropdownOpen(!loginDropdownOpen)}
                onBlur={() => setTimeout(() => setLoginDropdownOpen(false), 250)}
                className="flex items-center space-x-1.5 text-white font-medium text-sm lg:text-[15px] px-3.5 py-1.5 rounded bg-white/10 hover:bg-white/20 border border-white/25 transition-all duration-200 whitespace-nowrap group cursor-pointer shadow-xs"
                aria-expanded={loginDropdownOpen}
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('login')}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 text-white/70 group-hover:text-white ${
                    loginDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Login Dropdown Menu with Student Login, Applicant Login, Institute Login & Applicant Registration */}
              {loginDropdownOpen && (
                <div className="absolute left-0 mt-3 w-64 bg-white/98 backdrop-blur-md shadow-2xl border border-stone-200 py-2.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="text-[10px] uppercase tracking-widest text-stone-400 font-cinzel font-bold px-4 py-1">
                    {t('selectPortalAccess')}
                  </div>

                  {/* Student Login */}
                  <button
                    onClick={() => {
                      setLoginDropdownOpen(false);
                      onOpenLogin('student', 'login');
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs text-stone-700 hover:text-blue-700 hover:bg-blue-50/70 transition-colors text-left cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <div className="font-bold text-stone-900">{t('studentLogin')}</div>
                      <div className="text-[10px] text-stone-500">{t('studentLoginDesc')}</div>
                    </div>
                  </button>

                  {/* Applicant Login */}
                  <button
                    onClick={() => {
                      setLoginDropdownOpen(false);
                      onOpenLogin('applicant', 'login');
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs text-stone-700 hover:text-blue-700 hover:bg-blue-50/70 transition-colors text-left cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="font-bold text-stone-900">{t('applicantLogin')}</div>
                      <div className="text-[10px] text-stone-500">{t('applicantLoginDesc')}</div>
                    </div>
                  </button>

                  {/* Institute Login */}
                  <button
                    onClick={() => {
                      setLoginDropdownOpen(false);
                      onOpenLogin('institute', 'login');
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs text-stone-700 hover:text-blue-700 hover:bg-blue-50/70 transition-colors text-left cursor-pointer"
                  >
                    <Building className="w-4 h-4 text-purple-600 shrink-0" />
                    <div>
                      <div className="font-bold text-stone-900">{t('instituteLogin')}</div>
                      <div className="text-[10px] text-stone-500">{t('instituteLoginDesc')}</div>
                    </div>
                  </button>

                  <div className="my-1.5 border-t border-stone-200" />

                  {/* Applicant Registration */}
                  <div className="px-3 pt-1">
                    <button
                      onClick={() => {
                        setLoginDropdownOpen(false);
                        onOpenLogin('applicant', 'register');
                      }}
                      className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded transition-colors shadow-xs cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{t('applicantRegistration')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <a
              href="#contact"
              onClick={(e) =>
                handleNavClick(
                  e,
                  t('contact'),
                  t('contactDesc')
                )
              }
              className="text-white/85 hover:text-white text-sm lg:text-[15px] font-normal tracking-wide transition-colors duration-200 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap"
            >
              {t('contact')}
            </a>

            {/* Language Switcher button in desktop navbar */}
            <div className="pl-1">
              <LanguageSwitcherButton />
            </div>
          </nav>

          {/* Right side Language Switcher button on mobile devices */}
          <div className="flex items-center md:hidden">
            <LanguageSwitcherButton />
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-900/98 backdrop-blur-md border-t border-white/10 px-6 py-6 space-y-4">
          {/* Mobile Language Switcher Bar */}
          <LanguageSwitcherButton variant="drawer" className="mb-3" />

          <div className="flex flex-col space-y-3">
            <a
              href="#about"
              onClick={(e) =>
                handleNavClick(e, t('aboutCenter'), t('aboutCenterDesc'))
              }
              className="text-white/90 hover:text-white text-base py-1"
            >
              {t('aboutCenter')}
            </a>

            {/* Mobile Course & Admission */}
            <div className="p-3 bg-stone-800/80 rounded border border-white/10">
              <span className="text-xs font-semibold text-[#C5A880] uppercase tracking-wider block">
                {t('courses')}
              </span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCourseModal();
                }}
                className="text-white font-medium text-sm mt-1 block hover:underline"
              >
                • {t('computerOfficeApp')}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmission();
                }}
                className="mt-2.5 w-full py-2 bg-[#C5A880] text-stone-950 font-bold text-xs uppercase tracking-wider rounded"
              >
                {t('admissionForm')}
              </button>
            </div>

            {/* Mobile Job Portal / Notice */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJobPortal();
              }}
              className="flex items-center space-x-2 text-white/95 text-base py-2 font-medium cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>{t('jobPortalNotice')}</span>
            </button>

            <a
              href="#online-services"
              onClick={(e) =>
                handleNavClick(e, t('onlineServices'), t('onlineServicesDesc'))
              }
              className="text-white/90 hover:text-white text-base py-1"
            >
              {t('onlineServices')}
            </a>

            {/* Mobile Login & Registration Section */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="text-xs uppercase tracking-widest text-[#C5A880] font-cinzel">
                {t('selectPortalAccess')}
              </div>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin('student', 'login');
                  }}
                  className="flex items-center space-x-2 text-white/80 hover:text-white text-sm py-1 cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  <span>{t('studentLogin')}</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin('applicant', 'login');
                  }}
                  className="flex items-center space-x-2 text-white/80 hover:text-white text-sm py-1 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t('applicantLogin')}</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin('institute', 'login');
                  }}
                  className="flex items-center space-x-2 text-white/80 hover:text-white text-sm py-1 cursor-pointer"
                >
                  <Building className="w-4 h-4 text-purple-400" />
                  <span>{t('instituteLogin')}</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin('applicant', 'register');
                  }}
                  className="mt-1 w-full py-2 bg-[#00897b] text-white font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{t('applicantRegistration')}</span>
                </button>
              </div>
            </div>

            <a
              href="#contact"
              onClick={(e) =>
                handleNavClick(e, t('contact'), t('contactDesc'))
              }
              className="text-white/90 hover:text-white text-base py-1 pt-2 border-t border-white/10"
            >
              {t('contact')}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

