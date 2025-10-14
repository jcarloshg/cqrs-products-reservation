import { ReadByIdRepository } from "@/app/shared/domain/repository/crud/read-by-id.repository";

export class GetStockByProductIdRepository implements ReadByIdRepository<string, any> {

    constructor() { }

    async findById(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
}