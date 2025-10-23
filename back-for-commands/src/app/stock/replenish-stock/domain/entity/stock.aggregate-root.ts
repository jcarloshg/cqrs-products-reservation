import { AggregateRoot } from "@/app/shared/domain/domain-events/aggregate-root";
import { StackEntity, StackEntityProps } from "./stock.entity";
import { CreateFromRepositoryDomainEvent } from "../domain-events/create-from-repository.domain-event";
import { StockQuantityUpdatedDomainEvent } from "../domain-events/stock-quantity-updated.domain-event";

export class StockAggregateRoot extends AggregateRoot {

    private _stackEntity: StackEntity | null = null;

    constructor() {
        super();
    }

    public entityProps(): StackEntityProps {
        if (!this._stackEntity) throw new Error("Stock entity is not initialized.");
        return this._stackEntity.getPropsCopy();
    }

    createFromRepository(stockRaw: { [key: string]: any }) {
        this._stackEntity = new StackEntity(stockRaw);
        const domainEvent = new CreateFromRepositoryDomainEvent(
            this.getAggregateRootUUID(),
            this._stackEntity.getPropsCopy()
        );
        this.recordDomainEvent(domainEvent);
    }

    updateStockQuantity(quantityToAdd: number) {
        if (!this._stackEntity) throw new Error("Stock entity is not initialized.");
        this._stackEntity.updateAvailableQuantity(quantityToAdd);
        const domainEvent = new StockQuantityUpdatedDomainEvent(
            this.getAggregateRootUUID(),
            this._stackEntity.getPropsCopy()
        );
        this.recordDomainEvent(domainEvent);
    }

}

