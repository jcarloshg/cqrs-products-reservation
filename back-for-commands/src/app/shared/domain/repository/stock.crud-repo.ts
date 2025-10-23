import { CrudRepository } from "./crud.repository";

export interface StockDataFromDB {
    uuid: string;
    product_uuid: string;
    available_quantity: number;
    reserved_quantity: number;
}

export class StockCrudRepo implements CrudRepository<StockDataFromDB> {
    constructor() { }
    // ─────────────────────────────────────
    // CREATE
    // ─────────────────────────────────────
    create(item: StockDataFromDB): Promise<StockDataFromDB | null> {
        throw new Error("Method not implemented.");
    }

    // ─────────────────────────────────────
    // READ
    // ─────────────────────────────────────
    findAll(): Promise<StockDataFromDB[]> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<StockDataFromDB | null> {
        throw new Error("Method not implemented.");
    }
    findByFields(fields: Partial<StockDataFromDB>): Promise<StockDataFromDB | null> {
        throw new Error("Method not implemented.");
    }
    // ─────────────────────────────────────
    // UPDATE
    // ─────────────────────────────────────

    update(id: string, item: Partial<StockDataFromDB>): Promise<StockDataFromDB | null> {
        throw new Error("Method not implemented.");
    }

    // ─────────────────────────────────────
    // DELETE
    // ─────────────────────────────────────
    softDelete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    destroy(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}