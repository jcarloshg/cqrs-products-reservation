import { CreateProductCommandHandler } from "@/app/product/application/create-product/commands/create-product.command-handler";
import { SendEmailToOwnerEventHandler } from "@/app/product/application/create-product/events/send-email-to-owner.event-handler";
import { CreateProductInMemory } from "@/app/product/infra/in-memory/create-product.in-memory";
import { EventPublisherInMemory } from "@/app/product/infra/in-memory/even-publisher.in-memory";
import { EventBusInMemory } from "@/app/product/infra/in-memory/event-bus.in-memeory";
import { CreateProductsController } from "@/presentation/controllers/products/create-products.controller";

describe("create-products.controller.test", () => {
    it("should works", async () => {
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

        const createProductsController = new CreateProductsController(
            createProductCommandHandler
        );

        // mock request & response
        const request: any = {
            body: {
                uuid: crypto.randomUUID(),
                description: "Product description",
                name: "Product name",
                sku: "Product sku",
            },
        };
        const response: any = {
            status: (code: number) => {
                return {
                    json: (data: any) => {
                        return { code, data };
                    },
                };
            },
        };

        const responseService = await createProductsController.run(request, response);
        console.log(`responseService: `, responseService);

        expect(createProductsController).toBeDefined();
        expect(createProductsController.run).toBeDefined();
        expect(responseService).toBeDefined();
    });
});
