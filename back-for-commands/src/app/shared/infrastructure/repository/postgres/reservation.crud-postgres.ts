import { ReservationCrudRepo, ReservationDataFromDB } from "@/app/shared/domain/repository/reservation.crud-repo";
import { ReservationForDB } from "./models.sequelize";

export class ReservationCrudPostgres implements ReservationCrudRepo {
    constructor() { }

    async create(
        item: ReservationDataFromDB
    ): Promise<ReservationDataFromDB | null> {
        try {
            const created = await ReservationForDB.create(item);
            return created?.dataValues as ReservationDataFromDB;
        } catch (error) {
            return null;
        }
    }
    async findAll(): Promise<ReservationDataFromDB[]> {
        try {
            const results = await ReservationForDB.findAll();
            return results.map((r) => r.dataValues as ReservationDataFromDB);
        } catch (error) {
            return [];
        }
    }
    async findById(id: string): Promise<ReservationDataFromDB | null> {
        try {
            const found = await ReservationForDB.findByPk(id);
            return found ? (found.dataValues as ReservationDataFromDB) : null;
        } catch (error) {
            return null;
        }
    }
    async findByFields(fields: Partial<ReservationDataFromDB>): Promise<ReservationDataFromDB | null> {
        try {
            const found = await ReservationForDB.findOne({ where: fields });
            return found ? (found.dataValues as ReservationDataFromDB) : null;
        } catch (error) {
            return null;
        }
    }
    async update(
        id: string,
        item: Partial<ReservationDataFromDB>
    ): Promise<ReservationDataFromDB | null> {
        try {
            const found = await ReservationForDB.findByPk(id);
            if (!found) return null;
            const updated = await found.update(item);
            return updated.dataValues as ReservationDataFromDB;
        } catch (error) {
            return null;
        }
    }
    async softDelete(id: string): Promise<boolean> {
        throw new Error("softDelete - Method not implemented yet.");
    }
    async destroy(id: string): Promise<boolean> {
        try {
            const deleted = await ReservationForDB.destroy({ where: { uuid: id } });
            return deleted > 0;
        } catch (error) {
            return false;
        }
    }
}