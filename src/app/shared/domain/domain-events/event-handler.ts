import { DomainEvent } from "./domain-event";

export interface EventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

export interface EventBus {
  handlers: Map<string, EventHandler<any>[]>;
  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): void;
  publish(event: DomainEvent): Promise<void>;
}
