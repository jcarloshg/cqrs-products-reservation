import z from "zod";
import { DomainEvent } from "@/app/shared/domain/domain-events/domain-event";
import { ReservationStock } from "./reservation-stock.entity";

export class CreateEntityDomain<T> extends DomainEvent {
    public readonly eventName = "entity.created";
    public readonly data: T;
    constructor(data: T) {
        super();
        this.data = data;
    }
}

export class AggregateRoot {
    private domainEvents: Array<DomainEvent>;

    constructor() {
        this.domainEvents = [];
    }

    pullDomainEvents(): Array<DomainEvent> {
        const domainEvents = this.domainEvents.slice();
        this.domainEvents = [];
        return domainEvents;
    }

    record(event: DomainEvent): void {
        this.domainEvents.push(event);
    }
}

export class EntityProps<T> extends AggregateRoot {
    public readonly props: T;

    constructor(props: T) {
        super();
        this._validData(props);
        this._create(props);
        this.props = props;
    }

    public get value(): Readonly<T> {
        // immutability
        return Object.freeze({ ...this.props });
    }

    private _create(props: T): EntityProps<T> {
        const domainEvent = new CreateEntityDomain<T>(props);
        this.record(domainEvent);
        return new EntityProps<T>(props);
    }

    private _validData(props: T): boolean {
        throw new Error("Method not implemented.");
    }
}

// ─────────────────────────────────────
// ─────────────────────────────────────
// Entity
// ─────────────────────────────────────
// ─────────────────────────────────────

const StockPropsSchema = z.object({
    uuid: z.uuid(),
    product_uuid: z.uuid(),
    available_quantity: z.number().int().nonnegative(),
    reserved_quantity: z.number().int().nonnegative(),
});
export type StockProps = z.infer<typeof StockPropsSchema>;

export class Stock extends EntityProps<StockProps> {
    constructor(props: StockProps) {
        super(props);
    }

    public reserve(quantity: number, reservationStock: ReservationStock): void {
        // 1. System checks available stock
        const available_quantity = this.props.available_quantity;
        const reserved_quantity = this.props.reserved_quantity;
        const availableQuantity = available_quantity - reserved_quantity;
        if (availableQuantity <= 0) throw new Error("No stock available");

        // 2. System checks if available stock is sufficient for the reservation
        const reservedQuantity = reservationStock.props.quantity;
        if (availableQuantity < reservedQuantity)
            throw new Error("Insufficient stock available");

        // 3. System updates reserved quantity
        this.props.reserved_quantity += reservedQuantity;

        // 4. System records domain event
        const domainEvent = new CreateEntityDomain<StockProps>(this.props);
        this.record(domainEvent);
    }
}
