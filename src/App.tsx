/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSlider } from './components/HeroSlider.tsx';
import { WelcomeSection } from './components/WelcomeSection.tsx';
import { FAQSection } from './components/FAQSection.tsx';
export { FAQSection };
import { Footer } from './components/Footer.tsx';
import { InfoModal } from './components/InfoModal.tsx';
import { CourseModal } from './components/CourseModal.tsx';
import { AdmissionFormModal } from './components/AdmissionFormModal.tsx';
import { JobPortalModal } from './components/JobPortalModal.tsx';
import { LoginModal, LoginRole } from './components/LoginModal.tsx';
import { StudentDashboard } from './components/StudentDashboard.tsx';
import { ApplicantDashboard } from './components/ApplicantDashboard.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { ApplicationPermissionModal } from './components/ApplicationPermissionModal.tsx';
import { OnlineServicesModal } from './components/OnlineServicesModal.tsx';
import { OnlineServicesSection } from './components/OnlineServicesSection.tsx';
import { StudentTestimonialSection } from './components/StudentTestimonialSection.tsx';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton.tsx';
import { SlideData, ModalContent, NoticeItem, StudentAccount, ApplicantAccount, JobApplication, StudentTestimonial, AdminCredentials, WebsiteSeoConfig } from './types.ts';
import {
  loadPersistentApplicants,
  savePersistentApplicants,
  loadPersistentStudents,
  savePersistentStudents,
  loadPersistentJobApplications,
  savePersistentJobApplications,
  loadPersistentNotices,
  savePersistentNotices,
  loadPersistentSession,
  savePersistentSession,
  downloadDatabaseBackupFile,
  restoreDatabaseFromBackup,
  loadPersistentTestimonials,
  savePersistentTestimonials,
  DEFAULT_TESTIMONIALS,
  loadPersistentAdminCredentials,
  savePersistentAdminCredentials,
  loadPersistentSeoConfig,
  savePersistentSeoConfig,
  applyWebsiteSeo,
  recordDeletedNoticeId,
  recordDeletedStudent,
  recordDeletedApplicant,
  recordDeletedJobAppId,
} from './utils/storageManager.ts';

const defaultNoticesList: NoticeItem[] = [
  {
    id: 1,
    title: 'New Computer Office Application Batch starts from 1st of next month',
    category: 'Student',
    date: '24 Oct 2026',
    description: 'Morning and Evening batches admission is ongoing. Limited seats for 3-Month & 6-Month courses. Under Bangladesh Post Office (বাংলাদেশ ডাক বিভাগ) certified curriculum.',
    urgent: true,
    pdfName: 'ACTC_Office_Application_Batch_Notice_2026.pdf',
  },
  {
    id: 2,
    title: 'Primary DPE Written Examination Admit Card download has started',
    category: 'Applicant',
    date: '22 Oct 2026',
    description: 'Directorate of Primary Education (DPE) Assistant Teacher exam admit card is now available. Download your admit card using User ID and Password.',
    urgent: true,
    pdfName: 'Primary_DPE_Admit_Card_Download_Notice.pdf',
  },
  {
    id: 3,
    title: 'Bangladesh Railway Data Entry Operator final application deadline 15 Dec',
    category: 'Applicant',
    date: '20 Oct 2026',
    description: 'Submit your online form before 15 December with photo and signature. Collect submitted copy from our Asad Computer service desk.',
    urgent: false,
    pdfName: 'BR_Data_Entry_Circular_Guidelines.pdf',
  },
  {
    id: 4,
    title: 'Bangladesh Post Office 6-Month Computer Certificate Verification Open',
    category: 'General',
    date: '18 Oct 2026',
    description: 'Roll verification and registration card distribution for July-December semester is open. Contact institute office at Bottola, Bhully Bazar.',
    urgent: false,
    pdfName: 'Post_Office_Certificate_Verification_Process.pdf',
  },
];

