import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Briefcase,
  ShieldCheck,
  Search,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';

export interface FAQItem {
  id: string;
  category: 'training' | 'services' | 'security';
  questionBn: string;
  questionEn: string;
  answerBn: string;
  answerEn: string;
  highlights?: string[];
}

export interface FAQSectionProps {
  onOpenCourseModal?: () => void;
  onOpenAdmission?: () => void;
  onOpenJobPortal?: () => void;
  onContactClick?: () => void;
  defaultOpen?: boolean;
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'training',
    questionBn: 'আসাদ কম্পিউটার সেন্টারে কোন কোন কোর্স করানো হয় এবং সেন্টারটি কার অধীনে পরিচালিত?',
    questionEn: 'Which courses are offered at Asad Computer & Training Center and under which authority does it operate?',
    answerBn:
      'আমাদের ট্রেনিং সেন্টারটি বাংলাদেশ ডাক বিভাগের আওতাধীন পরিচালিত (কারিগরি শিক্ষা বোর্ডের আওতায় নয়)। এখানে ৩ মাস (৩৬০ ঘণ্টা) এবং ৬ মাস (৩৬০/৭২০ ঘণ্টা) মেয়াদী "কম্পিউটার অফিস অ্যাপ্লিকেশন" (Computer Office Application) কোর্স বাস্তবমুখী ল্যাবে করানো হয়। এতে এমএস ওয়ার্ড, এমএস এক্সেল, পাওয়ারপয়েন্ট, অ্যাক্সেস, ইন্টারনেট ব্রাউজিং এবং বাংলা-ইংরেজি দ্রুত টাইপিং শেখানো হয়।',
    answerEn:
      'Our training center operates under the Bangladesh Post Office (not under the Technical Education Board). We offer 3-month and 6-month certified "Computer Office Application" courses covering MS Word, MS Excel, PowerPoint, Access, internet fundamentals, and high-speed Bangla and English typing.',
    highlights: [
      'বাংলাদেশ ডাক বিভাগের আওতায় পরিচালিত',
      '৩ মাস ও ৬ মাস মেয়াদী কম্পিউটার অফিস অ্যাপ্লিকেশন',
      '১০০% প্র্যাকটিক্যাল ল্যাব ও কম্পিউটার সুবিধা',
    ],
  },
  {
    id: 'faq-2',
    category: 'training',
    questionBn: 'কোর্স সম্পন্ন করার পর কি সনদপত্র (Certificate) পাওয়া যাবে?',
    questionEn: 'Will I receive a valid certificate after completing the course?',
    answerBn:
      'হ্যাঁ, কোর্স সমাপ্তির পর আমাদের ট্রেনিং সেন্টার থেকে বাংলাদেশ ডাক বিভাগের আওতায় অনুমোদিত প্রফেশনাল কম্পিউটার সার্টিফিকেট প্রদান করা হয়। এই সনদপত্রটি শিক্ষার্থী ও চাকুরী প্রার্থীদের কম্পিউটার দক্ষতা প্রমাণের জন্য সকল সরকারি ও বেসরকারি চাকুরীর আবেদনের ক্ষেত্রে সরাসরি গ্রহণযোগ্য।',
    answerEn:
      'Yes, upon successful course completion, students receive an authorized certificate under the Bangladesh Post Office, fully recognized to certify computer proficiency for all government and private job applications.',
    highlights: [
      'বাংলাদেশ ডাক বিভাগ অনুমোদিত সনদপত্র',
      'সরকারি ও বেসরকারি চাকুরীর আবেদনে সরাসরি গ্রহণযোগ্য',
    ],
  },
  {
    id: 'faq-3',
    category: 'training',
    questionBn: 'চাকুরিজীবী বা কলেজ শিক্ষার্থীদের জন্য বিশেষ কোনো ব্যাচ আছে কি?',
    questionEn: 'Are there special morning or evening shifts for job holders and college students?',
    answerBn:
      'হ্যাঁ, আমাদের প্রতিষ্ঠানে সকালের শিফট (সকাল ৮:০০ - ১০:০০) এবং সন্ধ্যার শিফট (সন্ধ্যা ৬:০০ - রাত ৮:০০) সহ একাধিক সুবিধাজনক ব্যাচ রয়েছে। ফলে কলেজ শিক্ষার্থী ও চাকুরিজীবীরা তাদের সুবিধাজনক সময়ে নিয়মিত প্র্যাকটিস করতে পারেন।',
    answerEn:
      'Yes, we provide flexible morning (8:00 AM - 10:00 AM) and evening (6:00 PM - 8:00 PM) batches suited for working professionals and university/college students.',
    highlights: [
      'সকাল ও সান্ধ্যকালীন নমনীয় শিফট',
      'ছুটির দিনে অতিরিক্ত ল্যাব প্র্যাকটিস সুবিধা',
    ],
  },
  {
    id: 'faq-4',
    category: 'services',
    questionBn: 'অনলাইন সার্ভিস ডেস্কে কোন কোন সেবা পাওয়া যায়?',
    questionEn: 'What online citizen and job application services are available?',
    answerBn:
      'আমাদের সার্ভিস ডেস্কে প্রাথমিক শিক্ষক নিয়োগ, বাংলাদেশ রেলওয়ে, মন্ত্রণালয় ও অধিদপ্তরের সরকারি চাকুরীর নির্ভুল অনলাইন আবেদন, ছবি ও স্বাক্ষর রিসাইজ, টেলিটক বা মোবাইল ব্যাংকিং ফি পেমেন্ট, প্রবেশপত্র ডাউনলোড, কলেজ ও বিশ্ববিদ্যালয় ভর্তি আবেদন এবং যাবতীয় ডিজিটাল ফরম পূরণ করা হয়।',
    answerEn:
      'We handle government and private job applications (DPE, Railway, Ministries, PSC), photo/signature standard resizing, fee payments, admit card downloads, and university admissions.',
    highlights: [
      'নির্ভুল অনলাইন ফরম পূরণ ও ফি প্রদান',
      'রঙিন এপ্লিকেন্ট কপি ও প্রবেশপত্র প্রিন্ট',
    ],
  },
  {
    id: 'faq-5',
    category: 'services',
    questionBn: 'চাকুরীর আবেদন করার পর স্ট্যাটাস কখন "সম্পন্ন" দেখাবে?',
    questionEn: 'When does the application status change from "Processing" to "Completed"?',
    answerBn:
      'আবেদন করার সাথে সাথে পোর্টালে স্ট্যাটাসটি "প্রক্রিয়াধীন (Processing)" হিসেবে প্রদর্শিত হবে। আমাদের এডমিন বা সার্ভিস ডেস্ক টিম তথ্য ও পেমেন্ট যাচাই করে অনুমোদন করলেই স্ট্যাটাসটি "আবেদন সম্পন্ন (Completed)" হিসেবে পরিবর্তিত হবে এবং প্রবেশপত্র ডাউনলোড অপশন কার্যকর হবে।',
    answerEn:
      'Immediately upon submission, the status is marked as "Processing". Once our institute team reviews and verifies the application details and fee, the status is updated to "Completed", unlocking admit card download.',
    highlights: [
      'আবেদনের সাথে সাথে "প্রক্রিয়াধীন" স্ট্যাটাস',
      'এডমিন অনুমোদনের পর সাথে সাথে "সম্পন্ন"',
    ],
  },
  {
    id: 'faq-6',
    category: 'security',
    questionBn: 'ওয়েবসাইট রিলোড বা আপডেট হলে আমার আইডি, পাসওয়ার্ড ও প্রোফাইল কি মুছে যাবে?',
    questionEn: 'Will my user ID, password, or profile be deleted if the website is refreshed or updated?',
    answerBn:
      'না, কোনোভাবেই মুছে যাবে না! আমাদের সিস্টেমে মাল্টি-কী পার্মানেন্ট স্টোরেজ সিঙ্ক ব্যবহৃত হওয়ায় ওয়েবসাইট যতবারই রিলোড, আপডেট বা ডিপ্লয় করা হোক না কেন—সকল প্রার্থীর ইউজার আইডি, পাসওয়ার্ড এবং বায়োডাটা সম্পূর্ণ সুরক্ষিত ও অক্ষত থাকবে। এডমিন যেকোনো সময় সেন্ট্রাল ব্যাকআপও সংরক্ষণ করতে পারেন।',
    answerEn:
      'No! Our multi-key persistent storage system guarantees that your User ID, password, and complete bio-data remain 100% saved across website updates, page refreshes, and browser restarts.',
    highlights: [
      '১০০% পার্মানেন্ট ডেটা স্টোরেজ গ্যারান্টি',
      'অ্যাডভান্সড ডাটাবেজ ব্যাকআপ ও রিস্টোর ভল্ট',
    ],
  },
  {
    id: 'faq-7',
    category: 'services',
    questionBn: 'ভুল তথ্য বা আবেদনের ছবি/স্বাক্ষর কি পরবর্তীতে পরিবর্তন করা সম্ভব?',
    questionEn: 'Can I edit my bio-data, photo, or signature after submission?',
    answerBn:
      'হ্যাঁ, আপনার প্রার্থীর ড্যাশবোর্ডে লগইন করে যেকোনো সময় আপনার বায়োডাটা, শিক্ষাগত যোগ্যতা, ঠিকানা ও ছবি-স্বাক্ষর আপডেট করতে পারেন। এছাড়া সেন্টারে এসে এডমিন ডেস্কেও সরাসরি তথ্য সংশোধন করে তাৎক্ষণিক নতুন কপি প্রিন্ট করে নিতে পারেন।',
    answerEn:
      'Yes, by logging into your applicant portal, you can update your bio-data, educational records, address, and uploaded documents, or visit our service desk for instant revisions.',
    highlights: [
      'প্রোফাইল থেকে সরাসরি তথ্য এডিট',
      'ইনস্টিটিউট ডেস্কে লাইভ সংশোধন সুবিধা',
    ],
  },
  {
    id: 'faq-8',
    category: 'security',
    questionBn: 'পাসওয়ার্ড ভুলে গেলে করণীয় কী?',
    questionEn: 'What should I do if I forget my login password?',
    answerBn:
      'যদি আপনি পাসওয়ার্ড ভুলে যান, আপনার মোবাইল নম্বর বা রোল নম্বর নিয়ে আমাদের ট্রেনিং সেন্টারে যোগাযোগ করুন অথবা এডমিন ড্যাশবোর্ডের "আইডি ও পাসওয়ার্ড ভল্ট" থেকে এডমিন আপনার পাসওয়ার্ড তাৎক্ষণিক যাচাই বা রিসেট করে দিতে পারবেন।',
    answerEn:
      'If you forget your password, you can visit our training center with your registered phone number or roll number. Our administrator can instantly verify or reset your credentials from the secure Vault.',
    highlights: [
      'মোবাইল নম্বর দিয়ে তাৎক্ষণিক ভেরিফিকেশন',
      'এডমিন ভল্ট থেকে পাসওয়ার্ড রিকভারি',
    ],
  },
];

