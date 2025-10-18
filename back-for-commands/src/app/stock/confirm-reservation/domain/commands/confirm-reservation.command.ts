import z from "zod";
import { ReservationStatus } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";
import { OwnZodError } from "@/app/shared/domain/errors/zod.error";
import { Command } from "@/app/shared/domain/domain-events/command";

export class ConfirmReservationCommand implements Command {
    
    public readonly COMMAND_NAME: string = "ConfirmReservationCommand";
    public data: ConfirmReservationCommandProps;

    constructor(props: { [key: string]: any }) {
        const parsed = schema.safeParse(props);
        if (parsed.success === false) {
            throw new OwnZodError("ConfirmReservationCommand", parsed.error);
        }
        this.data = parsed.data;
    }
}

const schema = z.object({
    uuid: z.uuid(),
    productId: z.uuid(),
    newStatus: z.enum([ReservationStatus.CONFIRMED]),
});
export type ConfirmReservationCommandProps = z.infer<typeof schema>;
