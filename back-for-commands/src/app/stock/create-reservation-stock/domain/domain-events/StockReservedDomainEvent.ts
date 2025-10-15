import { DomainEvent } from "@/app/shared/domain/domain-events/domain-event";
import { ReservationStockProps } from "../entities/reservation-stock.entity";
import { StockProps } from "../entities/stock-domain.entity";

export class StockReservedDomainEvent extends DomainEvent {
    public readonly eventName = "stock.reserved";

    public readonly stock: StockProps;
    public readonly reservationStock: ReservationStockProps;

    constructor(data: StockProps, reservationStock: ReservationStockProps) {
        super();
        this.stock = data;
        this.reservationStock = reservationStock;
    }
}
