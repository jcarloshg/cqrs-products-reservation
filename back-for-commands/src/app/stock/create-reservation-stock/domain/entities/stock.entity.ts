import { AggregateRoot } from "@/app/shared/domain/domain-events/aggregate-root";
import { ModelError } from "@/app/shared/domain/errors/models.error";
import z from "zod";

const StockPropsSchema = z.object({
    uuid: z.uuid(),
    product_uuid: z.uuid(),
    available_quantity: z.number().int().nonnegative(),
    reserved_quantity: z.number().int().nonnegative(),
});
export type StockProps = z.infer<typeof StockPropsSchema>;

export class Stock extends AggregateRoot {
    private readonly stockProps: StockProps;

    constructor(props: StockProps) {
        super();
        this.stockProps = props;
    }

    public get props(): StockProps {
        return this.stockProps;
    }

    public static create(props: StockProps): Stock {
        const stock = new Stock(props);
        return stock;
    }

    public static parse(data: { [key: string]: any }): StockProps {
        const parsed = StockPropsSchema.safeParse(data);
        if (parsed.success === false) throw new ModelError("Product", parsed.error);
        return parsed.data;
    }
}
