import { NotifyStoreEventHandler } from "@/app/stock/create-reservation-stock/domain/domain-events/handlers/notify-store.event-handler";
import { CreateReservationStockDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/create-reservation-stock.doamin-event";

describe("notify-store.event-handler.ts", () => {
    let handler: NotifyStoreEventHandler;
    let event: CreateReservationStockDomainEvent;

    beforeEach(() => {
        handler = new NotifyStoreEventHandler();
        event = {
            props: {
                productId: "prod-123",
                quantity: 10
            }
        } as CreateReservationStockDomainEvent;
    });

    describe("subscribeTo", () => {
        it("should return the event name", () => {
            // Arrange
            // Act
            const result = handler.subscribeTo();
            // Assert
            expect(result).toBe(CreateReservationStockDomainEvent.eventName);
        });
    });

    describe("handle", () => {
        it("should log notification when event is handled", async () => {
            // Arrange
            const logSpy = jest.spyOn(console, "log").mockImplementation();
            // Act
            await handler.handle(event);
            // Assert
            expect(logSpy).toHaveBeenCalledWith("Notification Sent:", expect.objectContaining({
                title: "New Stock Reservation",
                message: expect.stringContaining("prod-123")
            }));
            logSpy.mockRestore();
        });

        it("should log error if an exception occurs", async () => {
            // Arrange
            const errorSpy = jest.spyOn(console, "error").mockImplementation();
            // Simulate event with missing props to cause error
            const badEvent = {} as CreateReservationStockDomainEvent;
            // Act
            await handler.handle(badEvent);
            // Assert
            expect(errorSpy).toHaveBeenCalledWith(
                expect.stringContaining("Error sending notification"),
                expect.anything()
            );
            errorSpy.mockRestore();
        });
    });
});
