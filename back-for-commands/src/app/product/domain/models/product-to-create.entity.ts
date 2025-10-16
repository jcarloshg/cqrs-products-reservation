import { z } from "zod";
import { ZodError } from "@/app/shared/domain/errors/zod.error";
import { AggregateRoot } from "@/app/shared/domain/domain-events/aggregate-root";
import { CreateProductDomainEvent } from "../domain-events/create-product.domain-event";

const ProductToCreateScheme = z.object({
    uuid: z.uuid(),
    name: z.string(),
    description: z.string(),
    sku: z.string(),
});
export type ProductToCreateProps = z.infer<typeof ProductToCreateScheme>;

export class ProductToCreate extends AggregateRoot {
    private readonly productToCreateProps: ProductToCreateProps;

    constructor(props: ProductToCreateProps) {
        super();
        this.productToCreateProps = props;
    }

    public getProps(): ProductToCreateProps {
        return this.productToCreateProps;
    }

    public static create(props: ProductToCreateProps): ProductToCreate {
        const newProductToCreate = new ProductToCreate(props);
        const domainEvent = new CreateProductDomainEvent({
            uuid: props.uuid,
            name: props.name,
            description: props.description,
            sku: props.sku,
        });
        newProductToCreate.record(domainEvent);
        return newProductToCreate;
    }

    public static parse(data: { [key: string]: any }): ProductToCreateProps {
        const parsed = ProductToCreateScheme.safeParse(data);
        if (parsed.success === false) throw new ZodError("Product", parsed.error);
        return parsed.data;
    }
}
