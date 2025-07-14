import { TokenResponse } from '@/types';
import { User } from '../context/UserContext';
// API client configuration for backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
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
  auth = true
) {
  // Only add Authorization header if auth is true
  if (auth) {
    init = init || {};
    init.headers = { ...getAuthHeaders(), ...(init.headers || {}) };
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
    return response.json();
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

  async delete<T>(endpoint: string, auth = true): Promise<T> {
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
    return response.json();
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
};

// API endpoints configuration
export const API_ENDPOINTS = {
  // Authentication (Django backend)
  LOGIN: '/api/token/',
  REFRESH_TOKEN: '/api/token/refresh/',

  // Churches (Django backend)
  CREATE_CHURCH: '/api/churches/create/',

  // Users (Django backend)
  CREATE_USER: '/api/users/create/',

  // Invite codes (Django backend)
  CREATE_INVITE_CODE: '/api/invite-codes/create/',
  LIST_INVITE_CODES: '/api/invite-codes/',

  // Candidates (Django backend)
  CANDIDATE_REGISTER: '/api/candidates/register/',

  // Frontend routes (for MSW/fallback)
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  FORCE_PASSWORD_CHANGE: '/api/auth/force-password-change',

  // User management
  USER: '/api/user',
  USERS: '/api/users',
  GET_ME: '/api/user/me/',

  // Profiles
  PROFILE: '/api/profile',
  PROFILES: '/api/profiles',

  // Churches (frontend routes)
  CHURCHES: '/api/churches',

  // Job listings
  JOB_LISTINGS: '/api/job-listings',

  // Mutual interests
  MUTUAL_INTERESTS: '/api/mutual-interests',

  // Invite codes (frontend routes)
  INVITE_CODES: '/api/invite-codes',

  // Superadmin
  SUPERADMIN_DASHBOARD: '/api/superadmin/dashboard',
  SUPERADMIN_USERS: '/api/superadmin/users',
  SUPERADMIN_PROFILES: '/api/superadmin/profiles',
  SUPERADMIN_CHURCHES: '/api/superadmin/churches',
} as const;

// Superadmin
export const getSuperAdminProfiles = async () => {
  return apiClient.get(API_ENDPOINTS.SUPERADMIN_PROFILES);
};

// Mutual Interests
export const getMutualInterests = async () => {
  return apiClient.get('/api/church/mutual-interests');
};

// Admin Job Listings
export const getAdminJobListings = async () => {
  return apiClient.get('/api/admin/jobs');
};

export const updateJobListingStatus = async (id: number, status: 'approved' | 'rejected') => {
  return apiClient.post(`/api/admin/jobs/${id}`, { status });
};

// Admin Churches
export const getAdminChurches = async () => {
  return apiClient.get('/api/admin/churches');
};

export const deleteChurch = async (id: number) => {
  return apiClient.delete(`/api/admin/churches/${id}`);
};

export const getAdminChurchById = async (id: string) => {
  return apiClient.get(`/api/admin/churches/${id}`);
};

export const updateChurch = async (id: number, data: any) => {
  return apiClient.put(`/api/admin/churches/${id}`, data);
};

// Admin Invite Codes
export const getAdminInviteCodes = async () => {
  return apiClient.get('/api/admin/invite-codes');
};

export const createInviteCode = async (data: { code: string; event: string }) => {
  return apiClient.post('/api/admin/invite-codes', data);
};

export const updateInviteCode = async (id: number, data: { code: string; event: string }) => {
  return apiClient.put(`/api/admin/invite-codes/${id}`, data);
};

export const deleteInviteCode = async (id: number) => {
  return apiClient.delete(`/api/admin/invite-codes/${id}`);
};

// Church Dashboard (stub, update as needed)
export const getChurchDashboard = async () => {
  // ... implement as needed ...
};

// Fetch current authenticated user info
export const getMe = async (): Promise<User> => {
  return apiClient.get(API_ENDPOINTS.GET_ME);
};

// Example usage for a public endpoint (login):
export const login = async (data: { email: string; password: string }): Promise<TokenResponse> => {
  return apiClient.post(API_ENDPOINTS.LOGIN, data, false); // auth = false
};

// Example usage for a public endpoint (login):
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
