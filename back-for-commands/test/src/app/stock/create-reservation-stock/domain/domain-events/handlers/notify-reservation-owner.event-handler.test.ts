import { NotifyReservationOwnerEventHandler } from "@/app/stock/create-reservation-stock/domain/domain-events/handlers/notify-reservation-owner.event-handler";
import { EventError } from "@/app/shared/domain/errors/event.error";
import { CreateReservationStockDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/create-reservation-stock.doamin-event";

describe("NotifyReservationOwnerEventHandler", () => {
    let sendEmailService: { send: jest.Mock };
    let getUserByUuidRepository: { findById: jest.Mock };
    let handler: NotifyReservationOwnerEventHandler;

    beforeEach(() => {
        sendEmailService = { send: jest.fn() };
        getUserByUuidRepository = { findById: jest.fn() };
        handler = new NotifyReservationOwnerEventHandler(
            sendEmailService as any,
            getUserByUuidRepository as any
        );
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should subscribe to the correct event name", () => {
        // Arrange & Act
        const eventName = handler.subscribeTo();
        // Assert
        expect(eventName).toBe(CreateReservationStockDomainEvent.eventName);
    });

    it("should send email when user is found", async () => {
        // Arrange
        const mockUser = { getProps: jest.fn().mockReturnValue("user123") };
        getUserByUuidRepository.findById.mockResolvedValue(mockUser);
        const event = {
            props: {
                ownerUuid: "owner-uuid",
                productId: "product-1",
                quantity: 5,
            }
        } as CreateReservationStockDomainEvent;
        // Act
        await handler.handle(event);
        // Assert
        expect(getUserByUuidRepository.findById).toHaveBeenCalledWith("owner-uuid");
        expect(sendEmailService.send).toHaveBeenCalledWith({
            body: expect.stringContaining("product ID: product-1"),
            subject: "Reservation Confirmation",
            to: "user123@cqrs-example.com",
        });
    });

    it("should throw EventError and log when user is not found", async () => {
        // Arrange
        getUserByUuidRepository.findById.mockResolvedValue(null);
        const event = {
            props: {
                ownerUuid: "owner-uuid",
                productId: "product-1",
                quantity: 5,
            }
        } as CreateReservationStockDomainEvent;
        // Act
        await handler.handle(event);
        // Assert
        expect(getUserByUuidRepository.findById).toHaveBeenCalledWith("owner-uuid");
        expect(sendEmailService.send).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining("Error sending notification"),
            expect.any(EventError)
        );
    });

    it("should log error if sendEmailService throws", async () => {
        // Arrange
        const mockUser = { getProps: jest.fn().mockReturnValue("user123") };
        getUserByUuidRepository.findById.mockResolvedValue(mockUser);
        sendEmailService.send.mockRejectedValue(new Error("Email failed"));
        const event = {
            props: {
                ownerUuid: "owner-uuid",
                productId: "product-1",
                quantity: 5,
            }
        } as CreateReservationStockDomainEvent;
        // Act
        await handler.handle(event);
        // Assert
        expect(sendEmailService.send).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining("Error sending notification"),
            expect.any(Error)
        );
    });
});
