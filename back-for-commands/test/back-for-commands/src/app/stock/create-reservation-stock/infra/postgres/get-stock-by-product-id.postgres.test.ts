import { GetStockByProductIdPostgres } from "@/app/stock/create-reservation-stock/infra/postgres/get-stock-by-product-id.postgres";

describe('get-stock-by-product-id.postgres.test', () => {
    it('should get stock by product id', async () => {
        const productUUid = "c2ab0d1f-dda8-4d73-bf39-88204de82c56";
        const getStockByProductIdPostgres = new GetStockByProductIdPostgres();
        const stock = await getStockByProductIdPostgres.findById(productUUid);
        expect(stock).toBeDefined();
        expect(stock?.getProps()).toBeDefined();
        expect(stock?.getProps().product_uuid).toBe(productUUid);
    });
});