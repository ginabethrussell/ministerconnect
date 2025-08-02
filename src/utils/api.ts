import {
  Church,
  JobListing,
  PaginatedResponse,
  MutualInterest,
  TokenResponse,
  InviteCode,
  ChurchInput,
} from '@/types';
import { User } from '@/context/UserContext';
import { Profile } from '@/context/ProfileContext';
// API client configuration for backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Helper function to get auth headers
const getAuthHeaders = (contentType: 'json' | 'none' = 'json') => {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {};
  if (contentType === 'json') {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const refreshToken = async () => {
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) throw new Error('No refresh token available');
  const response = await fetch(getApiUrl(API_ENDPOINTS.REFRESH_TOKEN), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) throw new Error('Failed to refresh token');
  const data = await response.json();
  localStorage.setItem('accessToken', data.access);
  return data.access;
};

async function fetchWithAuthRetry(
  input: RequestInfo,
  init?: RequestInit,
  retry = true,
  auth = true,
  contentType: 'json' | 'none' = 'json'
) {
  if (auth) {
    init = init || {};
    // Only set headers if not already set
    if (!init.headers) {
      init.headers = getAuthHeaders(contentType);
    }
  }
  let response = await fetch(input, init);
  if (auth && response.status === 401 && retry) {
    try {
      await refreshToken();
      // Update the Authorization header with the new token
      if (init && init.headers) {
        (init.headers as any).Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
      } else if (init) {
        init.headers = getAuthHeaders();
      }
      response = await fetch(input, init);
    } catch (e) {
      // Refresh failed, force logout or redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/auth/login'; // or your login route
      throw e;
    }
  }
  return response;
}

// Generic API client with error handling and token refresh
export const apiClient = {
  async get<T>(endpoint: string, auth = true): Promise<T> {
    const response = await fetchWithAuthRetry(
      getApiUrl(endpoint),
      {
        headers: auth ? getAuthHeaders() : undefined,
      },
      true,
      auth
    );
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw errorBody;
    }
    const data = await response.json();
    return data as T;
  },

  async post<T>(endpoint: string, data: any, auth = true): Promise<T> {
    const response = await fetchWithAuthRetry(
      getApiUrl(endpoint),
      {
        method: 'POST',
        headers: auth ? getAuthHeaders() : { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
      true,
      auth
    );
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw errorBody;
    }
    return response.json();
  },

  async patch<T>(endpoint: string, data: any, auth = true): Promise<T> {
    const response = await fetchWithAuthRetry(
      getApiUrl(endpoint),
      {
        method: 'PATCH',
        headers: auth ? getAuthHeaders() : { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
      true,
      auth
    );
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw errorBody;
    }
    return response.json();
  },

  async put<T>(endpoint: string, data: any, auth = true): Promise<T> {
    const response = await fetchWithAuthRetry(
      getApiUrl(endpoint),
      {
        method: 'PUT',
        headers: auth ? getAuthHeaders() : { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
      true,
      auth
    );
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw errorBody;
    }
    return response.json();
  },

  async delete(endpoint: string, auth = true): Promise<void> {
    const response = await fetchWithAuthRetry(
      getApiUrl(endpoint),
      {
        method: 'DELETE',
        headers: auth ? getAuthHeaders() : undefined,
      },
      true,
      auth
    );
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw errorBody;
    }
    return;
  },

  async upload<T>(endpoint: string, formData: FormData, auth = true): Promise<T> {
    const response = await fetchWithAuthRetry(
      getApiUrl(endpoint),
      {
        method: 'POST',
        headers: auth
          ? {
              ...(localStorage.getItem('accessToken') && {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              }),
            }
          : undefined,
        body: formData,
      },
      true,
      auth
    );
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw errorBody;
    }
    return response.json();
  },

  async patchForm<T>(endpoint: string, formData: FormData, auth = true): Promise<T> {
    const response = await fetchWithAuthRetry(
      getApiUrl(endpoint),
      {
        method: 'PATCH',
        headers: auth
          ? localStorage.getItem('accessToken')
            ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            : undefined
          : undefined,
        body: formData,
      },
      true,
      auth,
      'none' // <--- tell fetchWithAuthRetry not to add Content-Type
    );
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw errorBody;
    }
    return response.json();
  },
};

