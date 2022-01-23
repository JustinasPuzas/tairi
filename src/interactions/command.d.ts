import discord from "discord.js";
import Client from "../Client";
import config from "../config";

export interface TextCommandApi {
  readonly name: string[];
  readonly prefix?: string[];
  readonly description: string;
  readonly usage: string;
  isThisCommand(commandName: string):boolean
  public async runCommand(args: string[], message: discord.Message, client: Client): Promise<void>;
}

export default interactionCommandApi;
