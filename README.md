# TaskManager — Full-Stack Task Management App

A complete full-stack task management application built with **Next.js**, **TypeScript**, **Prisma ORM**, and **MongoDB Atlas**. Features user authentication with JWT, full CRUD for tasks, protected routes, and a responsive Kanban-style dashboard.

> Built for EncoderX Remote Internship Batch 02 — Track: Full Stack Development

---

## Live Demo

> 🔗 [Add your Vercel deployment URL here]

## GitHub Repository

> 🔗 [Add your GitHub repository URL here]

---

## Features

- ✅ **User Registration** — Secure sign-up with validation and bcrypt password hashing
- ✅ **User Login** — JWT-based authentication stored in httpOnly cookies
- ✅ **Protected Dashboard** — Route protection via Next.js proxy (middleware)
- ✅ **Task CRUD** — Create, Read, Update, and Delete tasks
- ✅ **Task Status** — Three statuses: `TODO`, `IN_PROGRESS`, `DONE`
- ✅ **Kanban View** — Tasks grouped by status in three columns
- ✅ **User Isolation** — Users only ever see and modify their own tasks
- ✅ **Responsive UI** — Works on desktop and mobile
- ✅ **Loading States** — Spinner feedback on all async operations
- ✅ **Error Handling** — User-friendly error messages throughout
- ✅ **Secure** — httpOnly cookies, bcrypt hashing, server-side ownership checks

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| ORM | Prisma v6 |
| Database | MongoDB Atlas |
| Authentication | JWT (via `jose`) + httpOnly cookies |
| Password Hashing | bcryptjs |
| Deployment | Vercel |

---

## Project Structure

```
taskmanager/
├── prisma/
│   └── schema.prisma          # Prisma data models (User, Task)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── register/route.ts   # POST /api/auth/register
│   │   │   │   ├── login/route.ts      # POST /api/auth/login
│   │   │   │   └── logout/route.ts     # POST /api/auth/logout
│   │   │   ├── tasks/
│   │   │   │   ├── route.ts            # GET, POST /api/tasks
│   │   │   │   └── [id]/route.ts       # PUT, DELETE /api/tasks/[id]
│   │   │   └── health/route.ts         # GET /api/health
│   │   ├── login/page.tsx              # Login page
│   │   ├── register/page.tsx           # Registration page
│   │   ├── dashboard/
│   │   │   ├── page.tsx                # Server component (auth check)
│   │   │   └── DashboardClient.tsx     # Client component (UI logic)
│   │   ├── layout.tsx                  # Root layout
│   │   ├── page.tsx                    # Root page (redirect)
│   │   └── globals.css                 # Global styles (Tailwind)
│   ├── components/
│   │   ├── TaskCard.tsx                # Individual task card
│   │   ├── TaskModal.tsx               # Create task modal
│   │   └── LoadingSpinner.tsx          # Reusable spinner
│   ├── lib/
│   │   ├── auth.ts                     # JWT utilities (sign, verify, getSession)
│   │   ├── prisma.ts                   # Prisma client singleton
│   │   └── types.ts                    # Shared TypeScript types
│   └── proxy.ts                        # Route protection (Next.js proxy/middleware)
├── .env.example                        # Environment variables template
├── .gitignore                          # Git ignore rules
└── README.md                           # This file
```

---

## Environment Variables

Create a `.env` file in the root of the project. **Never commit this file to Git.**

```env
# MongoDB Atlas Connection String
DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/taskmanager?retryWrites=true&w=majority"

# JWT Secret — generate with: openssl rand -base64 32
AUTH_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"
```

See `.env.example` for a template.

---

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and create a free account
2. Create a new **Cluster** (free tier M0 is fine)
3. Go to **Database Access** → Create a database user with a username and password
4. Go to **Network Access** → Click **Add IP Address** → Choose **Allow Access from Anywhere** (for Vercel deployment)
5. Go to your cluster → **Connect** → **Drivers** → copy the connection string
6. Replace `<username>`, `<password>`, and `<dbname>` in the connection string
7. Paste the final string as your `DATABASE_URL` in `.env`

---

## Prisma Setup

After configuring `DATABASE_URL`:

```bash
# Generate Prisma Client
npx prisma generate

# For MongoDB Atlas, no migration is needed — Prisma creates collections automatically on first use
# However, you can introspect the database after some data exists:
# npx prisma db pull
```

---

## Running Locally

### Prerequisites

- Node.js v18+
- A MongoDB Atlas cluster (or local MongoDB)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/taskmanager.git
cd taskmanager

# Install dependencies (also runs prisma generate via postinstall)
npm install

# Copy environment variables template
cp .env.example .env
# Edit .env and fill in your actual values

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Documentation

### Authentication

All task endpoints require authentication. Pass the JWT cookie automatically (handled by the browser when making requests from the frontend).

For Postman, after login, copy the `taskmanager_token` cookie and add it to subsequent requests.

---

### POST `/api/auth/register`

Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Success Response (201):**
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "64f...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400` — Validation error (missing fields, password too short, etc.)
- `409` — Email already exists

---

### POST `/api/auth/login`

Authenticate a user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "64f...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400` — Missing fields or invalid email format
- `401` — Invalid email or password

