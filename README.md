# 🚀 Team Task Manager Full Stack

A full-stack web application for managing team projects and tasks with role-based access control.

---

## 📌 Features

* 🔐 User Authentication (Signup/Login with JWT)
* 👥 Role-Based Access Control (Admin / Member)
* 📁 Project Management
* 📋 Task Assignment & Tracking
* 📊 Dashboard with Task Statistics

---

## 🛠 Tech Stack

### Frontend

* React
* React Router
* Axios
* Context API

### Backend

* Node.js
* Express.js
* JWT Authentication
* Bcrypt (Password Hashing)

### Database

* SQL (MySQL / PostgreSQL)
* Sequelize ORM

### Deployment

* Railway

---

## 📂 Folder Structure

```
/backend      → Express API, Sequelize models, controllers, middleware
/frontend     → React application (components, pages, services)
```

---

## ⚙️ Setup Instructions

### 🔧 Backend Setup

1. Navigate to backend:

```
cd backend
```

2. Install dependencies:

```
npm install
```

3. Create `.env` file:

```
PORT=5000
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
JWT_SECRET=your_secret_key
```

4. Run server:

```
npm run dev
```

or

```
npm start
```

---

### 🎨 Frontend Setup

1. Navigate to frontend:

```
cd frontend
```

2. Install dependencies:

```
npm install
```

3. Start frontend:

```
npm run dev
```

---

## 🔗 API Endpoints

### 🔐 Auth

* `POST /api/users/signup` → Register user
* `POST /api/users/login` → Login user

---

### 📁 Projects

* `GET /api/projects` → Get all user projects
* `POST /api/projects` → Create new project (Admin)
* `POST /api/projects/:id/members` → Add member (Admin)

---

### 📋 Tasks

* `POST /api/tasks` → Create task (Admin)
* `PATCH /api/tasks/:id` → Update task status
* `GET /api/tasks/stats` → Get dashboard statistics

---


## 🚀 Deployment (Railway)

* Set environment variables in Railway:

  * `PORT`
  * `DB_HOST`
  * `DB_USER`
  * `DB_PASSWORD`
  * `DB_NAME`
  * `JWT_SECRET`

* Ensure backend runs on:

```
process.env.PORT
```

* Connect frontend to deployed backend URL

---


## 👨‍💻 Author

Teja Sri Gorle

