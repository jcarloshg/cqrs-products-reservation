import { CommandBus } from "@/app/shared/domain/domain-events/command-bus";
import { CommandHandlers } from "@/app/shared/domain/domain-events/command-handlers";
import { ConfirmReservationCommand } from "@/app/stock/confirm-reservation/domain/commands/confirm-reservation.command";
import { ConfirmReservationCommandHandler } from "@/app/stock/confirm-reservation/domain/commands/confirm-reservation.command-handler";
import {
    ConfirmReservationRequest,
    ConfirmReservationUseCase,
} from "@/app/stock/confirm-reservation/domain/confirm-reservation.use-case";

describe("confirm-reservation.use-case.test", () => {
    it("should be defined", async () => {
        const confirmReservationCommandHandler = new ConfirmReservationCommandHandler();
        const commandHandlers = new CommandHandlers();
        commandHandlers.register(
            ConfirmReservationCommand.COMMAND_NAME,
            confirmReservationCommandHandler
        );
        const commandBus = new CommandBus(commandHandlers);
        const useCase = new ConfirmReservationUseCase(commandBus);
        const request: ConfirmReservationRequest = {
            data: {
                uuid: "asdasd",
                productId: "asdasd",
                newStatus: "CONFIRMED",
            },
        };
        const res = await useCase.execute(request);
        expect(res).toBeDefined();
        expect(res.message).toBe("OK");
        expect(res.code).toBe(200);

    });
});
