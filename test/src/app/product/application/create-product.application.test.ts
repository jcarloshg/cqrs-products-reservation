import { randomUUID } from "crypto"

import {
    CreateProductApplication,
    CreateProductRequest,
    CreateProductResponse,
} from "@/app/product/application/create-product.application";
import { CreateProductInMemory } from "@/app/product/infra/in-memory/create-product.in-memory";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";

describe("create-product.application.test", () => {
    it("should run", async () => {
        // init services
        const createProductInMemory = new CreateProductInMemory();

        // run application
        const createProductRequest: CreateProductRequest = {
            data: {
                uuid: randomUUID(),
                name: "Product Name",
                description: "Product Description",
                sku: "Product SKU",
            },
        };
        const createProductApplication = new CreateProductApplication(
            createProductInMemory
        );
        const result: CustomResponse<CreateProductResponse | undefined> =
            await createProductApplication.run(createProductRequest);

        // assert
        expect(result).toBeDefined();
        expect(result.code).toEqual(200);
        expect(result.data).toBeDefined();
    });
});
