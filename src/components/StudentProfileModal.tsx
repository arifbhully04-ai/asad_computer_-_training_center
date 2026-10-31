import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Key,
  DollarSign,
  User,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  Eye,
  EyeOff,
  CheckCircle,
  Trash2,
} from 'lucide-react';
import { StudentAccount } from '../types.ts';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentAccount | null;
  onSaveStudent: (updatedStudent: StudentAccount) => void;
  onDeleteStudent?: (id: number) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  onSaveStudent,
  onDeleteStudent,
}) => {
  const [formData, setFormData] = useState<StudentAccount | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [addPaymentAmount, setAddPaymentAmount] = useState<string>('');
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({ ...student });
      setAddPaymentAmount('');
    }
  }, [student]);

  if (!isOpen || !formData) return null;

  const handleFeeChange = (total: number, paid: number) => {
    const due = Math.max(0, total - paid);
    setFormData({
      ...formData,
      totalFee: total,
      paidFee: paid,
      dueFee: due,
    });
  };

  const handleAddPayment = () => {
    const amount = parseFloat(addPaymentAmount);
    if (!isNaN(amount) && amount > 0) {
      const newPaid = formData.paidFee + amount;
      const newDue = Math.max(0, formData.totalFee - newPaid);
      const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const record = {
        id: `PAY-${Date.now()}`,
        date: today,
        amount: amount,
        method: 'Office Desk (ক্যাশ)',
        note: 'Admin payment entry',
      };
      setFormData({
        ...formData,
        paidFee: newPaid,
        dueFee: newDue,
        lastPaymentDate: today,
        paymentHistory: [...(formData.paymentHistory || []), record],
      });
      setAddPaymentAmount('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSaveStudent(formData);
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
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <GraduationCap className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">Student Profile & Fee Control</h3>
              <p className="text-[11px] text-stone-400">ID: {formData.rollNo}</p>
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
            <span>Student profile, fee balance, and password updated successfully!</span>
          </div>
        )}

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 text-xs max-h-[80vh] overflow-y-auto">
          
          {/* Section 1: Basic Information */}
          <div>
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3 pb-1 border-b border-stone-200 flex items-center space-x-1.5">
              <User className="w-4 h-4 text-blue-600" />
              <span>Personal & Course Information</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Roll Number</label>
                <input
                  type="text"
                  required
                  value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Course Enrolled</label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-stone-50"
                >
                  <option value="Computer Office Application (6 Months)">Computer Office Application (6 Months)</option>
                  <option value="Computer Office Application (3 Months)">Computer Office Application (3 Months)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Batch Schedule</label>
                <input
                  type="text"
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Typing Speed Score</label>
                <input
                  type="text"
                  value={formData.typingSpeed}
                  onChange={(e) => setFormData({ ...formData, typingSpeed: e.target.value })}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Enrollment Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full p-2 border border-stone-300 rounded-lg outline-none bg-stone-50 font-bold"
                >
                  <option value="Active">Active Student</option>
                  <option value="Certified">Board Certified (Completed)</option>
                  <option value="Dropped">Dropped Out</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Fee Accounting (Total Fee, Paid Fee, Due Fee) */}
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3">
            <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center space-x-1.5">
              <DollarSign className="w-4 h-4 text-amber-700" />
              <span>Student Fee Accounting (ফি হিসাব)</span>
            </h4>

            {/* Pending Online Payment Alert */}
            {formData.paymentVerificationStatus === 'PendingVerification' && (
              <div className="p-3 bg-amber-100 border border-amber-300 rounded-lg text-xs space-y-2">
                <div className="font-bold text-amber-950 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
                    <span>অনলাইন পেমেন্ট পেন্ডিং রিকোয়েস্ট</span>
                  </span>
                  <span className="font-mono text-emerald-800 font-extrabold text-sm">৳{formData.pendingPaymentAmount || formData.dueFee}</span>
                </div>
                <div className="text-stone-700 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                  <div>মাধ্যম: <strong>{formData.paymentMethod || 'bKash'} (Send Money)</strong></div>
                  <div>প্রেরক নম্বর: <strong className="font-mono">{formData.senderPhone || formData.phone}</strong></div>
                  <div className="sm:col-span-2">
                    TrxID: <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900">{formData.transactionId}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const amt = formData.pendingPaymentAmount || formData.dueFee || 0;
                    const newPaid = formData.paidFee + amt;
                    const newDue = Math.max(0, formData.totalFee - newPaid);
                    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                    const record = {
                      id: `PAY-${Date.now()}`,
                      date: today,
                      amount: amt,
                      method: formData.paymentMethod || 'Online (bKash/Nagad/Rocket)',
                      note: `অনলাইন পেমেন্ট ভেরিফিকেশন (TrxID: ${formData.transactionId || 'N/A'})`,
                      trxId: formData.transactionId,
                    };
                    setFormData({
                      ...formData,
                      paidFee: newPaid,
                      dueFee: newDue,
                      paymentVerificationStatus: 'Verified',
                      pendingPaymentAmount: undefined,
                      lastPaymentDate: today,
                      paymentHistory: [...(formData.paymentHistory || []), record],
                    });
                  }}
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded cursor-pointer text-xs shadow-2xs"
                >
                  ✓ পেমেন্ট ভেরিফাই ও পেইড হিসাবে জমা করুন (৳{formData.pendingPaymentAmount || formData.dueFee})
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-amber-200">
                <label className="block text-[11px] font-semibold text-stone-500 mb-1">Total Course Fee</label>
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-stone-600">৳</span>
                  <input
                    type="number"
                    value={formData.totalFee}
                    onChange={(e) => handleFeeChange(parseFloat(e.target.value) || 0, formData.paidFee)}
                    className="w-full font-bold text-base text-stone-900 outline-none"
                  />
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-amber-200">
                <label className="block text-[11px] font-semibold text-emerald-600 mb-1">Total Paid Amount</label>
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-emerald-600">৳</span>
                  <input
                    type="number"
                    value={formData.paidFee}
                    onChange={(e) => handleFeeChange(formData.totalFee, parseFloat(e.target.value) || 0)}
                    className="w-full font-bold text-base text-emerald-700 outline-none"
                  />
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-amber-200">
                <label className="block text-[11px] font-semibold text-rose-600 mb-1">Due Balance (বাকি)</label>
                <div className="text-base font-bold text-rose-700">
                  ৳ {formData.dueFee}
                </div>
                <span className="text-[10px] text-stone-400">Auto calculated</span>
              </div>
            </div>

            {/* Quick Add Payment */}
            <div className="flex items-center space-x-2 pt-2 border-t border-amber-200/80">
              <input
                type="number"
                placeholder="Enter new payment (e.g. 1000)"
                value={addPaymentAmount}
                onChange={(e) => setAddPaymentAmount(e.target.value)}
                className="p-1.5 bg-white border border-stone-300 rounded text-xs flex-1 outline-none"
              />
              <button
                type="button"
                onClick={handleAddPayment}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded transition-colors cursor-pointer"
              >
                + Add Payment
              </button>
            </div>
          </div>

          {/* Section 3: Password Control */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
            <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Key className="w-4 h-4 text-purple-600" />
              <span>Student Password Reset (পাসওয়ার্ড চেঞ্জ)</span>
            </h4>
            <p className="text-[11px] text-stone-500 mb-3">
              Admin can reset or set a new portal login password for this student.
            </p>

            <div className="relative max-w-sm">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter new student password"
                className="w-full p-2 pr-8 border border-stone-300 rounded-lg outline-none font-mono text-xs focus:border-purple-600"
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
            {onDeleteStudent && formData ? (
              <button
                type="button"
                onClick={() => {
                  onDeleteStudent(formData.id);
                  onClose();
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                title="শিক্ষার্থীর প্রোফাইল মুছে ফেলুন"
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
                className="flex items-center space-x-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
