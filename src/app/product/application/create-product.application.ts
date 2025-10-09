import { randomUUID } from "crypto"

import {
  Product,
  ProductToCreateRepo,
  ProductValidator,
} from "@/app/product/domain/models/product.model";
import { CreateProductRepository } from "@/app/product/domain/repository/create-product.repository";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";

export interface CreateProductRequest {
  data: { [key: string]: any };
}

export interface CreateProductResponse {
  entityCreated: Product;
}

export class CreateProductApplication {
  constructor(
    private readonly createProductRepository: CreateProductRepository
  ) { }

  public async run(
    request: CreateProductRequest
  ): Promise<CustomResponse<CreateProductResponse | undefined>> {
    try {
      const productToCreate = ProductValidator.toCreate(request.data);
      const productToCreateRepo: ProductToCreateRepo = {
        uuid: randomUUID(),
        name: productToCreate.name,
        description: productToCreate.description,
        sku: productToCreate.sku,
      };
      const productCreated = await this.createProductRepository.run(productToCreateRepo);
      const createProductResponse: CreateProductResponse = {
        entityCreated: productCreated,
      };
      return CustomResponse.ok(createProductResponse, "Success message");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return CustomResponse.badRequest(`CreateProductApplication - ${errorMessage}`);
    }
  }
}
