import { ReservationStock, ReservationStockProps } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";
import { CreateReservationStockRepository } from "@/app/stock/create-reservation-stock/domain/repository/create-reservation-stock.repository";
import { OpenFilesInMemory } from '@/app/shared/infrastructure/in-memory/open-files.in-memory';

export class CreateReservationStockInMemory
    implements CreateReservationStockRepository {

    private readonly _openFilesInMemory: OpenFilesInMemory;

    constructor(openFilesInMemory: OpenFilesInMemory) {
        this._openFilesInMemory = openFilesInMemory;
    }

    public async run(entity: ReservationStock): Promise<ReservationStock> {
        try {
            const products = await this._openFilesInMemory.getReservationStock();
            products.push(entity.props);
            await this._openFilesInMemory.saveReservationStock(products);
            return entity;
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error("CreateReservationStockInMemory - Error:", message);
            throw new Error("CreateReservationStockInMemory - something went wrong");
        }
    }
}
