import { CrudRepository } from "@/app/shared/domain/repository/crud.repository";
import { ReservationAttributes, ReservationForDB } from "./models.sequelize";

export class ReservationStockRepository implements CrudRepository<ReservationAttributes> {
    constructor() { }

    async create(data: ReservationAttributes): Promise<ReservationAttributes> {
        const reservationCreated = await ReservationForDB.create(data);
        const reservationAttributes = reservationCreated.get({ clone: true });
        return reservationAttributes;
    }

    async findAll(): Promise<ReservationAttributes[]> {
        const reservations = await ReservationForDB.findAll();
        return reservations.map((reservation) => reservation.get({ clone: true }));
    }

    async findById(id: string): Promise<ReservationAttributes | null> {
        const reservation = await ReservationForDB.findByPk(id);
        return reservation ? reservation.get({ clone: true }) : null;
    }

    async update(
        id: string,
        item: Partial<ReservationAttributes>
    ): Promise<ReservationAttributes | null> {
        const reservation = await ReservationForDB.findByPk(id);
        if (!reservation) return null;
        await reservation.update(item);
        return reservation.get({ clone: true });
    }

    async softDelete(id: string): Promise<boolean> {
        const reservation = await ReservationForDB.findByPk(id);
        if (!reservation) return false;
        return true;
    }

    async destroy(id: string): Promise<boolean> {
        const reservation = await ReservationForDB.findByPk(id);
        if (!reservation) return false;
        await reservation.destroy();
        return true;
    }
}
