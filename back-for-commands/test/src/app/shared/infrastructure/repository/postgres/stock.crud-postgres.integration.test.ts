
import { StockCrudPostgres } from "@/app/shared/infrastructure/repository/postgres/stock.crud-postgres";
import { ProductAttributes, ProductForDB, StockForDB } from "@/app/shared/infrastructure/repository/postgres/models.sequelize";
import { StockDataFromDB } from "@/app/shared/domain/repository/stock.crud-repo";

describe("stock.crud-postgres.integration.test.ts", () => {

    let stockUuid = "54bccc6c-b0e2-4e7d-a2e9-000000000111";
    let productUuid = "54bccc6c-b1e2-4e7d-a2e9-000000000222";

    let productForTest: ProductAttributes = {
        uuid: productUuid,
        name: "Test Product",
        description: "A product for testing",
        price: 100,
    };
    let stockForTest: StockDataFromDB = {
        uuid: stockUuid,
        product_uuid: productUuid,
        available_quantity: 50,
        reserved_quantity: 5,
    }

    let repo: StockCrudPostgres;

    beforeEach(async () => {

        productForTest = (
            await ProductForDB.create(productForTest)
        ).dataValues;

        // stockForTest = (
        //     await StockForDB.create({
        //         uuid: stockUuid,
        //         product_uuid: productUuid,
        //         available_quantity: 100,
        //         reserved_quantity: 10,
        //     })
        // ).dataValues;

        repo = new StockCrudPostgres();
    });

    afterEach(async () => {
        if (stockForTest) {
            await StockForDB.destroy({ where: { uuid: stockForTest.uuid } });
        }
        if (productForTest) {
            await ProductForDB.destroy({ where: { uuid: productForTest.uuid } });
        }
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create a stock item and return its data", async () => {
            // Arrange
            const itemToCreate: StockDataFromDB = stockForTest
            // Act
            const result = await repo.create(itemToCreate);
            // Assert
            expect(result).toStrictEqual(itemToCreate);
        });

        it("should return null if creation fails (invalid data)", async () => {
            // Arrange
            const item = {
                uuid: 123123,
                product_uuid: 456456,
                available_quantity: 0,
                reserved_quantity: 0,
            } as any;
            // Act
            const result = await repo.create(item);
            // Assert
            expect(result).toBeNull();
        });
    });

    describe("findAll", () => {
        it("should return all stock items", async () => {
            // Arrange
            // Act
            const result = await repo.findAll();
            // Assert
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe("findById", () => {
        it("should return stock item by id", async () => {
            // Arrange
            const itemToFind = (await repo.create(stockForTest))!;
            // Act
            const result = await repo.findById(itemToFind.uuid);
            // Assert
            expect(result).not.toBeNull();
            expect(result).toStrictEqual(itemToFind);
        });
        it("should return null if not found", async () => {
            // Arrange && Act
            const result = await repo.findById("non-existent-id");
            // Assert
            expect(result).toBeNull();
        });
        });

        describe("findByFields", () => {
            it("should return stock item by fields", async () => {
                // Arrange
                const itemToFind = (await repo.create(stockForTest))!;
                // Act
                const result = await repo.findByFields({ product_uuid: itemToFind.product_uuid });
                // Assert
                expect(result).not.toBeNull();
                expect(result?.product_uuid).toBe(itemToFind.product_uuid);
            });
            it("should return null if not found by fields", async () => {
                // Arrange && Act
                const result = await repo.findByFields({ product_uuid: "non-existent-product-uuid" });
                // Assert
                expect(result).toBeNull();
            });
    });

    describe("update", () => {
        it("should update stock and return updated data", async () => {
            // Arrange
            const itemToUpdate: StockDataFromDB = stockForTest;
            await repo.create(itemToUpdate);
            // Act
            const result = (await repo.update(
                itemToUpdate.uuid,
                {
                    available_quantity: 200,
                }
            ))!;
            // Assert
            expect(result).not.toBeNull();
            expect(result.uuid).toBe(itemToUpdate.uuid);
            expect(result.available_quantity).toBe(200);
            expect(result.reserved_quantity).toBe(itemToUpdate.reserved_quantity);
            expect(result.product_uuid).toBe(itemToUpdate.product_uuid);
        });
        it("should return null if stock not found", async () => {
            // Arrange
            // Act
            const result = await repo.update("non-existent-id", {
                available_quantity: 200,
            });
            // Assert
            expect(result).toBeNull();
        });
    });

    describe("softDelete", () => {
        it("should throw not implemented error", async () => {
            // Arrange
            // Act & Assert
            await expect(repo.softDelete("1")).rejects.toThrow(
                "softDelete - Method not implemented yet."
            );
        });
    });

    describe("destroy", () => {
        it("should return true if destroy succeeds", async () => {
            // Arrange
            const itemToDelete: StockDataFromDB = stockForTest;
            await repo.create(itemToDelete);
            // Act
            const result = await repo.destroy(itemToDelete.uuid);
            // Assert
            expect(result).toBe(true);
        });
        it("should return false if destroy returns 0 (not found)", async () => {
            // Arrange
            // Act
            const result = await repo.destroy("non-existent-id");
            // Assert
            expect(result).toBe(false);
        });
    });
});
