import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Quote,
  Star,
  CheckCircle,
  GraduationCap,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  Play,
  Pause,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { StudentTestimonial } from '../types.ts';

interface StudentTestimonialSectionProps {
  testimonials: StudentTestimonial[];
  onOpenAdmission?: () => void;
  onOpenCourseModal?: () => void;
}

export const StudentTestimonialSection: React.FC<StudentTestimonialSectionProps> = ({
  testimonials = [],
  onOpenAdmission,
  onOpenCourseModal,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [activeFilter, setActiveFilter] = useState<'all' | 'govt' | 'freelance'>('all');
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const isUserInteracting = useRef(false);

  const filteredTestimonials = testimonials.filter((t) => {
    if (activeFilter === 'govt') {
      return (
        t.roleEn.toLowerCase().includes('dc office') ||
        t.roleBn.includes('ডিসি') ||
        t.roleBn.includes('সরকারি') ||
        (t.workplaceBn && t.workplaceBn.includes('প্রশাসক'))
      );
    }
    if (activeFilter === 'freelance') {
      return (
        t.roleEn.toLowerCase().includes('freelancer') ||
        t.roleBn.includes('ফ্রিল্যান্সার') ||
        t.roleBn.includes('উদ্যোক্তা')
      );
    }
    return true;
  });

  // Calculate slide scroll distance based on card width
  const scrollToIndex = useCallback((index: number) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const cards = container.children;
    if (cards.length === 0) return;

    const targetCard = cards[Math.min(index, cards.length - 1)] as HTMLElement;
    if (targetCard) {
      const containerLeft = container.getBoundingClientRect().left;
      const cardLeft = targetCard.getBoundingClientRect().left;
      const offset = cardLeft - containerLeft + container.scrollLeft;

      container.scrollTo({
        left: offset,
        behavior: 'smooth',
      });
      setCurrentIndex(index);
    }
  }, []);

  const handlePrev = () => {
    if (filteredTestimonials.length === 0) return;
    const prev = currentIndex === 0 ? filteredTestimonials.length - 1 : currentIndex - 1;
    scrollToIndex(prev);
  };

  const handleNext = () => {
    if (filteredTestimonials.length === 0) return;
    const next = currentIndex >= filteredTestimonials.length - 1 ? 0 : currentIndex + 1;
    scrollToIndex(next);
  };

  // Auto sliding timer (Slides from left to right sequentially)
  useEffect(() => {
    if (isPaused || filteredTestimonials.length <= 1) return;

    const interval = setInterval(() => {
      if (isUserInteracting.current) return;
      setCurrentIndex((prev) => {
        const next = prev >= filteredTestimonials.length - 1 ? 0 : prev + 1;
        scrollToIndex(next);
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, filteredTestimonials.length, scrollToIndex]);

  // Update current active index on manual scroll/touch
  const handleScroll = () => {
    if (!sliderRef.current || filteredTestimonials.length === 0) return;
    const container = sliderRef.current;
    const cards = Array.from(container.children) as HTMLElement[];
    if (cards.length === 0) return;

    const containerCenter = container.scrollLeft + container.offsetWidth / 3;
    let closestIndex = 0;
    let minDiff = Infinity;

    cards.forEach((card, idx) => {
      const diff = Math.abs(card.offsetLeft - containerCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    if (closestIndex !== currentIndex) {
      setCurrentIndex(closestIndex);
    }
  };

  // Reset slider position when filter changes
  const handleFilterChange = (filter: 'all' | 'govt' | 'freelance') => {
    setActiveFilter(filter);
    setCurrentIndex(0);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  return (
    <section id="student-testimonials" className="py-16 sm:py-20 bg-gradient-to-b from-stone-50 via-white to-stone-100 border-t border-b border-stone-200/80 relative overflow-hidden font-bengali">
      {/* Decorative Background Ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-300/80 text-xs font-bold tracking-wide uppercase mb-3 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isEn ? 'Student Success Stories' : 'শিক্ষার্থীদের সাফল্যের গল্প'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
            {isEn ? (
              <>
                Real Experiences & Achievements of{' '}
                <span className="text-emerald-700 underline decoration-amber-400 decoration-wavy underline-offset-4">
                  Our Alumni
                </span>
              </>
            ) : (
              <>
                আসাদ কম্পিউটার সেন্টারের প্রাক্তন শিক্ষার্থীদের{' '}
                <span className="text-emerald-800 underline decoration-amber-500 decoration-wavy underline-offset-4">
                  সাফল্য ও অভিজ্ঞতা
                </span>
              </>
            )}
          </h2>

          <p className="mt-3.5 text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
            {isEn
              ? 'Discover how our certified Computer Office Application training and practical e-service mastery empowered students to excel in government examinations, corporate jobs, and freelancing.'
              : 'কম্পিউটার অফিস অ্যাপ্লিকেশন (৩ ও ৬ মাস) এবং প্র্যাকটিক্যাল টাইপিং ল্যাবে প্রশিক্ষণ নিয়ে কীভাবে শিক্ষার্থীরা সরকারি চাকরি, এনজিও ও অনলাইন ফ্রিল্যান্সিংয়ে এগিয়ে গেছে শুনুন তাদের মুখেই।'}
          </p>

          {/* Filter Pills & Interactive Slider Controls Header */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600/30'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {isEn ? 'All Stories' : 'সকল গল্প'} ({testimonials.length})
            </button>
            <button
              onClick={() => handleFilterChange('govt')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'govt'
                  ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600/30'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {isEn ? 'Govt & Office Jobs' : 'সরকারি ও অফিস জব'}
            </button>
            <button
              onClick={() => handleFilterChange('freelance')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'freelance'
                  ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600/30'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {isEn ? 'Freelancing & Entrepreneur' : 'ফ্রিল্যান্সার ও উদ্যোক্তা'}
            </button>
          </div>
        </div>

        {/* Single Line Slider Controls Ribbon */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition cursor-pointer border border-stone-200"
              title={isPaused ? (isEn ? 'Resume auto slide' : 'স্লাইড চালু করুন') : (isEn ? 'Pause slide' : 'স্লাইড থামান')}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-700 fill-emerald-700" />
                  <span>{isEn ? 'Play Slide' : 'স্লাইড চালু'}</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
                  <span>{isEn ? 'Pause' : 'থামান'}</span>
                </>
              )}
            </button>

            <span className="text-[11px] text-stone-500 hidden sm:inline-block">
              {isEn
                ? '• Auto-sliding left-to-right (Hover to pause)'
                : '• এক লাইনে বাম থেকে ডানে স্লাইড হচ্ছে (কার্ডে মাউস রাখলে থামবে)'}
            </span>
          </div>

          {/* Left & Right Slide Arrows */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              aria-label="Previous Review"
              className="w-9 h-9 rounded-full bg-white border border-stone-300 shadow-xs hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-400 flex items-center justify-center text-stone-700 transition cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Review"
              className="w-9 h-9 rounded-full bg-white border border-stone-300 shadow-xs hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-400 flex items-center justify-center text-stone-700 transition cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Testimonial Single-Line Horizontal Carousel Track */}
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          onMouseEnter={() => {
            setIsPaused(true);
            isUserInteracting.current = true;
          }}
          onMouseLeave={() => {
            setIsPaused(false);
            isUserInteracting.current = false;
          }}
          onTouchStart={() => {
            isUserInteracting.current = true;
          }}
          onTouchEnd={() => {
            setTimeout(() => {
              isUserInteracting.current = false;
            }, 1000);
          }}
          className="flex flex-nowrap overflow-x-auto no-scrollbar scroll-smooth gap-5 sm:gap-6 py-4 px-1 -mx-1"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {filteredTestimonials.map((item, idx) => (
            <div
              key={item.id}
              style={{ scrollSnapAlign: 'start' }}
              className="w-[300px] sm:w-[380px] md:w-[420px] shrink-0 bg-white rounded-2xl border border-stone-200 shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between relative group hover:-translate-y-1 select-none"
            >
              {/* Corner Accent Quote Mark */}
              <div className="absolute top-5 right-5 text-emerald-100 group-hover:text-emerald-200 transition-colors pointer-events-none">
                <Quote className="w-10 h-10" />
              </div>

              <div>
                {/* Rating Stars & Batch Badge */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center space-x-1">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-stone-700 ml-1.5">5.0</span>
                  </div>

                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200">
                    <GraduationCap className="w-3 h-3 text-emerald-700" />
                    <span>{isEn ? item.batchEn : item.batchBn}</span>
                  </span>
                </div>

                {/* Testimonial Narrative Quote */}
                <p className="text-stone-700 text-sm leading-relaxed italic relative z-10 font-medium mb-6 min-h-[96px] line-clamp-4">
                  "{isEn ? item.storyEn : item.storyBn}"
                </p>
              </div>

              {/* Bottom Student Profile Row */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Monogram Badge Avatar */}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-700 to-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-emerald-100 shrink-0">
                    {item.nameEn ? item.nameEn.charAt(0).toUpperCase() : 'S'}
                  </div>

                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-bold text-stone-900 text-sm leading-tight">
                        {isEn ? item.nameEn : item.nameBn}
                      </h4>
                      <span title="Verified ACTC Graduate">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-emerald-800 mt-0.5 flex items-center space-x-1">
                      <Briefcase className="w-3 h-3 shrink-0" />
                      <span>{isEn ? item.roleEn : item.roleBn}</span>
                    </p>

                    {(item.workplaceBn || item.workplaceEn) && (
                      <p className="text-[11px] text-stone-500 mt-0.5 flex items-center space-x-1">
                        <Building2 className="w-2.5 h-2.5 text-stone-400 shrink-0" />
                        <span className="truncate max-w-[170px] sm:max-w-[220px]">
                          {isEn ? item.workplaceEn || item.workplaceBn : item.workplaceBn || item.workplaceEn}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Course Pill */}
                <div className="text-right shrink-0 ml-2">
                  <span className="text-[9px] font-bold text-stone-500 block uppercase tracking-wide">
                    {isEn ? 'Course' : 'কোর্স'}
                  </span>
                  <span className="text-[11px] font-bold text-stone-800 max-w-[100px] truncate block">
                    {isEn ? item.courseEn : item.courseBn}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Pagination Dots */}
        {filteredTestimonials.length > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-4 mb-8">
            {filteredTestimonials.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => scrollToIndex(dotIdx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === dotIdx
                    ? 'w-7 h-2.5 bg-emerald-700'
                    : 'w-2.5 h-2.5 bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Center Stats Ribbon */}
        <div className="mt-8 bg-white rounded-2xl border border-stone-200/90 shadow-md p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-stone-200">
            <div className="pt-2 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800">১,৫০০+</div>
              <div className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">
                {isEn ? 'Successful Graduates' : 'সফল শিক্ষার্থী'}
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">১০০%</div>
              <div className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">
                {isEn ? 'Practical Lab Training' : 'হাতে-কলমে ল্যাব ক্লাস'}
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">ডাক বিভাগ</div>
              <div className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">
                {isEn ? 'Post Office Affiliation' : 'অনুমোদিত সনদপত্র'}
              </div>
            </div>

            <div className="pt-4 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-700">৭ দিন</div>
              <div className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">
                {isEn ? 'Open All Week' : 'সপ্তাহে ৭ দিন খোলা'}
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 text-xs text-amber-300 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEn ? 'Next Batch Enrollment Ongoing' : 'পরবর্তী ব্যাচে ভর্তি চলছে'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {isEn
                ? 'Ready to build your digital career with certified training?'
                : 'আপনিও কি কম্পিউটার ও ডিজিটাল দক্ষতায় নিজের ক্যারিয়ার গড়তে প্রস্তুত?'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1">
              {isEn
                ? 'Join our next batch of Computer Office Application at Bottola, Bhully Bazar, Thakurgaon.'
                : 'বটতলী, ভুল্লী বাজার, ঠাকুরগাঁওয়ে আসুন অথবা অনলাইনে এখনই ভর্তি ফরম পূরণ করুন।'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            {onOpenAdmission && (
              <button
                onClick={onOpenAdmission}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                {isEn ? 'Fill Admission Form' : 'অনলাইনে ভর্তি ফরম পূরণ'}
              </button>
            )}

            {onOpenCourseModal && (
              <button
                onClick={onOpenCourseModal}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/30 transition-all cursor-pointer"
              >
                {isEn ? 'Course Details' : 'কোর্সের বিস্তারিত'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
