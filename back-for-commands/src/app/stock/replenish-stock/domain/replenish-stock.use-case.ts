import { StockCrudRepo } from "@/app/shared/domain/repository/stock.crud-repo";
import { ReplenishStockCommand } from "./commands/replenish-stock.command";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { StockAggregateRoot } from "./entity/stock.aggregate-root";
import { StackEntityProps } from "./entity/stock.entity";
import { EventPublisher } from "@/app/shared/domain/domain-events/event-publisher";

export class ReplenishStockUseCase {

    private readonly stockRepository: StockCrudRepo;
    private stockAggregateRoot: StockAggregateRoot;
    private readonly _eventPublisher: EventPublisher;

    constructor(
        stockRepository: StockCrudRepo,
        eventPublisher: EventPublisher
    ) {
        this.stockRepository = stockRepository;
        this._eventPublisher = eventPublisher;
        this.stockAggregateRoot = new StockAggregateRoot();
    }

    public async run(
        command: ReplenishStockCommand
    ): Promise<CustomResponse<ReplenishStockUseCaseResponse | undefined>> {

        try {

            // 1. System validates product exists
            const stock = await this.stockRepository.findByFields({
                product_uuid: command.getProductUuid(),
            });
            if (!stock) {
                const response = CustomResponse.notFound("Stock record not found for product.");
                return response
            }
            this.stockAggregateRoot.createFromRepository(stock);

            // 2. System validates quantity is positive
            const quantityToAdd = command.getQuantity();
            if (quantityToAdd <= 0) {
                const response = CustomResponse
                    .badRequest("Replenish quantity must be greater than zero.");
                return response;
            }

            // 3. System updates stock quantities (total and available)
            this.stockAggregateRoot.updateStockQuantity(quantityToAdd);

            // 4. System publishes StockReplenishedEvent
            const domainEvents = this.stockAggregateRoot.pullDomainEvents();
            console.log(`domainEvents: `, domainEvents);
            await this._eventPublisher.publishAll(domainEvents);

            // 5. System updates read models
            const resp = await this.stockRepository.update(
                stock.uuid,
                { available_quantity: stock.available_quantity }
            );
            if (!resp) {
                const response = CustomResponse.internalServerError();
                return response;
            }

            // 6. System returns success confirmation
            return CustomResponse.ok(
                {
                    stockUpdated: this.stockAggregateRoot.entityProps(),
                },
                "Stock replenished successfully."
            );

        } catch (error) {
            const messageError = (error instanceof Error) ? error.message : 'Unknown error';
            console.error(messageError);
            return CustomResponse.internalServerError();
        }

    }
}

export interface ReplenishStockUseCaseResponse {
    stockUpdated: StackEntityProps | null;
}