import { ReservationStock } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";
import { CreateReservationStockRepository } from "../../domain/repository/create-reservation-stock.repository";
import { Reservation } from "./models.sequelize";

export class CreateReservationStockPostgres
    implements CreateReservationStockRepository {
    constructor() { }

    public async run(entity: ReservationStock): Promise<ReservationStock | null> {
        try {
            const props = entity.getProps();
            const result = await Reservation.create({
                uuid: props.uuid,
                product_id: props.productId,
                quantity: props.quantity,
                status: props.status,
                user_uuid: props.ownerUuid,
                expires_at: props.expiresAt,
            });

            return result
                ? new ReservationStock({
                    uuid: result.uuid,
                    ownerUuid: result.user_uuid,
                    productId: result.product_id,
                    quantity: result.quantity,
                    status: result.status,
                    expiresAt: result.expires_at,
                })
                : null;
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            console.error("Error in CreateReservationStockPostgres:", errorMessage);
            return null;
        }
    }
}
