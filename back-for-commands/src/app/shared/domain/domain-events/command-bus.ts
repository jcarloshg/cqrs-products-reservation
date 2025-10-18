import { Command } from "./command";
import { CommandHandlers } from "./command-handlers";

export class CommandBus {

    private readonly commandHandlers: CommandHandlers

    constructor(
        commandHandlers: CommandHandlers
    ) {
        this.commandHandlers = commandHandlers;
    }

    public async dispatch(command: Command): Promise<void> {
        const commandName = (command.constructor as typeof Command).COMMAND_NAME;
        const handler = this.commandHandlers.get(commandName);
        if (!handler) {
            // throw new Error(`No handler found for command: ${commandName}`);
            console.log(`No handler found for command: ${commandName}`);
            return;
        }
        await handler.handler(command);
    }
}
