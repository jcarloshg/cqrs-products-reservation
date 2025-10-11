import { ModelError } from "@/app/shared/domain/errors/models.error";
import {
    ReservationStatus,
    ReservationStock,
    ReservationStockProps,
} from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";

describe("reservation-stock.entity.test", () => {
    it('should get error ["uuid - Invalid UUID"]', () => {
        try {
            const props: ReservationStockProps = {
                uuid: "any_uuid",
                ownerUuid: "any_ownerUuid",
                productId: "any_productId",
                quantity: 1,
                expiresAt: new Date(new Date().getTime() + 10000),
                status: ReservationStatus.PENDING,
            };
            ReservationStock.parse(props);
        } catch (error) {
            expect(error).toBeInstanceOf(ModelError);
            const modelError = error as ModelError;
            expect(modelError.message).toEqual("uuid - Invalid UUID");
            const modelsErrorRequest = modelError.modelsErrorRequest;
            expect(modelError.name).toBe("ModelError");
            expect(modelsErrorRequest.userError).toBe("uuid - Invalid UUID");
        }
    });

    it('should get error ["ownerUuid - Invalid UUID"]', () => {
        try {
            const props: ReservationStockProps = {
                uuid: crypto.randomUUID(),
                ownerUuid: "any_ownerUuid",
                productId: "any_productId",
                quantity: 1,
                expiresAt: new Date(new Date().getTime() + 10000),
                status: ReservationStatus.PENDING,
            };
            ReservationStock.parse(props);
        } catch (error) {
            expect(error).toBeInstanceOf(ModelError);
            const modelError = error as ModelError;
            expect(modelError.message).toEqual("ownerUuid - Invalid UUID");
            const modelsErrorRequest = modelError.modelsErrorRequest;
            expect(modelError.name).toBe("ModelError");
            expect(modelsErrorRequest.userError).toBe("ownerUuid - Invalid UUID");
        }
    });

    it('should get error ["productId - Invalid UUID"]', () => {
        try {
            const props: ReservationStockProps = {
                uuid: crypto.randomUUID(),
                ownerUuid: crypto.randomUUID(),
                productId: "any_productId",
                quantity: 1,
                expiresAt: new Date(new Date().getTime() + 10000),
                status: ReservationStatus.PENDING,
            };
            ReservationStock.parse(props);
        } catch (error) {
            expect(error).toBeInstanceOf(ModelError);
            const modelError = error as ModelError;
            expect(modelError.message).toEqual("productId - Invalid UUID");
            const modelsErrorRequest = modelError.modelsErrorRequest;
            expect(modelError.name).toBe("ModelError");
            expect(modelsErrorRequest.userError).toBe("productId - Invalid UUID");
        }
    });

    it('should get error ["quantity - Number must be greater than or equal to 1"]', () => {
        try {
            const props: ReservationStockProps = {
                uuid: crypto.randomUUID(),
                ownerUuid: crypto.randomUUID(),
                productId: crypto.randomUUID(),
                quantity: 0,
                expiresAt: new Date(new Date().getTime() + 10000),
                status: ReservationStatus.PENDING,
            };
            ReservationStock.parse(props);
        } catch (error) {
            expect(error).toBeInstanceOf(ModelError);
            const modelError = error as ModelError;
            expect(modelError.message).toEqual(
                "quantity - Too small: expected number to be >=1"
            );
            const modelsErrorRequest = modelError.modelsErrorRequest;
            expect(modelError.name).toBe("ModelError");
            expect(modelsErrorRequest.userError).toBe(
                "quantity - Too small: expected number to be >=1"
            );
        }
    });

    it('should get error ["expiresAt - Date must be in the future"]', () => {
        const messageExpected = "Too small: expected date to be";
        try {
            const props: ReservationStockProps = {
                uuid: crypto.randomUUID(),
                ownerUuid: crypto.randomUUID(),
                productId: crypto.randomUUID(),
                quantity: 1,
                expiresAt: new Date(new Date().getTime() - 10000),
                status: ReservationStatus.PENDING,
            };
            ReservationStock.parse(props);
        } catch (error) {
            expect(error).toBeInstanceOf(ModelError);
            const modelError = error as ModelError;
            expect(modelError.message).toContain(messageExpected);
            const modelsErrorRequest = modelError.modelsErrorRequest;
            expect(modelError.name).toBe("ModelError");
            expect(modelsErrorRequest.userError).toContain(messageExpected);
        }
    });


    it("should create reservation stock", () => {
        const props: ReservationStockProps = {
            uuid: crypto.randomUUID(),
            ownerUuid: crypto.randomUUID(),
            productId: crypto.randomUUID(),
            quantity: 1,
            expiresAt: new Date(new Date().getTime() + 10000),
            status: ReservationStatus.PENDING,
        };
        const reservationStockValidated = ReservationStock.parse(props);
        expect(reservationStockValidated).toEqual(props);
    })


});
