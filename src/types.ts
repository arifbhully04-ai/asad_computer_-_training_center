export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: { label: string; href: string }[];
}

export interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  image: string;
}

export interface ModalContent {
  title: string;
  subtitle?: string;
  description: string;
  category?: string;
}

export interface NoticeItem {
  id: number;
  title: string;
  category: 'Student' | 'Applicant' | 'General';
  date: string;
  description?: string;
  urgent?: boolean;
  pdfUrl?: string;
  pdfName?: string;
}

export interface StudentAccount {
  id: number;
  name: string;
  rollNo: string;
  course: string;
  batch: string;
  phone: string;
  email: string;
  password?: string;
  totalFee: number;
  paidFee: number;
  dueFee: number;
  lastPaymentDate?: string;
  typingSpeed: string;
  attendance: string;
  status: 'Active' | 'Certified' | 'Dropped';
}

export interface ApplicantAccount {
  id: number;
  applicantName: string;
  phone: string;
  email: string;
  password?: string;
  jobTitle: string;
  feeStatus: 'Paid' | 'Pending';
  feeAmount: number;
  admitStatus: 'Ready' | 'Processing';
  appliedDate: string;
  rollNo?: string;
  nidNumber?: string;
}
