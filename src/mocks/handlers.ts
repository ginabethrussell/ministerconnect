import { http, HttpResponse } from 'msw';
import { v4 as uuidv4 } from 'uuid';
import { generateMockResumeUrl } from '../utils/pdfUtils';

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
interface ChurchWithUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  street_address: string;
  city: string;
  state: string;
  zipcode: string;
  status: string;
  created_at: string;
  updated_at: string;
  users: Array<{
    id: number;
    email: string;
    role: 'church';
    church_id: number;
    requires_password_change: boolean;
    password?: string;
    created_at: string;
    updated_at: string;
  }>;
}

// Initialize mock churches with users from data.ts
let mockChurchesWithUsers: ChurchWithUser[] = [
  {
    id: 1,
    name: 'Grace Fellowship Church',
    email: 'contact@gracefellowship.org',
    phone: '555-111-1111',
    website: 'https://gracefellowship.org',
    street_address: '123 Church Rd',
    city: 'Springfield',
    state: 'IL',
    zipcode: '62704',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    users: [{
      id: 2,
      email: 'pastor.bob@gracefellowship.org',
      role: 'church',
      church_id: 1,
      requires_password_change: false,
      password: 'password123',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }]
  },
  {
    id: 2,
    name: 'New Hope Community',
    email: 'info@newhope.com',
    phone: '555-222-2222',
    website: 'https://newhope.com',
    street_address: '456 Chapel Ln',
    city: 'Shelbyville',
    state: 'IL',
    zipcode: '62565',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    users: [{
      id: 5,
      email: 'pastor.sarah@newhope.com',
      role: 'church',
      church_id: 2,
      requires_password_change: false,
      password: 'password123',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }]
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
    
    // Mock login logic
    if (email && password) {
      if (email === 'newchurchuser@gmail.com') {
        // New church that needs to change password
        return HttpResponse.json({
          success: true,
          user: {
            id: 400,
            email: 'newchurchuser@gmail.com',
            role: 'church',
            name: 'New Church',
            needsPasswordChange: true,
          },
          message: 'Login successful. Please change your password.',
          redirectTo: '/auth/force-password-change'
        });
      } else if (email === 'churchuser@gmail.com' && password === 'password') {    
        return HttpResponse.json({
          success: true,
          user: {
            id: 500,
            email: 'church@gmail.com',
            role: 'church',
            name: 'Sample Church',
            needsPasswordChange: false,
          },
          message: 'Login successful'
        });
      } else if (email === 'candidateuser@gmail.com' && password === 'password') {
        return HttpResponse.json({
          success: true,
          user: {
            id: 200,
            email: 'candidateuser@gmail.com',
            role: 'candidate',
            name: 'John Doe',
            needsPasswordChange: false
          },
          message: 'Login successful'
        });
      } else if (email === 'approvedcandidateuser@gmail.com' && password === 'password') {
        // Candidate with approved profile
        return HttpResponse.json({
          success: true,
          user: {
            id: 300,
            email: 'approvedcandidateuser@gmail.com',
            role: 'candidate',
            name: 'John Doe',
            needsPasswordChange: false
          },
          message: 'Login successful'
        });
      } else if (email === 'adminuser@gmail.com' && password === 'password') {
        // Admin login
        return HttpResponse.json({
          success: true,
          user: {
            id: 100,
            email: 'adminuser@gmail.com',
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
    // For john.candidate@email.com, always return approved profile
    // This simulates the user having an approved profile
    const approvedProfile = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'approvedcandidateuser@email.com',
      phone: '555-123-4567',
      streetAddress: '789 Candidate Ave',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      status: 'approved',
      pictureUrl: '/sampleman.jpg',
      resumeUrl: '/student-pastor-resume.pdf',
      videoUrl: 'https://www.youtube.com/live/jfKfPfyJRdk',
      placementPreferences: ['Youth Ministry', 'Missions'],
      lastUpdated: new Date().toISOString(),
    };
    
    return HttpResponse.json({ success: true, profile: approvedProfile });
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
    // Return the current user's data for john.candidate@email.com
    return HttpResponse.json({
      email: 'approvedcandidate@gmail.com',
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
    return HttpResponse.json(mockChurchesWithUsers);
  }),

  // POST /api/churches
  http.post('/api/churches', async ({ request }) => {
    const { church, users } = (await request.json()) as {
      church: {
        name: string;
        email: string;
        phone: string;
        website: string;
        street_address: string;
        city: string;
        state: string;
        zipcode: string;
        status: string;
      };
      users: Array<{
        email: string;
        password: string;
        role: 'church';
        requires_password_change: boolean;
      }>;
    };

    // Validate required fields
    if (!church.name || !church.email || !users || users.length === 0) {
      return new HttpResponse(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Validate each user has required fields
    for (const user of users) {
      if (!user.email || !user.password) {
        return new HttpResponse(
          JSON.stringify({ message: 'All users must have email and password' }),
          { status: 400 }
        );
      }
    }

    // Check if church email already exists
    if (mockChurchesWithUsers.some(c => c.email === church.email)) {
      return new HttpResponse(
        JSON.stringify({ message: 'Church email already exists' }),
        { status: 400 }
      );
    }

    // Check if any user email already exists
    for (const user of users) {
      if (mockChurchesWithUsers.some(c => c.users.some(u => u.email === user.email))) {
        return new HttpResponse(
          JSON.stringify({ message: `User email ${user.email} already exists` }),
          { status: 400 }
        );
      }
    }

    const now = new Date().toISOString();
    const newChurchId = Math.max(...mockChurchesWithUsers.map(c => c.id), 0) + 1;
    const maxUserId = Math.max(...mockChurchesWithUsers.flatMap(c => c.users.map(u => u.id)), 0);

    const newChurch: ChurchWithUser = {
      id: newChurchId,
      name: church.name,
      email: church.email,
      phone: church.phone || '',
      website: church.website || '',
      street_address: church.street_address,
      city: church.city,
      state: church.state,
      zipcode: church.zipcode,
      status: church.status || 'active',
      created_at: now,
      updated_at: now,
      users: users.map((user, index) => ({
        id: maxUserId + index + 1,
        email: user.email,
        role: 'church',
        church_id: newChurchId,
        requires_password_change: user.requires_password_change,
        password: user.password,
        created_at: now,
        updated_at: now,
      }))
    };

    mockChurchesWithUsers.push(newChurch);
    return HttpResponse.json(newChurch, { status: 201 });
  }),

  // GET /api/churches/:id - Get a specific church
  http.get('/api/churches/:id', ({ params }) => {
    const { id } = params;
    const churchId = parseInt(id as string);
    
    const church = mockChurchesWithUsers.find((c) => c.id === churchId);
    if (!church) {
      return new HttpResponse(
        JSON.stringify({ message: 'Church not found' }),
        { status: 404 }
      );
    }
    
    return HttpResponse.json(church);
  }),

  // PUT /api/churches/:id
  http.put('/api/churches/:id', async ({ params, request }) => {
    const { id } = params;
    const churchId = parseInt(id as string);
    const updateData = (await request.json()) as Partial<ChurchWithUser> & { users?: any[] };
    
    let updated;
    mockChurchesWithUsers = mockChurchesWithUsers.map((c) => {
      if (c.id === churchId) {
        const now = new Date().toISOString();
        
        // Handle user updates if provided
        let updatedUsers = c.users;
        if (updateData.users) {
          updatedUsers = updateData.users.map((user, index) => {
            if (user.id) {
              // Update existing user
              const existingUser = c.users.find(u => u.id === user.id);
              if (!existingUser) {
                throw new Error(`User with id ${user.id} not found`);
              }
              return {
                ...existingUser,
                email: user.email,
                requires_password_change: user.requires_password_change,
                updated_at: now,
                // Only update password if provided
                ...(user.password && { password: user.password }),
              };
            } else {
              // Add new user
              const maxUserId = Math.max(...c.users.map(u => u.id), 0);
              return {
                id: maxUserId + 1,
                email: user.email,
                password: user.password || '',
                role: 'church' as const,
                church_id: churchId,
                requires_password_change: user.requires_password_change,
                created_at: now,
                updated_at: now,
              };
            }
          });
        }
        
        updated = { 
          ...c, 
          ...updateData,
          users: updatedUsers,
          updated_at: now
        };
        return updated;
      }
      return c;
    });
    
    if (!updated) {
      return new HttpResponse(
        JSON.stringify({ message: 'Church not found' }),
        { status: 404 }
      );
    }
    return HttpResponse.json(updated);
  }),

  // DELETE /api/churches/:id
  http.delete('/api/churches/:id', ({ params }) => {
    const { id } = params;
    const churchId = parseInt(id as string);
    const initialLength = mockChurchesWithUsers.length;
    mockChurchesWithUsers = mockChurchesWithUsers.filter((c) => c.id !== churchId);
    
    if (mockChurchesWithUsers.length === initialLength) {
      return new HttpResponse(
        JSON.stringify({ message: 'Church not found' }),
        { status: 404 }
      );
    }
    
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

  // --- Job Listing Review Handlers ---
  
  // GET /api/job-listings - Get job listings with optional status filter
  http.get('/api/job-listings', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    
    // Import mock data
    const { mockJobListings, mockChurches } = require('./data');
    
    // Join job listings with church information
    const jobListingsWithChurch = mockJobListings.map((job: any) => {
      const church = mockChurches.find((c: any) => c.id === job.church_id);
      return {
        ...job,
        church_name: church?.name || 'Unknown Church',
        church_email: church?.email || '',
        church_phone: church?.phone || '',
      };
    });
    
    // Filter by status if provided
    let filteredListings = jobListingsWithChurch;
    if (status && status !== 'all') {
      filteredListings = jobListingsWithChurch.filter((job: any) => job.status === status);
    }
    
    return HttpResponse.json(filteredListings);
  }),

  // PATCH /api/job-listings/:id - Update job listing status
  http.patch('/api/job-listings/:id', async ({ params, request }) => {
    const { id } = params;
    const jobId = parseInt(id as string);
    const { status } = await request.json() as { status: 'pending' | 'approved' | 'rejected' };
    
    // Import mock data
    const { mockJobListings } = require('./data');
    
    // Find and update the job listing
    const jobIndex = mockJobListings.findIndex((job: any) => job.id === jobId);
    if (jobIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Job listing not found' }),
        { status: 404 }
      );
    }
    
    // Update the status
    mockJobListings[jobIndex].status = status;
    mockJobListings[jobIndex].updated_at = new Date().toISOString();
    
    return HttpResponse.json(mockJobListings[jobIndex]);
  }),

  // GET /api/job-listings/:id - Get a specific job listing
  http.get('/api/job-listings/:id', ({ params }) => {
    const { id } = params;
    const jobId = parseInt(id as string);
    
    // Import mock data
    const { mockJobListings, mockChurches } = require('./data');
    
    const job = mockJobListings.find((j: any) => j.id === jobId);
    if (!job) {
      return new HttpResponse(
        JSON.stringify({ message: 'Job listing not found' }),
        { status: 404 }
      );
    }
    
    const church = mockChurches.find((c: any) => c.id === job.church_id);
    const jobWithChurch = {
      ...job,
      church_name: church?.name || 'Unknown Church',
      church_email: church?.email || '',
      church_phone: church?.phone || '',
    };
    
    return HttpResponse.json(jobWithChurch);
  }),

  // POST /api/job-listings - Create a new job listing
  http.post('/api/job-listings', async ({ request }) => {
    const jobData = await request.json() as any;
    
    // Import mock data
    const { mockJobListings } = require('./data');
    
    // Generate new ID
    const maxId = Math.max(...mockJobListings.map((j: any) => j.id), 0);
    const newJob = {
      id: maxId + 1,
      ...jobData,
      status: 'pending', // All new job listings start as pending
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Add to mock data
    mockJobListings.push(newJob);
    
    return HttpResponse.json(newJob, { status: 201 });
  }),

  // PUT /api/job-listings/:id - Update job listing
  http.put('/api/job-listings/:id', async ({ params, request }) => {
    const { id } = params;
    const jobId = parseInt(id as string);
    const updateData = await request.json() as any;
    
    // Import mock data
    const { mockJobListings } = require('./data');
    
    // Find and update the job listing
    const jobIndex = mockJobListings.findIndex((job: any) => job.id === jobId);
    if (jobIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Job listing not found' }),
        { status: 404 }
      );
    }
    
    // Update the job listing
    mockJobListings[jobIndex] = {
      ...mockJobListings[jobIndex],
      ...updateData,
      updated_at: new Date().toISOString(),
    };
    
    return HttpResponse.json(mockJobListings[jobIndex]);
  }),

  // DELETE /api/job-listings/:id - Delete job listing
  http.delete('/api/job-listings/:id', ({ params }) => {
    const { id } = params;
    const jobId = parseInt(id as string);
    
    // Import mock data
    const { mockJobListings } = require('./data');
    
    // Find and remove the job listing
    const jobIndex = mockJobListings.findIndex((job: any) => job.id === jobId);
    if (jobIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Job listing not found' }),
        { status: 404 }
      );
    }
    
    const removedJob = mockJobListings.splice(jobIndex, 1)[0];
    
    return HttpResponse.json({ message: 'Job listing deleted successfully', removedJob });
  }),

  // --- Mutual Interests Handlers ---
  
  // GET /api/mutual-interests - Get mutual interests for current user/church
  http.get('/api/mutual-interests', ({ request }) => {
    // Import mock data
    const { mockMutualInterests, mockJobListings, mockProfiles, mockChurches } = require('./data');
    
    // Get current user from localStorage (simplified for mock)
    const currentUserEmail = localStorage.getItem('userEmail');
    const currentUserRole = localStorage.getItem('userRole');
    
    let userMutualInterests = mockMutualInterests;
    
    // Filter by user role and church_id if church user
    if (currentUserRole === 'church') {
      const church = mockChurches.find((c: any) => 
        c.users?.some((u: any) => u.email === currentUserEmail)
      );
      if (church) {
        // Get job listings for this church
        const churchJobIds = mockJobListings
          .filter((j: any) => j.church_id === church.id)
          .map((j: any) => j.id);
        
        // Get mutual interests for these job listings
        userMutualInterests = mockMutualInterests.filter((mi: any) => 
          churchJobIds.includes(mi.job_listing_id)
        );
      }
    } else if (currentUserRole === 'candidate') {
      // Get candidate's profile
      const profile = mockProfiles.find((p: any) => p.email === currentUserEmail);
      if (profile) {
        userMutualInterests = mockMutualInterests.filter((mi: any) => 
          mi.profile_id === profile.id
        );
      }
    }
    
    // Join with job listings and profiles for complete data
    const mutualInterestsWithDetails = userMutualInterests.map((mi: any) => {
      const job = mockJobListings.find((j: any) => j.id === mi.job_listing_id);
      const profile = mockProfiles.find((p: any) => p.id === mi.profile_id);
      const church = job ? mockChurches.find((c: any) => c.id === job.church_id) : null;
      
      return {
        ...mi,
        job_listing: job,
        profile: profile,
        church: church,
      };
    });
    
    return HttpResponse.json(mutualInterestsWithDetails);
  }),

  // POST /api/mutual-interests - Express interest in a job/candidate
  http.post('/api/mutual-interests', async ({ request }) => {
    const interestData = await request.json() as any;
    
    // Import mock data
    const { mockMutualInterests } = require('./data');
    
    // Generate new ID
    const maxId = Math.max(...mockMutualInterests.map((mi: any) => mi.id), 0);
    const newInterest = {
      id: maxId + 1,
      ...interestData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Add to mock data
    mockMutualInterests.push(newInterest);
    
    return HttpResponse.json(newInterest, { status: 201 });
  }),

  // DELETE /api/mutual-interests/:id - Remove interest
  http.delete('/api/mutual-interests/:id', ({ params }) => {
    const { id } = params;
    const interestId = parseInt(id as string);
    
    // Import mock data
    const { mockMutualInterests } = require('./data');
    
    // Find and remove the mutual interest
    const interestIndex = mockMutualInterests.findIndex((mi: any) => mi.id === interestId);
    if (interestIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Mutual interest not found' }),
        { status: 404 }
      );
    }
    
    const removedInterest = mockMutualInterests.splice(interestIndex, 1)[0];
    
    return HttpResponse.json({ message: 'Interest removed successfully', removedInterest });
  }),

  // --- Admin Operations Handlers ---
  
  // POST /api/admin/review-job - Admin approves/rejects job listing
  http.post('/api/admin/review-job', async ({ request }) => {
    const { jobId, status } = await request.json() as { jobId: number; status: 'pending' | 'approved' | 'rejected' };
    
    // Import mock data
    const { mockJobListings } = require('./data');
    
    // Find and update the job listing
    const jobIndex = mockJobListings.findIndex((job: any) => job.id === jobId);
    if (jobIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Job listing not found' }),
        { status: 404 }
      );
    }
    
    // Update the status
    mockJobListings[jobIndex].status = status;
    mockJobListings[jobIndex].updated_at = new Date().toISOString();
    
    return HttpResponse.json(mockJobListings[jobIndex]);
  }),

  // GET /api/admin/invite-codes - List invite codes
  http.get('/api/admin/invite-codes', () => {
    // Import mock data
    const { mockInviteCodes } = require('./data');
    return HttpResponse.json(mockInviteCodes);
  }),

  // POST /api/admin/invite-codes - Create invite code
  http.post('/api/admin/invite-codes', async ({ request }) => {
    const { code, event, uses } = await request.json() as { code: string; event: string; uses: number };
    
    // Import mock data
    const { mockInviteCodes } = require('./data');
    
    // Generate new ID
    const maxId = Math.max(...mockInviteCodes.map((ic: any) => ic.id), 0);
    const newInviteCode = {
      id: maxId + 1,
      code,
      event,
      uses,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Add to mock data
    mockInviteCodes.push(newInviteCode);
    
    return HttpResponse.json(newInviteCode, { status: 201 });
  }),

  // PUT /api/admin/invite-codes/:id - Update invite code
  http.put('/api/admin/invite-codes/:id', async ({ params, request }) => {
    const { id } = params;
    const inviteCodeId = parseInt(id as string);
    const updateData = await request.json() as any;
    
    // Import mock data
    const { mockInviteCodes } = require('./data');
    
    // Find and update the invite code
    const codeIndex = mockInviteCodes.findIndex((ic: any) => ic.id === inviteCodeId);
    if (codeIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Invite code not found' }),
        { status: 404 }
      );
    }
    
    // Update the invite code
    mockInviteCodes[codeIndex] = {
      ...mockInviteCodes[codeIndex],
      ...updateData,
      updated_at: new Date().toISOString(),
    };
    
    return HttpResponse.json(mockInviteCodes[codeIndex]);
  }),

  // DELETE /api/admin/invite-codes/:id - Delete invite code
  http.delete('/api/admin/invite-codes/:id', ({ params }) => {
    const { id } = params;
    const inviteCodeId = parseInt(id as string);
    
    // Import mock data
    const { mockInviteCodes } = require('./data');
    
    // Find and remove the invite code
    const codeIndex = mockInviteCodes.findIndex((ic: any) => ic.id === inviteCodeId);
    if (codeIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Invite code not found' }),
        { status: 404 }
      );
    }
    
    const removedCode = mockInviteCodes.splice(codeIndex, 1)[0];
    
    return HttpResponse.json({ message: 'Invite code deleted successfully', removedCode });
  }),
];
