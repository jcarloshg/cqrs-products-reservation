import z from "zod";
import {
    ReservationStatus,
    ReservationStatusArray,
} from "@/app/shared/domain/model/ReservationStatus";
import {
    EntityDomain,
    EntityProps,
    EntityPropsRawData,
} from "@/app/shared/domain/model/entity";
import { OwnZodError } from "@/app/shared/domain/errors/zod.error";
import { ReservationSetAsConfirmedDomainEvent } from "../domain-events/reservation-set-as-confirmed.domain-event";
import { AggregateRoot } from "@/app/shared/domain/domain-events/aggregate-root";

export class ReservationStockEntity implements EntityDomain<ReservationStockProps> {

    private readonly _entityProps: EntityProps<ReservationStockProps>;

    constructor(props: EntityPropsRawData) {
        this._entityProps = new EntityProps<ReservationStockProps>(
            props,
            ReservationStockEntity.parse
        );
    }

    getProps(): Readonly<ReservationStockProps> {
        return this._entityProps.getCopy();
    }

    getAggregateRoot(): AggregateRoot {
        return this._entityProps.getAggregateRoot();
    }

    public static parse<ReservationStockProps>(
        data: EntityPropsRawData
    ): ReservationStockProps {
        const parsed = ReservationStockSchema.safeParse(data);
        if (parsed.success === false)
            throw new OwnZodError("ReservationStock", parsed.error);
        return parsed.data as ReservationStockProps;
    }

    public updateToConfirmedStatus(): void {
        // ─────────────────────────────────────
        // 1. Business rules
        // ─────────────────────────────────────
        const dataToBusinessRules = this.getProps();

        // Validate current status
        if (dataToBusinessRules.status === ReservationStatus.CONFIRMED) {
            throw new Error("Reservation is already confirmed.");
            return;
        }

        // Validate expiration
        const isExpired = dataToBusinessRules.expiresAt.getTime() < Date.now();
        if (isExpired) {
            throw new Error("Cannot confirm an expired reservation.");
        }

        // Update status
        this._entityProps.update({ status: ReservationStatus.CONFIRMED });

        // ─────────────────────────────────────
        // 2. Manage domain events
        // ─────────────────────────────────────
        const dataToDomainEvents = this.getProps();
        const domainEvent = new ReservationSetAsConfirmedDomainEvent(
            dataToDomainEvents
        );
        this.getAggregateRoot().recordDomainEvent(domainEvent);
    }
}

const ReservationStockSchema = z.object({
    uuid: z.uuid(),
    ownerUuid: z.uuid(),
    productId: z.uuid(),
    quantity: z.number().min(1),
    status: z.enum(ReservationStatusArray),
    expiresAt: z.date(),
});
export type ReservationStockProps = z.infer<typeof ReservationStockSchema>;
