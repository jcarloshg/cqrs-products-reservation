import { DomainEvent } from "@/app/shared/domain/domain-events/domain-event";
import { EventBus } from "@/app/shared/domain/domain-events/event-handler";
import { EventPublisher } from "@/app/shared/domain/domain-events/event-publisher";

export class EventPublisherOwn implements EventPublisher {
    private readonly _eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this._eventBus = eventBus;
    }

    public async publish(event: DomainEvent): Promise<void> {
        this._eventBus.publish(event);
    }

    public async publishAll(events: DomainEvent[]): Promise<void> {
        for (const event of events) {
            this._eventBus.publish(event);
        }
    }
}
