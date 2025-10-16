import { CreateProductCommandHandler } from "@/app/product/application/create-product/commands/create-product.command-handler";
import {
    CreateProductApplication,
    CreateProductRequest,
} from "@/app/product/application/create-product/create-product.application";
import { SendEmailToOwnerEventHandler } from "@/app/product/application/create-product/events/send-email-to-owner.event-handler";
import { CreateProductInMemory } from "@/app/product/infra/in-memory/create-product.in-memory";
import { EventPublisherInMemory } from "@/app/product/infra/in-memory/even-publisher.in-memory";
import { EventBusInMemory } from "@/app/product/infra/in-memory/event-bus.in-memeory";

describe("create-product.application.test", () => {
    it("should run", async () => {
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
        const createProductRequest: CreateProductRequest = {
            data: {
                description: "Product description",
                name: "Product name",
                sku: "Product sku",
                uuid: crypto.randomUUID(),
            },
        };
        const createProductRes = await createProductApp.run(createProductRequest);
        expect(createProductRes.code).toBe(201);
        expect(createProductRes.data).toBeDefined();
    });
});
