import { EventHandler } from "@/app/shared/domain/domain-events/event-handler";
import { StockIncreaseReservationQuantityDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/stock-increase-reservation-quantity.domain-event";

export class NotifyStockUpdatedEventHandler implements EventHandler<StockIncreaseReservationQuantityDomainEvent> {

    constructor() { }

    public subscribeTo(): string {
        return StockIncreaseReservationQuantityDomainEvent.eventName;
    }

    public async handle(event: StockIncreaseReservationQuantityDomainEvent): Promise<void> {
        try {
            console.log(`event-uuid: `, event.eventUuid);
            const { stock, reservationStock } = event;
            console.log(`{ stock, reservationStock }: `, { stock, reservationStock });
            const title = "Stock Reservation Updated";
            const message = `Stock for product ID: ${stock.product_uuid} has been updated. New available quantity: ${stock.available_quantity}, New reserved quantity: ${stock.reserved_quantity}. Reservation ID: ${reservationStock.reservationUuid}, Reserved quantity: ${reservationStock.quantity}.`;
            console.log("NotifyStockUpdatedEventHandler - Notification Sent:", { title, message });
        } catch (error) {
            console.error("[Error] - NotifyStockUpdatedEventHandler - sending notification:", error);
        }
    }
}
