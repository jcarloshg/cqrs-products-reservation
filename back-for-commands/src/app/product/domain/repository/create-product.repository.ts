import { Product, ProductToCreateRepo } from "../models/product.model";

export interface CreateProductRepository {
  run(data: ProductToCreateRepo): Promise<Product>;
}