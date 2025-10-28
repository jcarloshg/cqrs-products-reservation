import express from "express";
import cors from "cors";
import { enviromentVariables } from "./app/shared/infrastructure/utils/enviroment-variables";
import { reservationsStockRoute } from "./presentation/routes/reservations-stock.route";
import { healthRoute } from "./presentation/routes/health.route";

const app = express();

// ─────────────────────────────────────
// Middlewares
// ─────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: enviromentVariables.cors.origin,
        credentials: enviromentVariables.cors.credentials,
    })
);

// ─────────────────────────────────────
// add routes here
// ─────────────────────────────────────
reservationsStockRoute(app);
healthRoute(app);

// ─────────────────────────────────────
// Start server
// ─────────────────────────────────────

const PORT = enviromentVariables.port;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📖 Environment: ${enviromentVariables.nodeEnv}`);
});

// Initialize WebSocket server
import { initWebSocket } from "./presentation/routes/websocket-instance";
initWebSocket(server);

export default app;
