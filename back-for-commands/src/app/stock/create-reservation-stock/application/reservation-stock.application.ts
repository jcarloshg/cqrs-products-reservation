import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { CreateReservationStockCommand } from "./commands/create-reservation-stock.command";
import { CreateReservationStockCommandHandler } from "./create-reservation-stock.command-hanlder";
import {
    ReservationStock,
    ReservationStockProps,
} from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";

export interface ReservationStockApplicationRequest {
    data: { [key: string]: any };
}

export interface ReservationStockApplicationResponse {
    reservationStock: ReservationStockProps;
}

export class ReservationStockApplication {
    private readonly _createReservationStockCommandHandler: CreateReservationStockCommandHandler;

    constructor(
        createReservationStockCommandHandler: CreateReservationStockCommandHandler
    ) {
        this._createReservationStockCommandHandler =
            createReservationStockCommandHandler;
    }

    public async run(
        req: ReservationStockApplicationRequest
    ): Promise<CustomResponse<ReservationStockApplicationResponse | undefined>> {
        try {
            // const reservationStock = new ReservationStockDomain(data);
            // const props = reservationStock.getProps();

            // 1. validate request body && parse props
            const { data } = req;
            const createReservationStockCommand = new CreateReservationStockCommand(
                data
            );

            // 2. handle command
            const a = await this._createReservationStockCommandHandler.handler(
                createReservationStockCommand
            );

            // 3. return response
            const reservationStockResponse: ReservationStockApplicationResponse = {
                reservationStock: {} as ReservationStockProps,
            };
            return CustomResponse.created(reservationStockResponse);
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            return CustomResponse.badRequest(
                `CreateReservationStockApplication - ${errorMessage}`
            );
        }
    }
}
