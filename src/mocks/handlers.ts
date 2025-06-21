import { http, HttpResponse } from 'msw';
import { v4 as uuidv4 } from 'uuid';
import { generateMockResumeUrl } from '../utils/pdfUtils';

// Mock data
const mockUsers = [
  { email: 'candidate@gmail.com', password: 'password', role: 'candidate' },
  { email: 'church@gmail.com', password: 'password', role: 'church' },
  { email: 'admin@gmail.com', password: 'password', role: 'admin' },
];

let mockInviteCodes = [
  { id: '1', code: 'JOBFAIR25', event: 'Job Fair 2025', maxUses: 100, uses: 0 },
  { id: '2', code: 'JOBFAIR24', event: 'Job Fair 2024', maxUses: 10, uses: 10 },
];

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  status: null |'draft' | 'pending' | 'approved' | 'rejected';
  resumeFileId?: string;
  videoUrl?: string;
  pictureUrl?: string;
  resumeUrl?: string;
}

// Mock profile data
const mockProfile: Profile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'candidate@gmail.com',
  phone: '123-456-7890',
  streetAddress: '123 Test St',
  city: 'Test City',
  state: 'TX',
  zipCode: '12345',
  status: 'draft',
  pictureUrl: '/sampleman.jpg',
  resumeUrl: '/student-pastor-resume.pdf',
};

// Mock data store
const profiles: Record<string, Profile> = {
  'test-user-id': mockProfile,
};
const files: Record<string, { data: ArrayBuffer; type: string }> = {};

// --- Applicant Review Mock Data ---
interface CandidateReviewProfile {
  id: string;
  name: string;
  email: string;
  event: string;
  status: string;
  createdAt: string;
  phone?: string;
  resumeUrl?: string;
  videoUrl?: string;
  pictureUrl?: string;
}

let mockCandidateProfiles: CandidateReviewProfile[] = [
  {
    id: '1',
    name: 'Alice Smith',
    email: 'alice@example.com',
    event: 'Job Fair 2025',
    status: 'draft',
    createdAt: '2024-06-01',
    phone: '555-123-4567',
    resumeUrl: generateMockResumeUrl('Alice Smith'),
    pictureUrl: '/sampleman.jpg',
    videoUrl: 'https://www.youtube.com/live/w-6-z8w0Zv4?si=KcAy1iRb-Ss4zrPd',
  },
  {
    id: '2',
    name: 'Bob Jones',
    email: 'bob@example.com',
    event: 'Job Fair 2024',
    status: 'Approved',
    createdAt: '2024-05-20',
    phone: '555-234-5678',
    resumeUrl: generateMockResumeUrl('Bob Jones'),
    pictureUrl: '/sampleman.jpg',
    videoUrl: 'https://www.youtube.com/live/w-6-z8w0Zv4?si=KcAy1iRb-Ss4zrPd',
  },
  {
    id: '3',
    name: 'Carol Lee',
    email: 'carol@example.com',
    event: 'Job Fair 2025',
    status: 'Pending',
    createdAt: '2024-06-02',
    phone: '555-345-6789',
    resumeUrl: generateMockResumeUrl('Carol Lee'),
    pictureUrl: '/sampleman.jpg',
    videoUrl: 'https://www.youtube.com/live/w-6-z8w0Zv4?si=KcAy1iRb-Ss4zrPd',
  },
];

// --- Church Credentials Mock Data ---
interface ChurchUser {
  id: string;
  email: string;
  churchName: string;
  createdAt: string;
}

let mockChurches: ChurchUser[] = [
  {
    id: '1',
    email: 'firstchurch@example.com',
    churchName: 'First Church',
    createdAt: '2024-06-01',
  },
  {
    id: '2',
    email: 'gracechapel@example.com',
    churchName: 'Grace Chapel',
    createdAt: '2024-06-02',
  },
];

