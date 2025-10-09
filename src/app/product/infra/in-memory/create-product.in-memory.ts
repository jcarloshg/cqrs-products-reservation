import * as fs from 'fs';
import * as path from 'path';

import { Product, ProductToCreateRepo } from "@/app/product/domain/models/product.model";
import { CreateProductRepository } from "@/app/product/domain/repository/create-product.repository";

export class CreateProductInMemory implements CreateProductRepository {
    public async run(data: ProductToCreateRepo): Promise<Product> {
        try {
            const productsPath = path.join(__dirname, 'products.json');
            const productsData = fs.readFileSync(productsPath, 'utf-8');
            const products = JSON.parse(productsData) as Product[];
            products.push(data);
            fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf-8');
            return products[products.length - 1];
        } catch (error) {
            throw new Error("CreateProductInMemory - something went wrong");
        }
    }
}