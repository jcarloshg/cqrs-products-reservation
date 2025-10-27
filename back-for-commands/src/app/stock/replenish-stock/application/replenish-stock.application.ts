import { EventBusOwn } from "@/app/shared/infrastructure/domain-events/own-domain-events/event-bus.own";
import { EventPublisherOwn } from "@/app/shared/infrastructure/domain-events/own-domain-events/event-publisher.own";
import { StockQuantityUpdatedEventHandler } from "../domain/domain-events/stock-quantity-updated.domain-event";
import { CreateFromRepositoryEventHandler } from "../domain/domain-events/create-from-repository.domain-event";
import { ReplenishStockCommand } from "../domain/commands/replenish-stock.command";
import { ReplenishStockUseCase } from "../domain/replenish-stock.use-case";
import { StockCrudPostgres } from "@/app/shared/infrastructure/repository/postgres/stock.crud-postgres";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { OwnZodError } from "@/app/shared/domain/errors/zod.error";


export type RequestProps = {
    body: { [key: string]: any };
};


export class ReplenishStockApplication {

    constructor() { }

    public async run(props: RequestProps): Promise<CustomResponse<any>> {
        try {


            // init command
            const replenishStockCommand = new ReplenishStockCommand(props.body);

            // ─────────────────────────────────────
            // init services
            // ─────────────────────────────────────

            // repositories
            const stockCrudPostgres = new StockCrudPostgres();

            // ─────────────────────────────────────
            // event handlers
            // ─────────────────────────────────────
            const eventBusOwn = new EventBusOwn();
            const eventPublisherOwn = new EventPublisherOwn(eventBusOwn);

            const stockQuantityUpdatedEventHandler = new StockQuantityUpdatedEventHandler()
            eventBusOwn.subscribe(
                stockQuantityUpdatedEventHandler.subscribeTo(),
                stockQuantityUpdatedEventHandler
            );

            const createFromRepositoryEventHandler = new CreateFromRepositoryEventHandler()
            eventBusOwn.subscribe(
                createFromRepositoryEventHandler.subscribeTo(),
                createFromRepositoryEventHandler
            );

            // ─────────────────────────────────────
            // use case
            // ─────────────────────────────────────

            const useCase = new ReplenishStockUseCase(
                stockCrudPostgres,
                eventPublisherOwn
            );
            const res = await useCase.run(replenishStockCommand);
            return res;


        } catch (error) {
            if (error instanceof OwnZodError) return error.toCustomResponse();
            return CustomResponse.internalServerError();
        }
    }
}