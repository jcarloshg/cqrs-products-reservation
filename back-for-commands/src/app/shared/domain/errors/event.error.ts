import { CustomResponse } from "../model/custom-response.model";

type EventErrorProps = {
    input?: { [key: string]: any },
    output?: { [key: string]: any },
}

export class EventError extends Error {
    public readonly userMsg: string;
    public readonly infoToDev: EventErrorProps;

    constructor(userError: string, developerError: EventErrorProps) {
        super(userError);
        this.name = "EventError";
        this.userMsg = userError;
        this.infoToDev = developerError;
    }

    public toCustomResponse(): CustomResponse {
        return CustomResponse.badRequest(this.userMsg);
    }
}
