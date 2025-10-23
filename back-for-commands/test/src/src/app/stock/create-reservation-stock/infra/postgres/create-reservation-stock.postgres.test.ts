import { ReservationStock } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";
import { CreateReservationStockPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/create-reservation-stock.postgres";

describe('create-reservation-stock.postgres.test', () => {
    test('should be defined', async () => {

        const reservationStock = new ReservationStock({
            uuid: crypto.randomUUID(),
            ownerUuid: "1ad8f354-d1f8-4957-8322-1cf7eeb5e0a9",
            productId: "af3017b8-5d39-44dd-b5f3-0de7b007ae5f",
            quantity: 10,
            status: "PENDING",
            expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 minutes from now
        })
        const createReservationStockPostgres = new CreateReservationStockPostgres();
        const res = await createReservationStockPostgres.run(reservationStock);
        expect(res).toBeDefined();

    });
})