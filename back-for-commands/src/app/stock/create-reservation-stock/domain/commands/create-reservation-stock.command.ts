import z from "zod";
import { Command } from "@/app/shared/domain/domain-events/command";
import { OwnZodError } from "@/app/shared/domain/errors/zod.error";

export class CreateReservationStockCommand implements Command {
    public readonly createReservationStockCommandProps: CreateReservationStockCommandProps;

    constructor(props: { [key: string]: any }) {
        const parsed = CommanSchema.safeParse(props);
        if (parsed.success === false)
            throw new OwnZodError("CreateReservationStockCommand", parsed.error);
        this.createReservationStockCommandProps = parsed.data;
    }

    public static get COMMAND_NAME(): string {
        return "CreateReservationStockCommand";
    }
}

const CommanSchema = z.object({
    uuid: z.uuid(),
    ownerUuid: z.uuid(),
    productId: z.uuid(),
    quantity: z.number().min(1),
    status: z.enum(["PENDING"]),
    expiresAt: z.date(),
});
export type CreateReservationStockCommandProps = z.infer<typeof CommanSchema>;
