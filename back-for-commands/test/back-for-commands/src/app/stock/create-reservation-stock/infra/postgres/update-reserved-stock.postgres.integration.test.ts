import { UpdateReservedStockPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/update-reserved-stock.postgres";
import { ProductForDB, StockForDB } from "@/app/shared/infrastructure/repository/postgres/models.sequelize";

import { PostgresManager } from "@/app/shared/infrastructure/repository/postgres/postgres-manager";
import { UpdateStockProps } from "@/app/stock/create-reservation-stock/domain/services/repository/update-reserved-stock.repository";


describe('update-reserved-stock.postgres.integration.test', () => {
    let updateReservedStockPostgres: UpdateReservedStockPostgres;
    let testStockId: string;
    let testProductId: string;

    beforeAll(async () => {
        // Initialize the postgres connection for integration tests
        // Note: This assumes you have a test database configured
        updateReservedStockPostgres = new UpdateReservedStockPostgres();
    });

    beforeEach(async () => {

        const productTest = await ProductForDB.create({
            name: 'Test Product',
            description: 'A product for testing',
            price: 9.99,
        });
        const productTestData = productTest.dataValues;

        // Create test data before each test
        testProductId = productTestData.uuid;
        testStockId = crypto.randomUUID();

        try {
            // Insert test stock record
            await StockForDB.create({
                uuid: testStockId,
                product_uuid: testProductId,
                available_quantity: 100,
                reserved_quantity: 0,
            });
        } catch (error) {
            console.error('Failed to create test data:', error);
        }
    });

    afterEach(async () => {
        // Clean up test data after each test
        try {
            await StockForDB.destroy({
                where: { uuid: testStockId }
            });
            await ProductForDB.destroy({
                where: { uuid: testProductId }
            });
        } catch (error) {
            console.error('Failed to clean up test data:', error);
        }
    });

    afterAll(async () => {
        // Close database connection after all tests
        try {
            await PostgresManager.getInstance().disconnect();
        } catch (error) {
            console.error('Failed to close database connection:', error);
        }
    });

    describe('Real database operations', () => {
        it('should successfully update reserved quantity in real database', async () => {
            // Arrange
            const updateProps: UpdateStockProps = {
                id: testStockId,
                quantity: 25,
            };

            // Act
            const result = await updateReservedStockPostgres.run(testStockId, updateProps);

            // Assert
            expect(result).toBeDefined();
            expect(result?.uuid).toBe(testStockId);
            expect(result?.product_uuid).toBe(testProductId);
            expect(result?.reserved_quantity).toBe(25);
            expect(result?.available_quantity).toBe(100); // Should remain unchanged

            // Verify in database directly
            const stockInDb = await StockForDB.findByPk(testStockId);
            expect(stockInDb?.dataValues.reserved_quantity).toBe(25);
        });

        it('should handle updating to zero reserved quantity', async () => {
            // Arrange
            // First, set some reserved quantity
            await StockForDB.update(
                { reserved_quantity: 50 },
                { where: { uuid: testStockId } }
            );

            const updateProps: UpdateStockProps = {
                id: testStockId,
                quantity: 0,
            };

            // Act
            const result = await updateReservedStockPostgres.run(testStockId, updateProps);

            // Assert
            expect(result).toBeDefined();
            expect(result?.reserved_quantity).toBe(0);

            // Verify in database directly
            const stockInDb = await StockForDB.findByPk(testStockId);
            expect(stockInDb?.dataValues.reserved_quantity).toBe(0);
        });

        it('should return null for non-existent stock ID', async () => {
            // Arrange
            const nonExistentId = crypto.randomUUID();
            const updateProps: UpdateStockProps = {
                id: nonExistentId,
                quantity: 10,
            };

            // Act
            const result = await updateReservedStockPostgres.run(nonExistentId, updateProps);

            // Assert
            expect(result).toBeNull();
        });

        it('should handle concurrent updates correctly', async () => {
            // Arrange
            const updateProps1: UpdateStockProps = {
                id: testStockId,
                quantity: 30,
            };
            const updateProps2: UpdateStockProps = {
                id: testStockId,
                quantity: 50,
            };

            // Act - Execute concurrent updates
            const [result1, result2] = await Promise.all([
                updateReservedStockPostgres.run(testStockId, updateProps1),
                updateReservedStockPostgres.run(testStockId, updateProps2),
            ]);

            // Assert
            expect(result1).toBeDefined();
            expect(result2).toBeDefined();

            // One of the updates should succeed (the final state should be one of the values)
            const finalState = await StockForDB.findByPk(testStockId);
            const finalReservedQuantity = finalState?.dataValues.reserved_quantity;
            expect([30, 50]).toContain(finalReservedQuantity);
        });

        it('should preserve other fields during update', async () => {
            // Arrange
            const initialAvailableQuantity = 75;
            await StockForDB.update(
                { available_quantity: initialAvailableQuantity },
                { where: { uuid: testStockId } }
            );

            const updateProps: UpdateStockProps = {
                id: testStockId,
                quantity: 15,
            };

            // Act
            const result = await updateReservedStockPostgres.run(testStockId, updateProps);

            // Assert
            expect(result).toBeDefined();
            expect(result?.reserved_quantity).toBe(15);
            expect(result?.available_quantity).toBe(initialAvailableQuantity);
            expect(result?.product_uuid).toBe(testProductId);
            expect(result?.uuid).toBe(testStockId);
        });

        it('should handle multiple sequential updates', async () => {
            // Arrange
            const updates = [10, 20, 30, 0, 5];

            // Act & Assert
            for (const quantity of updates) {
                const updateProps: UpdateStockProps = {
                    id: testStockId,
                    quantity,
                };

                const result = await updateReservedStockPostgres.run(testStockId, updateProps);

                expect(result).toBeDefined();
                expect(result?.reserved_quantity).toBe(quantity);

                // Verify in database
                const stockInDb = await StockForDB.findByPk(testStockId);
                expect(stockInDb?.dataValues.reserved_quantity).toBe(quantity);
            }
        });

        it('should handle large quantity values', async () => {
            // Arrange
            const largeQuantity = 999999;
            const updateProps: UpdateStockProps = {
                id: testStockId,
                quantity: largeQuantity,
            };

            // Act
            const result = await updateReservedStockPostgres.run(testStockId, updateProps);

            // Assert
            expect(result).toBeDefined();
            expect(result?.reserved_quantity).toBe(largeQuantity);

            // Verify in database
            const stockInDb = await StockForDB.findByPk(testStockId);
            expect(stockInDb?.dataValues.reserved_quantity).toBe(largeQuantity);
        });
    });

    describe('Database constraint and validation tests', () => {
        it('should handle database constraints if any exist', async () => {
            // This test would depend on your actual database constraints
            // For example, if there's a check constraint on reserved_quantity >= 0

            const updateProps: UpdateStockProps = {
                id: testStockId,
                quantity: -1, // Potentially invalid quantity
            };

            // Act & Assert
            // This behavior depends on your database constraints
            const result = await updateReservedStockPostgres.run(testStockId, updateProps);

            // If negative values are allowed in your business logic:
            expect(result?.reserved_quantity).toBe(-1);

            // If negative values should be rejected by database constraints,
            // you might expect the result to be null and an error to be logged
        });

        it('should maintain data consistency across updates', async () => {
            // Arrange
            const initialStock = await StockForDB.findByPk(testStockId);
            const initialValues = {
                uuid: initialStock?.dataValues.uuid,
                product_uuid: initialStock?.dataValues.product_uuid,
                available_quantity: initialStock?.dataValues.available_quantity,
            };

            const updateProps: UpdateStockProps = {
                id: testStockId,
                quantity: 42,
            };

            // Act
            const result = await updateReservedStockPostgres.run(testStockId, updateProps);

            // Assert - Other fields should remain unchanged
            expect(result?.uuid).toBe(initialValues.uuid);
            expect(result?.product_uuid).toBe(initialValues.product_uuid);
            expect(result?.available_quantity).toBe(initialValues.available_quantity);
            expect(result?.reserved_quantity).toBe(42);
        });
    });
});