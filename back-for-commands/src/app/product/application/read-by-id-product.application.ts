import { ProductToRead } from "@/app/product/domain/models/product.model";
import { ReadByIdProductRepository } from "@/app/product/domain/repository/read-by-id-product.repository";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";

export interface ReadProductRequest {
    identifier: string
}

export interface ReadProductResponse {
    entity: ProductToRead
}

export class ReadProductApplication {
  constructor(
    private readonly readByIdProductRepository: ReadByIdProductRepository
  ) {}

  public async run(
    request: ReadProductRequest
  ): Promise<CustomResponse<ReadProductResponse | undefined>> {
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