# Team-Based-Task-Manager

This project is a team collaboration platform built with NestJS and NextJS that enables users to create teams, manage members, and organize tasks within team contexts. Features comprehensive role-based access control and secure API endpoints.

## 🚀 Features

### Core Functionality

- **User Authentication**: JWT-based authentication with registration and login
- **Team Management**: Create teams, invite members, manage roles
- **Task Management**: Full CRUD operations for tasks within team contexts
- **Role-Based Access Control**: Admin and Member roles with appropriate permissions
- **Multi-Team Support**: Users can be members of multiple teams

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd team-task-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Create PostgreSQL database**

   ```sql
   CREATE DATABASE team_task_manager;
   ```

5. **Start the application**

   ```bash
   npm run start:dev
   ```

6. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

## 🗄️ Database Setup

### Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=team_task_manager
JWT_SECRET=your-jwt-secret
```

### Automatic Schema Creation

The application uses TypeORM with `synchronize: true` in development, automatically creating tables based on entity definitions.

### Seed Data

Run `npm run seed` to populate the database with:

- 3 sample users (john_doe, jane_smith, bob_wilson)
- 2 teams (Frontend Development, Backend Development)
- 5 sample tasks with various statuses and assignments
