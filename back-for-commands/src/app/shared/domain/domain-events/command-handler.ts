import { Command } from "./command";

export type CommandHandlerResp<R = undefined> = {
    code: number;
    message: string;
    data: R | undefined;
};

export class CommandHandler<CommandHandlerResp> {
    public async handler(command: Command): Promise<CommandHandlerResp> {
        throw new Error("Method not implemented.");
    }
}
