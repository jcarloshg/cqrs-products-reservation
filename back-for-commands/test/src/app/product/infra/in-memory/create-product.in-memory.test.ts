
import { randomUUID } from "crypto"

import { ProductToCreateRepo } from "@/app/product/domain/models/product.model"
import { CreateProductInMemory } from "@/app/product/infra/in-memory/create-product.in-memory"

describe('create-product.in-memory.test', () => {
    it('should run', async () => {
        const product: ProductToCreateRepo = {
            uuid: randomUUID(),
            name: "Product Name",
            description: "Product Description",
            sku: "Product SKU"
        }
        const service = new CreateProductInMemory()
        const result = await service.run(product)
        expect(result).toEqual(product)
    })
})