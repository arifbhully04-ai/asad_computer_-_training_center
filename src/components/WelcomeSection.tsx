import React from 'react';
import {
  Quote,
  Globe,
  Award,
  Laptop,
  MapPin,
  Phone,
  ShieldCheck,
  Code,
} from 'lucide-react';
import { PostOfficeAffiliationBadge } from './PostOfficeAffiliationBadge.tsx';
import { SignatureSvg } from './SignatureSvg.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface WelcomeSectionProps {
  onLearnMore?: () => void;
  onOpenCourseModal?: () => void;
  onOpenOnlineServices?: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onLearnMore }) => {
  const { language, setLanguage } = useLanguage();
  const isEn = language === 'en';

  return (
    <section className="bg-[#faf9f6] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-stone-200 font-bengali relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header: Affiliation Badge, Language Toggle & Welcome Title */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          
          {/* Official Bangladesh Post Office Affiliation Badge */}
          <div className="mb-5">
            <PostOfficeAffiliationBadge onClick={onLearnMore} />
          </div>

          {/* Interactive Language Switcher Toggle */}
          <div className="inline-flex items-center space-x-1.5 p-1 rounded-full bg-white border border-stone-300 shadow-xs mb-5">
            <span className="flex items-center space-x-1 pl-2.5 pr-1 text-xs text-stone-500 font-medium">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isEn ? 'Language:' : 'ভাষা পরিবর্তন:'}</span>
            </span>
            <button
              onClick={() => setLanguage('bn')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                language === 'bn'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              বাংলা (Bangla)
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              English
            </button>
          </div>

          {/* Main Welcome Heading */}
          <h2 className="text-2xl sm:text-4xl font-bold font-serif-academic text-stone-900 tracking-tight leading-snug max-w-3xl">
            {isEn
              ? 'Welcome to Asad Computer & Training Center'
              : 'আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টারে স্বাগতম'}
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl font-normal">
            {isEn
              ? 'Operating under the Bangladesh Post Office. Dedicated to empowering youth with certified Computer Office Application skills and dependable online digital services.'
              : 'বাংলাদেশ ডাক বিভাগের আওতাধীন পরিচালিত। দক্ষ মানবসম্পদ গঠন, আধুনিক কম্পিউটার অফিস অ্যাপ্লিকেশন প্রশিক্ষণ ও নির্ভরযোগ্য ডিজিটাল নাগরিক সেবায় একটি বিশ্বস্ত প্রতিষ্ঠান।'}
          </p>
        </div>

        {/* 2-COLUMN BALANCED SUITE: LEFT (DIRECTOR) & RIGHT (ASSISTANT DIRECTOR) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-8 items-stretch">
          
          {/* ======================================================== */}
          {/* 1. LEFT CARD: DIRECTOR & ENTREPRENEUR (বামে পরিচালক)      */}
          {/* ======================================================== */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-xl transition-all duration-200 border-2 border-amber-500/40 flex flex-col justify-between relative overflow-hidden">
            {/* Top Amber Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700" />

            <div>
              {/* Photo & Identity Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 pb-5 border-b border-stone-100">
                <div className="relative shrink-0">
                  <div className="w-24 h-28 sm:w-26 sm:h-32 rounded-2xl overflow-hidden shadow-md border-2 border-amber-500/80 p-0.5 bg-gradient-to-b from-amber-100 to-amber-50">
                    <img
                      src="/assets/aistudio/Passport_f4551a67.jpeg"
                      alt="MD. ASADUZZAMAN - Director"
                      className="w-full h-full object-cover object-top rounded-xl"
                      loading="lazy"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-amber-600 text-white text-[10px] font-bold shadow-2xs">
                    {isEn ? 'Director' : 'পরিচালক'}
                  </span>
                </div>

                <div className="text-center sm:text-left min-w-0 flex-1">
                  <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold mb-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isEn ? 'Institution & Vision' : 'প্রতিষ্ঠান পরিচিতি'}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold font-serif-academic text-stone-900 leading-snug">
                    {isEn ? 'MD. ASADUZZAMAN' : 'মোঃ আসাদুজ্জামান'}
                  </h3>

                  <div className="text-xs sm:text-sm font-bold text-amber-700 mt-0.5">
                    {isEn ? 'Director & Entrepreneur' : 'পরিচালক ও উদ্যোক্তা'}
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                    <a
                      href="tel:01773733654"
                      className="inline-flex items-center space-x-1 text-xs text-stone-800 hover:text-amber-800 font-semibold bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>01773-733654</span>
                    </a>

                    <span className="inline-flex items-center space-x-1 text-xs text-stone-600 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{isEn ? 'Bottola, Bhully Bazar' : 'বটতলী, ভুল্লী বাজার'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Message from Director (প্রতিষ্ঠান সম্পর্কে বাণী) */}
              <div className="pt-5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
                  <Quote className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    {isEn
                      ? "Message regarding the Institution:"
                      : 'প্রতিষ্ঠান সম্পর্কে পরিচালকের বাণী:'}
                  </span>
                </div>

                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-2.5">
                  <p className="font-normal text-justify sm:text-left">
                    {isEn
                      ? '“The core vision of Asad Computer & Training Center has always been to empower students, youth, and job seekers in our area with modern digital competencies. Operating proudly under the Bangladesh Post Office, we are committed to delivering authentic IT education and dependable e-services.”'
                      : '“আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টার প্রতিষ্ঠার মূল লক্ষ্য শিক্ষার্থীদের আধুনিক আইটি জ্ঞানে স্বাবলম্বী করে তোলা। বাংলাদেশ ডাক বিভাগের আওতাধীন পরিচালিত আমাদের কেন্দ্রটি সততা, নিষ্ঠা ও নির্ভরযোগ্যতার সাথে গুণগত কম্পিউটার প্রশিক্ষণ ও নাগরিক ডিজিটাল সেবা প্রদানে সর্বদা প্রতিশ্রুতিবদ্ধ।”'}
                  </p>
                  <p className="font-normal text-justify sm:text-left text-stone-600">
                    {isEn
                      ? '“We do not merely teach computer applications; we build self-reliance and career confidence so our trainees can excel in both government and corporate sectors.”'
                      : '“আমরা শুধু কোর্স সম্পন্ন করাই না, বরং শিক্ষার্থীদের কর্মজীবনে প্রবেশের প্রয়োজনীয় আত্মবিশ্বাস ও দক্ষতা তৈরিতে সার্বক্ষণিক সহায়তা প্রদান করি।”'}
                  </p>
                </div>
              </div>
            </div>

            {/* Signature Bottom */}
            <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-stone-500 uppercase font-semibold">
                  {isEn ? 'Authorized Signature' : 'স্বাক্ষরিত'}
                </div>
                <div className="font-cinzel text-xs font-bold text-stone-800">
                  Md. Asaduzzaman
                </div>
              </div>
              <SignatureSvg className="text-stone-800 h-8" />
            </div>
          </div>


          {/* ========================================================================= */}
          {/* 2. RIGHT CARD: ASSISTANT DIRECTOR & TRAINER (ডানে সহকারী পরিচালক)          */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-xl transition-all duration-200 border-2 border-emerald-600/40 flex flex-col justify-between relative overflow-hidden">
            {/* Top Emerald Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-700" />

            <div>
              {/* Photo & Identity Header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 pb-5 border-b border-stone-100">
                <div className="relative shrink-0">
                  <div className="w-24 h-28 sm:w-26 sm:h-32 rounded-2xl overflow-hidden shadow-md border-2 border-emerald-500/80 p-0.5 bg-gradient-to-b from-emerald-100 to-emerald-50">
                    <img
                      src="/assets/aistudio/Passport_7df18c15.jpg"
                      alt="MD. ARIF HOSSAIN - Assistant Director & Trainer"
                      className="w-full h-full object-cover object-top rounded-xl"
                      loading="lazy"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-bold shadow-2xs">
                    {isEn ? 'Trainer' : 'প্রশিক্ষক'}
                  </span>
                </div>

                <div className="text-center sm:text-left min-w-0 flex-1">
                  <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-bold mb-1">
                    <Laptop className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isEn ? 'Office Application Lab' : 'কম্পিউটার ল্যাব'}</span>
                  </div>

                  {/* Name: Correctly switches to মোঃ আরিফ হোসাইন in Bangla, and MD. ARIF HOSSAIN in English */}
                  <h3 className="text-lg sm:text-xl font-bold font-serif-academic text-stone-900 leading-snug">
                    {isEn ? 'MD. ARIF HOSSAIN' : 'মোঃ আরিফ হোসাইন'}
                  </h3>

                  <div className="text-xs sm:text-sm font-bold text-emerald-800 mt-0.5">
                    {isEn ? 'Assistant Director & Trainer' : 'সহকারী পরিচালক ও প্রশিক্ষক'}
                  </div>

                  <div className="text-xs font-semibold text-stone-600 mt-0.5 leading-snug">
                    {isEn
                      ? 'Web Full Stack Developer & Computer Office Application Trainer'
                      : 'ওয়েব ফুল স্ট্যাক ডেভেলপার ও কম্পিউটার অফিস অ্যাপ্লিকেশন ট্রেইনার'}
                  </div>

                  {/* Assistant Director's Phone Number: 01864399871 */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                    <a
                      href="tel:01864399871"
                      className="inline-flex items-center space-x-1 text-xs text-emerald-900 hover:text-emerald-950 font-bold bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300 transition-colors shadow-2xs"
                      title="সহকারী পরিচালকের মোবাইল নম্বর"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>01864-399871</span>
                    </a>

                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                        MS Office
                      </span>
                      <span className="text-[10px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                        Typing Master
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message from Assistant Director (প্রশিক্ষণ সম্পর্কে বাণী - শুধু কম্পিউটার অফিস অ্যাপ্লিকেশন) */}
              <div className="pt-5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-stone-800 uppercase tracking-wider mb-2.5">
                  <Quote className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {isEn
                      ? 'Message on Computer Office Application Training:'
                      : 'কম্পিউটার অফিস অ্যাপ্লিকেশন প্রশিক্ষণ সম্পর্কে বাণী:'}
                  </span>
                </div>

                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200/80 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-2.5">
                  <p className="font-normal text-justify sm:text-left">
                    {isEn
                      ? '“Our ‘Computer Office Application’ (3 & 6 Months) course is conducted with 100% hands-on laboratory practice. We thoroughly guide students in MS Word drafting, complex Excel formulas & calculations, PowerPoint presentations, Access database management, and internet operations.”'
                      : '“আমাদের সেন্টারে ‘কম্পিউটার অফিস অ্যাপ্লিকেশন’ (৩ ও ৬ মাস মেয়াদী) কোর্সটি সম্পূর্ণ বাস্তবমুখী এবং হাতে-কলমে প্র্যাকটিক্যাল ল্যাবে শেখানো হয়। এতে এমএস ওয়ার্ডে ড্রাফটিং, এমএস এক্সেলে জটিল হিসাব ও ফর্মুলা, পাওয়ারপয়েন্টে প্রেজেন্টেশন, অ্যাক্সেস ডাটাবেজ এবং ইন্টারনেট প্রতিটি শিক্ষার্থীকে নিবিড় যত্নে শেখানো হয়।”'}
                  </p>
                  <p className="font-normal text-justify sm:text-left text-stone-600">
                    {isEn
                      ? '“Special focus is given to high-speed bilingual typing (Bijoy & Avro in Bangla, and touch-typing in English), guaranteeing that our students rank first in all government and corporate job practical tests.”'
                      : '“বিশেষ গুরুত্ব দেওয়া হয় দ্রুতগতির বাংলা (বিজয় ও অভ্র) এবং ইংরেজি নির্ভুল টাইপিংয়ের ওপর—যাতে সরকারি ও বেসরকারি যেকোনো চাকুরীর ব্যবহারিক পরীক্ষায় আমাদের শিক্ষার্থীরা শতভাগ সফল হতে পারে।”'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Credentials Footer */}
            <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
              <div className="flex items-center space-x-1 text-emerald-800 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {isEn ? '100% Practical Lab Training' : '১০০% বাস্তবমুখী ল্যাব প্রশিক্ষণ'}
                </span>
              </div>

              <div className="text-[11px] font-mono text-stone-500 font-medium">
                ACTC · Faculty
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
