import { CommandHandler } from "@/app/shared/domain/domain-events/command-handler";
import { CreateReservationStockCommand } from "./create-reservation-stock.command";
import { EventPublisher } from "@/app/shared/domain/domain-events/event-publisher";
import { CreateReservationStockRepository } from "@/app/stock/create-reservation-stock/domain/repository/create-reservation-stock.repository";
import { ReservationStock } from "../../domain/entities/reservation-stock.entity";

export class CreateReservationStockCommandHandler
    implements CommandHandler<CreateReservationStockCommand> {
    private readonly _CreateReservationStockRepository: CreateReservationStockRepository;
    private readonly _eventPublisher: EventPublisher;

    constructor(
        CreateReservationStockRepository: CreateReservationStockRepository,
        eventPublisher: EventPublisher
    ) {
        this._CreateReservationStockRepository = CreateReservationStockRepository;
        this._eventPublisher = eventPublisher;
    }

    public async handler(command: CreateReservationStockCommand): Promise<void> {
        try {
            // create reservation stock according the business logic
            const reservationStockProps = command.props
            const reservationStock = ReservationStock.create(reservationStockProps);

            // persist the reservation stock on DB
            await this._CreateReservationStockRepository.run(reservationStock);

            // publish domain events
            const domainEvents = reservationStock.pullDomainEvents();
            await this._eventPublisher.publishAll(domainEvents);

        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("CreateReservationStockCommandHandler - Error:", message);
            throw new Error("CreateReservationStockCommandHandler - something went wrong");
        }
    }
}
