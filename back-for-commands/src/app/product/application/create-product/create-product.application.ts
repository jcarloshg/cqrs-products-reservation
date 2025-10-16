import { ProductToCreate } from "@/app/product/domain/models/product-to-create.entity";
import { CreateProductCommandHandler } from "./commands/create-product.command-handler";
import { CustomResponse } from "@/app/shared/domain/model/custom-response.model";
import { CreateProductCommand } from "./commands/create-product.command";

export interface CreateProductRequest {
  data: { [key: string]: any };
}

export interface CreateProductResponse {
  entityCreated: ProductToCreate;
}

export class CreateProductApplication {
  private readonly createProductCommandHandler: CreateProductCommandHandler;

  constructor(createProductCommandHandler: CreateProductCommandHandler) {
    this.createProductCommandHandler = createProductCommandHandler;
  }

  public async run(
    request: CreateProductRequest
  ): Promise<CustomResponse<CreateProductResponse | undefined>> {
    try {

      // 1. valid request body
      const productData = request.data;
      const productToCreateProps = ProductToCreate.parse(productData);
      const productToCreate = ProductToCreate.create(productToCreateProps);

      // 2. create command & handle it
      const createProductCommand = new CreateProductCommand({
        description: productToCreateProps.description,
        name: productToCreateProps.name,
        sku: productToCreateProps.sku,
        uuid: productToCreateProps.uuid,
      });

      // 3. handle command
      await this.createProductCommandHandler.handler(createProductCommand);

      // 4. return response
      const createProductResponse: CreateProductResponse = {
        entityCreated: productToCreate,
      }
      return CustomResponse.created(createProductResponse);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return CustomResponse.badRequest(
        `CreateProductApplication - ${errorMessage}`
      );
    }
  }
}
