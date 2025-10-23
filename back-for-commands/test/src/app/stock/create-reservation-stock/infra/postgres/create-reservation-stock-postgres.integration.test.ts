
import { CreateReservationStockPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/create-reservation-stock.postgres";
import { ReservationStock } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";
import {
    ProductAttributes,
    ProductForDB,
    ReservationForDB,
    sequelize,
    StockAttributes,
    StockForDB,
    UserAttributes,
    UserFromDB,
} from "@/app/shared/infrastructure/repository/postgres/models.sequelize";
import { ReservationStatus } from "@/app/shared/domain/model/ReservationStatus";

describe("create-reservation-stock-postgres.integration.test.ts", () => {
    // Define variables for reuse
    let userForTest: UserAttributes | null = null;
    let productForTest: ProductAttributes | null = null;
    let stockForTest: StockAttributes | null = null;
    let reservationStock: ReservationStock | null = null;
    let repo: CreateReservationStockPostgres;

    beforeEach(async () => {

        userForTest = (
            await UserFromDB.create({
                uuid: crypto.randomUUID(),
                password: "testpassword",
                username: "testuser",
            })
        ).dataValues;

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
        ).dataValues

        repo = new CreateReservationStockPostgres();
    });

    afterEach(async () => {
        // Delete reservation first
        if (reservationStock !== null) {
            const { uuid } = (reservationStock as ReservationStock).getProps();
            await ReservationForDB.destroy({ where: { uuid } });
        }

        // Delete stock before product to avoid FK violation
        if (stockForTest)
            await StockForDB.destroy({ where: { product_uuid: productForTest?.uuid } });

        // Delete product after stock
        if (productForTest)
            await ProductForDB.destroy({ where: { uuid: productForTest.uuid } });

        // Delete user last
        if (userForTest)
            await UserFromDB.destroy({ where: { uuid: userForTest.uuid } });

        jest.clearAllMocks();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a reservation stock successfully", async () => {
        // Arrange
        const mockEntity = new ReservationStock({
            uuid: crypto.randomUUID(),
            ownerUuid: userForTest!.uuid,
            productId: productForTest!.uuid,
            quantity: 5,
            status: ReservationStatus.PENDING,
            expiresAt: new Date(),
        });

        // Act
        const result = await repo.run(mockEntity);
        reservationStock = result;

        // Assert
        expect(result).not.toBeNull();
        expect(result?.getProps().uuid).toBe(mockEntity.getProps().uuid);
        expect(result?.getProps().ownerUuid).toBe(mockEntity.getProps().ownerUuid);
        expect(result?.getProps().productId).toBe(mockEntity.getProps().productId);
        expect(result?.getProps().quantity).toBe(mockEntity.getProps().quantity);
        expect(result?.getProps().status).toBe(mockEntity.getProps().status);
        expect(result?.getProps().expiresAt).toEqual(mockEntity.getProps().expiresAt);
    });

    it("should return null if entity is missing required fields (edge case)", async () => {
        // Arrange
        // Create entity with missing productId
        const invalidEntity = new ReservationStock({
            uuid: crypto.randomUUID(),
            ownerUuid: userForTest!.uuid,
            productId: crypto.randomUUID(), // Assuming this ID does not exist in DB
            quantity: 5,
            status: ReservationStatus.PENDING,
            expiresAt: new Date(),
        });

        // Act
        const result = await repo.run(invalidEntity);

        // Assert
        expect(result).toBeNull();
    });

    it("should handle database errors and return null (error handling)", async () => {
        // Arrange
        // Spy on ReservationForDB.create to throw error
        const spy = jest.spyOn(ReservationForDB, "create").mockImplementation(() => {
            throw new Error("Simulated DB error");
        });
        const mockEntity = new ReservationStock({
            uuid: crypto.randomUUID(),
            ownerUuid: userForTest!.uuid,
            productId: productForTest!.uuid,
            quantity: 5,
            status: ReservationStatus.PENDING,
            expiresAt: new Date(),
        });

        // Act
        const result = await repo.run(mockEntity);

        // Assert
        expect(result).toBeNull();
        spy.mockRestore();
    });

});
