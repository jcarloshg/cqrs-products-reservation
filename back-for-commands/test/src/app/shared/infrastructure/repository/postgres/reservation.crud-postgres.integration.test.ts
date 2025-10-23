import { ReservationCrudPostgres } from "@/app/shared/infrastructure/repository/postgres/reservation.crud-postgres";
import {
    ProductAttributes,
    ProductForDB,
    ReservationForDB,
    StockAttributes,
    StockForDB,
    UserAttributes,
    UserFromDB,
} from "@/app/shared/infrastructure/repository/postgres/models.sequelize";
import { ReservationDataFromDB } from "@/app/shared/domain/repository/reservation.crud-repo";
import { ReservationStock } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";

describe("reservation.crud-postgres.integration.test.ts", () => {

    let userUuid = crypto.randomUUID();
    let productUuid = crypto.randomUUID();
    let stockUuid = crypto.randomUUID();
    let reservationUuid = crypto.randomUUID();

    let userForTest: UserAttributes | null = null;
    let productForTest: ProductAttributes | null = null;
    let stockForTest: StockAttributes | null = null;
    let reservationStock: ReservationStock | null = null;
    let reservationDataFromDB: ReservationDataFromDB = {
        uuid: reservationUuid,
        status: "PENDING",
        user_uuid: userUuid,
        product_id: productUuid,
        quantity: 1,
        expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    };

    let repo: ReservationCrudPostgres;

    beforeEach(async () => {
        userForTest = (
            await UserFromDB.create({
                uuid: userUuid,
                password: "testpassword",
                username: "testuser",
            })
        ).dataValues;

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
        ).dataValues;

        repo = new ReservationCrudPostgres();
    });

    afterEach(async () => {


        // Delete stock before product to avoid FK violation
        if (stockForTest)
            await StockForDB.destroy({ where: { product_uuid: productForTest?.uuid } });

        // Delete all reservations referencing the product before deleting product
        if (productForTest) {
            await ReservationForDB.destroy({ where: { product_id: productForTest.uuid } });
        }

        // Delete product after stock and reservations
        if (productForTest)
            await ProductForDB.destroy({ where: { uuid: productForTest.uuid } });

        // Delete user last
        if (userForTest)
            await UserFromDB.destroy({ where: { uuid: userForTest.uuid } });

        jest.clearAllMocks();
    })

    describe("create", () => {
        it("should create a reservation and return its data", async () => {
            // Arrange
            const item: ReservationDataFromDB = reservationDataFromDB;
            // Act
            const result = await repo.create(item);
            // Assert
            expect(result).toMatchObject(item);
        });

        it("should return null if creation fails (invalid data)", async () => {
            // Arrange
            const item: ReservationDataFromDB = {
                uuid: "",
                status: "PENDING",
            } as any;
            // Act
            const result = await repo.create(item);
            // Assert
            expect(result).toBeNull();
        });
    });

    describe("findAll", () => {
        it("should return all reservations", async () => {
            // Arrange
            // Act
            const result = await repo.findAll();
            // Assert
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe("findById", () => {
        it("should return reservation by id", async () => {
            // Arrange
            const itemToFind: ReservationDataFromDB = reservationDataFromDB;
            await repo.create(itemToFind);
            // Act
            const result = await repo.findById(itemToFind.uuid);
            // Assert
            expect(result).not.toBeNull();
            expect(result).toStrictEqual(reservationDataFromDB);
        });
        it("should return null if not found", async () => {
            // Arrange && Act
            const result = await repo.findById("non-existent-id");
            // Assert
            expect(result).toBeNull();
        });
    });

    describe("update", () => {
        it("should update reservation and return updated data", async () => {
            // Arrange
            const itemToUpdate: ReservationDataFromDB = reservationDataFromDB
            await repo.create(itemToUpdate);
            // Act
            const result = await repo.update(
                itemToUpdate.uuid,
                { status: "CONFIRMED" }
            );
            // Assert
            expect(result).toMatchObject({
                uuid: itemToUpdate.uuid,
                status: "CONFIRMED",
            });
        });
        it("should return null if reservation not found", async () => {
            // Arrange
            // Act
            const result = await repo.update("non-existent-id", {
                status: "CONFIRMED",
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
            const itemToDelete: ReservationDataFromDB = reservationDataFromDB;
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
