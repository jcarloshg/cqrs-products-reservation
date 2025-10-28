import { Express, Router } from "express";
import { createReservationStockController } from "../controllers/reservation-stock/create-reservation-stock.controller";
import { ConfirmReservationController as confirmReservationController } from "../controllers/reservation-stock/confirm-reservation.controller";
import { replenishStockController } from "../controllers/reservation-stock/replenish-stock.controller";
import { GetStockAvailabilityController as getStockAvailabilityController } from "../controllers/stock-for-query/get-stock-availability.controller";

export const reservationsStockRoute = async (app: Express) => {
    const router = Router();

    router.get("/health", (req, res) => {
        res.send("Reservations Stock Service is up and running!");
    });

    // commands
    router.post("/", createReservationStockController);
    router.put("/", confirmReservationController);
    router.put("/replenish", replenishStockController);

    // query
    router.get("/:product_uuid/availability", getStockAvailabilityController);

    app.use("/api/reservationsStock/v1", router);
}