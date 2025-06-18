# YOLO Task Manager

A task management application built with Angular frontend and NestJS backend. This is a test assignment for the Frontend position at YOLO Group.

## Demo Video

[\[Video Link for demo\]](https://www.loom.com/share/78771bfb28124783b903678b3964d2f4?sid=f73109ba-ce5f-4009-9ed2-1682177b6dd4)

## Features

- Create, edit, and delete tasks and categories
- Drag and drop tasks between categories
- Filter and sort tasks
- Responsive design with Material UI

## Quick Start

### Option 1: Using Docker (Recommended)

**Prerequisites:**

- Docker and Docker Compose installed

**Setup:**

```bash
# Clone the repo
git clone https://github.com/nomanashraf11/yolo-group-home-assignment.git
cd yolo-group-home-assignment

# Run the script that will run Docker commands and seed data
./setup-database.sh
```

**Access:**

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api

### Option 2: Manual Setup

**Prerequisites:**

- Node.js (v18+)
- PostgreSQL is running locally

**Backend Setup:**

```bash
cd backend
npm install
npm run start:dev
```

**Frontend Setup:**

```bash
cd frontend
npm install
npm start
```

**Database Setup:**

- Create a PostgreSQL database named `yolo_db`
- Update environment variables in `backend/src/app.module.ts` if needed
- Run the seed script: `./seed-data.sh`

## Environment Variables

**Backend (.env):**

```
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=yolo_db
DB_USERNAME=yolo_user
DB_PASSWORD=yolo_password
```

## API Endpoints

- `GET /categories` - Get all categories
- `POST /categories` - Create category
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create task
- `PUT /tasks/:id/category/:categoryId` - Move task to category

## Tech Stack

**Frontend:**

- Angular 20
- Angular Material
- TypeScript

**Backend:**

- NestJS
- TypeORM
- PostgreSQL


## Development

**Stop all services:**

```bash
docker-compose down
```

**View logs:**

```bash
docker-compose logs -f [service-name]
```

**Reset database:**

```bash
docker-compose down -v
./setup-database.sh
```
