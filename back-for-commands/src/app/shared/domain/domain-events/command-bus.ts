import { Command } from "./command";
import { CommandHandlerResp } from "./command-handler";
import { CommandHandlers } from "./command-handlers";

export class CommandBus {

    private readonly commandHandlers: CommandHandlers

    constructor(
        commandHandlers: CommandHandlers
    ) {
        this.commandHandlers = commandHandlers;
    }

    public async dispatch(command: Command): Promise<CommandHandlerResp> {
        const commandName = (command.constructor as typeof Command).COMMAND_NAME;
        const handler = this.commandHandlers.get(commandName);
        if (!handler) {
            console.log(`No handler found for command: ${commandName}`);
            throw new Error(`No handler found for command: ${commandName}`);
            // return;
        }
        return await handler.handler(command);
    }
}