const defaultStudentsList: StudentAccount[] = [
  {
    id: 1,
    name: 'Sabbir Ahmed',
    rollNo: 'ACTC-2026-084',
    course: 'Computer Office Application (6 Months)',
    batch: 'Morning (10 AM - 12 PM)',
    phone: '01712-345678',
    email: 'sabbir.student@gmail.com',
    password: 'password123',
    totalFee: 4000,
    paidFee: 2500,
    dueFee: 1500,
    lastPaymentDate: '15 Oct 2026',
    typingSpeed: '42 WPM (Eng) / 30 WPM (Ban)',
    attendance: '96%',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Nusrat Jahan',
    rollNo: 'ACTC-2026-085',
    course: 'Computer Office Application (3 Months)',
    batch: 'Evening (4 PM - 6 PM)',
    phone: '01823-456789',
    email: 'nusrat.j@gmail.com',
    password: 'password123',
    totalFee: 2500,
    paidFee: 2500,
    dueFee: 0,
    lastPaymentDate: '20 Oct 2026',
    typingSpeed: '38 WPM (Eng) / 28 WPM (Ban)',
    attendance: '92%',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Tanvir Hossain',
    rollNo: 'ACTC-2026-072',
    course: 'Computer Office Application (6 Months)',
    batch: 'Friday Special Batch',
    phone: '01934-567890',
    email: 'tanvir.actc@gmail.com',
    password: 'password123',
    totalFee: 4000,
    paidFee: 4000,
    dueFee: 0,
    lastPaymentDate: '05 Oct 2026',
    typingSpeed: '45 WPM (Eng) / 35 WPM (Ban)',
    attendance: '98%',
    status: 'Certified',
  },
  {
    id: 4,
    name: 'Mehedi Hasan',
    rollNo: 'ACTC-2026-090',
    course: 'Computer Office Application (3 Months)',
    batch: 'Morning (8 AM - 10 AM)',
    phone: '01777-889900',
    email: 'mehedi.it@gmail.com',
    password: 'password123',
    totalFee: 2500,
    paidFee: 1500,
    dueFee: 1000,
    lastPaymentDate: '10 Oct 2026',
    typingSpeed: '32 WPM (Eng) / 22 WPM (Ban)',
    attendance: '88%',
    status: 'Active',
  },
];

const defaultApplicantsList: ApplicantAccount[] = [
  {
    id: 101,
    applicantName: 'Md. Tariqul Islam',
    nameBangla: 'মোঃ তরিকুল ইসলাম',
    fatherName: 'Md. Rafiqul Islam',
    fatherNameBangla: 'মোঃ রফিকুল ইসলাম',
    motherName: 'Tahmina Begum',
    motherNameBangla: 'তাহমিনা বেগম',
    dob: '1998-05-12',
    ageText: '28 Years 5 Months',
    gender: 'Male',
    nationality: 'Bangladeshi',
    religion: 'Islam',
    nidNumber: '19989419400000123',
    birthRegNo: '19989419412345678',
    passportId: '',
    maritalStatus: 'Single',
    spouseName: '',
    quota: 'Non-Quota',
    departmentalStatus: 'None',
    phone: '01712-345678',
    email: 'applicant@gmail.com',
    password: 'applicantpass',
    jobTitle: 'সহকারী শিক্ষক (Assistant Teacher)',
    refNo: 'APP-7291',
    feeStatus: 'Paid',
    feeAmount: 220,
    admitStatus: 'Processing',
    status: 'Processing',
    appliedDate: '25 Oct 2026',
    rollNo: 'ACTC-892145',
    typingSpeedBangla: '32 WPM',
    typingSpeedEnglish: '42 WPM',
    computerExperience: 'Computer Office Application 6 Months (Under Bangladesh Post Office)',
    isAccountCompleted: true,
    presentAddress: {
      careOf: 'Md. Rafiqul Islam',
      village: 'Bottola, Bhully Bazar',
      district: 'Thakurgaon',
      upazila: 'Thakurgaon Sadar',
      postOffice: 'Bhully',
      postCode: '5100',
    },
    permanentAddress: {
      careOf: 'Md. Rafiqul Islam',
      village: 'Bottola, Bhully Bazar',
      district: 'Thakurgaon',
      upazila: 'Thakurgaon Sadar',
      postOffice: 'Bhully',
      postCode: '5100',
    },
    educationList: [
      {
        id: 'ssc',
        exam: 'S.S.C',
        board: 'Dinajpur',
        roll: '458120',
        result: 'GPA 4.85 (Scale 5.00)',
        group: 'Science',
        passingYear: '2014',
        duration: '2 Years',
      },
      {
        id: 'hsc',
        exam: 'H.S.C',
        board: 'Dinajpur',
        roll: '210943',
        result: 'GPA 4.60 (Scale 5.00)',
        group: 'Science',
        passingYear: '2016',
        duration: '2 Years',
      },
      {
        id: 'graduation',
        exam: 'Graduation / Degree / Honors',
        board: 'National University (জাতীয় বিশ্ববিদ্যালয়)',
        roll: '782910',
        result: 'CGPA 3.45 (Scale 4.00)',
        group: 'Computer Science & Engineering (CSE)',
        passingYear: '2020',
        duration: '4 Years',
      },
      {
        id: 'masters',
        exam: 'Masters',
        board: 'National University (জাতীয় বিশ্ববিদ্যালয়)',
        roll: '918234',
        result: 'CGPA 3.55 (Scale 4.00)',
        group: 'Computer Science & Engineering (CSE)',
        passingYear: '2022',
        duration: '1 Year',
      },
    ],
  },
];

