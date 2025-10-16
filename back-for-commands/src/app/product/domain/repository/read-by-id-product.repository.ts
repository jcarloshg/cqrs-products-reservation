import { Product } from "../models/product.model";

export interface ReadByIdProductRepository {
  run(data: string): Promise<Product>;
}