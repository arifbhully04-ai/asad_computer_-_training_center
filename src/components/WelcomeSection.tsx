import React from 'react';
import { SignatureSvg } from './SignatureSvg.tsx';

interface WelcomeSectionProps {
  onLearnMore?: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ onLearnMore }) => {
  return (
    <section className="bg-white py-20 sm:py-28 px-6 sm:px-8 border-b border-stone-100">
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
        
        {/* Official Affiliation Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold mb-4 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>বাংলাদেশ ডাক বিভাগের আওতাধীন পরিচালিত · Under Bangladesh Post Office</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl font-serif-academic text-[#242424] font-medium tracking-tight mb-6">
          Welcome to Asad Computer & Training Center
        </h2>

        {/* Lead Welcome Paragraph */}
        <p className="text-stone-600 text-sm sm:text-[15px] leading-relaxed max-w-2xl font-light tracking-wide text-center">
          Welcome to Asad Computer & Training Center, your trusted institute operating under the Bangladesh Post Office (বাংলাদেশ ডাক বিভাগ) for certified Computer Office Application training and dependable online application services. We provide thorough, hands-on training in office automation, spreadsheet analysis, multimedia presentations, and high-speed typing. Concurrently, our center handles all government and private job applications, university admissions, fee payments, and citizen digital services with unmatched speed and accuracy.
        </p>

        {/* Elegant Handwritten Signature */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center">
          <SignatureSvg className="text-stone-700" />
          <p className="text-xs uppercase tracking-widest text-stone-500 font-cinzel mt-2 font-medium">
            Md. Asaduzzaman — Director & Lead Instructor
          </p>
        </div>
      </div>
    </section>
  );
};
