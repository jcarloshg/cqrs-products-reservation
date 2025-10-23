
import { Stock, StockReservationInfo } from "@/app/stock/create-reservation-stock/domain/entities/stock.entity";
import { DomainError } from "@/app/shared/domain/errors/domain.error";
import { OwnZodError } from "@/app/shared/domain/errors/zod.error";
import { AggregateRoot } from "@/app/shared/domain/domain-events/aggregate-root";
import { StockIncreaseReservationQuantityDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/stock-increase-reservation-quantity.domain-event";

describe("stock.entity.ts", () => {
    const validProps = {
        uuid: crypto.randomUUID(),
        product_uuid: crypto.randomUUID(),
        available_quantity: 10,
        reserved_quantity: 2,
    };

    function getEntityPropsRawData(overrides = {}) {
        return { ...validProps, ...overrides };
    }

    describe("constructor & parse", () => {
        it("should create Stock with valid props", () => {
            // Arrange
            const props = getEntityPropsRawData();
            // Act
            const stock = new Stock(props);
            // Assert
            expect(stock.getProps()).toMatchObject(props);
        });

        it("should throw OwnZodError for invalid props", () => {
            // Arrange
            const props = getEntityPropsRawData({ uuid: "invalid-uuid" });
            // Act & Assert
            expect(() => new Stock(props)).toThrow(OwnZodError);
        });

        it("should throw OwnZodError for parse with invalid props", () => {
            // Arrange
            const props = getEntityPropsRawData({ product_uuid: "bad-uuid" });
            // Act & Assert
            expect(() => Stock.parse(props)).toThrow(OwnZodError);
        });
    });

    describe("reserve", () => {
        it("should reserve stock when available", () => {
            // Arrange
            const stock = new Stock(getEntityPropsRawData());
            const reservation: StockReservationInfo = {
                reservationUuid: crypto.randomUUID(),
                quantity: 5,
            };
            // Act
            stock.reserve(reservation);
            // Assert
            expect(stock.getProps().reserved_quantity).toBe(7);
        });

        it("should throw DomainError if no stock available", () => {
            // Arrange
            const stock = new Stock(getEntityPropsRawData({ available_quantity: 2, reserved_quantity: 2 }));
            const reservation: StockReservationInfo = {
                reservationUuid: "res-2",
                quantity: 1,
            };
            // Act & Assert
            expect(() => stock.reserve(reservation)).toThrow(DomainError);
        });

        it("should throw DomainError if insufficient stock for reservation", () => {
            // Arrange
            const stock = new Stock(getEntityPropsRawData({ available_quantity: 5, reserved_quantity: 2 }));
            const reservation: StockReservationInfo = {
                reservationUuid: "res-3",
                quantity: 10,
            };
            // Act & Assert
            expect(() => stock.reserve(reservation)).toThrow(DomainError);
        });

        it("should record domain event on successful reservation", () => {
            // Arrange
            const stock = new Stock(getEntityPropsRawData());
            const reservationMock: StockReservationInfo = {
                reservationUuid: crypto.randomUUID(),
                quantity: 3,
            };
            const aggregateRoot = stock.getAggregateRoot();
            jest.spyOn(aggregateRoot, "recordDomainEvent");
            // Act
            stock.reserve(reservationMock);
            // Assert
            expect(aggregateRoot.recordDomainEvent).toHaveBeenCalledWith(
                expect.any(StockIncreaseReservationQuantityDomainEvent)
            );
        });
    });
});

