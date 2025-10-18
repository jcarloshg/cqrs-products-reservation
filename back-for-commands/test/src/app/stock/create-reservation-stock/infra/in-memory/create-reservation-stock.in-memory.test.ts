import { OpenFilesInMemory } from "@/app/shared/infrastructure/repository/in-memory/open-files.in-memory";
import { ReservationStock, ReservationStockProps } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";
import { ReservationStatus } from "@/app/shared/domain/model/ReservationStatus";
import { CreateReservationStockInMemory } from "@/app/stock/create-reservation-stock/infra/in-memory/create-reservation-stock.in-memory";

describe('create-reservation-stock.in-memory.test', () => {
    it('should be defined', async () => {
        const openFilesInMemory = new OpenFilesInMemory();
        const createReservationStock = new CreateReservationStockInMemory(openFilesInMemory);
        const expiresAt = new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000);
        const reservationStockProps: ReservationStockProps = {
            uuid: crypto.randomUUID(),
            ownerUuid: crypto.randomUUID(),
            productId: crypto.randomUUID(),
            quantity: 3,
            status: ReservationStatus.PENDING,
            expiresAt: expiresAt,
        }
        const reservationStock = new ReservationStock(reservationStockProps);
        const result = await createReservationStock.run(reservationStock);

        expect(createReservationStock).toBeDefined();
        expect(result).toBeDefined();
    })
})