const defaultJobApplicationsList: JobApplication[] = [
  {
    id: 1001,
    applicantId: 101,
    applicantName: 'Md. Tariqul Islam',
    nameBangla: 'মোঃ তরিকুল ইসলাম',
    phone: '01712-345678',
    email: 'applicant@gmail.com',
    circularTitle: 'Directorate of Primary Education (DPE) Assistant Teacher Recruitment',
    postName: 'সহকারী শিক্ষক (Assistant Teacher)',
    appliedDate: '25 Oct 2026',
    feeStatus: 'Paid',
    feeAmount: 220,
    admitStatus: 'Processing',
    status: 'Processing',
    rollNo: 'ACTC-892145',
    refNo: 'APP-7291',
    bioDataSnapshot: defaultApplicantsList[0],
  },
  {
    id: 1002,
    applicantId: 101,
    applicantName: 'Md. Tariqul Islam',
    nameBangla: 'মোঃ তরিকুল ইসলাম',
    phone: '01712-345678',
    email: 'applicant@gmail.com',
    circularTitle: 'Bangladesh Railway (BR) Data Entry Operator Circular',
    postName: 'ডাটা এন্ট্রি অপারেটর (Data Entry Operator)',
    appliedDate: '20 Oct 2026',
    feeStatus: 'Paid',
    feeAmount: 220,
    admitStatus: 'Ready',
    status: 'Completed',
    rollNo: 'ACTC-458120',
    refNo: 'APP-3810',
    bioDataSnapshot: defaultApplicantsList[0],
  },
];

