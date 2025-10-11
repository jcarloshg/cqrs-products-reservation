import { DomainEvent } from "@/app/shared/domain/domain-events/domain-event";

export interface CreateProductDomainEventProps {
    uuid: string;
    name: string;
    description: string;
    sku: string;
}

export class CreateProductDomainEvent extends DomainEvent {
    public readonly _eventName = "product.created";
    public readonly uuid: string;
    public readonly name: string;
    public readonly description: string;
    public readonly sku: string;

    constructor(props: CreateProductDomainEventProps) {
        super(props.uuid);
        this.uuid = props.uuid;
        this.name = props.name;
        this.description = props.description;
        this.sku = props.sku;
    }
}
