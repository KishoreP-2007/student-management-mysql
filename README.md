# Student Management System (Node.js + Express + MySQL)

A simple CRUD application to add, view, edit, and delete student records.

## Requirements

- Node.js and npm
- MySQL Server (and optionally MySQL Workbench)

## 1. Create the database

Open MySQL Workbench and run the SQL in `database.sql`.

This creates the `student_management` database and `students` table, then inserts two sample records.

## 2. Configure database credentials

Copy `.env.example` to `.env` and update the values:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_management
```

Use your own MySQL username and password. Do not commit `.env` to Git.

## 3. Install dependencies

In this project directory, run:

```bash
npm install
```

## 4. Start the application

```bash
npm start
```

Open http://localhost:3000 in your browser.

For development with Node.js watch mode (supported in modern Node.js versions):

```bash
npm run dev
```

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/students` | List students |
| POST | `/api/students` | Add a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

## Notes

- Student data is stored in MySQL and persists across server restarts.
- Each email must be unique.
- This is a learning project. Before public deployment, add authentication and authorization, stricter validation, HTTPS, and production-grade error handling.
