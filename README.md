# Ministry Match

A multi-role Next.js application for connecting ministry candidates with churches, featuring role-based access for candidates, churches, and super admins. Built with React, TypeScript, Tailwind CSS, and MSW for frontend development and API mocking.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [API & Data Model](#api--data-model)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Ministry Match streamlines the process of matching ministry candidates with churches. The app supports three user roles:

- **Candidates**: Register, complete a profile, and upload resumes/videos.
- **Churches**: Search candidates, save candidates, and contact admin.
- **Super Admin**: Manage users, churches, invite codes, and review candidate uploads.

The frontend is fully mocked using [MSW](https://mswjs.io/) for rapid development and testing.

---

## Features

- Role-based authentication and navigation
- Invite code registration (supports multi-use codes)
- Responsive, accessible UI styled after EFCA branding
- Candidate profile with resume/video upload (file or URL)
- Admin dashboard for reviewing candidates, managing churches, and invite codes
- Mocked API endpoints and data models for frontend development

---

## Tech Stack

- [Next.js](https://nextjs.org/) (v15+)
- [React](https://react.dev/) (v19+)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MSW (Mock Service Worker)](https://mswjs.io/)

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Yarn or npm

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ministry-match
   ```
2. Install dependencies:
   ```
   yarn install
   # or
   npm install
   ```
3. Start the development server:
   ```
   yarn dev
   # or
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

```
yarn build
yarn start
# or
npm run build
npm start
```

---

## Folder Structure

```
ministry-match/
├── public/                # Static assets & MSW worker
├── src/
│   ├── components/        # Shared React components (e.g., Header)
│   ├── pages/             # Next.js pages (see below)
│   │   ├── index.tsx      # Landing page
│   │   ├── auth/          # Login & registration
│   │   ├── candidate/     # Candidate profile & dashboard
│   │   ├── church/        # Church dashboard
│   │   └── admin/         # Admin dashboard & tools
│   ├── styles/            # Tailwind/global CSS
│   └── types/             # TypeScript types
├── API_DATA_MODEL.md      # API & data model documentation
├── tailwind.config.js     # Tailwind config
├── postcss.config.js      # PostCSS config
├── tsconfig.json          # TypeScript config
├── package.json           # Project metadata & scripts
└── README.md              # This file
```

---

## API & Data Model (Mocked)

See [`API_DATA_MODEL.md`](./API_DATA_MODEL.md) for full details.

**Key Endpoints:**

- `POST /api/login` — Login user
- `POST /api/register` — Register candidate
- `POST /api/validate-invite` — Validate invite code
- `GET /api/candidates` — List applicants (admin/church)
- `GET /api/churches` — List churches (admin)
- `GET /api/profile` — Get candidate profile
- `POST /api/profile/upload` — Upload candidate document
- `POST /api/admin/review` — Admin approves/rejects candidate profile

**Core Models:**

- User (candidate, church, admin)
- Church
- Invite Code (supports multi-use)
- Candidate Profile/Upload

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and open a Pull Request

---

## License

This project is licensed under the MIT License. See `package.json` for details.
