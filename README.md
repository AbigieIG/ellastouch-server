# Ellastouch Server

## Description

Ellastouch Server is a TypeScript-based Node.js application using Express and Sequelize to manage a service booking system. It provides functionality for managing categories and services within the booking system.

## Project Structure

| Path                        | Description                                   |
|-----------------------------|-----------------------------------------------|
| `/ellastouch-server`        | Root directory of the project                |
| ├── `/node_modules`         | Node.js modules                               |
| ├── `/src`                  | Source code                                  |
| │   ├── `/controllers`      | Controllers for business logic                |
| │   │   ├── `booking.ts`    | Booking-related logic                         |
| │   │   ├── `category.ts`   | Category-related logic                        |
| │   │   ├── `login.ts`      | User login logic                              |
| │   │   └── `user.ts`       | User management logic                         |
| │   ├── `/models`           | Sequelize models                             |
| │   │   ├── `booking.ts`    | Booking model                                |
| │   │   ├── `category.ts`   | Category model                               |
| │   │   └── `user.ts`       | User model                                   |
| │   ├── `/routes`           | API routes                                   |
| │   │   ├── `booking.ts`    | Routes for booking endpoints                 |
| │   │   ├── `categoryRoutes.ts` | Routes for category endpoints              |
| │   │   ├── `category.ts`   | Additional category routes                   |
| │   │   ├── `login.ts`      | Routes for user login                        |
| │   │   └── `user.ts`       | Routes for user management                   |
| │   ├── `/types`            | TypeScript types                             |
| │   │   ├── `end.d.ts`      | Endpoint-related types                       |
| │   │   ├── `global.d.ts`   | Global type definitions                      |
| │   │   └── `modal.ts`      | Model-related types                          |
| │   ├── `/dto`              | Data Transfer Objects (DTOs)                 |
| │   │   └── `index.dto.ts`  | DTO definitions                              |
| │   └── `index.ts`          | Entry point for your application             |
| ├── `/dist`                 | Compiled JavaScript files                    |
| ├── `package.json`          | Project metadata and dependencies            |
| ├── `tsconfig.json`         | TypeScript configuration                     |
| └── `.gitignore`            | Ignored files and directories for Git        |
