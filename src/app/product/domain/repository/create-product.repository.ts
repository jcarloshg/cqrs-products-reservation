import { Product, ProductToCreate } from "../models/product.model";

export interface CreateProductRepository {
  run(data: ProductToCreate): Promise<Product>;
}