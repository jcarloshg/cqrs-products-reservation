import { Product, ProductToUpdate } from "@/app/product/domain/models/product.model";
import { UpdateProductRepository } from "@/app/product/domain/repository/update-product.repository";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";

export interface UpdateProductRequest {
    identifier: string,
    data: ProductToUpdate
}

export interface UpdateProductResponse {
    entity: Product
}

export class UpdateProductApplication {
  constructor(
    private readonly updateProductRepository: UpdateProductRepository
  ) {}

  public async run(
    request: UpdateProductRequest
  ): Promise<CustomResponse<UpdateProductResponse | undefined>> {
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