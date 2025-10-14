import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import {
    ReservationStock,
    ReservationStockProps,
} from "../domain/entities/reservation-stock.entity";
import { CreateReservationStockCommand } from "./commands/create-reservation-stock.command";
import { CreateReservationStockCommandHandler } from "./commands/create-reservation-stock.command-hanlder";

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
            // 1. validate request body
            const { data } = req;
            const reservationStockProps = ReservationStock.parse(data);
            const reservationStock = ReservationStock.create(reservationStockProps);

            // 2. create command
            const createReservationStockCommand = new CreateReservationStockCommand(
                reservationStock.props
            );

            // 3. handle command
            await this._createReservationStockCommandHandler.handler(
                createReservationStockCommand
            );

            // 4. return response
            const reservationStockResponse: ReservationStockApplicationResponse = {
                reservationStock: reservationStock.props,
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
