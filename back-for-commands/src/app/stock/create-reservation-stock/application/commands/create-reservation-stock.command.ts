import z from "zod";
import { Command } from "@/app/shared/domain/domain-events/command";

const CreateReservationStockCommandSchema = z.object({
    uuid: z.uuid(),
    ownerUuid: z.uuid(),
    productId: z.uuid(),
    quantity: z.number().min(1),
    status: z.enum(["PENDING"]),
    expiresAt: z.date(),
});
export type CreateReservationStockCommandProps = z.infer<
    typeof CreateReservationStockCommandSchema
>;

export class CreateReservationStockCommand implements Command {
    public readonly createReservationStockCommandProps: CreateReservationStockCommandProps;

    constructor(props: { [key: string]: any }) {
        const parsed = CreateReservationStockCommandSchema.safeParse(props);
        if (parsed.success === false) throw new Error("The object is invalid.");
        this.createReservationStockCommandProps = parsed.data;
    }
}
