import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { ConfirmReservationApplication } from "@/app/stock/confirm-reservation/application/confirm-reservation.application";
import { Request, Response } from "express";

export const ConfirmReservationController = async (
    req: Request,
    res: Response
) => {
    try {
        const application = new ConfirmReservationApplication();
        const response = await application.run({ body: req.body });
        res.status(response.code).json(response);
    } catch (error) {
        const response = CustomResponse.internalServerError().toCommandHandlerResp();
        res.status(response.code).json(response);

    }
}