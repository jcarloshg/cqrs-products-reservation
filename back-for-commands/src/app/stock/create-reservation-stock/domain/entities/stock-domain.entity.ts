import z from "zod";
import { EntityDomain, EntityProps } from "../../../../shared/domain/model/entity";
import { StockReservedDomainEvent } from "../domain-events/StockReservedDomainEvent";
import { ReservationStockProps } from "./reservation-stock.entity";
import { AggregateRoot } from "@/app/shared/domain/domain-events/aggregate-root";

const StockPropsSchema = z.object({
    uuid: z.uuid(),
    product_uuid: z.uuid(),
    available_quantity: z.number().int().nonnegative(),
    reserved_quantity: z.number().int().nonnegative(),
});
export type StockProps = z.infer<typeof StockPropsSchema>;

export class StockDomain implements EntityDomain<StockProps> {

    private readonly _entityProps: EntityProps<StockProps>;

    constructor(props: StockProps) {
        this._entityProps = new EntityProps<StockProps>(props, this._validData);
    }

    getProps(): Readonly<StockProps> {
        return this._entityProps.getCopy();
    }

    getAggregateRoot(): AggregateRoot {
        return this._entityProps.getAggregateRoot();
    }

    private _validData(props: StockProps): boolean {
        const parsed = StockPropsSchema.safeParse(props);
        if (parsed.success === false) throw new Error("Invalid stock data");
        return true;
    }

    public reserve(reservationStock: ReservationStockProps): void {
        // 1. System checks available stock
        const props = this.getProps();
        const available_quantity = props.available_quantity;
        const reserved_quantity = props.reserved_quantity;
        const availableQuantity = available_quantity - reserved_quantity;
        if (availableQuantity <= 0) throw new Error("No stock available");

        // 2. System checks if available stock is sufficient for the reservation
        const reservedQuantity = reservationStock.quantity;
        if (availableQuantity < reservedQuantity)
            throw new Error("Insufficient stock available");

        // 3. System updates reserved quantity
        const new_reserved_quantity = reserved_quantity + reservedQuantity;
        this._entityProps.update({
            reserved_quantity: new_reserved_quantity,
        });

        // 4. System records domain event
        const stockReservedDomainEvent = new StockReservedDomainEvent(
            this._entityProps.getCopy(),
            reservationStock
        );
        this.getAggregateRoot().recordDomainEvent(stockReservedDomainEvent);
    }
}
