import { Command } from "./command";

export class CommandHandler<T extends Command> {
    public async handler(command: T): Promise<void> { }
}