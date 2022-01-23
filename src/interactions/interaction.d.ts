import discord from "discord.js";
import Client from "../Client";
import config from "../config";

export interface InteractionCommandApi {
  readonly name: string;
  public async runCommand(interaction: discord.CommandInteraction, client: Client): Promise<void>;
}

export default InteractionCommandApi;
