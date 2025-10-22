import { CommandBus } from "@/app/shared/domain/domain-events/command-bus";
import { OwnZodError } from "@/app/shared/domain/errors/zod.error";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { CreateReservationStockCommand } from "./commands/create-reservation-stock.command";

export class CreateReservationStockUseCase {
    private readonly _commandBus: CommandBus;

    constructor(commandBus: CommandBus) {
        this._commandBus = commandBus;
    }

    public async execute(
        request: CreateReservationStockRequest
    ): Promise<CustomResponse<CreateReservationStockResponse | undefined>> {
        try {
            const createReservationStockCommand = new CreateReservationStockCommand(
                request.data
            );
            await this._commandBus.dispatch(createReservationStockCommand);

            const createReservationStockResponse: CreateReservationStockResponse = {
                reservationStockCreated: {}
            };
            return CustomResponse.created(
                createReservationStockResponse,
                "Reservation stock created successfully."
            );
        } catch (error) {
            if (error instanceof OwnZodError) return error.toCustomResponse();
            return CustomResponse.internalServerError();
        }
    }
}

export interface CreateReservationStockRequest {
    data: { [key: string]: any };
}

export interface CreateReservationStockResponse {
    reservationStockCreated: { [key: string]: any } | undefined;
}