---

### POST `/api/auth/logout`

Log out the current user (clears the auth cookie).

**Authentication:** Required

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### GET `/api/tasks`

Retrieve all tasks for the authenticated user.

**Authentication:** Required

**Success Response (200):**
```json
{
  "tasks": [
    {
      "id": "64f...",
      "title": "Build the API",
      "description": "Create all REST endpoints",
      "status": "IN_PROGRESS",
      "userId": "64f...",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `401` — Not authenticated

---

### POST `/api/tasks`

Create a new task.

**Authentication:** Required

**Request Body:**
```json
{
  "title": "Build the API",
  "description": "Create all REST endpoints",
  "status": "TODO"
}
```

> `description` is optional. `status` defaults to `TODO` if not provided.

**Success Response (201):**
```json
{
  "message": "Task created successfully",
  "task": {
    "id": "64f...",
    "title": "Build the API",
    "description": "Create all REST endpoints",
    "status": "TODO",
    "userId": "64f...",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` — Missing title or invalid status
- `401` — Not authenticated

---

### PUT `/api/tasks/[id]`

Update an existing task.

**Authentication:** Required

**Request Body (all fields optional):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "IN_PROGRESS"
}
```

**Success Response (200):**
```json
{
  "message": "Task updated successfully",
  "task": { ... }
}
```

**Error Responses:**
- `400` — Invalid input
- `401` — Not authenticated
- `403` — Task belongs to another user
- `404` — Task not found

---

### DELETE `/api/tasks/[id]`

Delete a task.

**Authentication:** Required

**Success Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

**Error Responses:**
- `401` — Not authenticated
- `403` — Task belongs to another user
- `404` — Task not found

---

## Authentication Explanation

This application uses **JWT (JSON Web Tokens)** stored in **httpOnly cookies** for authentication.

**Why httpOnly cookies?**
- JavaScript cannot access httpOnly cookies, preventing XSS attacks
- Cookies are automatically sent with every request
- Works correctly on Vercel in production

**Flow:**
1. User registers or logs in → API creates a JWT signed with `AUTH_SECRET`
2. JWT is set as an httpOnly cookie (`taskmanager_token`, 7-day expiry)
3. On every request, the cookie is verified server-side using `jose`
4. Protected routes and API endpoints reject requests with invalid/missing tokens
5. Logout clears the cookie by setting `maxAge: 0`

---

## Security Considerations

- **Passwords** are hashed with `bcryptjs` (cost factor 12) — never stored in plain text
- **JWT secrets** are stored in environment variables only
- **httpOnly cookies** prevent XSS cookie theft
- **Server-side ownership checks** on every task operation (read, update, delete)
- **Email enumeration prevention** — login returns the same error for wrong email or wrong password
- **Input validation** on both client and server
- **No secrets in source code** — all sensitive values in `.env`
- `.env` is in `.gitignore` and **never committed to GitHub**

---

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click **New Project** → Import your GitHub repository
3. Vercel will auto-detect Next.js — no changes to build settings needed

### Step 3: Configure Environment Variables

In Vercel's **Project Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your MongoDB Atlas connection string |
| `AUTH_SECRET` | A strong random secret (min 32 chars) |

### Step 4: MongoDB Atlas Network Access

In MongoDB Atlas → **Network Access**, ensure `0.0.0.0/0` is allowed (or add Vercel's IP ranges).

### Step 5: Deploy

Click **Deploy**. Vercel will:
1. Install dependencies (runs `prisma generate` via postinstall)
2. Build the Next.js app
3. Deploy to their edge network

---

## Database Schema Diagram

```mermaid
erDiagram
    USER {
        ObjectId id PK "_id"
        String name
        String email UK
        String password
        DateTime createdAt
    }

    TASK {
        ObjectId id PK "_id"
        String title
        String description
        TaskStatus status
        ObjectId userId FK
        DateTime createdAt
        DateTime updatedAt
    }

    USER ||--o{ TASK : "has many"
```

**TaskStatus enum:** `TODO` | `IN_PROGRESS` | `DONE`

---

## Postman Collection

Import the following as a Postman collection or create requests manually:

| # | Method | Endpoint | Auth Required | Description |
|---|---|---|---|---|
| 1 | POST | `/api/auth/register` | No | Register new user |
| 2 | POST | `/api/auth/login` | No | Login user |
| 3 | POST | `/api/auth/logout` | Yes | Logout user |
| 4 | GET | `/api/tasks` | Yes | Get all user tasks |
| 5 | POST | `/api/tasks` | Yes | Create a task |
| 6 | PUT | `/api/tasks/:id` | Yes | Update a task |
| 7 | DELETE | `/api/tasks/:id` | Yes | Delete a task |

**Postman setup tip:** After login, go to Cookies manager and copy the `taskmanager_token` cookie, then add it to your requests as a Cookie header.

---

## Screenshots

> 📸 Add screenshots here after deployment

- [ ] Login page
- [ ] Registration page
- [ ] Dashboard — empty state
- [ ] Dashboard — with tasks in all three columns
- [ ] Task creation modal
- [ ] Mobile responsive view

---

## Demo Video

> 🎥 [Add 3–5 minute demo video link here]

---

## License

MIT
