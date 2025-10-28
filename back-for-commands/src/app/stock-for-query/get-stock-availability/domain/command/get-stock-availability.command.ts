import { Command } from "@/app/shared/domain/domain-events/command";
import { z } from 'zod';

export const GetStockAvailabilityRequestSchema = z.object({
    product: z.object({
        product_uuid: z.uuid()
    })
});

export type GetStockAvailabilityRequest = z.infer<typeof GetStockAvailabilityRequestSchema>;

export class GetStockAvailabilityCommand implements Command {

    public readonly props: GetStockAvailabilityRequest;

    constructor(props: { [key: string]: any }) {
        const parsed = GetStockAvailabilityRequestSchema.safeParse(props);
        if (parsed.success === false) {
            throw new Error("Invalid GetStockAvailabilityCommand data");
        }
        this.props = parsed.data;
    }

    public static get COMMAND_NAME(): string {
        return "UC-004.GET_STOCK_AVAILABILITY";
    }
}