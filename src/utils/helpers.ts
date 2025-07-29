import { User } from '@/context/UserContext';
import {
  CandidateRegistrationFormValues,
  JobListing,
  MutualInterest,
  JobWithInterest,
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

function titleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

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

export const normalizeInterests = (interests: MutualInterest[]) => {
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
  const interestMap = normalizeInterests(interests);
  return jobs.map((job) => ({
    ...job,
    interest: interestMap[job.id],
  }));
};
