export type Role = 'admin' | 'club_head';

export interface ClubLead {
  id?: number;
  name: string;
  role?: string;
  is_public: boolean;
}

export interface ClubSummary {
  slug: string;
  name: string;
  category: string;
  tagline?: string;
  logo?: string;
  registration_open: boolean;
  is_active: boolean;
}

export interface ClubDetail {
  slug: string;
  name: string;
  category: string;
  tagline?: string;
  description?: string;
  what_we_do: string[];
  domains: string[];
  logo?: string;
  faculty_coordinator?: string;
  instagram?: string;
  linkedin?: string;
  website?: string;
  registration_open: boolean;
  is_active: boolean;
  leads: ClubLead[];
  registration_count?: number;
}

export interface StudentIn {
  name: string;
  roll_number: string;
  branch: string;
  section?: string;
  email: string;
  phone: string;
}

export interface RegistrationResultItem {
  slug: string;
  name: string;
  status: 'registered' | 'already_registered' | 'closed' | 'disabled';
}

export interface RegistrationResponse {
  student_name: string;
  newly_registered: RegistrationResultItem[];
  already_registered: RegistrationResultItem[];
  closed: RegistrationResultItem[];
}

export interface StaffProfile {
  id: number;
  user_id: string;
  name: string;
  email: string;
  role: Role;
  club_id?: number;
  club_name?: string;
  club_slug?: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: Role;
  club_slug?: string;
  user_id: string;
  email: string;
  name: string;
}

export interface AdminStats {
  total_students: number;
  total_registrations: number;
  total_clubs: number;
  open_clubs: number;
  global_registration_enabled: boolean;
  by_club: { club: string; slug: string; registrations: number }[];
  by_branch: { branch: string; count: number }[];
  trend: { date: string; count: number }[];
}

export interface StudentOut {
  id: number;
  name: string;
  roll_number: string;
  branch: string;
  section?: string;
  email: string;
  phone: string;
  club_count: number;
  created_at: string;
}

export interface RegistrationOut {
  id: number;
  student: StudentOut;
  club_slug: string;
  club_name: string;
  registered_at: string;
  status: string;
}

export interface SystemSetting {
  key: string;
  value?: string;
  updated_at: string;
}

export interface AuditLog {
  id: number;
  user_id?: string;
  user_email?: string;
  action: string;
  details?: string;
  ip_address?: string;
  created_at: string;
}

export interface SystemHealth {
  status: string;
  database: string;
  storage: string;
  global_registration_enabled: boolean;
  timestamp: string;
}
