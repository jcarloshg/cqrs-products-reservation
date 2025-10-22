import { CreateReservationStockCommand } from "@/app/stock/create-reservation-stock/domain/commands/create-reservation-stock.command";
import { OwnZodError } from "@/app/shared/domain/errors/zod.error";

describe("CreateReservationStockCommand", () => {
    it("should create a command with valid props", () => {
        // Arrange
        const validProps = {
            uuid: "a8098c1a-f86e-11da-bd1a-00112444be1e",
            ownerUuid: "b8098c1a-f86e-11da-bd1a-00112444be1e",
            productId: "c8098c1a-f86e-11da-bd1a-00112444be1e",
            quantity: 5,
            status: "PENDING",
            expiresAt: new Date(),
        };
        // Act
        const command = new CreateReservationStockCommand(validProps);
        // Assert
        expect(command.createReservationStockCommandProps).toMatchObject({
            ...validProps,
            expiresAt: expect.any(Date),
        });
    });

    it("should throw OwnZodError for invalid uuid", () => {
        // Arrange
        const invalidProps = {
            uuid: "not-a-uuid",
            ownerUuid: "b8098c1a-f86e-11da-bd1a-00112444be1e",
            productId: "c8098c1a-f86e-11da-bd1a-00112444be1e",
            quantity: 5,
            status: "PENDING",
            expiresAt: new Date(),
        };
        // Act & Assert
        expect(() => new CreateReservationStockCommand(invalidProps)).toThrow(OwnZodError);
    });

    it("should throw OwnZodError for quantity less than 1", () => {
        // Arrange
        const invalidProps = {
            uuid: "a8098c1a-f86e-11da-bd1a-00112444be1e",
            ownerUuid: "b8098c1a-f86e-11da-bd1a-00112444be1e",
            productId: "c8098c1a-f86e-11da-bd1a-00112444be1e",
            quantity: 0,
            status: "PENDING",
            expiresAt: new Date(),
        };
        // Act & Assert
        expect(() => new CreateReservationStockCommand(invalidProps)).toThrow(OwnZodError);
    });

    it("should throw OwnZodError for missing required fields", () => {
        // Arrange
        const emptyProps = {};
        // Act & Assert
        expect(() => new CreateReservationStockCommand(emptyProps)).toThrow(OwnZodError);
    });

    it("should parse expiresAt from string", () => {
        // Arrange
        const validProps = {
            uuid: "a8098c1a-f86e-11da-bd1a-00112444be1e",
            ownerUuid: "b8098c1a-f86e-11da-bd1a-00112444be1e",
            productId: "c8098c1a-f86e-11da-bd1a-00112444be1e",
            quantity: 5,
            status: "PENDING",
            expiresAt: new Date().toISOString(),
        };
        // Act
        const command = new CreateReservationStockCommand(validProps);
        // Assert
        expect(command.createReservationStockCommandProps.expiresAt).toBeInstanceOf(Date);
    });

    it("should have static COMMAND_NAME property", () => {
        // Arrange
        // Act
        // Assert
        expect(CreateReservationStockCommand.COMMAND_NAME).toBe("CreateReservationStockCommand");
    });
});