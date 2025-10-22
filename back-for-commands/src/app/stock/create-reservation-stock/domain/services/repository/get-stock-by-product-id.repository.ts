import { ReadByIdRepository } from "@/app/shared/domain/repository/crud/read-by-id.repository";
import { Stock } from "@/app/stock/create-reservation-stock/domain/entities/stock.entity";

export class GetStockByProductIdRepository implements ReadByIdRepository<string, Stock> {

    constructor() { }

    async findById(id: string): Promise<Stock | null> {
        throw new Error("Method not implemented.");
    }
}