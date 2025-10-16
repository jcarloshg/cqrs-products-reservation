import { UpdateRepository } from "@/app/shared/domain/repository/crud/update.repository";
import { StockProps } from "@/app/stock/create-reservation-stock/domain/entities/stock.entity";

export interface UpdateStockProps {
    id: string;
    quantity: number;
}

export class UpdateReservedStockRepository
    implements UpdateRepository<string, UpdateStockProps, StockProps> {
    public async run(
        id: string,
        entity: UpdateStockProps
    ): Promise<StockProps | null> {
        throw new Error("Method not implemented.");
    }
}
