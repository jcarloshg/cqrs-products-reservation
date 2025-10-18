import { DomainEvent } from "@/app/shared/domain/domain-events/domain-event";
import { ReservationStockProps } from "../enties/reservation-stock.entity";

export class ReservationSetAsConfirmedDomainEvent extends DomainEvent {

    public readonly eventName: string = "RESERVATION.CONFIRMED";
    public readonly reservationConfirmed: ReservationStockProps;

    constructor(props: ReservationStockProps) {
        super();
        this.reservationConfirmed = props;
    }
}
