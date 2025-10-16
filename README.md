# Use Cases - CQRS Inventory Management System

This document describes the business use cases for the CQRS-based inventory management system. The system implements Command Query Responsibility Segregation (CQRS) with Clean Architecture to manage stock, reservations, and inventory operations.

## Business Value

Each use case provides specific business value:

- **UC-001 (Reserve Stock)**: Prevents overselling, improves customer experience
- **UC-002 (Confirm Reservation)**: Ensures accurate order fulfillment
- **UC-003 (Replenish Stock)**: Maintains inventory levels, prevents stockouts
- **UC-004 (Get Stock Availability)**: Enables real-time inventory visibility
- **UC-005 (Get Inventory Summary)**: Supports business decision making and analytics

The CQRS architecture enables these use cases to scale independently and maintain high performance under load.

## Command Use Cases (Write Operations)

### UC-001: Reserve Stock

**Description**: Reserve a specific quantity of stock for a customer or order, preventing other operations from accessing the reserved stock.

**Actor**: Customer, Order Management System, E-commerce Platform

**Preconditions**:

- Product exists in the system
- Sufficient stock is available (available quantity >= requested quantity)
- Stock record exists for the product

**Business Rules**:

- Reserved stock is temporarily allocated and unavailable for other reservations
- Reservations have an expiration time (default: 30 minutes)
- Cannot reserve more stock than is available
- Uses optimistic concurrency control to handle concurrent reservations

**Flow**:

1. System validates product exists
2. System checks available stock (total - reserved)
3. System creates a new reservation with expiration time
4. System updates stock to increase reserved quantity
5. System publishes `StockAllocatedEvent`
6. System returns success confirmation

**Example Request**:

```bash
POST /api/stock/reserve
Content-Type: application/json

{
  "productId": "prod-123",
  "quantity": 5,
  "customerId": "customer-456",
  "expirationMinutes": 30
}
```

**Example Response**:

```json
{
  "success": true,
  "message": "Stock reserved successfully"
}
```

**Error Scenarios**:

- `400 Bad Request`: Insufficient stock available
- `404 Not Found`: Product or stock not found
- `409 Conflict`: Concurrent modification detected

---

### UC-002: Confirm Reservation

**Description**: Convert a temporary stock reservation into a permanent allocation, typically when an order is confirmed or payment is processed.

**Actor**: Order Management System, Payment System

**Preconditions**:

- Valid reservation exists and is not expired
- Reservation is in "pending" status

**Business Rules**:

- Confirmed reservations cannot be automatically released
- Confirmation reduces available stock permanently
- Associates reservation with an order ID

**Flow**:

1. System validates reservation exists and is not expired
2. System marks reservation as confirmed
3. System associates reservation with order ID
4. System publishes domain events for read model updates
5. System returns success confirmation

**Example Request**:

```bash
POST /api/reservations/confirm
Content-Type: application/json

{
  "reservationId": "res-789",
  "orderId": "order-456"
}
```

**Example Response**:

```json
{
  "success": true,
  "message": "Reservation confirmed successfully"
}
```

**Error Scenarios**:

- `404 Not Found`: Reservation not found
- `400 Bad Request`: Reservation already expired or confirmed
- `409 Conflict`: Reservation in invalid state

---

### UC-003: Replenish Stock

**Description**: Add new stock quantities to existing products, typically when inventory is restocked from suppliers.

**Actor**: Inventory Manager, Warehouse System, Supplier Integration

**Preconditions**:

- Product exists in the system
- Stock record exists for the product

**Business Rules**:

- Only positive quantities can be added
- Stock replenishment increases total and available quantities
- System tracks stock movements for audit purposes

**Flow**:

1. System validates product exists
2. System validates quantity is positive
3. System updates stock quantities (total and available)
4. System publishes `StockReplenishedEvent`
5. System updates read models
6. System returns success confirmation

**Example Request**:

```bash
POST /api/stock/replenish
Content-Type: application/json

{
  "productId": "prod-123",
  "quantity": 100
}
```

**Example Response**:

```json
{
  "success": true,
  "message": "Stock replenished successfully"
}
```

**Error Scenarios**:

- `404 Not Found`: Product not found
- `400 Bad Request`: Invalid quantity (zero or negative)

---

## Query Use Cases (Read Operations)

### UC-004: Get Stock Availability

**Description**: Retrieve current stock availability information for a specific product, including total, reserved, and available quantities.

**Actor**: Customer, Sales Rep, E-commerce Platform, Mobile App

**Preconditions**:

- Product exists in the system

**Business Rules**:

- Returns real-time stock information from optimized read models
- Available quantity = Total quantity - Reserved quantity
- Data is eventually consistent with write operations

**Flow**:

1. System queries stock read model by product ID
2. System returns stock availability information
3. No side effects or state changes

