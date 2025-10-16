import { EventBusOwn } from "@/app/shared/infrastructure/domain-events/own-domain-events/event-bus.own";
import { EventPublisherOwn } from "@/app/shared/infrastructure/domain-events/own-domain-events/event-publisher.own";
import { EventPublisherInMemory } from "@/app/shared/infrastructure/repository/in-memory/even-publisher.in-memory";
import { EventBusInMemory } from "@/app/shared/infrastructure/repository/in-memory/event-bus.in-memeory";
import { CreateReservationStockCommandHandler } from "@/app/stock/create-reservation-stock/application/create-reservation-stock.command-hanlder";
import { NotifyStoreEventHandler } from "@/app/stock/create-reservation-stock/application/events/notify-store.event-handler";
import {
    ReservationStockApplication,
    ReservationStockApplicationRequest,
} from "@/app/stock/create-reservation-stock/application/reservation-stock.application";
import { CreateReservationStockDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/create-reservation-stock.doamin-event";
import { ReservationStatus } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";
import { CreateReservationStockPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/create-reservation-stock.postgres";
import { GetStockByProductIdPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/get-stock-by-product-id.postgres";
import { UpdateReservedStockPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/update-reserved-stock.postgres";

describe("reservation-stock.application.test", () => {
    it("should create a reservation stock successfully", async () => {
        // init all services(repositories)
        const createReservationStockPostgres = new CreateReservationStockPostgres();
        const updateReservedStockPostgres = new UpdateReservedStockPostgres();
        const getStockByProductIdPostgres = new GetStockByProductIdPostgres();

        // init event handlers
        const eventBusOwn = new EventBusOwn();
        const eventPublisherOwn = new EventPublisherOwn(eventBusOwn);

        const eventBus = new EventBusInMemory();
        eventBus.subscribe(
            CreateReservationStockDomainEvent.eventName,
            new NotifyStoreEventHandler()
        );
        const eventPublisher = new EventPublisherInMemory(eventBus);

        // init command handlers
        const createReservationStockCommandHandler =
            new CreateReservationStockCommandHandler(
                createReservationStockPostgres,
                getStockByProductIdPostgres,
                updateReservedStockPostgres,
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
