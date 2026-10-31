import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Key,
  Briefcase,
  User,
  Phone,
  Mail,
  DollarSign,
  Eye,
  EyeOff,
  CheckCircle,
  Trash2,
} from 'lucide-react';
import { ApplicantAccount } from '../types.ts';

interface ApplicantProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: ApplicantAccount | null;
  onSaveApplicant: (updatedApplicant: ApplicantAccount) => void;
  onDeleteApplicant?: (id: number) => void;
}

export const ApplicantProfileModal: React.FC<ApplicantProfileModalProps> = ({
  isOpen,
  onClose,
  applicant,
  onSaveApplicant,
  onDeleteApplicant,
}) => {
  const [formData, setFormData] = useState<ApplicantAccount | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    if (applicant) {
      setFormData({ ...applicant });
    }
  }, [applicant]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSaveApplicant(formData);
      setSaveToast(true);
      setTimeout(() => {
        setSaveToast(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-6 py-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">Applicant Profile & Credentials</h3>
              <p className="text-[11px] text-stone-400">{formData.jobTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {saveToast && (
          <div className="bg-emerald-50 border-b border-emerald-200 p-3 text-emerald-800 text-xs flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Applicant profile and credentials updated successfully!</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 text-xs max-h-[80vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Applicant Name</label>
              <input
                type="text"
                required
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Applied Job Circular</label>
              <input
                type="text"
                required
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Application Fee Status</label>
              <select
                value={formData.feeStatus}
                onChange={(e) => setFormData({ ...formData, feeStatus: e.target.value as any })}
                className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-stone-50 font-bold"
              >
                <option value="Paid">Fee Paid (৳ {formData.feeAmount})</option>
                <option value="Pending">Fee Pending</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Fee Amount (৳)</label>
              <input
                type="number"
                value={formData.feeAmount}
                onChange={(e) => setFormData({ ...formData, feeAmount: parseFloat(e.target.value) || 0 })}
                className="w-full p-2 border border-stone-300 rounded-lg outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Admit Card Status</label>
              <select
                value={formData.admitStatus}
                onChange={(e) => setFormData({ ...formData, admitStatus: e.target.value as any })}
                className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-stone-50 font-bold"
              >
                <option value="Ready">Ready (Downloadable)</option>
                <option value="Processing">Processing</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Roll / User ID</label>
              <input
                type="text"
                value={formData.rollNo || ''}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                placeholder="Roll: 819204"
                className="w-full p-2 border border-stone-300 rounded-lg outline-none font-mono"
              />
            </div>
          </div>

          {/* Password Change for Applicant */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Key className="w-4 h-4 text-emerald-600" />
              <span>Applicant Password Reset (পাসওয়ার্ড চেঞ্জ)</span>
            </h4>
            <p className="text-[11px] text-stone-500 mb-2">
              Set or reset the login password for this job applicant account.
            </p>

            <div className="relative max-w-sm">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter new applicant password"
                className="w-full p-2 pr-8 border border-stone-300 rounded-lg outline-none font-mono text-xs focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-200">
            {onDeleteApplicant && formData ? (
              <button
                type="button"
                onClick={() => {
                  onDeleteApplicant(formData.id);
                  onClose();
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                title="আবেদনকারীর প্রোফাইল মুছে ফেলুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>প্রোফাইল মুছুন</span>
              </button>
            ) : <div />}

            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-stone-300 rounded-lg text-stone-600 font-medium hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Applicant Profile</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
