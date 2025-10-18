import { Command } from "./command";

export type CommandHandlerResp<R = undefined> = {
    code: number;
    message: string;
    data: R | undefined;
};

export class CommandHandler<T extends Command> {
    public async handler(command: T): Promise<CommandHandlerResp> {
        throw new Error("Method not implemented.");
    }
}
