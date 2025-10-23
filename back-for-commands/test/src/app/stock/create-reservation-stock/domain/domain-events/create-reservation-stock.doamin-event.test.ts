import { CreateReservationStockDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/create-reservation-stock.doamin-event";
import { ReservationStockProps } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";
import { ReservationStatus } from "@/app/shared/domain/model/ReservationStatus";

describe("create-reservation-stock.doamin-event.ts", () => {
    it("should create an event with correct props and uuid", () => {
        // Arrange
        const props: ReservationStockProps = {
            uuid: "test-uuid",
            ownerUuid: "owner-uuid",
            productId: "prod-1",
            quantity: 10,
            status: ReservationStatus.PENDING,
            expiresAt: new Date(Date.now() + 10000),
        };

        // Act
        const event = new CreateReservationStockDomainEvent(props);

        // Assert
        expect(event.props).toBe(props);
        expect(event.aggregateId).toBe(props.uuid);
        expect(CreateReservationStockDomainEvent.eventName).toBe("RESERVATION-STOCK.CREATED");
    });

    it("should throw if props is missing uuid", () => {
        // Arrange
        const props: any = {
            productId: "prod-1",
            quantity: 10,
            status: ReservationStatus.PENDING,
            expiresAt: new Date(Date.now() + 10000),
        };

        // Act & Assert
        expect(() => new CreateReservationStockDomainEvent(props)).toThrow();
    });
});
