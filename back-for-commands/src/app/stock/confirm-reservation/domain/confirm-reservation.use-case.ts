import { OwnZodError } from "@/app/shared/domain/errors/zod.error";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { ConfirmReservationCommand } from "./commands/confirm-reservation.command";
import { CommandBus } from "@/app/shared/domain/domain-events/command-bus";

export class ConfirmReservationUseCase {
    private readonly commandBus: CommandBus;

    constructor(commandBus: CommandBus) {
        this.commandBus = commandBus;
    }

    public async execute(
        request: ConfirmReservationRequest
    ): Promise<CustomResponse<ConfirmReservationResponse | undefined>> {
        try {
            const confirmReservationCommand = new ConfirmReservationCommand(
                request.data
            );
            const res = await this.commandBus.dispatch(confirmReservationCommand);
            const response: ConfirmReservationResponse = { reservationConfirmed: res.data };
            return CustomResponse.ok(response, "Reservation confirmed successfully.");
        } catch (error) {
            if (error instanceof OwnZodError) return error.toCustomResponse();
            return CustomResponse.internalServerError();
        }
    }
}

export interface ConfirmReservationRequest {
    data: { [key: string]: any };
}

export interface ConfirmReservationResponse {
    reservationConfirmed: { [key: string]: any } | undefined;
}
