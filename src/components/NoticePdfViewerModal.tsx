import React, { useRef, useEffect } from 'react';
import { X, Printer, Download, FileText, Calendar, Building, ShieldCheck } from 'lucide-react';
import { NoticeItem } from '../types.ts';

interface NoticePdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: NoticeItem | null;
}

export const NoticePdfViewerModal: React.FC<NoticePdfViewerModalProps> = ({
  isOpen,
  onClose,
  notice,
}) => {
  const scrollOverlayRef = useRef<HTMLDivElement>(null);

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

  if (!isOpen || !notice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (notice.pdfUrl) {
      const a = document.createElement('a');
      a.href = notice.pdfUrl;
      a.download = notice.pdfName || `${notice.title}.pdf`;
      a.click();
    } else {
      window.print();
    }
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
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-cinzel font-semibold truncate max-w-[220px] sm:max-w-md">
              Official Notice Document
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded transition-colors cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#00897b] hover:bg-[#00796b] text-white text-xs font-bold rounded transition-colors cursor-pointer"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice Document Canvas */}
        <div className="p-6 sm:p-10 font-sans min-h-[650px] bg-white text-stone-900 flex flex-col justify-between">
          
          {notice.pdfUrl ? (
            /* If raw uploaded PDF blob or URL exists */
            <div>
              <div className="mb-4 p-3 bg-teal-50 border border-teal-200 text-teal-900 text-xs rounded flex items-center justify-between print:hidden">
                <span className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span>Viewing PDF Attachment: <strong>{notice.pdfName || 'Notice.pdf'}</strong></span>
                </span>
                <button
                  onClick={handleDownload}
                  className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
                >
                  Download File
                </button>
              </div>
              <iframe
                src={notice.pdfUrl}
                title={notice.title}
                className="w-full h-[650px] border border-stone-300 rounded"
              />
            </div>
          ) : (
            /* Official Bangladesh / Asad Computer Notice Sheet Layout */
            <div className="border border-stone-300 p-6 sm:p-10 relative">
              {/* Official Header */}
              <div className="text-center pb-6 border-b-2 border-stone-800">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full border-2 border-stone-800 flex items-center justify-center font-cinzel font-bold text-sm bg-stone-50">
                  ACTC
                </div>
                <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-stone-900">
                  Asad Computer & Training Center
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
                  Bottola, Bhully Bazar, Bhully, Thakurgaon · Mobile: 01773-733654
                </p>
                <div className="mt-2 text-xs font-mono text-stone-500">
                  Ref No: ACTC/NOTICE/2026-{notice.id} · Date: {notice.date}
                </div>
              </div>

              {/* Notice Title Banner */}
              <div className="my-6 text-center bg-stone-100 p-3.5 border-y border-stone-300">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B39265] block mb-0.5">
                  Category: {notice.category} Notice
                </span>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 uppercase tracking-wide">
                  {notice.title}
                </h3>
              </div>

              {/* Notice Content */}
              <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed font-normal min-h-[220px]">
                <p>
                  This is to inform all concerned students, applicants, and guardians that <strong>{notice.title}</strong> has been officially notified and published by the authority of Asad Computer & Training Center.
                </p>
                <p>
                  {notice.description ||
                    'Students and applicants are requested to complete all necessary formalities, verification documents, and payment procedures accordingly within the specified schedule. For any technical difficulties or inquiries, please contact the center directly.'}
                </p>
                <div className="p-3.5 bg-stone-50 border border-stone-200 rounded text-xs space-y-1">
                  <div><strong>Notice Effective Date:</strong> {notice.date}</div>
                  <div><strong>Target Audience:</strong> {notice.category} Portal</div>
                  <div><strong>Action Required:</strong> Immediate compliance</div>
                </div>
              </div>

              {/* Sign-off */}
              <div className="mt-12 pt-6 border-t border-stone-200 flex justify-between items-end">
                <div className="text-[11px] text-stone-500 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Notice Board Document</span>
                </div>

                <div className="text-center">
                  <div className="font-signature text-2xl text-stone-800">Md. Asaduzzaman</div>
                  <div className="border-b border-stone-400 w-36 my-1" />
                  <span className="text-xs font-bold text-stone-900 block">Director</span>
                  <span className="text-[10px] text-stone-500">Asad Computer & Training Center</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
