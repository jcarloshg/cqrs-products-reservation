import { DomainEvent } from "@/app/shared/domain/domain-events/domain-event";
import { EventBus, EventHandler } from "@/app/shared/domain/domain-events/event-handler";

export class EventBusOwn implements EventBus {

    handlers: Map<string, EventHandler<any>[]> = new Map();

    constructor() { }

    public subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): void {
        console.log(`eventType: `, eventType);
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, []);
        }
        this.handlers.get(eventType)!.push(handler);
    }

    public async publish(event: DomainEvent): Promise<void> {
        const handlers = this.handlers.get(event.eventName);
        if (handlers) {
            for (const handler of handlers) {
                await handler.handle(event);
            }
        }
    }

}