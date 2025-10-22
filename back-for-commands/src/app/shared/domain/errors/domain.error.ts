import { CustomResponse } from "../model/custom-response.model";
import { ErrorLogger } from "./custom-error.error";

type DomainErrorProps = {
    input?: { [key: string]: any },
    output?: { [key: string]: any },
}

export class DomainError extends Error implements ErrorLogger {

    public readonly userMsg: string;
    public readonly intoToDev: DomainErrorProps;

    constructor(userError: string, developerError: DomainErrorProps) {
        super(userError);
        this.name = "DomainError";
        this.userMsg = userError;
        this.intoToDev = developerError;

        this.logError();
    }

    public logError(): Promise<void> {
        console.error(`DomainError - ${this.name} - User Message: ${this.userMsg} - Developer Message: ${JSON.stringify(this.intoToDev)}`);
        return Promise.resolve();
    }

    public toCustomResponse(): CustomResponse {
        return CustomResponse.badRequest(this.userMsg);
    }
}
