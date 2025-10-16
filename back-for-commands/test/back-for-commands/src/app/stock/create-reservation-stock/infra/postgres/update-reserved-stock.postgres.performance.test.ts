// import { UpdateReservedStockPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/update-reserved-stock.postgres";
// import { StockForDB } from "@/app/stock/create-reservation-stock/infra/postgres/models.sequelize";
// import { UpdateStockProps } from "@/app/stock/create-reservation-stock/domain/repository/update-reserved-stock.repository";

// /**
//  * Performance Tests for UpdateReservedStockPostgres
//  * These tests focus on performance characteristics and behavior under load
//  */
// describe('UpdateReservedStockPostgres Performance Tests', () => {
//     let updateReservedStockPostgres: UpdateReservedStockPostgres;
//     const testStockIds: string[] = [];
//     const testProductId = crypto.randomUUID();

//     beforeAll(async () => {
//         updateReservedStockPostgres = new UpdateReservedStockPostgres();
        
//         // Create multiple test stock records for performance testing
//         for (let i = 0; i < 10; i++) {
//             const stockId = crypto.randomUUID();
//             testStockIds.push(stockId);
            
//             try {
//                 await StockForDB.create({
//                     uuid: stockId,
//                     product_uuid: testProductId,
//                     available_quantity: 100,
//                     reserved_quantity: 0,
//                 });
//             } catch (error) {
//                 console.error(`Failed to create test stock ${i}:`, error);
//             }
//         }
//     });

//     afterAll(async () => {
//         // Clean up all test records
//         for (const stockId of testStockIds) {
//             try {
//                 await StockForDB.destroy({
//                     where: { uuid: stockId }
//                 });
//             } catch (error) {
//                 console.error(`Failed to clean up stock ${stockId}:`, error);
//             }
//         }
//     });

//     describe('Performance benchmarks', () => {
//         it('should update stock within acceptable time limit (< 100ms)', async () => {
//             // Arrange
//             const stockId = testStockIds[0];
//             const updateProps: UpdateStockProps = {
//                 id: stockId,
//                 quantity: 25,
//             };

//             // Act
//             const startTime = Date.now();
//             const result = await updateReservedStockPostgres.run(stockId, updateProps);
//             const endTime = Date.now();
//             const executionTime = endTime - startTime;

//             // Assert
//             expect(result).toBeDefined();
//             expect(executionTime).toBeLessThan(100); // Should complete within 100ms
//             console.log(`Single update execution time: ${executionTime}ms`);
//         });

//         it('should handle multiple sequential updates efficiently', async () => {
//             // Arrange
//             const stockId = testStockIds[1];
//             const updates = [10, 20, 30, 40, 50];

//             // Act
//             const startTime = Date.now();
//             const results = [];
            
//             for (const quantity of updates) {
//                 const updateProps: UpdateStockProps = {
//                     id: stockId,
//                     quantity,
//                 };
//                 const result = await updateReservedStockPostgres.run(stockId, updateProps);
//                 results.push(result);
//             }
            
//             const endTime = Date.now();
//             const totalExecutionTime = endTime - startTime;
//             const averageTime = totalExecutionTime / updates.length;

//             // Assert
//             expect(results).toHaveLength(updates.length);
//             results.forEach(result => expect(result).toBeDefined());
//             expect(totalExecutionTime).toBeLessThan(500); // Total time for 5 updates
//             expect(averageTime).toBeLessThan(100); // Average time per update
            
//             console.log(`Sequential updates total time: ${totalExecutionTime}ms`);
//             console.log(`Average time per update: ${averageTime}ms`);
//         });

//         it('should handle concurrent updates without significant performance degradation', async () => {
//             // Arrange
//             const updatePromises = testStockIds.slice(2, 7).map((stockId, index) => {
//                 const updateProps: UpdateStockProps = {
//                     id: stockId,
//                     quantity: (index + 1) * 10,
//                 };
//                 return updateReservedStockPostgres.run(stockId, updateProps);
//             });

//             // Act
//             const startTime = Date.now();
//             const results = await Promise.all(updatePromises);
//             const endTime = Date.now();
//             const executionTime = endTime - startTime;

//             // Assert
//             expect(results).toHaveLength(5);
//             results.forEach(result => expect(result).toBeDefined());
//             expect(executionTime).toBeLessThan(200); // Concurrent operations should be faster
            
//             console.log(`Concurrent updates execution time: ${executionTime}ms`);
//         });

//         it('should maintain consistent performance with repeated operations', async () => {
//             // Arrange
//             const stockId = testStockIds[7];
//             const iterations = 10;
//             const executionTimes: number[] = [];

//             // Act
//             for (let i = 0; i < iterations; i++) {
//                 const updateProps: UpdateStockProps = {
//                     id: stockId,
//                     quantity: i * 5,
//                 };

//                 const startTime = Date.now();
//                 const result = await updateReservedStockPostgres.run(stockId, updateProps);
//                 const endTime = Date.now();
                
