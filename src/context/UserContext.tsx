import React, { createContext, useContext, useState, useEffect } from 'react';

export type User = {
  id: number;
  email: string;
  name: string;
  groups: string[];
  church_id?: number | null;
  password?: string;
  status?: string;
  requires_password_change?: boolean;
  created_at?: string;
  updated_at?: string;
};

type ProfileStatus = 'draft' | 'pending' | 'approved' | 'rejected' | undefined;

type UserContextType = {
  user: User | null;
  isAuthenticated: boolean;
  profileStatus?: ProfileStatus;
  setUser: (user: User | null) => void;
  setProfileStatus: (status: ProfileStatus) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>();
  const isAuthenticated = !!user;

  useEffect(() => {
    // Load user from localStorage on mount
    const stored = localStorage.getItem('userInfo');
    if (stored) setUser(JSON.parse(stored));
    // Optionally, load profileStatus from localStorage or fetch here
  }, []);

  const logout = () => {
    setUser(null);
    setProfileStatus(undefined);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAuthenticated');
    // ...any other cleanup
  };

  return (
    <UserContext.Provider
      value={{ user, isAuthenticated, profileStatus, setUser, setProfileStatus, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
};
