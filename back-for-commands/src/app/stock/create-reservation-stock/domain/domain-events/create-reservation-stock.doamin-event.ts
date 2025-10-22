import { DomainEvent } from "@/app/shared/domain/domain-events/domain-event";
import { ReservationStockProps } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";

export class CreateReservationStockDomainEvent extends DomainEvent {

    public static readonly eventName: string = "RESERVATION-STOCK.CREATED";

    public readonly props: ReservationStockProps;

    constructor(props: ReservationStockProps) {
        super(props.uuid);
        this.props = props;
    }
}
