import { Command } from "./command";

export type CommandHandlerResp = {
    code: number;
    message: string;
    data: any;
};

export class CommandHandler<T extends Command> {
    public async handler(command: T): Promise<CommandHandlerResp> {
        throw new Error("CommandHandler.handler - Method not implemented.");
    }

    public subscribeTo(): string {
        return Command.COMMAND_NAME;
    }

}
