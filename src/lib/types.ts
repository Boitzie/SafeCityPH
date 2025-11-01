export type User = {
  uid: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: "admin";
  department: string;
  lastActive: string; // Changed to string for Firestore compatibility
  createdAt: string; // Changed to string for Firestore compatibility
};

export type ReportStatus = "For Review" | "In Progress" | "Resolved";
export type ReportUrgency = "High" | "Medium" | "Low";
export type ReportCategory = "Fire" | "Emergency" | "Disaster" | "Crime" | "Other";

export type TimelineEvent = {
  time: string; // Changed to string for Firestore compatibility
  event: string;
  author?: string;
};

export type Note = {
  author: string;
  text: string;
  timestamp: string; // Changed to string for Firestore compatibility
};

export type Report = {
  id: string;
  reportId: string; // #RPT-YYYYMMDD-FIR-XXX
  title: string;
  category: ReportCategory;
  location: string;
  dateTime: string; // Changed to string for Firestore compatibility
  description: string;
  reporterName: string;
  reporterContact: string;
  status: ReportStatus;
  urgency: ReportUrgency;
  assignedDepartments: string[];
  images: string[];
  timeline: TimelineEvent[];
  notes: Note[];
  createdAt: string; // Changed to string for Firestore compatibility
  updatedAt: string; // Changed to string for Firestore compatibility
};

export type Department = {
  id: string;
  name: string;
  district: string;
  isActive: boolean;
};

export type AdminNote = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  timestamp: string; // Changed to string for Firestore compatibility
  updatedAt: string; // Changed to string for Firestore compatibility
};
