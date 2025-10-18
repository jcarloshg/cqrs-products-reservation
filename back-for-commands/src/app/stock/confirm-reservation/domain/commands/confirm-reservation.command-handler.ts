import { CommandHandler, CommandHandlerResp } from "@/app/shared/domain/domain-events/command-handler";
import { ConfirmReservationCommand } from "./confirm-reservation.command";

export class ConfirmReservationCommandHandler implements CommandHandler<ConfirmReservationCommand> {

    constructor() { }

    public async handler(command: ConfirmReservationCommand): Promise<CommandHandlerResp> {
        console.log("ConfirmReservationCommandHandler called with command:", command);
        return {
            code: 200,
            message: "Reservation confirmed successfully.",
            data: undefined
        }

    }

}