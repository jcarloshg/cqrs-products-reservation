import { DomainEvent } from "./domain-event";

export class AggregateRoot {
  private readonly _uuid = crypto.randomUUID();
  private domainEvents: Array<DomainEvent>;

  constructor() {
    this.domainEvents = [];
  }

  public getAggregateRootUUID(): string {
    return this._uuid;
  }

  public pullDomainEvents(): Array<DomainEvent> {
    const domainEvents = this.domainEvents.slice();
    this.domainEvents = [];
    return domainEvents;
  }

  public recordDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }
}