**Example Request**:

```bash
GET /api/stock/prod-123/availability
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "productId": "prod-123",
    "productName": "Wireless Headphones",
    "sku": "WH-001",
    "totalQuantity": 150,
    "reservedQuantity": 25,
    "availableQuantity": 125,
    "lastUpdated": "2025-10-10T14:30:00Z"
  }
}
```

**Error Scenarios**:

- `404 Not Found`: Product stock information not found

---

### UC-005: Get Inventory Summary

**Description**: Retrieve a comprehensive overview of all inventory items, including summary statistics and low stock alerts.

**Actor**: Inventory Manager, Business Analyst, Dashboard System

**Preconditions**:

- System has inventory data

**Business Rules**:

- Returns aggregated view of all products and stock levels
- Includes summary statistics (total products, total stock value, etc.)
- Highlights products with low stock levels
- Data is optimized for reporting and analytics

**Flow**:

1. System queries inventory summary read model
2. System aggregates data across all products
3. System calculates summary statistics
4. System returns comprehensive inventory overview

**Example Request**:

```bash
GET /api/inventory/summary
```

**Example Response**:

```json
{
  "success": true,
  "data": {
    "totalProducts": 45,
    "totalStockItems": 2340,
    "totalReservedItems": 156,
    "totalAvailableItems": 2184,
    "lowStockProducts": 3,
    "outOfStockProducts": 0,
    "lastUpdated": "2025-10-10T14:30:00Z",
    "products": [
      {
        "productId": "prod-123",
        "productName": "Wireless Headphones",
        "totalQuantity": 150,
        "availableQuantity": 125,
        "status": "in-stock"
      }
    ]
  }
}
```

---

## System Use Cases

### UC-006: Health Check

**Description**: Verify system health and operational status.

**Actor**: Monitoring System, DevOps, Load Balancer

**Example Request**:

```bash
GET /health
```

**Example Response**:

```json
{
  "status": "healthy",
  "timestamp": "2025-10-10T14:30:00Z",
  "services": {
    "database": "connected",
    "eventBus": "operational"
  }
}
```

---

## Integration Scenarios

### Scenario 1: E-commerce Purchase Flow

1. **Customer browses products** → UC-004: Get Stock Availability
2. **Customer adds to cart** → UC-001: Reserve Stock
3. **Customer proceeds to checkout** → UC-004: Get Stock Availability (verify)
4. **Payment processed** → UC-002: Confirm Reservation
5. **Order fulfilled** → Stock permanently allocated

### Scenario 2: Inventory Management Flow

1. **Manager reviews inventory** → UC-005: Get Inventory Summary
2. **Manager identifies low stock** → UC-004: Get Stock Availability (specific products)
3. **Manager orders from supplier** → External system
4. **Stock arrives** → UC-003: Replenish Stock
5. **Updated inventory visible** → UC-005: Get Inventory Summary

### Scenario 3: Concurrent Stock Reservation

1. **Multiple customers attempt reservation** → UC-001: Reserve Stock (concurrent)
2. **System uses optimistic locking** → First successful, others retry
3. **Failed reservations get updated availability** → UC-004: Get Stock Availability
4. **Customers see current availability** → Retry with available quantity

---

## Error Handling and Edge Cases

### Reservation Expiration

- System automatically releases expired reservations
- Background process monitors and cleans up expired reservations
- Available stock increases when reservations expire

### Concurrency Control

- Optimistic locking prevents overselling
- Concurrent modifications detected and handled gracefully
- Retry mechanisms for transient failures

### Data Consistency

- Eventually consistent read models
- Event sourcing ensures audit trail
- CQRS pattern enables independent scaling of reads and writes

---

## Technical Integration Examples

### Using cURL

**Reserve Stock:**

```bash
curl -X POST http://localhost:3000/api/stock/reserve \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod-123",
    "quantity": 5,
    "customerId": "customer-456",
    "expirationMinutes": 30
  }'
```

**Check Availability:**

```bash
curl http://localhost:3000/api/stock/prod-123/availability
```

**Confirm Reservation:**

```bash
curl -X POST http://localhost:3000/api/reservations/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "reservationId": "res-789",
    "orderId": "order-456"
  }'
```

### Using JavaScript/Node.js

```javascript
// Reserve stock
const reserveResponse = await fetch("/api/stock/reserve", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    productId: "prod-123",
    quantity: 5,
    customerId: "customer-456",
    expirationMinutes: 30,
  }),
});

// Check availability
const availabilityResponse = await fetch("/api/stock/prod-123/availability");
const availability = await availabilityResponse.json();

// Confirm reservation
const confirmResponse = await fetch("/api/reservations/confirm", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    reservationId: "res-789",
    orderId: "order-456",
  }),
});
```
