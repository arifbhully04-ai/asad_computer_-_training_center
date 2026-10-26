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

export interface EducationRecord {
  id: string;
  exam: string;
  board: string;
  roll: string;
  result: string;
  group: string;
  passingYear: string;
  duration: string;
}

export interface AddressDetails {
  careOf: string;
  village: string;
  district: string;
  upazila: string;
  postOffice: string;
  postCode: string;
}

export interface ApplicantAccount {
  id: number;
  applicantName: string;
  nameBangla?: string;
  fatherName?: string;
  fatherNameBangla?: string;
  motherName?: string;
  motherNameBangla?: string;
  dob?: string;
  ageText?: string;
  gender?: 'Male' | 'Female' | 'Other';
  nationality?: string;
  religion?: string;
  nidNumber?: string;
  birthRegNo?: string;
  passportId?: string;
  maritalStatus?: 'Single' | 'Married' | 'Other';
  spouseName?: string;
  phone: string;
  email: string;
  quota?: string;
  departmentalStatus?: string;
  presentAddress?: AddressDetails;
  permanentAddress?: AddressDetails;
  educationList?: EducationRecord[];
  typingSpeedBangla?: string;
  typingSpeedEnglish?: string;
  computerExperience?: string;
  photoUrl?: string;
  signatureUrl?: string;
  password?: string;
  jobTitle: string;
  refNo?: string;
  feeStatus: 'Paid' | 'Pending';
  feeAmount: number;
  admitStatus: 'Ready' | 'Processing' | 'Completed';
  status?: 'Completed' | 'Processing';
  appliedDate: string;
  rollNo?: string;
  isAccountCompleted?: boolean;
  applications?: JobApplication[];
}

export interface JobApplication {
  id: number;
  applicantId: number;
  applicantName: string;
  nameBangla?: string;
  phone: string;
  email: string;
  circularTitle: string;
  postName: string; // কোন পদে আবেদন করবে
  appliedDate: string;
  feeStatus: 'Paid' | 'Pending';
  feeAmount: number;
  admitStatus: 'Ready' | 'Processing' | 'Completed';
  status?: 'Completed' | 'Processing';
  rollNo: string;
  refNo: string;
  bioDataSnapshot?: ApplicantAccount;
}
