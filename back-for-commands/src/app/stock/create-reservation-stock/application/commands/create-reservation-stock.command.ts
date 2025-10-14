import { Command } from "@/app/shared/domain/domain-events/command";
import { ReservationStockProps } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";

export class CreateReservationStockCommand implements Command {

    private readonly _props: ReservationStockProps;

    constructor(props: ReservationStockProps) {
        this._props = props;
    }

    public get props(): ReservationStockProps {
        return this._props;
    }

}