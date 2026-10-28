import React, { useState, useEffect } from 'react';
import {
  X,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Copy,
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
  LandPlot,
  Briefcase,
  GraduationCap,
  CreditCard,
  FileCheck2,
  Printer,
  Receipt,
  FileText,
  Award,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

export interface ServicePlateItem {
  id: string;
  category: 'land' | 'jobs' | 'education' | 'citizen' | 'finance' | 'general';
  numberLabel: string;
  titleBn: string;
  titleEn: string;
  taglineBn: string;
  taglineEn: string;
  descriptionBn: string;
  descriptionEn: string;
  iconName: 'land' | 'jobs' | 'education' | 'citizen' | 'finance' | 'print' | 'docs' | 'award';
  isFeatured?: boolean;
  highlightsBn: string[];
  highlightsEn: string[];
  requiredDocsBn: string[];
  requiredDocsEn: string[];
}

export const ONLINE_SERVICES_DATA: ServicePlateItem[] = [
  {
    id: 'digital-land-services',
    category: 'land',
    numberLabel: '০১',
    titleBn: 'ডিজিটাল ভূমি সেবা',
    titleEn: 'Digital Land Services (E-Mutation & Khatian)',
    taglineBn: 'জমি সংক্রান্ত সকল কাজ করা হয়',
    taglineEn: 'Complete Digital Land & Property Documentation',
    descriptionBn:
      'ভূমি মন্ত্রণালয়ের ডিজিটাল সার্ভারের মাধ্যমে ই-নামজারি, খতিয়ান/পর্চা (CS, SA, RS, BS) উত্তোলন, জমির খাজনা (LDT) প্রদান, দাখিলা প্রিন্ট ও মৌজা ম্যাপ সংগ্রহ সহ জমিজমার সকল কাজ বিশ্বস্ততার সাথে করা হয়।',
    descriptionEn:
      'End-to-end digital land services including E-Mutation applications, official Khatian/Porcha download (CS, SA, RS, BS), Land Development Tax payment, Dakhila printing, and digital Mouza Map requests.',
    iconName: 'land',
    isFeatured: true,
    highlightsBn: [
      'ই-নামজারি ও জমাভাগ/খারিজের নির্ভুল অনলাইন আবেদন',
      'অনলাইন খতিয়ান / পর্চা উত্তোলন ও কিউআর কোড যাচাই',
      'ভূমি উন্নয়ন কর (খাজনা) পরিশোধ ও দাখিলা প্রিন্ট',
      'ডিজিটাল মৌজা ম্যাপ আবেদন ও সরবরাহ',
      'নামজারি মিসকেস ও জমি সংক্রান্ত রেকর্ড সংশোধন',
    ],
    highlightsEn: [
      'Accurate online E-Mutation & Khariz application',
      'Official Khatian / Porcha download with QR verification',
      'Land Development Tax (Khajna) payment & Dakhila print',
      'Digital Mouza Map online ordering & collection',
      'Land miscase & record correction assistance',
    ],
    requiredDocsBn: [
      'মূল খতিয়ান বা বিগত পর্চার কপি',
      'ক্রয়সূত্রে মালিক হলে মূল দলিলের ফটোকপি',
      'পূর্বের পরিশোধিত দাখিলার কপি (যদি থাকে)',
      'জাতীয় পরিচয়পত্র (NID) ও সচল মোবাইল নম্বর',
    ],
    requiredDocsEn: [
      'Photocopy of previous Khatian/Porcha',
      'Photocopy of registered land deed (if purchased)',
      'Previous Land Tax receipt (Dakhila)',
      'National ID (NID) & active mobile number',
    ],
  },
  {
    id: 'govt-job-applications',
    category: 'jobs',
    numberLabel: '০২',
    titleBn: 'সরকারি ও বেসরকারি চাকরির আবেদন',
    titleEn: 'Government & Private Job Applications',
    taglineBn: 'নির্ভুল আবেদন, ছবি-স্বাক্ষর রিসাইজ ও ফি পেমেন্ট',
    taglineEn: 'Accurate form submission, resizing & instant fee payment',
    descriptionBn:
      'বিপিএসসি (BPSC), এনটিআরসিএ (NTRCA), প্রাথমিক শিক্ষক (DPE), রেলওয়ে, সেনাবাহিনী, নৌবাহিনী, বিমানবাহিনী, পুলিশ ও ব্যাংকের চাকরির নির্ভুল আবেদন ও তাৎক্ষণিক ফি প্রদান।',
    descriptionEn:
      'Complete online recruitment application processing for BPSC, NTRCA, Primary Education (DPE), Bangladesh Railway, Defense & Police forces, and commercial banks.',
    iconName: 'jobs',
    isFeatured: true,
    highlightsBn: [
      '৩০০×৩০০ ছবি ও ৩০০×৮০ স্বাক্ষর সঠিক মাপে রিসাইজ',
      'টেলিটকে সরকারি আবেদন ফি তাৎক্ষণিক পরিশোধ',
      'রঙিন Applicant Copy ও ইউজার আইডি নিশ্চিতকরণ',
      'লিখিত ও ব্যবহারিক পরীক্ষার প্রবেশপত্র ট্র্যাকিং',
    ],
    highlightsEn: [
      'Strict 300x300 photo and 300x80 signature resizing',
      'Instant exam fee payment via Teletalk channels',
      'Color Applicant Copy and User ID confirmation print',
      'Written test admit card release monitoring',
    ],
    requiredDocsBn: [
      'পাসপোর্ট সাইজ রঙিন ছবি ও স্বাক্ষর',
      'এসএসসি, এইচএসসি ও ডিগ্রির রোল ও রেজিস্ট্রেশন',
      'জাতীয় পরিচয়পত্র (NID) নম্বর',
    ],
    requiredDocsEn: [
      'Passport size photo and signature',
      'Academic certificates & roll-registration',
      'National ID number',
    ],
  },
  {
    id: 'university-college-admission',
    category: 'education',
    numberLabel: '০৩',
    titleBn: 'বিশ্ববিদ্যালয় ও কলেজ অনলাইন ভর্তি',
    titleEn: 'University & College Admissions',
    taglineBn: 'পাবলিক, গুচ্ছ ও জাতীয় বিশ্ববিদ্যালয়ের ফরম পূরণ',
    taglineEn: 'Public Universities, GST & NU Degree/Honors admissions',
    descriptionBn:
      'ঢাকা বিশ্ববিদ্যালয়, সমন্বিত গুচ্ছ (GST), কৃষি গুচ্ছ, প্রকৌশল, মেডিকেল ও জাতীয় বিশ্ববিদ্যালয় (NU) ডিগ্রি ও অনার্স কোর্সের ভর্তি ফরম পূরণ, সাবজেক্ট চয়েস ও ফি প্রদান।',
    descriptionEn:
      'Online application submission, subject preferences, and payment processing for Dhaka University, GST Cluster, Medical, and National University Degree & Honors.',
    iconName: 'education',
    highlightsBn: [
      'সকল পাবলিক বিশ্ববিদ্যালয় ও গুচ্ছ ভর্তি আবেদন',
      'জাতীয় বিশ্ববিদ্যালয় ডিগ্রি ও অনার্স ভর্তি ফরম',
      'বিষয় পছন্দক্রম (Subject Choice) নির্ভুল পূরণ',
      'ভর্তি পরীক্ষার প্রবেশপত্র ও ফলাফল ডাউনলোড',
    ],
    highlightsEn: [
      'Public university & GST cluster application processing',
      'National University degree and honors admission',
      'Subject choice ordering and migration assistance',
      'Admit card and merit list result verification',
    ],
    requiredDocsBn: [
      'এসএসসি ও এইচএসসি পরীক্ষার রোল ও রেজিস্ট্রেশন',
      'পাসপোর্ট সাইজ ছবি ও অভিভাবকের এনআইডি তথ্য',
    ],
    requiredDocsEn: [
      'SSC and HSC roll and registration numbers',
      'Passport photo and guardian NID details',
    ],
  },
  {
    id: 'epassport-visa-services',
    category: 'citizen',
    numberLabel: '০৪',
    titleBn: 'ই-পাসপোর্ট ও ভিসা আবেদন সেবা',
    titleEn: 'E-Passport & Visa Application Processing',
    taglineBn: 'নতুন পাসপোর্ট, নবায়ন ও অনলাইন অ্যাপয়েন্টমেন্ট',
    taglineEn: 'New biometric passport, renewal & visa appointment',
    descriptionBn:
      'অনলাইনে নতুন ই-পাসপোর্টের ফরম পূরণ, মেয়াদোত্তীর্ণ পাসপোর্ট নবায়ন, সরকারি ফি এ-চালান জমা, পাসপোর্ট অফিসের বায়োমেট্রিক স্লট বুকিং ও ভিসা আবেদন।',
    descriptionEn:
      'Official E-Passport online form submission, renewal processing, A-Challan government fee deposit, and biometric enrollment slot booking.',
    iconName: 'citizen',
    highlightsBn: [
      'ই-পাসপোর্ট ফরম ১০০% নির্ভুলভাবে পূরণ',
      'এ-চালানে সরকারি ব্যাংক ফি জমা ও ভাউচার প্রিন্ট',
      'আঞ্চলিক পাসপোর্ট অফিসে উপস্থিতির তারিখ বুকিং',
      'পুলিশ ভেরিফিকেশন ও ডেলিভারি স্টেটাস ট্র্যাকিং',
    ],
    highlightsEn: [
      'Error-free E-Passport online form submission',
      'A-Challan government fee submission & voucher print',
      'Biometric schedule booking at regional passport office',
      'Police verification and passport delivery tracking',
    ],
    requiredDocsBn: [
      'আবেদনকারীর মূল এনআইডি বা ডিজিটাল জন্ম সনদ',
      'পিতা-মাতার এনআইডি ফটোকপি',
      'পুরাতন পাসপোর্ট (নবায়নের ক্ষেত্রে)',
    ],
    requiredDocsEn: [
      'Original NID or 17-digit digital birth certificate',
      'Parents NID photocopy',
      'Old passport (for renewals)',
    ],
  },
  {
    id: 'nid-smart-card-services',
    category: 'citizen',
    numberLabel: '০৫',
    titleBn: 'জাতীয় পরিচয়পত্র (NID) ও স্মার্ট কার্ড',
    titleEn: 'National ID (NID) & Smart Card Services',
    taglineBn: 'নতুন ভোটার, সংশোধন, রিইস্যু ও কালার ডাউনলোড',
    taglineEn: 'New voter enrollment, correction & color card download',
    descriptionBn:
      'নির্বাচন কমিশনের অনলাইন পোর্টাল হতে নতুন ভোটার আবেদন, অনলাইন রঙিন এনআইডি ডাউনলোড, নাম/বয়স/ঠিকানা সংশোধন আবেদন ও হারানো কার্ড রিইস্যু।',
    descriptionEn:
      'Bangladesh Election Commission services including new voter enrollment, color online NID copy download, and demographic corrections.',
    iconName: 'citizen',
    highlightsBn: [
      'অনলাইন এনআইডি কার্ড কালার ডাউনলোড ও ল্যামিনেশন',
      'নামের বানান, পিতা-মাতার নাম ও বয়স সংশোধন আবেদন',
      'হারানো এনআইডি রিইস্যু ও জিডি কপি আপলোড',
      'ভোটার স্লিপ দিয়ে দ্রুত এনআইডি নম্বর বের করা',
    ],
    highlightsEn: [
      'Online color NID card download & lamination',
      'Name, parent info, and date of birth corrections',
      'Lost NID reissuance and GD slip attachment',
      'Instant NID retrieval using voter token',
    ],
    requiredDocsBn: [
      'সংশোধনের স্বপক্ষে শিক্ষাগত সনদ বা জন্ম সনদ',
      'পিতা-মাতার এনআইডি ফটোকপি',
    ],
    requiredDocsEn: [
      'Educational certificate or birth certificate',
      'Parents NID photocopy',
    ],
  },
  {
    id: 'birth-death-registration',
    category: 'citizen',
    numberLabel: '০৬',
    titleBn: 'ডিজিটাল জন্ম ও মৃত্যু নিবন্ধন',
    titleEn: 'Digital Birth & Death Registration',
    taglineBn: 'নতুন নিবন্ধন, বাংলা-ইংরেজি সংশোধন ও পুনঃমুদ্রণ',
    taglineEn: 'New registration, bilingual corrections & verification',
    descriptionBn:
      'ইউনিয়ন পরিষদ ও পৌরসভার নতুন ডিজিটাল জন্ম নিবন্ধন আবেদন, বাংলা ও ইংরেজি নামের বানান সংশোধন, অনলাইন সনদ যাচাই ও পুনঃমুদ্রণ।',
    descriptionEn:
      'BDRIS portal support for new digital birth registration, English/Bengali name corrections, and duplicate certificate printouts.',
    iconName: 'citizen',
    highlightsBn: [
      'ইউনিয়ন পরিষদ ও পৌরসভার নতুন জন্ম নিবন্ধন আবেদন',
      'বাংলা ও ইংরেজি উভয় ভাষায় নির্ভুল সংশোধন',
      'অনলাইন ১৭ ডিজিট জন্ম সনদ ভেরিফিকেশন কপি প্রিন্ট',
    ],
    highlightsEn: [
      'New digital birth registration submission',
      'Bilingual Bengali and English name correction',
      '17-digit certificate verification and lamination print',
    ],
    requiredDocsBn: [
      'টিকা কার্ড বা হাসপাতালের ছাড়পত্র (শিশুর ক্ষেত্রে)',
      'পিতা-মাতার ডিজিটাল জন্ম সনদ ও এনআইডি',
    ],
    requiredDocsEn: [
      'Immunization card or hospital clearance',
      'Parents digital birth certificates and NID copies',
    ],
  },
  {
    id: 'etin-tax-returns',
    category: 'finance',
    numberLabel: '০৭',
    titleBn: 'ই-টিন (e-TIN) ও আয়কর রিটার্ন',
    titleEn: 'e-TIN Certificate & Income Tax Return',
    taglineBn: 'তাৎক্ষণিক ১২ ডিজিট ই-টিন ও জিরো রিটার্ন দাখিল',
    taglineEn: 'Instant 12-digit e-TIN certificate & zero tax filing',
    descriptionBn:
      'জাতীয় রাজস্ব বোর্ড (NBR) হতে মাত্র ৫ মিনিটে নতুন ১২ ডিজিটের ই-টিন সার্টিফিকেট সংগ্রহ এবং ব্যক্তিগত জিরো ট্যাক্স রিটার্ন দাখিল ও প্রাপ্তিস্বীকার পত্র প্রিন্ট।',
    descriptionEn:
      'Instant 12-digit e-TIN certificate generation and personal zero income tax return preparation with official acknowledgement receipt.',
    iconName: 'finance',
    highlightsBn: [
      'মাত্র ৫ মিনিটে নতুন ১২ ডিজিটের ই-টিন সার্টিফিকেট',
      'অনলাইন জিরো ট্যাক্স রিটার্ন (Zero Return) দাখিল',
      'ট্যাক্স প্রাপ্তিস্বীকার পত্র (Acknowledgment) প্রিন্ট',
    ],
    highlightsEn: [
      'Instant 12-digit e-TIN certificate generation',
      'Personal zero income tax return filing',
      'Official tax acknowledgement receipt retrieval',
    ],
    requiredDocsBn: [
      'জাতীয় পরিচয়পত্র (NID) নম্বর ও জন্মতারিখ',
      'সচল মোবাইল নম্বর (ওটিপির জন্য)',
    ],
    requiredDocsEn: [
      'National ID number and date of birth',
      'Active mobile phone (for OTP verification)',
    ],
  },
  {
    id: 'admit-card-result-print',
    category: 'jobs',
    numberLabel: '০৮',
    titleBn: 'প্রবেশপত্র ও ফলাফল ডাউনলোড',
    titleEn: 'Admit Card & Board Result Printing',
    taglineBn: 'এসএমএস ইউজার আইডি দিয়ে রঙিন প্রবেশপত্র ও মার্কশিট',
    taglineEn: 'Color admit card download & academic marksheet print',
    descriptionBn:
      'চাকরির লিখিত ও মৌখিক পরীক্ষার রঙিন প্রবেশপত্র প্রিন্ট, ইউজার আইডি/পাসওয়ার্ড রিকভারি, এবং এসএসসি/এইচএসসি/ডিগ্রি পরীক্ষার ফলাফল মার্কশিট সহ প্রিন্ট।',
    descriptionEn:
      'Color admit card downloads for recruitment exams and academic GPA marksheet printouts for SSC, HSC, and Degree examinations.',
    iconName: 'print',
    highlightsBn: [
      'উচ্চমানের রঙিন প্রিন্টে পরীক্ষার প্রবেশপত্র',
      'হারানো ইউজার আইডি ও পাসওয়ার্ড উদ্ধার',
      'বোর্ড পরীক্ষার পূর্ণাঙ্গ গ্রেডশিট প্রিন্ট',
    ],
    highlightsEn: [
      'High-quality color recruitment admit cards',
      'Forgotten User ID & password recovery support',
      'Full academic grade sheet printouts',
    ],
    requiredDocsBn: [
      'এসএমএস-এ প্রাপ্ত User ID ও Password',
      'অথবা প্রার্থীর নাম ও মোবাইল নম্বর',
    ],
    requiredDocsEn: [
      'User ID and Password received via SMS',
      'Or candidate name and registered phone',
    ],
  },
  {
    id: 'computer-typing-cv-compose',
    category: 'general',
    numberLabel: '০৯',
    titleBn: 'কম্পিউটার কম্পোজ ও প্রফেশনাল সিভি',
    titleEn: 'Computer Typing, CV & Document Design',
    taglineBn: 'বাংলা-ইংরেজি দ্রুত টাইপিং, বায়োডাটা ও স্ক্যানিং',
    taglineEn: 'Fast Bangla-English typing, executive resume & scanning',
    descriptionBn:
      'বিজয় ও অভ্র কিবোর্ডে দ্রুতগতির বাংলা-ইংরেজি কম্পিউটার কম্পোজ, চাকরির আধুনিক প্রফেশনাল সিভি/বায়োডাটা তৈরি, রঙিন স্ক্যান ও প্লাস্টিক ল্যামিনেশন।',
    descriptionEn:
      'High-speed Bengali & English document typesetting, professional curriculum vitae (CV) creation, high-res color scanning, and lamination.',
    iconName: 'docs',
    highlightsBn: [
      'চাকরির আকর্ষণীয় স্ট্যান্ডার্ড সিভি/রেজুমে তৈরি',
      'আইনি দলিল, এফিডেভিট ও আবেদনপত্র কম্পোজ',
      'উচ্চ রেজুলেশন স্ক্যান ও প্লাস্টিক ল্যামিনেশন',
    ],
    highlightsEn: [
      'Professional executive resume and job biodata design',
      'Official application and document typing',
      'High-resolution scanning and lamination',
    ],
    requiredDocsBn: [
      'হাতে লেখা খসড়া বা মূল কাগজের কপি',
      'সিভির জন্য শিক্ষা ও অভিজ্ঞতার তথ্য',
    ],
    requiredDocsEn: [
      'Handwritten draft or original paper document',
      'Educational and work history for resumes',
    ],
  },
  {
    id: 'post-office-certificate-info',
    category: 'education',
    numberLabel: '১০',
    titleBn: 'ডাক বিভাগ কম্পিউটার কোর্স ও সনদপত্র',
    titleEn: 'Post Office Computer Course & Certificate Services',
    taglineBn: '৩ ও ৬ মাস মেয়াদী কোর্সের সনদপত্র ও ভেরিফিকেশন',
    taglineEn: '3 & 6 Months Certificate Verification & Admission',
    descriptionBn:
      'বাংলাদেশ ডাক বিভাগের আওতাধীন ৩ মাস ও ৬ মাস মেয়াদী কম্পিউটার অফিস অ্যাপ্লিকেশন কোর্সের রেজিস্ট্রেশন ও সনদপত্র সংক্রান্ত তথ্য, যাচাই এবং নতুন ব্যাচে সরাসরি ভর্তি।',
    descriptionEn:
      'Registration verification, roll lookup, and new batch enrollment for the Computer Office Application course under the Bangladesh Post Office.',
    iconName: 'award',
    highlightsBn: [
      'বাংলাদেশ ডাক বিভাগ অনুমোদিত সনদপত্র তথ্য ও যাচাই',
      'রোল ও রেজিস্ট্রেশন নম্বর কনফার্মেশন',
      'নতুন ব্যাচে সরাসরি প্র্যাকটিক্যাল ল্যাবে ভর্তি',
    ],
    highlightsEn: [
      'Bangladesh Post Office certified curriculum verification',
      'Roll and registration card verification support',
      'On-site laboratory counseling and course admission',
    ],
    requiredDocsBn: [
      'কোর্স রোল নম্বর বা জাতীয় পরিচয়পত্র',
    ],
    requiredDocsEn: [
      'Course roll number or National ID card',
    ],
  },
];

interface OnlineServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string | null;
}

