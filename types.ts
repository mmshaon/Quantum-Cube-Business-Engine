
export enum UserRole {
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  CONTRIBUTOR = 'Contributor',
  VIEWER = 'Viewer',
  DESIGNER = 'Designer'
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  photoURL: string | null;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string; // ISO String
  type: 'income' | 'expense';
  status: 'pending' | 'approved' | 'rejected';
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status: 'On Track' | 'At Risk' | 'Completed';
}

export interface KPI {
  label: string;
  value: string | number;
  change: number; // Percentage
  trend: 'up' | 'down' | 'neutral';
  color: 'green' | 'pink' | 'yellow' | 'blue';
}

export interface Venture {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Planning' | 'On Hold' | 'Completed';
  roi: number;
  budget: number;
  spent: number;
  progress: number;
  teamSize: number;
}

export interface SystemLog {
  id: string;
  event: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: number;
}

export interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  status: 'Success' | 'Failed' | 'Denied';
  timestamp: number;
  ip: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  suggestedCommand?: SuggestedCommand; // Optional suggested command
  isError?: boolean; // New: Flag for error messages
  hasGroundingSources?: boolean; // New: Flag if response used grounding
}

export interface SuggestedCommand {
  id: string;
  label: string;
  confirmation: string;
  action: () => void;
}

// New Types for Version Control
export interface DesignVersion {
  id: string;
  versionNumber: number;
  uploadedBy: string;
  timestamp: number;
  fileUrl: string; 
  thumbnailUrl: string;
  changesDescription: string;
  isActive: boolean;
}

export interface DesignProject {
  id: string;
  name: string;
  description: string;
  currentVersion: number;
  versions: DesignVersion[];
  lastModified: number;
}

// New Types for Yusra Control Hub
export enum TrainingDocumentType {
  DOCUMENT = 'document',
  TEXT = 'text',
  IMAGE = 'image',
  OTHER = 'other',
}

export interface TrainingDocument {
  id: string;
  name: string;
  type: TrainingDocumentType;
  description?: string; // Optional description from voice input
  uploadedBy: string;
  uploadDate: number; // Unix timestamp
  status: 'pending' | 'processing' | 'processed' | 'error';
  sizeBytes: number;
  fileUrl?: string; // Optional URL for the uploaded file (mocked for now)
  originalFile?: File; // Store the actual File object for re-processing if needed
}

export interface YusraGlobalSettings {
  responseVerbosity: 'brief' | 'standard' | 'detailed';
  temperature: number; // 0.0 to 1.0
  topK: number;
  topP: number;
}

export interface YusraConfig {
  id: string;
  role: UserRole;
  systemPromptAddition: string;
  canExecuteCommands: boolean;
  allowedCommands: string[];
  globalSettingsOverride?: Partial<YusraGlobalSettings>; // Override global settings per role
}

export interface YusraMessageConfig { // New interface for passing config to LiveVoiceMode
  systemInstruction: string;
}

// New Type for Custom Role Management
export interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, string[]>; // Category -> Actions[]
  allowedYusraCommands: string[]; // List of Yusra command IDs this role can execute
}