import { EventHandler } from "@/app/shared/domain/domain-events/event-handler";
import { CreateReservationStockDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/create-reservation-stock.doamin-event";

export class SendNotificationEventHandler
    implements EventHandler<CreateReservationStockDomainEvent> {

    constructor() { }

    public async handle(event: CreateReservationStockDomainEvent): Promise<void> {
        try {
            const { props } = event;
            const title = "Reservation Stock Created";
            const message = `Reservation stock created for product ${props.productId} with quantity ${props.quantity}.`;
            console.log("Notification Sent:", { title, message });
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    }
}