export const OnlineServicesModal: React.FC<OnlineServicesModalProps> = ({
  isOpen,
  onClose,
  initialServiceId,
}) => {
  const { trans } = useLanguage();
  const [selectedService, setSelectedService] = useState<ServicePlateItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    if (initialServiceId) {
      const found = ONLINE_SERVICES_DATA.find((s) => s.id === initialServiceId);
      if (found) {
        setSelectedService(found);
      }
    } else if (isOpen && !selectedService) {
      setSelectedService(ONLINE_SERVICES_DATA[0]);
    }
  }, [initialServiceId, isOpen]);

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

  if (!isOpen) return null;

  const filteredServices = ONLINE_SERVICES_DATA.filter((service) => {
    const matchesCategory =
      activeCategory === 'all' || service.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    return (
      matchesCategory &&
      (service.titleBn.toLowerCase().includes(q) ||
        service.taglineBn.toLowerCase().includes(q) ||
        service.descriptionBn.toLowerCase().includes(q))
    );
  });

  const activeSvc = selectedService || ONLINE_SERVICES_DATA[0];

  const handleCopyPhone = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(
      'আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টার, বটতলী, ভুল্লী বাজার, ভুল্লী, ঠাকুরগাঁও সদর, ঠাকুরগাঁও। মোবাইল: 01773-733654, হোয়াটসঅ্যাপ: 01407-215416'
    );
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const whatsAppMessage = encodeURIComponent(
    `আসসালামু আলাইকুম! আসাদ কম্পিউটার থেকে আমি "${activeSvc.titleBn}" (${activeSvc.taglineBn}) সেবাটি সম্পর্কে জানতে চাই।`
  );
  const whatsAppLink = `https://wa.me/8801407215416?text=${whatsAppMessage}`;

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
      case 'print':
        return <Printer className={className} />;
      case 'docs':
        return <FileText className={className} />;
      case 'award':
        return <Award className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/70 backdrop-blur-xs font-bengali"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden text-stone-850"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Clean & Authoritative */}
        <div className="bg-stone-900 text-white px-5 sm:px-7 py-4 flex items-center justify-between shrink-0 border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <LandPlot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-300 font-medium">
                আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টার · অনলাইন সেবা ডেস্ক
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-normal leading-snug">
                ডিজিটাল ভূমি সেবা ও সকল অনলাইন আবেদন
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp & Address Quick Banner */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-5 sm:px-7 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-emerald-950 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
            <span className="font-semibold text-emerald-900">
              হোয়াটসঅ্যাপে সরাসরি যোগাযোগ:{' '}
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noreferrer"
                className="font-bold underline text-emerald-800 hover:text-emerald-950 font-mono tracking-wide"
              >
                01407-215416
              </a>
            </span>
          </div>

          <div className="flex items-center space-x-4 text-stone-600 text-xs">
            <span className="flex items-center space-x-1.5 font-medium text-stone-800">
              <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>বটতলী, ভুল্লী বাজার, ঠাকুরগাঁও সদর</span>
            </span>
            <span className="hidden sm:inline text-stone-500">
              (সকাল ৮:০০ - রাত ৯:০০ টা)
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-5 sm:px-7 py-2.5 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Categories */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              সকল সেবা ({ONLINE_SERVICES_DATA.length})
            </button>
            <button
              onClick={() => setActiveCategory('land')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center space-x-1 ${
                activeCategory === 'land'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300'
              }`}
            >
              <LandPlot className="w-3.5 h-3.5" />
              <span>ভূমি সেবা</span>
            </button>
            <button
              onClick={() => setActiveCategory('jobs')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'jobs'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              চাকরির আবেদন
            </button>
            <button
              onClick={() => setActiveCategory('education')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'education'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              ভর্তি ও কোর্স
            </button>
            <button
              onClick={() => setActiveCategory('citizen')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'citizen'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              পাসপোর্ট ও নাগরিক
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="সেবা খুঁজুন (যেমন: খতিয়ান, চাকরি)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-all font-bengali"
            />
          </div>
        </div>

        {/* Content Area: Left (Clean List of Plates) + Right (Clear Detailed Card) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 bg-stone-100/60">
          
          {/* Left Column: Nameplates list */}
          <div className="lg:col-span-6 flex flex-col space-y-3">
            <div className="text-xs text-stone-500 font-medium px-1">
              যে সেবার তথ্য চান, নিচের নেম প্লেটে ক্লিক করুন:
            </div>

            <div className="space-y-2.5">
              {filteredServices.map((service) => {
                const isSelected = activeSvc.id === service.id;
                const isLand = service.id === 'digital-land-services';

                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-3.5 sm:p-4 rounded-xl cursor-pointer transition-all duration-150 border text-left flex items-start justify-between gap-3 ${
                      isSelected
                        ? isLand
                          ? 'bg-emerald-900 text-white border-emerald-800 shadow-md ring-1 ring-emerald-500'
                          : 'bg-stone-900 text-white border-stone-800 shadow-md ring-1 ring-amber-500'
                        : isLand
                        ? 'bg-white hover:bg-emerald-50/40 text-stone-900 border-emerald-400 shadow-xs'
                        : 'bg-white hover:bg-stone-50 text-stone-900 border-stone-200/90 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start space-x-3 min-w-0">
                      {/* Service Icon */}
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? isLand
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-500 text-stone-950'
                            : isLand
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {renderIcon(service.iconName, 'w-4 h-4')}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span
                            className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded ${
                              isSelected
                                ? 'bg-white/15 text-stone-200'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            নং {service.numberLabel}
                          </span>
                          {service.isFeatured && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500 text-emerald-950">
                              বিশেষ সেবা
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-sm sm:text-base leading-snug">
                          {service.titleBn}
                        </h3>

                        {/* Tagline */}
                        <div
                          className={`text-xs font-semibold mt-1 inline-block ${
                            isSelected
                              ? isLand
                                ? 'text-emerald-300'
                                : 'text-amber-300'
                              : isLand
                              ? 'text-emerald-700'
                              : 'text-stone-600'
                          }`}
                        >
                          {service.taglineBn}
                        </div>
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 shrink-0 mt-2 transition-transform ${
                        isSelected ? 'text-amber-400 translate-x-0.5' : 'text-stone-400'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Clean, Structured Detail & Contact Card */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            
            {/* Service Summary Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                    activeSvc.id === 'digital-land-services'
                      ? 'bg-emerald-700'
                      : 'bg-stone-900'
                  }`}
                >
                  {renderIcon(activeSvc.iconName, 'w-5 h-5')}
                </div>
                <div>
                  <span className="text-xs font-mono font-bold text-amber-700">
                    সেবা নং {activeSvc.numberLabel}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                    {activeSvc.titleBn}
                  </h3>
                </div>
              </div>

              {/* Tagline banner */}
              <div
                className={`p-2 rounded-lg text-xs font-bold mb-3 ${
                  activeSvc.id === 'digital-land-services'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-amber-50 text-amber-950 border border-amber-200'
                }`}
              >
                ✓ {activeSvc.taglineBn}
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
                {activeSvc.descriptionBn}
              </p>

              {/* Service inclusions */}
              <div className="space-y-2 mb-4">
                <div className="text-xs font-bold text-stone-700">কাজের প্রধান বিষয়সমূহ:</div>
                <div className="space-y-1.5 text-xs text-stone-700">
                  {activeSvc.highlightsBn.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Required Documents */}
              {activeSvc.requiredDocsBn.length > 0 && (
                <div className="pt-3 border-t border-stone-100">
                  <div className="text-xs font-bold text-stone-700 mb-1.5">সাথে আনার মতো কাগজপত্র:</div>
                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-xs text-stone-700 space-y-1">
                    {activeSvc.requiredDocsBn.map((doc, idx) => (
                      <div key={idx} className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 1. WHATSAPP CONTACT BOX - CLEAN & VISIBLE */}
            <div className="bg-emerald-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-emerald-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wide">
                  সরাসরি হোয়াটসঅ্যাপ যোগাযোগ
                </span>
                <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded">
                  অনলাইন ২৪/৭
                </span>
              </div>

              <div className="bg-black/30 p-3 rounded-xl flex items-center justify-between mb-3 border border-emerald-800">
                <div className="flex items-center space-x-2.5">
                  <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-stone-300">হোয়াটসঅ্যাপ নম্বর:</div>
                    <div className="text-lg font-mono font-bold text-white tracking-wider">
                      01407-215416
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleCopyPhone('01407-215416')}
                  className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-xs text-emerald-200 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  {copiedPhone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPhone ? 'কপি হয়েছে' : 'কপি'}</span>
                </button>
              </div>

              <a
                href={whatsAppLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-stone-950" />
                <span>হোয়াটসঅ্যাপে চ্যাট করুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 2. PHYSICAL ADDRESS BOX - CLEAN & VISIBLE */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-2 text-stone-900">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0" />
                <h4 className="text-xs sm:text-sm font-bold">আমাদের সেন্টারের ঠিকানায় আসুন:</h4>
              </div>

              <div className="text-xs sm:text-sm text-stone-800 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-200 mb-3">
                <div className="font-bold text-stone-900 mb-0.5">
                  আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টার
                </div>
                <div>বটতলী, ভুল্লী বাজার, ভুল্লী, ঠাকুরগাঁও সদর, ঠাকুরগাঁও।</div>
                <div className="text-stone-500 text-xs mt-0.5">
                  (ভুল্লী পোস্ট অফিসের পাশে, বটতলী মোড়)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <a
                  href="tel:01773733654"
                  className="p-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>কল: 01773-733654</span>
                </a>

                <a
                  href="tel:01864399871"
                  className="p-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>কল: 01864-399871</span>
                </a>
              </div>

              <button
                onClick={handleCopyAddress}
                className="w-full py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1 transition-colors cursor-pointer border border-stone-200"
              >
                {copiedAddress ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                <span>{copiedAddress ? 'ঠিকানা কপি হয়েছে' : 'ঠিকানা ও মোবাইল নম্বর কপি করুন'}</span>
              </button>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-7 py-3 bg-white border-t border-stone-200 flex items-center justify-between text-xs text-stone-600 shrink-0">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টার · ভুল্লী বাজার, ঠাকুরগাঁও</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-stone-800 hover:bg-stone-900 text-white font-medium rounded-lg transition-colors cursor-pointer text-xs"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
