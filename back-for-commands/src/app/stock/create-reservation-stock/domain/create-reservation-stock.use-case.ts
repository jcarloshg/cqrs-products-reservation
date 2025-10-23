import { CommandBus } from "@/app/shared/domain/domain-events/command-bus";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { CreateReservationStockCommand } from "./commands/create-reservation-stock.command";

export class CreateReservationStockUseCase {
    private readonly _commandBus: CommandBus;

    constructor(commandBus: CommandBus) {
        this._commandBus = commandBus;
    }

    public async execute(request: CreateReservationStockRequest): Promise<CustomResponse<any>> {
        try {
            const createReservationStockCommand = new CreateReservationStockCommand(request.data);
            const result = await this._commandBus.dispatch(createReservationStockCommand);
            return new CustomResponse(result.code, result.message, result.data);
        } catch (error) {
            return CustomResponse.internalServerError();
        }
    }
}

export interface CreateReservationStockRequest {
    data: { [key: string]: any };
}
