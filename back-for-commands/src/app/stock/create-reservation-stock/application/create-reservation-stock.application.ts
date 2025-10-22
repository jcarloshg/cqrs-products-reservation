// domain
import { CreateReservationStockCommandHandler } from "@/app/stock/create-reservation-stock/domain/commands/create-reservation-stock.command-handler";
// infra
import { CreateReservationStockPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/create-reservation-stock.postgres";
import { UpdateReservedStockPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/update-reserved-stock.postgres";
import { GetStockByProductIdPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/get-stock-by-product-id.postgres";
import { GetUserByUuidPostgress } from "@/app/stock/create-reservation-stock/infra/postgres/get-user-by-uuid.postgres";
import { SendEmailInMemory } from "@/app/stock/create-reservation-stock/infra/in-memory/send-email.in-memory";
// application
import { CreateReservationStockRequest, CreateReservationStockUseCase } from "@/app/stock/create-reservation-stock/domain/create-reservation-stock.use-case";
import { NotifyReservationOwnerEventHandler } from "@/app/stock/create-reservation-stock/domain/domain-events/handlers/notify-reservation-owner.event-handler";
import { NotifyStockUpdatedEventHandler } from "@/app/stock/create-reservation-stock/domain/domain-events/handlers/notify-stock-updated.event-hanlder";
import { NotifyStoreEventHandler } from "@/app/stock/create-reservation-stock/domain/domain-events/handlers/notify-store.event-handler";
// shared - domain
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { EventPublisherOwn } from "@/app/shared/infrastructure/domain-events/own-domain-events/event-publisher.own";
import { CommandHandlers } from "@/app/shared/domain/domain-events/command-handlers";
import { CommandBus } from "@/app/shared/domain/domain-events/command-bus";
// shared - infrastructure
import { EventBusOwn } from "@/app/shared/infrastructure/domain-events/own-domain-events/event-bus.own";


export type RequestProps = {
    body: { [key: string]: any };
};

export class CreateReservationStockApplication {
    constructor() { }

    public async run(requestProps: RequestProps): Promise<CustomResponse<any>> {
        // ─────────────────────────────────────
        // init services
        // ─────────────────────────────────────

        // repositories
        const createReservationStockRepository = new CreateReservationStockPostgres();
        const getStockByProductIdRepository = new GetStockByProductIdPostgres();
        const updateReservedStockRepository = new UpdateReservedStockPostgres();
        const getUserByUuidRepository = new GetUserByUuidPostgress();

        // services
        const sendEmailService = new SendEmailInMemory();

        // ─────────────────────────────────────
        // event handlers
        // ─────────────────────────────────────
        const eventBusOwn = new EventBusOwn();
        const eventPublisherOwn = new EventPublisherOwn(eventBusOwn);

        const notifyReservationOwnerEventHandler = new NotifyReservationOwnerEventHandler(
            sendEmailService,
            getUserByUuidRepository,
        );
        eventBusOwn.subscribe(
            notifyReservationOwnerEventHandler.subscribeTo(),
            notifyReservationOwnerEventHandler
        );

        const notifyStockUpdatedEventHandler = new NotifyStockUpdatedEventHandler();
        eventBusOwn.subscribe(
            notifyStockUpdatedEventHandler.subscribeTo(),
            notifyStockUpdatedEventHandler
        );

        const notifyStoreEventHandler = new NotifyStoreEventHandler();
        eventBusOwn.subscribe(
            notifyStoreEventHandler.subscribeTo(),
            notifyStoreEventHandler
        );

        // ─────────────────────────────────────
        // command handlers
        // ─────────────────────────────────────

        const commandHandlers = new CommandHandlers();
        const commandBus = new CommandBus(commandHandlers);

        const createReservationStockCommandHandler = new CreateReservationStockCommandHandler(
            createReservationStockRepository,
            getStockByProductIdRepository,
            updateReservedStockRepository,
            eventPublisherOwn
        );

        commandHandlers.register(
            createReservationStockCommandHandler.subscribeTo(),
            createReservationStockCommandHandler
        )

        // ─────────────────────────────────────
        // use case
        // ─────────────────────────────────────
        const createReservationStockUseCase = new CreateReservationStockUseCase(
            commandBus
        );

        const createReservationStockRequest: CreateReservationStockRequest = {
            data: requestProps.body,
        };
        const createReservationStockResponse = await createReservationStockUseCase
            .execute(createReservationStockRequest);

        return createReservationStockResponse;
    }
}
