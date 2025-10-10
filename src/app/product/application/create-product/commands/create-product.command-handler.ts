import { CreateProductRepository } from "@/app/product/domain/repository/create-product.repository";
import { ProductToCreate } from "@/app/product/domain/models/product-to-create.entity";
import { CommandHandler } from "@/app/shared/domain/domain-events/command-handler";
import { EventPublisher } from "@/app/shared/domain/domain-events/event-publisher";
import { CreateProductCommand } from "./create-product.command";

export class CreateProductCommandHandler implements CommandHandler<CreateProductCommand> {

    private readonly createProductRepository: CreateProductRepository;
    private eventPublisher: EventPublisher;

    constructor(
        createProductRepository: CreateProductRepository,
        eventPublisher: EventPublisher,
    ) {
        this.createProductRepository = createProductRepository;
        this.eventPublisher = eventPublisher;
    }

    public async handler(command: CreateProductCommand): Promise<void> {
        try {
            // create product according the business logic
            const productToCreate = ProductToCreate.create(command);

            // persist the product on DB
            await this.createProductRepository.run(productToCreate.getProps());

            // publish domain events
            const domainEvents = productToCreate.pullDomainEvents();
            await this.eventPublisher.publishAll(domainEvents);

        } catch (error) {
            throw new Error("Error creating product");
        }
    }
}
