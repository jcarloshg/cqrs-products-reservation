import {
    CommandHandler,
    CommandHandlerResp,
} from "@/app/shared/domain/domain-events/command-handler";
import { ConfirmReservationCommand } from "./confirm-reservation.command";
import { CrudRepository } from "@/app/shared/domain/repository/crud.repository";
import { ReservationAttributes } from "@/app/shared/infrastructure/repository/postgres/models.sequelize";
import {
    ReservationStockEntity,
    ReservationStockProps,
} from "../enties/reservation-stock.entity";
import { EventPublisher } from "@/app/shared/domain/domain-events/event-publisher";
import { ReservationStatus } from "@/app/shared/domain/model/ReservationStatus";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { DomainError } from "@/app/shared/domain/errors/domain.error";
import { OwnZodError } from "@/app/shared/domain/errors/zod.error";

export class ConfirmReservationCommandHandler implements CommandHandler<ConfirmReservationCommand> {
    private readonly _eventPublisher: EventPublisher;
    private readonly _repository: CrudRepository<ReservationAttributes>;

    constructor(
        repository: CrudRepository<ReservationAttributes>,
        eventPublisher: EventPublisher
    ) {
        this._repository = repository;
        this._eventPublisher = eventPublisher;
    }

    public subscribeTo(): string {
        return ConfirmReservationCommand.COMMAND_NAME;
    }

    public async handler(
        command: ConfirmReservationCommand
    ): Promise<CommandHandlerResp> {
        try {
            // 1. search reservation by uuid and productId
            const reservationRaw = await this._repository.findById(command.data.uuid);
            if (!reservationRaw) {
                return CustomResponse.notFound(
                    "Reservation not found."
                ).toCommandHandlerResp();
            }

            // 2. call updateToConfirmedStatus method
            const reservationStockProps: ReservationStockProps = {
                uuid: reservationRaw.uuid,
                quantity: reservationRaw.quantity,
                expiresAt: reservationRaw.expires_at,
                status: reservationRaw.status as ReservationStatus,
                productId: reservationRaw.product_id,
                ownerUuid: reservationRaw.user_uuid,
            };
            const reservationStockEntity = new ReservationStockEntity(
                reservationStockProps
            );
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

            return CustomResponse.ok(
                updatedReservation,
                "Reservation confirmed successfully."
            ).toCommandHandlerResp();
        } catch (error) {
            if (error instanceof DomainError)
                return error.toCustomResponse().toCommandHandlerResp();

            if (error instanceof OwnZodError)
                return error.toCustomResponse().toCommandHandlerResp();

            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.error("ConfirmReservationCommandHandler:", errorMessage);
            return CustomResponse.internalServerError().toCommandHandlerResp();
        }
    }
}