export const FAQSection: React.FC<FAQSectionProps> = ({
  onOpenCourseModal,
  onOpenAdmission,
  onOpenJobPortal,
  onContactClick,
  defaultOpen = false,
}) => {
  // CRITICAL REQUIREMENT: By default it is NOT shown ("সাধারণ জিজ্ঞাসা ও উত্তর · FAQ তে ক্লিক দিলে তবেই দেখাবে নয়তো দেখাবেনা")
  const [isSectionOpen, setIsSectionOpen] = useState(defaultOpen);
  const [activeCategory, setActiveCategory] = useState<'all' | 'training' | 'services' | 'security'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<{ [id: string]: boolean }>({
    'faq-1': true,
    'faq-5': true,
  });

  // Automatically expand if navigated via hash link #faq-section
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#faq-section') {
        setIsSectionOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.questionBn.toLowerCase().includes(q) ||
      item.questionEn.toLowerCase().includes(q) ||
      item.answerBn.toLowerCase().includes(q) ||
      item.answerEn.toLowerCase().includes(q) ||
      (item.highlights && item.highlights.some((h) => h.toLowerCase().includes(q)))
    );
  });

  return (
    <section id="faq-section" className="bg-[#fbfbfb] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-stone-200/80 transition-all duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* Clickable Header Banner: Clicking this toggles FAQ visibility */}
        <div
          onClick={() => setIsSectionOpen(!isSectionOpen)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsSectionOpen(!isSectionOpen);
            }
          }}
          className={`group w-full p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer text-left select-none ${
            isSectionOpen
              ? 'bg-gradient-to-r from-amber-500/10 via-white to-amber-500/15 border-amber-400 shadow-md ring-2 ring-amber-400/20'
              : 'bg-white hover:bg-stone-50 border-stone-200 shadow-xs hover:shadow-md hover:border-amber-300'
          }`}
          title="সাধারণ জিজ্ঞাসা ও উত্তর · FAQ দেখতে বা লুকানোর জন্য ক্লিক করুন"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-3.5 sm:space-x-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                  isSectionOpen
                    ? 'bg-amber-500 text-stone-950 shadow-md rotate-12'
                    : 'bg-amber-100/80 text-amber-900 group-hover:bg-amber-200/80'
                }`}
              >
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-900 border border-amber-500/30">
                    সাধারণ জিজ্ঞাসা ও উত্তর · FAQ
                  </span>
                  <span className="text-[11px] text-stone-400 font-mono">
                    ({FAQ_DATA.length} টি প্রশ্নোত্তর)
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 mt-1.5 group-hover:text-amber-900 transition-colors">
                  সাধারণ জিজ্ঞাসা ও উত্তর · FAQ
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {isSectionOpen
                    ? 'প্রশ্নোত্তর লুকানোর জন্য এখানে ক্লিক করুন।'
                    : 'কোর্স, সার্টিফিকেট, চাকুরীর আবেদন ও ইউজার আইডি সংক্রান্ত সাধারণ প্রশ্নাবলী দেখতে ক্লিক করুন।'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
              <span
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  isSectionOpen
                    ? 'bg-stone-900 text-white shadow-xs hover:bg-stone-800'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 shadow-xs'
                }`}
              >
                <span>{isSectionOpen ? 'প্রশ্নোত্তর বন্ধ করুন (Hide FAQ)' : 'প্রশ্নোত্তর দেখুন (Click to View FAQ)'}</span>
                {isSectionOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4 animate-bounce" />
                )}
              </span>
            </div>
          </div>
        </div>

        {/* ONLY DISPLAYED WHEN CLICKED (নয়তো দেখাবেনা) */}
        {isSectionOpen && (
          <div className="mt-8 pt-6 border-t border-stone-200/60 animate-in fade-in slide-in-from-top-3 duration-300">
            {/* Expanded Header Note */}
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-serif-academic text-stone-900 font-bold tracking-tight">
                সচরাচর জিজ্ঞাসিত প্রশ্নাবলী
              </h2>
              <p className="text-stone-500 text-xs sm:text-sm mt-2 max-w-xl mx-auto leading-relaxed">
                বাংলাদেশ ডাক বিভাগের আওতাধীন কম্পিউটার কোর্স, সনদপত্র, সরকারি চাকুরীর অনলাইন আবেদন এবং আইডি-পাসওয়ার্ড সুরক্ষা সম্পর্কিত গুরুত্বপূর্ণ তথ্যসমূহ।
              </p>

              {/* Quick Search Input */}
              <div className="mt-5 max-w-lg mx-auto relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="প্রশ্ন খুঁজুন (যেমন: কোর্স, সার্টিফিকেট, আবেদন, পাসওয়ার্ড)..."
                  className="w-full bg-white rounded-full py-2.5 pl-11 pr-4 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 shadow-xs border border-stone-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-stone-400 hover:text-stone-600 text-xs absolute right-4 top-1/2 -translate-y-1/2 px-1"
                  >
                    মুছুন
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    activeCategory === 'all'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  সকল প্রশ্ন ({FAQ_DATA.length})
                </button>
                <button
                  onClick={() => setActiveCategory('training')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    activeCategory === 'training'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-blue-50 border border-stone-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>কম্পিউটার কোর্স ও সার্টিফিকেট</span>
                </button>
                <button
                  onClick={() => setActiveCategory('services')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    activeCategory === 'services'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-emerald-50 border border-stone-200'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>চাকুরীর আবেদন ও ই-সার্ভিস</span>
                </button>
                <button
                  onClick={() => setActiveCategory('security')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    activeCategory === 'security'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-stone-600 hover:bg-amber-50 border border-stone-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>আইডি ও পাসওয়ার্ড সুরক্ষা</span>
                </button>
              </div>
            </div>

            {/* FAQ Accordion List */}
            <div className="space-y-3 max-w-4xl mx-auto">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const isOpen = !!openItems[faq.id];

                  return (
                    <div
                      key={faq.id}
                      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? 'border-amber-300 shadow-md ring-1 ring-amber-400/20'
                          : 'border-stone-200/90 shadow-2xs hover:border-stone-300'
                      }`}
                    >
                      {/* Header / Question Button */}
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              faq.category === 'training'
                                ? 'bg-blue-50 text-blue-700'
                                : faq.category === 'services'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {faq.category === 'training' ? (
                              <BookOpen className="w-4 h-4" />
                            ) : faq.category === 'services' ? (
                              <Briefcase className="w-4 h-4" />
                            ) : (
                              <ShieldCheck className="w-4 h-4" />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  faq.category === 'training'
                                    ? 'bg-blue-100 text-blue-800'
                                    : faq.category === 'services'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {faq.category === 'training'
                                  ? 'কোর্স'
                                  : faq.category === 'services'
                                  ? 'অনলাইন সার্ভিস'
                                  : 'আইডি ও পাসওয়ার্ড'}
                              </span>
                            </div>
                            <h3 className="font-semibold text-stone-900 text-sm sm:text-base mt-1.5 leading-snug">
                              {faq.questionBn}
                            </h3>
                            <p className="text-[11px] text-stone-400 font-sans mt-0.5">
                              {faq.questionEn}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-1 transition-transform ${
                            isOpen ? 'bg-amber-100 text-amber-900 rotate-180' : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </button>

                      {/* Body / Answer */}
                      {isOpen && (
                        <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-1 border-t border-stone-100 text-xs sm:text-sm text-stone-600 leading-relaxed space-y-3 animate-in fade-in duration-200">
                          <p className="font-normal text-stone-700 leading-relaxed text-justify sm:text-left">
                            {faq.answerBn}
                          </p>

                          <p className="text-[11px] text-stone-400 italic">
                            {faq.answerEn}
                          </p>

                          {/* Highlight Bullets */}
                          {faq.highlights && faq.highlights.length > 0 && (
                            <div className="pt-2 flex flex-wrap gap-2">
                              {faq.highlights.map((h, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200 text-stone-700 text-[11px] font-medium"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  <span>{h}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-stone-300 p-6">
                  <HelpCircle className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-stone-700">কোনো প্রশ্ন পাওয়া যায়নি</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="mt-3 text-xs font-bold text-amber-700 hover:underline cursor-pointer"
                  >
                    সকল প্রশ্ন প্রদর্শন করুন
                  </button>
                </div>
              )}
            </div>

            {/* Bottom CTA Banner inside FAQ */}
            <div className="mt-10 bg-gradient-to-r from-stone-900 via-[#182035] to-stone-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center md:text-left">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                  আরো কিছু জানতে চান?
                </span>
                <h4 className="text-lg sm:text-xl font-bold text-white">
                  সরাসরি আমাদের সেন্টারে আসুন অথবা অনলাইনে যোগাযোগ করুন
                </h4>
                <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
                  বটতলী, ভুল্লী বাজার, ভুল্লী, ঠাকুরগাঁও। প্রতিদিন সকাল ৮:০০টা থেকে রাত ৮:০০টা পর্যন্ত খোলা।
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                {onOpenAdmission && (
                  <button
                    onClick={onOpenAdmission}
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    ভর্তি ফরম পূরণ করুন
                  </button>
                )}

                {onOpenJobPortal && (
                  <button
                    onClick={onOpenJobPortal}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all cursor-pointer"
                  >
                    চাকুরীর সার্কুলার পোর্টাল
                  </button>
                )}

                <a
                  href="tel:01773733654"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center space-x-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>০১৭৭৩-৭৩৩৬৫৪</span>
                </a>
              </div>
            </div>

            {/* Bottom Collapse Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => {
                  setIsSectionOpen(false);
                  const el = document.getElementById('faq-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                <ChevronUp className="w-4 h-4" />
                <span>প্রশ্নোত্তর বন্ধ করুন (Hide FAQ)</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
