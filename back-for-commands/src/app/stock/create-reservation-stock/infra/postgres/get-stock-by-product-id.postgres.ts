import { GetStockByProductIdRepository } from "@/app/stock/create-reservation-stock/domain/repository/get-stock-by-product-id.repository";

export class GetStockByProductIdPostgres
    implements GetStockByProductIdRepository {
    constructor() { }

    public async findById(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
}
