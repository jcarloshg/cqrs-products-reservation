import { Command } from "@/app/shared/domain/domain-events/command";
import { OwnZodError } from "@/app/shared/domain/errors/zod.error";
import { z } from "zod";

export const schema = z.object({
    product: z.object({
        uuid: z.string(),
        quantity: z.number(),
    }),
});

export type ReplenishStockCommandProps = z.infer<typeof schema>;

export class ReplenishStockCommand implements Command {

    public readonly props: ReplenishStockCommandProps

    constructor(props: { [key: string]: any }) {
        // this.props = props;
        const parsed = schema.safeParse(props);
        if (parsed.success === false) {
            throw new OwnZodError("ReplenishStockCommand", parsed.error);
        }
        this.props = parsed.data;
    }

    public static get COMMAND_NAME(): string {
        return "UC-002.REPLENISH_STOCK_COMMAND";
    }

    getProductUuid(): string {
        return this.props.product.uuid;
    }

    getQuantity() {
        return this.props.product.quantity;
    }
}