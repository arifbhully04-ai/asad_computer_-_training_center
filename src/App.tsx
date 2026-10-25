/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroSlider } from './components/HeroSlider.tsx';
import { WelcomeSection } from './components/WelcomeSection.tsx';
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
import { SlideData, ModalContent, NoticeItem, StudentAccount, ApplicantAccount, JobApplication } from './types.ts';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'student-dashboard' | 'applicant-dashboard' | 'admin-dashboard'>('home');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);
  
  // Dedicated state for Course, Admission, Job Portal, and Login modals
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);
  const [jobPortalOpen, setJobPortalOpen] = useState(false);
  
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<LoginRole>('applicant');
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');

  // Shared System State across Admin, Student, and Applicant portals
  const [notices, setNotices] = useState<NoticeItem[]>([
    {
      id: 1,
      title: 'New Computer Office Application Batch starts from 1st of next month',
      category: 'Student',
      date: '24 Oct 2026',
      description: 'Morning and Evening batches admission is ongoing. Limited seats for 3-Month & 6-Month courses. Technical Education Board certified curriculum.',
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
      title: 'Govt Technical Education Board 6-Month Certificate Verification Open',
      category: 'General',
      date: '18 Oct 2026',
      description: 'Roll verification and registration card distribution for July-December semester is open. Contact institute office at Bottola, Bhully Bazar.',
      urgent: false,
      pdfName: 'BTEB_Certificate_Verification_Process.pdf',
    },
  ]);

  const [students, setStudents] = useState<StudentAccount[]>([
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
  ]);

  const [applicants, setApplicants] = useState<ApplicantAccount[]>([
    {
      id: 1,
      applicantName: '',
      nameBangla: '',
      fatherName: '',
      fatherNameBangla: '',
      motherName: '',
      motherNameBangla: '',
      dob: '',
      ageText: '',
      gender: 'Male',
      nationality: 'Bangladeshi',
      religion: 'Islam',
      nidNumber: '',
      birthRegNo: '',
      passportId: '',
      maritalStatus: 'Single',
      spouseName: '',
      quota: 'Non-Quota',
      departmentalStatus: 'None',
      phone: '',
      email: '',
      password: 'applicantpass',
      jobTitle: '',
      refNo: '',
      feeStatus: 'Pending',
      feeAmount: 0,
      admitStatus: 'Processing',
      appliedDate: '',
      rollNo: '',
      typingSpeedBangla: '',
      typingSpeedEnglish: '',
      computerExperience: '',
      isAccountCompleted: false,
      presentAddress: {
        careOf: '',
        village: '',
        district: 'Thakurgaon',
        upazila: 'Thakurgaon Sadar',
        postOffice: '',
        postCode: '',
      },
      permanentAddress: {
        careOf: '',
        village: '',
        district: 'Thakurgaon',
        upazila: 'Thakurgaon Sadar',
        postOffice: '',
        postCode: '',
      },
      educationList: [
        {
          id: 'ssc',
          exam: 'S.S.C',
          board: 'Dinajpur',
          roll: '',
          result: '',
          group: 'Science',
          passingYear: '',
          duration: '2 Years',
        },
        {
          id: 'hsc',
          exam: 'H.S.C',
          board: 'Dinajpur',
          roll: '',
          result: '',
          group: 'Science',
          passingYear: '',
          duration: '2 Years',
        },
        {
          id: 'graduation',
          exam: 'Graduation / Degree / Honors',
          board: 'National University (জাতীয় বিশ্ববিদ্যালয়)',
          roll: '',
          result: '',
          group: 'Computer Science & Engineering (CSE)',
          passingYear: '',
          duration: '4 Years',
        },
        {
          id: 'masters',
          exam: 'Masters',
          board: 'National University (জাতীয় বিশ্ববিদ্যালয়)',
          roll: '',
          result: '',
          group: 'Computer Science & Engineering (CSE)',
          passingYear: '',
          duration: '1 Year',
        },
      ],
    },
  ]);

  const [currentStudentId, setCurrentStudentId] = useState<number>(1);
  const [currentApplicantId, setCurrentApplicantId] = useState<number>(1);

  // Handlers for Notices
  const handleAddNotice = (notice: NoticeItem) => {
    setNotices((prev) => [notice, ...prev]);
  };

  const handleDeleteNotice = (id: number) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  // Handlers for Students
  const handleUpdateStudent = (updatedStudent: StudentAccount) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
  };

  const handleAddStudent = (newStudent: StudentAccount) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const handleDeleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  // Handlers for Applicants
  const handleAddApplicant = (newApplicant: ApplicantAccount) => {
    setApplicants((prev) => [newApplicant, ...prev]);
    setCurrentApplicantId(newApplicant.id);
  };

  const handleUpdateApplicant = (updatedApplicant: ApplicantAccount) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === updatedApplicant.id ? updatedApplicant : a))
    );
  };

  // Global Job Applications submitted by applicants with specific post names
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [pendingCircularForPermission, setPendingCircularForPermission] = useState<string | null>(null);

  // Handlers for Job Applications
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
      feeStatus: 'Paid',
      feeAmount: 220,
      admitStatus: 'Processing',
      rollNo: newRoll,
      refNo: newRef,
      bioDataSnapshot: {
        ...applicant,
        jobTitle: postName,
        rollNo: newRoll,
        refNo: newRef,
        appliedDate: today,
      },
    };

    setJobApplications((prev) => [newApp, ...prev]);

    const updatedApplicant: ApplicantAccount = {
      ...applicant,
      jobTitle: postName,
      rollNo: newRoll,
      refNo: newRef,
      feeStatus: 'Paid',
      feeAmount: 220,
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
  };

  const handleDeleteJobApplication = (id: number) => {
    setJobApplications((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDeleteApplicant = (id: number) => {
    setApplicants((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSelectNavItem = (item: string, details?: string) => {
    let customCategory = 'Asad Computer & Training Center';
    let customDescription =
      details ||
      `Information regarding ${item} at Asad Computer & Training Center. Our center is open for new admissions and immediate online application assistance.`;

    if (item === 'Online Services') {
      customCategory = 'Digital Services Desk';
      customDescription =
        'Complete online application support: Bangladesh Government Jobs (BPSC, NTRCA, Primary, Defense, Railway, Ministries), University & College Online Admissions, Passport & Visa Form Fill-up, NID & Birth Registration, Online Tax/e-TIN, Result Checking, Admit Card download, and document scanning & printing.';
    } else if (item === 'Contact' || item === 'Contact & Location') {
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
        handleSelectNavItem(
          'Online Services',
          'Our online desk facilitates government job circular applications, university admissions, passport form submission, NID corrections, and document verification services at Bottola, Bhully Bazar, Thakurgaon.'
        );
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
        // "GET ADMISSION" -> Opens Admission Form
        setAdmissionModalOpen(true);
      } else {
        handleSelectNavItem(
          'Contact & Location',
          'Visit Asad Computer & Training Center at Bottola, Bhully Bazar, Bhully, Thakurgaon. Mobile: 01773-733654, 01864-399871, WhatsApp: 01407-215416.'
        );
      }
    }
  };

  const [selectedJobTitleForLogin, setSelectedJobTitleForLogin] = useState<string | undefined>(undefined);

  const handleOpenLogin = (
    role: LoginRole = 'applicant',
    mode: 'login' | 'register' = 'login',
    jobTitle?: string
  ) => {
    setLoginRole(role);
    setLoginMode(mode);
    setSelectedJobTitleForLogin(jobTitle);
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
      <StudentDashboard
        onLogout={() => setCurrentView('home')}
        onBackToHome={() => setCurrentView('home')}
        studentData={currentStudent}
        notices={notices.filter((n) => n.category === 'Student' || n.category === 'General')}
      />
    );
  }

  // If Applicant Dashboard is active
  if (currentView === 'applicant-dashboard') {
    return (
      <ApplicantDashboard
        onLogout={() => setCurrentView('home')}
        onBackToHome={() => setCurrentView('home')}
        onOpenJobPortal={() => setJobPortalOpen(true)}
        applicantData={currentApplicant}
        onUpdateApplicant={handleUpdateApplicant}
        notices={notices}
        jobApplications={jobApplications}
        onApplyJob={handleApplyJob}
        initialPendingCircular={pendingCircularForPermission}
        onClearInitialPendingCircular={() => setPendingCircularForPermission(null)}
      />
    );
  }

  // If Institute / Admin Dashboard is active
  if (currentView === 'admin-dashboard') {
    return (
      <AdminDashboard
        onLogout={() => setCurrentView('home')}
        onBackToHome={() => setCurrentView('home')}
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
        />
      </main>

      {/* Footer Section */}
      <Footer
        onSelectNavItem={handleSelectNavItem}
        onOpenCourseModal={() => setCourseModalOpen(true)}
        onOpenAdmission={() => setAdmissionModalOpen(true)}
      />

      {/* Login Modal supporting Student Login, Applicant Login, Institute Login, and Applicant Registration */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        initialRole={loginRole}
        initialMode={loginMode}
        initialJobTitle={selectedJobTitleForLogin}
        students={students}
        applicants={applicants}
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

      {/* Official Admission Form Modal */}
      <AdmissionFormModal
        isOpen={admissionModalOpen}
        onClose={() => setAdmissionModalOpen(false)}
        defaultCourse="Computer Office Application"
      />

      {/* General Information Modal for CTAs and Navigation items */}
      <InfoModal
        isOpen={modalOpen}
        content={modalContent}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
