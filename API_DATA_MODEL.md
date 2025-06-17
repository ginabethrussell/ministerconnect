# API & Data Model Documentation

This document describes the core data models and API endpoints for the Ministry Match application. Use this as a reference for frontend mocks and future backend implementation.

---

## 1. User Model

```json
{
  "id": "user_123",
  "email": "applicant@gmail.com",
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

## 4. Applicant Profile/Upload Model

```json
{
  "id": "profile_001",
  "userId": "user_123",
  "resumeUrl": "https://s3.amazonaws.com/bucket/resume.pdf",
  "status": "pending", // or "approved", "rejected"
  "adminReviewedBy": "user_999",
  "adminReviewedAt": "2024-06-15T12:00:00Z"
}
```

---

## 5. Example API Endpoints

| Endpoint               | Method | Description                             | Request/Response Example                          |
| ---------------------- | ------ | --------------------------------------- | ------------------------------------------------- |
| `/api/login`           | POST   | Login user                              | `{ email, password }` → `{ success, role }`       |
| `/api/register`        | POST   | Register applicant                      | `{ code, name, email, password }` → `{ success }` |
| `/api/validate-invite` | POST   | Validate invite code                    | `{ code }` → `{ valid, event }`                   |
| `/api/applicants`      | GET    | List applicants (admin/church)          | → `[user, ...]`                                   |
| `/api/churches`        | GET    | List churches (admin)                   | → `[church, ...]`                                 |
| `/api/profile`         | GET    | Get applicant profile                   | → `{ ...profile }`                                |
| `/api/profile/upload`  | POST   | Upload applicant document               | `{ file }` → `{ url }`                            |
| `/api/admin/review`    | POST   | Admin approves/rejects applicant upload | `{ profileId, status }` → `{ success }`           |

---

## 6. Mock Data Example (for MSW)

```js
const mockUsers = [
  {
    id: 'user_1',
    email: 'applicant@gmail.com',
    name: 'Jane Doe',
    role: 'applicant',
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
http.get('/api/applicants', ({ request }) => {
  // Return applicants for admin/church
  return Response.json(mockUsers.filter((u) => u.role === 'applicant'));
});
```

---

## 7. Notes

- Update this document as your data model or API evolves.
- Keep mock data and API responses in sync with this reference for easy backend integration.
