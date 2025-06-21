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
  status: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  password?: string; // Password should be optional on the frontend
  role: 'candidate' | 'church' | 'admin';
  church_id: number | null;
  requires_password_change?: boolean; // Track if user needs to change password on first login
  created_at: string;
  updated_at: string;
}

export interface InviteCode {
  id: number;
  code: string;
  event: string;
  uses: number;
  status: string;
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
