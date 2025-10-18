import { Command } from "./command";
import { CommandHandler } from "./command-handler";

export type CommandName = string;

export class CommandHandlers {
    private _handlers: Map<CommandName, CommandHandler<Command>> = new Map();

    constructor() { }

    public register(
        commandName: CommandName,
        commandHandler: CommandHandler<Command>
    ): void {
        this._handlers.set(commandName, commandHandler);
    }

    public get(commandName: CommandName): CommandHandler<Command> | undefined {
        return this._handlers.get(commandName);
    }
}
