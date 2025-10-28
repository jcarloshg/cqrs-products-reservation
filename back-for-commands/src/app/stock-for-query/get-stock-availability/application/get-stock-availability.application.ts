import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { GetStockAvailabilityUseCase } from "../domain/get-stock-availability.use-case";
import { StockCrudPostgres } from "@/app/shared/infrastructure/repository/postgres/stock.crud-postgres";
import { OwnZodError } from "@/app/shared/domain/errors/zod.error";
import { GetStockAvailabilityCommand } from "../domain/command/get-stock-availability.command";

export type RequestProps = {
    product: {
        product_uuid: string;
    }
};

export class GetStockAvailabilityApplication {

    constructor() { }

    public async run(props: RequestProps): Promise<CustomResponse<any>> {
        try {

            const command = new GetStockAvailabilityCommand(props);

            // ─────────────────────────────────────
            // init services
            // ─────────────────────────────────────

            // repositories
            const stockCrudPostgres = new StockCrudPostgres();

            // ─────────────────────────────────────
            // use case
            // ─────────────────────────────────────
            const useCase = new GetStockAvailabilityUseCase(stockCrudPostgres);
            const res = await useCase.run(command);
            return res;

        } catch (error) {
            if (error instanceof OwnZodError) return error.toCustomResponse();
            return CustomResponse.internalServerError();
        }
    }
}