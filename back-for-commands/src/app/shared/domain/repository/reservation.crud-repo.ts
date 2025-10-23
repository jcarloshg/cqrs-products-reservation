import { CrudRepository } from "./crud.repository";

export interface ReservationDataFromDB {
    uuid: string;
    user_uuid: string;
    product_id: string;
    quantity: number;
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
    expires_at: Date;
}
export class ReservationCrudRepo implements CrudRepository<ReservationDataFromDB> {

    constructor() { }

    async create(item: ReservationDataFromDB): Promise<ReservationDataFromDB | null> {
        throw new Error("create - Method not implemented.");
    }

    async findAll(): Promise<ReservationDataFromDB[]> {
        throw new Error("findAll - Method not implemented.");
    }

    async findById(id: string): Promise<ReservationDataFromDB | null> {
        throw new Error("findById - Method not implemented.");
    }

    async findByFields(fields: Partial<ReservationDataFromDB>): Promise<ReservationDataFromDB | null> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, item: Partial<ReservationDataFromDB>): Promise<ReservationDataFromDB | null> {
        throw new Error("update - Method not implemented.");
    }

    async softDelete(id: string): Promise<boolean> {
        throw new Error("softDelete - Method not implemented.");
    }

    async destroy(id: string): Promise<boolean> {
        throw new Error("destroy - Method not implemented.");
    }
}
