import { CustomResponse } from "../model/custom-response.model";

export class CustomError extends Error {
    constructor(message: string) {
        super(message);
    }

    static getCustomResponse(error: CustomError): CustomResponse {
        const message = error.message;
        return CustomResponse.badRequest(message);
    }
}
