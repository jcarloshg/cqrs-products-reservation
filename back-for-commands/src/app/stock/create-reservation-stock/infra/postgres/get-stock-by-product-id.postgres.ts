import { StockForDB } from "@/app/shared/infrastructure/repository/postgres/models.sequelize";
import { GetStockByProductIdRepository } from "@/app/stock/create-reservation-stock/domain/services/repository/get-stock-by-product-id.repository";
import { Stock } from "@/app/stock/create-reservation-stock/domain/entities/stock.entity";

export class GetStockByProductIdPostgres implements GetStockByProductIdRepository {
    constructor() { }

    public async findById(id: string): Promise<Stock | null> {
        try {
            const stockRaw = await StockForDB.findOne({
                where: { product_uuid: id },
            });
            if (!stockRaw?.dataValues) throw new Error("Stock not found");
            const stockReturn = new Stock({
                uuid: stockRaw.dataValues.uuid,
                product_uuid: stockRaw.dataValues.product_uuid,
                available_quantity: stockRaw.dataValues.available_quantity,
                reserved_quantity: stockRaw.dataValues.reserved_quantity,
            });
            return stockReturn;
        } catch (error) {
            console.error("Error finding stock by product ID:", error);
            return null;
        }
    }
}
