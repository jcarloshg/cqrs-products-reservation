import { Server, WebSocket } from 'ws';
import { Express } from 'express';

export const setupWebSocket = (server: any) => {
    const wss = new Server({ server });

    interface ProductWebSocket extends WebSocket {
        product_uuid?: string;
    }

    wss.on('connection', (ws: ProductWebSocket) => {
        ws.on('message', (message: string) => {
            // Expect message to be JSON: { product_uuid: string }
            let data;
            try {
                data = JSON.parse(message.toString());
            } catch (e) {
                ws.send(JSON.stringify({ error: 'Invalid message format' }));
                return;
            }
            // Subscribe logic can be implemented here
            ws.product_uuid = data.product_uuid;
        });
    });

    // Broadcast function for stock updates
    (wss as any).broadcastStockAvailability = (product_uuid: string, availability: any) => {
        wss.clients.forEach((client: ProductWebSocket) => {
            if (client.readyState === WebSocket.OPEN && client.product_uuid === product_uuid) {
                client.send(JSON.stringify({ product_uuid, availability }));
            }
        });
    };

    return wss;
};
