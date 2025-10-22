import { ReadByIdRepository } from "@/app/shared/domain/repository/crud/read-by-id.repository";
import { User } from "@/app/stock/create-reservation-stock/domain/entities/user.entity";

export class GetUserByUuidRepository implements ReadByIdRepository<string, User> {
    constructor() { }

    public async findById(id: string): Promise<User | null> {
        throw new Error("GetUserByUuidRepository - findById method not implemented.");
    }
}