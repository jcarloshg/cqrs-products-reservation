import { DomainEvent } from "@/app/shared/domain/domain-events/domain-event";
import { ReservationStockProps } from "./entities/reservation-stock.entity";

export class CreateReservationStockDomainEvent extends DomainEvent {
    public eventName: string = "RESERVATION-STOCK.CREATED";
    private readonly _props: ReservationStockProps;

    constructor(props: ReservationStockProps) {
        super(props.uuid);
        this._props = props;
    }

    public get props(): ReservationStockProps {
        return this._props;
    }
}
