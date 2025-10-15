import { EventPublisherInMemory } from "@/app/shared/infrastructure/in-memory/even-publisher.in-memory";
import { EventBusInMemory } from "@/app/shared/infrastructure/in-memory/event-bus.in-memeory";
import { CreateReservationStockCommandHandler } from "@/app/stock/create-reservation-stock/application/commands/create-reservation-stock.command-hanlder";
import { SendNotificationEventHandler } from "@/app/stock/create-reservation-stock/application/events/send-notification.event-handler";
import {
    ReservationStockApplication,
    ReservationStockApplicationRequest,
} from "@/app/stock/create-reservation-stock/application/reservation-stock.application";
import { ReservationStatus } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";
import { CreateReservationStockPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/create-reservation-stock.postgres";
import { GetStockByProductIdPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/get-stock-by-product-id.postgres";

describe("reservation-stock.application.test", () => {
    it("should create a reservation stock successfully", async () => {
        // init all services(repositories)

        const createReservationStockPostgres = new CreateReservationStockPostgres();
        const getStockByProductIdPostgres = new GetStockByProductIdPostgres();

        // init event handlers
        const eventBus = new EventBusInMemory();
        eventBus.subscribe(
            "RESERVATION-STOCK.CREATED",
            new SendNotificationEventHandler()
        );
        const eventPublisher = new EventPublisherInMemory(eventBus);

        // init command handlers
        const createReservationStockCommandHandler =
            new CreateReservationStockCommandHandler(
                createReservationStockPostgres,
                getStockByProductIdPostgres,
                eventPublisher,
            );

        // run the use case
        const reservationStockApplication = new ReservationStockApplication(
            createReservationStockCommandHandler
        );
        const req: ReservationStockApplicationRequest = {
            data: {
                uuid: crypto.randomUUID(),
                ownerUuid: crypto.randomUUID(),
                productId: crypto.randomUUID(),
                quantity: 1,
                expiresAt: new Date(new Date().getTime() + 10000),
                status: ReservationStatus.PENDING,
            },
        };
        const res = await reservationStockApplication.run(req);
        expect(res.code).toBe(201);
        expect(res.data).toBeDefined();
    });
});
