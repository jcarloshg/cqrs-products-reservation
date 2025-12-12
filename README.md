# CQRS Products Reservation System

A production-ready inventory management system implementing **CQRS (Command Query Responsibility Segregation)** pattern with **Clean Architecture** principles. This system handles stock reservations, inventory management, and provides real-time stock availability queries for e-commerce platforms.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Core Concepts](#core-concepts)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Use Cases](#use-cases)
- [Database Schema](#database-schema)
- [Development](#development)
- [Testing](#testing)

## 🎯 Overview

This system solves critical inventory management challenges in e-commerce platforms:

- **Prevents overselling** by implementing atomic stock reservations
- **Handles concurrent operations** using optimistic concurrency control
- **Separates read and write operations** for optimal performance
- **Implements domain events** for eventual consistency
- **Provides real-time inventory visibility** through optimized query models

### Business Value

- ✅ **UC-001 (Reserve Stock)**: Prevents overselling, improves customer experience
- ✅ **UC-002 (Confirm Reservation)**: Ensures accurate order fulfillment
- ✅ **UC-003 (Replenish Stock)**: Maintains inventory levels, prevents stockouts
- ✅ **UC-004 (Get Stock Availability)**: Enables real-time inventory visibility

## 🏗️ Architecture

### CQRS Pattern Implementation

The system implements CQRS by separating **Commands** (write operations) from **Queries** (read operations):

```
┌─────────────────────────────────────────────────────────────┐
│                     API Layer (Express)                      │
└─────────────────┬───────────────────────────┬───────────────┘
                  │                           │
        ┌─────────▼─────────┐       ┌────────▼────────┐
        │   COMMANDS        │       │    QUERIES      │
        │  (Write Model)    │       │  (Read Model)   │
        └─────────┬─────────┘       └────────┬────────┘
                  │                           │
        ┌─────────▼─────────┐       ┌────────▼────────┐
        │  Command Handlers │       │ Query Handlers  │
        └─────────┬─────────┘       └────────┬────────┘
                  │                           │
        ┌─────────▼─────────┐       ┌────────▼────────┐
        │  Domain Events    │       │  Direct Queries │
        └─────────┬─────────┘       └────────┬────────┘
                  │                           │
                  └───────────┬───────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   PostgreSQL DB   │
                    └───────────────────┘
```

### Clean Architecture Layers

```
presentation/          # Controllers, Routes, Middleware
    ├── controllers/   # HTTP request handlers
    ├── routes/        # API route definitions
    └── middleware/    # Request validation, error handling

app/
    ├── stock/                    # Command bounded contexts
    │   ├── create-reservation-stock/
    │   │   ├── application/      # Use cases orchestration
    │   │   ├── domain/           # Business logic & rules
    │   │   └── infra/            # External dependencies
    │   ├── confirm-reservation/
    │   └── replenish-stock/
    │
    ├── stock-for-query/          # Query bounded contexts
    │   └── get-stock-availability/
    │
    └── shared/
        ├── domain/               # Shared domain models
        │   ├── domain-events/    # Event infrastructure
        │   ├── model/            # Entities, Value Objects
        │   └── repository/       # Repository interfaces
        └── infrastructure/       # Concrete implementations
```

## 💡 Core Concepts

### 1. Command

Represents an intent to change system state (write operation).

**Examples**: `CreateReservationStockCommand`, `ConfirmReservationCommand`, `ReplenishStockCommand`

### 2. Command Handler

Processes commands and performs state changes while enforcing business rules.

### 3. Query

Represents a request to retrieve data (read operation).

**Examples**: `GetStockAvailabilityCommand`

### 4. Domain Events

Represents changes that occurred in the system, enabling loose coupling and eventual consistency.

**Examples**: 
- `StockReservationCreatedDomainEvent`
- `StockIncreaseReservationQuantityDomainEvent`
- `ReservationSetAsConfirmedDomainEvent`
- `StockQuantityUpdatedDomainEvent`

### 5. Aggregate Root

A cluster of domain objects treated as a single unit for data changes. Enforces consistency boundaries and business invariants.

**Key Features**:
- Consistency boundary for business rules
- Root entity is the only external entry point
- Generates domain events on state changes
- Maintains transaction scope

### 6. Event Bus & Event Publisher

Infrastructure for publishing and handling domain events asynchronously.

## ✨ Features

### Command Operations (Write Model)

#### 1. **Create Stock Reservation**
- Atomically reserve stock for orders
- Implements optimistic concurrency control
- Auto-expiration after 30 minutes (configurable)
- Publishes domain events for notifications

#### 2. **Confirm Reservation**
- Convert temporary reservation to permanent allocation
- Associates reservation with order ID
- Triggers fulfillment notifications

#### 3. **Replenish Stock**
- Add new inventory to existing stock
- Updates both available and total quantities
- Publishes stock update events

### Query Operations (Read Model)

#### 4. **Get Stock Availability**
- Real-time stock availability checks
- Returns available, reserved, and total quantities
- Optimized for high-throughput reads

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js (TypeScript)
- **Framework**: Express.js 5.1.0
- **Database**: PostgreSQL 16+
- **ORM**: Sequelize 6.37.7
- **Validation**: Zod 4.1.11

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Testing**: Jest 30.2.0
- **Development**: Nodemon, ts-node

### Architecture Patterns
- **CQRS** (Command Query Responsibility Segregation)
- **Clean Architecture** (Hexagonal Architecture)
- **Domain-Driven Design** (DDD)
- **Event-Driven Architecture**

## 📂 Project Structure

```
cqrs-products-reservation/
├── back-for-commands/           # Command service
│   ├── src/
│   │   ├── app/
│   │   │   ├── shared/          # Shared domain & infrastructure
│   │   │   │   ├── domain/
│   │   │   │   │   ├── domain-events/    # Event system
│   │   │   │   │   ├── errors/           # Custom errors
│   │   │   │   │   ├── model/            # Shared entities
│   │   │   │   │   └── repository/       # Repository interfaces
│   │   │   │   └── infrastructure/
│   │   │   │       ├── domain-events/    # Event implementations
│   │   │   │       └── repository/       # Repository implementations
│   │   │   │
│   │   │   ├── stock/                    # Stock commands
│   │   │   │   ├── create-reservation-stock/
│   │   │   │   ├── confirm-reservation/
│   │   │   │   └── replenish-stock/
│   │   │   │
│   │   │   └── stock-for-query/          # Stock queries
│   │   │       └── get-stock-availability/
│   │   │
│   │   ├── presentation/        # API layer
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── middleware/
│   │   │
│   │   └── index.ts             # Application entry point
│   │
│   ├── test/                    # Test suites
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   └── tsconfig.json
│
├── db-for-commands/             # Database service
│   ├── migrations/              # SQL migrations
│   │   └── 2025-10-11/
│   │       ├── 01.create_database_and_tables.sql
│   │       └── 02.insert-data.sql
│   ├── scripts/                 # Data generation scripts
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── documentation/               # Project documentation
│   ├── 01.core-items.md        # CQRS concepts
│   └── 01.use-cases.md         # Business use cases
│
├── docker-compose.yml           # Main compose file
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- Docker Desktop 4.0+
- Docker Compose 2.0+
- Node.js 18+ (for local development)

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cqrs-products-reservation
   ```

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

   This will start:
   - **back-commands**: Backend API on `http://localhost:3000`
   - **db-commands**: PostgreSQL database on `localhost:5432`

3. **Verify services are running**
   ```bash
   curl http://localhost:3000/api/reservationsStock/v1/health
   ```

   Expected response:
   ```
   Reservations Stock Service is up and running!
   ```

### Environment Variables

The system uses the following environment variables (configured in `docker-compose.yml`):

```env
# Database Configuration
POSTGRES_URL=postgresql://admin:123456@db-commands:5432/db_for_commands
POSTGRES_USER=admin
POSTGRES_PASSWORD=123456
POSTGRES_DB=db_for_commands
POSTGRES_PORT=5432
POSTGRES_HOST=db-commands

# Application Configuration
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*
CORS_CREDENTIALS=true
```

## 📡 API Reference

### Base URL
```
http://localhost:3000/api/reservationsStock/v1
```

### Endpoints

#### 1. Create Stock Reservation (Command)

**POST** `/`

Creates a new stock reservation for a customer.

**Request Body:**
```json
{
  "productId": "uuid",
  "userId": "uuid",
  "quantity": 5,
  "expirationMinutes": 30
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Stock reserved successfully",
  "code": 200
}
```

**Error Responses:**
- `400 Bad Request`: Insufficient stock or invalid request
- `404 Not Found`: Product or stock not found
- `409 Conflict`: Concurrent modification detected

---

#### 2. Confirm Reservation (Command)

**PUT** `/`

Confirms a pending reservation, converting it to a permanent allocation.

**Request Body:**
```json
{
  "reservationId": "uuid",
  "orderId": "uuid"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Reservation confirmed successfully",
  "code": 200
}
```

---

#### 3. Replenish Stock (Command)

**PUT** `/replenish`

Adds new inventory to existing stock.

**Request Body:**
```json
{
  "productId": "uuid",
  "quantity": 100
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Stock replenished successfully",
  "code": 200
}
```

---

#### 4. Get Stock Availability (Query)

**GET** `/:product_uuid/availability`

Retrieves real-time stock availability for a product.

**Path Parameters:**
- `product_uuid`: UUID of the product

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "productId": "uuid",
    "availableQuantity": 150,
    "reservedQuantity": 25,
    "totalQuantity": 175
  },
  "code": 200
}
```

---

#### 5. Health Check

**GET** `/health`

Checks service health status.

**Response (200 OK):**
```
Reservations Stock Service is up and running!
```

## 📖 Use Cases

### UC-001: Reserve Stock

**Actor**: Customer, Order Management System

**Preconditions**:
- Product exists in system
- Sufficient stock available

**Business Rules**:
- Reserved stock is temporarily allocated
- Reservations expire after 30 minutes (default)
- Cannot reserve more than available
- Uses optimistic concurrency control

**Flow**:
1. Validate product exists
2. Check available stock
3. Create reservation with expiration
4. Update stock to increase reserved quantity
5. Publish `StockAllocatedEvent`
6. Return success confirmation

---

### UC-002: Confirm Reservation

**Actor**: Order Management System, Payment System

**Preconditions**:
- Valid reservation exists
- Reservation is not expired

**Business Rules**:
- Confirmed reservations are permanent
- Associates with order ID
- Triggers fulfillment process

**Flow**:
1. Validate reservation exists
2. Mark reservation as confirmed
3. Associate with order ID
4. Publish domain events

---

### UC-003: Replenish Stock

**Actor**: Inventory Manager, Warehouse System

**Business Rules**:
- Only increases available quantity
- Does not affect existing reservations
- Updates read model asynchronously

**Flow**:
1. Validate product exists
2. Add quantity to available stock
3. Publish `StockQuantityUpdatedEvent`
4. Update query models

---

### UC-004: Get Stock Availability

**Actor**: Customer, E-commerce Frontend

**Business Rules**:
- Read-only operation
- Returns real-time availability
- Considers reserved stock

**Flow**:
1. Query stock by product ID
2. Calculate available (total - reserved)
3. Return availability data

## 🗄️ Database Schema

### Tables

#### `users`
```sql
uuid          UUID PRIMARY KEY
username      VARCHAR(255) NOT NULL
password      VARCHAR(255) NOT NULL
```

#### `products`
```sql
uuid          UUID PRIMARY KEY
name          VARCHAR(255) NOT NULL
description   TEXT
price         DECIMAL(10, 2) NOT NULL
```

#### `stock`
```sql
uuid                  UUID PRIMARY KEY
product_uuid          UUID NOT NULL (FK → products)
available_quantity    INTEGER NOT NULL DEFAULT 0
reserved_quantity     INTEGER NOT NULL DEFAULT 0
```

#### `reservations`
```sql
uuid          UUID PRIMARY KEY
user_uuid     UUID NOT NULL (FK → users)
product_id    UUID NOT NULL (FK → products)
quantity      INTEGER NOT NULL
status        VARCHAR(20) CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED'))
expires_at    TIMESTAMP WITH TIME ZONE NOT NULL
```

### Reservation Status Flow

```
PENDING → CONFIRMED (on successful payment)
PENDING → EXPIRED (after expiration time)
PENDING → CANCELLED (on user cancellation)
```

## 💻 Development

### Local Development Setup

1. **Install dependencies**
   ```bash
   cd back-for-commands
   npm install
   ```

2. **Run in development mode**
   ```bash
   npm run dev
   ```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start` | Run compiled application |
| `npm run dev` | Development mode with hot reload |
| `npm run dev:docker` | Development mode for Docker |
| `npm run clean` | Remove build artifacts |
| `npm run test-unit` | Run unit tests in watch mode |
| `npm run test-integration` | Run integration tests in watch mode |
| `npm run test-acceptance` | Run acceptance tests in watch mode |

### Code Organization

Each use case follows this structure:

```
feature-name/
├── application/              # Use case orchestration
│   └── feature.application.ts
├── domain/                   # Business logic
│   ├── commands/            # Command definitions
│   ├── domain-events/       # Domain events
│   └── feature.use-case.ts
└── infra/                   # Infrastructure implementations
    ├── postgres/            # PostgreSQL implementations
    └── in-memory/           # In-memory implementations
```

## 🧪 Testing

### Test Structure

```
test/
└── src/
    └── app/
        ├── shared/
        │   └── infrastructure/
        └── stock/
            ├── create-reservation-stock/
            └── replenish-stock/
```

### Running Tests

```bash
# Run all unit tests
npm run test-unit

# Run integration tests
npm run test-integration

# Run acceptance tests
npm run test-acceptance
```

### Test Types

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **Acceptance Tests**: Test complete use case flows

## 🔧 Configuration

### Database Configuration

Modify `docker-compose.yml` to change database settings:

```yaml
environment:
  - POSTGRES_USER=your_user
  - POSTGRES_PASSWORD=your_password
  - POSTGRES_DB=your_database
  - POSTGRES_PORT=5432
```

### Application Configuration

Configure the backend in `back-for-commands/src/app/shared/infrastructure/utils/enviroment-variables.ts`

## 📚 Additional Documentation

- [Core CQRS Concepts](./documentation/01.core-items.md)
- [Detailed Use Cases](./documentation/01.use-cases.md)
- [Database Structure](./db-for-commands/documentation/strcuture-db.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

ISC License

## 👥 Authors

- **Project Owner**: jcarloshg

---

**Built with ❤️ using CQRS, Clean Architecture, and Domain-Driven Design principles**
