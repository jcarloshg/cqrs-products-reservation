export abstract class DomainEvent {
    public abstract readonly _eventName: string;
    public readonly eventUuid = crypto.randomUUID();
    public readonly occurredOn: Date;
    public readonly aggregateId?: string;

    protected constructor(aggregateId?: string) {
        this.occurredOn = new Date();
        this.aggregateId = aggregateId;
    }

    static get eventName(): string {
        return this.prototype._eventName;
    }
}