export const handlers = [
  http.post('/api/validate-invite', async ({ request }) => {
    const { code } = (await request.json()) as { code: string };
    const found = mockInviteCodes.find((c) => c.code === code && c.uses < c.maxUses);
    if (found) {
      return Response.json({ valid: true, event: found.event }, { status: 200 });
    } else {
      return Response.json({ valid: false, message: 'Invalid or expired code.' }, { status: 400 });
    }
  }),

  http.post('/api/register', async ({ request }) => {
    const { code, email, password } = (await request.json()) as {
      code: string;
      email: string;
      password: string;
    };

    const found = mockInviteCodes.find((c) => c.code === code && c.uses < c.maxUses);
    if (!found) {
      return Response.json(
        { success: false, message: 'Invalid or expired invite code.' },
        { status: 400 }
      );
    }
    if (!email || !password) {
      return Response.json(
        { success: false, message: 'Missing required fields.' },
        { status: 400 }
      );
    }
    found.uses += 1;
    return Response.json({ success: true, message: 'Registration successful!' }, { status: 200 });
  }),

  // POST /api/auth/login
  http.post('/api/auth/login', async ({ request }) => {
    console.log('Mock handler: login called');
    const { email, password } = await request.json() as { email: string; password: string };
    
    console.log('Mock handler: email:', email);
    console.log('Mock handler: password:', password);
    
    // Mock login logic
    if (email && password) {
      // Simulate different user types and scenarios
      if (email === 'newchurch@example.com') {
        // New church that needs to change password
        return HttpResponse.json({
          success: true,
          user: {
            id: 'new-church-1',
            email: 'newchurch@example.com',
            role: 'church',
            name: 'New Church',
            needsPasswordChange: true,
            needsProfileCompletion: true
          },
          message: 'Login successful. Please change your password.',
          redirectTo: '/auth/force-password-change'
        });
      } else if (email === 'church@gmail.com' && password === 'password') {
        // Regular church login - check if profile is complete
        const churchName = localStorage.getItem('churchName');
        const churchEmail = localStorage.getItem('churchEmail');
        const churchPhone = localStorage.getItem('churchPhone');
        const streetAddress = localStorage.getItem('churchStreetAddress');
        const city = localStorage.getItem('churchCity');
        const state = localStorage.getItem('churchState');
        const zipCode = localStorage.getItem('churchZipCode');
        
        const isProfileComplete = !!(churchName && churchEmail && churchPhone && streetAddress && city && state && zipCode);
        
        return HttpResponse.json({
          success: true,
          user: {
            id: 'church-1',
            email: 'church@example.com',
            role: 'church',
            name: 'Sample Church',
            needsPasswordChange: false,
            needsProfileCompletion: !isProfileComplete
          },
          message: 'Login successful'
        });
      } else if (email === 'candidate@gmail.com' && password === 'password') {
        // Candidate login
        return HttpResponse.json({
          success: true,
          user: {
            id: 'candidate-1',
            email: 'candidate@example.com',
            role: 'candidate',
            name: 'John Doe',
            needsPasswordChange: false
          },
          message: 'Login successful'
        });
      } else if (email === 'admin@example.com' && password === 'admin123') {
        // Admin login
        return HttpResponse.json({
          success: true,
          user: {
            id: 'admin-1',
            email: 'admin@example.com',
            role: 'admin',
            name: 'Admin User',
            needsPasswordChange: false
          },
          message: 'Login successful'
        });
      } 
    }
    
    return new HttpResponse(
      JSON.stringify({ success: false, message: 'Invalid email or password' }),
      { status: 401 }
    );
  }),

  // GET /api/profile
  http.get('/api/profile', () => {
    const userId = 'test-user-id';
    const profile = profiles[userId];

    if (!profile) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({ success: true, profile });
  }),

  // GET /api/files/:fileId
  http.get('/api/files/:fileId', ({ params }) => {
    const fileId = params.fileId as string;
    const file = files[fileId];

    if (!file) {
      return new HttpResponse(null, { status: 404 });
    }

    // Return the file with appropriate headers
    return new HttpResponse(file.data, {
      headers: {
        'Content-Type': file.type,
        'Content-Disposition': 'inline',
      },
    });
  }),

  // POST /api/profile
  http.post('/api/profile', async ({ request }) => {
    const userId = 'test-user-id';
    const formData = await request.formData();

    try {
      const profile = {
        ...mockProfile,
        ...Object.fromEntries(formData.entries()),
      };

      // Handle file uploads
      const resumeFile = formData.get('resume') as File;
      if (resumeFile) {
        const fileId = uuidv4();
        const arrayBuffer = await resumeFile.arrayBuffer();
        files[fileId] = {
          data: arrayBuffer,
          type: resumeFile.type,
        };
        profile.resumeFileId = fileId;
      }

      profiles[userId] = profile;

      return HttpResponse.json(profile);
    } catch (error) {
      return new HttpResponse(
        JSON.stringify({ message: error instanceof Error ? error.message : 'File upload failed' }),
        { status: 400 }
      );
    }
  }),

  // PUT /api/profile
  http.put('/api/profile', async ({ request }) => {
    const userId = 'test-user-id';
    const existingProfile = profiles[userId];

    if (!existingProfile) {
      return new HttpResponse(null, { status: 404 });
    }

    try {
      const formData = await request.formData();

      // Handle file uploads
      const resumeFile = formData.get('resume') as File;
      let resumeFileId = existingProfile.resumeFileId;

      if (resumeFile) {
        const fileId = uuidv4();
        const arrayBuffer = await resumeFile.arrayBuffer();
        files[fileId] = {
          data: arrayBuffer,
          type: resumeFile.type,
        };
        resumeFileId = fileId;
      }

      const updatedProfile = {
        ...existingProfile,
        ...Object.fromEntries(formData.entries()),
        resumeFileId,
      };

      profiles[userId] = updatedProfile;

      return HttpResponse.json(updatedProfile);
    } catch (error) {
      return new HttpResponse(
        JSON.stringify({ message: error instanceof Error ? error.message : 'File upload failed' }),
        { status: 400 }
      );
    }
  }),

  // DELETE /api/profile
  http.delete('/api/profile', () => {
    const userId = 'test-user-id';
    delete profiles[userId];
    return new HttpResponse(null, { status: 200 });
  }),

  // DELETE /api/account
  http.delete('/api/account', () => {
    const userId = 'test-user-id';
    delete profiles[userId];
    return new HttpResponse(null, { status: 200 });
  }),

  // GET /api/user
  http.get('/api/user', () => {
    // Return the current user's data
    return HttpResponse.json({
      email: 'candidate@gmail.com',
      role: 'candidate',
    });
  }),

  // GET all codes
  http.get('/api/codes', () => {
    return HttpResponse.json(mockInviteCodes);
  }),

  // POST create code
  http.post('/api/codes', async ({ request }) => {
    const { code, maxUses, event } = (await request.json()) as {
      code: string;
      event: string;
      maxUses: number;
    };
    const newCode = {
      id: Date.now().toString(),
      code,
      uses: 0,
      maxUses,
      event,
    };
    mockInviteCodes.push(newCode);
    return HttpResponse.json(newCode, { status: 201 });
  }),

  // PUT update code
  http.put('/api/codes/:id', async ({ request, params }) => {
    const { id } = params;
    const { code, maxUses } = (await request.json()) as { code: string; maxUses: number };
    mockInviteCodes = mockInviteCodes.map((c) => (c.id === id ? { ...c, code, maxUses } : c));
    const updated = mockInviteCodes.find((c) => c.id === id);
    return HttpResponse.json(updated);
  }),

  // DELETE code
  http.delete('/api/codes/:id', ({ params }) => {
    const { id } = params;
    mockInviteCodes = mockInviteCodes.filter((c) => c.id !== id);
    return HttpResponse.json({ success: true });
  }),

  // --- Candidate Review Handlers ---
  // GET /api/candidates?status=pending
  http.get('/api/candidates', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    let result = mockCandidateProfiles;
    if (status) {
      result = result.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }
    return HttpResponse.json(result);
  }),

  // PATCH /api/candidates/:id
  http.patch('/api/candidates/:id', async ({ params, request }) => {
    const { id } = params;
    const { status } = (await request.json()) as { status: string };
    let updated;
    mockCandidateProfiles = mockCandidateProfiles.map((p) => {
      if (p.id === id) {
        updated = { ...p, status };
        return updated;
      }
      return p;
    });
    if (!updated) {
      return new HttpResponse(JSON.stringify({ message: 'Candidate not found' }), { status: 404 });
    }
    return HttpResponse.json(updated);
  }),

  // --- Church Credentials Handlers ---
  // GET /api/churches
  http.get('/api/churches', () => {
    return HttpResponse.json(mockChurches);
  }),

  // POST /api/churches
  http.post('/api/churches', async ({ request }) => {
    const { email, churchName } = (await request.json()) as { email: string; churchName: string };
    const newChurch = {
      id: Date.now().toString(),
      email,
      churchName,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    mockChurches.push(newChurch);
    return HttpResponse.json(newChurch, { status: 201 });
  }),

  // PUT /api/churches/:id
  http.put('/api/churches/:id', async ({ params, request }) => {
    const { id } = params;
    const { email, churchName } = (await request.json()) as { email: string; churchName: string };
    let updated;
    mockChurches = mockChurches.map((c) => {
      if (c.id === id) {
        updated = { ...c, email, churchName };
        return updated;
      }
      return c;
    });
    if (!updated) {
      return new HttpResponse(JSON.stringify({ message: 'Church not found' }), { status: 404 });
    }
    return HttpResponse.json(updated);
  }),

  // DELETE /api/churches/:id
  http.delete('/api/churches/:id', ({ params }) => {
    const { id } = params;
    mockChurches = mockChurches.filter((c) => c.id !== id);
    return HttpResponse.json({ success: true });
  }),

  // POST /api/auth/forgot-password
  http.post('/api/auth/forgot-password', async ({ request }) => {
    console.log('Mock handler: forgot-password called');
    const { email } = await request.json() as { email: string };
    
    console.log('Mock handler: email received:', email);
    
    // In a real app, you would:
    // 1. Check if email exists in database
    // 2. Generate a secure reset token
    // 3. Store token with expiration in database
    // 4. Send email with reset link
    
    // For mock purposes, we'll just return success
    const mockResetToken = 'mock-reset-token-' + Date.now();
    
    console.log(`Password reset requested for: ${email}`);
    console.log(`Mock reset link: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${mockResetToken}`);
    
    return HttpResponse.json({ 
      success: true, 
      message: 'If an account with that email exists, a password reset link has been sent.' 
    });
  }),

  // GET /api/auth/validate-reset-token
  http.get('/api/auth/validate-reset-token', ({ request }) => {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    
    // In a real app, you would:
    // 1. Check if token exists in database
    // 2. Check if token is not expired
    // 3. Return user info if valid
    
    // For mock purposes, accept any token that starts with 'mock-reset-token-'
    if (token && token.startsWith('mock-reset-token-')) {
      return HttpResponse.json({ 
        success: true, 
        message: 'Token is valid' 
      });
    }
    
    return new HttpResponse(
      JSON.stringify({ success: false, message: 'Invalid or expired token' }),
      { status: 400 }
    );
  }),

  // POST /api/auth/reset-password
  http.post('/api/auth/reset-password', async ({ request }) => {
    const { token, password } = await request.json() as { token: string; password: string };
    
    // In a real app, you would:
    // 1. Validate the token
    // 2. Hash the new password
    // 3. Update user's password in database
    // 4. Invalidate/delete the reset token
    
    // For mock purposes, accept any token that starts with 'mock-reset-token-'
    if (token && token.startsWith('mock-reset-token-') && password && password.length >= 8) {
      console.log(`Password reset successful for token: ${token}`);
      console.log(`New password: ${password} (would be hashed in production)`);
      
      return HttpResponse.json({ 
        success: true, 
        message: 'Password has been reset successfully' 
      });
    }
    
    return new HttpResponse(
      JSON.stringify({ success: false, message: 'Invalid token or password' }),
      { status: 400 }
    );
  }),

  // POST /api/auth/force-password-change
  http.post('/api/auth/force-password-change', async ({ request }) => {
    console.log('Mock handler: force-password-change called');
    const { currentPassword, newPassword } = await request.json() as { currentPassword: string; newPassword: string };
    
    console.log('Mock handler: current password:', currentPassword);
    console.log('Mock handler: new password:', newPassword);
    
    // In a real app, you would:
    // 1. Verify the current password is correct
    // 2. Hash the new password
    // 3. Update user's password in database
    // 4. Mark user as having changed their password
    
    // For mock purposes, accept any current password and validate new password
    if (currentPassword && newPassword && newPassword.length >= 8 && newPassword !== currentPassword) {
      console.log(`Force password change successful`);
      console.log(`New password: ${newPassword} (would be hashed in production)`);
      
      return HttpResponse.json({ 
        success: true, 
        message: 'Password has been changed successfully' 
      });
    }
    
    return new HttpResponse(
      JSON.stringify({ success: false, message: 'Invalid current password or new password requirements not met' }),
      { status: 400 }
    );
  }),

  // POST /api/auth/change-password
  http.post('/api/auth/change-password', async ({ request }) => {
    console.log('Mock handler: change-password called');
    const { currentPassword, newPassword } = await request.json() as { currentPassword: string; newPassword: string };
    
    console.log('Mock handler: current password:', currentPassword);
    console.log('Mock handler: new password:', newPassword);
    
    // In a real app, you would:
    // 1. Verify the current password is correct
    // 2. Hash the new password
    // 3. Update user's password in database
    
    // For mock purposes, accept any current password and validate new password
    if (currentPassword && newPassword && newPassword.length >= 8 && newPassword !== currentPassword) {
      console.log(`Password change successful`);
      console.log(`New password: ${newPassword} (would be hashed in production)`);
      
      return HttpResponse.json({ 
        success: true, 
        message: 'Password has been changed successfully' 
      });
    }
    
    return new HttpResponse(
      JSON.stringify({ success: false, message: 'Invalid current password or new password requirements not met' }),
      { status: 400 }
    );
  }),
];
