# API & Data Model Documentation

This document describes the core data models and API endpoints for the Minister Connect application. Use this as a reference for frontend mocks and future backend implementation.

## Database Schema
![Database Schema](docs/db_diagram.png)

---

## 1. Churches Model

```json
{
  "id": 1,
  "name": "Grace Fellowship Church",
  "email": "contact@gracefellowship.org",
  "phone": "555-111-1111",
  "website": "https://gracefellowship.org",
  "street_address": "123 Church Rd",
  "city": "Springfield",
  "state": "IL",
  "zipcode": "62704",
  "location": "Springfield, IL",
  "status": "active",
  "job_listings_count": 3,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

---

## 2. Users Model

```json
{
  "id": 1,
  "email": "admin@ministerconnect.com",
  "name": "Super Admin User",
  "password": "password123", // encrypted on the backend
  "role": "superadmin", // or "admin", "church", "candidate"
  "church_id": null,
  "status": "active", // or "pending", "suspended"
  "requires_password_change": false, // Track if user needs to change password on first login
  "last_login": "2024-01-15T10:30:00.000Z",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

---

## 3. Invite Codes Model

```json
{
  "id": 1,
  "code": "CHURCH2024",
  "event": "Spring 2024 Church Registration",
  "used_count": 3,
  "status": "active", // or "expired", "used"
  "created_by": 1, // User ID who created this code
  "expires_at": "2024-12-31T23:59:59.000Z",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

---

## 4. Profiles Model

```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.candidate@email.com",
  "user_id": 3,
  "invite_code_id": 1,
  "street_address": "789 Candidate Ave",
  "city": "Springfield",
  "state": "IL",
  "zipcode": "62701",
  "status": "approved", // or "pending", "rejected"
  "photo": "/sampleman.jpg",
  "resume": "/student-pastor-resume.pdf",
  "video_url": "https://www.youtube.com/live/jfKfPfyJRdk",
  "placement_preferences": ["Youth Ministry", "Missions"],
  "submitted_at": "2024-01-20T14:30:00.000Z",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

---

## 5. Job Listings Model

```json
{
  "id": 1,
  "church_id": 1,
  "title": "Youth Pastor",
  "ministry_type": "Youth",
  "employment_type": "Full Time with Benefits",
  "job_description": "We are seeking a passionate and experienced Youth Pastor to lead our growing youth ministry. The ideal candidate will have a heart for discipling young people, experience in youth ministry, and strong leadership skills. Responsibilities include planning and leading weekly youth services, organizing events and retreats, mentoring youth leaders, and collaborating with parents and church leadership.",
  "about_church": "Grace Fellowship Church is a vibrant, multi-generational congregation located in Springfield, IL. We are committed to making disciples who make disciples, with a strong emphasis on family ministry and community outreach. Our church values authentic relationships, biblical teaching, and serving our community with the love of Christ.",
  "status": "approved", // or "pending", "rejected"
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

---

## 6. Mutual Interests Model

```json
{
  "id": 1,
  "job_listing_id": 1,
  "profile_id": 1,
  "expressed_by": "candidate", // or "church"
  "expressed_by_user_id": 3,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

---

## 7. Activity Log Model

```json
{
  "id": 1,
  "user_id": 1, // User who performed the action (null for system events)
  "action": "profile_approved", // e.g., "profile_approved", "church_registered", "job_created"
  "entity_type": "profile", // or "user", "church", "job_listing", "invite_code"
  "entity_id": 5, // ID of the affected entity
  "details": "Profile approved for John Smith",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

---

## 8. Dashboard Statistics Model

```json
{
  "total_users": 1247,
  "active_churches": 89,
  "job_listings": 156,
  "pending_reviews": 23,
  "recent_activity": [
    {
      "id": 1,
      "user_id": 1,
      "action": "profile_approved",
      "entity_type": "profile",
      "entity_id": 5,
      "details": "Profile approved for John Smith",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## 9. Password Reset Model

```json
{
  "id": 1,
  "user_id": 5,
  "reset_by": 1, // User ID who performed the reset
  "reset_token": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456", // Secure reset token (not stored in DB)
  "reset_token_hash": "hashed_version_of_token", // Hashed version of the token for storage
  "expires_at": "2024-01-22T23:59:59.000Z", // When the reset token expires
  "used": false, // Whether the reset token has been used
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

---

## API Endpoints

### Authentication
- `POST /api/login` — Login user
- `POST /api/register` — Register candidate
- `POST /api/validate-invite` — Validate invite code
- `POST /api/forgot-password` — Request password reset
- `POST /api/reset-password` — Reset password using token
- `POST /api/validate-reset-token` — Validate reset token
- `POST /api/force-password-change` — Force password change on first login

### User Management
- `GET /api/user` — Get current user data
- `GET /api/candidates` — List candidates (admin/church)
- `GET /api/churches` — List churches (admin)
- `GET /api/users` — List all users (superadmin)
- `PUT /api/users/:id` — Update user status (superadmin)

### Profiles
- `GET /api/profile` — Get candidate profile
- `POST /api/profile` — Update candidate profile
- `POST /api/profile/upload` — Upload candidate document
- `GET /api/profiles` — List all profiles (superadmin)
- `POST /api/profiles/:id/review` — Approve/reject profile (superadmin)

### Job Listings
- `GET /api/job-listings` — List job listings (with optional status filter)
- `POST /api/job-listings` — Create new job listing
- `PUT /api/job-listings/:id` — Update job listing
- `DELETE /api/job-listings/:id` — Delete job listing

### Mutual Interests
- `GET /api/mutual-interests` — Get mutual interests for current user/church
- `POST /api/mutual-interests` — Express interest in a job/candidate
- `DELETE /api/mutual-interests/:id` — Remove interest

### Superadmin Operations
- `GET /api/superadmin/dashboard` — Get dashboard statistics
- `GET /api/superadmin/activity` — Get recent activity log
- `GET /api/superadmin/users` — List all users (superadmin)
- `PUT /api/superadmin/users/:id` — Update user status (superadmin)
- `GET /api/superadmin/profiles` — List all profiles (superadmin)
- `POST /api/superadmin/profiles/:id/review` — Approve/reject profile (superadmin)
- `GET /api/superadmin/churches` — List all churches (superadmin)
- `PUT /api/superadmin/churches/:id` — Update church status (superadmin)
- `GET /api/superadmin/invite-codes` — List invite codes
- `POST /api/superadmin/invite-codes` — Create invite code
- `PUT /api/superadmin/invite-codes/:id` — Update invite code
- `DELETE /api/superadmin/invite-codes/:id` — Delete invite code
- `POST /api/superadmin/users/:id/reset-password` — Generate reset token for user (superadmin)
- `GET /api/superadmin/users/:id/password-resets` — Get password reset history (superadmin)

### Admin Operations
- `POST /api/admin/review` — Admin approves/rejects candidate profile
- `POST /api/admin/review-job` — Admin approves/rejects job listing
- `GET /api/admin/invite-codes` — List invite codes
- `POST /api/admin/invite-codes` — Create invite code
- `PUT /api/admin/invite-codes/:id` — Update invite code
- `DELETE /api/admin/invite-codes/:id` — Delete invite code

---

## Notes

- Update this document as your data model or API evolves.
- Keep mock data and API responses in sync with this reference for easy backend integration.
- All timestamps are in ISO 8601 format.
- Status fields use lowercase values: "pending", "approved", "rejected", "active", "inactive", "suspended".
- Employment types include: "Full Time with Benefits", "Part Time", "Internship".
- Ministry types are free-form text (e.g., "Youth", "Worship", "Missions", "Children", "Administration").
- User roles include: "candidate", "church", "admin", "superadmin".
