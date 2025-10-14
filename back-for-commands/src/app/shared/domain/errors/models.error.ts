import { z } from "zod";

export interface ModelsErrorRequest {
    entity: string;
    userError: string;
    developerError: string[];
}

export class ModelError extends Error {
    public readonly modelsErrorRequest: ModelsErrorRequest;

    constructor(entity: string, error: z.ZodError) {

        const userMessage = `${error.issues[0].path.join(".")} - ${error.issues[0].message}`;
        const developerError = error.issues.map((e) => `${e.path.join(".")}: ${e.message}`);

        super(userMessage);

        this.name = "ModelError";
        this.modelsErrorRequest = {
            entity: "Product",
            userError: userMessage,
            developerError: developerError,
        };
    }
}
