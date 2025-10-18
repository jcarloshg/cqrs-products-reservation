import { CrudRepository } from "@/app/shared/domain/repository/crud.repository";
import { ReservationAttributes } from "@/app/shared/infrastructure/repository/postgres/models.sequelize";

export class ReservationStockRepositoryMoc
    implements CrudRepository<ReservationAttributes> {
    constructor() { }

    async create(data: ReservationAttributes): Promise<ReservationAttributes> {
        return data;
    }

    async findAll(): Promise<ReservationAttributes[]> {
        return [
            {
                uuid: crypto.randomUUID(),
                expires_at: new Date(),
                quantity: 5,
                status: "PENDING",
                product_id: crypto.randomUUID(),
                user_uuid: crypto.randomUUID(),
            },
            {
                uuid: crypto.randomUUID(),
                expires_at: new Date(),
                quantity: 5,
                status: "PENDING",
                product_id: crypto.randomUUID(),
                user_uuid: crypto.randomUUID(),
            },
        ];
    }

    async findById(id: string): Promise<ReservationAttributes | null> {
        return {
            uuid: id,
            expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // add 3 days
            quantity: 5,
            status: "PENDING",
            product_id: crypto.randomUUID(),
            user_uuid: crypto.randomUUID(),
        };
    }

    async update(
        id: string,
        item: Partial<ReservationAttributes>
    ): Promise<ReservationAttributes | null> {
        const updatedReservation: ReservationAttributes = {
            uuid: id,
            expires_at: item.expires_at || new Date(),
            quantity: item.quantity || 5,
            status: item.status || "PENDING",
            product_id: item.product_id || crypto.randomUUID(),
            user_uuid: item.user_uuid || crypto.randomUUID(),
        };
        return {
            ...updatedReservation,
            ...item,
        };
    }

    async softDelete(id: string): Promise<boolean> {
        return true;
    }

    async destroy(id: string): Promise<boolean> {
        return true;
    }
}
