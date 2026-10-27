import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SlideData } from '../types.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface HeroSliderProps {
  onCtaClick: (type: 'programs' | 'learn-more', slide: SlideData) => void;
}

const baseSlides = [
  {
    id: 1,
    titleEn: 'Asad Computer & Training Center',
    titleBn: 'আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টার',
    subtitleEn:
      'Empowering students and job seekers with essential computer literacy, certified practical office skills, and end-to-end online document submission services.',
    subtitleBn:
      'শিক্ষার্থী ও চাকুরিপ্রার্থীদের জন্য প্রয়োজনীয় কম্পিউটার সাক্ষরতা, অনুমোদিত ব্যবহারিক অফিস দক্ষতা এবং নির্ভরযোগ্য অনলাইন আবেদন সেবা।',
    primaryCtaEn: 'EXPLORE COURSES',
    primaryCtaBn: 'কোর্সসমূহ দেখুন',
    secondaryCtaEn: 'ONLINE SERVICES',
    secondaryCtaBn: 'অনলাইন সেবা',
    image: '/src/assets/images/computer_training_lab_1792824307233.jpg',
  },
  {
    id: 2,
    titleEn: 'Computer Office Application Course',
    titleBn: 'কম্পিউটার অফিস অ্যাপ্লিকেশন কোর্স',
    subtitleEn:
      'Master MS Word, Excel, PowerPoint, Access, Internet browsing, and high-speed typing at Asad Computer & Training Center. Comprehensive 3-month and 6-month certified courses.',
    subtitleBn:
      'এমএস ওয়ার্ড, এক্সেল, পাওয়ারপয়েন্ট, অ্যাক্সেস, ইন্টারনেট ও দ্রুতগতির টাইপিং শিখুন আসাদ কম্পিউটার ট্রেনিং সেন্টারে। ৩ মাস ও ৬ মাস মেয়াদী অনুমোদিত কোর্স।',
    primaryCtaEn: 'ENROLL IN COURSE',
    primaryCtaBn: 'কোর্সে ভর্তি হন',
    secondaryCtaEn: 'COURSE SYLLABUS',
    secondaryCtaBn: 'কোর্স সিলেবাস',
    image: '/src/assets/images/computer_training_lab_1792824307233.jpg',
  },
  {
    id: 3,
    titleEn: 'All Online Application & Digital Services',
    titleBn: 'সকল অনলাইন আবেদন ও ডিজিটাল সেবা',
    subtitleEn:
      'Fast, accurate, and hassle-free online application services for government and private jobs, university & college admissions, passport, NID, and digital certificates.',
    subtitleBn:
      'সরকারি-বেসরকারি চাকরি, বিশ্ববিদ্যালয় ও কলেজ ভর্তি, পাসপোর্ট, এনআইডি ও ডিজিটাল সনদের দ্রুত ও নির্ভুল অনলাইন আবেদন সেবা।',
    primaryCtaEn: 'APPLY ONLINE',
    primaryCtaBn: 'অনলাইন আবেদন',
    secondaryCtaEn: 'VIEW ALL SERVICES',
    secondaryCtaBn: 'সকল সেবা দেখুন',
    image: '/src/assets/images/online_service_desk_1792824307618.jpg',
  },
];

export const HeroSlider: React.FC<HeroSliderProps> = ({ onCtaClick }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { language } = useLanguage();

  const slides: SlideData[] = baseSlides.map((s) => ({
    id: s.id,
    title: language === 'bn' ? s.titleBn : s.titleEn,
    subtitle: language === 'bn' ? s.subtitleBn : s.subtitleEn,
    primaryCta: language === 'bn' ? s.primaryCtaBn : s.primaryCtaEn,
    secondaryCta: language === 'bn' ? s.secondaryCtaBn : s.secondaryCtaEn,
    image: s.image,
  }));


  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(timer);
  }, [currentSlideIndex]);

  const currentSlide = slides[currentSlideIndex];

  return (
    <section className="relative w-full h-[620px] sm:h-[680px] lg:h-[760px] flex items-center justify-center overflow-hidden bg-stone-900">
      {/* Background Image with smooth transition */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentSlide.image}
          alt={currentSlide.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.62] contrast-[1.08] transition-all duration-700 ease-out"
        />
        {/* Darkening Scrim Overlays for legibility */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/55" />
      </div>

      {/* Left Navigation Arrow */}
      <div className="absolute left-4 sm:left-8 lg:left-12 z-20">
        <button
          onClick={prevSlide}
          className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-white/35 bg-black/25 hover:bg-black/45 hover:border-white text-white/80 hover:text-white transition-all duration-200 backdrop-blur-xs group"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
        </button>
      </div>

      {/* Right Navigation Arrow */}
      <div className="absolute right-4 sm:right-8 lg:right-12 z-20">
        <button
          onClick={nextSlide}
          className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-white/35 bg-black/25 hover:bg-black/45 hover:border-white text-white/80 hover:text-white transition-all duration-200 backdrop-blur-xs group"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Centered Hero Content Block */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center flex flex-col items-center pt-16 sm:pt-20">
        
        {/* Main Headline */}
        <h1
          key={`title-${currentSlide.id}`}
          className="text-3xl sm:text-5xl lg:text-[54px] font-serif-academic font-medium text-white tracking-tight leading-[1.18] max-w-3xl drop-shadow-md animate-in fade-in zoom-in-95 duration-500"
          style={{ textWrap: 'balance' }}
        >
          {currentSlide.title}
        </h1>

        {/* Subtitle / Paragraph */}
        <p
          key={`subtitle-${currentSlide.id}`}
          className="mt-5 sm:mt-6 text-white/90 text-sm sm:text-base lg:text-[17px] font-light leading-relaxed max-w-2xl text-center drop-shadow-sm animate-in fade-in duration-700"
        >
          {currentSlide.subtitle}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full sm:w-auto">
          {/* Primary CTA (Camel / Gold) */}
          <button
            onClick={() => onCtaClick('programs', currentSlide)}
            className="w-full sm:w-auto px-8 sm:px-9 py-3.5 bg-[#C5A880] hover:bg-[#b0936b] text-white text-xs sm:text-[13px] font-medium tracking-[0.2em] uppercase transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
          >
            {currentSlide.primaryCta}
          </button>

          {/* Secondary CTA (White Outline) */}
          <button
            onClick={() => onCtaClick('learn-more', currentSlide)}
            className="w-full sm:w-auto px-8 sm:px-9 py-3.5 bg-transparent hover:bg-white/10 text-white border border-white/80 hover:border-white text-xs sm:text-[13px] font-medium tracking-[0.2em] uppercase transition-all duration-200 active:scale-[0.99] cursor-pointer"
          >
            {currentSlide.secondaryCta}
          </button>
        </div>

        {/* Pagination Indicators below buttons */}
        <div className="mt-10 sm:mt-12 flex items-center justify-center space-x-2">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`transition-all duration-300 rounded-full h-1.5 ${
                idx === currentSlideIndex
                  ? 'w-7 bg-white'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
