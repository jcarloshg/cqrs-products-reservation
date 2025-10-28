import { setupWebSocket } from "./websocket";
export let wss: any = null;

export const initWebSocket = (server: any) => {
    wss = setupWebSocket(server);
    return wss;
};