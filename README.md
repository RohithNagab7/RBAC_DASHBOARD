# EBANI TECH - Role-Based Dashboard System

A full-stack, enterprise-grade Role-Based Access Control (RBAC) dashboard built with **Next.js 15**, **MongoDB**, and **JWT-based authentication**.

## 🚀 Features

-   **Multi-Role Architecture**:
    -   **Super Admin**: Full system control. Can manage Administrators and all system Users.
    -   **Admin**: Team management. Can manage Users they have created.
    -   **User**: Personal Workspace. Access to a dedicated Tasks CRUD module.
-   **Security**:
    -   JWT-based authentication via `jose`.
    -   HttpOnly secure cookies for Server Component authentication.
    -   Bcrypt password hashing.
    -   Middleware-level route protection.
-   **Premium UI/UX**:
    -   Modern Dark Mode aesthetic using **Vanilla CSS**.
    -   Glassmorphism effects and smooth transitions.
    -   Debounced search and server-side pagination for all data tables.
    -   Role-aware navigation Sidebar.
-   **Performance**:
    -   Next.js Server Components for initial data fetching (SSG/SSR).
    -   Consolidated client-side state management for fluid CRUD operations.

## 🛠️ Technology Stack

-   **Framework**: Next.js 15 (App Router)
-   **Database**: MongoDB with Mongoose
-   **Auth**: JWT (jose), Bcrypt, Next.js Middleware
-   **UI**: Vanilla CSS, Google Fonts (Inter, Outfit)
-   **Validation**: Zod
-   **Utilities**: Axios for API calls, useDebounce hook for search

## 📂 Project Structure

-   `src/app/api`: Next.js Route Handlers (RESTful API).
-   `src/modules`: Domain-driven backend logic (Services, Controllers).
-   `src/repositories`: Data access layer (Mongoose models).
-   `src/components`: Reusable UI components (Modals, Cards, Sidebar).
-   `src/services`: Frontend API service layer.
-   `src/hooks`: Custom React hooks (`useAuth`, `useDebounce`).
-   `src/lib`: Shared utilities (validation, auth context, api helper).

## 👨‍💻 Developer Acknowledgement
**Developed by Rohith** - EBANI TECH Recruitment Assessment.

## 📥 Setup Instructions

### 1. Prerequisites
-   Node.js 18+ 
-   MongoDB instance (local or Atlas)

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Installation
```bash
npm install
```

### 4. Run the Application
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## 🧪 Credentials for Testing (Example)
*Note: You can create these roles via the Super Admin dashboard once the first Super Admin is registered.*

-   **Super Admin**: `superadmin@test.com` / `Password123`
-   **Admin**: `admin@test.com` / `Password123`
-   **User**: `user@test.com` / `Password123`

---

Built with ❤️ by **Rohith** for **EBANI TECH**
