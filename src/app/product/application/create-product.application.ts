import { Product } from "@/app/product/domain/models/product.model";
import { CreateProductRepository } from "@/app/product/domain/repository/create-product.repository";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";

export interface CreateProductRequest {
    data: { [key: string]: any };
}

export interface CreateProductResponse {
    entityCreated: Product
}

export class CreateProductApplication {
  constructor(
    private readonly createProductRepository: CreateProductRepository
  ) {}

  public async run(
    request: CreateProductRequest
  ): Promise<CustomResponse<CreateProductResponse | undefined>> {
    try {
      // ─────────────────────────────────────
      // add business logic here
      // ─────────────────────────────────────

      return CustomResponse.ok(undefined, "Success message");
    } catch (error) {
      return CustomResponse.badRequest("Error message");
    }
  }
}