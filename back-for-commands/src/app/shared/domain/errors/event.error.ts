import { CustomResponse } from "../model/custom-response.model";
import { ErrorLogger } from "./custom-error.error";

type EventErrorProps = {
    input?: { [key: string]: any },
    output?: { [key: string]: any },
}

export class EventError extends Error implements ErrorLogger {

    public readonly userMsg: string;
    public readonly infoToDev: EventErrorProps;

    constructor(userError: string, developerError: EventErrorProps) {
        super(userError);
        this.name = "EventError";
        this.userMsg = userError;
        this.infoToDev = developerError;
    }

    public logError(): Promise<void> {
        console.error(`EventError - ${this.name} - User Message: ${this.userMsg} - Developer Message: ${JSON.stringify(this.infoToDev)}`);
        return Promise.resolve();
    }

    public toCustomResponse(): CustomResponse {
        return CustomResponse.badRequest(this.userMsg);
    }
}