export default function App() {
  // Session persistence across all keys
  const savedSession = loadPersistentSession<{ currentView?: any; currentApplicantId?: number; currentStudentId?: number }>({});
  const [currentView, setCurrentView] = useState<'home' | 'student-dashboard' | 'applicant-dashboard' | 'admin-dashboard'>(savedSession.currentView || 'home');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);
  
  // Dedicated state for Course, Admission, Job Portal, and Login modals
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);
  const [jobPortalOpen, setJobPortalOpen] = useState(false);
  
  // Dedicated state for Online Services & Land Desk with Name-Plate UI
  const [onlineServicesModalOpen, setOnlineServicesModalOpen] = useState(false);
  const [selectedServiceIdForModal, setSelectedServiceIdForModal] = useState<string | null>(null);

  const handleOpenOnlineServices = (serviceId?: string) => {
    setSelectedServiceIdForModal(serviceId || null);
    setOnlineServicesModalOpen(true);
  };
  
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<LoginRole>('applicant');
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');

  // Shared System State persisted across all keys to prevent ANY loss on website reload/update
  const [notices, setNotices] = useState<NoticeItem[]>(() =>
    loadPersistentNotices(defaultNoticesList)
  );

  const [students, setStudents] = useState<StudentAccount[]>(() =>
    loadPersistentStudents(defaultStudentsList)
  );

  const [applicants, setApplicants] = useState<ApplicantAccount[]>(() =>
    loadPersistentApplicants(defaultApplicantsList)
  );

  const [currentStudentId, setCurrentStudentId] = useState<number | undefined>(() =>
    savedSession.currentStudentId || 1
  );
  const [currentApplicantId, setCurrentApplicantId] = useState<number | undefined>(() =>
    savedSession.currentApplicantId || (defaultApplicantsList[0]?.id || 101)
  );

  // Global Job Applications persisted across keys
  const [jobApplications, setJobApplications] = useState<JobApplication[]>(() =>
    loadPersistentJobApplications(defaultJobApplicationsList)
  );
  const [pendingCircularForPermission, setPendingCircularForPermission] = useState<string | null>(null);

  // Testimonials persisted across storage keys
  const [testimonials, setTestimonials] = useState<StudentTestimonial[]>(() =>
    loadPersistentTestimonials(DEFAULT_TESTIMONIALS)
  );

  // Admin Credentials persisted across storage keys
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() =>
    loadPersistentAdminCredentials()
  );

  // Dynamic Website SEO Configuration persisted across storage keys
  const [seoConfig, setSeoConfig] = useState<WebsiteSeoConfig>(() =>
    loadPersistentSeoConfig()
  );

  // Immediately apply SEO and structured data to document head on mount and changes
  useEffect(() => {
    applyWebsiteSeo(seoConfig);
  }, [seoConfig]);

  // Synchronize state changes to permanent storage
  useEffect(() => {
    savePersistentNotices(notices);
  }, [notices]);

  useEffect(() => {
    savePersistentStudents(students);
  }, [students]);

  useEffect(() => {
    savePersistentApplicants(applicants);
  }, [applicants]);

  useEffect(() => {
    savePersistentJobApplications(jobApplications);
  }, [jobApplications]);

  useEffect(() => {
    savePersistentTestimonials(testimonials);
  }, [testimonials]);

  useEffect(() => {
    savePersistentAdminCredentials(adminCredentials);
  }, [adminCredentials]);

  useEffect(() => {
    savePersistentSeoConfig(seoConfig);
  }, [seoConfig]);

  useEffect(() => {
    savePersistentSession({ currentView, currentApplicantId, currentStudentId });
  }, [currentView, currentApplicantId, currentStudentId]);

  // Handler for Admin Credentials update from Admin Panel
  const handleUpdateAdminCredentials = (newCreds: AdminCredentials) => {
    setAdminCredentials(newCreds);
    savePersistentAdminCredentials(newCreds);
  };

  // Handler for Website SEO update from Admin Panel
  const handleUpdateSeoConfig = (newSeo: WebsiteSeoConfig) => {
    setSeoConfig(newSeo);
    savePersistentSeoConfig(newSeo);
    applyWebsiteSeo(newSeo);
  };

  // Handlers for Testimonials
  const handleAddTestimonial = (testimonial: StudentTestimonial) => {
    setTestimonials((prev) => {
      const next = [testimonial, ...prev];
      savePersistentTestimonials(next);
      return next;
    });
  };

  const handleUpdateTestimonial = (testimonial: StudentTestimonial) => {
    setTestimonials((prev) => {
      const next = prev.map((t) => (t.id === testimonial.id ? testimonial : t));
      savePersistentTestimonials(next);
      return next;
    });
  };

  const handleDeleteTestimonial = (id: number) => {
    setTestimonials((prev) => {
      const next = prev.filter((t) => t.id !== id);
      savePersistentTestimonials(next);
      return next;
    });
  };

  // Handlers for Notices
  const handleAddNotice = (notice: NoticeItem) => {
    setNotices((prev) => {
      const next = [notice, ...prev];
      savePersistentNotices(next);
      return next;
    });
  };

  const handleDeleteNotice = (id: number) => {
    recordDeletedNoticeId(id);
    setNotices((prev) => {
      const next = prev.filter((n) => n.id !== id);
      savePersistentNotices(next);
      return next;
    });
  };

  // Handlers for Students
  const handleUpdateStudent = (updatedStudent: StudentAccount) => {
    setStudents((prev) => {
      const next = prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
      savePersistentStudents(next);
      return next;
    });
  };

  const handleAddStudent = (newStudent: StudentAccount) => {
    setStudents((prev) => {
      const exists = prev.some(
        (s) =>
          s.id === newStudent.id ||
          (s.phone && cleanPhone(s.phone) === cleanPhone(newStudent.phone)) ||
          (s.rollNo && s.rollNo.toLowerCase() === newStudent.rollNo.toLowerCase())
      );
      const next = exists
        ? prev.map((s) =>
            s.id === newStudent.id ||
            (s.phone && cleanPhone(s.phone) === cleanPhone(newStudent.phone)) ||
            (s.rollNo && s.rollNo.toLowerCase() === newStudent.rollNo.toLowerCase())
              ? { ...s, ...newStudent }
              : s
          )
        : [newStudent, ...prev];
      savePersistentStudents(next);
      return next;
    });
    setCurrentStudentId(newStudent.id);
  };

  const handleDeleteStudent = (id: number) => {
    const studentToDelete = students.find((s) => s.id === id);
    recordDeletedStudent(id, studentToDelete?.phone, studentToDelete?.rollNo);
    setStudents((prev) => {
      const next = prev.filter((s) => s.id !== id);
      savePersistentStudents(next);
      return next;
    });
    if (currentStudentId === id) {
      setCurrentStudentId(undefined);
      setCurrentView('home');
    }
  };

  // Handlers for Applicants
  const handleAddApplicant = (newApplicant: ApplicantAccount) => {
    setApplicants((prev) => {
      const exists = prev.some(
        (a) =>
          a.id === newApplicant.id ||
          (a.phone && cleanPhone(a.phone) === cleanPhone(newApplicant.phone)) ||
          (a.email && a.email.toLowerCase() === newApplicant.email.toLowerCase())
      );
      const nextList = exists
        ? prev.map((a) =>
            a.id === newApplicant.id ||
            (a.phone && cleanPhone(a.phone) === cleanPhone(newApplicant.phone)) ||
            (a.email && a.email.toLowerCase() === newApplicant.email.toLowerCase())
              ? { ...a, ...newApplicant }
              : a
          )
        : [newApplicant, ...prev];
      savePersistentApplicants(nextList);
      return nextList;
    });
    setCurrentApplicantId(newApplicant.id);
  };

  const handleUpdateApplicant = (updatedApplicant: ApplicantAccount) => {
    setApplicants((prev) => {
      const nextList = prev.map((a) => (a.id === updatedApplicant.id ? updatedApplicant : a));
      savePersistentApplicants(nextList);
      return nextList;
    });
    // Also update any bioDataSnapshot in jobApplications for this applicant
    setJobApplications((prevApps) => {
      const nextApps = prevApps.map((app) =>
        app.applicantId === updatedApplicant.id
          ? { ...app, bioDataSnapshot: { ...updatedApplicant, jobTitle: app.postName } }
          : app
      );
      savePersistentJobApplications(nextApps);
      return nextApps;
    });
  };

  // Helper function to clean phone for checking
  function cleanPhone(p?: string) {
    if (!p) return '';
    let digits = p.replace(/[^0-9]/g, '');
    if (digits.startsWith('880')) {
      digits = digits.slice(2);
    }
    return digits;
  }

  // Restore whole database from backup JSON file
  const handleRestoreDatabase = (jsonStr: string): boolean => {
    const res = restoreDatabaseFromBackup(jsonStr);
    if (res.success) {
      if (res.applicants && res.applicants.length > 0) setApplicants(res.applicants);
      if (res.students && res.students.length > 0) setStudents(res.students);
      if (res.jobApplications && res.jobApplications.length > 0) setJobApplications(res.jobApplications);
      if (res.notices && res.notices.length > 0) setNotices(res.notices);
      if (res.testimonials && res.testimonials.length > 0) setTestimonials(res.testimonials);
      if (res.adminCredentials) setAdminCredentials(res.adminCredentials);
      if (res.seoConfig) {
        setSeoConfig(res.seoConfig);
        applyWebsiteSeo(res.seoConfig);
      }
      return true;
    }
    return false;
  };

  // Handlers for Job Applications
  // CRITICAL REQUIREMENT: Application MUST initially show 'Processing' (প্রক্রিয়াধীন) and NEVER 'Ready'/'Completed' until Admin marks it
  const handleApplyJob = (postName: string, circularTitle: string) => {
    const applicant = applicants.find((a) => a.id === currentApplicantId) || applicants[0];
    const newRoll = `ACTC-${Math.floor(100000 + Math.random() * 900000)}`;
    const newRef = `APP-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    const newApp: JobApplication = {
      id: Date.now(),
      applicantId: applicant.id,
      applicantName: applicant.applicantName || 'Applicant',
      nameBangla: applicant.nameBangla,
      phone: applicant.phone,
      email: applicant.email,
      circularTitle: circularTitle,
      postName: postName,
      appliedDate: today,
      feeStatus: 'Pending',
      feeAmount: 220,
      paymentVerificationStatus: 'None',
      admitStatus: 'Processing', // <-- CRITICAL: Strictly 'Processing' (প্রক্রিয়াধীন) upon application!
      status: 'Processing',
      rollNo: newRoll,
      refNo: newRef,
      bioDataSnapshot: {
        ...applicant,
        jobTitle: postName,
        rollNo: newRoll,
        refNo: newRef,
        appliedDate: today,
        feeStatus: 'Pending',
        paymentVerificationStatus: 'None',
        admitStatus: 'Processing',
        status: 'Processing',
      },
    };

    setJobApplications((prev) => [newApp, ...prev]);

    const updatedApplicant: ApplicantAccount = {
      ...applicant,
      jobTitle: postName,
      rollNo: newRoll,
      refNo: newRef,
      feeStatus: 'Pending',
      feeAmount: 220,
      paymentVerificationStatus: 'None',
      admitStatus: 'Processing', // <-- STRICTLY 'Processing'
      status: 'Processing',
      appliedDate: today,
      applications: [newApp, ...(applicant.applications || [])],
    };
    handleUpdateApplicant(updatedApplicant);
    setPendingCircularForPermission(null);
  };

  const handleUpdateJobApplication = (updatedApp: JobApplication) => {
    setJobApplications((prev) =>
      prev.map((a) => (a.id === updatedApp.id ? updatedApp : a))
    );

    // Synchronize applicant record so that when Admin toggles Processing <-> Completed,
    // the applicant's profile and applications reflect the new status immediately!
    setApplicants((prevApplicants) =>
      prevApplicants.map((applicant) => {
        if (applicant.id === updatedApp.applicantId || (applicant.phone && applicant.phone === updatedApp.phone)) {
          const updatedAppsList = (applicant.applications || []).map((app) =>
            app.id === updatedApp.id ? updatedApp : app
          );
          return {
            ...applicant,
            admitStatus: updatedApp.admitStatus,
            status: updatedApp.status || (updatedApp.admitStatus === 'Ready' ? 'Completed' : 'Processing'),
            applications: updatedAppsList,
          };
        }
        return applicant;
      })
    );
  };

  const handleDeleteJobApplication = (id: number) => {
    recordDeletedJobAppId(id);
    setJobApplications((prev) => {
      const next = prev.filter((a) => a.id !== id);
      savePersistentJobApplications(next);
      return next;
    });
    setApplicants((prev) => {
      const next = prev.map((applicant) => ({
        ...applicant,
        applications: (applicant.applications || []).filter((app) => app.id !== id),
      }));
      savePersistentApplicants(next);
      return next;
    });
  };

  const handleDeleteApplicant = (id: number) => {
    const applicantToDelete = applicants.find((a) => a.id === id);
    recordDeletedApplicant(id, applicantToDelete?.phone, applicantToDelete?.email);
    setApplicants((prev) => {
      const next = prev.filter((a) => a.id !== id);
      savePersistentApplicants(next);
      return next;
    });
    // Also remove all associated job applications for this applicant
    setJobApplications((prev) => {
      const next = prev.filter((app) => app.applicantId !== id);
      savePersistentJobApplications(next);
      return next;
    });
    if (currentApplicantId === id) {
      setCurrentApplicantId(undefined);
      setCurrentView('home');
    }
  };

  const handleSelectNavItem = (item: string, details?: string) => {
    if (
      item === 'Online Services' ||
      item === 'onlineServices' ||
      item === 'অনলাইন সেবা' ||
      item === 'ডিজিটাল ভূমি সেবা'
    ) {
      handleOpenOnlineServices(item === 'ডিজিটাল ভূমি সেবা' ? 'digital-land-services' : undefined);
      return;
    }

    if (
      item === 'Testimonials' ||
      item === 'Student Reviews' ||
      item === 'মতামত' ||
      item === 'শিক্ষার্থীর মতামত' ||
      item === 'সাফল্যের গল্প' ||
      item === 'রিভিউ'
    ) {
      const el = document.getElementById('student-testimonials');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    let customCategory = 'Asad Computer & Training Center';
    let customDescription =
      details ||
      `Information regarding ${item} at Asad Computer & Training Center. Our center is open for new admissions and immediate online application assistance.`;

    if (item === 'Contact' || item === 'Contact & Location') {
      customCategory = 'Get In Touch';
      customDescription =
        'Address: Bottola, Bhully Bazar, Bhully, Thakurgaon. Mobile: 01773-733654, 01864-399871. WhatsApp: 01407-215416. Email: bhulli.postoffice@gmail.com. We are open 7 days a week for training and urgent application processing.';
    }

    setModalContent({
      category: customCategory,
      title: item,
      subtitle: 'Training Programs & Online Services',
      description: customDescription,
    });
    setModalOpen(true);
  };

  const handleCtaClick = (type: 'programs' | 'learn-more', slide: SlideData) => {
    if (slide.id === 1) {
      if (type === 'programs') {
        // "EXPLORE COURSES" -> Opens Course modal (Computer Office Application -> Admission)
        setCourseModalOpen(true);
      } else {
        // "ONLINE SERVICES" -> Opens Online Services Modal with Name Plates
        handleOpenOnlineServices();
      }
    } else if (slide.id === 2) {
      if (type === 'programs') {
        // "ENROLL IN COURSE" -> Directly opens Admission Form
        setAdmissionModalOpen(true);
      } else {
        // "COURSE SYLLABUS" -> Opens Course Modal
        setCourseModalOpen(true);
      }
    } else {
      if (type === 'programs') {
        // "DIGITAL LAND SERVICES" -> Opens Digital Land Services name plate directly
        handleOpenOnlineServices('digital-land-services');
      } else {
        // "VIEW ALL SERVICES" -> Opens all online services
        handleOpenOnlineServices();
      }
    }
  };

  const [selectedJobTitleForLogin, setSelectedJobTitleForLogin] = useState<string | undefined>(undefined);
  const [initialEmailOrIdForLogin, setInitialEmailOrIdForLogin] = useState<string | undefined>(undefined);

  const handleOpenLogin = (
    role: LoginRole = 'applicant',
    mode: 'login' | 'register' = 'login',
    jobTitle?: string,
    initialEmailOrId?: string
  ) => {
    setLoginRole(role);
    setLoginMode(mode);
    setSelectedJobTitleForLogin(jobTitle);
    setInitialEmailOrIdForLogin(initialEmailOrId);
    setJobPortalOpen(false); // Close JobPortalModal if open so LoginModal is in focus
    setLoginModalOpen(true);
  };

  const handleLoginSuccess = (
    role: LoginRole,
    user?: StudentAccount | ApplicantAccount
  ) => {
    setLoginModalOpen(false);
    setJobPortalOpen(false);
    setCourseModalOpen(false);
    setAdmissionModalOpen(false);

    if (role === 'student') {
      if (user && 'rollNo' in user) {
        setCurrentStudentId(user.id);
      }
      setCurrentView('student-dashboard');
    } else if (role === 'institute') {
      setCurrentView('admin-dashboard');
    } else {
      if (user && 'applicantName' in user) {
        setCurrentApplicantId(user.id);
      }
      if (selectedJobTitleForLogin) {
        setPendingCircularForPermission(selectedJobTitleForLogin);
        setSelectedJobTitleForLogin(undefined);
      }
      setCurrentView('applicant-dashboard');
    }
  };

  const currentStudent = students.find((s) => s.id === currentStudentId) || students[0];
  const currentApplicant = applicants.find((a) => a.id === currentApplicantId) || applicants[0];

  // If Student Dashboard is active
  if (currentView === 'student-dashboard') {
    return (
      <>
        <StudentDashboard
          onLogout={() => setCurrentView('home')}
          onBackToHome={() => setCurrentView('home')}
          studentData={currentStudent}
          notices={notices.filter((n) => n.category === 'Student' || n.category === 'General')}
          onUpdateStudent={handleUpdateStudent}
        />
        <FloatingWhatsAppButton phoneNumber="01407-215416" />
      </>
    );
  }

  // If Applicant Dashboard is active
  if (currentView === 'applicant-dashboard') {
    return (
      <>
        <ApplicantDashboard
          onLogout={() => setCurrentView('home')}
          onBackToHome={() => setCurrentView('home')}
          onOpenJobPortal={() => setJobPortalOpen(true)}
          applicantData={currentApplicant}
          onUpdateApplicant={handleUpdateApplicant}
          onUpdateJobApplication={handleUpdateJobApplication}
          notices={notices}
          jobApplications={jobApplications}
          onApplyJob={handleApplyJob}
          initialPendingCircular={pendingCircularForPermission}
          onClearInitialPendingCircular={() => setPendingCircularForPermission(null)}
        />
        <FloatingWhatsAppButton phoneNumber="01407-215416" />
      </>
    );
  }

  // If Institute / Admin Dashboard is active
  if (currentView === 'admin-dashboard') {
    return (
      <AdminDashboard
        onLogout={() => setCurrentView('home')}
        onBackToHome={() => setCurrentView('home')}
        adminCredentials={adminCredentials}
        onUpdateAdminCredentials={handleUpdateAdminCredentials}
        seoConfig={seoConfig}
        onUpdateSeoConfig={handleUpdateSeoConfig}
        notices={notices}
        onAddNotice={handleAddNotice}
        onDeleteNotice={handleDeleteNotice}
        students={students}
        onUpdateStudent={handleUpdateStudent}
        onAddStudent={handleAddStudent}
        onDeleteStudent={handleDeleteStudent}
        applicants={applicants}
        onUpdateApplicant={handleUpdateApplicant}
        onDeleteApplicant={handleDeleteApplicant}
        jobApplications={jobApplications}
        onUpdateJobApplication={handleUpdateJobApplication}
        onDeleteJobApplication={handleDeleteJobApplication}
        testimonials={testimonials}
        onAddTestimonial={handleAddTestimonial}
        onUpdateTestimonial={handleUpdateTestimonial}
        onDeleteTestimonial={handleDeleteTestimonial}
        onExportDatabase={() => downloadDatabaseBackupFile(applicants, students, jobApplications, notices, testimonials, adminCredentials, seoConfig)}
        onRestoreDatabase={handleRestoreDatabase}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col font-sans selection:bg-[#C5A880]/30 selection:text-stone-900">
      {/* Top Header / Navigation Bar with Login dropdown */}
      <Navbar
        onSelectNavItem={handleSelectNavItem}
        onOpenCourseModal={() => setCourseModalOpen(true)}
        onOpenAdmission={() => setAdmissionModalOpen(true)}
        onOpenJobPortal={() => setJobPortalOpen(true)}
        onOpenLogin={handleOpenLogin}
        onOpenOnlineServices={handleOpenOnlineServices}
      />

      {/* Hero Carousel Section */}
      <main className="flex-1">
        <HeroSlider onCtaClick={handleCtaClick} />

        {/* Welcome Section */}
        <WelcomeSection
          onLearnMore={() =>
            handleSelectNavItem(
              'About Center',
              'Asad Computer & Training Center was established at Bottola, Bhully Bazar, Bhully, Thakurgaon to bridge digital literacy gaps and provide swift, dependable e-services for all citizens and students.'
            )
          }
          onOpenCourseModal={() => setCourseModalOpen(true)}
          onOpenOnlineServices={handleOpenOnlineServices}
        />

        {/* Online Services Showcase with Name-Plate UI/UX Design */}
        <OnlineServicesSection onOpenOnlineServices={handleOpenOnlineServices} />

        {/* Common Questions & Answers / FAQ Section */}
        <FAQSection
          onOpenCourseModal={() => setCourseModalOpen(true)}
          onOpenAdmission={() => setAdmissionModalOpen(true)}
          onOpenJobPortal={() => setJobPortalOpen(true)}
          onContactClick={() =>
            handleSelectNavItem(
              'Contact & Location',
              'Asad Computer & Training Center, Bottola, Bhully Bazar, Bhully, Thakurgaon. Mobile: 01773-733654, WhatsApp: 01407-215416, Email: bhulli.postoffice@gmail.com'
            )
          }
        />

        {/* Student Testimonials & Success Stories Section */}
        <StudentTestimonialSection
          testimonials={testimonials}
          onOpenAdmission={() => setAdmissionModalOpen(true)}
          onOpenCourseModal={() => setCourseModalOpen(true)}
        />
      </main>

      {/* Footer Section */}
      <Footer
        onSelectNavItem={handleSelectNavItem}
        onOpenCourseModal={() => setCourseModalOpen(true)}
        onOpenAdmission={() => setAdmissionModalOpen(true)}
        onOpenOnlineServices={handleOpenOnlineServices}
      />

      {/* Login Modal supporting Student Login, Applicant Login, Institute Login, and Applicant Registration */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        initialRole={loginRole}
        initialMode={loginMode}
        initialJobTitle={selectedJobTitleForLogin}
        initialEmailOrId={initialEmailOrIdForLogin}
        students={students}
        applicants={applicants}
        adminCredentials={adminCredentials}
        onRegisterApplicant={handleAddApplicant}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Job Portal / Notice Modal */}
      <JobPortalModal
        isOpen={jobPortalOpen}
        onClose={() => setJobPortalOpen(false)}
        onOpenAdmission={() => setAdmissionModalOpen(true)}
        notices={notices}
        students={students}
        applicants={applicants}
        onOpenLogin={handleOpenLogin}
        onRegisterApplicant={handleAddApplicant}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Course Selection Modal (Course -> Computer Office Application -> Admission) */}
      <CourseModal
        isOpen={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        onOpenAdmission={() => setAdmissionModalOpen(true)}
      />

      {/* Official Admission Form Modal with Persistent Registration & Password Setup */}
      <AdmissionFormModal
        isOpen={admissionModalOpen}
        onClose={() => setAdmissionModalOpen(false)}
        defaultCourse="Computer Office Application"
        onRegisterStudent={handleAddStudent}
        onDirectLogin={(student) => {
          setCurrentStudentId(student.id);
          setCurrentView('student-dashboard');
        }}
        onOpenStudentLogin={(phoneOrRoll) => {
          handleOpenLogin('student', 'login', undefined, phoneOrRoll);
        }}
      />

      {/* Dedicated Online Services & Digital Land Desk with Executive Name-Plate UI/UX Design */}
      <OnlineServicesModal
        isOpen={onlineServicesModalOpen}
        onClose={() => setOnlineServicesModalOpen(false)}
        initialServiceId={selectedServiceIdForModal}
      />

      {/* General Information Modal for CTAs and Navigation items */}
      <InfoModal
        isOpen={modalOpen}
        content={modalContent}
        onClose={() => setModalOpen(false)}
      />

      {/* Floating WhatsApp Quick Inquiries Desk */}
      <FloatingWhatsAppButton phoneNumber="01407-215416" />
    </div>
  );
}
