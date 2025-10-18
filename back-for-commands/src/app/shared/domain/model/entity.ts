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
    // fromPrimitives(props: { [key: string]: any }): EntityDomain<T>;
}

// export class EntityDomainV2<T> {
//     private readonly _entityProps: EntityProps<T>;
//     constructor(props: EntityPropsRawData) {
//         const parsedProps = this.parse<T>(props);
//         this._entityProps = new EntityProps<T>(
//             parsedProps,
//             EntityDomainV2.parse
//         );
//     }
//     public getProps(): Readonly<T> {
//         return this._entityProps.getCopy();
//     }

//     public getAggregateRoot(): AggregateRoot {
//         return this._entityProps.getAggregateRoot();
//     }

//     public parse<T>(data: EntityPropsRawData): T {
//         throw new Error("EntityDomainV2.parse - Method not implemented.");
//     }

//     public update(value: Partial<T>) {
//         this._entityProps.update(value);
//     }
// }

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

export type EntityPropsRawData = { [key: string]: any };
export type EntityPropsValidator<T> = (props: EntityPropsRawData) => T;


export class EntityProps<T> {
    private _aggregateRoot: AggregateRoot;
    private _props: T;
    private _validFn: EntityPropsValidator<T>;

    constructor(
        props: { [key: string]: any },
        validFn: EntityPropsValidator<T>
    ) {
        this._aggregateRoot = new AggregateRoot();
        this._validFn = validFn;
        const parsed = this._validFn(props);
        this._create(parsed);
        this._props = parsed;
    }

    private _create(props: T): void {
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
