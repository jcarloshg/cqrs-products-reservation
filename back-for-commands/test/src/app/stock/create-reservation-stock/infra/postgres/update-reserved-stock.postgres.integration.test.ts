import { UpdateReservedStockPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/update-reserved-stock.postgres";
import {
    ProductAttributes,
    ProductForDB,
    StockAttributes,
    StockForDB,
    UserAttributes,
    UserFromDB,
} from "@/app/shared/infrastructure/repository/postgres/models.sequelize";
import { UpdateStockProps } from "@/app/stock/create-reservation-stock/domain/services/repository/update-reserved-stock.repository";
import { ReservationStock } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";

describe("update-reserved-stock.postgres.integration.test.ts", () => {

    const productUuid = "5c839e2e-b2cd-4f8c-8bf9-f813a8907d14";
    const stockUuid = "348090d8-e8c4-4366-87f0-81f1cf58399a";
    let productForTest: ProductAttributes | null = null;
    let stockForTest: StockAttributes | null = null;

    let updateReservedStockPostgres: UpdateReservedStockPostgres;

    beforeEach(async () => {
        // ─────────────────────────────────────
        // set up test data
        // ─────────────────────────────────────
        productForTest = (
            await ProductForDB.create({
                name: "Test Product",
                description: "A product for testing",
                price: 100,
                uuid: crypto.randomUUID(),
            })
        ).dataValues;

        stockForTest = (
            await StockForDB.create({
                uuid: crypto.randomUUID(),
                product_uuid: productForTest.uuid,
                reserved_quantity: 50,
                available_quantity: 100,
            })
        ).dataValues;

        // Create connected instance
        updateReservedStockPostgres = new UpdateReservedStockPostgres();
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

    it("should update reserved quantity and return updated stock (positive)", async () => {
        // Arrange
        if (!stockForTest || !productForTest) {
            throw new Error("Test setup failed: stockForTest or productForTest is null");
        }
        const updateProps: UpdateStockProps = { id: stockForTest.uuid, quantity: 5 };
        // Act
        const result = await updateReservedStockPostgres.run(
            stockForTest.uuid,
            updateProps
        );
        // Assert
        expect(result).not.toBeNull();
        expect(result?.reserved_quantity).toBe(5);
        expect(result?.uuid).toBe(stockForTest.uuid);
        expect(result?.product_uuid).toBe(productForTest.uuid);
        expect(result?.available_quantity).toBe(stockForTest.available_quantity);
    });

    it("should return null if stock record does not exist (edge case)", async () => {
        // Arrange
        const updateProps: UpdateStockProps = {
            id: "non-existent-id",
            quantity: 7,
        };
        // Act
        const result = await updateReservedStockPostgres.run(
            "non-existent-id",
            updateProps
        );
        // Assert
        expect(result).toBeNull();
    });

    it("should handle error thrown by StockForDB.update (error handling)", async () => {
        // Arrange
        const updateProps: UpdateStockProps = { id: stockUuid, quantity: 8 };
        const spy = jest.spyOn(StockForDB, "update").mockImplementation(() => {
            throw new Error("Simulated DB error");
        });
        try {
            // Act
            const result = await updateReservedStockPostgres.run(
                stockUuid,
                updateProps
            );
            // Assert
            expect(result).toBeNull();
        } finally {
            spy.mockRestore();
        }
    });
});
