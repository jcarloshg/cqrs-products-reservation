import { Request, Response } from "express";
// domain
import { CreateReservationStockCommand } from "@/app/stock/create-reservation-stock/domain/commands/create-reservation-stock.command";
import { CreateReservationStockCommandHandler } from "@/app/stock/create-reservation-stock/domain/commands/create-reservation-stock.command-handler";
import { CreateReservationStockDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/create-reservation-stock.doamin-event";
import { StockIncreaseReservationQuantityDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/stock-increase-reservation-quantity.domain-event";
// infra
import { CreateReservationStockPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/create-reservation-stock.postgres";
import { UpdateReservedStockPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/update-reserved-stock.postgres";
import { GetStockByProductIdPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/get-stock-by-product-id.postgres";
import { GetUserByUuidPostgress } from "@/app/stock/create-reservation-stock/infra/postgres/get-user-by-uuid.postgres";
import { SendEmailInMemory } from "@/app/stock/create-reservation-stock/infra/in-memory/send-email.in-memory";
// application
import { NotifyReservationOwnerEventHandler } from "@/app/stock/create-reservation-stock/domain/domain-events/handlers/notify-reservation-owner.event-handler";
import { NotifyStockUpdatedEventHandler } from "@/app/stock/create-reservation-stock/domain/domain-events/handlers/notify-stock-updated.event-hanlder";
import { NotifyStoreEventHandler } from "@/app/stock/create-reservation-stock/domain/domain-events/handlers/notify-store.event-handler";
// shared - domain
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { DomainError } from "@/app/shared/domain/errors/domain.error";
// shared - infrastructure
import { EventBusOwn } from "@/app/shared/infrastructure/domain-events/own-domain-events/event-bus.own";
import { EventPublisherOwn } from "@/app/shared/infrastructure/domain-events/own-domain-events/event-publisher.own";
import { CreateReservationStockApplication } from "@/app/stock/create-reservation-stock/application/create-reservation-stock.application";


export const createReservationStockController = async (
    req: Request,
    res: Response
) => {
    try {

        const createReservationStockApplication = new CreateReservationStockApplication();
        const response = await createReservationStockApplication.run({ body: req.body });
        res.status(response.code).json(response);

    } catch (error) {
        const response = CustomResponse.internalServerError().toCommandHandlerResp();
        res.status(response.code).json(response);
    }
};
