export interface Church {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  street_address: string;
  city: string;
  state: string;
  zipcode: string;
  location: string; // Formatted location (city, state)
  status: 'active' | 'pending' | 'suspended';
  job_listings_count: number; // Number of job listings for this church
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  name: string; // Full name of the user
  password?: string; // Password should be optional on the frontend
  role: 'candidate' | 'church' | 'admin' | 'superadmin';
  church_id: number | null;
  status: 'active' | 'pending' | 'suspended'; // User account status
  requires_password_change?: boolean; // Track if user needs to change password on first login
  last_login: string | null; // Last login timestamp
  created_at: string;
  updated_at: string;
}

export interface InviteCode {
  id: number;
  code: string;
  event: string; // Human-readable description of the event/purpose
  used_count: number; // Current number of times used
  status: 'active' | 'expired' | 'used';
  created_by: number; // User ID who created this code
  expires_at: string; // Expiration date
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_id: number;
  invite_code_id: number;
  street_address: string;
  city: string;
  state: string;
  zipcode: string;
  status: 'pending' | 'approved' | 'rejected';
  photo: string;
  resume: string;
  video_url: string;
  placement_preferences: string[];
  submitted_at: string; // When the profile was submitted for review
  created_at: string;
  updated_at: string;
}

export interface JobListing {
  id: number;
  church_id: number;
  title: string;
  ministry_type: string;
  employment_type: string;
  job_description: string;
  about_church: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface MutualInterest {
  id: number;
  job_listing_id: number;
  profile_id: number;
  expressed_by: 'candidate' | 'church';
  expressed_by_user_id: number;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: number;
  user_id: number | null; // User who performed the action (null for system events)
  action: string; // e.g., 'profile_approved', 'church_registered', 'job_created'
  entity_type: 'user' | 'church' | 'profile' | 'job_listing' | 'invite_code';
  entity_id: number | null; // ID of the affected entity
  details: string; // Human-readable description
  created_at: string;
}

export interface DashboardStats {
  total_users: number;
  active_churches: number;
  job_listings: number;
  pending_reviews: number;
  recent_activity: ActivityLog[];
}

export interface PasswordReset {
  id: number;
  user_id: number;
  reset_by: number; // User ID who performed the reset
  new_password: string; // Temporary password generated
  expires_at: string; // When the temporary password expires
  used: boolean; // Whether the user has used the temporary password
  created_at: string;
}
