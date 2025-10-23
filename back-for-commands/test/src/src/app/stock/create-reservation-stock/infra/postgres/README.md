# UpdateReservedStockPostgres Test Suite

This directory contains comprehensive tests for the `UpdateReservedStockPostgres` class.

## Test Files

### 1. `update-reserved-stock.postgres.test.ts`
**Unit Tests with Mocks**
- Tests all method functionality with mocked dependencies
- Covers success scenarios, error handling, and edge cases
- Fast execution, no database required
- Ideal for TDD and CI/CD pipelines

**Test Coverage:**
- ✅ Successful stock updates
- ✅ Error handling (database errors, not found scenarios)
- ✅ Edge cases (empty IDs, negative quantities, large values)
- ✅ Data integrity validation
- ✅ Constructor and inheritance testing

### 2. `update-reserved-stock.postgres.integration.test.ts`
**Integration Tests with Real Database**
- Tests actual database interactions
- Requires test database setup
- Verifies end-to-end functionality
- Tests database constraints and transactions

**Test Coverage:**
- ✅ Real database operations
- ✅ Data persistence verification
- ✅ Concurrent update handling
- ✅ Database constraint validation
- ✅ Data consistency checks

### 3. `update-reserved-stock.postgres.performance.test.ts`
**Performance and Stress Tests**
- Benchmarks execution time
- Tests memory usage and resource consumption
- Validates performance under load
- Stress testing with rapid operations

**Test Coverage:**
- ✅ Single operation performance (< 100ms)
- ✅ Sequential operations efficiency
- ✅ Concurrent operations performance
- ✅ Memory leak detection
- ✅ Stress testing with rapid updates

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Files
```bash
# Unit tests only
npm test update-reserved-stock.postgres.test.ts

# Integration tests only
npm test update-reserved-stock.postgres.integration.test.ts

# Performance tests only
npm test update-reserved-stock.postgres.performance.test.ts
```

### Watch Mode
```bash
npm run jest
```

## Test Environment Setup

### Unit Tests
No special setup required. Uses Jest mocks to simulate database interactions.

### Integration Tests
Requires:
1. Test database connection
2. Proper environment variables set
3. Database tables created
4. Test data cleanup between tests

### Performance Tests
Requires:
1. Stable database connection
2. Sufficient test data
3. Performance baseline establishment

## Test Data Management

### Test Data Creation
```typescript
// Example test stock creation
const testStock = {
    uuid: crypto.randomUUID(),
    product_uuid: crypto.randomUUID(),
    available_quantity: 100,
    reserved_quantity: 0,
};
```

### Cleanup Strategy
- `beforeEach`: Create fresh test data
- `afterEach`: Clean up test-specific data
- `afterAll`: Close database connections

## Best Practices

### Unit Tests
1. Mock all external dependencies
2. Test one scenario per test case
3. Use descriptive test names
4. Assert on specific values, not just existence
5. Test error conditions explicitly

### Integration Tests
1. Use real database but isolated test data
2. Clean up after each test
3. Test database constraints and relationships
4. Verify data persistence
5. Handle database connection issues gracefully

### Performance Tests
1. Set clear performance expectations
2. Run multiple iterations for statistical validity
3. Monitor memory usage
4. Test under different load conditions
5. Document performance baselines

## Common Issues and Solutions

### Database Connection Issues
```typescript
// Ensure proper connection handling
beforeAll(async () => {
    await PostgresManager.getInstance().connect();
});

afterAll(async () => {
    await PostgresManager.getInstance().disconnect();
});
```

### Test Data Isolation
```typescript
// Use unique UUIDs for each test
const testId = crypto.randomUUID();
```

### Mock Configuration
```typescript
// Proper mock setup
jest.mock("@/app/stock/create-reservation-stock/infra/postgres/models.sequelize");
```

### Performance Monitoring
```typescript
// Time measurement
const startTime = Date.now();
await operation();
const executionTime = Date.now() - startTime;
expect(executionTime).toBeLessThan(expectedTime);
```

## Continuous Integration

### Pipeline Configuration
1. Run unit tests in all builds
2. Run integration tests with test database
3. Run performance tests on performance branches
4. Generate coverage reports
5. Fail builds on test failures

### Coverage Requirements
- Unit tests: 100% line coverage
- Integration tests: Critical path coverage
- Performance tests: Baseline validation

## Debugging Tests

### Common Debug Commands
```bash
# Run with verbose output
npm test -- --verbose

# Run single test file
npm test -- update-reserved-stock.postgres.test.ts

# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Coverage report
npm test -- --coverage
```

### Debug Configuration
```json
// .vscode/launch.json
{
    "type": "node",
    "request": "launch",
    "name": "Debug Jest Tests",
    "program": "${workspaceFolder}/node_modules/.bin/jest",
    "args": ["--runInBand"],
    "console": "integratedTerminal",
    "internalConsoleOptions": "neverOpen"
}
```