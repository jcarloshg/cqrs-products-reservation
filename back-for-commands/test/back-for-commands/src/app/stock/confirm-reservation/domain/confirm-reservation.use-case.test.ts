import { CommandBus } from "@/app/shared/domain/domain-events/command-bus";
import { CommandHandlers } from "@/app/shared/domain/domain-events/command-handlers";
import { ConfirmReservationCommand } from "@/app/stock/confirm-reservation/domain/commands/confirm-reservation.command";
import { ConfirmReservationCommandHandler } from "@/app/stock/confirm-reservation/domain/commands/confirm-reservation.command-handler";
import {
    ConfirmReservationRequest,
    ConfirmReservationUseCase,
} from "@/app/stock/confirm-reservation/domain/confirm-reservation.use-case";
import { ReservationStatus } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";

describe("confirm-reservation.use-case.test", () => {

    const validUuid = "123e4567-e89b-12d3-a456-426614174000";
    const validProductId = "987fcdeb-51a2-43d1-b123-456789abcdef";
    const validStatus = ReservationStatus.CONFIRMED;

    let useCase: ConfirmReservationUseCase;

    beforeEach(() => {
        const confirmReservationCommandHandler =
            new ConfirmReservationCommandHandler();
        const commandHandlers = new CommandHandlers();
        commandHandlers.register(
            ConfirmReservationCommand.COMMAND_NAME,
            confirmReservationCommandHandler
        );
        const commandBus = new CommandBus(commandHandlers);
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
