import { http, HttpResponse } from 'msw';
import { v4 as uuidv4 } from 'uuid';

// Mock data
const mockUsers = [
  { email: 'applicant@gmail.com', password: 'password', role: 'applicant' },
  { email: 'church@gmail.com', password: 'password', role: 'church' },
  { email: 'admin@gmail.com', password: 'password', role: 'admin' },
];

let mockInviteCodes = [
  { id: '1', code: 'JOBFAIR25', event: 'Ministry Match', maxUses: 100, uses: 0 },
  { id: '2', code: 'EXPIRED_CODE', event: 'Old Event', maxUses: 10, uses: 10 },
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
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  experience: string;
  education: string;
  skills: string[];
  references: {
    name: string;
    email: string;
    phone: string;
  }[];
  resumeFileId?: string;
}

// Mock profile data
const mockProfile: Profile = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'applicant@gmail.com',
  phone: '123-456-7890',
  streetAddress: '123 Test St',
  city: 'Test City',
  state: 'TS',
  zipCode: '12345',
  status: 'draft',
  experience: '5 years in ministry',
  education: 'M.Div from Seminary',
  skills: ['Preaching', 'Teaching', 'Leadership'],
  references: [
    {
      name: 'Pastor Smith',
      email: 'smith@church.com',
      phone: '123-456-7890',
    },
  ],
};

// Mock data store
const profiles: Record<string, Profile> = {
  'test-user-id': mockProfile,
};
const files: Record<string, { data: ArrayBuffer; type: string }> = {};

// --- Applicant Review Mock Data ---
interface ApplicantReviewProfile {
  id: string;
  name: string;
  email: string;
  event: string;
  status: string;
  createdAt: string;
}

let mockApplicantProfiles: ApplicantReviewProfile[] = [
  {
    id: '1',
    name: 'Alice Smith',
    email: 'alice@example.com',
    event: 'Ministry Match',
    status: 'Pending',
    createdAt: '2024-06-01',
  },
  {
    id: '2',
    name: 'Bob Jones',
    email: 'bob@example.com',
    event: 'Old Event',
    status: 'Reviewed',
    createdAt: '2024-05-20',
  },
  {
    id: '3',
    name: 'Carol Lee',
    email: 'carol@example.com',
    event: 'Ministry Match',
    status: 'Pending',
    createdAt: '2024-06-02',
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

  // Login handler
  http.post('/api/login', async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string };
    const user = mockUsers.find((u) => u.email === email && u.password === password);
    if (user) {
      return Response.json({ success: true, role: user.role }, { status: 200 });
    }
    return Response.json(
      { success: false, message: 'Invalid email or password.' },
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
      email: 'applicant@gmail.com',
      role: 'applicant',
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

  // --- Applicant Review Handlers ---
  // GET /api/applicants?status=pending
  http.get('/api/applicants', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    let result = mockApplicantProfiles;
    if (status) {
      result = result.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }
    return HttpResponse.json(result);
  }),

  // PATCH /api/applicants/:id
  http.patch('/api/applicants/:id', async ({ params, request }) => {
    const { id } = params;
    const { status } = (await request.json()) as { status: string };
    let updated;
    mockApplicantProfiles = mockApplicantProfiles.map((p) => {
      if (p.id === id) {
        updated = { ...p, status };
        return updated;
      }
      return p;
    });
    if (!updated) {
      return new HttpResponse(JSON.stringify({ message: 'Applicant not found' }), { status: 404 });
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
];
