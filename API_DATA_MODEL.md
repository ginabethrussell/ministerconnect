# API & Data Model Documentation

This document describes the core data models and API endpoints for the Ministry Match application. Use this as a reference for frontend mocks and future backend implementation.

---

## 1. User Model

```json
{
  "id": "user_123",
  "email": "candidate@gmail.com",
  "name": "Jane Doe",
  "role": "applicant", // or "church", "admin"
  "churchId": "church_456", // only for applicants
  "status": "active" // or "pending", "rejected"
}
```

---

## 2. Church Model

```json
{
  "id": "church_456",
  "name": "First Evangelical Free Church",
  "contactEmail": "pastor@firstefc.org",
  "subscriptionStatus": "active", // or "trial", "inactive"
  "address": "123 Main St, City, State",
  "users": ["user_789", "user_101"] // church admins/users
}
```

---

## 3. Invite Code Model

```json
{
  "code": "JOBFAIR24",
  "maxUses": 100,
  "uses": 23,
  "event": "Job Fair 2024",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

---

## 4. Candidate Profile/Upload Model

```json
{
  "id": "profile_001",
  "userId": "user_123",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "555-123-4567",
  "streetAddress": "123 Main St",
  "city": "Springfield",
  "state": "IL",
  "zipCode": "62704",
  "event": "Ministry Match",
  "createdAt": "2024-06-01",
  "resumeUrl": "https://s3.amazonaws.com/bucket/resume.pdf",
  "videoUrl": "https://example.com/video-jane.mp4",
  "status": "pending",
  "adminReviewedBy": "user_999",
  "adminReviewedAt": "2024-06-15T12:00:00Z"
}
```

---

## 5. Example API Endpoints

| Endpoint               | Method | Description                             | Request/Response Example                          |
| ---------------------- | ------ | --------------------------------------- | ------------------------------------------------- |
| `/api/login`           | POST   | Login user                              | `{ email, password }` → `{ success, role }`       |
| `/api/register`        | POST   | Register candidate                     | `{ code, name, email, password }` → `{ success }` |
| `/api/validate-invite` | POST   | Validate invite code                    | `{ code }` → `{ valid, event }`                   |
| `/api/candidates`      | GET    | List candidates (admin/church)          | → `[user, ...]`                                   |
| `/api/churches`        | GET    | List churches (admin)                   | → `[church, ...]`                                 |
| `/api/profile`         | GET    | Get candidate profile                   | → `{ ...profile }`                                |
| `/api/profile/upload`  | POST   | Upload candidate document               | `{ file }` → `{ url }`                            |
| `/api/admin/review`    | POST   | Admin approves/rejects candidate upload | `{ profileId, status }` → `{ success }`           |

---

## 6. Mock Data Example (for MSW)

```js
const mockUsers = [
  {
    id: 'user_1',
    email: 'candidate@gmail.com',
    name: 'Jane Doe',
    role: 'candidate',
    churchId: 'church_1',
    status: 'active',
  },
  { id: 'user_2', email: 'church@gmail.com', name: 'Pastor Bob', role: 'church', status: 'active' },
  { id: 'user_3', email: 'admin@gmail.com', name: 'Super Admin', role: 'admin', status: 'active' },
];

const mockChurches = [
  {
    id: 'church_1',
    name: 'First Evangelical Free Church',
    contactEmail: 'pastor@firstefc.org',
    subscriptionStatus: 'active',
    address: '123 Main St',
    users: ['user_2'],
  },
];

// Example handler
http.get('/api/candidates', ({ request }) => {
  // Return candidates for admin/church
  return Response.json(mockUsers.filter((u) => u.role === 'candidate'));
});
```

---

## 7. Notes

- Update this document as your data model or API evolves.
- Keep mock data and API responses in sync with this reference for easy backend integration.
