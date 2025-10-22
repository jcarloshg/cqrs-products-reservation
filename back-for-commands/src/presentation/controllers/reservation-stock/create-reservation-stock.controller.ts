import { Request, Response } from "express";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { CreateReservationStockApplication } from "@/app/stock/create-reservation-stock/application/create-reservation-stock.application";

export const createReservationStockController = async (
    req: Request,
    res: Response
) => {
    try {
        const createReservationStockApplication = new CreateReservationStockApplication();
        const response = await createReservationStockApplication.run({
            body: req.body,
        });
        res.status(response.code).json(response);
    } catch (error) {
        const response =
            CustomResponse.internalServerError().toCommandHandlerResp();
        res.status(response.code).json(response);
    }
};
