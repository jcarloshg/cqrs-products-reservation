import { CustomResponse } from "../model/custom-response.model";

type DomainErrorProps = {
    input?: { [key: string]: any },
    output?: { [key: string]: any },
}

export class DomainError extends Error {
    public readonly userMsg: string;
    public readonly intoToDev: DomainErrorProps;

    constructor(userError: string, developerError: DomainErrorProps) {
        super(userError);
        this.name = "DomainError";
        this.userMsg = userError;
        this.intoToDev = developerError;
    }

    public toCustomResponse(): CustomResponse {
        return CustomResponse.badRequest(this.userMsg);
    }
}
