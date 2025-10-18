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
        const handler = this.commandHandlers.get(command.COMMAND_NAME);
        if (!handler) {
            // throw new Error(`No handler found for command: ${command.name}`);
            console.log(`No handler found for command: ${command.COMMAND_NAME}`);
            return;
        }
        await handler.handler(command);
    }
}
