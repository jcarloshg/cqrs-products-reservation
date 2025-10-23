import {
    StockIncreaseReservationQuantityDomainEvent,
    StockReservationInfo,
} from "@/app/stock/create-reservation-stock/domain/domain-events/stock-increase-reservation-quantity.domain-event";
import { StockProps } from "@/app/stock/create-reservation-stock/domain/entities/stock.entity";

describe("stock-increase-reservation-quantity.domain-event.ts", () => {
    it("should create event with valid reservationStock info", () => {
        // Arrange
        const stockMock: StockProps = {
            uuid: crypto.randomUUID(),
            product_uuid: crypto.randomUUID(),
            available_quantity: 10,
            reserved_quantity: 5,
        };
        const reservationStockMock: StockReservationInfo = {
            reservationUuid: crypto.randomUUID(),
            quantity: 5,
        };
        // Act
        const event = new StockIncreaseReservationQuantityDomainEvent(
            stockMock,
            reservationStockMock
        );
        // Assert
        expect(event.stock).toEqual(stockMock);
        expect(event.reservationStock).toEqual(reservationStockMock);
        expect(StockIncreaseReservationQuantityDomainEvent.eventName).toBe(
            "STOCK.INCREASE_RESERVATION_QUANTITY"
        );
    });

    it("should throw error for invalid reservationStock info (quantity < 1)", () => {
        // Arrange
        const stock: StockProps = {
            uuid: "11111111-1111-1111-1111-111111111111",
            product_uuid: "22222222-2222-2222-2222-222222222222",
            available_quantity: 10,
            reserved_quantity: 5,
        };
        const invalidReservationStock = {
            reservationUuid: "33333333-3333-3333-3333-333333333333",
            quantity: 0,
        };
        // Act & Assert
        expect(
            () =>
                new StockIncreaseReservationQuantityDomainEvent(
                    stock,
                    invalidReservationStock as any
                )
        ).toThrow();
    });

    it("should throw error for missing reservationUuid", () => {
        // Arrange
        const stock: StockProps = {
            uuid: "11111111-1111-1111-1111-111111111111",
            product_uuid: "22222222-2222-2222-2222-222222222222",
            available_quantity: 10,
            reserved_quantity: 5,
        };
        const invalidReservationStock = { quantity: 2 };
        // Act & Assert
        expect(
            () =>
                new StockIncreaseReservationQuantityDomainEvent(
                    stock,
                    invalidReservationStock as any
                )
        ).toThrow();
    });

    it("should throw error for invalid reservationUuid format", () => {
        // Arrange
        const stock: StockProps = {
            uuid: "11111111-1111-1111-1111-111111111111",
            product_uuid: "22222222-2222-2222-2222-222222222222",
            available_quantity: 10,
            reserved_quantity: 5,
        };
        const invalidReservationStock = {
            reservationUuid: "not-a-uuid",
            quantity: 2,
        };
        // Act & Assert
        expect(
            () =>
                new StockIncreaseReservationQuantityDomainEvent(
                    stock,
                    invalidReservationStock as any
                )
        ).toThrow();
    });
});
