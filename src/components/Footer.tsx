import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { UniversitySeal } from './UniversitySeal.tsx';

interface FooterProps {
  onSelectNavItem?: (item: string, details?: string) => void;
  onOpenCourseModal?: () => void;
  onOpenAdmission?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectNavItem,
  onOpenCourseModal,
  onOpenAdmission,
}) => {
  return (
    <footer className="bg-[#18181b] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: 4 columns on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-stone-800/80">
          
          {/* Column 1: Center Identity & Seal */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <UniversitySeal size={56} className="text-[#C5A880]" />
              <div>
                <h3 className="font-cinzel text-white text-base font-bold tracking-wide">
                  Asad Computer
                </h3>
                <p className="text-xs uppercase tracking-widest text-[#C5A880] font-medium">
                  & Training Center
                </p>
              </div>
            </div>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed pt-2">
              Empowering students and job seekers with certified Computer Office Application skills and dependable online government and institutional application services.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenAdmission?.()}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#C5A880] hover:bg-[#b0936b] text-stone-950 font-bold text-xs uppercase tracking-wider rounded transition-colors"
              >
                <span>Online Admission Form</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center space-x-2 text-stone-400 text-xs pt-1">
              <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span>Government Registered IT Training & E-Services</span>
            </div>
          </div>

          {/* Column 2: Key Courses & Services */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.2em] font-cinzel font-semibold mb-4 border-b border-stone-800 pb-2">
              Courses & Programs
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-400">
              <li>
                <button
                  onClick={() => onOpenCourseModal?.()}
                  className="hover:text-white transition-colors text-left font-semibold text-stone-200"
                >
                  • Computer Office Application (3 & 6 Months)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCourseModal?.()}
                  className="hover:text-white transition-colors text-left"
                >
                  • MS Word, Excel, PowerPoint & Access
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCourseModal?.()}
                  className="hover:text-white transition-colors text-left"
                >
                  • English & Bengali (Bijoy/Avro) Typing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNavItem?.('Online Services')}
                  className="hover:text-white transition-colors text-left"
                >
                  • All Government & Private Job Applications
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNavItem?.('Online Services')}
                  className="hover:text-white transition-colors text-left"
                >
                  • University & College Admission Forms
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectNavItem?.('Online Services')}
                  className="hover:text-white transition-colors text-left"
                >
                  • Passport, Visa, NID & Birth Registration
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Direct Channels */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.2em] font-cinzel font-semibold mb-4 border-b border-stone-800 pb-2">
              Direct Contact
            </h4>
            <ul className="space-y-3.5 text-xs sm:text-sm text-stone-400">
              {/* Phone Numbers */}
              <li className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">Phone Numbers</span>
                  <div className="flex flex-wrap gap-x-3 text-stone-300">
                    <a href="tel:01773733654" className="hover:text-white transition-colors">
                      01773-733654
                    </a>
                    <span className="text-stone-600">|</span>
                    <a href="tel:01864399871" className="hover:text-white transition-colors">
                      01864-399871
                    </a>
                  </div>
                </div>
              </li>

              {/* WhatsApp */}
              <li className="flex items-start space-x-3">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">WhatsApp Support</span>
                  <a
                    href="https://wa.me/8801407215416"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-300 hover:text-emerald-400 transition-colors font-medium"
                  >
                    01407-215416
                  </a>
                </div>
              </li>

              {/* Email */}
              <li className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">Email Address</span>
                  <a
                    href="mailto:bhulli.postoffice@gmail.com"
                    className="text-stone-300 hover:text-white transition-colors break-all"
                  >
                    bhulli.postoffice@gmail.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Office Address & Hours */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.2em] font-cinzel font-semibold mb-4 border-b border-stone-800 pb-2">
              Center Location
            </h4>
            <div className="space-y-4 text-xs sm:text-sm text-stone-400">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium block">Physical Address</span>
                  <p className="text-stone-200 font-medium leading-relaxed mt-0.5">
                    Bottola, Bhully Bazar,<br />
                    Bhully, Thakurgaon
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 pt-1">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium block">Service Hours</span>
                  <p className="text-stone-300 text-xs leading-relaxed mt-0.5">
                    Saturday – Thursday: 8:00 AM – 9:00 PM<br />
                    Friday: 3:00 PM – 8:00 PM (Emergency Applications)
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Center Name */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>
            © {new Date().getFullYear()} <span className="text-stone-300 font-medium">Asad Computer & Training Center</span>. All rights reserved.
          </p>
          <p className="text-center sm:text-right text-stone-500">
            Bottola, Bhully Bazar, Bhully, Thakurgaon · Phone: 01773-733654
          </p>
        </div>

      </div>
    </footer>
  );
};
