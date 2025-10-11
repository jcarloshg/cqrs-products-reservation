import * as fs from "fs";
import * as path from "path";

const productPath = path.join(__dirname, "products.json");
const productsRawData = fs.readFileSync(productPath, "utf-8");
const productsData = JSON.parse(productsRawData) as any[];

const stockData = productsData.map((product) => {
    const uuid = crypto.randomUUID();
    const product_uuid = product.uuid;
    const available_quantity = Math.floor(Math.random() * 100) + 1;
    const reserved_quantity = Math.floor(Math.random() * available_quantity) + 0;
    return {
        uuid,
        product_uuid,
        available_quantity,
        reserved_quantity
    };
});

const outputPath = path.join(__dirname, "stock.json");
fs.writeFileSync(outputPath, JSON.stringify(stockData, null, 2));
console.log(`Stock data has been written to ${outputPath}`);
