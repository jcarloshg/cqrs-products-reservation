import { CreateRepository } from "@/app/shared/domain/repository/crud/create.repository";
import { ReservationStock } from "../entities/reservation-stock.entity";

export class CreateReservationStockRepository
    implements CreateRepository<ReservationStock> {

    constructor() { }

    public run(entity: ReservationStock): Promise<ReservationStock> {
        throw new Error("Method not implemented.");
    }
}
