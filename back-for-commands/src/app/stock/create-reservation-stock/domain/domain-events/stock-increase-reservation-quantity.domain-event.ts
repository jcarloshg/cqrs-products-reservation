import { DomainEvent } from "@/app/shared/domain/domain-events/domain-event";
import { StockProps } from "../entities/stock.entity";

export type StockReservationInfo = {
    reservationUuid: string;
    quantity: number;
};

export class StockIncreaseReservationQuantityDomainEvent extends DomainEvent {

    public static readonly eventName: string = "STOCK.INCREASE_RESERVATION_QUANTITY";

    public readonly stock: StockProps;
    public readonly reservationStock: StockReservationInfo;

    constructor(data: StockProps, reservationStock: StockReservationInfo) {
        super();
        this.stock = data;
        this.reservationStock = reservationStock;
    }
}
