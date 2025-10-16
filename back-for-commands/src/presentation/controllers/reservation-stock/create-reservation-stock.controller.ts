import { Request, Response } from "express";
import { CreateReservationStockCommandHandler } from "@/app/stock/create-reservation-stock/application/create-reservation-stock.command-hanlder";
import { CreateReservationStockPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/create-reservation-stock.postgres";
import { GetStockByProductIdPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/get-stock-by-product-id.postgres";
import { UpdateReservedStockPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/update-reserved-stock.postgres";
import { EventBusOwn } from "@/app/shared/infrastructure/domain-events/own-domain-events/event-bus.own";
import { EventPublisherOwn } from "@/app/shared/infrastructure/domain-events/own-domain-events/event-publisher.own";
import { CreateReservationStockDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/create-reservation-stock.doamin-event";
import { NotifyReservationOwnerEventHandler } from "@/app/stock/create-reservation-stock/application/events/notify-reservation-owner.event-handler";
import { StockIncreaseReservationQuantityDomainEvent } from "@/app/stock/create-reservation-stock/domain/domain-events/stock-increase-reservation-quantity.domain-event";
import { NotifyStockUpdatedEventHandler } from "@/app/stock/create-reservation-stock/application/events/notify-stock-updated.event-hanlder";
import { NotifyStoreEventHandler } from "@/app/stock/create-reservation-stock/application/events/notify-store.event-handler";
import { CreateReservationStockCommand } from "@/app/stock/create-reservation-stock/application/commands/create-reservation-stock.command";
import { DomainError } from "@/app/shared/domain/errors/domain.error";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";

export const createReservationStockController = async (
    req: Request,
    res: Response
) => {
    try {
        const { body } = req;
        const command: CreateReservationStockCommand =
            new CreateReservationStockCommand({ ...body });

        // ─────────────────────────────────────
        // init all services(repositories)
        // ─────────────────────────────────────
        const createReservationStockPostgres = new CreateReservationStockPostgres();
        const updateReservedStockPostgres = new UpdateReservedStockPostgres();
        const getStockByProductIdPostgres = new GetStockByProductIdPostgres();

        // ─────────────────────────────────────
        // init event handlers
        // ─────────────────────────────────────
        const eventBusOwn = new EventBusOwn();
        const eventPublisherOwn = new EventPublisherOwn(eventBusOwn);
        eventBusOwn.subscribe(
            CreateReservationStockDomainEvent.eventName,
            new NotifyReservationOwnerEventHandler()
        );
        eventBusOwn.subscribe(
            StockIncreaseReservationQuantityDomainEvent.eventName,
            new NotifyStockUpdatedEventHandler()
        );
        eventBusOwn.subscribe(
            CreateReservationStockDomainEvent.eventName,
            new NotifyStoreEventHandler()
        );

        // ─────────────────────────────────────
        // init command handlers
        // ─────────────────────────────────────
        const createReservationStockCommandHandler =
            new CreateReservationStockCommandHandler(
                createReservationStockPostgres,
                getStockByProductIdPostgres,
                updateReservedStockPostgres,
                eventPublisherOwn
            );
        const result = await createReservationStockCommandHandler.handler(command);
        res.status(result.code).json(result);

    } catch (error) {
        if (error instanceof DomainError) {
            const response = error.toCustomResponse().toCommandHandlerResp();
            return res.status(response.code).json(response);
        }

        const response = CustomResponse.internalServerError().toCommandHandlerResp();
        res.status(response.code).json(response);
    }
};
