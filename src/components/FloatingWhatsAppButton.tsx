import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

interface FloatingWhatsAppButtonProps {
  phoneNumber?: string; // Default: '01407-215416'
}

export const FloatingWhatsAppButton: React.FC<FloatingWhatsAppButtonProps> = ({
  phoneNumber = '01407-215416',
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [isOpen, setIsOpen] = useState(false);

  // Normalize phone number for wa.me link: 8801407215416
  const cleanPhone = '8801407215416';

  const defaultMsg = isEn
    ? encodeURIComponent('Hello! I would like to inquire about courses and digital services at Asad Computer & Training Center.')
    : encodeURIComponent('আসসালামু আলাইকুম! আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টার থেকে কোর্স ও অনলাইন সেবা সম্পর্কে জানতে চাই।');

  const defaultUrl = `https://wa.me/${cleanPhone}?text=${defaultMsg}`;

  const quickTopics = [
    {
      labelBn: 'ডিজিটাল ভূমি সেবা সংক্রান্ত',
      labelEn: 'Digital Land Services Inquiry',
      msg: isEn
        ? 'Hello! I need information regarding Digital Land Services (E-Mutation, Khatian, Land Tax Dakhila).'
        : 'আসসালামু আলাইকুম! ডিজিটাল ভূমি সেবা (ই-নামজারি, খতিয়ান, খাজনা দাখিলা) সম্পর্কে জানতে চাই।',
    },
    {
      labelBn: 'কম্পিউটার কোর্সে ভর্তি',
      labelEn: 'Computer Course Admission',
      msg: isEn
        ? 'Hello! I want to enroll in the Computer Office Application (3 & 6 Months) course.'
        : 'আসসালামু আলাইকুম! ৩ ও ৬ মাস মেয়াদী কম্পিউটার অফিস অ্যাপ্লিকেশন কোর্সে ভর্তি হতে চাই।',
    },
    {
      labelBn: 'চাকরির অনলাইন আবেদন',
      labelEn: 'Job Application Help',
      msg: isEn
        ? 'Hello! I need help with an online government/private job application.'
        : 'আসসালামু আলাইকুম! সরকারি/বেসরকারি চাকরির অনলাইন আবেদন করাতে চাই।',
    },
  ];

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 font-bengali">
      {/* Quick Inquiry Popover */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 text-left">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-800 text-white p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">
                    {isEn ? 'WhatsApp Help Desk' : 'আসাদ কম্পিউটার হেল্পডেস্ক'}
                  </h4>
                  <div className="flex items-center space-x-1.5 text-[11px] text-emerald-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                    <span>{isEn ? 'Online · Quick Response' : 'অনলাইনে আছি · দ্রুত উত্তর'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-black/15 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close popover"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-emerald-50 mt-1">
              {isEn
                ? 'Chat directly with our assistant on WhatsApp for instant assistance.'
                : 'যেকোনো কোর্স বা অনলাইন সেবার জন্য সরাসরি হোয়াটসঅ্যাপে বার্তা পাঠান।'}
            </p>
          </div>

          {/* Body */}
          <div className="p-3.5 space-y-2 bg-stone-50/70">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wide px-1">
              {isEn ? 'Select quick inquiry topic:' : 'কী বিষয়ে জানতে চান নির্বাচন করুন:'}
            </div>

            {quickTopics.map((item, idx) => (
              <a
                key={idx}
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(item.msg)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 bg-white hover:bg-emerald-50 text-stone-800 hover:text-emerald-950 rounded-xl border border-stone-200/90 hover:border-emerald-300 transition-all text-xs font-semibold group cursor-pointer shadow-2xs"
              >
                <span>{isEn ? item.labelEn : item.labelBn}</span>
                <Send className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-600 transition-colors" />
              </a>
            ))}

            {/* Direct Open WhatsApp Button */}
            <a
              href={defaultUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{isEn ? 'Start WhatsApp Chat' : 'সরাসরি চ্যাট শুরু করুন'}</span>
            </a>
          </div>

          {/* Footer Note */}
          <div className="p-2.5 bg-white border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 px-3">
            <span className="font-mono font-bold text-stone-700">{phoneNumber}</span>
            <span>বটতলী, ভুল্লী বাজার</span>
          </div>
        </div>
      )}

      {/* Floating Main Button */}
      <div className="relative group">
        {/* Pulsing Outer Glow */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-40 blur-xs group-hover:opacity-75 animate-pulse transition-opacity" />

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center space-x-2 px-3.5 sm:px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105 cursor-pointer"
          aria-label="Open WhatsApp Chat"
          title="WhatsApp: 01407-215416"
        >
          {/* Animated WhatsApp Icon */}
          <div className="relative">
            <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full ring-2 ring-white animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-200 rounded-full ring-2 ring-white" />
          </div>

          {/* Button Text Pill */}
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider leading-none">
              {isEn ? 'Need Help?' : 'সাহায্য প্রয়োজন?'}
            </span>
            <span className="text-xs sm:text-sm font-bold text-white leading-tight font-mono tracking-wide">
              {phoneNumber}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
