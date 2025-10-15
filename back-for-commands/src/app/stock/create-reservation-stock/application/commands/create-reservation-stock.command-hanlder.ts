// shared
import { CommandHandler } from "@/app/shared/domain/domain-events/command-handler";
import { EventPublisher } from "@/app/shared/domain/domain-events/event-publisher";
// domain/entities
import { Stock } from "@/app/stock/create-reservation-stock/domain/entities/stock.entity";
import { ReservationStock } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";
import { StockReservationInfo } from "@/app/stock/create-reservation-stock/domain/domain-events/stock-reserved.domain-event";

// domain/repository
import { GetStockByProductIdRepository } from "@/app/stock/create-reservation-stock/domain/repository/get-stock-by-product-id.repository";
import { CreateReservationStockRepository } from "@/app/stock/create-reservation-stock/domain/repository/create-reservation-stock.repository";

import { CreateReservationStockCommand } from "./create-reservation-stock.command";

export class CreateReservationStockCommandHandler
    implements CommandHandler<CreateReservationStockCommand> {
    private readonly _CreateReservationStockRepository: CreateReservationStockRepository;
    private readonly _GetStockByProductIdRepository: GetStockByProductIdRepository;
    private readonly _eventPublisher: EventPublisher;

    constructor(
        CreateReservationStockRepository: CreateReservationStockRepository,
        GetStockByProductIdRepository: GetStockByProductIdRepository,
        eventPublisher: EventPublisher
    ) {
        this._CreateReservationStockRepository = CreateReservationStockRepository;
        this._GetStockByProductIdRepository = GetStockByProductIdRepository;
        this._eventPublisher = eventPublisher;
    }

    public async handler(command: CreateReservationStockCommand): Promise<void> {
        try {
            // 1. System validates product exists
            const reservationStockProps = command.createReservationStockCommandProps;
            const stock: Stock | null =
                await this._GetStockByProductIdRepository.findById(
                    reservationStockProps.productId
                );
            if (!stock) throw new Error("Product not found");

            // 2. System checks available stock and reserves stock
            const stockReservationInfo: StockReservationInfo = {
                reservationUuid: reservationStockProps.uuid,
                quantity: reservationStockProps.quantity,
            };
            stock.reserve(stockReservationInfo);

            // 3. System creates a new reservation with expiration time (default: 30 minutes)
            const reservationStock = new ReservationStock(
                reservationStockProps
            );

            // 4. System updates stock to increase reserved quantity
            await this._CreateReservationStockRepository.run(reservationStock);

            // publish domain events
            const domainEvents = reservationStock
                .getAggregateRoot()
                .pullDomainEvents();
            await this._eventPublisher.publishAll(domainEvents);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("CreateReservationStockCommandHandler - Error:", message);
            throw new Error(
                "CreateReservationStockCommandHandler - something went wrong"
            );
        }
    }
}
