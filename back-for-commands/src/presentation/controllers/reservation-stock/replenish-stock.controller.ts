import { Request, Response } from "express";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { ReplenishStockApplication } from "@/app/stock/replenish-stock/application/replenish-stock.application";

export const replenishStockController = async (
    req: Request,
    res: Response
) => {
    try {
        const application = new ReplenishStockApplication();
        const response = await application.run({ body: req.body ?? {} });
        res.status(response.code).json(response);
    } catch (error) {
        const response = CustomResponse.internalServerError().toCommandHandlerResp();
        res.status(response.code).json(response);

    }
}