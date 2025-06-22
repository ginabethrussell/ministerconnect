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