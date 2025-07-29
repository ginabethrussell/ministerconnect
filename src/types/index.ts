export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface CandidateRegistrationFormValues {
  code: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  confirmPassword: string;
}

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

export interface PaginatedResponse<T> {
  count: number;
  next: number | null;
  previous: number | null;
  results: T[];
}

export interface InlineChurch {
  id: number;
  name: string;
  city: string;
  state: string;
  website: string;
}

export interface JobListing {
  id: number;
  church: InlineChurch;
  title: string;
  ministry_type: string;
  employment_type: string;
  job_description: string;
  about_church: string;
  job_url_link: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface MutualInterest {
  id: number;
  job_listing: number;
  job_title: string;
  church_name: string | null;
  profile: number;
  candidate_name: string | null;
  expressed_by: 'candidate' | 'church';
  expressed_by_user: number;
  created_at: string;
  updated_at: string;
  is_mutual: boolean;
}

export type JobWithInterest = JobListing & {
  interest?: MutualInterest;
};

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
  reset_token: string; // Secure reset token (not stored in DB)
  reset_token_hash: string; // Hashed version of the token for storage
  expires_at: string; // When the reset token expires
  used: boolean; // Whether the reset token has been used
  created_at: string;
}
