import { DomainEvent } from "@/app/shared/domain/domain-events/domain-event";
import { StackEntityProps } from "../entity/stock.entity";
import { EventHandler } from "@/app/shared/domain/domain-events/event-handler";


export class StockQuantityUpdatedDomainEvent extends DomainEvent {

    public readonly eventName: string = "STOCK.QUANTITY_UPDATED";
    private readonly stackEntityProps: StackEntityProps;

    constructor(
        aggregateId: string,
        stackEntityProps: StackEntityProps
    ) {
        super(aggregateId);
        this.stackEntityProps = stackEntityProps;
    }
}

export class StockQuantityUpdatedEventHandler implements EventHandler<StockQuantityUpdatedDomainEvent> {

    constructor() { }

    public subscribeTo(): string {
        return StockQuantityUpdatedDomainEvent.eventName;
    }

    public async handle(event: StockQuantityUpdatedDomainEvent): Promise<void> {
        console.log(
            `Stock quantity updated: [Stock ID: ${event.aggregateId}] New Props: ${JSON.stringify(event['stackEntityProps'])}`
        );
    }
}