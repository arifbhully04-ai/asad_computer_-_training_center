import React, { useEffect } from 'react';
import { X, Check, ArrowRight, Monitor, Award, Clock } from 'lucide-react';

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
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors p-1"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-stone-200 pb-4 mb-6">
          <div className="text-xs uppercase tracking-widest text-[#C5A880] font-cinzel font-semibold mb-1">
            Courses & Academic Programs
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif-academic font-medium text-stone-900 tracking-tight">
            Available Courses
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
                <span className="text-[11px] uppercase tracking-wider font-semibold text-sky-700">
                  Government Recognized IT Course
                </span>
                <h4 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight mt-0.5">
                  Computer Office Application
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Duration: 3 Months / 6 Months</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center space-x-1">
                    <Award className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Board Certified</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-5">
            Comprehensive practical course covering Microsoft Word, Excel formulas & calculation, PowerPoint slide design, Access database, Internet browsing, Email communication, and high-speed English & Bengali typing.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 mb-6 bg-white p-3.5 border border-stone-200">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Microsoft Word (Documentation)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Microsoft Excel (Spreadsheets & Formulas)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Microsoft PowerPoint (Presentations)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Microsoft Access (Database Records)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Bangla (Bijoy & Avro) & English Typing</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Internet, Email & Online Job Forms</span>
            </div>
          </div>

          {/* Admission Trigger Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-200">
            <span className="text-xs text-stone-500 text-center sm:text-left">
              * Click below to open and fill out the Official Admission Form
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenAdmission();
              }}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 bg-[#C5A880] hover:bg-[#b0936b] text-stone-950 font-bold text-xs uppercase tracking-widest transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>Admission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