// API endpoints configuration
export const API_ENDPOINTS = {
  // Authentication (Django backend)
  LOGIN: '/api/token/',
  REFRESH_TOKEN: '/api/token/refresh/',

  // Churches (Django backend)
  CHURCHES: '/api/churches/',

  // Users (Django backend)
  CREATE_USER: '/api/users/create/',

  // Invite codes (Django backend)
  INVITE_CODES: '/api/invite-codes/',

  // Candidates (Django backend)
  CANDIDATE_REGISTER: '/api/candidates/register/',

  // Frontend routes (for MSW/fallback)
  FORGOT_PASSWORD: '/api/auth/forgot-password/',
  RESET_PASSWORD: '/api/reset-password/',
  FORCE_PASSWORD_CHANGE: '/api/auth/force-password-change/',

  // User management
  USER: '/api/user/',
  USERS: '/api/users/',
  GET_ME: '/api/user/me/',

  // Profiles
  PROFILE: '/api/profile/me/',
  PROFILE_RESET: '/api/profile/reset/',
  PROFILES: '/api/profiles/',

  // Approved Candidates
  APPROVED_CANDIDATES: '/api/approved-candidates/',

  // Job listings
  JOB_LISTINGS: '/api/jobs/',

  // Mutual interests
  MUTUAL_INTERESTS: '/api/mutual-interests/',
} as const;

// Admin Churches
export const getChurches = async (): Promise<PaginatedResponse<Church>> => {
  return apiClient.get(API_ENDPOINTS.CHURCHES);
};

export const getChurchById = async (id: string): Promise<Church> => {
  return apiClient.get(`${API_ENDPOINTS.CHURCHES}${id}/`);
};

export const getUsersByChurchId = async (id: string): Promise<PaginatedResponse<User>> => {
  return apiClient.get(`${API_ENDPOINTS.USERS}?church_id=${id}`);
};

export const createChurch = async (data: ChurchInput): Promise<PaginatedResponse<Church>> => {
  return apiClient.post(API_ENDPOINTS.CHURCHES, data);
};

export const updateChurchById = async (id: number, data: any) => {
  return apiClient.put(`${API_ENDPOINTS.CHURCHES}${id}/`, data);
};

export const patchChurchStatus = async (id: number, data: { status: string }) => {
  return apiClient.patch(`${API_ENDPOINTS.CHURCHES}${id}/`, data);
};

// Invite Codes
export const getInviteCodes = async (): Promise<PaginatedResponse<InviteCode>> => {
  return apiClient.get(API_ENDPOINTS.INVITE_CODES);
};

export const createInviteCode = async (data: {
  code: string;
  event: string;
  expires_at: string;
}) => {
  return apiClient.post(API_ENDPOINTS.INVITE_CODES, data);
};

export const updateInviteCode = async (
  id: number,
  data: { code: string; event: string; expires_at: string; status: string }
) => {
  return apiClient.put(`${API_ENDPOINTS.INVITE_CODES}${id}/`, data);
};

export const patchInviteCodeStatus = async (id: number, data: { status: string }) => {
  return apiClient.patch(`${API_ENDPOINTS.INVITE_CODES}${id}/`, data);
};

export const getMe = async (): Promise<User> => {
  return apiClient.get(API_ENDPOINTS.GET_ME);
};

export const login = async (data: { email: string; password: string }): Promise<TokenResponse> => {
  return apiClient.post(API_ENDPOINTS.LOGIN, data, false); // auth = false
};

export const registerCandidate = async (data: {
  code: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}): Promise<{ detail: string }> => {
  const body = {
    invite_code: data.code,
    email: data.email,
    first_name: data.firstname,
    last_name: data.lastname,
    password: data.password,
  };
  return apiClient.post(API_ENDPOINTS.CANDIDATE_REGISTER, body, false); // auth = false
};

