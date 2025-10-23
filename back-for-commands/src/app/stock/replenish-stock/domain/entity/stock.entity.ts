import z from "zod";

const StockPropsSchema = z.object({
    uuid: z.uuid(),
    product_uuid: z.uuid(),
    available_quantity: z.number().int().nonnegative(),
    reserved_quantity: z.number().int().nonnegative(),
});
export type StackEntityProps = z.infer<typeof StockPropsSchema>;

export class StackEntity {

    private readonly _props: StackEntityProps;

    constructor(data: { [key: string]: any }) {
        const parsed = StockPropsSchema.safeParse(data);
        if (parsed.success === false) throw new Error("Invalid stock entity data");
        this._props = parsed.data;
    }

    getPropsCopy(): Readonly<StackEntityProps> {
        return { ...this._props };
    }

    updateAvailableQuantity(quantityToAdd: number) {
        if (quantityToAdd <= 0) throw new Error("Quantity to add must be greater than zero.");
        const available_quantity = this._props.available_quantity;
        const newAvailableQuantity = available_quantity + quantityToAdd;
        if (newAvailableQuantity < 0) throw new Error("Available quantity cannot be negative.");
        this._props.available_quantity = newAvailableQuantity;
    }

}