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
  "status": "active",
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
  "password": "password123", // encrypted on the backend
  "role": "admin", // or "church", "candidate"
  "church_id": null,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

---

## 3. Invite Codes Model

```json
{
  "id": 1,
  "code": "SUMMERCONF24",
  "event": "Summer Conference 2024",
  "uses": 15,
  "status": "active",
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
  "employment_type": "Full-time",
  "job_posting_url": "https://gracefellowship.org/jobs/youth-pastor",
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

## 7. Notes

- Update this document as your data model or API evolves.
- Keep mock data and API responses in sync with this reference for easy backend integration.
