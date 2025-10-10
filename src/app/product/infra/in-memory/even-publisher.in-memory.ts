import { DomainEvent } from "@/app/shared/domain/domain-events/domain-event";
import { EventBus } from "@/app/shared/domain/domain-events/event-handler";
import { EventPublisher } from "@/app/shared/domain/domain-events/event-publisher";

export class EventPublisherInMemory implements EventPublisher {

    constructor(private eventBus: EventBus) { }

    public async publish(event: DomainEvent): Promise<void> {
        this.eventBus.publish(event);
    }

    public async publishAll(events: DomainEvent[]): Promise<void> {
        for (const event of events) {
            await this.eventBus.publish(event);
        }
    }
}