import React, { useState } from 'react';
import {
  LandPlot,
  Briefcase,
  GraduationCap,
  FileCheck2,
  Receipt,
  FileText,
  MessageCircle,
  MapPin,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ONLINE_SERVICES_DATA, ServicePlateItem } from './OnlineServicesModal.tsx';

interface OnlineServicesSectionProps {
  onOpenOnlineServices: (serviceId?: string) => void;
}

export const OnlineServicesSection: React.FC<OnlineServicesSectionProps> = ({
  onOpenOnlineServices,
}) => {
  const { language, trans } = useLanguage();
  const isEn = language === 'en';

  // Initially hidden / collapsed as requested: "বাটনে ক্লিক দিলে সেবা গুলো দেখাবে নয়তো দেখাবেনা"
  const [isExpanded, setIsExpanded] = useState(false);

  const renderIcon = (name: ServicePlateItem['iconName'], className = 'w-5 h-5') => {
    switch (name) {
      case 'land':
        return <LandPlot className={className} />;
      case 'jobs':
        return <Briefcase className={className} />;
      case 'education':
        return <GraduationCap className={className} />;
      case 'citizen':
        return <FileCheck2 className={className} />;
      case 'finance':
        return <Receipt className={className} />;
      default:
        return <FileText className={className} />;
    }
  };

  const previewServices = ONLINE_SERVICES_DATA.slice(0, 6);

  return (
    <section id="online-services-showcase" className="py-14 sm:py-18 bg-stone-50 border-b border-stone-200 font-bengali">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>
                {isEn ? 'Official Digital E-Services Desk' : 'অনলাইন ডিজিটাল সেবা ডেস্ক'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-normal leading-snug">
              {isEn
                ? 'Digital Land Services & All Online Applications'
                : 'ডিজিটাল ভূমি সেবা ও সকল অনলাইন আবেদন'}
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
              {isEn
                ? 'Complete digital solutions: land e-mutation, khatian download, land tax dakhila, government/private job applications, university admissions, and e-passport services.'
                : 'জমি সংক্রান্ত যাবতীয় কাজ (ই-নামজারি, খতিয়ান/পর্চা, খাজনা দাখিলা) সহ সকল সরকারি-বেসরকারি চাকরির আবেদন, ভর্তি ও পাসপোর্ট সেবা।'}
            </p>
          </div>

          {/* Toggle Button: "সকল সেবা দেখুন বাটনে ক্লিক দিলে সেবা গুলো দেখাবে নয়তো দেখাবেনা" */}
          <div className="shrink-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`inline-flex items-center space-x-2 px-5 py-3 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-sm active:scale-98 ${
                isExpanded
                  ? 'bg-emerald-800 hover:bg-emerald-900 text-white ring-2 ring-emerald-500'
                  : 'bg-stone-900 hover:bg-stone-800 text-white'
              }`}
              title={
                isExpanded
                  ? isEn
                    ? 'Hide services'
                    : 'সেবাসমূহ সংক্ষেপ করুন'
                  : isEn
                  ? 'Click to show all services'
                  : 'সকল সেবা দেখতে ক্লিক করুন'
              }
            >
              {isExpanded ? (
                <>
                  <EyeOff className="w-4 h-4 text-emerald-300" />
                  <span>{isEn ? 'Collapse Services' : 'সেবাসমূহ সংক্ষেপ করুন'}</span>
                  <ChevronUp className="w-4 h-4 text-emerald-300" />
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>{isEn ? 'View All Services' : 'সকল সেবা দেখুন'}</span>
                  <ChevronDown className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* CONDITIONALLY RENDERED SERVICES: Only shown when "সকল সেবা দেখুন" button is clicked */}
        {isExpanded ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Clean Nameplate Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {previewServices.map((service) => {
                const isLand = service.id === 'digital-land-services';

                return (
                  <div
                    key={service.id}
                    onClick={() => onOpenOnlineServices(service.id)}
                    className={`group p-5 rounded-2xl cursor-pointer transition-all duration-150 flex flex-col justify-between text-left ${
                      isLand
                        ? 'bg-emerald-950 text-white shadow-md ring-1 ring-emerald-500 hover:shadow-lg'
                        : 'bg-white hover:bg-stone-50 text-stone-900 border border-stone-200/90 shadow-xs hover:border-amber-400 hover:shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Top Row */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                              isLand
                                ? 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                                : 'bg-stone-100 text-stone-700 border border-stone-200'
                            }`}
                          >
                            {isEn ? `No. ${service.numberLabel}` : `নং ${service.numberLabel}`}
                          </span>
                          {isLand && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-emerald-950">
                              {isEn ? 'Featured' : 'প্রধান সেবা'}
                            </span>
                          )}
                        </div>

                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isLand
                              ? 'bg-emerald-700 text-white'
                              : 'bg-stone-100 text-stone-700 group-hover:bg-stone-900 group-hover:text-white transition-colors'
                          }`}
                        >
                          {renderIcon(service.iconName, 'w-4 h-4')}
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-base font-bold leading-snug mb-2 ${
                          isLand ? 'text-white' : 'text-stone-900 group-hover:text-amber-900'
                        }`}
                      >
                        {isEn ? service.titleEn : service.titleBn}
                      </h3>

                      {/* Clean Highlight Tagline Plate */}
                      <div
                        className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-md mb-2.5 ${
                          isLand
                            ? 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                            : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}
                      >
                        ✓ {isEn ? service.taglineEn : service.taglineBn}
                      </div>

                      <p
                        className={`text-xs leading-relaxed line-clamp-2 ${
                          isLand ? 'text-stone-300' : 'text-stone-500'
                        }`}
                      >
                        {isEn ? service.descriptionEn : service.descriptionBn}
                      </p>
                    </div>

                    {/* Footer with WhatsApp & Arrow */}
                    <div
                      className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-medium ${
                        isLand
                          ? 'border-emerald-900 text-emerald-300'
                          : 'border-stone-100 text-stone-500 group-hover:text-stone-900'
                      }`}
                    >
                      <span className="flex items-center space-x-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{isEn ? 'WhatsApp: 01407-215416' : 'হোয়াটসঅ্যাপ: 01407-215416'}</span>
                      </span>

                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Clean Address Banner */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center space-x-3 text-stone-800 text-xs sm:text-sm">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-stone-900">
                    {isEn
                      ? 'Visit our center directly for any service:'
                      : 'সরাসরি সেন্টারে এসে সেবা নিতে যোগাযোগ করুন:'}
                  </div>
                  <div className="text-stone-600 text-xs mt-0.5">
                    {isEn
                      ? 'Bottola, Bhully Bazar, Thakurgaon Sadar · Mobile: 01773-733654, 01864-399871'
                      : 'বটতলী, ভুল্লী বাজার, ঠাকুরগাঁও সদর · মোবাইল: ০১৭৭৩-৭৩৩৬৫৪, ০১৮৬৪-৩৯৯৮৭১ (প্রতিদিন খোলা)'}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <a
                  href="https://wa.me/8801407215416?text=%E0%A6%86%E0%A6%B8%E0%A6%B8%E0%A6%BE%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%81%20%E0%A6%86%E0%A6%B2%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A7%81%E0%A6%AE%2C%20%E0%A6%86%E0%A6%B8%E0%A6%BE%E0%A6%A6%20%E0%A6%95%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%BF%E0%A6%87%E0%A6%9F%E0%A6%BE%E0%A6%B0%20%E0%A6%A5%E0%A7%87%E0%A6%95%E0%A7%87%20%E0%A6%B8%E0%A7%87%E0%A6%AC%E0%A6%BE%20%E0%A6%B8%E0%A6%AE%E0%A7%8D%E0%A6%AA%E0%A6%B0%E0%A7%8D%E0%A6%95%E0%A7%87%20%E0%A6%9C%E0%A6%BE%E0%A6%A8%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A7%A4"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isEn ? 'WhatsApp Chat' : 'হোয়াটসঅ্যাপ মেসেজ'}</span>
                </a>

                <button
                  onClick={() => onOpenOnlineServices()}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-medium rounded-xl transition-colors cursor-pointer border border-stone-200"
                >
                  {isEn ? 'All 10 Services' : 'সকল ১০টি সেবা'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* COLLAPSED STATE: Services are hidden until user clicks "সকল সেবা দেখুন" */
          <div
            onClick={() => setIsExpanded(true)}
            className="p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left group"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <LandPlot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm sm:text-base group-hover:text-emerald-800 transition-colors">
                  {isEn
                    ? '10 Digital Services & Nameplates Available'
                    : 'ডিজিটাল ভূমি সেবা ও চাকরির আবেদনসহ ১০টি সেবা তালিকাভুক্ত'}
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  {isEn
                    ? 'Click "View All Services" to explore services, requirements, and contact channels.'
                    : 'সেবাসমূহ, প্রয়োজনীয় কাগজপত্র ও যোগাযোগ দেখতে "সকল সেবা দেখুন" বাটনে ক্লিক করুন।'}
                </p>
              </div>
            </div>

            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 group-hover:text-emerald-950 bg-emerald-50 group-hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-colors">
              <span>{isEn ? 'Click to Show Services' : 'সেবাগুলো দেখুন'}</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
