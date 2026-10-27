import React from 'react';
import { SignatureSvg } from './SignatureSvg.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface WelcomeSectionProps {
  onLearnMore?: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onLearnMore }) => {
  const { t, trans } = useLanguage();

  return (
    <section className="bg-white py-20 sm:py-28 px-6 sm:px-8 border-b border-stone-100">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
        
        {/* Official Affiliation Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold mb-4 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{t('postOfficeBadge')}</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl font-serif-academic text-[#242424] font-medium tracking-tight mb-6">
          {t('welcomeHeading')}
        </h2>

        {/* Lead Welcome Paragraph */}
        <p className="text-stone-600 text-sm sm:text-[15px] leading-relaxed max-w-2xl font-light tracking-wide text-center">
          {t('welcomeParagraph')}
        </p>

        {/* Elegant Handwritten Signature */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center">
          <SignatureSvg className="text-stone-700" />
          <p className="text-xs uppercase tracking-widest text-stone-500 font-cinzel mt-2 font-medium">
            {t('directorSignTitle')}
          </p>
        </div>
      </div>
    </section>
  );
};

