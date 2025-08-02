import { User } from '@/context/UserContext';
import { Profile } from '@/context/ProfileContext';
import {
  CandidateRegistrationFormValues,
  JobListing,
  MutualInterest,
  JobWithInterest,
  ProfileWithInterest,
} from '@/types';

export type RegistrationError = {
  invite_code?: string | string[];
  email?: string | string[];
  password?: string[];
  [key: string]: any; // for any other unexpected properties
};

export const handleRegistrationErrorResponse = (error: RegistrationError): string => {
  if (error.invite_code) return 'Please verify the invite code.';
  if (error.email) return 'An account already exists for this email.';
  if (error.password) return error.password[0];
  return 'An error occurred during registration.';
};

export const formatPhone = (phone: string) => {
  const cleaned = ('' + phone).replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

export const titleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const sanitizeRegistrationFormValues = (formValues: CandidateRegistrationFormValues) => {
  return {
    ...formValues,
    code: formValues.code.trim(),
    email: formValues.email.trim().toLowerCase(),
    firstname: titleCase(formValues.firstname),
    lastname: titleCase(formValues.lastname),
  };
};

// Determines dashboard url for User
export const getUserDashboardRoute = (userInfo: User) => {
  switch (userInfo.groups[0]) {
    case 'Super Admin':
      return '/superadmin';
    case 'Admin':
      return '/admin';
    case 'Church User':
      return '/church';
    case 'Candidate':
      return '/candidate';
    default:
      return '/';
  }
};

export const normalizeJobInterests = (interests: MutualInterest[]) => {
  const interestMap: Record<number, MutualInterest> = {};
  interests.forEach((interest) => {
    interestMap[interest.job_listing] = interest;
  });
  return interestMap;
};

export const mergeJobsWithInterest = (
  jobs: JobListing[],
  interests: MutualInterest[]
): JobWithInterest[] => {
  const interestMap = normalizeJobInterests(interests);
  return jobs.map((job) => ({
    ...job,
    interest: interestMap[job.id],
  }));
};

export const normalizeProfileInterests = (
  interests: MutualInterest[]
): Record<string, MutualInterest> => {
  const interestMap: Record<string, MutualInterest> = {};
  interests.forEach((interest) => {
    const key = `${interest.profile}-${interest.job_listing}`; // compound key
    interestMap[key] = interest;
  });

  return interestMap;
};

export const mergeProfilesWithInterest = (
  profiles: Profile[],
  interests: MutualInterest[],
  selectedJobId: number
): ProfileWithInterest[] => {
  const interestMap = normalizeProfileInterests(interests);

  return profiles.map((profile) => {
    const key = `${profile.id}-${selectedJobId}`;
    return {
      ...profile,
      interest: interestMap[key] || null,
    };
  });
};

export const normalizeProfiles = (profiles: Profile[]) => {
  const map: Record<number, Profile> = {};
  profiles.forEach((p) => {
    map[p.id] = p;
  });
  return map;
};
