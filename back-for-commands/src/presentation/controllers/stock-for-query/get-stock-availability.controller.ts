import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { GetStockAvailabilityApplication, RequestProps } from "@/app/stock-for-query/get-stock-availability/application/get-stock-availability.application";
import { Request, Response } from "express";
import { wss } from "../../routes/websocket-instance";

export const GetStockAvailabilityController = async (
    req: Request,
    res: Response
) => {
    try {
        const application = new GetStockAvailabilityApplication();
        const requestProps: RequestProps = {
            product: {
                product_uuid: req.params.product_uuid
            }
        }
        const response = await application.run(requestProps);
        res.status(response.code).json(response);

        // Broadcast stock availability to WebSocket clients
        if (wss && (wss as any).broadcastStockAvailability) {
            (wss as any).broadcastStockAvailability(req.params.product_uuid, response);
        }
    } catch (error) {
        const response = CustomResponse.internalServerError().toCommandHandlerResp();
        res.status(response.code).json(response);
    }
}