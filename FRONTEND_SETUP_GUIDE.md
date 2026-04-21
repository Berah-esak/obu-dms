# Dormitory Management System (DMS) - Frontend Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Frontend Installation & Setup](#frontend-installation--setup)
3. [Environment Configuration](#environment-configuration)
4. [Running the Frontend](#running-the-frontend)
5. [Building for Production](#building-for-production)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** or **bun**
- **Backend API** running on `http://localhost:5000` (see BACKEND_SETUP_GUIDE.md)

### Verify Installation
```bash
# Check Node.js version
node --version

# Check npm version
npm --version
```

---

## Frontend Installation & Setup

### Step 1: Navigate to Project Root

```bash
cd oda-bultum-dms
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install

# Or using bun
bun install
```

This will install all required packages including:
- **React** 18.3.1 - UI library
- **Vite** 5.4.19 - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Router** - Navigation
- **React Hook Form** - Form handling
- **TanStack Query** - Data fetching
- **Zod** - Validation
- **Recharts** - Charts and graphs
- **Vitest** - Testing framework
- **Playwright** - E2E testing

---

## Environment Configuration

### Step 1: Create `.env` File

```bash
# In the project root directory
cp .env.example .env
```

Or create a new `.env` file with:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Application Settings
VITE_APP_NAME=Oda Bultum DMS
VITE_APP_VERSION=1.0.0

# Session Configuration
VITE_SESSION_TIMEOUT=1800000

# Language Settings
VITE_DEFAULT_LANGUAGE=en

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_NOTIFICATIONS=true
```

### Step 2: Verify Backend Connection

Ensure the backend API is running:
```bash
# In another terminal
cd backend
npm run dev
```

Expected output:
```
DMS API listening on port 5000
```

---

## Running the Frontend

### Development Mode

```bash
npm run dev
```

**Expected Output:**
```
  VITE v5.4.19  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

The application will be available at `http://localhost:5173`

### Access the Application

1. Open your browser
2. Navigate to `http://localhost:5173`
3. You should see the login page

---

## Login & Testing

### Test Credentials

After running the backend seed command (`npm run seed` in backend), use these credentials:

#### System Admin
```
Username: admin
Password: Admin@2026
```

#### Dorm Admin
```
Username: dormadmin
Password: DormAdmin@1234
```

#### Maintenance Staff
```
Username: maintenance
Password: Maintenance@1234
```

#### Manager
```
Username: manager
Password: Manager@1234
```

#### Student
```
Username: sam.student
Password: Admin@2026
```

### Login Flow

1. Navigate to `http://localhost:5173/login`
2. Enter username and password
3. Click "Login"
4. You'll be redirected to the dashboard based on your role

---

## Building for Production

### Build Command

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

**Output:**
```
dist/
├── index.html
├── assets/
│   ├── index-xxxxx.js
│   ├── index-xxxxx.css
│   └── ...
└── robots.txt
```

### Development Build

```bash
npm run build:dev
```

This builds with development optimizations (useful for debugging production issues).

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally at `http://localhost:4173` for testing.

---

## Testing

### Unit Tests

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npx playwright test

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run specific test file
npx playwright test tests/auth.spec.ts

# Debug mode
npx playwright test --debug
```

### Linting

```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint -- --fix
```

---

## Project Structure

```
oda-bultum-dms/
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── DashboardLayout.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── RouteGuards.tsx
│   │   └── ...
│   ├── pages/                  # Page components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions
│   ├── types/                  # TypeScript types
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── public/                     # Static assets
├── docs/                       # Documentation
├── tests/                      # Test files
├── .env                        # Environment variables
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
└── README.md                   # Project README
```

---

## Key Features & Routes

### Authentication Routes
- `/login` - User login page
- `/register` - Student registration
- `/forgot-password` - Password recovery

### Dashboard Routes
- `/dashboard` - Main dashboard (role-based)
- `/profile` - User profile
- `/settings` - Application settings

### Student Routes
- `/student/assignment` - View room assignment
- `/student/maintenance-requests` - Submit/view maintenance requests
- `/student/room-changes` - Request room changes

### Admin Routes
- `/rooms` - Room management
- `/students` - Student management
- `/allocation` - Room allocation
- `/maintenance` - Maintenance management
- `/inventory` - Inventory management
- `/reports` - Reports and analytics
- `/users` - User management
- `/audit-logs` - Audit logs
- `/notifications` - Notifications

---

## API Integration

### API Base URL

The frontend communicates with the backend API at:
```
http://localhost:5000/api
```

### Authentication

All API requests (except login) include the JWT token:

```javascript
// Automatically handled by the API client
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Example API Call

```typescript
// Using TanStack Query
import { useQuery } from '@tanstack/react-query';

const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.json();
  }
});
```

---

## Customization

### Theme Configuration

The application supports light and dark themes. Theme settings are in:
- `src/components/ThemeToggle.tsx` - Theme toggle component
- `tailwind.config.js` - Tailwind CSS theme configuration

### Multi-Language Support

Language files are located in `src/lib/i18n/`. Currently supports:
- English (en)
- Amharic (am)
- Afan Oromo (om)

To add a new language:
1. Create a new file in `src/lib/i18n/`
2. Add translations
3. Update language selector in settings

### Component Customization

All UI components are in `src/components/ui/` and can be customized:
- Colors in `tailwind.config.js`
- Component styles in individual component files
- Global styles in `src/index.css`

---

## Performance Optimization

### Code Splitting

Routes are automatically code-split by Vite:
```typescript
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/Users'));
```

### Image Optimization

- Use WebP format when possible
- Compress images before adding to `public/`
- Use responsive images with `srcset`

### Bundle Analysis

```bash
# Install bundle analyzer
npm install -D vite-plugin-visualizer

# Analyze bundle
npm run build -- --analyze
```

---

## Troubleshooting

### Issue: "Cannot connect to API"

**Solution:**
```bash
# Verify backend is running
cd backend
npm run dev

# Check VITE_API_URL in .env
VITE_API_URL=http://localhost:5000/api

# Restart frontend
npm run dev
```

### Issue: "Port 5173 already in use"

**Solution:**
```bash
# Find process using port 5173
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or use a different port
npm run dev -- --port 5174
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

### Issue: "TypeScript errors"

**Solution:**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix errors in the code
# Or disable strict mode in tsconfig.json if needed
```

### Issue: "Blank page on load"

**Solution:**
```bash
# Check browser console for errors (F12)
# Verify .env file is correct
# Check if backend API is running
# Clear browser cache (Ctrl+Shift+Delete)
```

### Issue: "Login fails with 401 error"

**Solution:**
```bash
# Verify backend is running
# Check credentials are correct
# Verify CORS_ORIGIN in backend .env matches frontend URL
# Check JWT_SECRET is set in backend .env
```

### Issue: "Styles not loading"

**Solution:**
```bash
# Rebuild Tailwind CSS
npm run dev

# Clear browser cache
# Check tailwind.config.js is correct
# Verify index.css is imported in main.tsx
```

---

## Development Workflow

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start Frontend
```bash
npm run dev
```

### 3. Open Browser
```
http://localhost:5173
```

### 4. Make Changes
- Edit files in `src/`
- Changes auto-reload in browser
- Check console for errors

### 5. Test Changes
```bash
npm run test
npm run lint
```

### 6. Build for Production
```bash
npm run build
npm run preview
```

---

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API URL |
| `VITE_APP_NAME` | `Oda Bultum DMS` | Application name |
| `VITE_APP_VERSION` | `1.0.0` | Application version |
| `VITE_SESSION_TIMEOUT` | `1800000` | Session timeout in ms (30 min) |
| `VITE_DEFAULT_LANGUAGE` | `en` | Default language (en/am/om) |
| `VITE_ENABLE_ANALYTICS` | `false` | Enable analytics |
| `VITE_ENABLE_NOTIFICATIONS` | `true` | Enable notifications |

---

## Production Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy to Traditional Server
```bash
# Build
npm run build

# Copy dist/ to server
scp -r dist/* user@server:/var/www/dms/

# Configure web server (nginx/apache)
# Point to dist/index.html for all routes
```

### Environment Variables for Production
```env
VITE_API_URL=https://api.obu.edu.et/dms/v1
VITE_APP_NAME=Oda Bultum DMS
VITE_SESSION_TIMEOUT=1800000
VITE_DEFAULT_LANGUAGE=en
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
```

---

## Quick Reference

### Start Development
```bash
npm run dev
```

### Build Production
```bash
npm run build
```

### Run Tests
```bash
npm run test
```

### Lint Code
```bash
npm run lint
```

### Preview Build
```bash
npm run preview
```

### Frontend URL
```
http://localhost:5173
```

### Backend URL
```
http://localhost:5000/api
```

---

## Support & Documentation

- **API Reference**: See `/docs/API_REFERENCE.md`
- **Backend Setup**: See `BACKEND_SETUP_GUIDE.md`
- **Requirements**: See `/docs/REQUIREMENTS.md`
- **Issues**: Check the Troubleshooting section above

---

**Last Updated:** April 2026
**Version:** 1.0.0
