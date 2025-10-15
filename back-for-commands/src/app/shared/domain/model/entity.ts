import { DomainEvent } from "@/app/shared/domain/domain-events/domain-event";
import { AggregateRoot } from "@/app/shared/domain/domain-events/aggregate-root";

// ─────────────────────────────────────
// ─────────────────────────────────────
// Entity Domain
// ─────────────────────────────────────
// ─────────────────────────────────────

export interface EntityDomain<T> {
    getProps(): Readonly<T>;
    getAggregateRoot(): AggregateRoot;
}

// ─────────────────────────────────────
// ─────────────────────────────────────
// Entity Props
// ─────────────────────────────────────
// ─────────────────────────────────────

export class CreateEntityDomain<T> extends DomainEvent {
    public readonly eventName = "entity.created";
    public readonly data: T;
    constructor(data: T) {
        super();
        this.data = data;
    }
}

export class UpdateEntityDomain<T> extends DomainEvent {
    public readonly eventName = "entity.updated";
    public readonly data: T;
    constructor(data: T) {
        super();
        this.data = data;
    }
}

export class EntityProps<T> {
    private _aggregateRoot: AggregateRoot;
    private _props: T;
    private _validFn: (props: T) => boolean;

    constructor(props: T, validFn: (props: T) => boolean) {
        this._aggregateRoot = new AggregateRoot();
        this._validFn = validFn;
        this._create(props);
        this._props = props;
    }

    private _create(props: T): void {
        this._validFn(props);
        // record domain event
        const domainEvent = new CreateEntityDomain<T>(props);
        this._aggregateRoot.recordDomainEvent(domainEvent);
    }

    public getCopy(): Readonly<T> {
        // immutability
        return Object.freeze({ ...this._props });
    }

    public update(value: Partial<T>) {
        // 1. validate the new props
        const updatedProps = { ...this._props, ...value };
        this._validFn(updatedProps);
        this._props = updatedProps;
        // 2. record domain event
        const domainEvent = new UpdateEntityDomain<T>(updatedProps);
        this._aggregateRoot.recordDomainEvent(domainEvent);
    }

    public getAggregateRoot(): AggregateRoot {
        return this._aggregateRoot;
    }
}
