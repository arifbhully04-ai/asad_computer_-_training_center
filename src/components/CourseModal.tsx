import React, { useEffect } from 'react';
import { X, Check, ArrowRight, Monitor, Award, Clock } from 'lucide-react';
import { BangladeshPostLogo } from './BangladeshPostLogo.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmission: () => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmission,
}) => {
  const { trans, t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-start sm:items-center justify-center p-3 sm:p-6 py-6 sm:py-10 bg-black/75 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-white shadow-2xl border border-stone-200 p-6 sm:p-8 my-auto transition-transform duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors p-1 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-stone-200 pb-4 mb-6">
          <div className="text-xs uppercase tracking-widest text-[#C5A880] font-cinzel font-semibold mb-1">
            {trans('Courses & Academic Programs', 'কোর্স ও একাডেমিক কার্যক্রম')}
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif-academic font-medium text-stone-900 tracking-tight">
            {trans('Available Courses', 'উপলব্ধ কোর্সসমূহ')}
          </h3>
        </div>

        {/* Course Card: Computer Office Application */}
        <div className="border-2 border-stone-800 p-6 bg-stone-50/60 hover:bg-stone-50 transition-colors relative group">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 bg-stone-900 text-[#C5A880] flex items-center justify-center shrink-0">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold">
                  <BangladeshPostLogo size={18} />
                  <span>{trans('Under Bangladesh Post Office', 'বাংলাদেশ ডাক বিভাগের আওতাধীন পরিচালিত')}</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-1">
                  {trans('Computer Office Application', 'কম্পিউটার অফিস অ্যাপ্লিকেশন')}
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{trans('Duration: 3 Months / 6 Months', 'মেয়াদ: ৩ মাস / ৬ মাস')}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{trans('Post Office Authorized IT Certificate', 'ডাক বিভাগ অনুমোদিত আইটি সনদপত্র')}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-5">
            {trans(
              'Comprehensive practical course covering Microsoft Word, Excel formulas & calculation, PowerPoint slide design, Access database, Internet browsing, Email communication, and high-speed English & Bengali typing.',
              'মাইক্রোসফট ওয়ার্ড, এক্সেল ফর্মুলা ও হিসাব, পাওয়ারপয়েন্ট স্লাইড ডিজাইন, অ্যাক্সেস ডাটাবেজ, ইন্টারনেট ব্রাউজিং, ইমেইল যোগাযোগ এবং দ্রুতগতির বাংলা ও ইংরেজি টাইপিংয়ের সম্পূর্ণ ব্যবহারিক কোর্স।'
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 mb-6 bg-white p-3.5 border border-stone-200">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{trans('Microsoft Word (Documentation)', 'মাইক্রোসফট ওয়ার্ড (ডকুমেন্ট তৈরি)')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{trans('Microsoft Excel (Spreadsheets & Formulas)', 'মাইক্রোসফট এক্সেল (স্প্রেডশিট ও ফর্মুলা)')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{trans('Microsoft PowerPoint (Presentations)', 'মাইক্রোসফট পাওয়ারপয়েন্ট (প্রেজেন্টেশন)')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{trans('Microsoft Access (Database Records)', 'মাইক্রোসফট অ্যাক্সেস (ডাটাবেজ ও রেকর্ড)')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{trans('Bangla (Bijoy & Avro) & English Typing', 'বাংলা (বিজয় ও অভ্র) এবং ইংরেজি টাইপিং')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{trans('Internet, Email & Online Job Forms', 'ইন্টারনেট ব্রাউজিং, ইমেইল ও চাকুরীর আবেদন')}</span>
            </div>
          </div>

          {/* Admission Trigger Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-200">
            <span className="text-xs text-stone-500 text-center sm:text-left">
              {trans('* Click below to open and fill out the Official Admission Form', '* অফিসিয়াল অনলাইন ভর্তি ফরম পূরণ করতে নিচের বাটনে ক্লিক করুন')}
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenAdmission();
              }}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 bg-[#C5A880] hover:bg-[#b0936b] text-stone-950 font-bold text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>{trans('Admission', 'ভর্তি')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

