import z from "zod";

import { AggregateRoot } from "@/app/shared/domain/domain-events/aggregate-root";
import { OwnZodError } from "@/app/shared/domain/errors/zod.error";
import {
    EntityDomain,
    EntityProps,
    EntityPropsRawData,
} from "@/app/shared/domain/model/entity";
import { CreateReservationStockDomainEvent } from "../domain-events/create-reservation-stock.doamin-event";
import { ReservationStatus } from "@/app/shared/domain/model/ReservationStatus";

const ProductToCreateScheme = z.object({
    uuid: z.uuid(),
    ownerUuid: z.uuid(),
    productId: z.uuid(),
    quantity: z.number().min(1),
    status: z.enum([ReservationStatus.PENDING]),
    expiresAt: z.date().min(new Date()),
});
export type ReservationStockProps = z.infer<typeof ProductToCreateScheme>;

export class ReservationStock implements EntityDomain<ReservationStockProps> {
    private readonly _entityProps: EntityProps<ReservationStockProps>;

    constructor(props: EntityPropsRawData) {
        this._entityProps = new EntityProps<ReservationStockProps>(
            props,
            ReservationStock.parse
        );
    }

    getProps(): Readonly<ReservationStockProps> {
        return this._entityProps.getCopy();
    }

    getAggregateRoot(): AggregateRoot {
        return this._entityProps.getAggregateRoot();
    }

    public static parse(data: EntityPropsRawData): ReservationStockProps {
        const parsed = ProductToCreateScheme.safeParse(data);
        if (parsed.success === false)
            throw new OwnZodError("ReservationStock", parsed.error);
        return parsed.data;
    }

    public createReservationStock(props: ReservationStockProps): void {
        // 1. Valid data
        ReservationStock.parse(props);
        // 2. Create domain event
        const domainEvent = new CreateReservationStockDomainEvent(props);
        const aggregateRoot = this.getAggregateRoot();
        aggregateRoot.recordDomainEvent(domainEvent);
    }
}