//                 executionTimes.push(endTime - startTime);
//                 expect(result).toBeDefined();
//             }

//             // Assert
//             const averageTime = executionTimes.reduce((sum, time) => sum + time, 0) / iterations;
//             const maxTime = Math.max(...executionTimes);
//             const minTime = Math.min(...executionTimes);
//             const variance = executionTimes.reduce((sum, time) => sum + Math.pow(time - averageTime, 2), 0) / iterations;

//             expect(averageTime).toBeLessThan(100);
//             expect(maxTime).toBeLessThan(200);
//             expect(variance).toBeLessThan(1000); // Low variance indicates consistent performance

//             console.log(`Performance statistics over ${iterations} iterations:`);
//             console.log(`  Average: ${averageTime.toFixed(2)}ms`);
//             console.log(`  Min: ${minTime}ms`);
//             console.log(`  Max: ${maxTime}ms`);
//             console.log(`  Variance: ${variance.toFixed(2)}`);
//         });
//     });

//     describe('Memory and resource usage', () => {
//         it('should not cause memory leaks with repeated operations', async () => {
//             // Arrange
//             const stockId = testStockIds[8];
//             const initialMemory = process.memoryUsage();

//             // Act
//             for (let i = 0; i < 100; i++) {
//                 const updateProps: UpdateStockProps = {
//                     id: stockId,
//                     quantity: i % 50, // Cycle through values
//                 };
//                 await updateReservedStockPostgres.run(stockId, updateProps);
//             }

//             // Force garbage collection if available
//             if (global.gc) {
//                 global.gc();
//             }

//             const finalMemory = process.memoryUsage();

//             // Assert - Memory usage shouldn't grow significantly
//             const memoryGrowth = finalMemory.heapUsed - initialMemory.heapUsed;
//             const memoryGrowthMB = memoryGrowth / (1024 * 1024);

//             expect(memoryGrowthMB).toBeLessThan(10); // Less than 10MB growth
            
//             console.log(`Memory growth after 100 operations: ${memoryGrowthMB.toFixed(2)}MB`);
//         });

//         it('should handle large batches without excessive resource consumption', async () => {
//             // Arrange
//             const stockId = testStockIds[9];
//             const batchSize = 50;
//             const startMemory = process.memoryUsage();

//             // Act
//             const batchPromises = [];
//             for (let i = 0; i < batchSize; i++) {
//                 const updateProps: UpdateStockProps = {
//                     id: stockId,
//                     quantity: i,
//                 };
//                 // Add small delay to prevent overwhelming the database
//                 await new Promise(resolve => setTimeout(resolve, 1));
//                 batchPromises.push(updateReservedStockPostgres.run(stockId, updateProps));
//             }

//             const results = await Promise.all(batchPromises);
//             const endMemory = process.memoryUsage();

//             // Assert
//             expect(results).toHaveLength(batchSize);
//             results.forEach(result => expect(result).toBeDefined());

//             const memoryUsed = (endMemory.heapUsed - startMemory.heapUsed) / (1024 * 1024);
//             expect(memoryUsed).toBeLessThan(20); // Reasonable memory usage

//             console.log(`Memory used for batch of ${batchSize}: ${memoryUsed.toFixed(2)}MB`);
//         });
//     });

//     describe('Stress tests', () => {
//         it('should handle rapid successive updates gracefully', async () => {
//             // Arrange
//             const stockId = testStockIds[0];
//             const rapidUpdates = 20;
//             let successCount = 0;
//             let errorCount = 0;

//             // Act
//             const promises = Array.from({ length: rapidUpdates }, (_, i) => {
//                 const updateProps: UpdateStockProps = {
//                     id: stockId,
//                     quantity: i,
//                 };
//                 return updateReservedStockPostgres.run(stockId, updateProps)
//                     .then(result => {
//                         if (result) successCount++;
//                         return result;
//                     })
//                     .catch(error => {
//                         errorCount++;
//                         return null;
//                     });
//             });

//             const results = await Promise.all(promises);

//             // Assert
//             expect(successCount + errorCount).toBe(rapidUpdates);
//             expect(successCount).toBeGreaterThan(rapidUpdates * 0.8); // At least 80% success rate
            
//             console.log(`Rapid updates: ${successCount} successes, ${errorCount} errors`);
//         });

//         it('should recover gracefully from temporary database issues', async () => {
//             // This test simulates database connectivity issues
//             // In a real scenario, you might mock database failures
            
//             const stockId = testStockIds[1];
//             const updateProps: UpdateStockProps = {
//                 id: stockId,
//                 quantity: 100,
//             };

//             // Act & Assert
//             // Test that the method returns null gracefully when database is unavailable
//             // This test depends on your specific database setup and error handling
//             const result = await updateReservedStockPostgres.run(stockId, updateProps);
            
//             // In normal circumstances, this should succeed
//             expect(result).toBeDefined();
            
//             // If you want to test error scenarios, you would need to mock
//             // the database connection or create controlled failure conditions
//         });
//     });
// });