import { ProductValidator, ProductToCreate } from "@/app/product/domain/models/product.model"

describe('product.model.test', () => {
    it('should return an instance of ProductToCreate', () => {
        const result: ProductToCreate = ProductValidator.toCreate({
            name: "Product 1",
            description: "Description 1",
            sku: "SKU001"
        });
        expect(result).toBeInstanceOf(Object);
        expect(result).toHaveProperty("name", "Product 1");
        expect(result).toHaveProperty("description", "Description 1");
        expect(result).toHaveProperty("sku", "SKU001");
    })
})