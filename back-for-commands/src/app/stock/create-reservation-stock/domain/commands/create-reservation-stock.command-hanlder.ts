// shared
import {
    CommandHandler,
    CommandHandlerResp,
} from "@/app/shared/domain/domain-events/command-handler";
import { EventPublisher } from "@/app/shared/domain/domain-events/event-publisher";
import { DomainError } from "@/app/shared/domain/errors/domain.error";
import { OwnZodError } from "@/app/shared/domain/errors/zod.error";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
// domain/entities
import {
    Stock,
    StockReservationInfo,
} from "@/app/stock/create-reservation-stock/domain/entities/stock.entity";
import {
    ReservationStock,
    ReservationStockProps,
} from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";

// domain/repository
import { GetStockByProductIdRepository } from "@/app/stock/create-reservation-stock/domain/repository/get-stock-by-product-id.repository";
import { CreateReservationStockRepository } from "@/app/stock/create-reservation-stock/domain/repository/create-reservation-stock.repository";
import { UpdateReservedStockRepository } from "@/app/stock/create-reservation-stock/domain/repository/update-reserved-stock.repository";
// application
import { CreateReservationStockCommand } from "./create-reservation-stock.command";

export interface CreateReservationStockResponse {
    reservationStock: ReservationStockProps;
}

export class CreateReservationStockCommandHandler
    implements CommandHandler<CreateReservationStockCommand> {
    constructor(
        private readonly _CreateReservationStockRepository: CreateReservationStockRepository,
        private readonly _GetStockByProductIdRepository: GetStockByProductIdRepository,
        private readonly _UpdateReservedStockRepository: UpdateReservedStockRepository,
        private readonly _eventPublisher: EventPublisher
    ) { }

    public async handler(
        command: CreateReservationStockCommand
    ): Promise<CommandHandlerResp> {
        try {
            // 1. System validates product exists
            const reservationStockProps = command.createReservationStockCommandProps;
            const stock: Stock | null =
                await this._GetStockByProductIdRepository.findById(
                    reservationStockProps.productId
                );
            if (!stock)
                return CustomResponse.notFound(
                    "Stock for the specified product not found"
                ).toCommandHandlerResp();

            // ─────────────────────────────────────
            // 2. System checks available stock and reserves stock
            // ─────────────────────────────────────
            const stockReservationInfo: StockReservationInfo = {
                reservationUuid: reservationStockProps.uuid,
                quantity: reservationStockProps.quantity,
            };
            stock.reserve(stockReservationInfo);

            // ─────────────────────────────────────
            // 3. System creates a new reservation with expiration time (default: 30 minutes)
            // ─────────────────────────────────────
            const reservationStock = new ReservationStock(reservationStockProps);

            // ─────────────────────────────────────
            // 4. System updates stock to increase reserved quantity
            // ─────────────────────────────────────
            await Promise.all([
                await this._CreateReservationStockRepository.run(reservationStock),
                await this._UpdateReservedStockRepository.run(stock.getProps().uuid, {
                    id: stock.getProps().uuid,
                    quantity: stock.getProps().reserved_quantity,
                }),
            ]);

            // ─────────────────────────────────────
            // 5. publish domain events
            // ─────────────────────────────────────
            const reservationStockDomainEvents = reservationStock
                .getAggregateRoot()
                .pullDomainEvents();
            await this._eventPublisher.publishAll(reservationStockDomainEvents);

            const stockDomainEvents = stock.getAggregateRoot().pullDomainEvents();
            await this._eventPublisher.publishAll(stockDomainEvents);

            // 6. return response
            const resp: CreateReservationStockResponse = {
                reservationStock: reservationStock.getProps(),
            };
            const customResponse =
                CustomResponse.created<CreateReservationStockResponse>(
                    resp,
                    "Reservation stock created successfully"
                );
            const commandHandlerResp = customResponse.toCommandHandlerResp();
            return commandHandlerResp;
        } catch (error) {
            if (error instanceof DomainError)
                return error.toCustomResponse().toCommandHandlerResp();

            if (error instanceof OwnZodError)
                return error.toCustomResponse().toCommandHandlerResp();

            const message = error instanceof Error ? error.message : String(error);
            console.error("CreateReservationStockCommandHandler - Error:", message);
            return CustomResponse.internalServerError().toCommandHandlerResp();
        }
    }
}
