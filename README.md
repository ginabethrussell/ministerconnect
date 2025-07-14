# Minister Connect

A multi-role Next.js application for connecting ministry candidates with churches, featuring role-based access for candidates, churches, admins, and super admins. Built with React, TypeScript, Tailwind CSS, and MSW for frontend development, with a Django REST API backend.

## Features

### **For Candidates**

- **Profile Management**: Create and edit detailed ministry profiles with resume upload
- **Job Listings**: Browse available ministry positions with detailed job descriptions
- **Express Interest**: Show interest in specific job listings with one-click functionality
- **Profile Status Tracking**: Monitor approval status of submitted profiles
- **Document Upload**: Upload resumes and ministry videos

### **For Churches**

- **Job Posting**: Create detailed job listings with ministry type, employment details, and church information
- **Candidate Search**: Browse and search through approved candidate profiles
- **Express Interest**: Show interest in promising candidates
- **Mutual Interests**: View candidates who have expressed interest in your job listings
- **Church Profile Management**: Complete church profile with contact and location information

### **For Admins**

- **Content Moderation**: Review and approve/reject candidate profiles and job listings
- **User Management**: Monitor platform users and manage accounts
- **Invite Code Management**: Generate and manage registration invite codes
- **Church Oversight**: Review and manage church accounts

### **For Super Admins**

- **Complete Platform Management**: Full administrative control over the entire platform
- **User Management**: View, edit, and manage all user accounts (candidates, churches, admins)
- **Password Reset**: Reset passwords for any user with secure temporary password generation
- **Church Management**: Comprehensive church account oversight and status management
- **Profile Review**: Approve or reject candidate profiles with detailed review process
- **Invite Code System**: Advanced invite code management with usage tracking and expiration
- **Activity Monitoring**: Real-time dashboard with platform statistics and activity logs
- **Audit Trail**: Complete tracking of all administrative actions

## Quick Start

### Frontend Only (Development with Mock API)

```bash
cd ministerconnect
npm install
npm run dev
```

The application will be available at `http://localhost:3000`

### Full Stack (Frontend + Backend)

1. **Start the Backend:**
   ```bash
   cd ministerconnect_backend
   python3 -m venv env
   source env/bin/activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

2. **Start the Frontend:**
   ```bash
   cd ministerconnect
   cp env.example .env.local
   # Edit .env.local to set NEXT_PUBLIC_API_URL=http://localhost:8000
   npm install
   npm run dev
   ```

## Backend Integration

The application now includes a fully functional Django REST API backend with:

- **JWT Authentication**: Secure token-based authentication
- **PostgreSQL Database**: Robust data storage
- **User Management**: Complete user creation and management
- **Church Management**: Church profile creation and management
- **Invite Code System**: Registration code generation and tracking
- **Candidate Registration**: Secure candidate onboarding

### Environment Setup

1. **Frontend Environment:**
   ```bash
   cd ministerconnect
   cp env.example .env.local
   # Set NEXT_PUBLIC_API_URL=http://localhost:8000 for backend integration
   ```

2. **Backend Environment:**
   ```bash
   cd ministerconnect_backend
   # Create .env file with SECRET_KEY and database settings
   ```

### API Integration

The frontend uses a centralized API client that automatically switches between:

- Mock API (development without backend)
- Real backend API (when `NEXT_PUBLIC_API_URL` is set)

All API endpoints are defined in `src/utils/api.ts` and match the Django backend implementation.

## Test Accounts

### **Super Admin**

- Email: `superadminuser@gmail.com`
- Password: `password123`

### **Admin**

- Email: `admin@ministerconnect.com`
- Password: `password123`

### **Church (Grace Fellowship)**

- Email: `pastor.bob@gracefellowship.org`
- Password: `password123`

### **Church (New Hope Community)**

- Email: `pastor.sarah@newhope.com`
- Password: `password123`

### **Candidate (Approved Profile)**

- Email: `john.candidate@email.com`
- Password: `password123`

### **Candidate (Pending Profile)**

- Email: `jane.candidate@email.com`
- Password: `password123`

## Documentation

- **Use Case Diagram**: See `docs/use-case-diagram.puml` for the PlantUML source code
- **API Data Model**: See `API_DATA_MODEL.md` for detailed data structure information
- **User Scenarios**: See `docs/user_scenarios/` for detailed user workflows
- **Documentation**: See `docs/README.md` for additional documentation
- **Backend Documentation**: See `ministerconnect_backend/README.md` for backend setup and API details

### Use Case Diagram

![Use Case Diagram](docs/usecase_diagram.png)

## User Journey Screenshots

### Landing Page

![Landing Page](screenshots/landingpage.png)

### Login Page

![Login](screenshots/login.png)

### Register Page

![Register](screenshots/register.png)

### Candidate Dashboard

![Candidate Dashboard](screenshots/candidatedashboard.png)

### Candidate Profile Form

![Candidate Profile Form](screenshots/candidateprofile.png)

### Candidate Job Listings

![Candidate Job Listings](screenshots/candidatejoblistings.png)

### Church Dashboard

![Church Dashboard](screenshots/churchdashboard.png)

### Church Create Job Listing

![Church Create Job Listing](screenshots/churchcreatejob.png)

### Church Manage Jobs

![Church Manage Jobs](screenshots/churchmanagejobs.png)

### Church Candidate Search

![Church Candidate Search](screenshots/churchsearchcandidates.png)

### Church Mutual Interests

![Church Mutual Interests](screenshots/churchmutualinterests.png)

### Admin Dashboard

![Admin Dashboard](screenshots/admindashboard.png)

### Admin Review Profiles

![Admin Review Profiles](screenshots/adminreviewprofiles.png)

### Admin Church Management

![Admin Manage Churches](screenshots/adminmanagechurches.png)

### Admin Create Church

![Admin Create Church](screenshots/admincreatechurch.png)

### Admin Edit Church

![Admin Edit Church](screenshots/admineditchurch.png)

### Admin Review Job Listings

![Admin Review Job Listings](screenshots/adminreviewjoblistings.png)

### Admin Manage Invite Codes

![Admin Manage Invite Codes](screenshots/adminmanageinvitecodes.png)

### Super Admin Dashboard

![Super Admin Dashboard](screenshots/superadmindashboard.png)

### Super Admin User Management

![Super Admin User Management](screenshots/superadminmanageusers.png)

### Super Admin Profile Management

![Super Admin Manage Profiles](screenshots/superadminmanageprofiles.png)

### Super Admin Church Management

![Super Admin Manage Churches](screenshots/superadminmanagechurches.png)

### Super Admin Invite Code Management

![Super Admin Manage Invite Codes](screenshots/superadminmanageinvitecodes.png)

## Tech Stack

### Frontend
- [Next.js](https://nextjs.org/) (v15+)
- [React](https://react.dev/) (v19+)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MSW (Mock Service Worker)](https://mswjs.io/)

### Backend
- [Django](https://www.djangoproject.com/) (v5.x)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT Authentication](https://django-rest-framework-simplejwt.readthedocs.io/)

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Python 3.8+
- PostgreSQL
- Yarn or npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ministerconnect-app
   ```

