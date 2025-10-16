import { Express, Router } from "express";
import { createReservationStockController } from "../controllers/reservation-stock/create-reservation-stock.controller";

export enum HTTPMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export const reservationsStockRoute = async (app: Express) => {
    const router = Router();

    router.post("/", createReservationStockController);
    // router.get("/", getProductsByFilters);
    // router.get("/cursor", getProductsByCursor);

    console.log(`router.post: `, "router.post");
    console.log(`router.all: `, router.all);

    app.use("/api/reservationsStock/v1", router);
}