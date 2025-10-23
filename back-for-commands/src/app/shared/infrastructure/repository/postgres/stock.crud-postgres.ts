import { StockCrudRepo, StockDataFromDB } from "@/app/shared/domain/repository/stock.crud-repo";
import { StockForDB } from "./models.sequelize";

export class StockCrudPostgres implements StockCrudRepo {

    constructor() { }

    async create(item: StockDataFromDB): Promise<StockDataFromDB | null> {
        try {
            const created = await StockForDB.create(item);
            return created?.dataValues as StockDataFromDB;
        } catch (error) {
            return null;
        }
    }

    async findAll(): Promise<StockDataFromDB[]> {
        try {
            const results = await StockForDB.findAll();
            return results.map((r: any) => r.dataValues as StockDataFromDB);
        } catch (error) {
            return [];
        }
    }

    async findById(id: string): Promise<StockDataFromDB | null> {
        try {
            const found = await StockForDB.findByPk(id);
            return found ? (found.dataValues as StockDataFromDB) : null;
        } catch (error) {
            return null;
        }
    }

    async update(id: string, item: Partial<StockDataFromDB>): Promise<StockDataFromDB | null> {
        try {
            const found = await StockForDB.findByPk(id);
            if (!found) return null;
            const updated = await found.update(item);
            return updated.dataValues as StockDataFromDB;
        } catch (error) {
            return null;
        }
    }

    async softDelete(id: string): Promise<boolean> {
        throw new Error("softDelete - Method not implemented yet.");
    }

    async destroy(id: string): Promise<boolean> {
        try {
            const deleted = await StockForDB.destroy({ where: { uuid: id } });
            return deleted > 0;
        } catch (error) {
            return false;
        }
    }
}