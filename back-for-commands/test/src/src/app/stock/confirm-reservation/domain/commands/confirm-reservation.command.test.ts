import { ConfirmReservationCommand } from "@/app/stock/confirm-reservation/domain/commands/confirm-reservation.command"
import { ReservationStatus } from "@/app/shared/domain/model/ReservationStatus";
import { OwnZodError } from "@/app/shared/domain/errors/zod.error";

describe('confirm-reservation.command.test', () => {
    const validUuid = "123e4567-e89b-12d3-a456-426614174000";
    const validProductId = "987fcdeb-51a2-43d1-b123-456789abcdef";

    describe('constructor', () => {
        it('should create a valid ConfirmReservationCommand with correct properties', () => {
            // Arrange
            const props = {
                uuid: validUuid,
                productId: validProductId,
                newStatus: ReservationStatus.CONFIRMED
            };

            // Act
            const command = new ConfirmReservationCommand(props);

            // Assert
            expect(command.data.uuid).toBe(validUuid);
            expect(command.data.productId).toBe(validProductId);
            expect(command.data.newStatus).toBe(ReservationStatus.CONFIRMED);
        });

        it('should throw OwnZodError when uuid is missing', () => {
            // Arrange
            const props = {
                productId: validProductId,
                newStatus: ReservationStatus.CONFIRMED
            };

            // Act & Assert
            expect(() => new ConfirmReservationCommand(props)).toThrow(OwnZodError);
        });

        it('should throw OwnZodError when uuid is not a valid UUID', () => {
            // Arrange
            const props = {
                uuid: "invalid-uuid",
                productId: validProductId,
                newStatus: ReservationStatus.CONFIRMED
            };

            // Act & Assert
            expect(() => new ConfirmReservationCommand(props)).toThrow(OwnZodError);
        });

        it('should throw OwnZodError when productId is missing', () => {
            // Arrange
            const props = {
                uuid: validUuid,
                newStatus: ReservationStatus.CONFIRMED
            };

            // Act & Assert
            expect(() => new ConfirmReservationCommand(props)).toThrow(OwnZodError);
        });

        it('should throw OwnZodError when productId is not a valid UUID', () => {
            // Arrange
            const props = {
                uuid: validUuid,
                productId: "invalid-product-id",
                newStatus: ReservationStatus.CONFIRMED
            };

            // Act & Assert
            expect(() => new ConfirmReservationCommand(props)).toThrow(OwnZodError);
        });

        it('should throw OwnZodError when newStatus is missing', () => {
            // Arrange
            const props = {
                uuid: validUuid,
                productId: validProductId
            };

            // Act & Assert
            expect(() => new ConfirmReservationCommand(props)).toThrow(OwnZodError);
        });

        it('should throw OwnZodError when newStatus is not CONFIRMED', () => {
            // Arrange
            const props = {
                uuid: validUuid,
                productId: validProductId,
                newStatus: ReservationStatus.PENDING // Invalid status for this command
            };

            // Act & Assert
            expect(() => new ConfirmReservationCommand(props)).toThrow(OwnZodError);
        });

        it('should throw OwnZodError when newStatus is CANCELLED', () => {
            // Arrange
            const props = {
                uuid: validUuid,
                productId: validProductId,
                newStatus: ReservationStatus.CANCELLED
            };

            // Act & Assert
            expect(() => new ConfirmReservationCommand(props)).toThrow(OwnZodError);
        });

        it('should throw OwnZodError when newStatus is EXPIRED', () => {
            // Arrange
            const props = {
                uuid: validUuid,
                productId: validProductId,
                newStatus: ReservationStatus.EXPIRED
            };

            // Act & Assert
            expect(() => new ConfirmReservationCommand(props)).toThrow(OwnZodError);
        });

        it('should throw OwnZodError when newStatus is an invalid string', () => {
            // Arrange
            const props = {
                uuid: validUuid,
                productId: validProductId,
                newStatus: "INVALID_STATUS"
            };

            // Act & Assert
            expect(() => new ConfirmReservationCommand(props)).toThrow(OwnZodError);
        });

        it('should throw OwnZodError with proper error details when validation fails', () => {
            // Arrange
            const props = {
                uuid: "invalid-uuid",
                productId: validProductId,
                newStatus: ReservationStatus.CONFIRMED
            };

            // Act & Assert
            try {
                new ConfirmReservationCommand(props);
                fail('Expected OwnZodError to be thrown');
            } catch (error) {
                expect(error).toBeInstanceOf(OwnZodError);
                expect((error as OwnZodError).modelsErrorRequest.entity).toBe("ConfirmReservationCommand");
                expect((error as OwnZodError).modelsErrorRequest.userError).toBeDefined();
                expect((error as OwnZodError).modelsErrorRequest.developerError).toBeDefined();
            }
        });

        it('should handle extra properties by ignoring them', () => {
            // Arrange
            const props = {
                uuid: validUuid,
                productId: validProductId,
                newStatus: ReservationStatus.CONFIRMED,
                extraProperty: "should be ignored"
            };

            // Act
            const command = new ConfirmReservationCommand(props);

            // Assert
            expect(command.data.uuid).toBe(validUuid);
            expect(command.data.productId).toBe(validProductId);
            expect(command.data.newStatus).toBe(ReservationStatus.CONFIRMED);
            expect((command.data as any).extraProperty).toBeUndefined();
        });
    });

    describe('COMMAND_NAME', () => {
        it('should return the correct command name', () => {
            // Act
            const commandName = ConfirmReservationCommand.COMMAND_NAME;

            // Assert
            expect(commandName).toBe("ConfirmReservationCommand");
        });
    });

    describe('data property', () => {
        it('should have the correct type structure', () => {
            // Arrange
            const props = {
                uuid: validUuid,
                productId: validProductId,
                newStatus: ReservationStatus.CONFIRMED
            };

            // Act
            const command = new ConfirmReservationCommand(props);

            // Assert
            expect(typeof command.data.uuid).toBe('string');
            expect(typeof command.data.productId).toBe('string');
            expect(typeof command.data.newStatus).toBe('string');
            expect(command.data.newStatus).toBe(ReservationStatus.CONFIRMED);
        });
    });
})