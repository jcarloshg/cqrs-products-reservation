import {
    CommandHandler,
    CommandHandlerResp,
} from "@/app/shared/domain/domain-events/command-handler";
import { ConfirmReservationCommand } from "./confirm-reservation.command";
import { CrudRepository } from "@/app/shared/domain/repository/crud.repository";
import { ReservationAttributes } from "@/app/shared/infrastructure/repository/postgres/models.sequelize";
import { ReservationStockEntity, ReservationStockProps } from "../enties/reservation-stock.entity";
import { EventPublisher } from "@/app/shared/domain/domain-events/event-publisher";
import { ReservationStatus } from "@/app/shared/domain/model/ReservationStatus";

export class ConfirmReservationCommandHandler
    implements CommandHandler<ConfirmReservationCommand> {

    private readonly _eventPublisher: EventPublisher;
    private readonly _repository: CrudRepository<ReservationAttributes>;

    constructor(
        repository: CrudRepository<ReservationAttributes>,
        eventPublisher: EventPublisher
    ) {
        this._repository = repository;
        this._eventPublisher = eventPublisher;
    }

    public async handler(command: ConfirmReservationCommand): Promise<CommandHandlerResp> {
        try {
            // 1. search reservation by uuid and productId
            const reservationRaw = await this._repository.findById(command.data.uuid);
            if (!reservationRaw) {
                return {
                    code: 404,
                    message: "Reservation not found.",
                    data: undefined,
                };
            }

            // 2. call updateToConfirmedStatus method
            const reservationStockProps: ReservationStockProps = {
                uuid: reservationRaw.uuid,
                quantity: reservationRaw.quantity,
                expiresAt: reservationRaw.expires_at,
                status: reservationRaw.status as ReservationStatus,
                productId: reservationRaw.product_id,
                ownerUuid: reservationRaw.user_uuid,
            }
            const reservationStockEntity = new ReservationStockEntity(reservationStockProps);
            reservationStockEntity.updateToConfirmedStatus();

            // 3. save changes in repository
            const updatedReservation = reservationStockEntity.getProps();
            await this._repository.update(updatedReservation.uuid, {
                status: updatedReservation.status,
            });

            // 4. emit by domain events
            const domainEvents = reservationStockEntity
                .getAggregateRoot()
                .pullDomainEvents();
            await this._eventPublisher.publishAll(domainEvents);

            return {
                code: 200,
                message: "Reservation confirmed successfully.",
                data: updatedReservation,
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.log(`Error confirming reservation: `, errorMessage);
            return {
                code: 500,
                message: `Error confirming reservation.`,
                data: undefined,
            };
        }

    }
}
