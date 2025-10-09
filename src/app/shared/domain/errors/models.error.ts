import { z } from "zod";

export interface ModelsErrorRequest {
    entity: string;
    userError: string;
    developerError: string[];
}

export class ModelError extends Error {
    private readonly modelsErrorRequest: ModelsErrorRequest;

    constructor(entity: string, error: z.ZodError) {
        super(error.message);

        const userMessage = `${error.issues[0].path.join(".")} - ${error.issues[0].message}`;
        const developerError = error.issues.map((e) => `${e.path.join(".")}: ${e.message}`);

        this.name = "ModelError";
        this.modelsErrorRequest = {
            entity: "Product",
            userError: userMessage,
            developerError: developerError,
        };
    }
}
