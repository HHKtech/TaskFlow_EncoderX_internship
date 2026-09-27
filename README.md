# TaskFlow — Task Management App

A full-stack task management application developed as part of the **EncoderX Remote Internship — Batch 02, Full Stack Development**.

TaskFlow allows users to securely register and log in, create and manage their own tasks, update task statuses, and delete completed or unnecessary tasks.

## 🚀 Live Demo

**Live Application:**
https://task-flow-3ck2x7she-scoa.vercel.app

**GitHub Repository:**
https://github.com/HHKtech/TaskFlow_EncoderX_internship

---

## ✨ Features

### Authentication

* User registration with name, email, password, and password confirmation
* Secure password hashing using bcrypt
* JWT-based authentication
* HTTP-only authentication cookies
* Protected dashboard and API routes
* Logout functionality

### Task Management

* Create tasks
* View user-specific tasks
* Edit existing tasks
* Delete tasks
* Update task status
* Tasks organized by:

  * Todo
  * In Progress
  * Done

### User Data Isolation

* Each user can access only their own tasks
* Task ownership is enforced through the authenticated user's ID
* Users cannot modify or delete another user's tasks

### UI & UX

* Responsive dashboard
* Login and registration pages
* Task creation/edit modal
* Loading states
* Success and error feedback
* Clean, modern TaskFlow interface

---

## 🛠️ Tech Stack

### Frontend

* Next.js
* TypeScript
* React
* Tailwind CSS

### Backend

* Next.js API Routes
* JWT Authentication
* bcryptjs

### Database

* MongoDB Atlas
* Prisma ORM

### Deployment

* Vercel

### API Testing

* Postman

---

## 📁 Project Structure

```text
TaskFlow_EncoderX_internship/
│
├── docs/
│   ├── database-schema.png
│   └── TaskFlow_EncoderX_Internship.postman_collection.json
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   └── logo.png
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── logout/
│   │   │   │   └── register/
│   │   │   └── tasks/
│   │   ├── dashboard/
│   │   ├── login/
│   │   └── register/
│   │
│   ├── components/
│   │   ├── LoadingSpinner.tsx
│   │   ├── TaskCard.tsx
│   │   └── TaskModal.tsx
│   │
│   ├── lib/
│   │   ├── auth.ts
│   │   └── prisma.ts
│   │
│   └── proxy.ts
│
├── .env.example
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## 🔐 Authentication

TaskFlow uses JWT-based authentication with HTTP-only cookies.

### Authentication Flow

1. User registers an account.
2. Password is securely hashed using bcrypt.
3. User logs in with their credentials.
4. A JWT session token is stored in an HTTP-only cookie.
5. Protected routes verify the authenticated session.
6. Users can access and manage only their own tasks.
7. Logout removes the authentication cookie.

---

## 📌 API Endpoints

### Authentication

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| POST   | `/api/auth/register` | Create a new account     |
| POST   | `/api/auth/login`    | Log in to an account     |
| POST   | `/api/auth/logout`   | Log out the current user |

### Tasks

| Method | Endpoint         | Description                        |
| ------ | ---------------- | ---------------------------------- |
| POST   | `/api/tasks`     | Create a new task                  |
| GET    | `/api/tasks`     | Get the authenticated user's tasks |
| PUT    | `/api/tasks/:id` | Update a task                      |
| DELETE | `/api/tasks/:id` | Delete a task                      |

---

## 🗄️ Database Schema

The application uses **MongoDB Atlas** with **Prisma ORM**.

The database contains two main models:

* **User**
* **Task**

Relationship:

```text
User (1) ──────────── (*) Task
```

Each task belongs to one user, while a user can have multiple tasks.

The complete database schema diagram is available here:

`docs/database-schema.png`

---

## 📮 Postman API Collection

A complete Postman collection is included in the repository for API testing and documentation.

It contains:

```text
Authentication
├── Register
├── Login
└── Logout

Tasks
├── Create Task
├── Get Tasks
├── Update Task
└── Delete Task
```

Collection file:

`docs/TaskFlow_EncoderX_Internship.postman_collection.json`

All listed endpoints were tested against the deployed application.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your_mongodb_connection_string"
AUTH_SECRET="your_auth_secret"
```

### Variables

| Variable       | Purpose                            |
| -------------- | ---------------------------------- |
| `DATABASE_URL` | MongoDB Atlas connection string    |
| `AUTH_SECRET`  | Secret used for JWT authentication |

> Never commit your actual `.env` file or expose database credentials and authentication secrets publicly.

---

## 💻 Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/HHKtech/TaskFlow_EncoderX_internship.git
```

### 2. Navigate into the project

```bash
cd TaskFlow_EncoderX_internship
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file and add:

```env
DATABASE_URL="your_mongodb_connection_string"
AUTH_SECRET="your_auth_secret"
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## 🧪 API Testing

The APIs were tested using **Postman** against the deployed application.

Tested operations include:

* User registration
* User login
* User logout
* Task creation
* Task retrieval
* Task updating
* Task deletion

The exported Postman collection is available in the `docs` directory.

---

## ☁️ Deployment

The application is deployed using **Vercel**.

**Production URL:**
https://task-flow-3ck2x7she-scoa.vercel.app

The application uses MongoDB Atlas as its production database.

---

## 🎓 Internship

This project was developed as part of:

**EncoderX Remote Internship — Batch 02**
**Track:** Full Stack Development
**Task:** Week 01 — Task 01: Task Management App

The project demonstrates full-stack development concepts including authentication, CRUD operations, database relationships, API development, frontend state management, and deployment.

---

## 👩‍💻 Author

**Hafsa Yousuf**

Software Engineering Undergraduate
Full Stack Developer

GitHub:
https://github.com/HHKtech

---

## 📄 License

This project was developed for educational and internship purposes.
