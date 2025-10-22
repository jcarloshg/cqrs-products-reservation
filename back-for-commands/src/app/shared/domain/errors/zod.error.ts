import { z } from "zod";
import { CustomResponse } from "../model/custom-response.model";
import { ErrorLogger } from "./custom-error.error";

export interface ModelsErrorRequest {
    entity: string;
    userError: string;
    developerError: string[];
}

export class OwnZodError extends Error implements ErrorLogger {

    public readonly modelsErrorRequest: ModelsErrorRequest;

    constructor(entity: string, error: z.ZodError) {

        const userMessage = `${error.issues[0].path.join(".")} - ${error.issues[0].message}`;
        const developerError = error.issues.map((e) => `${e.path.join(".")}: ${e.message}`);

        super(userMessage);

        this.name = "EntityError";
        this.modelsErrorRequest = {
            entity: entity,
            userError: userMessage,
            developerError: developerError,
        };

        this.logError();
    }

    public async logError(): Promise<void> {
        console.error(`OwnZodError - ${this.modelsErrorRequest.entity} - Error: ${JSON.stringify(this.modelsErrorRequest.developerError)}`);
    }

    public toCustomResponse(): CustomResponse {
        return CustomResponse.badRequest(this.modelsErrorRequest.userError);
    }
}
