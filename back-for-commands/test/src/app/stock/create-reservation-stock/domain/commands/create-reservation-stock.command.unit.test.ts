import { CreateReservationStockCommand } from "@/app/stock/create-reservation-stock/domain/commands/create-reservation-stock.command";
import { OwnZodError } from "@/app/shared/domain/errors/zod.error";

describe("CreateReservationStockCommand", () => {
    const validProps = {
        uuid: "123e4567-e89b-12d3-a456-426614174000",
        ownerUuid: "123e4567-e89b-12d3-a456-426614174001",
        productId: "123e4567-e89b-12d3-a456-426614174002",
        quantity: 5,
        status: "PENDING",
        expiresAt: new Date().toISOString(),
    };

    it("should create command with valid props", () => {
        // Arrange: set up valid props
        const props = { ...validProps };
        // Act: execute the constructor
        const command = new CreateReservationStockCommand(props);
        // Assert: verify the expected outcome
        expect(command.createReservationStockCommandProps).toMatchObject({
            ...props,
            expiresAt: expect.any(Date),
        });
    });

    it("should throw OwnZodError for missing required fields", () => {
        // Arrange: set up empty props
        const props = {};
        // Act & Assert: execute and verify error is thrown
        expect(() => new CreateReservationStockCommand(props)).toThrow(OwnZodError);
    });

    it("should throw OwnZodError for invalid quantity", () => {
        // Arrange: set up props with invalid quantity
        const invalidProps = { ...validProps, quantity: 0 };
        // Act & Assert: execute and verify error is thrown
        expect(() => new CreateReservationStockCommand(invalidProps)).toThrow(OwnZodError);
    });

    it("should throw OwnZodError for invalid status", () => {
        // Arrange: set up props with invalid status
        const invalidProps = { ...validProps, status: "CONFIRMED" };
        // Act & Assert: execute and verify error is thrown
        expect(() => new CreateReservationStockCommand(invalidProps)).toThrow(OwnZodError);
    });

    it("should throw OwnZodError for invalid uuid format", () => {
        // Arrange: set up props with invalid uuid
        const invalidProps = { ...validProps, uuid: "not-a-uuid" };
        // Act & Assert: execute and verify error is thrown
        expect(() => new CreateReservationStockCommand(invalidProps)).toThrow(OwnZodError);
    });

    it("should set expiresAt as Date if passed as string", () => {
        // Arrange: set up props with expiresAt as string
        const propsWithStringDate = { ...validProps, expiresAt: new Date().toISOString() };
        // Act: execute the constructor
        const command = new CreateReservationStockCommand(propsWithStringDate);
        // Assert: verify expiresAt is a Date instance
        expect(command.createReservationStockCommandProps.expiresAt).toBeInstanceOf(Date);
    });

    it("should return correct COMMAND_NAME", () => {
        // Arrange: nothing to arrange for static property
        // Act: access static property
        const name = CreateReservationStockCommand.COMMAND_NAME;
        // Assert: verify the command name
        expect(name).toBe("CreateReservationStockCommand");
    });
});
