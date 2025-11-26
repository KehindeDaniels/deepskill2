````markdown
# Task Management API (NestJS + TypeScript + Hexagonal Architecture)

> A clean, modular, **Hexagonal Architecture (Ports & Adapters)** implementation of a **Task Management API** powered by **NestJS**, **TypeScript**, and **SQLite (TypeORM)**.
>
> Supports full CRUD for tasks, people management, assignment of people to tasks, and a maintainable, testable architecture ideal for production-grade services and take-home assessments.

---

## Quick Start

### 1 Clone & Install

```bash
git clone https://github.com/yourusername/task-service.git
cd task-service
npm install
```
````

---

### 2 Run the API

Development:

```bash
npm run start:dev
```

Production:

```bash
npm run build && npm run start:prod
```

---

### 3 Database

SQLite is used for simplicity. The file is created automatically:

```
tasks.sqlite
```

No environment variables required.

---

## Hexagonal Architecture Overview

```
                 ┌──────────────── Presentation ────────────────┐
                 │  - Controllers (REST)                        │
                 │  - DTOs / Validation                         │
                 └─────────────────────────────▲─────────────────┘
                                               │
                                     inbound ports (HTTP)
                                               │
                            ┌──────────────────┴──────────────────┐
                            │              Core                    │
                            │  - Domain Models (Task, Person)      │
                            │  - Application Services              │
                            │  - Ports (Interfaces)                │
                            └──────────────────▲──────────────────┘
                                               │
                                      outbound ports (DB, HTTP)
                                               │
             ┌─────────────────────────────────┴─────────────────────────────────┐
             │                         Infrastructure                            │
             │  - SQLite (TypeORM Entities & Repositories)                       │
             │  - Notification HTTP client adapter                               │
             └────────────────────────────────────────────────────────────────────┘
```

### Why Hexagonal?

- Clear separation of concerns
- Framework-agnostic core
- Highly testable
- Infrastructure can be swapped without changing domain logic
- Ideal for long-term maintainability

---

## Project Structure

```
src/
├── app.module.ts
├── main.ts
│
├── core/
│   └── task/
│       ├── task.entity.ts
│       ├── person.entity.ts
│       ├── task-status.enum.ts
│       ├── task.repository.ts
│       ├── person.repository.ts
│       ├── task.service.ts
│       ├── person.service.ts
│       └── tokens.ts
│
├── infrastructure/
│   ├── db/
│   │   ├── task.orm-entity.ts
│   │   ├── person.orm-entity.ts
│   │   └── typeorm.config.ts
│   ├── repositories/
│   │   ├── task.repository.impl.ts
│   │   ├── person.repository.impl.ts
│   │   └── mappers.ts
│   └── http/
│       └── notification-http.service.ts
│
└── presentation/
    ├── presentation.module.ts
    ├── task/
    │   ├── task.controller.ts
    │   └── dto/
    │       ├── create-task.dto.ts
    │       ├── update-task.dto.ts
    │       ├── filter-task.dto.ts
    │       └── assign-person.dto.ts
    └── person/
        ├── person.controller.ts
        └── dto/
            └── create-person.dto.ts
```

---

# API Reference

---

# TASKS

---

## Create Task

`POST /tasks`

###equest:

```json
{
  "title": "Write documentation",
  "description": "Complete system design doc"
}
```

###esponse:

```json
{
  "id": 1,
  "title": "Write documentation",
  "description": "Complete system design doc",
  "status": "PENDING",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## List Tasks

`GET /tasks`

Optional filters:

- `GET /tasks?status=PENDING`
- `GET /tasks?assigneeId=3`

---

## Update Task

`PATCH /tasks/:id`

```json
{
  "title": "Write docs (updated)",
  "status": "IN_PROGRESS"
}
```

---

## Delete Task

`DELETE /tasks/:id`

Response:

```json
{ "success": true }
```

---

## Assign Person to Task

`POST /tasks/:taskId/assign`

```json
{
  "personId": 1
}
```

Response includes updated task with assignees.

---

# PEOPLE

---

## Create Person

`POST /people`

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

## List People

`GET /people`

---

## Get Single Person

`GET /people/:id`

---

# 🧪 Testing Strategy

The project includes:

### Unit Tests (Jest)

- Service tests
- Repository mocking
- Validation of use-case logic

### Command

```bash
npm test
```

### Test Coverage Note

> Full test coverage is **not included**, but the repository demonstrates:
>
> - Service-layer unit testing
> - Dependence inversion via ports
> - How to extend tests using mocks & in-memory DB

Recommended future additions:

- e2e tests (Supertest)
- In-memory SQLite integration tests

---

# Postman Collection

A full Postman collection is available that covers:

1. Create Person
2. Create Task
3. List Tasks
4. Filter Tasks
5. Update Task (valid)
6. Update Task (404)
7. Assign Person
8. Assign Person (invalid personId)
9. Delete Task

> The collection automatically stores `{{taskId}}` and `{{personId}}`.

---

# Design Decisions & Tradeoffs

## Hexagonal Architecture

**Benefits**

- Independent domain logic
- Easy testing
- Flexible infrastructure

**Tradeoff**

- More boilerplate (interfaces, tokens, adapters)

---

## SQLite + TypeORM

**Benefits**

- Zero config
- Lightweight and portable
- Great for demos & take-home tasks

**Tradeoff**

- Not ideal for high-concurrency production loads

---

## Ports & Adapters (DI Tokens)

**Benefits**

- Loose coupling between core and infra
- Easily mockable for tests

**Tradeoff**

- Requires explicit DI configuration

---

## Thin Controllers, Rich Services

**Benefits**

- Controllers remain clean
- Better SRP adherence
- Core logic concentrated in services

---

# Future Enhancements

| Enhancement             | Benefit                        |
| ----------------------- | ------------------------------ |
| Pagination              | Better task retrieval at scale |
| Swagger / OpenAPI       | Auto-generated API docs        |
| Unique email validation | More robust person management  |
| Domain events           | Advanced DDD patterns          |
| Docker support          | Easier deployment              |

---

# 📦 Installation Commands Summary

###un dev:

```bash
npm run start:dev
```

###un tests:

```bash
npm test
```

###uild:

```bash
npm run build
npm run start:prod
```

---

# © License

**MIT License © 2025 — Your Name**

```

---

```
