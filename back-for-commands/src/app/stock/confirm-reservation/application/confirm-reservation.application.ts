import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { ConfirmReservationRequest, ConfirmReservationUseCase } from "../domain/confirm-reservation.use-case";
import { CommandHandlers } from "@/app/shared/domain/domain-events/command-handlers";
import { CommandBus } from "@/app/shared/domain/domain-events/command-bus";
import { ConfirmReservationCommandHandler } from "../domain/commands/confirm-reservation.command-handler";
import { ReservationCrudPostgres } from "@/app/shared/infrastructure/repository/postgres/reservation.crud-postgres";
import { EventBusOwn } from "@/app/shared/infrastructure/domain-events/own-domain-events/event-bus.own";
import { EventPublisherOwn } from "@/app/shared/infrastructure/domain-events/own-domain-events/event-publisher.own";
import { NotifyToOwnerReservationSetAsConfirmedEventHandler } from "../domain/domain-events/reservation-set-as-confirmed.event-hanler";

export type RequestProps = {
    body: { [key: string]: any };
};

export class ConfirmReservationApplication {

    constructor() { }

    public async run(requestProps: RequestProps): Promise<CustomResponse<any>> {

        // ─────────────────────────────────────
        // init services
        // ─────────────────────────────────────

        // repositories
        const reservationCrudPostgres = new ReservationCrudPostgres();


        // ─────────────────────────────────────
        // event handlers
        // ─────────────────────────────────────
        const eventBusOwn = new EventBusOwn();
        const eventPublisherOwn = new EventPublisherOwn(eventBusOwn);

        const notifyToOwnerReservationSetAsConfirmedEventHandler = new NotifyToOwnerReservationSetAsConfirmedEventHandler()
        eventBusOwn.subscribe(
            notifyToOwnerReservationSetAsConfirmedEventHandler.subscribeTo(),
            notifyToOwnerReservationSetAsConfirmedEventHandler
        );

        // ─────────────────────────────────────
        // command handlers
        // ─────────────────────────────────────

        const commandHandlers = new CommandHandlers();
        const commandBus = new CommandBus(commandHandlers);

        const confirmReservationCommandHandler = new ConfirmReservationCommandHandler(
            reservationCrudPostgres,
            eventPublisherOwn,
        )

        commandHandlers.register(
            confirmReservationCommandHandler.subscribeTo(),
            confirmReservationCommandHandler
        )

        // ─────────────────────────────────────
        // use case
        // ─────────────────────────────────────

        const useCase = new ConfirmReservationUseCase(commandBus);
        const req: ConfirmReservationRequest = {
            data: requestProps.body ?? {}
        }
        const resp = await useCase.execute(req);
        return resp;

    }
}