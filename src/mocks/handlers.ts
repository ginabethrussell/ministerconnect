import { http, HttpResponse, passthrough } from 'msw';
import {
  mockUsers,
  mockChurches,
  mockInviteCodes as initialMockInviteCodes,
  mockProfiles,
  mockJobListings,
  mockMutualInterests,
} from './data';
import { Church, InviteCode, Profile, JobListing, MutualInterest } from '../types';
import { User } from '@/context/UserContext';

// Create deep copies of the mock data to prevent mutation during tests
const users: User[] = JSON.parse(JSON.stringify(mockUsers));
const churches: Church[] = JSON.parse(JSON.stringify(mockChurches));
const profiles: Profile[] = JSON.parse(JSON.stringify(mockProfiles));
const jobListings: JobListing[] = JSON.parse(JSON.stringify(mockJobListings));
const inviteCodes: InviteCode[] = JSON.parse(JSON.stringify(initialMockInviteCodes));

const API_PREFIX = '/api';

export const handlers = [
  // Passthrough for Next.js specific requests
  http.get('/_next/*', () => passthrough()),
  http.get('/static/*', () => passthrough()),
  http.get('/*.json', () => passthrough()),
  http.get('/*.ico', () => passthrough()),
  http.get('/', () => passthrough()),

  // Superadmin - Users
  http.get(`${API_PREFIX}/superadmin/users`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    let filteredUsers = users;
    if (search) {
      filteredUsers = users.filter(
        (user) =>
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
    const jobsWithChurch = jobListings.map((job) => {
      const church = churches.find((c) => c.id === job.church_id);
      return { ...job, church };
    });
    return HttpResponse.json(jobsWithChurch);
  }),

  // Candidate - Job Listings (approved only)
  http.get(`${API_PREFIX}/job-listings`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    let filteredJobs = jobListings;
    if (status) {
      filteredJobs = jobListings.filter((job) => job.status === status);
    }

    // Add church information to each job listing
    const jobsWithChurch = filteredJobs.map((job) => {
      const church = churches.find((c) => c.id === job.church_id);
      return {
        ...job,
        church_name: church?.name || 'Unknown Church',
        church_email: church?.email || '',
        church_phone: church?.phone || '',
        church_location: church?.location || '',
      };
    });

    return HttpResponse.json(jobsWithChurch);
  }),

  // Express Interest in Job Listing
  http.post(`${API_PREFIX}/job-listings/:id/express-interest`, async ({ request, params }) => {
    const { id } = params;
    const jobId = Number(id);

    // Get current user from localStorage
    const userEmail = localStorage.getItem('user_email');
    const user = users.find((u) => u.email === userEmail);

    if (!user || user.groups[0].toLowerCase() !== 'candidate') {
      return HttpResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const profile = profiles.find((p) => p.user_id === user.id);
    if (!profile) {
      return HttpResponse.json({ success: false, message: 'Profile not found' }, { status: 404 });
    }

    const jobListing = jobListings.find((j) => j.id === jobId);
    if (!jobListing) {
      return HttpResponse.json(
        { success: false, message: 'Job listing not found' },
        { status: 404 }
      );
    }

    // Check if interest already exists
    const existingInterest = mockMutualInterests.find(
      (interest) =>
        interest.job_listing_id === jobId &&
        interest.profile_id === profile.id &&
        interest.expressed_by === 'candidate'
    );

    if (existingInterest) {
      // Remove existing interest
      const index = mockMutualInterests.findIndex(
        (interest) => interest.id === existingInterest.id
      );
      mockMutualInterests.splice(index, 1);
      return HttpResponse.json({ success: true, expressed: false });
    } else {
      // Add new interest
      const newInterest: MutualInterest = {
        id: Math.max(0, ...mockMutualInterests.map((i) => i.id)) + 1,
        job_listing_id: jobId,
        profile_id: profile.id,
        expressed_by: 'candidate',
        expressed_by_user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockMutualInterests.push(newInterest);
      return HttpResponse.json({ success: true, expressed: true });
    }
  }),

  // Get User's Expressed Interests
  http.get(`${API_PREFIX}/job-listings/expressed-interests`, ({ request }) => {
    // Get current user from localStorage
    const userEmail = localStorage.getItem('user_email');
    const user = users.find((u) => u.email === userEmail);

    if (!user || user.groups[0].toLowerCase() !== 'candidate') {
      return HttpResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const profile = profiles.find((p) => p.user_id === user.id);
    if (!profile) {
      return HttpResponse.json({ success: false, message: 'Profile not found' }, { status: 404 });
    }

    // Get all job IDs where this candidate has expressed interest
    const expressedJobIds = mockMutualInterests
      .filter(
        (interest) => interest.profile_id === profile.id && interest.expressed_by === 'candidate'
      )
      .map((interest) => interest.job_listing_id);

    return HttpResponse.json({ success: true, jobIds: expressedJobIds });
  }),

  http.patch(`${API_PREFIX}/admin/jobs/:id`, async ({ request, params }) => {
    const { id } = params;
    const { status } = (await request.json()) as any;
    const jobIndex = jobListings.findIndex((j) => j.id === Number(id));

    if (jobIndex !== -1) {
      jobListings[jobIndex].status = status;
      return HttpResponse.json(jobListings[jobIndex]);
    } else {
      return HttpResponse.json({ message: 'Job not found' }, { status: 404 });
    }
  }),

  // Admin - Churches
  http.get(`${API_PREFIX}/admin/churches`, ({ request }) => {
    const churchesWithUsers = churches.map((church) => ({
      ...church,
      users: users.filter((user) => user.church_id === church.id).map(({ ...rest }) => rest),
    }));
    return HttpResponse.json(churchesWithUsers);
  }),

  http.get(`${API_PREFIX}/admin/churches/:id`, ({ params }) => {
    const { id } = params;
    const church = churches.find((c) => c.id === Number(id));

    if (church) {
      const churchWithUsers = {
        ...church,
        users: users.filter((user) => user.church_id === church.id).map(({ ...rest }) => rest),
      };
      return HttpResponse.json(churchWithUsers);
    } else {
      return HttpResponse.json({ message: 'Church not found' }, { status: 404 });
    }
  }),

  http.put(`${API_PREFIX}/admin/churches/:id`, async ({ request, params }) => {
    const { id } = params;
    const updatedData = (await request.json()) as any;
    const churchIndex = churches.findIndex((c) => c.id === Number(id));

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
    const churchIndex = churches.findIndex((c) => c.id === Number(id));

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
      id: Math.max(0, ...inviteCodes.map((c) => c.id)) + 1,
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
    const codeIndex = inviteCodes.findIndex((c) => c.id === Number(id));

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
    const codeIndex = inviteCodes.findIndex((c) => c.id === Number(id));

    if (codeIndex !== -1) {
      inviteCodes.splice(codeIndex, 1);
      return HttpResponse.json({ success: true });
    } else {
      return HttpResponse.json({ message: 'Invite code not found' }, { status: 404 });
    }
  }),

  // Church - Mutual Interests
  http.get(`${API_PREFIX}/church/mutual-interests`, ({ request }) => {
    const mutualInterestsWithDetails = mockMutualInterests.map((interest) => {
      const profile = profiles.find((p) => p.id === interest.profile_id);
      const jobListing = jobListings.find((j) => j.id === interest.job_listing_id);
      const inviteCode = inviteCodes.find((c) => c.id === profile?.invite_code_id);
      return { interest, profile, jobListing, inviteCode };
    });
    return HttpResponse.json(mutualInterestsWithDetails);
  }),

  // Candidate - Profile
  http.get(`${API_PREFIX}/profile`, ({ cookies }) => {
    // In a real app, the token would be decoded to get the user ID
    const token = cookies.token;

    // Simulate finding user from token. For MSW, we'll just find a candidate.
    // Let's alternate between John and Jane for demonstration.
    // A better mock would be to inspect the token if it contained user info.
    const userEmail = localStorage.getItem('user_email');

    let user;
    if (userEmail) {
      user = users.find((u) => u.email === userEmail);
    } else {
      // Default to John if no email is in localStorage
      user = users.find((u) => u.email === 'john.candidate@email.com');
    }

    if (!user || user.groups[0].toLowerCase() !== 'candidate') {
      return HttpResponse.json({ success: false, message: 'Profile not found' });
    }

    const profile = profiles.find((p) => p.user_id === user?.id);

    if (profile) {
      // Add phone number to the profile response for testing
      const profileWithPhone = {
        ...profile,
        phone: '555-123-4567',
      };
      return HttpResponse.json({ success: true, profile: profileWithPhone });
    } else {
      return HttpResponse.json({ success: false, message: 'Profile not found' });
    }
  }),

  // Church - Search Page
  http.get(`${API_PREFIX}/profiles/approved`, ({ request }) => {
    const approvedProfiles = profiles.filter((p) => p.status === 'approved');
    return HttpResponse.json(approvedProfiles);
  }),

  http.get(`${API_PREFIX}/church/interests`, ({ request }) => {
    const userEmail = localStorage.getItem('user_email');
    if (!userEmail) return HttpResponse.json([], { status: 401 });

    const churchUser = users.find((u) => u.email === userEmail);
    if (!churchUser || !churchUser.church_id) return HttpResponse.json([], { status: 401 });

    const churchInterests = mockMutualInterests
      .filter((i) => {
        const job = jobListings.find((j) => j.id === i.job_listing_id);
        return job?.church_id === churchUser.church_id && i.expressed_by === 'church';
      })
      .map((i) => ({ profile_id: i.profile_id }));

    return HttpResponse.json(churchInterests);
  }),

  http.get(`${API_PREFIX}/church/job-listings`, ({ request }) => {
    const userEmail = localStorage.getItem('user_email');
    if (!userEmail) return HttpResponse.json([], { status: 401 });

    const churchUser = users.find((u) => u.email === userEmail);
    if (!churchUser || !churchUser.church_id) return HttpResponse.json([], { status: 401 });

    const churchJobListings = jobListings.filter((j) => j.church_id === churchUser.church_id);
    return HttpResponse.json(churchJobListings);
  }),

  // Church - Express interest
  http.post(`${API_PREFIX}/church/interest`, async ({ request }) => {
    const { profileId, jobId } = (await request.json()) as { profileId: string; jobId: string };

    const userEmail = localStorage.getItem('user_email');
    if (!userEmail)
      return HttpResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const user = users.find((u) => u.email === userEmail);
    if (!user || user.groups[0] !== 'Church User') {
      return HttpResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const pId = Number(profileId);
    const jId = Number(jobId);

    const existingInterest = mockMutualInterests.find(
      (i) => i.profile_id === pId && i.job_listing_id === jId && i.expressed_by === 'church'
    );

    if (existingInterest) {
      // Retract interest
      const index = mockMutualInterests.findIndex((i) => i.id === existingInterest.id);
      mockMutualInterests.splice(index, 1);
      return HttpResponse.json({ success: true, expressed: false });
    } else {
      // Express interest
      const newInterest: MutualInterest = {
        id: Math.max(0, ...mockMutualInterests.map((i) => i.id)) + 1,
        job_listing_id: jId,
        profile_id: pId,
        expressed_by: 'church',
        expressed_by_user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockMutualInterests.push(newInterest);
      return HttpResponse.json({ success: true, expressed: true });
    }
  }),

  // Fallback for any other API requests
  http.get(`${API_PREFIX}/*`, ({ request }) => {
    console.warn(`Unhandled API call: ${request.method} ${request.url}`);
    return HttpResponse.json({ message: 'API not found' }, { status: 404 });
  }),
];
