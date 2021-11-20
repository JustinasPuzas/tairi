import discord from "discord.js";
import Rules from "./commands/rules/rules";
import * as path from "path";
import apiCommand from "./commands/command";
import InteractionCommand from "./interactions/interactions";
import MemberApi from './database/schemas/memberApi'
import memberDb from "./database/schemas/member";
import config from './config';
import messageDb from "./database/schemas/message";
import CoolDown from "./modules/cooldown/Cooldown";
const fs = require("fs").promises;

class Client extends discord.Client {
  // extending Client Class

  private _maintenanceMode: boolean = false;
  _prefix: string = config.prefix;
  _commands: apiCommand[] = [];
  Rules = new Rules();
  InteractionCommands = new InteractionCommand(this);

  coolDownManager = new CoolDown();

  public getMaintenanceMode() {
    return this._maintenanceMode;
  }
  public setMaintenanceMode(value: boolean) {
    this._maintenanceMode = value;
  }

  async runInteractionCommand(command: discord.CommandInteraction) {

    await this.InteractionCommands.executeCommand(command, this);
  }

  async getMember(member: discord.GuildMember){
    const findMember = await memberDb.findOne({discordId: member.id})
    if(findMember) return findMember as MemberApi;
    const firstTimeJoined = member.joinedAt? member.joinedAt : new Date(Date.now())
    const createMember = await memberDb.create({guildId: config.guildId, discordId: member.id, roles: [...member.roles.cache.keys()], firstTimeJoined}) as MemberApi;
    return createMember;
  }

  async logMessage(message: discord.Message){
    const guildId = message.guild?.id as string
    const channelId = message.channelId;
    const content = message.content;
    const timeStamp = new Date(Date.now())
    let attachments = message.attachments;
    const discordId = message.author.id;
    const messageId = message.id;
    await messageDb.create({guildId, channelId, messageId, content, timeStamp, attachments, discordId})
  }

  async deleteMessage(message: discord.Message | discord.PartialMessage){
    const messageId = message.id;
    await messageDb.findOneAndUpdate({messageId}, {deleted: true, deletedTimeStamp: new Date(Date.now())})
  }

  async updateMessage(oldMessage: discord.Message, newMessage: discord.Message){
    const messageId = oldMessage.id
    await messageDb.findOneAndUpdate({messageId}, { $push: { edits: {...newMessage} } })
  }

  async findOneAndRunCommand(message: discord.Message) {
    const content = message.content;
    for (let command of this._commands) {
      if(this._maintenanceMode == false && command.maintenance == true) return
      if(command.maintenance != true){
        const userId = message.author.id
        const channelId = message.channelId
      }
      if(command.prefix){
        if(command.prefix.includes(content[0])){
          const args = this.parseArgs(message.content, content[0])
          if(command.isThisCommand(args[0])){
            try {
              await command.runCommand(args, message, this);
            } catch (err) {
              console.error(err);
            }
          }
        }
      }else{
        if(config.prefix == content[0]){
          const args = this.parseArgs(message.content, content[0])
          if(command.isThisCommand(args[0])){
            try {
              await command.runCommand(args, message, this);
            } catch (err) {
              console.error(err);
            }
          }
        }
      }

    }
  }

  private parseArgs(content: string, prefix:string){
    content = content.replace(prefix, "")
    const args = content.split(" ")
    return args
  }

  async registerParentCommands(): Promise<void> {
    const folderPath = "./dist/commands";
    const folders = ((await fs.readdir(folderPath)) as string[]).filter(
      (item) => !item.includes(`.`)
    );
    for (let folder of folders) {
      try {
        const path = `${__dirname}/commands/${folder}`;
        const command = await require(`${path}/${folder}`).default;
        const cmd = new command() as apiCommand;

        this._commands.push(cmd);
      } catch (err) {
        console.log(folder);
        console.error(err);
      }
    }
    console.log(this._commands);
    return;
  }
}

export default Client;
