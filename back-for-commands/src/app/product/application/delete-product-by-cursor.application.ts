import { ProductToDelete } from "@/app/product/domain/models/product.model";
import { DeleteProductByCursorRepository } from "@/app/product/domain/repository/delete-product-by-cursor.repository";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";

export interface DeleteProductRequest {
    data: ProductToDelete
}

export interface DeleteProductResponse {
    wasDeleted: boolean
}

export class DeleteProductApplication {
  constructor(
    private readonly deleteProductRepository: DeleteProductByCursorRepository
  ) {}

  public async run(
    request: DeleteProductRequest
  ): Promise<CustomResponse<DeleteProductResponse | undefined>> {
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