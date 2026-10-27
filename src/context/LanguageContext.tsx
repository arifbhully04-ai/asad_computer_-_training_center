import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Globe } from 'lucide-react';

export type Language = 'en' | 'bn';

export interface Translations {
  [key: string]: {
    en: string;
    bn: string;
  };
}

export const translations: Translations = {
  // Navigation
  home: { en: 'Home', bn: 'হোম' },
  aboutCenter: { en: 'About Center', bn: 'প্রতিষ্ঠান পরিচিতি' },
  aboutCenterDesc: {
    en: 'Asad Computer & Training Center is a premier IT training and digital service institute located at Bottola, Bhully Bazar, Thakurgaon.',
    bn: 'আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টার ঠাকুরগাঁওয়ের ভুল্লী বাজার বটতলায় অবস্থিত একটি নির্ভরযোগ্য আইটি প্রশিক্ষণ ও ডিজিটাল সেবা কেন্দ্র।',
  },
  courses: { en: 'Courses', bn: 'কোর্সসমূহ' },
  academicCourses: { en: 'Academic Courses', bn: 'একাডেমিক কোর্সসমূহ' },
  computerOfficeApp: { en: 'Computer Office Application', bn: 'কম্পিউটার অফিস অ্যাপ্লিকেশন' },
  courseSummaryShort: {
    en: 'MS Word, Excel, PowerPoint, Access & Typing (3 & 6 Months)',
    bn: 'এমএস ওয়ার্ড, এক্সেল, পাওয়ারপয়েন্ট, অ্যাক্সেস ও টাইপিং (৩ ও ৬ মাস)',
  },
  admission: { en: 'Admission', bn: 'ভর্তি' },
  admissionForm: { en: 'Admission Form', bn: 'ভর্তি ফরম' },
  viewCourseDetails: { en: 'View Course Details', bn: 'কোর্সের বিস্তারিত দেখুন' },
  jobPortalNotice: { en: 'Job Portal / Notice', bn: 'জব পোর্টাল ও নোটিশ' },
  onlineServices: { en: 'Online Services', bn: 'অনলাইন সেবা' },
  onlineServicesDesc: {
    en: 'Fast and accurate processing for all online job applications, university admissions, fee submissions, e-challans, and government digital services.',
    bn: 'সকল সরকারি-বেসরকারি চাকুরীর আবেদন, বিশ্ববিদ্যালয় ভর্তি, ফি প্রদান, ই-চালান এবং নাগরিক ডিজিটাল সেবার দ্রুত ও নির্ভুল সমাধান।',
  },
  login: { en: 'Login', bn: 'লগইন' },
  selectPortalAccess: { en: 'Select Portal Access', bn: 'পোর্টাল অ্যাক্সেস নির্বাচন করুন' },
  studentLogin: { en: 'Student Login', bn: 'স্টুডেন্ট লগইন' },
  studentLoginDesc: { en: 'Course & typing certificate portal', bn: 'কোর্স ও টাইপিং সার্টিফিকেট পোর্টাল' },
  applicantLogin: { en: 'Applicant Login', bn: 'আবেদনকারী লগইন' },
  applicantLoginDesc: { en: 'Track job & admission applications', bn: 'চাকুরি ও ভর্তি আবেদন ট্র্যাকিং' },
  instituteLogin: { en: 'Institute Login', bn: 'প্রতিষ্ঠান লগইন' },
  instituteLoginDesc: { en: 'Staff & administration panel', bn: 'স্টাফ ও এডমিন প্যানেল' },
  applicantRegistration: { en: 'Applicant Registration', bn: 'আবেদনকারী নিবন্ধন' },
  contact: { en: 'Contact', bn: 'যোগাযোগ' },
  contactDesc: {
    en: 'Visit Asad Computer & Training Center at Bottola, Bhully Bazar, Bhully, Thakurgaon. Mobile: 01773-733654, 01864-399871, WhatsApp: 01407-215416.',
    bn: 'আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টার, বটতলা, ভুল্লী বাজার, ভুল্লী, ঠাকুরগাঁও। মোবাইল: ০১৭৭৩-৭৩৩৬৫৪, ০১৮৬৪-৩৯৯৮৭১, হোয়াটসঅ্যাপ: ০১৪০৭-২১৫৪১৬।',
  },

  // Welcome section
  postOfficeBadge: {
    en: 'Under Bangladesh Post Office · Bangladesh Post Office Affiliated',
    bn: 'বাংলাদেশ ডাক বিভাগের আওতাধীন পরিচালিত · Under Bangladesh Post Office',
  },
  welcomeHeading: {
    en: 'Welcome to Asad Computer & Training Center',
    bn: 'আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টারে স্বাগতম',
  },
  welcomeParagraph: {
    en: 'Welcome to Asad Computer & Training Center, your trusted institute operating under the Bangladesh Post Office for certified Computer Office Application training and dependable online application services. We provide thorough, hands-on training in office automation, spreadsheet analysis, multimedia presentations, and high-speed typing. Concurrently, our center handles all government and private job applications, university admissions, fee payments, and citizen digital services with unmatched speed and accuracy.',
    bn: 'আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টারে আপনাকে স্বাগতম। বাংলাদেশ ডাক বিভাগের আওতাধীন পরিচালিত আমাদের এই প্রতিষ্ঠানে বিশ্বস্ততার সাথে কম্পিউটার অফিস অ্যাপ্লিকেশন প্রশিক্ষণ এবং নির্ভরযোগ্য অনলাইন আবেদন সেবা প্রদান করা হয়। আমরা অফিস অটোমেশন, স্প্রেডশিট অ্যানালাইসিস, প্রেজেন্টেশন এবং দ্রুতগতির বাংলা-ইংরেজি টাইপিংয়ের বাস্তবমুখী প্রশিক্ষণ প্রদান করি। পাশাপাশি সকল সরকারি-বেসরকারি চাকুরির আবেদন, ভর্তি, ফি পেমেন্ট ও ডিজিটাল সেবা দ্রুত ও নির্ভুলভাবে সম্পন্ন করা হয়।',
  },
  directorSignTitle: {
    en: 'Md. Asaduzzaman — Director & Lead Instructor',
    bn: 'মোঃ আসাদুজ্জামান — পরিচালক ও প্রধান প্রশিক্ষক',
  },

  // Hero Slider
  heroSlide1Title: { en: 'Asad Computer & Training Center', bn: 'আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টার' },
  heroSlide1Sub: {
    en: 'Empowering students and job seekers with essential computer literacy, certified practical office skills, and end-to-end online document submission services.',
    bn: 'শিক্ষার্থী ও চাকুরিপ্রার্থীদের জন্য প্রয়োজনীয় কম্পিউটার সাক্ষরতা, অনুমোদিত ব্যবহারিক অফিস দক্ষতা এবং নির্ভরযোগ্য অনলাইন আবেদন সেবা।',
  },
  exploreCourses: { en: 'EXPLORE COURSES', bn: 'কোর্সসমূহ দেখুন' },
  onlineServicesCta: { en: 'ONLINE SERVICES', bn: 'অনলাইন সেবা' },
  heroSlide2Title: { en: 'Computer Office Application Course', bn: 'কম্পিউটার অফিস অ্যাপ্লিকেশন কোর্স' },
  heroSlide2Sub: {
    en: 'Master MS Word, Excel, PowerPoint, Access, Internet browsing, and high-speed typing at Asad Computer & Training Center. Comprehensive 3-month and 6-month certified courses.',
    bn: 'এমএস ওয়ার্ড, এক্সেল, পাওয়ারপয়েন্ট, অ্যাক্সেস, ইন্টারনেট ও দ্রুতগতির টাইপিং শিখুন আসাদ কম্পিউটার ট্রেনিং সেন্টারে। ৩ মাস ও ৬ মাস মেয়াদী অনুমোদিত কোর্স।',
  },
  enrollInCourse: { en: 'ENROLL IN COURSE', bn: 'কোর্সে ভর্তি হন' },
  courseSyllabus: { en: 'COURSE SYLLABUS', bn: 'কোর্স সিলেবাস' },
  heroSlide3Title: { en: 'All Online Application & Digital Services', bn: 'সকল অনলাইন আবেদন ও ডিজিটাল সেবা' },
  heroSlide3Sub: {
    en: 'Fast, accurate, and hassle-free online application services for government and private jobs, university & college admissions, passport, NID, and digital certificates.',
    bn: 'সরকারি-বেসরকারি চাকরি, বিশ্ববিদ্যালয় ও কলেজ ভর্তি, পাসপোর্ট, এনআইডি ও ডিজিটাল সনদের দ্রুত ও নির্ভুল অনলাইন আবেদন সেবা।',
  },
  applyOnline: { en: 'APPLY ONLINE', bn: 'অনলাইন আবেদন' },
  viewAllServices: { en: 'VIEW ALL SERVICES', bn: 'সকল সেবা দেখুন' },

  // FAQ
  faqBadge: { en: 'Frequently Asked Questions · FAQ', bn: 'সাধারণ জিজ্ঞাসা ও উত্তর · FAQ' },
  faqHeading: { en: 'Frequently Asked Questions · FAQ', bn: 'সাধারণ জিজ্ঞাসা ও উত্তর · FAQ' },
  faqCount: { en: 'Questions & Answers', bn: 'টি প্রশ্নোত্তর' },
  faqSubOpen: { en: 'Click here to collapse questions and answers.', bn: 'প্রশ্নোত্তর লুকানোর জন্য এখানে ক্লিক করুন।' },
  faqSubClosed: {
    en: 'Click to view common questions regarding courses, certificates, job applications, and user IDs.',
    bn: 'কোর্স, সার্টিফিকেট, চাকুরীর আবেদন ও ইউজার আইডি সংক্রান্ত সাধারণ প্রশ্নাবলী দেখতে ক্লিক করুন।',
  },
  hideFaq: { en: 'Hide FAQ', bn: 'প্রশ্নোত্তর বন্ধ করুন' },
  viewFaq: { en: 'Click to View FAQ', bn: 'প্রশ্নোত্তর দেখুন' },
  allTopics: { en: 'All Topics', bn: 'সকল বিষয়' },
  tabTraining: { en: 'Computer Training & Certificate', bn: 'কম্পিউটার প্রশিক্ষণ ও সনদ' },
  tabServices: { en: 'Online Services & Applications', bn: 'অনলাইন সেবা ও চাকুরীর আবেদন' },
  tabSecurity: { en: 'Security & Fees', bn: 'নিরাপত্তা ও ফি সংক্রান্ত' },
  searchFaqPlaceholder: {
    en: 'Search questions (e.g., course duration, certificate validity, fees)...',
    bn: 'প্রশ্ন খুঁজুন (যেমন: কোর্সের মেয়াদ, সনদপত্র, প্রবেশপত্র, ফি)...',
  },
  faqNoResults: { en: 'No matching questions found', bn: 'কোনো প্রশ্নোত্তর পাওয়া যায়নি' },
  faqNoResultsDesc: {
    en: 'Try searching with different keywords or clear your search filter.',
    bn: 'অন্য কোনো শব্দ দিয়ে অনুসন্ধান করুন অথবা ফিল্টার পরিবর্তন করুন।',
  },
  clearSearch: { en: 'Clear Search', bn: 'অনুসন্ধান মুছুন' },
  faqStillHaveQuestions: {
    en: 'Still have questions or need instant support?',
    bn: 'আরও কোনো তথ্য জানতে চান বা তাৎক্ষণিক সহায়তা প্রয়োজন?',
  },
  callHotline: { en: 'Hotline: 01773-733654', bn: 'হটলাইন: ০১৭৭৩-৭৩৩৬৫৪' },
  whatsappSupport: { en: 'WhatsApp Support', bn: 'হোয়াটসঅ্যাপ সহায়তা' },
  askDirectorWhatsApp: { en: 'WhatsApp Consultation', bn: 'পরিচালকের সাথে হোয়াটসঅ্যাপ' },

  // Footer
  footerAboutText: {
    en: 'Empowering students and job seekers with certified Computer Office Application skills and dependable online government and institutional application services.',
    bn: 'শিক্ষার্থী ও চাকুরিপ্রার্থীদের অনুমোদিত কম্পিউটার অফিস অ্যাপ্লিকেশন দক্ষতা এবং নির্ভরযোগ্য অনলাইন সরকারি ও প্রাতিষ্ঠানিক আবেদন সেবা প্রদান।',
  },
  footerOnlineAdmissionBtn: { en: 'Online Admission Form', bn: 'অনলাইন ভর্তি ফরম' },
  footerUnderPostOffice: {
    en: 'Under Bangladesh Post Office (বাংলাদেশ ডাক বিভাগ)',
    bn: 'বাংলাদেশ ডাক বিভাগের আওতাধীন পরিচালিত',
  },
  footerCoursesHeading: { en: 'Courses & Programs', bn: 'কোর্স ও প্রোগ্রাম' },
  footerCourse1: { en: '• Computer Office Application (3 & 6 Months)', bn: '• কম্পিউটার অফিস অ্যাপ্লিকেশন (৩ ও ৬ মাস)' },
  footerCourse2: { en: '• MS Word, Excel, PowerPoint & Access', bn: '• এমএস ওয়ার্ড, এক্সেল, পাওয়ারপয়েন্ট ও অ্যাক্সেস' },
  footerCourse3: { en: '• English & Bengali (Bijoy/Avro) Typing', bn: '• ইংরেজি ও বাংলা (বিজয়/অভ্র) টাইপিং' },
  footerCourse4: { en: '• All Government & Private Job Applications', bn: '• সকল সরকারি ও বেসরকারি চাকুরীর আবেদন' },
  footerCourse5: { en: '• University & College Admission Forms', bn: '• বিশ্ববিদ্যালয় ও কলেজ ভর্তি আবেদন' },
  footerCourse6: { en: '• Admit Card Download & Color Printing', bn: '• প্রবেশপত্র ডাউনলোড ও কালার প্রিন্ট' },
  footerQuickLinksHeading: { en: 'Quick Links', bn: 'গুরুত্বপূর্ণ লিংক' },
  footerLinkAbout: { en: 'About Center', bn: 'প্রতিষ্ঠান পরিচিতি' },
  footerLinkCourses: { en: 'Courses & Syllabus', bn: 'কোর্স ও সিলেবাস' },
  footerLinkAdmission: { en: 'Admission Form', bn: 'ভর্তি ফরম' },
  footerLinkJobPortal: { en: 'Job Portal / Circulars', bn: 'জব পোর্টাল ও নিয়োগ বিজ্ঞপ্তি' },
  footerLinkOnlineServices: { en: 'Online Citizen Services', bn: 'অনলাইন নাগরিক সেবা' },
  footerLinkStudentLogin: { en: 'Student Portal Login', bn: 'স্টুডেন্ট পোর্টাল লগইন' },
  footerLinkApplicantLogin: { en: 'Applicant Portal Login', bn: 'আবেদনকারী পোর্টাল লগইন' },
  footerLinkInstituteLogin: { en: 'Institute Administration', bn: 'ইনস্টিটিউট এডমিন' },
  footerContactHeading: { en: 'Contact & Location', bn: 'যোগাযোগ ও ঠিকানা' },
  footerLocation: {
    en: 'Bottola, Bhully Bazar, Bhully, Thakurgaon Sadar, Thakurgaon - 5100',
    bn: 'বটতলা, ভুল্লী বাজার, ভুল্লী, ঠাকুরগাঁও সদর, ঠাকুরগাঁও - ৫১০০',
  },
  footerOfficeHours: {
    en: 'Daily: 8:00 AM – 8:00 PM (Except Friday afternoon)',
    bn: 'প্রতিদিন: সকাল ৮:০০ - রাত ৮:০০ (শুক্রবার বিকেল ব্যতিত)',
  },
  footerHotline: { en: 'Mobile: 01773-733654, 01864-399871', bn: 'মোবাইল: ০১৭৭৩-৭৩৩৬৫৪, ০১৮৬৪-৩৯৯৮৭১' },
  footerWhatsAppText: { en: 'WhatsApp: 01407-215416 (Direct Inquiry)', bn: 'হোয়াটসঅ্যাপ: ০১৪০৭-২১৫৪১৬ (সরাসরি তথ্য)' },
  footerNoticeBanner: {
    en: 'Official Notice: Asad Computer & Training Center operates under the Bangladesh Post Office. Recognized for certified computer applications and online digital submissions.',
    bn: 'বিশেষ ঘোষণা: আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টার বাংলাদেশ ডাক বিভাগের আওতাধীন পরিচালিত। কম্পিউটার সনদ ও অনলাইন চাকুরীর আবেদনের জন্য অনুমোদিত।',
  },
  footerCopyright: {
    en: 'All rights reserved. Asad Computer & Training Center.',
    bn: 'সর্বস্বত্ব সংরক্ষিত। আসাদ কম্পিউটার অ্যান্ড ট্রেনিং সেন্টার।',
  },

  // Modals & General
  close: { en: 'Close', bn: 'বন্ধ করুন' },
  save: { en: 'Save', bn: 'সংরক্ষণ করুন' },
  submit: { en: 'Submit', bn: 'সাবমিট করুন' },
  cancel: { en: 'Cancel', bn: 'বাতিল' },
  print: { en: 'Print', bn: 'প্রিন্ট' },
  download: { en: 'Download', bn: 'ডাউনলোড' },
  search: { en: 'Search', bn: 'অনুসন্ধান' },
  backToHome: { en: 'Back to Home', bn: 'হোমে ফিরে যান' },
  logout: { en: 'Logout', bn: 'লগআউট' },
  processing: { en: 'Processing', bn: 'প্রক্রিয়াধীন' },
  completed: { en: 'Completed', bn: 'সম্পন্ন' },
  pending: { en: 'Pending', bn: 'অপেক্ষমাণ' },
  verified: { en: 'Verified', bn: 'যাচাইকৃত' },
  unverified: { en: 'Unverified', bn: 'অযাচাইকৃত' },
  paid: { en: 'Paid', bn: 'পরিশোধিত' },
  unpaid: { en: 'Unpaid', bn: 'অপরিশোধিত' },
  due: { en: 'Due', bn: 'বকেয়া' },

  // Course Modal
  availableCourses: { en: 'Available Courses', bn: 'উপলব্ধ কোর্সসমূহ' },
  coursesPrograms: { en: 'Courses & Academic Programs', bn: 'কোর্স ও একাডেমিক প্রোগ্রাম' },
  courseDurationLabel: { en: 'Duration: 3 Months / 6 Months', bn: 'মেয়াদ: ৩ মাস / ৬ মাস' },
  postOfficeCertBadge: { en: 'Post Office Authorized IT Certificate', bn: 'ডাক বিভাগ অনুমোদিত আইটি সনদপত্র' },
  courseCurriculumTitle: { en: 'Course Curriculum Modules', bn: 'কোর্স কারিকুলাম ও মডিউল' },
  applyAdmissionBtn: { en: 'Apply for Online Admission', bn: 'অনলাইন ভর্তির আবেদন করুন' },
  closeWindow: { en: 'Close Window', bn: 'উইন্ডো বন্ধ করুন' },

  // Admission Modal
  admissionOnlineTitle: { en: 'Online Admission Form', bn: 'অনলাইন ভর্তি ফরম' },
  admissionOnlineSub: {
    en: 'Computer Office Application · Under Bangladesh Post Office',
    bn: 'কম্পিউটার অফিস অ্যাপ্লিকেশন · বাংলাদেশ ডাক বিভাগের আওতাধীন',
  },
  studentNameEnLabel: { en: 'Student Name (in English)', bn: 'শিক্ষার্থীর নাম (ইংরেজিতে)' },
  fatherNameLabel: { en: "Father's Name", bn: 'পিতার নাম' },
  motherNameLabel: { en: "Mother's Name", bn: 'মাতার নাম' },
  dobLabel: { en: 'Date of Birth', bn: 'জন্ম তারিখ' },
  genderLabel: { en: 'Gender', bn: 'লিঙ্গ' },
  male: { en: 'Male', bn: 'পুরুষ' },
  female: { en: 'Female', bn: 'মহিলা' },
  other: { en: 'Other', bn: 'অন্যান্য' },
  religionLabel: { en: 'Religion', bn: 'ধর্ম' },
  nationalityLabel: { en: 'Nationality', bn: 'জাতীয়তা' },
  phoneLoginIdLabel: { en: 'Mobile Number (Your Login ID)', bn: 'মোবাইল নম্বর (আপনার লগইন আইডি)' },
  emailLabel: { en: 'Email Address', bn: 'ইমেইল ঠিকানা' },
  nidBirthRegLabel: { en: 'NID / Birth Registration No.', bn: 'জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নং' },
  bloodGroupLabel: { en: 'Blood Group', bn: 'রক্তের গ্রুপ' },
  occupationLabel: { en: 'Occupation', bn: 'পেশা' },
  maritalStatusLabel: { en: 'Marital Status', bn: 'বৈবাহিক অবস্থা' },
  single: { en: 'Single', bn: 'অবিবাহিত' },
  married: { en: 'Married', bn: 'বিবাহিত' },
  selectedCourseLabel: { en: 'Selected Course', bn: 'নির্বাচিত কোর্স' },
  setLoginPasswordLabel: { en: 'Set Account Password', bn: 'একাউন্টের পাসওয়ার্ড সেট করুন' },
  confirmPasswordLabel: { en: 'Confirm Password', bn: 'পাসওয়ার্ড নিশ্চিত করুন' },
  passwordHintText: {
    en: 'You will use this password and your mobile number to log in to the Student Portal anytime.',
    bn: 'এই পাসওয়ার্ড ও আপনার মোবাইল নম্বর দিয়ে পরবর্তীতে স্টুডেন্ট পোর্টালে লগইন করতে পারবেন।',
  },
  submitAdmissionBtn: { en: 'Submit Admission Form', bn: 'ভর্তি ফরম সাবমিট করুন' },
  printAdmissionBtn: { en: 'Print Application Copy', bn: 'আবেদন কপি প্রিন্ট করুন' },
  declarationAgreement: {
    en: 'I certify that the information given above is true and accurate to the best of my knowledge.',
    bn: 'আমি এই মর্মে অঙ্গীকার করছি যে উপরে প্রদত্ত যাবতীয় তথ্য সত্য এবং নির্ভুল।',
  },

  // Payment Modal
  sendMoneyAndFeeTitle: { en: 'Send Money & Submit Fee Information', bn: 'সেন্ড মানি ও ফি পেমেন্ট তথ্য সাবমিট' },
  paymentSendMoneyInstructions: {
    en: 'Please send money to our authorized mobile banking accounts below and submit your TrxID and mobile number. Upon verification, your account will be updated.',
    bn: 'অনুগ্রহ করে নিচে দেওয়া মোবাইল ব্যাংকিং নম্বরে সেন্ড মানি করুন এবং আপনার ট্রানজেকশন আইডি ও মোবাইল নম্বর প্রদান করুন। এডমিন যাচাই করে আপনার একাউন্টে ফি যুক্ত করবেন।',
  },
  senderPhonePlaceholder: { en: 'e.g. 017XXXXXXXX', bn: 'যেমন: ০১৭XXXXXXXX' },
  trxIdPlaceholder: { en: 'e.g. BL9X72K9QA', bn: 'যেমন: BL9X72K9QA' },
  copyNumber: { en: 'Copy Number', bn: 'নম্বর কপি করুন' },
  numberCopied: { en: 'Copied!', bn: 'কপি হয়েছে!' },
  submitPaymentBtn: { en: 'Submit Payment & Send to WhatsApp', bn: 'পেমেন্ট সাবমিট ও হোয়াটসঅ্যাপে প্রেরণ' },
  paymentSuccessTitle: { en: 'Payment Details Submitted!', bn: 'পেমেন্ট তথ্য সফলভাবে পাঠানো হয়েছে!' },

  // Forgot Password
  forgotPasswordTitle: { en: 'Password Recovery / Reset Request', bn: 'পাসওয়ার্ড পুনরুদ্ধার / রিসেট রিকোয়েস্ট' },
  forgotPasswordInstruction: {
    en: 'Enter your registered mobile number and portal details. We will verify and send your password directly via WhatsApp.',
    bn: 'আপনার নিবন্ধিত মোবাইল নম্বর ও তথ্য দিন। আমরা যাচাই করে হোয়াটসঅ্যাপে আপনার পাসওয়ার্ড পাঠিয়ে দেব।',
  },
  sendWhatsAppRequest: { en: 'Send Request via WhatsApp', bn: 'হোয়াটসঅ্যাপে রিকোয়েস্ট পাঠান' },
  resetSubmittedNotice: {
    en: 'Reset request received. Our team will message your password on WhatsApp.',
    bn: 'রিকোয়েস্ট গ্রহণ করা হয়েছে। আমাদের টিম আপনার হোয়াটসঅ্যাপে পাসওয়ার্ড পাঠাবে।',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isBangla: boolean;
  t: (key: string) => string;
  trans: (enText: string, bnText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'actc_preferred_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default language is strictly 'en' as requested by the user!
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'bn' || saved === 'en') {
        return saved;
      }
    } catch {
      // ignore localStorage errors
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const t = (key: string): string => {
    const item = translations[key];
    if (!item) return key;
    return language === 'bn' ? item.bn : item.en;
  };

  const trans = (enText: string, bnText: string): string => {
    return language === 'bn' ? bnText : enText;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isBangla: language === 'bn',
        t,
        trans,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

/**
 * Polished, responsive Language Switcher Button that fits smoothly in the navbar,
 * dashboard headers, and mobile drawers without any layout shift.
 */
export const LanguageSwitcherButton: React.FC<{
  className?: string;
  variant?: 'navbar' | 'dashboard' | 'drawer';
}> = ({ className = '', variant = 'navbar' }) => {
  const { language, toggleLanguage, setLanguage } = useLanguage();

  if (variant === 'drawer') {
    return (
      <div className={`flex items-center justify-between p-2.5 rounded-lg bg-stone-800/90 border border-white/10 ${className}`}>
        <div className="flex items-center space-x-2 text-stone-300 text-xs font-medium">
          <Globe className="w-4 h-4 text-[#C5A880]" />
          <span>Language / ভাষা</span>
        </div>
        <div className="flex items-center bg-stone-900 rounded p-0.5 border border-white/10">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
              language === 'en'
                ? 'bg-[#C5A880] text-stone-950 shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('bn')}
            className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
              language === 'bn'
                ? 'bg-[#C5A880] text-stone-950 shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            বাংলা
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <button
        onClick={toggleLanguage}
        title={language === 'en' ? 'বাংলা ভাষায় পরিবর্তন করুন' : 'Switch to English'}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-medium transition-all shadow-2xs cursor-pointer ${className}`}
      >
        <Globe className="w-3.5 h-3.5 text-blue-600" />
        <span className="font-semibold text-stone-900">
          {language === 'en' ? 'বাংলা' : 'English'}
        </span>
      </button>
    );
  }

  // Default navbar variant - elegant glass pill matching the dark navbar aesthetic
  return (
    <button
      onClick={toggleLanguage}
      title={language === 'en' ? 'বাংলা ভাষায় পরিবর্তন করুন' : 'Switch to English'}
      className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 text-white text-xs font-medium tracking-wide transition-all duration-200 cursor-pointer backdrop-blur-xs shadow-2xs group ${className}`}
      aria-label="Toggle language between English and Bengali"
    >
      <Globe className="w-3.5 h-3.5 text-[#C5A880] group-hover:rotate-45 transition-transform duration-300" />
      <span className="font-semibold">
        {language === 'en' ? 'বাংলা' : 'English'}
      </span>
      <span className="text-[10px] text-stone-300 uppercase font-mono px-1 py-0.2 rounded bg-black/30">
        {language === 'en' ? 'EN' : 'বাং'}
      </span>
    </button>
  );
};
