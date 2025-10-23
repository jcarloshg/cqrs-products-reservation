import { NotifyStockUpdatedEventHandler } from "@/app/stock/create-reservation-stock/domain/domain-events/handlers/notify-stock-updated.event-hanlder";
import { StockIncreaseReservationQuantityDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/stock-increase-reservation-quantity.domain-event";

describe("notify-stock-updated.event-hanlder.test", () => {
    let handler: NotifyStockUpdatedEventHandler;
    let event: StockIncreaseReservationQuantityDomainEvent;

    beforeEach(() => {
        handler = new NotifyStockUpdatedEventHandler();
        event = {
            eventUuid: "test-event-uuid",
            stock: {
                product_uuid: "prod-123",
                available_quantity: 10,
                reserved_quantity: 5,
            },
            reservationStock: {
                reservationUuid: "res-456",
                quantity: 2,
            },
        } as any;
    });

    describe("subscribeTo", () => {
        it("should return the event name", () => {
            // Arrange
            const expected = StockIncreaseReservationQuantityDomainEvent.eventName;
            // Act
            const result = handler.subscribeTo();
            // Assert
            expect(result).toBe(expected);
        });
    });

    describe("handle", () => {
        it("should complete without throwing for a valid event", async () => {
            // Arrange
            // Act & Assert
            await expect(handler.handle(event)).resolves.toBeUndefined();
        });
    });

    // No handle tests that catch logs remain
    // You may add more business logic tests here if needed
});
