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

The frontend uses a centralized API client that connects to the following:

- Real backend API (when `NEXT_PUBLIC_API_URL` is set)
  - Locally running at http://localhost:8000
  - Or on the deployed backend URL

All API endpoints are defined in `src/utils/api.ts` and match the Django backend implementation.

## Documentation

- **Use Case Diagram**: See `docs/use-case-diagram.puml` for the PlantUML source code
- **API Data Model**: See `API_DATA_MODEL.md` for detailed data structure information
- **User Scenarios**: See `docs/user_scenarios/` for detailed user workflows
- **Documentation**: See `docs/README.md` for additional documentation
- **MVP Testing Requirements**: See `docs/mvp_testing_requirements/` for mvp delivery criteria
- **Backend Documentation**: See `ministerconnect_backend/README.md` for backend setup and API details

### Use Case Diagram

![Use Case Diagram](docs/usecase_diagram.png)

## 📸 User Journey Screenshots

Below are example views from the MinisterConnect backend and frontend:

### Landing Page

<p align="center">
  <img src="" alt="landing-page" width="280" />
  <br />
  <em>Landing Page</em>
</p>

### Authentication & Candidate Registration

<table>
  <tr>
    <td align="center">
      <img src="" width="280" alt="login" /><br/>
      <em>Login Screen</em>
    </td>
    <td align="center">
      <img src="" width="280" alt="registration" /><br/>
      <em>Registration</em>
    </td>
    <td align="center">
      <img src="" width="280" alt="reset-password" /><br/>
      <em>Reset Password</em>
    </td>
  </tr>
</table>

### Candidate User Journeys

<table>
  <tr>
    <td align="center">
      <img src="" width="280" alt="dashboard" /><br/>
      <em>Dashboard</em>
    </td>
    <td align="center">
      <img src="" width="280" alt="view-profile" /><br/>
      <em>Profile View</em>
    </td>
   <td align="center">
      <img src="" width="280" alt="edit-profile" /><br/>
      <em>Edit Profile</em>
    </td>
    <td align="center">
      <img src="" width="280" alt="view-jobs" /><br/>
      <em>View and Express Interest in Jobs</em>
    </td>
  </tr>
</table>

### Church User Journeys

<table>
  <tr>
    <td align="center">
      <img src="" width="280" alt="dashboard" /><br/>
      <em>Dashboard</em>
    </td>
    <td align="center">
      <img src="" width="280" alt="view-church" /><br/>
      <em>Church View</em>
    </td>
   <td align="center">
      <img src="" width="280" alt="edit-church" /><br/>
      <em>Edit Church</em>
    </td>
    <td align="center">
      <img src="" width="280" alt="view-candidates" /><br/>
      <em>View and Express Interest in Candidates</em>
    </td>
    <td align="center">
      <img src="" width="280" alt="view-jobs" /><br/>
      <em>View and Create Jobs</em>
    </td>
    <td align="center">
      <img src="" width="280" alt="view-mutual-interests" /><br/>
      <em>View Mutual Interests</em>
    </td>
  </tr>
</table>

### Admin User Journeys

<table>
  <tr>
    <td align="center">
      <img src="" width="280" alt="dashboard" /><br/>
      <em>Dashboard</em>
    </td>
    <td align="center">
      <img src="" width="280" alt="create-church" /><br/>
      <em>Create Church</em>
    </td>
    <td align="center">
      <img src="" width="280" alt="view-church" /><br/>
      <em>View Church</em>
    </td>
   <td align="center">
      <img src="" width="280" alt="edit-church" /><br/>
      <em>Edit Church</em>
    </td>
    <td align="center">
      <img src="" width="280" alt="review-candidates" /><br/>
      <em>Review Candidates</em>
    </td>
    <td align="center">
      <img src="" width="280" alt="review-jobs" /><br/>
      <em>Review Jobs</em>
    </td>
    <td align="center">
      <img src="" width="280" alt="manage-invite-codes" /><br/>
      <em>Manage Invite Codes</em>
    </td>
  </tr>
</table>

## 🚧 Roadmap Super Admin Journeys

## Tech Stack

### Frontend

- [Next.js](https://nextjs.org/) (v15+)
- [React](https://react.dev/) (v19+)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

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
│   ├── usecase_diagram.png
|   ├── mvp_testing_requirements/
│   └── user_scenarios/           # Detailed user workflow documentation
├── public/                        # Static assets
├── screenshots/                   # Application screenshots
├── src/                          # Source code
│   ├── components/               # Reusable React components
│   ├── pages/                    # Next.js pages organized by role
│   │   ├── _app.tsx             # App wrapper component
│   │   ├── index.tsx            # Landing page
│   │   ├── admin/               # Admin role pages
│   │   ├── auth/                # Authentication pages
│   │   ├── candidate/           # Candidate role pages
│   │   ├── church/              # Church role pages
│   │   └── superadmin/          # Super admin role pages
│   ├── styles/                   # Styling files        # Global CSS styles
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Utility functions
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
- **`src/context/`**: Reusable React context used across multiple pages
- **`src/utils/`**: Utility functions including the centralized API client
- **`src/types/`**: TypeScript type definitions for data models
- **`docs/`**: Detailed documentation
- **`public/`**: Static assets
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
