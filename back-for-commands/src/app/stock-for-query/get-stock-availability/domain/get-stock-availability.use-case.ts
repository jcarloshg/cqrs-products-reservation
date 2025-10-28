import { EventPublisher } from "@/app/shared/domain/domain-events/event-publisher";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { StockCrudRepo } from "@/app/shared/domain/repository/stock.crud-repo";
import { StockAggregateRoot } from "./entity/stock.aggregate-root";
import { StackEntityProps } from "./entity/stock.entity";
import { GetStockAvailabilityCommand } from "./command/get-stock-availability.command";

export class GetStockAvailabilityUseCase {

    private readonly stockRepository: StockCrudRepo;
    private stockAggregateRoot: StockAggregateRoot;

    constructor(stockRepository: StockCrudRepo) {
        this.stockRepository = stockRepository;
        this.stockAggregateRoot = new StockAggregateRoot();
    }

    public async run(
        command: GetStockAvailabilityCommand
    ): Promise<CustomResponse<GetStockAvailabilityResponse | undefined>> {
        try {

            // 1. System queries stock read model by product ID
            const stock = await this.stockRepository.findByFields({
                product_uuid: command.getProductUuid(),
            });
            if (!stock) {
                const response = CustomResponse.notFound("Stock record not found for product.");
                return response
            }
            this.stockAggregateRoot.createFromRepository(stock);

            // 2. System returns stock availability information
            // 3. No side effects or state changes
            const stockCopy = this.stockAggregateRoot.entityProps();
            const response = CustomResponse.ok(
                {
                    stock: stockCopy
                },
                "Stock availability retrieved successfully."
            );
            return response;

        } catch (error) {
            const messageError = (error instanceof Error) ? error.message : 'Unknown error';
            console.error(messageError);
            return CustomResponse.internalServerError();
        }
    }
}

export interface GetStockAvailabilityResponse {
    stock: StackEntityProps;
}