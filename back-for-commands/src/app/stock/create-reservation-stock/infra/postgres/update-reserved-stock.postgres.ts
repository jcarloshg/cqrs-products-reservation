import { StockForDB } from "./models.sequelize";
import {
    UpdateReservedStockRepository,
    UpdateStockProps,
} from "@/app/stock/create-reservation-stock/domain/repository/update-reserved-stock.repository";
import { StockProps } from "@/app/stock/create-reservation-stock/domain/entities/stock.entity";

export class UpdateReservedStockPostgres extends UpdateReservedStockRepository {
    constructor() {
        super();
    }

    public async run(
        id: string,
        entity: UpdateStockProps
    ): Promise<StockProps | null> {
        try {
            // Update the stock record with the new reserved quantity
            const [updatedRowsCount] = await StockForDB.update(
                {
                    reserved_quantity: entity.quantity,
                },
                {
                    where: { uuid: id },
                    returning: false, // PostgreSQL supports returning, but we'll fetch separately for consistency
                }
            );

            // Check if any rows were updated
            if (updatedRowsCount === 0) {
                console.warn(`No stock record found with id: ${id}`);
                return null;
            }

            // Fetch and return the updated record
            const updatedStock = await StockForDB.findByPk(id);

            if (!updatedStock?.dataValues) {
                console.error(`Failed to retrieve updated stock record with id: ${id}`);
                return null;
            }

            // Return the updated stock data in the expected format
            return {
                uuid: updatedStock.dataValues.uuid,
                product_uuid: updatedStock.dataValues.product_uuid,
                available_quantity: updatedStock.dataValues.available_quantity,
                reserved_quantity: updatedStock.dataValues.reserved_quantity,
            };
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            console.error("Error in UpdateReservedStockPostgres:", errorMessage);
            return null;
        }
    }
}
