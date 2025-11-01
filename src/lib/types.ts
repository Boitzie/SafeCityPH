
export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: "admin";
  departmentId: string;
  lastActive: string;
  createdAt: string; 
};

export type ReportStatus = "For Review" | "In Progress" | "Resolved";
export type ReportUrgency = "High" | "Medium" | "Low";
export type ReportCategory = "Fire" | "Emergency" | "Disaster" | "Crime" | "Other";

export type TimelineEvent = {
  time: string; 
  event: string;
  author?: string;
};

export type Note = {
  id: string;
  author: string;
  authorId: string;
  text: string;
  timestamp: string;
};

export type Report = {
  id:string;
  reportId: string; 
  title: string;
  category: ReportCategory;
  location: string;
  dateTime: string;
  description: string;
  reporterName: string;
  reporterContact: string;
  status: ReportStatus;
  urgency: ReportUrgency;
  assignedDepartments: string[];
  images: string[];
  timeline: TimelineEvent[];
  notes: Note[];
  createdAt: string; 
  updatedAt: string; 
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
  timestamp: string;
  updatedAt: string;
};
