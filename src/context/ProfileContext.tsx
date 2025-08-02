import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Profile {
  id: number;
  user: UserSummary;
  invite_code: number | null;
  invite_code_string?: string;
  street_address: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  resume: string | null;
  profile_image: string | null;
  video_url: string | null;
  placement_preferences: string[];
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
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
