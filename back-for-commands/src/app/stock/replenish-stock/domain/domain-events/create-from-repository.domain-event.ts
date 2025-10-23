import { DomainEvent } from "@/app/shared/domain/domain-events/domain-event";
import { StackEntityProps } from "../entity/stock.entity";
import { EventHandler } from "@/app/shared/domain/domain-events/event-handler";

export class CreateFromRepositoryDomainEvent extends DomainEvent {

    public readonly eventName: string = "STOCK.CREATE_FROM_REPOSITORY";
    private readonly stackEntityProps: StackEntityProps;

    constructor(
        aggregateId: string,
        stackEntityProps: StackEntityProps
    ) {
        super(aggregateId);
        this.stackEntityProps = stackEntityProps;
    }
}


export class CreateFromRepositoryEventHandler implements EventHandler<CreateFromRepositoryDomainEvent> {
    constructor() { }
    public subscribeTo(): string {
        return CreateFromRepositoryDomainEvent.eventName;
    }

    public async handle(event: CreateFromRepositoryDomainEvent): Promise<void> {
        console.log(
            `Handling event: ${CreateFromRepositoryDomainEvent.eventName} for Stock ID: ${event.eventUuid}`
        );
    }
}