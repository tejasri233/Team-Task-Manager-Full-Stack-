# Team Task Manager Full Stack

A comprehensive full-stack application for managing team projects and tasks with role-based access control.

## Tech Stack
- **Frontend**: React, React Router, Axios, Context API, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt
- **Deployment**: Optimized for Railway

## Folder Structure
- `/backend`: Express API, Mongoose models, controllers, and middleware.
- `/frontend`: React application with Vite, organized into components and pages.

## Setup Instructions

### Backend
1. Navigate to `/backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Start the server: `npm run dev` (requires nodemon) or `npm start`

### Frontend
1. Navigate to `/frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## API Endpoints

### Auth
- `POST /api/users/signup`: User registration
- `POST /api/users/login`: User login

### Projects
- `GET /api/projects`: Get all user projects
- `POST /api/projects`: Create a new project (Admin)
- `POST /api/projects/:id/members`: Add member by email (Admin)

### Tasks
- `POST /api/tasks`: Create task (Admin)
- `PATCH /api/tasks/:id`: Update task status
- `GET /api/tasks/stats`: Get dashboard statistics

## Deployment
This project is Railway-ready. Ensure `NODE_ENV=production` and `MONGODB_URI` are set in your environment variables.
