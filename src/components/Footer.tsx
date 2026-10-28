import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { UniversitySeal } from './UniversitySeal.tsx';
import { BangladeshPostLogo } from './BangladeshPostLogo.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface FooterProps {
  onSelectNavItem?: (item: string, details?: string) => void;
  onOpenCourseModal?: () => void;
  onOpenAdmission?: () => void;
  onOpenOnlineServices?: (serviceId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectNavItem,
  onOpenCourseModal,
  onOpenAdmission,
  onOpenOnlineServices,
}) => {
  const { trans, t, language } = useLanguage();

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
                  {trans('Asad Computer', 'আসাদ কম্পিউটার')}
                </h3>
                <p className="text-xs uppercase tracking-widest text-[#C5A880] font-medium">
                  {trans('& Training Center', '& ট্রেনিং সেন্টার')}
                </p>
              </div>
            </div>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed pt-2">
              {t('footerAboutText')}
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenAdmission?.()}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#C5A880] hover:bg-[#b0936b] text-stone-950 font-bold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                <span>{t('footerOnlineAdmissionBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-stone-300 text-xs">
              <BangladeshPostLogo size={32} />
              <div className="flex flex-col">
                <span className="font-bold text-white text-[11px] leading-tight">
                  বাংলাদেশ ডাক বিভাগ অনুমোদিত
                </span>
                <span className="text-[10px] text-stone-400 leading-tight">
                  Under Bangladesh Post Office Affiliated
                </span>
              </div>
            </div>
          </div>


          {/* Column 2: Key Courses & Services */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.2em] font-cinzel font-semibold mb-4 border-b border-stone-800 pb-2">
              {trans('Courses & Programs', 'কোর্স ও প্রোগ্রাম')}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-400">
              <li>
                <button
                  onClick={() => onOpenCourseModal?.()}
                  className="hover:text-white transition-colors text-left font-semibold text-stone-200 cursor-pointer"
                >
                  {trans('• Computer Office Application (3 & 6 Months)', '• কম্পিউটার অফিস অ্যাপ্লিকেশন (৩ ও ৬ মাস)')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCourseModal?.()}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {trans('• MS Word, Excel, PowerPoint & Access', '• এমএস ওয়ার্ড, এক্সেল, পাওয়ারপয়েন্ট ও অ্যাক্সেস')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCourseModal?.()}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {trans('• English & Bengali (Bijoy/Avro) Typing', '• ইংরেজি ও বাংলা (বিজয়/অভ্র) টাইপিং')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenOnlineServices?.('digital-land-services')}
                  className="hover:text-emerald-400 text-emerald-300 font-bold transition-colors text-left cursor-pointer flex items-center space-x-1.5"
                >
                  <span>{trans('• Digital Land Services (All Land Work)', '• ডিজিটাল ভূমি সেবা (জমি সংক্রান্ত সকল কাজ)')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenOnlineServices?.('govt-job-applications')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {trans('• All Government & Private Job Applications', '• সকল সরকারি ও বেসরকারি চাকুরীর আবেদন')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenOnlineServices?.('university-college-admission')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {trans('• University & College Admission Forms', '• বিশ্ববিদ্যালয় ও কলেজ ভর্তি আবেদন')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenOnlineServices?.('epassport-visa-services')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  {trans('• Passport, Visa, NID & Birth Registration', '• পাসপোর্ট, ভিসা, এনআইডি ও জন্ম নিবন্ধন')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenOnlineServices?.()}
                  className="hover:text-amber-300 text-amber-400/90 font-medium transition-colors text-left cursor-pointer"
                >
                  {trans('• View All Online Services (Name Plates)', '• সকল অনলাইন সেবা দেখুন (নেম প্লেট)')}
                </button>
              </li>
              <li>
                <a
                  href="#faq-section"
                  className="hover:text-[#C5A880] text-amber-300/80 transition-colors text-left font-medium block"
                >
                  • {trans('Frequently Asked Questions (FAQ)', 'সচরাচর প্রশ্ন ও উত্তর (FAQ Section)')}
                </a>
              </li>
              <li>
                <a
                  href="#student-testimonials"
                  className="hover:text-emerald-400 text-emerald-300/90 transition-colors text-left font-medium block"
                >
                  • {trans('Student Reviews & Success Stories', 'শিক্ষার্থীদের মতামত ও সাফল্য (Reviews)')}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Direct Channels */}
          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.2em] font-cinzel font-semibold mb-4 border-b border-stone-800 pb-2">
              {trans('Direct Contact', 'সরাসরি যোগাযোগ')}
            </h4>
            <ul className="space-y-3.5 text-xs sm:text-sm text-stone-400">
              {/* Phone Numbers */}
              <li className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
                    {trans('Phone Numbers', 'মোবাইল নম্বর')}
                  </span>
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
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
                    {trans('WhatsApp Support', 'হোয়াটসঅ্যাপ সহায়তা')}
                  </span>
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
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">
                    {trans('Email Address', 'ইমেইল ঠিকানা')}
                  </span>
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
              {trans('Center Location', 'প্রতিষ্ঠানের ঠিকানা')}
            </h4>
            <div className="space-y-4 text-xs sm:text-sm text-stone-400">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium block">
                    {trans('Physical Address', 'সরাসরি ঠিকানা')}
                  </span>
                  <p className="text-stone-200 font-medium leading-relaxed mt-0.5">
                    {trans('Bottola, Bhully Bazar,', 'বটতলা, ভুল্লী বাজার,')}<br />
                    {trans('Bhully, Thakurgaon', 'ভুল্লী, ঠাকুরগাঁও')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 pt-1">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium block">
                    {trans('Service Hours', 'সেবার সময়সূচী')}
                  </span>
                  <p className="text-stone-300 text-xs leading-relaxed mt-0.5">
                    {trans('Saturday – Thursday: 8:00 AM – 9:00 PM', 'শনিবার - বৃহস্পতিবার: সকাল ৮:০০ - রাত ৯:০০')}<br />
                    {trans('Friday: 3:00 PM – 8:00 PM (Emergency Applications)', 'শুক্রবার: বিকেল ৩:০০ - রাত ৮:০০ (জরুরি আবেদন)')}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Center Name */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>
            © {new Date().getFullYear()} <span className="text-stone-300 font-medium">{trans('Asad Computer & Training Center', 'আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টার')}</span>. {trans('All rights reserved.', 'সর্বস্বত্ব সংরক্ষিত।')}
          </p>
          <p className="text-center sm:text-right text-stone-500">
            {trans('Bottola, Bhully Bazar, Bhully, Thakurgaon · Phone: 01773-733654', 'বটতলা, ভুল্লী বাজার, ভুল্লী, ঠাকুরগাঁও · মোবাইল: ০১৭৭৩-৭৩৩৬৫৪')}
          </p>
        </div>


      </div>
    </footer>
  );
};
