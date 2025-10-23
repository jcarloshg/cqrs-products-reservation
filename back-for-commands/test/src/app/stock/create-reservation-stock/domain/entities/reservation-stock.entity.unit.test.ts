import { ReservationStock, ReservationStockProps } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";
import { AggregateRoot } from "@/app/shared/domain/domain-events/aggregate-root";
import { OwnZodError } from "@/app/shared/domain/errors/zod.error";
import { CreateReservationStockDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/create-reservation-stock.doamin-event";
import { ReservationStatus } from "@/app/shared/domain/model/ReservationStatus";

describe("reservation-stock.entity.test", () => {
    const validProps = {
        uuid: "a3e1b2c4-1234-5678-9101-abcdefabcdef",
        ownerUuid: "b3e1b2c4-1234-5678-9101-abcdefabcdef",
        productId: "c3e1b2c4-1234-5678-9101-abcdefabcdef",
        quantity: 5,
        status: ReservationStatus.PENDING as typeof ReservationStatus.PENDING,
        expiresAt: new Date(Date.now() + 10000),
    };
    const entityRawData = { ...validProps };

    describe("constructor", () => {
        it("should create a ReservationStock instance with valid props", () => {
            // Arrange
            // Act
            const entity = new ReservationStock(entityRawData);
            // Assert
            expect(entity.getProps()).toMatchObject(validProps);
        });

        it("should throw OwnZodError for invalid props", () => {
            // Arrange
            const invalidProps = { ...validProps, quantity: 0 };
            // Act & Assert
            expect(() => new ReservationStock(invalidProps)).toThrow(OwnZodError);
        });
    });

    describe("getProps", () => {
        it("should return a copy of the entity props", () => {
            // Arrange
            const entity = new ReservationStock(entityRawData);
            // Act
            const props = entity.getProps();
            // Assert
            expect(props).toEqual(validProps);
        });
    });

    describe("getAggregateRoot", () => {
        it("should return an AggregateRoot instance", () => {
            // Arrange
            const entity = new ReservationStock(entityRawData);
            // Act
            const aggregateRoot = entity.getAggregateRoot();
            // Assert
            expect(aggregateRoot).toBeInstanceOf(AggregateRoot);
        });
    });

    describe("parse", () => {
        it("should parse valid data and return props", () => {
            // Arrange
            // Act
            const props = ReservationStock.parse(validProps);
            // Assert
            expect(props).toEqual(validProps);
        });

        it("should throw OwnZodError for invalid data", () => {
            // Arrange
            const invalidProps = { ...validProps, quantity: 0 };
            // Act & Assert
            expect(() => ReservationStock.parse(invalidProps)).toThrow(OwnZodError);
        });
    });

    describe("createReservationStock", () => {
        it("should record a domain event when called with valid props", () => {
            // Arrange
            const entity = new ReservationStock(entityRawData);
            const aggregateRoot = entity.getAggregateRoot();
            jest.spyOn(aggregateRoot, "recordDomainEvent");
            // Act
            entity.createReservationStock(validProps);
            // Assert
            expect(aggregateRoot.recordDomainEvent).toHaveBeenCalledWith(
                expect.any(CreateReservationStockDomainEvent)
            );
        });

        it("should throw OwnZodError when called with invalid props", () => {
            // Arrange
            const entity = new ReservationStock(entityRawData);
            const invalidProps = { ...validProps, quantity: 0 };
            // Act & Assert
            expect(() => entity.createReservationStock(invalidProps)).toThrow(OwnZodError);
        });
    });
});
