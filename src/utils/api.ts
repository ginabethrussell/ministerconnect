// API client configuration for backend integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  if (API_BASE_URL) {
    return `${API_BASE_URL}${endpoint}`;
  }
  // Fallback to relative URLs for mock API
  return endpoint;
};

// Generic API client with error handling
export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(getApiUrl(endpoint), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(getApiUrl(endpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(getApiUrl(endpoint), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(getApiUrl(endpoint), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const response = await fetch(getApiUrl(endpoint), {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },
};

// API endpoints configuration
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/auth/login',
  REGISTER: '/api/register',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
  FORCE_PASSWORD_CHANGE: '/api/auth/force-password-change',
  
  // User management
  USER: '/api/user',
  USERS: '/api/users',
  
  // Profiles
  PROFILE: '/api/profile',
  PROFILES: '/api/profiles',
  
  // Churches
  CHURCHES: '/api/churches',
  
  // Job listings
  JOB_LISTINGS: '/api/job-listings',
  
  // Mutual interests
  MUTUAL_INTERESTS: '/api/mutual-interests',
  
  // Invite codes
  INVITE_CODES: '/api/invite-codes',
  
  // Superadmin
  SUPERADMIN_DASHBOARD: '/api/superadmin/dashboard',
  SUPERADMIN_USERS: '/api/superadmin/users',
  SUPERADMIN_PROFILES: '/api/superadmin/profiles',
  SUPERADMIN_CHURCHES: '/api/superadmin/churches',
} as const;

export const getSuperAdminProfiles = async () => {
  const response = await fetch('/api/superadmin/profiles');
  return response.json();
};

export const getMutualInterests = async () => {
  const response = await fetch('/api/church/mutual-interests');
  if (!response.ok) {
    throw new Error('Failed to fetch mutual interests');
  }
  return response.json();
};

export const getAdminJobListings = async () => {
  const response = await fetch('/api/admin/jobs');
  if (!response.ok) {
    throw new Error('Failed to fetch job listings');
  }
  return response.json();
};

export const updateJobListingStatus = async (
  id: number,
  status: 'approved' | 'rejected'
) => {
  const response = await fetch(`/api/admin/jobs/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update job listing status');
  }
  return response.json();
};

export const getAdminChurches = async () => {
  const response = await fetch('/api/admin/churches');
  if (!response.ok) {
    throw new Error('Failed to fetch churches');
  }
  return response.json();
};

export const deleteChurch = async (id: number) => {
  const response = await fetch(`/api/admin/churches/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete church');
  }
  return response.json();
};

export const getAdminChurchById = async (id: string) => {
  const response = await fetch(`/api/admin/churches/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch church');
  }
  return response.json();
};

export const updateChurch = async (id: number, data: any) => {
  const response = await fetch(`/api/admin/churches/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update church');
  }
  return response.json();
};

export const getAdminInviteCodes = async () => {
  const response = await fetch('/api/admin/invite-codes');
  if (!response.ok) {
    throw new Error('Failed to fetch invite codes');
  }
  return response.json();
};

export const createInviteCode = async (data: { code: string; event: string }) => {
  const response = await fetch('/api/admin/invite-codes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create invite code');
  }
  return response.json();
};

export const updateInviteCode = async (id: number, data: { code: string; event: string }) => {
  const response = await fetch(`/api/admin/invite-codes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update invite code');
  }
  return response.json();
};

export const deleteInviteCode = async (id: number) => {
  const response = await fetch(`/api/admin/invite-codes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete invite code');
  }
  return response.json();
};

// Church
export const getChurchDashboard = async () => {
  // ... existing code ...
} 