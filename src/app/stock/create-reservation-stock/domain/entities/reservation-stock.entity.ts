import z from "zod";
import { AggregateRoot } from "@/app/shared/domain/domain-events/aggregate-root";
import { CreateReservationStockDomainEvent } from "../create-reservation-stock.doamin-event";
import { ModelError } from "@/app/shared/domain/errors/models.error";

export enum ReservationStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED",
}

const ProductToCreateScheme = z.object({
    uuid: z.uuid(),
    ownerUuid: z.uuid(),
    productId: z.uuid(),
    quantity: z.number().min(1),
    status: z.enum([
        ReservationStatus.PENDING,
        ReservationStatus.CONFIRMED,
        ReservationStatus.CANCELLED,
        ReservationStatus.EXPIRED,
    ]),
    expiresAt: z.date().min(new Date()),
});
export type ReservationStockProps = z.infer<typeof ProductToCreateScheme>;

export class ReservationStock extends AggregateRoot {
    private readonly reservationStockProps: ReservationStockProps;

    constructor(props: ReservationStockProps) {
        super();
        this.reservationStockProps = props;
    }

    public get props(): ReservationStockProps {
        return this.reservationStockProps;
    }

    public static create(props: ReservationStockProps): ReservationStock {
        const reservationStock = new ReservationStock(props);
        const domainEvent = new CreateReservationStockDomainEvent(props);
        reservationStock.record(domainEvent);
        return reservationStock;
    }

    public static parse(data: { [key: string]: any }): ReservationStockProps {
        const parsed = ProductToCreateScheme.safeParse(data);
        if (parsed.success === false) throw new ModelError("Product", parsed.error);
        return parsed.data;
    }
}
