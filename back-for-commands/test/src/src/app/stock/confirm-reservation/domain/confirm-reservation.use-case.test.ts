import { CommandBus } from "@/app/shared/domain/domain-events/command-bus";
import { CommandHandlers } from "@/app/shared/domain/domain-events/command-handlers";
import { ConfirmReservationCommand } from "@/app/stock/confirm-reservation/domain/commands/confirm-reservation.command";
import { ConfirmReservationCommandHandler } from "@/app/stock/confirm-reservation/domain/commands/confirm-reservation.command-handler";
import {
    ConfirmReservationRequest,
    ConfirmReservationUseCase,
} from "@/app/stock/confirm-reservation/domain/confirm-reservation.use-case";
import { ReservationStatus } from "@/app/shared/domain/model/ReservationStatus";
import { EventPublisherOwn } from "@/app/shared/infrastructure/domain-events/own-domain-events/event-publisher.own";
import { EventBusOwn } from "@/app/shared/infrastructure/domain-events/own-domain-events/event-bus.own";
import { ReservationStockRepositoryMoc } from "../../../shared/infrastructure/repository/postgres/reservation-stock.repository.moc";
import { NotifyToOwnerReservationSetAsConfirmedEventHandler } from "@/app/stock/confirm-reservation/domain/domain-events/reservation-set-as-confirmed.event-hanler";
import { ReservationSetAsConfirmedDomainEvent } from "@/app/stock/confirm-reservation/domain/domain-events/reservation-set-as-confirmed.domain-event";

describe("confirm-reservation.use-case.test", () => {
    const validUuid = "123e4567-e89b-12d3-a456-426614174000";
    const validProductId = "987fcdeb-51a2-43d1-b123-456789abcdef";
    const validStatus = ReservationStatus.CONFIRMED;

    let useCase: ConfirmReservationUseCase;

    beforeEach(() => {
        // ─────────────────────────────────────
        // domain events
        // ─────────────────────────────────────
        const eventBusOwn = new EventBusOwn();
        const notifyToOwnerReservationSetAsConfirmedEventHandler =
            new NotifyToOwnerReservationSetAsConfirmedEventHandler();
        eventBusOwn.subscribe(
            "RESERVATION.CONFIRMED",
            notifyToOwnerReservationSetAsConfirmedEventHandler
        );
        const eventPublisherOwn = new EventPublisherOwn(eventBusOwn);

        // ─────────────────────────────────────
        // command handlers
        // ─────────────────────────────────────
        const reservationStockRepositoryMoc = new ReservationStockRepositoryMoc();
        const confirmReservationCommandHandler =
            new ConfirmReservationCommandHandler(
                reservationStockRepositoryMoc,
                eventPublisherOwn
            );
        const commandHandlers = new CommandHandlers();
        commandHandlers.register(
            ConfirmReservationCommand.COMMAND_NAME,
            confirmReservationCommandHandler
        );
        const commandBus = new CommandBus(commandHandlers);

        // ─────────────────────────────────────
        // init use case
        // ─────────────────────────────────────
        useCase = new ConfirmReservationUseCase(commandBus);
    });

    it("should be defined", async () => {
        const request: ConfirmReservationRequest = {
            data: {
                uuid: validUuid,
                productId: validProductId,
                newStatus: validStatus,
            },
        };
        const res = await useCase.execute(request);
        expect(res).toBeDefined();
        expect(res.message).toBe("Reservation confirmed successfully.");
        expect(res.code).toBe(200);
    });
});
