import discord, { ColorResolvable, TextChannel } from "discord.js";
import config from "../../config";
import apiCommand from "../command";
import Client from "../../Client";
import reputationConfigDb from "../../database/schemas/reputationConfig";
import reputationConfigApi from "../../database/schemas/reputationConfigApi";
import mysql from "mysql"
import Banner from "../../modules/banner/banner";


class Test implements apiCommand {
  readonly name = ["test"];
  readonly maintenance: boolean = false;
  readonly description = "`+test` for developers";
  private _ready: boolean = false;

  constructor() {
    
  }

  public isThisCommand(commandName: string): boolean {
    return this.name.includes(commandName);
  }

  public hasPerms(member: discord.GuildMember): boolean {
    return member.permissions.has("ADMINISTRATOR");
  }

  public isReady(): boolean {
    return this._ready;
  }

  public async runCommand(
    args: string[],
    message: discord.Message,
    client: Client
  ) {
    console.log(`TESTING`)

    const ban = new Banner();
    const banner = await ban.execute(message.author);
    await message.reply({files:[banner as Buffer]})
  }

 
  

  
  
  
  private async loadData() {
    return;
  }
}

export default Test;
