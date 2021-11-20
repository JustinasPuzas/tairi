import discord from 'discord.js';
import Client from '../Client'
interface apiCommand {
    readonly name: string[],
    readonly maintenance: boolean,
    readonly description: string,
    readonly prefix?: string[];
    isThisCommand(commandName: string):boolean
    isReady():boolean
    runCommand(args: string[], message: discord.Message, client: Client):Promise<void>
    hasPerms(member: discord.GuildMember):boolean
}

export default apiCommand