import { Command } from "@/app/shared/domain/domain-events/command";

export interface CreateProductCommandProps {
    uuid: string;
    name: string;
    description: string;
    sku: string;
}

export class CreateProductCommand implements Command {
    public readonly uuid: string;
    public readonly COMMAND_NAME: string;
    public readonly description: string;
    public readonly sku: string;

    constructor(props: CreateProductCommandProps) {
        this.uuid = props.uuid;
        this.COMMAND_NAME = props.name;
        this.description = props.description;
        this.sku = props.sku;
    }
}