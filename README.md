# TeamTasks API

REST API for team task management: teams, members with roles, projects, and tasks with status and comments. Built with Node.js, TypeScript, and Express, with a focus on clean architecture, validation, testing, and production-ready practices.

> 🚧 **Work in progress.** This project is being built step by step. See the [Roadmap](#roadmap) for what's done and what's next.

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)

## Features

**Available now**

- Health check endpoint
- Environment variables validated at startup with Zod (the app fails fast with a clear message if config is invalid)
- Centralized error handling with a custom `AppError` class
- Code quality tooling: ESLint (flat config) + Prettier

**Planned**

- JWT authentication (register / login)
- Teams with member roles (owner, admin, member)
- Projects inside teams
- Tasks with status (`todo`, `in_progress`, `done`), assignee, and comments

## Tech stack

| Layer          | Technology                            |
| -------------- | ------------------------------------- |
| Runtime        | Node.js                               |
| Language       | TypeScript (strict mode)              |
| Framework      | Express 5                             |
| Validation     | Zod                                   |
| Database / ORM | PostgreSQL + Prisma                   |
| Code quality   | ESLint, Prettier                      |

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/hugodev30/teamtasks-api.git
cd teamtasks-api
npm install
cp .env.example .env
npm run dev
```

The API will be available at `http://localhost:3333`.

### Environment variables

| Variable       | Description                                   | Default       |
| -------------- | --------------------------------------------- | ------------- |
| `NODE_ENV`     | `development`, `test` or `production`         | `development` |
| `PORT`         | Port the server listens on                    | `3333`        |
| `DATABASE_URL` | PostgreSQL connection string                  | none          |

## Database

The API uses PostgreSQL with Prisma ORM.

### 1. Start PostgreSQL with Docker

```bash
docker run --name teamtasks-db -e POSTGRES_USER=teamtasks -e POSTGRES_PASSWORD=teamtasks -e POSTGRES_DB=teamtasks -p 5433:5432 -d postgres:16
```

Then set `DATABASE_URL` in your `.env`:

```
DATABASE_URL="postgresql://teamtasks:teamtasks@localhost:5433/teamtasks?schema=public"
```

### 2. Run migrations and generate the client

```bash
npm run db:migrate
npm run db:generate
```

### 3. (Optional) Open Prisma Studio

```bash
npm run db:studio
```

### Data model

- **User**: belongs to teams through memberships, creates and is assigned tasks
- **Team**: has members (with roles `OWNER`, `ADMIN`, `MEMBER`) and projects
- **Project**: belongs to a team and has tasks
- **Task**: has a status (`TODO`, `IN_PROGRESS`, `DONE`), an optional assignee and comments
- **Comment**: written by a user on a task

## Scripts

| Command               | Description                                  |
| --------------------- | -------------------------------------------- |
| `npm run dev`         | Start the dev server with hot reload (tsx)   |
| `npm run build`       | Compile TypeScript to `dist/`                |
| `npm start`           | Run the compiled build                       |
| `npm run lint`        | Run ESLint                                   |
| `npm run format`      | Format the code with Prettier                |
| `npm run db:migrate`  | Create and apply database migrations         |
| `npm run db:generate` | Generate the Prisma Client                   |
| `npm run db:studio`   | Open Prisma Studio to browse the database    |

## API endpoints

| Method | Route     | Description  | Response             |
| ------ | --------- | ------------ | -------------------- |
| GET    | `/health` | Health check | `{ "status": "ok" }` |

### Error format

All errors follow the same shape:

```json
{ "message": "Description of the error" }
```

Known errors (`AppError`) return their own status code. Unexpected errors return `500` with `"Internal server error"`.

## Project structure

```
src/
├── config/          # Environment config validated with Zod
├── middlewares/     # Express middlewares (error handler)
├── modules/         # Feature modules (users, teams, projects, tasks)
├── shared/
│   └── errors/      # Custom error classes
├── app.ts           # Express app setup (routes, middlewares)
└── server.ts        # Starts the HTTP server
```

`app.ts` and `server.ts` are separated so the app can be tested with Supertest without opening a real port.

## Roadmap

- [x] Project setup (TypeScript, ESLint, Prettier)
- [x] Folder architecture, env validation and error handling
- [x] Database with PostgreSQL + Prisma
- [ ] Authentication (JWT)
- [ ] Teams, members and roles
- [ ] Projects and tasks
- [ ] Comments
- [ ] Automated tests (Vitest + Supertest)
- [ ] API docs with Swagger
- [ ] Docker and docker-compose
- [ ] CI with GitHub Actions
- [ ] Deploy

## Author

**Hugo Almeida**

- GitHub: [@hugodev30](https://github.com/hugodev30)
- LinkedIn: [Hugo Almeida](https://www.linkedin.com/in/hugo-almeida-861777218/)
