import { GetStockByProductIdPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/get-stock-by-product-id.postgres";
import { ProductAttributes, ProductForDB, sequelize, StockAttributes, StockForDB } from "@/app/shared/infrastructure/repository/postgres/models.sequelize";
import { Stock } from "@/app/stock/create-reservation-stock/domain/entities/stock.entity";

describe("get-stock-by-product-id.postgres.integration.test.ts", () => {
    // Define variables for reuse
    let productUuid = "7985f398-e03a-43ee-9e94-97cd6d82b0b9"
    let stockUuid = "a06ae208-988c-40ec-ab0a-5f1bc6c16255"
    let productForTest: ProductAttributes | null = null;
    let stockForTest: StockAttributes | null = null;

    beforeEach(async () => {

        productForTest = (
            await ProductForDB.create({
                name: "Test Product",
                description: "A product for testing",
                price: 100,
                uuid: productUuid,
            })
        ).dataValues;

        stockForTest = (
            await StockForDB.create({
                uuid: stockUuid,
                product_uuid: productForTest.uuid,
                reserved_quantity: 50,
                available_quantity: 100,
            })
        ).dataValues
    });

    afterEach(async () => {
        // Delete stock before product to avoid FK violation
        if (stockForTest)
            await StockForDB.destroy({ where: { product_uuid: productForTest?.uuid } });

        // Delete product after stock
        if (productForTest)
            await ProductForDB.destroy({ where: { uuid: productForTest.uuid } });

        jest.clearAllMocks();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe("findById", () => {
        it("should return Stock when product exists", async () => {
            // Arrange
            const mockStock = {
                dataValues: {
                    uuid: stockForTest!.uuid,
                    product_uuid: stockForTest!.product_uuid,
                    available_quantity: stockForTest!.available_quantity,
                    reserved_quantity: stockForTest!.reserved_quantity,
                },
            };
            jest.spyOn(StockForDB, "findOne").mockResolvedValueOnce(mockStock as any);
            const repo = new GetStockByProductIdPostgres();

            // Act
            const result = await repo.findById(stockUuid);

            // Assert
            expect(result).toBeInstanceOf(Stock);
            const props = result?.getProps();
            expect(props?.uuid).toBe(stockForTest!.uuid);
            expect(props?.product_uuid).toBe(stockForTest!.product_uuid);
            expect(props?.available_quantity).toBe(stockForTest!.available_quantity);
            expect(props?.reserved_quantity).toBe(stockForTest!.reserved_quantity);
        });

        it("should return null when product does not exist", async () => {
            // Arrange
            jest.spyOn(StockForDB, "findOne").mockResolvedValueOnce(null);
            const repo = new GetStockByProductIdPostgres();

            // Act
            const result = await repo.findById("non-existent-id");

            // Assert
            expect(result).toBeNull();
        });

        it("should return null when stockRaw has no dataValues", async () => {
            // Arrange
            jest.spyOn(StockForDB, "findOne").mockResolvedValueOnce({} as any);
            const repo = new GetStockByProductIdPostgres();

            // Act
            const result = await repo.findById("prod-2");

            // Assert
            expect(result).toBeNull();
        });

        it("should handle errors thrown by StockForDB.findOne", async () => {
            // Arrange
            jest.spyOn(StockForDB, "findOne").mockRejectedValueOnce(new Error("DB error"));
            const repo = new GetStockByProductIdPostgres();

            // Act
            const result = await repo.findById("prod-3");

            // Assert
            expect(result).toBeNull();
        });
    });
});
