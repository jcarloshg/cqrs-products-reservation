import { EventHandler } from "@/app/shared/domain/domain-events/event-handler";
import { CreateReservationStockDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/create-reservation-stock.doamin-event";

export class NotifyReservationOwnerEventHandler
    implements EventHandler<CreateReservationStockDomainEvent> {
    constructor() { }

    public async handle(event: CreateReservationStockDomainEvent): Promise<void> {
        try {
            const { props } = event;
            const title = "Reservation Confirmation";
            const message_pt2 = `Your reservation for product ID: ${props.productId} has been confirmed. Reserved quantity: ${props.quantity}.`;
            console.log("Notification Sent:", { title, message_pt2 });
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    }
}
