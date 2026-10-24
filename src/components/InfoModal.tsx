import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ModalContent } from '../types.ts';

interface InfoModalProps {
  isOpen: boolean;
  content: ModalContent | null;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, content, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !content) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-none shadow-2xl border border-stone-200 p-8 sm:p-10 transition-transform duration-200"
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

        {/* Content */}
        {content.category && (
          <div className="text-xs uppercase tracking-widest text-[#B39265] font-cinzel font-semibold mb-2">
            {content.category}
          </div>
        )}

        <h3 className="text-2xl sm:text-3xl font-serif-academic font-medium text-stone-900 mb-3 tracking-tight">
          {content.title}
        </h3>

        {content.subtitle && (
          <p className="text-sm font-medium text-stone-600 mb-4 italic">
            {content.subtitle}
          </p>
        )}

        <div className="h-px bg-stone-200 w-16 mb-5" />

        <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
          {content.description}
        </p>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#C5A880] hover:bg-[#b0936b] text-white text-xs uppercase tracking-widest font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
