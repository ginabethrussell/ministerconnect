import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Profile {
  id: number;
  user: UserSummary;
  invite_code: number | null;
  invite_code_string?: string; // if your serializer adds this for display
  street_address: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  resume: string | null; // URL to the file, or null if not uploaded
  profile_image: string | null; // URL to the file, or null if not uploaded
  video_url: string | null;
  placement_preferences: string[]; // or any[] if not always string
  submitted_at: string | null; // ISO date string or null
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

type ProfileStatus = 'draft' | 'pending' | 'approved' | 'rejected';

type UserSummary = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

type ProfileContextType = {
  profile: Profile | null;
  profileStatus?: ProfileStatus;
  setProfile: (profile: Profile | null) => void;
  setProfileStatus: (status: ProfileStatus) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>();

  useEffect(() => {
    if (profile) setProfileStatus(profile.status);
  }, [profile]);

  return (
    <ProfileContext.Provider value={{ profile, profileStatus, setProfile, setProfileStatus }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
};
