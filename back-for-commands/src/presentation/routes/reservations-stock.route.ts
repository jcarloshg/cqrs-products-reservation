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

    router.get("/health", (req, res) => {
        res.send("Reservations Stock Service is up and running!");
    });
    router.post("/", createReservationStockController);
    // router.get("/cursor", getProductsByCursor);

    app.use("/api/reservationsStock/v1", router);
}