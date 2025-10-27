import { Express, Router } from "express";

export const healthRoute = async (app: Express) => {

    const router = Router();

    router.get("/", (req, res) => {
        res.send("Service is up and running!");
    });

    app.use("/", router);
}