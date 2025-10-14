import { ProductToDelete } from "../models/product.model";

export interface DeleteProductByCursorRepository {
  run(data: ProductToDelete): Promise<boolean>;
}