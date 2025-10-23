import { z } from "zod";

import { DomainEvent } from "@/app/shared/domain/domain-events/domain-event";
import { StockProps } from "../entities/stock.entity";

const StockReservationInfoSchema = z.object({
    reservationUuid: z.uuid(),
    quantity: z.number().min(1),
});

export type StockReservationInfo = z.infer<typeof StockReservationInfoSchema>;

export class StockIncreaseReservationQuantityDomainEvent extends DomainEvent {

    public static readonly eventName: string = "STOCK.INCREASE_RESERVATION_QUANTITY";

    public readonly stock: StockProps;
    public readonly reservationStock: StockReservationInfo;

    constructor(data: StockProps, reservationStock: StockReservationInfo) {
        super();
        this.stock = data;
        this.reservationStock = StockReservationInfoSchema.parse(reservationStock);
    }
}
