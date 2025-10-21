import z from "zod";

// import { StockReservedDomainEvent } from "../domain-events/StockReservedDomainEvent";
import { StockIncreaseReservationQuantityDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/stock-increase-reservation-quantity.domain-event";
import { AggregateRoot } from "@/app/shared/domain/domain-events/aggregate-root";
import {
    EntityDomain,
    EntityProps,
    EntityPropsRawData,
} from "@/app/shared/domain/model/entity";
import { DomainError } from "@/app/shared/domain/errors/domain.error";

const StockPropsSchema = z.object({
    uuid: z.uuid(),
    product_uuid: z.uuid(),
    available_quantity: z.number().int().nonnegative(),
    reserved_quantity: z.number().int().nonnegative(),
});
export type StockProps = z.infer<typeof StockPropsSchema>;

export class Stock implements EntityDomain<StockProps> {
    private readonly _entityProps: EntityProps<StockProps>;

    constructor(props: EntityPropsRawData) {
        this._entityProps = new EntityProps<StockProps>(props, this._validData);
    }

    getProps(): Readonly<StockProps> {
        return this._entityProps.getCopy();
    }

    getAggregateRoot(): AggregateRoot {
        return this._entityProps.getAggregateRoot();
    }

    private _validData(props: EntityPropsRawData): StockProps {
        const parsed = StockPropsSchema.safeParse(props);
        if (parsed.success === false) throw new Error("Invalid stock data");
        return parsed.data;
    }

    public reserve(reservationStock: StockReservationInfo): void {
        // ─────────────────────────────────────
        // 1. Business rules
        // ─────────────────────────────────────
        // System checks available stock
        const props = this.getProps();
        const available_quantity = props.available_quantity;
        const reserved_quantity = props.reserved_quantity;
        const availableQuantity = available_quantity - reserved_quantity;
        if (availableQuantity <= 0) throw new DomainError(
            "No stock available",
            {
                input: { stock: props, reservationStock },
                output: { availableQuantity }
            }
        );

        // System checks if available stock is sufficient for the reservation
        const reservedQuantity = reservationStock.quantity;
        if (availableQuantity < reservedQuantity) throw new DomainError(
            "Insufficient stock available for the reservation",
            {
                input: { stock: props, reservationStock },
                output: { availableQuantity, reservedQuantity }
            }
        );

        // System updates reserved quantity
        const new_reserved_quantity = reserved_quantity + reservedQuantity;
        this._entityProps.update({
            reserved_quantity: new_reserved_quantity,
        });

        // ─────────────────────────────────────
        // 2. Manage domain events
        // ─────────────────────────────────────
        const stockReservedDomainEvent = new StockIncreaseReservationQuantityDomainEvent(
            this._entityProps.getCopy(),
            reservationStock
        );
        this.getAggregateRoot().recordDomainEvent(stockReservedDomainEvent);
    }
}


export interface StockReservationInfo {
    reservationUuid: string;
    quantity: number;
}