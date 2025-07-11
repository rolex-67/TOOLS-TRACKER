# 🛠️ Tools Tracker

A **full-stack MERN application** to track tools inventory, requests, appointments, and returns, with **role-based authentication** for Admin, Toolskeeper, and Users.

---

## 🚀 **Features**

- **User authentication & authorization**
  - Signup & login with role selection (Admin, Toolskeeper, User)
  - Secure password hashing with bcrypt

- **Role-based access**
  - **Users:** View tools in Stores & Available Items, request tools, return tools
  - **Toolskeeper:** Appoint tools to users
  - **Admin:** Approve tool requests, manage tools master, manage users

- **Tools inventory management**
  - View all tools fetched from [dummyjson](https://dummyjson.com/products)
  - Request and appoint tools with quantity update logic
  - Return tools with condition and date tracking

- **Backend APIs (Express + MongoDB)**
  - Auth routes (`/auth/signup`, `/auth/login`)
  - Tool appointment, request, approval, and return routes (`/api`)

- **Frontend (React + Tailwind CSS)**
  - Responsive and clean UI
  - Role-based routing with react-router-dom
  - Axios integration for API calls

---

## 🛠️ **Tech Stack**

- **Frontend:** React, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB (local or Atlas)

---

## 💻 **Local Setup**

1. **Clone the repo**

```bash
git clone https://github.com/yourusername/tools-tracker.git
cd tools-tracker
