import discord from "discord.js";
import config from "../config";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";
import interactionCommandApi from "./interaction";
import Client from "../Client";
import { CommandModuleApi } from "./module";

class InteractionCommand {
  clientId = config.clientId;
  guildId = config.guildId;
  
  interactionCommands: Map<string, interactionCommandApi> = new Map()
  commands: any[] = [];

  constructor(client: Client) {
    this.updateCommands(client);
  }

  public async executeCommand(interaction: discord.CommandInteraction, client: Client){
    console.log(this.interactionCommands)
    const command = this.interactionCommands.get(interaction.commandName)
    if(!command) throw new Error("No such command");
    await command.runCommand(interaction, client);
    return;
  }

  public async updateCommands(client: Client) {
    const commandFolders = fs
      .readdirSync("./dist/interactions")
      .filter((file) => !file.endsWith(".js"));
    for (const commandFolder of commandFolders) {
      const files = fs.readdirSync(`./dist/interactions/${commandFolder}`)
      const commandFiles = files.filter((file) => file == "Template.js");
      const commandClasses = files.filter((file) => file == `${commandFolder}.js`);
      for (const file of commandFiles) {
        const command =
          await require(`${__dirname}/${commandFolder}/${file}`).default;
        this.commands.push(command.toJSON());
      }
      for ( const commandClass of commandClasses){
        const command = await require(`${__dirname}/${commandFolder}/${commandClass}`).default;
        const cmd = new command() as CommandModuleApi
        this.interactionCommands.set(cmd.interactionCommand.name, cmd.interactionCommand)
        if(cmd.textCommand)
        client._commands.push(cmd.textCommand)

      }
    }
    const rest = new REST({ version: "9" }).setToken(
      process.env.TOKEN as string
    );

    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(
        Routes.applicationGuildCommands(this.clientId, this.guildId),
        {
          body: this.commands,
        }
      );

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  }
}

export default InteractionCommand;
