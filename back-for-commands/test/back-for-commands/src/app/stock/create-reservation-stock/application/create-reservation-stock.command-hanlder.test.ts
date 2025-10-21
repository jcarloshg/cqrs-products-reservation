import { OwnZodError } from "@/app/shared/domain/errors/zod.error";
import { EventBusOwn } from "@/app/shared/infrastructure/domain-events/own-domain-events/event-bus.own";
import { EventPublisherOwn } from "@/app/shared/infrastructure/domain-events/own-domain-events/event-publisher.own";
import { CreateReservationStockCommand } from "@/app/stock/create-reservation-stock/domain/commands/create-reservation-stock.command";
import { CreateReservationStockCommandHandler } from "@/app/stock/create-reservation-stock/application/create-reservation-stock.command-hanlder";
import { NotifyReservationOwnerEventHandler } from "@/app/stock/create-reservation-stock/application/events/notify-reservation-owner.event-handler";
import { NotifyStockUpdatedEventHandler } from "@/app/stock/create-reservation-stock/application/events/notify-stock-updated.event-hanlder";
import { NotifyStoreEventHandler } from "@/app/stock/create-reservation-stock/application/events/notify-store.event-handler";
import { CreateReservationStockDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/create-reservation-stock.doamin-event";
import { StockIncreaseReservationQuantityDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/stock-increase-reservation-quantity.domain-event";
import { ReservationStatus } from "@/app/shared/domain/model/ReservationStatus";
import { CreateReservationStockPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/create-reservation-stock.postgres";
import { GetStockByProductIdPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/get-stock-by-product-id.postgres";
import {
    ProductForDB,
    ReservationForDB,
    StockForDB,
    UserFromDB,
} from "@/app/shared/infrastructure/repository/postgres/models.sequelize";
import { UpdateReservedStockPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/update-reserved-stock.postgres";

describe("create-reservation-stock.command-hanlder.test", () => {
    let createReservationStockCommandHandler: CreateReservationStockCommandHandler;
    let testReservationId: string;
    let testStockId: string;
    let testProductId: string;
    let testUserId: string;

    beforeEach(async () => {
        // ─────────────────────────────────────
        // create test data
        // ─────────────────────────────────────
        // insert test product record
        try {
            const user = await UserFromDB.create({
                username: "testuser",
                password: "testpassword",
            });
            testUserId = user.dataValues.uuid;

            const productTest = await ProductForDB.create({
                name: "Test Product",
                description: "A product for testing",
                price: 9.99,
            });
            testProductId = productTest.dataValues.uuid;

            // Insert test stock record
            testStockId = crypto.randomUUID();
            await StockForDB.create({
                uuid: testStockId,
                product_uuid: testProductId,
                available_quantity: 100,
                reserved_quantity: 0,
            });
        } catch (error) {
            console.error("Failed to create test product:", error);
        }

        // ─────────────────────────────────────
        // init all services(repositories)
        // ─────────────────────────────────────
        const createReservationStockPostgres = new CreateReservationStockPostgres();
        const updateReservedStockPostgres = new UpdateReservedStockPostgres();
        const getStockByProductIdPostgres = new GetStockByProductIdPostgres();

        // ─────────────────────────────────────
        // init event handlers
        // ─────────────────────────────────────
        const eventBusOwn = new EventBusOwn();
        const eventPublisherOwn = new EventPublisherOwn(eventBusOwn);
        eventBusOwn.subscribe(
            CreateReservationStockDomainEvent.eventName,
            new NotifyReservationOwnerEventHandler()
        );
        eventBusOwn.subscribe(
            StockIncreaseReservationQuantityDomainEvent.eventName,
            new NotifyStockUpdatedEventHandler()
        );
        eventBusOwn.subscribe(
            CreateReservationStockDomainEvent.eventName,
            new NotifyStoreEventHandler()
        );

        // ─────────────────────────────────────
        // init command handlers
        // ─────────────────────────────────────
        createReservationStockCommandHandler =
            new CreateReservationStockCommandHandler(
                createReservationStockPostgres,
                getStockByProductIdPostgres,
                updateReservedStockPostgres,
                eventPublisherOwn
            );
    });

    afterEach(async () => {
        // Clean up test data after each test
        // Order matters due to foreign key constraints:
        // 1. Delete reservations first (they reference products and users)
        // 2. Delete stock (it references products)
        // 3. Delete products
        // 4. Delete users
        try {
            // Clean up any reservations that might have been created during the test
            await ReservationForDB.destroy({
                where: { uuid: testReservationId },
            });
            await StockForDB.destroy({
                where: { uuid: testStockId },
            });
            await ProductForDB.destroy({
                where: { uuid: testProductId },
            });
            await UserFromDB.destroy({
                where: { uuid: testUserId },
            });
        } catch (error) {
            console.error("Failed to clean up test data:", error);
        }
    });

    it("should throw an error if stock is not available", async () => {
        // Arrange
        const command = new CreateReservationStockCommand({
            uuid: crypto.randomUUID(),
            ownerUuid: testUserId,
            productId: testProductId,
            quantity: 1000, // Intentionally high to trigger stock unavailability
            expiresAt: new Date(new Date().getTime() + 10000),
            status: ReservationStatus.PENDING,
        });

        // Act
        const res = await createReservationStockCommandHandler.handler(command);

        // Assert
        expect(res.code).toBe(400);
        expect(res.message).toBe("Insufficient stock available for the reservation");
    });

    it("should create a reservation stock successfully", async () => {
        // Arrange
        testReservationId = crypto.randomUUID();
        const command = new CreateReservationStockCommand({
            uuid: testReservationId,
            ownerUuid: testUserId,
            productId: testProductId,
            quantity: 10,
            expiresAt: new Date(new Date().getTime() + 10000),
            status: ReservationStatus.PENDING,
        });

        // Act
        const res = await createReservationStockCommandHandler.handler(command);

        // Assert
        expect(res.code).toBe(201);
        expect(res.message).toBe("Reservation stock created successfully");
        expect(res.data).toBeDefined();
        expect(res.data?.reservationStock).toBeDefined();
        expect(res.data?.reservationStock.productId).toBe(testProductId);
        expect(res.data?.reservationStock.quantity).toBe(10);
    });

    it("should throw an error if product does not exist", async () => {
        // Arrange
        const nonExistentProductId = crypto.randomUUID();
        const command = new CreateReservationStockCommand({
            uuid: crypto.randomUUID(),
            ownerUuid: testUserId, // user exists
            productId: nonExistentProductId, // product does NOT exist
            quantity: 5,
            expiresAt: new Date(new Date().getTime() + 10000),
            status: ReservationStatus.PENDING,
        });

        // Act
        const res = await createReservationStockCommandHandler.handler(command);

        // Assert
        expect(res.code).toBe(404);
        expect(res.message).toBe("Stock for the specified product not found");
    });

    it("should throw an error if reservation quantity is zero", async () => {
        // Arrange
        try {
            new CreateReservationStockCommand({
                uuid: crypto.randomUUID(),
                ownerUuid: testUserId,
                productId: testProductId,
                quantity: 0, // Invalid quantity
                expiresAt: new Date(new Date().getTime() + 10000),
                status: ReservationStatus.PENDING,
            });
        } catch (error) {
            expect(error).toBeInstanceOf(OwnZodError);
            const zodError = error as OwnZodError;
            expect(zodError.modelsErrorRequest.entity).toBe("CreateReservationStockCommand");
            expect(zodError.modelsErrorRequest.userError).toMatch("quantity - Too small: expected number to be >=1");
            return;
        }
    });


});
