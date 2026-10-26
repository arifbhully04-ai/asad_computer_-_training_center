import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Briefcase,
  AlertCircle,
  FileCheck,
  Send,
  Building,
  UserCheck,
} from 'lucide-react';
import { ApplicantAccount } from '../types.ts';

interface ApplicationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  circularTitle: string;
  applicant: ApplicantAccount;
  onSubmitApplication: (postName: string, circularTitle: string) => void;
}

const COMMON_POST_SUGGESTIONS = [
  'কম্পিউটার অপারেটর',
  'অফিস সহকারী কাম কম্পিউটার মুদ্রাক্ষরিক',
  'ডাটা এন্ট্রি অপারেটর',
  'সহকারী শিক্ষক',
  'হিসাব সহকারী',
  'অফিস সহায়ক',
];

export const ApplicationPermissionModal: React.FC<ApplicationPermissionModalProps> = ({
  isOpen,
  onClose,
  circularTitle,
  applicant,
  onSubmitApplication,
}) => {
  const [willApply, setWillApply] = useState<boolean>(true);
  const [postName, setPostName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setWillApply(true);
      setPostName('');
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen, circularTitle]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!willApply) {
      onClose();
      return;
    }

    if (!postName.trim()) {
      setError('অনুগ্রহ করে কোন পদে আবেদন করবেন তার নাম লিখুন।');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitApplication(postName.trim(), circularTitle);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-70 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#161a2b] text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white tracking-wide">
                চাকুরীর সার্কুলারে আবেদন নিশ্চিতকরণ
              </h3>
              <p className="text-[11px] text-stone-300">
                Asad Computer & Training Center · অনলাইন আবেদন ডেস্ক
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Circular Banner */}
        <div className="bg-emerald-50 border-b border-emerald-200 p-4 sm:px-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
            নির্বাচিত সার্কুলার / বিজ্ঞপ্তি
          </span>
          <h4 className="font-bold text-stone-900 text-sm sm:text-base mt-1.5 leading-snug">
            {circularTitle}
          </h4>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-xs">
          
          {/* Question 1: Permission */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2.5">
            <label className="block font-bold text-stone-900 text-sm">
              ১. আপনি কি এই সার্কুলারে আবেদন করতে চান? <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setWillApply(true);
                  setError(null);
                }}
                className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  willApply
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>হ্যাঁ, আবেদন করব</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setWillApply(false);
                  setError(null);
                }}
                className={`p-3 rounded-xl border font-semibold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  !willApply
                    ? 'bg-stone-800 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-100'
                }`}
              >
                <X className="w-4 h-4" />
                <span>না, পরে করব</span>
              </button>
            </div>
          </div>

          {/* Question 2: Post Name (If user said yes) */}
          {willApply ? (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div>
                <label className="block font-bold text-stone-900 text-sm mb-1.5">
                  ২. কোন পদে আবেদন করবেন? (পদের নাম লিখুন) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required={willApply}
                  value={postName}
                  onChange={(e) => {
                    setPostName(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="যেমন: কম্পিউটার অপারেটর, অফিস সহকারী কাম মুদ্রাক্ষরিক ইত্যাদি"
                  className="w-full p-3 border-2 border-emerald-500/70 rounded-xl outline-none focus:border-emerald-600 text-stone-900 font-semibold text-xs sm:text-sm bg-white shadow-xs"
                  autoFocus
                />
              </div>

              {/* Quick Suggestion Pills */}
              <div>
                <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                  সরাসরি বাছাই করুন (ক্লিক করলে নাম বসে যাবে):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_POST_SUGGESTIONS.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => {
                        setPostName(sug);
                        if (error) setError(null);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                        postName === sug
                          ? 'bg-emerald-700 text-white border-emerald-800 font-bold'
                          : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-300'
                      }`}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Applicant Profile Information Box */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center space-x-2 text-blue-900 font-bold text-xs">
                  <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>আবেদনকারীর প্রোফাইল তথ্য (স্বয়ংক্রিয়ভাবে জমা হবে)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-700">
                  <div>
                    <span className="text-stone-500">নাম:</span>{' '}
                    <strong>{applicant.applicantName || 'তথ্য খালি (পরে দিন)'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500">মোবাইল:</span>{' '}
                    <strong>{applicant.phone || 'তথ্য খালি'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500">ইমেইল:</span>{' '}
                    <strong>{applicant.email || 'তথ্য খালি'}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500">বায়োডাটা:</span>{' '}
                    <span className={applicant.isAccountCompleted ? 'text-emerald-700 font-bold' : 'text-amber-700'}>
                      {applicant.isAccountCompleted ? '✓ সংরক্ষিত' : 'ড্রাফট / অসম্পূর্ণ'}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-blue-800 leading-relaxed border-t border-blue-200/60 pt-1.5 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block shrink-0"></span>
                  <span>আবেদন সাবমিট করলে তাৎক্ষণিক স্ট্যাটাস <strong>'প্রক্রিয়াধীন' (Processing)</strong> থাকবে। এডমিন যাচাই করে সম্পন্ন করলে 'সম্পন্ন' দেখাবে।</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
              আপনি এই মুহূর্তে আবেদন করতে চাননি। প্রয়োজনে পরবর্তীতে ড্যাশবোর্ড থেকে যেকোন সময় আবেদন করতে পারবেন।
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-medium text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-md ${
                willApply
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                  : 'bg-stone-800 hover:bg-stone-900 text-white'
              }`}
            >
              {willApply ? (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'জমা হচ্ছে...' : 'আবেদন সাবমিট করুন'}</span>
                </>
              ) : (
                <span>বন্ধ করুন</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
