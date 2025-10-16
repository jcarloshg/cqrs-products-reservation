import { Product, ProductToUpdate } from "../models/product.model";

export interface UpdateProductRepository {
  run(identifier: string, data: ProductToUpdate): Promise<Product>;
}