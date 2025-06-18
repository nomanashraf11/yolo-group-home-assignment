# Backend API

This is the backend API for the YOLO Task Manager - a full stack application built for the Frontend Developer position assignment at YOLO Group.

## Tech Stack

- NestJS
- TypeORM
- PostgreSQL
- TypeScript

## Setup

1. **Create environment file:**

```bash
# Create .env file in the backend directory
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=yolo_db
DB_USERNAME=yolo_user
DB_PASSWORD=yolo_password
PORT=3000
```

2. **Install dependencies:**

```bash
npm install
```

3. **Run in development mode:**

```bash
npm run start:dev
```

## API Endpoints

- `GET /categories` - Get all categories
- `POST /categories` - Create category
- `GET /categories/:id` - Get category by ID
- `PATCH /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create task
- `GET /tasks/:id` - Get task by ID
- `PATCH /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `PUT /tasks/:id/category/:categoryId` - Move task to category

## Database

- Uses PostgreSQL with TypeORM
- Auto-synchronization enabled for development
- Sample data can be seeded using the root setup script

## Frontend Integration

This backend serves the Angular frontend application. For the complete setup, see the root README.md file.
