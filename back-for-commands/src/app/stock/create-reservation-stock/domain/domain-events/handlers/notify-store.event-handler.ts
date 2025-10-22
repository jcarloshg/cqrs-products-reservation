import { EventHandler } from "@/app/shared/domain/domain-events/event-handler";
import { CreateReservationStockDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/create-reservation-stock.doamin-event";

export class NotifyStoreEventHandler implements EventHandler<CreateReservationStockDomainEvent> {

    constructor() { }

    public subscribeTo(): string {
        return CreateReservationStockDomainEvent.eventName;
    }

    public async handle(event: CreateReservationStockDomainEvent): Promise<void> {
        try {
            const { props } = event;
            const title = "New Stock Reservation";
            const message = `A new stock reservation has been made for product ID: ${props.productId}. Reserved quantity: ${props.quantity}.`;
            console.log("Notification Sent:", { title, message });
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    }
}