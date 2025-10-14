import { Request, Response } from "express";
import { CreateProductCommandHandler } from "@/app/product/application/create-product/commands/create-product.command-handler";
import { CreateProductApplication } from "@/app/product/application/create-product/create-product.application";
import { SendEmailToOwnerEventHandler } from "@/app/product/application/create-product/events/send-email-to-owner.event-handler";
import { CreateProductInMemory } from "@/app/product/infra/in-memory/create-product.in-memory";
import { EventPublisherInMemory } from "@/app/product/infra/in-memory/even-publisher.in-memory";
import { EventBusInMemory } from "@/app/product/infra/in-memory/event-bus.in-memeory";

export const createProductsController = async (req: Request, res: Response) => {
    try {

        // ─────────────────────────────────────
        // TODO: ADD A LAYER TO DETECT THE ENVIRONMENT
        // IF IT IS TEST, MOCK THE REPOSITORY AND EVENT BUS
        // IF IT IS DEV OR PROD, USE THE REAL ONES
        // THIS IS JUST A DEMO, SO WE WILL USE IN-MEMORY IMPLEMENTATIONS
        // FOR ALL ENVIRONMENTS
        // NOTE: THIS IS NOT A GOOD PRACTICE, BUT IT IS JUST A DEMO
        // ─────────────────────────────────────

        // init all services(repositories)
        const createProductRepository = new CreateProductInMemory();

        // init event handler
        const eventBus = new EventBusInMemory();
        eventBus.subscribe("product.created", new SendEmailToOwnerEventHandler());
        const eventPublisher = new EventPublisherInMemory(eventBus);

        // init command handlers
        const createProductCommandHandler = new CreateProductCommandHandler(
            createProductRepository,
            eventPublisher
        );

        // run the use case
        const createProductApp = new CreateProductApplication(
            createProductCommandHandler
        );
        const createProductRes = await createProductApp.run({ data: req.body });
        res.status(createProductRes.code).json(createProductRes);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
