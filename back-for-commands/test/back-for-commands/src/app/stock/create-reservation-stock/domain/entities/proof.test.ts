import { StockProof } from "@/app/stock/create-reservation-stock/domain/entities/proof";
import { ReservationStatus, ReservationStockProps } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";

describe('proof.test', () => {
    it('should be defined', () => {
        const stock = new StockProof({
            uuid: crypto.randomUUID(),
            product_uuid: crypto.randomUUID(),
            available_quantity: 100,
            reserved_quantity: 10,
        });
        expect(stock).toBeDefined();
    });

    it('should events must be 1', () => {
        const stock = new StockProof({
            uuid: crypto.randomUUID(),
            product_uuid: crypto.randomUUID(),
            available_quantity: 100,
            reserved_quantity: 10,
        });

        const events = stock.getAggregateRoot().pullDomainEvents();
        expect(events.length).toBe(1);
    });

    it('should update stock proof', () => {
        const stock = new StockProof({
            uuid: crypto.randomUUID(),
            product_uuid: crypto.randomUUID(),
            available_quantity: 100,
            reserved_quantity: 10,
        });

        const reservationStock: ReservationStockProps = {
            uuid: crypto.randomUUID(),
            ownerUuid: crypto.randomUUID(),
            productId: stock.getProps().product_uuid,
            quantity: 10,
            status: ReservationStatus.PENDING,
            expiresAt: new Date(new Date().getTime() + 30 * 60000)
        };
        stock.reserve(reservationStock)
        const props = stock.getProps();
        expect(props.reserved_quantity).toBe(20);

        const domainEvents = stock.getAggregateRoot().pullDomainEvents();
        expect(domainEvents.length).toBe(3);
    });
})