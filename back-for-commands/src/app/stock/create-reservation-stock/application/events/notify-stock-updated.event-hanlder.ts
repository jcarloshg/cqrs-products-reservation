import { EventHandler } from "@/app/shared/domain/domain-events/event-handler";
import { StockIncreaseReservationQuantityDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/stock-increase-reservation-quantity.domain-event";

export class NotifyStockUpdatedEventHandler
    implements EventHandler<StockIncreaseReservationQuantityDomainEvent> {
    constructor() { }

    public async handle(
        event: StockIncreaseReservationQuantityDomainEvent
    ): Promise<void> {
        try {
            const { stock, reservationStock } = event;
            const title = "Stock Reservation Updated";
            const message = `Stock for product ID: ${stock.product_uuid} has been updated. New available quantity: ${stock.available_quantity}, New reserved quantity: ${stock.reserved_quantity}. Reservation ID: ${reservationStock.reservationUuid}, Reserved quantity: ${reservationStock.quantity}.`;
            console.log("Notification Sent:", { title, message });
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    }
}
