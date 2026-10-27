import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Send,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Clock,
  Smartphone,
  Info,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

export interface PaymentDetails {

  paymentMethod: 'bKash' | 'Nagad' | 'Rocket';
  senderPhone: string;
  transactionId: string;
  amount: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  userType: 'applicant' | 'student';
  userName: string;
  userPhone: string;
  userRollOrRef: string;
  amount: number;
  itemTitle: string;
  onPaymentSubmit: (details: PaymentDetails) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  title,
  userType,
  userName,
  userPhone,
  userRollOrRef,
  amount: defaultAmount,
  itemTitle,
  onPaymentSubmit,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'bKash' | 'Nagad' | 'Rocket'>('bKash');
  const [senderPhone, setSenderPhone] = useState(userPhone || '');
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState<number>(defaultAmount || 220);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setSenderPhone(userPhone || '');
      setTransactionId('');
      setAmount(defaultAmount || 220);
      setErrorMessage(null);
      setIsSuccess(false);
      setSubmittedData(null);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, userPhone, defaultAmount]);

  if (!isOpen) return null;

  const paymentNumbers = {
    bKash: {
      number: '01773733654',
      type: 'Personal (Send Money / সেন্ড মানি)',
      color: 'bg-[#E2136E]',
      hoverColor: 'hover:bg-[#c90f61]',
      borderColor: 'border-[#E2136E]',
      textColor: 'text-[#E2136E]',
      bgLight: 'bg-pink-50',
    },
    Rocket: {
      number: '01773733654',
      type: 'Personal (Send Money / সেন্ড মানি)',
      color: 'bg-[#8C1D82]',
      hoverColor: 'hover:bg-[#77176e]',
      borderColor: 'border-[#8C1D82]',
      textColor: 'text-[#8C1D82]',
      bgLight: 'bg-purple-50',
    },
    Nagad: {
      number: '01864399871',
      type: 'Personal (Send Money / সেন্ড মানি)',
      color: 'bg-[#E85D04]',
      hoverColor: 'hover:bg-[#cc5003]',
      borderColor: 'border-[#E85D04]',
      textColor: 'text-[#E85D04]',
      bgLight: 'bg-orange-50',
    },
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(text);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const getWhatsAppMessageText = (details: PaymentDetails) => {
    const today = new Date().toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const targetNumber =
      details.paymentMethod === 'Nagad'
        ? '01864399871'
        : '01773733654';

    return `*🔔 নতুন অনলাইন পেমেন্ট সাবমিশন - Asad Computer & Training Center*
━━━━━━━━━━━━━━━━━━
👤 *নাম:* ${userName}
📌 *ধরন:* ${userType === 'applicant' ? 'চাকুরী আবেদন ফি' : 'কোর্স ফি'}
📝 *বিষয়/পদ:* ${itemTitle}
🆔 *রোল/রেফারেন্স:* ${userRollOrRef}
💰 *টাকার পরিমাণ:* ৳ ${details.amount}
💳 *পেমেন্ট মাধ্যম:* ${details.paymentMethod} (নাম্বার: ${targetNumber})
📱 *প্রেরক মোবাইল নং:* ${details.senderPhone}
🔖 *ট্রানজেকশন আইডি (TrxID):* ${details.transactionId}
📅 *তারিখ ও সময়:* ${today}
━━━━━━━━━━━━━━━━━━
*অনুগ্রহ করে যাচাই করে এডমিন প্যানেল থেকে 'Paid (পরিশোধিত)' আপডেট করুন।* ধন্যবাদ!`;
  };

  const getWhatsAppUrl = (details: PaymentDetails) => {
    const text = encodeURIComponent(getWhatsAppMessageText(details));
    // Asad Computer WhatsApp support number
    return `https://wa.me/8801407215416?text=${text}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanSender = senderPhone.replace(/[^0-9]/g, '');
    if (!cleanSender || cleanSender.length < 10) {
      setErrorMessage('অনুগ্রহ করে সঠিক ১১ সংখ্যার প্রেরক মোবাইল নম্বর দিন (যে নম্বর থেকে টাকা পাঠিয়েছেন)।');
      return;
    }

    const cleanTrx = transactionId.trim().toUpperCase();
    if (!cleanTrx || cleanTrx.length < 4) {
      setErrorMessage('অনুগ্রহ করে সঠিক ট্রানজেকশন আইডি (Transaction ID / TrxID) দিন।');
      return;
    }

    if (!amount || amount <= 0) {
      setErrorMessage('অনুগ্রহ করে সঠিক টাকার পরিমাণ দিন।');
      return;
    }

    const details: PaymentDetails = {
      paymentMethod: selectedMethod,
      senderPhone: senderPhone.trim(),
      transactionId: cleanTrx,
      amount: amount,
    };

    onPaymentSubmit(details);
    setSubmittedData(details);
    setIsSuccess(true);

    // Automatically trigger WhatsApp in background/tab so user can also chat directly
    const waUrl = getWhatsAppUrl(details);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-80 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#161a2b] text-white px-5 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white tracking-wide">
                {title || (userType === 'applicant' ? 'চাকুরী আবেদন ফি পরিশোধ' : 'কোর্স ফি অনলাইন পেমেন্ট')}
              </h3>
              <p className="text-[11px] text-stone-300">
                বিকাশ, নগদ ও রকেট সেন্ড মানি (Send Money) অপশন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess && submittedData ? (
          /* Success Screen with WhatsApp Confirmation */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                যাচাই প্রক্রিয়াধীন (Verification Pending)
              </span>
              <h4 className="text-xl font-bold text-stone-900 mt-2">
                পেমেন্ট তথ্য সফলভাবে সাবমিট হয়েছে!
              </h4>
              <p className="text-xs text-stone-600 mt-1.5 max-w-md mx-auto leading-relaxed">
                আপনার ট্রানজেকশন আইডি <strong>{submittedData.transactionId}</strong> ও মোবাইল নম্বর <strong>{submittedData.senderPhone}</strong> আমাদের সিস্টেমে সংরক্ষিত হয়েছে এবং আমাদের WhatsApp নম্বরে মেসেজ পাঠানো হয়েছে।
              </p>
            </div>

            {/* Summary Box */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 text-left text-xs max-w-md mx-auto space-y-2">
              <div className="flex justify-between border-b border-stone-200 pb-1.5">
                <span className="text-stone-500">শিক্ষার্থী/আবেদনকারী:</span>
                <span className="font-bold text-stone-900">{userName}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-1.5">
                <span className="text-stone-500">রোল/আইডি:</span>
                <span className="font-mono font-bold text-stone-900">{userRollOrRef}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-1.5">
                <span className="text-stone-500">মাধ্যম ও টাকার পরিমাণ:</span>
                <span className="font-bold text-emerald-700">
                  {submittedData.paymentMethod} · ৳{submittedData.amount}
                </span>
              </div>
              <div className="flex justify-between border-b border-stone-200 pb-1.5">
                <span className="text-stone-500">প্রেরক মোবাইল নং:</span>
                <span className="font-mono font-bold text-stone-900">{submittedData.senderPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">ট্রানজেকশন আইডি (TrxID):</span>
                <span className="font-mono font-bold text-blue-700">{submittedData.transactionId}</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center justify-center space-x-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              <span>আমরা তথ্যটি চেক করে এডমিন প্যানেল থেকে আপডেট করলেই আপনার প্রোফাইলে <strong>'Paid'</strong> দেখাবে।</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <a
                href={getWhatsAppUrl(submittedData)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp এ মেসেজ পাঠান</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 bg-stone-800 hover:bg-stone-900 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
              >
                সম্পন্ন (Done)
              </button>
            </div>
          </div>
        ) : (
          /* Payment Information & Form */
          <div className="p-5 sm:p-7 max-h-[82vh] overflow-y-auto space-y-5 text-xs">
            
            {/* Context Info Banner */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] text-stone-500 block">
                  {userType === 'applicant' ? 'আবেদিত পদ ও বিষয়:' : 'কোর্স ও ব্যাচ:'}
                </span>
                <span className="font-bold text-stone-900 text-sm">{itemTitle}</span>
                <span className="text-stone-500 text-[11px] block mt-0.5">
                  নাম: <strong>{userName}</strong> · আইডি: <span className="font-mono">{userRollOrRef}</span>
                </span>
              </div>
              <div className="text-left sm:text-right shrink-0 bg-white sm:bg-transparent p-2 sm:p-0 rounded-lg border sm:border-none border-stone-200">
                <span className="text-[11px] text-stone-500 block">প্রদেয় ফি (Payable):</span>
                <span className="text-lg font-black text-emerald-700 font-mono">৳ {amount}</span>
              </div>
            </div>

            {/* Official Payment Numbers: bKash, Rocket, Nagad */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-stone-800 uppercase tracking-wider text-xs flex items-center space-x-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>পেমেন্ট নম্বরসমূহ (সেন্ড মানি করুন)</span>
                </span>
                <span className="text-[11px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Send Money Only
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 1. bKash */}
                <div
                  onClick={() => setSelectedMethod('bKash')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                    selectedMethod === 'bKash'
                      ? 'border-[#E2136E] bg-pink-50/70 shadow-xs ring-2 ring-[#E2136E]/20'
                      : 'border-stone-200 bg-white hover:border-pink-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-[#E2136E] text-sm">বিকাশ (bKash)</span>
                    <span className="text-[10px] text-stone-500 font-medium">Personal</span>
                  </div>
                  <div className="font-mono font-bold text-stone-900 text-sm">
                    01773733654
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-stone-500">সেন্ড মানি</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy('01773733654');
                      }}
                      className="px-2 py-0.5 bg-white border border-stone-300 hover:bg-stone-100 rounded text-[11px] font-medium flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      {copiedNumber === '01773733654' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-stone-500" />
                          <span>কপি</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. Rocket */}
                <div
                  onClick={() => setSelectedMethod('Rocket')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                    selectedMethod === 'Rocket'
                      ? 'border-[#8C1D82] bg-purple-50/70 shadow-xs ring-2 ring-[#8C1D82]/20'
                      : 'border-stone-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-[#8C1D82] text-sm">রকেট (Rocket)</span>
                    <span className="text-[10px] text-stone-500 font-medium">Personal</span>
                  </div>
                  <div className="font-mono font-bold text-stone-900 text-sm">
                    01773733654
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-stone-500">সেন্ড মানি</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy('01773733654');
                      }}
                      className="px-2 py-0.5 bg-white border border-stone-300 hover:bg-stone-100 rounded text-[11px] font-medium flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      {copiedNumber === '01773733654' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-stone-500" />
                          <span>কপি</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 3. Nagad */}
                <div
                  onClick={() => setSelectedMethod('Nagad')}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                    selectedMethod === 'Nagad'
                      ? 'border-[#E85D04] bg-orange-50/70 shadow-xs ring-2 ring-[#E85D04]/20'
                      : 'border-stone-200 bg-white hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-[#E85D04] text-sm">নগদ (Nagad)</span>
                    <span className="text-[10px] text-stone-500 font-medium">Personal</span>
                  </div>
                  <div className="font-mono font-bold text-stone-900 text-sm">
                    01864399871
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-stone-500">সেন্ড মানি</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy('01864399871');
                      }}
                      className="px-2 py-0.5 bg-white border border-stone-300 hover:bg-stone-100 rounded text-[11px] font-medium flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      {copiedNumber === '01864399871' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-stone-500" />
                          <span>কপি</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* Payment Details Submission Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                <span className="font-bold text-stone-800 text-xs flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>পেমেন্ট নিশ্চিতকরণ তথ্য দিন (Transaction Verification)</span>
                </span>
                <span className="text-[11px] text-stone-500 font-medium">
                  নির্বাচিত মাধ্যম: <strong className="text-stone-900">{selectedMethod}</strong>
                </span>
              </div>

              {/* Method Selection Pills */}
              <div className="flex items-center space-x-2">
                {(['bKash', 'Rocket', 'Nagad'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setSelectedMethod(method)}
                    className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs transition-colors cursor-pointer border ${
                      selectedMethod === method
                        ? method === 'bKash'
                          ? 'bg-[#E2136E] text-white border-[#E2136E]'
                          : method === 'Rocket'
                          ? 'bg-[#8C1D82] text-white border-[#8C1D82]'
                          : 'bg-[#E85D04] text-white border-[#E85D04]'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {method === 'bKash' ? 'বিকাশ' : method === 'Rocket' ? 'রকেট' : 'নগদ'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Sender Mobile Number */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Mobile) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="যেমন: 017xxxxxxxx"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 placeholder:text-stone-400 focus:border-blue-500 outline-none font-mono"
                  />
                  <span className="text-[10px] text-stone-500 block mt-0.5">আপনার বিকাশ/নগদ/রকেট মোবাইল নম্বর</span>
                </div>

                {/* Transaction ID */}
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    ট্রানজেকশন আইডি (Transaction ID / TrxID) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                    placeholder="যেমন: BL9X2A88K"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-stone-900 placeholder:text-stone-400 focus:border-blue-500 outline-none font-mono uppercase font-bold"
                  />
                  <span className="text-[10px] text-stone-500 block mt-0.5">সেন্ড মানি কনফার্মেশনের ফিরতি TrxID কোড</span>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  পরিশোধিত টাকার পরিমাণ (Amount in Taka)
                </label>
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-500">৳</span>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 pl-8 text-stone-900 font-mono font-bold focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Instructions on Admin Verification & WhatsApp Alert */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1">
                <div className="font-bold flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>পেমেন্ট সাবমিশন ও ভেরিফিকেশন নিয়মাবলী:</span>
                </div>
                <p className="leading-relaxed text-[11px] text-amber-800">
                  সাবমিট বাটনে ক্লিক করলে আপনার ট্রানজেকশন তথ্য সরাসরি আমাদের সিস্টেমে যুক্ত হবে এবং আসাদ কম্পিউটারের হোয়াটসঅ্যাপে একটি মেসেজ যাবে। আমরা TrxID ও মোবাইল নম্বর মিলিয়ে দেখেই আপনার একাউন্ট <strong>'Paid (পরিশোধিত)'</strong> স্ট্যাটাসে আপডেট করে দেব।
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-stone-300 rounded-xl text-stone-600 font-medium hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center space-x-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>পেমেন্ট তথ্য সাবমিট করুন</span>
                </button>
              </div>
            </form>

          </div>
        )}

      </div>
    </div>
  );
};
