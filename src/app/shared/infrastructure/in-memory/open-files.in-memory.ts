import * as fs from "fs";
import * as path from "path";

import { ReservationStockProps } from "@/app/stock/create-reservation-stock/domain/entities/reservation-stock.entity";

export class OpenFilesInMemory {
    constructor() { }

    private static readonly stockReservationFileName = "stock-reservation.json";

    public async getReservationStock(): Promise<ReservationStockProps[]> {
        try {
            const productsPath = path.join(
                __dirname,
                OpenFilesInMemory.stockReservationFileName
            );
            const productsData = fs.readFileSync(productsPath, "utf-8");
            const products = JSON.parse(productsData) as ReservationStockProps[];
            return products;
        } catch (error) {
            return [];
        }
    }

    public async saveReservationStock(
        data: ReservationStockProps[]
    ): Promise<void> {
        try {
            const productsPath = path.join(
                __dirname,
                OpenFilesInMemory.stockReservationFileName
            );
            fs.writeFileSync(productsPath, JSON.stringify(data), "utf-8");
        } catch (error) { }
    }
}
