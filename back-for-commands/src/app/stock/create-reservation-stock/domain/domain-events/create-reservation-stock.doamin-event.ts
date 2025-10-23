import z from "zod";

import { DomainEvent } from "@/app/shared/domain/domain-events/domain-event";
import { ReservationStatus } from "@/app/shared/domain/model/ReservationStatus";

const DomainEventPropsSchema = z.object({
    uuid: z.uuid(),
    ownerUuid: z.uuid(),
    productId: z.uuid(),
    quantity: z.number().min(1),
    status: z.enum([ReservationStatus.PENDING]),
    expiresAt: z.date().min(new Date()),
});
export type DomainEventProps = z.infer<typeof DomainEventPropsSchema>;

export class CreateReservationStockDomainEvent extends DomainEvent {

    public static readonly eventName: string = "RESERVATION-STOCK.CREATED";

    public readonly props: DomainEventProps;

    constructor(props: DomainEventProps) {
        const validatedProps = DomainEventPropsSchema.parse(props);
        super(validatedProps.uuid);
        this.props = validatedProps;
    }
}
