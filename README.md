# Student Services Management Module

A web-based Student Services Management System built with Laravel 12 (Backend API) and React + TypeScript (Frontend).

## Tech Stack

### Backend
- **Framework:** Laravel 12
- **Authentication:** Laravel Sanctum (Token-based API auth)
- **Database:** SQLite (development) / MySQL (production ready)
- **Queue:** Laravel Queue (for async file imports)

### Frontend
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **State Management:** React Query (@tanstack/react-query)
- **HTTP Client:** Axios
- **Routing:** React Router v7

## Project Structure

```
raksoct/
├── backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── StudentController.php
│   │   │   │   ├── ServiceRequestController.php
│   │   │   │   └── ImportController.php
│   │   │   └── Requests/
│   │   │       ├── StoreStudentRequest.php
│   │   │       ├── UpdateStudentRequest.php
│   │   │       ├── StoreServiceRequestRequest.php
│   │   │       └── UpdateServiceRequestRequest.php
│   │   ├── Jobs/
│   │   │   └── ProcessServiceRequestImport.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Student.php
│   │   │   ├── ServiceRequest.php
│   │   │   └── ImportLog.php
│   │   └── Policies/
│   │       └── ServiceRequestPolicy.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
│
└── frontend/                # React SPA
    └── src/
        ├── api/
        │   ├── axios.ts              # Axios instance config
        │   └── services/             # API service layer
        │       ├── auth.service.ts
        │       ├── student.service.ts
        │       ├── service-request.service.ts
        │       └── import.service.ts
        ├── components/
        │   ├── ui/                   # Reusable UI components
        │   ├── students/             # Student-specific components
        │   ├── service-requests/     # Service request components
        │   └── import/               # Import module components
        ├── constants/                # App constants & enums
        ├── context/                  # React context providers
        ├── guards/                   # Route guards (Auth, Role, Guest)
        ├── hooks/                    # Custom React hooks
        ├── layouts/                  # Page layouts
        ├── lib/                      # Third-party library configs
        ├── pages/                    # Page components
        ├── types/                    # TypeScript interfaces
        └── utils/                    # Utility functions
```

## Architecture Explanation

### Backend Architecture

1. **Controller Layer** (`app/Http/Controllers/Api/`)
   - Handles HTTP requests and responses
   - Uses Form Requests for validation
   - Returns JSON responses

2. **Form Requests** (`app/Http/Requests/`)
   - Centralized validation logic
   - Reusable validation rules
   - Clean controller code

3. **Models** (`app/Models/`)
   - Eloquent ORM with relationships
   - `User` hasMany `ImportLog`
   - `Student` hasMany `ServiceRequest`
   - `ServiceRequest` belongsTo `Student`

4. **Policies** (`app/Policies/`)
   - Authorization logic separated from controllers
   - `ServiceRequestPolicy` - Only admin can delete requests

5. **Jobs** (`app/Jobs/`)
   - `ProcessServiceRequestImport` - Async CSV processing
   - Prevents blocking during large file uploads

### Frontend Architecture

1. **API Services Layer** (`src/api/services/`)
   - Centralized API calls per domain
   - Type-safe request/response handling
   - Separation from UI logic

2. **Custom Hooks** (`src/hooks/`)
   - React Query integration for data fetching
   - Automatic caching and invalidation
   - Loading and error states

3. **Guards** (`src/guards/`)
   - `AuthGuard` - Requires authentication
   - `RoleGuard` - Requires specific role
   - `GuestGuard` - Only for unauthenticated users

4. **Constants** (`src/constants/`)
   - Centralized enums and config values
   - Type-safe status and role definitions
   - No magic strings in components

5. **Utils** (`src/utils/`)
   - Reusable formatters (date, text)
   - Validators (email, file)
   - Helper functions

### Concurrency Handling

1. **Queue-based Import Processing**
   - CSV imports are processed asynchronously via Laravel Queue
   - User gets immediate response, processing happens in background
   - Import status can be polled (processing/completed/failed)

2. **Database Constraints**
   - Unique constraint on `students.student_number` and `students.email`
   - Composite unique constraint on service requests (`student_id`, `service_type`, `date_requested`)
   - Prevents duplicate entries at database level

3. **Transaction Safety**
   - Each row in import is processed independently
   - Failed rows don't affect successful ones
   - Detailed error logging per row

### Business Rules

1. **User Roles**
   - `admin` - Full access (CRUD all entities, delete requests, import)
   - `staff` - Limited access (CRUD students, view/approve/reject requests)

2. **Student Management**
   - Unique student number and email
   - Status: active/inactive
   - `is_imported` flag for auto-created students

3. **Service Requests**
   - Types: ID Replacement, Good Moral Certificate, Form 137
   - Status flow: Pending → Approved/Rejected
   - Only pending requests can be approved/rejected
   - Only admin can delete requests

4. **Import Rules**
   - Missing student number → Skip row
   - Non-existent student → Auto-create with `is_imported = true`
   - Inactive student → Skip row
   - Service type normalization (e.g., "good moral" → "Good Moral Certificate")
   - Duplicate detection → Skip row

## Setup Instructions

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- npm

### Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Run migrations with seed data
php artisan migrate:fresh --seed

# Create imports directory
mkdir storage/app/imports

# Start the development server
php artisan serve
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Running Queue Worker (for imports)

```bash
cd backend
php artisan queue:work
```

## Test Accounts

| Role  | Email             | Password |
|-------|-------------------|----------|
| Admin | admin@school.com  | password |
| Staff | staff@school.com  | password |

## API Endpoints

### Authentication
- `POST /api/login` - Login
- `POST /api/logout` - Logout (auth required)
- `GET /api/user` - Get current user (auth required)

### Students
- `GET /api/students` - List students (with search, status filter)
- `POST /api/students` - Create student
- `GET /api/students/{id}` - Get student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

### Service Requests
- `GET /api/service-requests` - List requests (with status, date filters)
- `POST /api/service-requests` - Create request
- `GET /api/service-requests/{id}` - Get request
- `PUT /api/service-requests/{id}` - Update request
- `DELETE /api/service-requests/{id}` - Delete request (admin only)
- `POST /api/service-requests/{id}/approve` - Approve request
- `POST /api/service-requests/{id}/reject` - Reject request

### Import
- `POST /api/import/upload` - Upload CSV file (admin only)
- `GET /api/import/logs` - List import logs

## Environment Variables

### Backend (.env)
```
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
DB_CONNECTION=sqlite
QUEUE_CONNECTION=database
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api
```

## Packages Used

### Backend (composer.json)
- `laravel/framework` - Laravel 12 framework
- `laravel/sanctum` - API token authentication

### Frontend (package.json)
- `react` - UI library
- `react-router-dom` - Client-side routing
- `axios` - HTTP client
- `@tanstack/react-query` - Data fetching & caching
- `tailwindcss` - Utility-first CSS
- `@tailwindcss/vite` - Vite plugin for Tailwind v4

## License

This project was created for a technical examination.
