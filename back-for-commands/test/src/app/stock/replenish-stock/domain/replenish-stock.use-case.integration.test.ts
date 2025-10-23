import { EventBus } from "@/app/shared/domain/domain-events/event-handler";
import { EventPublisher } from "@/app/shared/domain/domain-events/event-publisher";
import { StockCrudRepo } from "@/app/shared/domain/repository/stock.crud-repo";
import { EventBusOwn } from "@/app/shared/infrastructure/domain-events/own-domain-events/event-bus.own";
import { EventPublisherOwn } from "@/app/shared/infrastructure/domain-events/own-domain-events/event-publisher.own";
import { ProductAttributes, ProductForDB, sequelize, StockAttributes, StockForDB } from "@/app/shared/infrastructure/repository/postgres/models.sequelize";
import { StockCrudPostgres } from "@/app/shared/infrastructure/repository/postgres/stock.crud-postgres";
import { ReplenishStockCommand } from "@/app/stock/replenish-stock/domain/commands/replenish-stock.command";
import { StockQuantityUpdatedEventHandler } from "@/app/stock/replenish-stock/domain/domain-events/stock-quantity-updated.domain-event";
import { ReplenishStockUseCase } from "@/app/stock/replenish-stock/domain/replenish-stock.use-case";

describe('replenish-stock.use-case.test', () => {

    // setup dependencies
    let stockRepository: StockCrudRepo;
    let eventBus: EventBus;
    let eventPublisher: EventPublisher;
    let replenishStockUseCase: ReplenishStockUseCase;

    // setup test data
    let productForTest: ProductAttributes | null = null;
    let stockForTest: StockAttributes | null = null;

    beforeEach(async () => {
        // ─────────────────────────────────────
        // setup use case
        // ─────────────────────────────────────
        // set up event handlers
        eventBus = new EventBusOwn();
        eventPublisher = new EventPublisherOwn(eventBus);
        const stockQuantityUpdatedEventHandler = new StockQuantityUpdatedEventHandler();
        eventBus.subscribe(
            stockQuantityUpdatedEventHandler.subscribeTo(),
            stockQuantityUpdatedEventHandler
        );
        // repositories
        stockRepository = new StockCrudPostgres();
        // use case
        replenishStockUseCase = new ReplenishStockUseCase(
            stockRepository,
            eventPublisher
        );

        // ─────────────────────────────────────
        // setup test data
        // ─────────────────────────────────────
        productForTest = (
            await ProductForDB.create({
                name: "Test Product",
                description: "A product for testing",
                price: 100,
                uuid: crypto.randomUUID(),
            })
        ).dataValues;
        stockForTest = (
            await StockForDB.create({
                uuid: crypto.randomUUID(),
                product_uuid: productForTest.uuid,
                reserved_quantity: 50,
                available_quantity: 100,
            })
        ).dataValues
    });

    afterEach(async () => {
        // Clean up test data
        if (stockForTest !== null) {
            await StockForDB.destroy({ where: { uuid: stockForTest.uuid } });
        }
        if (productForTest !== null) {
            await ProductForDB.destroy({ where: { uuid: productForTest.uuid } });
        }
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should replenish stock successfully', async () => {
        // Arrange
        const command: ReplenishStockCommand = new ReplenishStockCommand({
            product: {
                uuid: productForTest!.uuid,
                quantity: 30,
            }
        });

        // Act
        const response = await replenishStockUseCase.run(command);

        // Assert
        expect(response).toBeDefined();
        expect(response.data).toBeDefined();
        expect(response.data?.stockUpdated).toBeDefined();
        expect(response.data?.stockUpdated?.available_quantity).toBe(130); // 100 + 30
    });

    it('should throw error if stock record not found for product', async () => {
        // Arrange
        const nonExistentProductUuid = 'non-existent-product-uuid';
        const command: ReplenishStockCommand = new ReplenishStockCommand({
            product: {
                uuid: nonExistentProductUuid,
                quantity: 10,
            }
        });

        // Act
        const resp = await replenishStockUseCase.run(command);
        // Assert
        expect(resp.code).toBe(404);
        expect(resp.message).toBe("Stock record not found for product.");
    });

    it('should throw error if replenish quantity is not greater than zero', async () => {
        // Arrange
        const command = new ReplenishStockCommand({
            product: {
                uuid: productForTest!.uuid,
                quantity: 0,
            }
        });

        // Act
        const resp = await replenishStockUseCase.run(command);
        // Assert
        expect(resp.code).toBe(400);
        expect(resp.message).toBe("Replenish quantity must be greater than zero.");
    });


})