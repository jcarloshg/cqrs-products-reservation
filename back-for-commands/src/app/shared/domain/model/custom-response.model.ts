import { CommandHandlerResp } from "../domain-events/command-handler";

export class CustomResponse<T = undefined> {
    constructor(
        public readonly code: number,
        public readonly message: string,
        public readonly data: T | undefined = undefined
    ) { }

    public toCommandHandlerResp(): CommandHandlerResp<T> {
        const response: CommandHandlerResp<T> = {
            code: this.code,
            message: this.message,
            data: this.data
        }
        return response;
    }

    // ============================================================
    // 200
    // ============================================================

    static ok<T>(data: T, message: string = "Request was successful"): CustomResponse<T> {
        return new CustomResponse<T>(200, message, data);
    }

    static created<T>(objectCreated: T): CustomResponse<T> {
        return new CustomResponse<T>(
            201,
            "Resource created successfully",
            objectCreated
        );
    }

    // ============================================================
    // 400
    // ============================================================

    static badRequest(userMessage: string): CustomResponse {
        return new CustomResponse(400, userMessage, undefined);
    }

    static notFound(message: string = "Resource not found"): CustomResponse {
        return new CustomResponse(404, message, undefined);
    }

    // ============================================================
    // 500
    // ============================================================

    static internalServerError(): CustomResponse<undefined> {
        return new CustomResponse(
            500,
            "Internal server error",
            undefined
        );
    }
}
