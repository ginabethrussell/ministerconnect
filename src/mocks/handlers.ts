import { http, HttpResponse, passthrough } from 'msw';
import {
  mockUsers,
  mockChurches,
  mockInviteCodes as initialMockInviteCodes,
  mockProfiles,
  mockJobListings,
  mockMutualInterests,
} from './data';
import { User, Church, InviteCode, Profile, JobListing } from '../types';

// Create deep copies of the mock data to prevent mutation during tests
let users: User[] = JSON.parse(JSON.stringify(mockUsers));
let churches: Church[] = JSON.parse(JSON.stringify(mockChurches));
let profiles: Profile[] = JSON.parse(JSON.stringify(mockProfiles));
let jobListings: JobListing[] = JSON.parse(JSON.stringify(mockJobListings));
let inviteCodes: InviteCode[] = JSON.parse(
  JSON.stringify(initialMockInviteCodes)
);

const API_PREFIX = '/api';

export const handlers = [
  // Passthrough for Next.js specific requests
  http.get('/_next/*', () => passthrough()),
  http.get('/static/*', () => passthrough()),
  http.get('/*.json', () => passthrough()),
  http.get('/*.ico', () => passthrough()),
  http.get('/', () => passthrough()),

  // Auth
  http.post(`${API_PREFIX}/auth/login`, async ({ request }) => {
    const { email, password } = (await request.json()) as any;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      return HttpResponse.json({
        success: true,
        token: 'mock-jwt-token',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          church_id: user.church_id,
          needsPasswordChange: user.requires_password_change,
        },
      });
    } else {
      return HttpResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
  }),

  http.post(`${API_PREFIX}/auth/validate-invite`, async ({ request }) => {
    const { code } = (await request.json()) as any;
    const inviteCode = inviteCodes.find(
      c => c.code === code && c.status === 'active'
    );

    if (inviteCode) {
      return HttpResponse.json({ valid: true });
    } else {
      return HttpResponse.json({ valid: false }, { status: 404 });
    }
  }),

  // Superadmin - Users
  http.get(`${API_PREFIX}/superadmin/users`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    let filteredUsers = users;
    if (search) {
      filteredUsers = users.filter(
        user =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    return HttpResponse.json(filteredUsers);
  }),

  // Superadmin - Churches
  http.get(`${API_PREFIX}/superadmin/churches`, ({ request }) => {
    return HttpResponse.json(churches);
  }),

  // Superadmin - Profiles
  http.get(`${API_PREFIX}/superadmin/profiles`, ({ request }) => {
    return HttpResponse.json(profiles);
  }),

  // Admin - Jobs
  http.get(`${API_PREFIX}/admin/jobs`, ({ request }) => {
    const jobsWithChurch = jobListings.map(job => {
      const church = churches.find(c => c.id === job.church_id);
      return { ...job, church };
    });
    return HttpResponse.json(jobsWithChurch);
  }),

  http.patch(`${API_PREFIX}/admin/jobs/:id`, async ({ request, params }) => {
    const { id } = params;
    const { status } = (await request.json()) as any;
    const jobIndex = jobListings.findIndex(j => j.id === Number(id));

    if (jobIndex !== -1) {
      jobListings[jobIndex].status = status;
      return HttpResponse.json(jobListings[jobIndex]);
    } else {
      return HttpResponse.json({ message: 'Job not found' }, { status: 404 });
    }
  }),

  // Admin - Churches
  http.get(`${API_PREFIX}/admin/churches`, ({ request }) => {
    const churchesWithUsers = churches.map(church => ({
      ...church,
      users: users
        .filter(user => user.church_id === church.id)
        .map(({ password, ...rest }) => rest),
    }));
    return HttpResponse.json(churchesWithUsers);
  }),

  http.get(`${API_PREFIX}/admin/churches/:id`, ({ params }) => {
    const { id } = params;
    const church = churches.find(c => c.id === Number(id));

    if (church) {
      const churchWithUsers = {
        ...church,
        users: users
          .filter(user => user.church_id === church.id)
          .map(({ password, ...rest }) => rest),
      };
      return HttpResponse.json(churchWithUsers);
    } else {
      return HttpResponse.json({ message: 'Church not found' }, { status: 404 });
    }
  }),

  http.put(`${API_PREFIX}/admin/churches/:id`, async ({ request, params }) => {
    const { id } = params;
    const updatedData = (await request.json()) as any;
    const churchIndex = churches.findIndex(c => c.id === Number(id));

    if (churchIndex !== -1) {
      churches[churchIndex] = { ...churches[churchIndex], ...updatedData.church };
      // This is a simplified update. A real backend would handle user updates more robustly.
      return HttpResponse.json(churches[churchIndex]);
    } else {
      return HttpResponse.json({ message: 'Church not found' }, { status: 404 });
    }
  }),

  http.delete(`${API_PREFIX}/admin/churches/:id`, ({ params }) => {
    const { id } = params;
    const churchIndex = churches.findIndex(c => c.id === Number(id));

    if (churchIndex !== -1) {
      churches.splice(churchIndex, 1);
      return HttpResponse.json({ success: true });
    } else {
      return HttpResponse.json({ message: 'Church not found' }, { status: 404 });
    }
  }),

  // Admin - Invite Codes
  http.get(`${API_PREFIX}/admin/invite-codes`, ({ request }) => {
    return HttpResponse.json(inviteCodes);
  }),

  http.post(`${API_PREFIX}/admin/invite-codes`, async ({ request }) => {
    const { code, event } = (await request.json()) as any;
    const newCode: InviteCode = {
      id: Math.max(0, ...inviteCodes.map(c => c.id)) + 1,
      code,
      event,
      used_count: 0,
      status: 'active',
      created_by: 1, // Mock admin user ID
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    inviteCodes.push(newCode);
    return HttpResponse.json(newCode, { status: 201 });
  }),

  http.put(`${API_PREFIX}/admin/invite-codes/:id`, async ({ request, params }) => {
    const { id } = params;
    const { code, event } = (await request.json()) as any;
    const codeIndex = inviteCodes.findIndex(c => c.id === Number(id));

    if (codeIndex !== -1) {
      const updatedCode = {
        ...inviteCodes[codeIndex],
        code,
        event,
        updated_at: new Date().toISOString(),
      };
      inviteCodes[codeIndex] = updatedCode;
      return HttpResponse.json(updatedCode);
    } else {
      return HttpResponse.json({ message: 'Invite code not found' }, { status: 404 });
    }
  }),

  http.delete(`${API_PREFIX}/admin/invite-codes/:id`, ({ params }) => {
    const { id } = params;
    const codeIndex = inviteCodes.findIndex(c => c.id === Number(id));

    if (codeIndex !== -1) {
      inviteCodes.splice(codeIndex, 1);
      return HttpResponse.json({ success: true });
    } else {
      return HttpResponse.json({ message: 'Invite code not found' }, { status: 404 });
    }
  }),

  // Church - Mutual Interests
  http.get(`${API_PREFIX}/church/mutual-interests`, ({ request }) => {
    const mutualInterestsWithDetails = mockMutualInterests.map(interest => {
      const profile = profiles.find(p => p.id === interest.profile_id);
      const jobListing = jobListings.find(j => j.id === interest.job_listing_id);
      return { interest, profile, jobListing };
    });
    return HttpResponse.json(mutualInterestsWithDetails);
  }),

  // Fallback for any other API requests
  http.get(`${API_PREFIX}/*`, ({ request }) => {
    console.warn(`Unhandled API call: ${request.method} ${request.url}`);
    return HttpResponse.json({ message: 'API not found' }, { status: 404 });
  }),
];