export const resetPassword = async (data: {
  temporaryPassword: string;
  newPassword: string;
}): Promise<{ detail: string }> => {
  const body = {
    temporary_password: data.temporaryPassword,
    new_password: data.newPassword,
  };
  return apiClient.post(API_ENDPOINTS.RESET_PASSWORD, body);
};

export const getProfile = async (): Promise<Profile> => {
  return apiClient.get(API_ENDPOINTS.PROFILE);
};

export const patchProfileWithFile = async (formData: FormData): Promise<Profile> => {
  return apiClient.patchForm(API_ENDPOINTS.PROFILE, formData);
};

export const resetProfileData = async (): Promise<{ detail: string; profile: Profile }> => {
  return apiClient.post(API_ENDPOINTS.PROFILE_RESET, {}, true);
};

export const getApprovedJobs = async (): Promise<PaginatedResponse<JobListing>> => {
  return apiClient.get(`${API_ENDPOINTS.JOB_LISTINGS}?status=approved`);
};

export const getChurchJobs = async (): Promise<PaginatedResponse<JobListing>> => {
  return apiClient.get(API_ENDPOINTS.JOB_LISTINGS + 'my-jobs/');
};

export const createJob = async (jobData: Partial<JobListing>): Promise<JobListing> => {
  return apiClient.post(API_ENDPOINTS.JOB_LISTINGS, jobData);
};

export const getAllJobs = async (): Promise<PaginatedResponse<JobListing>> => {
  return apiClient.get(API_ENDPOINTS.JOB_LISTINGS);
};

export const deleteJob = async (id: number): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.JOB_LISTINGS}${id}/`);
};

export const getCandidateInterests = async (): Promise<PaginatedResponse<MutualInterest>> => {
  return apiClient.get(API_ENDPOINTS.MUTUAL_INTERESTS);
};

export const getChurchInterests = async (): Promise<PaginatedResponse<MutualInterest>> => {
  return apiClient.get(`${API_ENDPOINTS.MUTUAL_INTERESTS}my-church-interests/`);
};

export const getMutualInterests = async (): Promise<PaginatedResponse<MutualInterest>> => {
  return apiClient.get(`${API_ENDPOINTS.MUTUAL_INTERESTS}matches/`);
};

interface ExpressInterestInput {
  jobId: number;
  profileId: number;
  expressedBy: 'candidate' | 'church';
}
export const expressInterest = async ({
  jobId,
  profileId,
  expressedBy,
}: ExpressInterestInput): Promise<MutualInterest> => {
  return apiClient.post(API_ENDPOINTS.MUTUAL_INTERESTS, {
    job_listing: jobId,
    profile: profileId,
    expressed_by: expressedBy,
  });
};

// Role-specific wrappers
export const expressCandidateInterest = (jobId: number, profileId: number) =>
  expressInterest({ jobId, profileId, expressedBy: 'candidate' });

export const expressChurchInterest = (jobId: number, profileId: number) =>
  expressInterest({ jobId, profileId, expressedBy: 'church' });

export const withdrawInterest = async (id: number): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.MUTUAL_INTERESTS}${id}/`);
};

export const getApprovedCandidates = async (): Promise<PaginatedResponse<Profile>> => {
  return apiClient.get(API_ENDPOINTS.APPROVED_CANDIDATES);
};

export const getCandidateProfiles = async (): Promise<PaginatedResponse<Profile>> => {
  return apiClient.get(API_ENDPOINTS.PROFILES);
};

export const reviewCandidateProfiles = async (
  id: number,
  status: 'approved' | 'rejected'
): Promise<PaginatedResponse<Profile>> => {
  return apiClient.patch(`${API_ENDPOINTS.PROFILES}${id}/review/`, { id, status });
};

export const reviewChurchJobs = async (
  id: number,
  status: 'approved' | 'rejected'
): Promise<PaginatedResponse<JobListing>> => {
  return apiClient.patch(`${API_ENDPOINTS.JOB_LISTINGS}${id}/review/`, { id, status });
};
