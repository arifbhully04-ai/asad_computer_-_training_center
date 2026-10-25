import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Printer,
  Download,
  Upload,
  FileText,
  Calendar,
  Users,
  Award,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface CircularViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  jobTitle?: string;
  organization?: string;
  isLoggedIn?: boolean;
  onApplyDirectly?: (jobTitle: string) => void;
}

export const CircularViewerModal: React.FC<CircularViewerModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
  jobTitle = 'Computer Operator & Office Assistant',
  organization = 'Directorate of Primary Education & Literacy',
  isLoggedIn = false,
  onApplyDirectly,
}) => {
  const scrollOverlayRef = useRef<HTMLDivElement>(null);
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (scrollOverlayRef.current) {
        scrollOverlayRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const fileUrl = URL.createObjectURL(file);
      setUploadedPdfUrl(fileUrl);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      ref={scrollOverlayRef}
      className="fixed inset-0 z-60 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-start justify-center p-2 sm:p-4 md:p-6 py-4 sm:py-8 print:p-0 print:bg-white print:overflow-visible"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white shadow-2xl rounded-none border border-stone-300 my-2 sm:my-4 print:m-0 print:border-none print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Top Control Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-stone-900 text-white shadow-md print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#C5A880]" />
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-cinzel font-semibold truncate max-w-[200px] sm:max-w-md">
              Official Recruitment Circular Notice
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Upload Custom PDF Button */}
            <label className="flex items-center space-x-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded transition-colors cursor-pointer border border-stone-600">
              <Upload className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Upload PDF</span>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded transition-colors"
              title="Print Circular"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Apply Button */}
            <button
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-[#00897b] hover:bg-[#00796b] text-white font-bold text-xs rounded transition-colors shadow-sm cursor-pointer"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 transition-colors"
              aria-label="Close Circular Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Circular Document Body */}
        <div className="p-6 sm:p-10 font-sans min-h-[750px] bg-white text-stone-900">
          
          {/* If User Uploaded their own PDF, render direct preview */}
          {uploadedPdfUrl ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-teal-50 border border-teal-200 text-teal-900 text-xs rounded print:hidden">
                <span>Displaying uploaded file: <strong>{uploadedFileName}</strong></span>
                <label className="text-teal-700 underline cursor-pointer hover:text-teal-900 font-semibold">
                  Change PDF
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <iframe
                src={uploadedPdfUrl}
                title="Uploaded Job Circular PDF"
                className="w-full h-[700px] border border-stone-300 rounded"
              />
            </div>
          ) : (
            /* Official Recruitment Notice Document Layout */
            <div className="border border-stone-300 p-6 sm:p-8 relative">
              {/* Official Seal Watermark / Header */}
              <div className="text-center pb-6 border-b-2 border-stone-800">
                <div className="inline-block px-3 py-1 bg-stone-100 border border-stone-300 text-[11px] font-semibold tracking-widest uppercase text-stone-600 mb-2">
                  Official Recruitment Notification
                </div>
                <h2 className="text-lg sm:text-2xl font-bold uppercase tracking-wide text-stone-900">
                  {organization}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
                  Government of the People's Republic of Bangladesh
                </p>
                <div className="mt-2 text-xs text-stone-500 font-mono">
                  Memo No: 37.02.0000.104.11.028.26-492 · Date: October 2026
                </div>
              </div>

              {/* Notice Title Banner */}
              <div className="my-6 text-center bg-stone-100 p-3 border-y border-stone-300">
                <h3 className="text-sm sm:text-base font-bold text-stone-900 uppercase tracking-wide">
                  RECRUITMENT NOTICE FOR: {jobTitle.toUpperCase()}
                </h3>
              </div>

              {/* Key Details Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-xs text-left border-collapse border border-stone-300">
                  <tbody>
                    <tr className="border-b border-stone-300 bg-stone-50">
                      <td className="p-2.5 font-bold border-r border-stone-300 w-1/3">Position Title</td>
                      <td className="p-2.5 font-semibold text-stone-900">{jobTitle}</td>
                    </tr>
                    <tr className="border-b border-stone-300">
                      <td className="p-2.5 font-bold border-r border-stone-300">Total Vacancies</td>
                      <td className="p-2.5">78 Posts (General & Quota Merits)</td>
                    </tr>
                    <tr className="border-b border-stone-300 bg-stone-50">
                      <td className="p-2.5 font-bold border-r border-stone-300">Educational Qualification</td>
                      <td className="p-2.5">
                        Bachelor’s Degree / HSC with certified Computer Office Application Training (Minimum 6 Months from Government Recognized Institute).
                      </td>
                    </tr>
                    <tr className="border-b border-stone-300">
                      <td className="p-2.5 font-bold border-r border-stone-300">Typing Speed Requirement</td>
                      <td className="p-2.5">
                        Minimum 25 WPM in Bengali and 30 WPM in English.
                      </td>
                    </tr>
                    <tr className="border-b border-stone-300 bg-stone-50">
                      <td className="p-2.5 font-bold border-r border-stone-300">Age Limit</td>
                      <td className="p-2.5">18 to 32 Years (As per government circular policy).</td>
                    </tr>
                    <tr className="border-b border-stone-300">
                      <td className="p-2.5 font-bold border-r border-stone-300">Application Deadline</td>
                      <td className="p-2.5 font-bold text-rose-700">30 November 2026 (5:00 PM)</td>
                    </tr>
                    <tr className="bg-stone-50">
                      <td className="p-2.5 font-bold border-r border-stone-300">Application Submission</td>
                      <td className="p-2.5 text-stone-700">
                        Online Application via Asad Computer & Training Center Service Desk or Official Portal.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Instructions Paragraph */}
              <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                <p>
                  <strong>1. Submission Procedure:</strong> Interested eligible candidates must fill out the prescribed online application form with valid NID, passport size photo (300x300 px), and signature (300x80 px).
                </p>
                <p>
                  <strong>2. Assistance Center:</strong> For error-free form fill-up, document resizing, and fee payment, visit <strong>Asad Computer & Training Center</strong> at Bottola, Bhully Bazar, Thakurgaon (Helpline: 01773-733654).
                </p>
              </div>

              {/* Circular Official Sign-off */}
              <div className="mt-10 pt-6 border-t border-stone-200 flex justify-between items-end">
                <div className="text-[11px] text-stone-500">
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Official Gazette & Directorate Verified</span>
                  </span>
                </div>
                <div className="text-center">
                  <div className="font-signature text-xl text-stone-800">Deputy Secretary</div>
                  <div className="border-b border-stone-400 w-36 my-1" />
                  <span className="text-[11px] font-bold text-stone-800 block">
                    Member Secretary, Recruitment Committee
                  </span>
                </div>
              </div>

              {/* Bottom Quick Action Box inside Document (Hidden on print) */}
              <div className="mt-8 p-4 bg-teal-50 border border-teal-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
                <div>
                  <h4 className="text-xs font-bold text-teal-950 uppercase tracking-wider">
                    Ready to submit your application?
                  </h4>
                  <p className="text-[11px] text-teal-800 mt-0.5">
                    {isLoggedIn
                      ? 'Click "Apply Now" to select your post and submit your application.'
                      : 'Click "Apply Now" to log in and start your application process.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    if (isLoggedIn && onApplyDirectly) {
                      onApplyDirectly(jobTitle);
                    } else {
                      onOpenLogin();
                    }
                  }}
                  className="px-6 py-2.5 bg-[#00897b] hover:bg-[#00796b] text-white font-bold text-xs rounded transition-colors shadow-sm flex items-center space-x-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