2. **Set up the Backend:**
   ```bash
   cd ministerconnect_backend
   python3 -m venv env
   source env/bin/activate
   pip install -r requirements.txt
   
   # Set up PostgreSQL database
   # Create .env file with SECRET_KEY
   python manage.py migrate
   python manage.py runserver
   ```

3. **Set up the Frontend:**
   ```bash
   cd ministerconnect
   npm install
   cp env.example .env.local
   # Edit .env.local to set NEXT_PUBLIC_API_URL=http://localhost:8000
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
# Frontend
cd ministerconnect
npm run build
npm start

# Backend
cd ministerconnect_backend
python manage.py collectstatic
python manage.py runserver
```

---

## Folder Structure

```
ministerconnect/
├── docs/                          # Documentation
│   ├── README.md                  # Additional documentation
│   ├── db_diagram.png            # Database schema diagram
│   ├── use-case-diagram.puml     # PlantUML source for use case diagram
│   ├── usecase_diagram.png       # Generated use case diagram
│   └── user_scenarios/           # Detailed user workflow documentation
│       ├── admin_dashboard.md
│       ├── admin_manage_invite_codes.md
│       ├── admin_manage_users.md
│       ├── admin_moderate_listings.md
│       ├── admin_moderate_profiles.md
│       ├── candidate_browse_jobs.md
│       ├── candidate_edit_profile.md
│       ├── candidate_express_interest.md
│       ├── candidate_register_login.md
│       ├── church_edit_profile.md
│       ├── church_express_interest.md
│       ├── church_manage_jobs.md
│       ├── church_post_job_listing.md
│       ├── church_register_login.md
│       ├── church_view_matches.md
│       ├── superadmin_dashboard.md
│       ├── superadmin_manage_churches.md
│       ├── superadmin_manage_invite_codes.md
│       ├── superadmin_manage_profiles.md
│       ├── superadmin_manage_users.md
│       ├── user_force_password_change.md
│       └── user_forgot_password.md
├── public/                        # Static assets
│   ├── assistant-pastor-resume.pdf
│   ├── family.jpg
│   ├── gldlogo.png
│   ├── mockServiceWorker.js      # MSW service worker
│   ├── sampleman.jpg
│   ├── student-pastor-resume.pdf
│   └── woman.jpg
├── screenshots/                   # Application screenshots
│   ├── admincreatechurch.png
│   ├── admindashboard.png
│   ├── admineditchurch.png
│   ├── adminmanagechurches.png
│   ├── adminmanageinvitecodes.png
│   ├── adminreviewjoblistings.png
│   ├── adminreviewprofiles.png
│   ├── candidatedashboard.png
│   ├── candidatejoblistings.png
│   ├── candidateprofile.png
│   ├── churchcreatejob.png
│   ├── churchdashboard.png
│   ├── churchmanagejobs.png
│   ├── churchmutualinterests.png
│   ├── churchsearchcandidates.png
│   ├── landingpage.png
│   ├── login.png
│   ├── register.png
│   ├── superadmindashboard.png
│   ├── superadminmanagechurches.png
│   ├── superadminmanageinvitecodes.png
│   ├── superadminmanageprofiles.png
│   └── superadminmanageusers.png
├── src/                          # Source code
│   ├── components/               # Reusable React components
│   │   ├── ExpressInterestButton.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── PasswordInput.tsx
│   │   └── PDFViewer.tsx
│   ├── mocks/                    # MSW mock service worker files
│   │   ├── browser.ts           # Browser setup for MSW
│   │   ├── data.ts              # Mock data definitions
│   │   └── handlers.ts          # API mock handlers
│   ├── pages/                    # Next.js pages organized by role
│   │   ├── _app.tsx             # App wrapper component
│   │   ├── index.tsx            # Landing page
│   │   ├── admin/               # Admin role pages
│   │   │   ├── churches/        # Church management
│   │   │   │   ├── create.tsx
│   │   │   │   └── edit.tsx
│   │   │   ├── churches.tsx
│   │   │   ├── codes.tsx
│   │   │   ├── index.tsx
│   │   │   ├── jobs.tsx
│   │   │   └── review.tsx
│   │   ├── auth/                # Authentication pages
│   │   │   ├── force-password-change.tsx
│   │   │   ├── forgot-password.tsx
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── reset-password.tsx
│   │   ├── candidate/           # Candidate role pages
│   │   │   ├── index.tsx
│   │   │   ├── jobs.tsx
│   │   │   └── profile.tsx
│   │   ├── church/              # Church role pages
│   │   │   ├── index.tsx
│   │   │   ├── jobs/            # Job management
│   │   │   │   └── create.tsx
│   │   │   ├── jobs.tsx
│   │   │   ├── mutual-interests.tsx
│   │   │   └── search.tsx
│   │   └── superadmin/          # Super admin role pages
│   │       ├── churches.tsx
│   │       ├── index.tsx
│   │       ├── invite-codes.tsx
│   │       ├── profiles.tsx
│   │       └── users.tsx
│   ├── styles/                   # Styling files
│   │   └── globals.css          # Global CSS styles
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts             # All type interfaces
│   └── utils/                    # Utility functions
│       ├── api.ts               # Centralized API client
│       └── pdfUtils.ts          # PDF handling utilities
├── API_DATA_MODEL.md            # Detailed API data model documentation
├── env.example                  # Environment variables template
├── package-lock.json            # NPM lock file
├── package.json                 # Project dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── README.md                    # Project documentation
├── tailwind.config.js          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

### Key Directories Explained

- **`src/pages/`**: Next.js pages organized by user role (admin, auth, candidate, church, superadmin)
- **`src/components/`**: Reusable React components used across multiple pages
- **`src/mocks/`**: Mock Service Worker (MSW) files for API mocking during development
- **`src/utils/`**: Utility functions including the centralized API client
- **`src/types/`**: TypeScript type definitions for all data models
- **`docs/user_scenarios/`**: Detailed documentation of user workflows for each role
- **`public/`**: Static assets including images, PDFs, and the MSW service worker
- **`screenshots/`**: Application screenshots used in documentation

## User Creation & Data Cleaning

- When creating a user via the API, you must provide `first_name` and `last_name` fields.
- The `name` field is automatically generated by concatenating the first and last names and should **not** be included in the request payload.
- The backend will:
  - Trim and lowercase all emails before saving or comparing.
  - Trim and titlecase all first and last names before saving.
- The frontend is encouraged to sanitize data as well, but the backend enforces these rules for consistency and data integrity.

## Password Reset (MVP Workflow)

For the MVP, password resets are handled manually by the site administrator. If you forget your password, please contact the admin at [ginabeth.russell@gmail.com](mailto:ginabeth.russell@gmail.com?subject=Minister%20Connect%20Password%20Reset%20Request) to request a password reset. The admin will reset your password and provide you with a temporary password.

Automated password reset via email will be implemented in a future release.
