export type User = {
  uid: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  role: "admin";
  department: string;
  lastActive: Date;
  createdAt: Date;
};

export type ReportStatus = "For Review" | "In Progress" | "Resolved";
export type ReportUrgency = "High" | "Medium" | "Low";
export type ReportCategory = "Fire" | "Emergency" | "Disaster" | "Crime" | "Other";

export type TimelineEvent = {
  time: Date;
  event: string;
  author?: string;
};

export type Note = {
  author: string;
  text: string;
  timestamp: Date;
};

export type Report = {
  id: string;
  reportId: string; // #RPT-YYYYMMDD-FIR-XXX
  title: string;
  category: ReportCategory;
  location: string;
  dateTime: Date;
  description: string;
  reporterName: string;
  reporterContact: string;
  status: ReportStatus;
  urgency: ReportUrgency;
  assignedDepartments: string[];
  images: string[];
  timeline: TimelineEvent[];
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
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
  author: string;
  timestamp: Date;
  updatedAt: Date;
};
