export abstract class DomainEvent {
    public abstract readonly eventName: string;
    public readonly eventUuid = crypto.randomUUID();
    public readonly occurredOn: Date;
    public readonly aggregateId?: string;

    protected constructor(aggregateId?: string) {
        this.occurredOn = new Date();
        this.aggregateId = aggregateId;
    }

    public static get eventName(): string {
        return this.prototype.eventName;
    }
}
