// shared
import { CommandHandler } from "@/app/shared/domain/domain-events/command-handler";
import { EventPublisher } from "@/app/shared/domain/domain-events/event-publisher";
// create-reservation-stock/domain
import { ReservationStock } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";
import { GetStockByProductIdRepository } from "@/app/stock/create-reservation-stock/domain/repository/get-stock-by-product-id.repository";
import { CreateReservationStockRepository } from "@/app/stock/create-reservation-stock/domain/repository/create-reservation-stock.repository";
import { Stock } from "@/app/stock/create-reservation-stock/domain/entities/stock.entity";

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
            const stock: Stock | null =
                await this._GetStockByProductIdRepository.findById(
                    command.props.productId
                );
            if (!stock) throw new Error("Product not found");

            // 2. System checks available stock (total - reserved)
            const availableStock = stock.props;
            const available_quantity = availableStock.available_quantity;
            const reserved_quantity = availableStock.reserved_quantity;
            const availableQuantity = available_quantity - reserved_quantity;
            if (availableQuantity < command.props.quantity)
                throw new Error("Insufficient stock available");

            // 3. System creates a new reservation with expiration time (default: 30 minutes)
            const reservationStockProps = command.props;
            const expiresAt = reservationStockProps.expiresAt;
            if (!expiresAt) {
                const expiresAt = new Date();
                expiresAt.setMinutes(expiresAt.getMinutes() + 30);
                reservationStockProps.expiresAt = expiresAt;
            }
            const reservationStock = ReservationStock.create(reservationStockProps);

            // 4. System updates stock to increase reserved quantity


            // persist the reservation stock on DB
            await this._CreateReservationStockRepository.run(reservationStock);

            // publish domain events
            const domainEvents = reservationStock.pullDomainEvents();
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
