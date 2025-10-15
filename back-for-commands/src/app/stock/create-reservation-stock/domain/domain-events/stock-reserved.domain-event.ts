import { DomainEvent } from "@/app/shared/domain/domain-events/domain-event";
import { StockProps } from "../entities/stock.entity";

export type StockReservationInfo = {
    reservationUuid: string;
    quantity: number;
};

export class StockReservedDomainEvent extends DomainEvent {
    public readonly eventName = "stock.reserved";

    public readonly stock: StockProps;
    public readonly reservationStock: StockReservationInfo;

    constructor(data: StockProps, reservationStock: StockReservationInfo) {
        super();
        this.stock = data;
        this.reservationStock = reservationStock;
    }
}
