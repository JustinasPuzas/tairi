import discord from "discord.js";
import * as path from "path";
import apiCommand from "./commands/command";
import InteractionCommand from "./interactions/interactions";
import MemberApi from "./database/schemas/memberApi";
import memberDb from "./database/schemas/member";
import config from "./config";
import messageDb from "./database/schemas/message";
import CoolDown from "./modules/cooldown/Cooldown";
import sql from "./modules/sql/sql";
import MessageLogger from "./modules/messageLogger/messageLogger";
import Moderation from "./modules/moderation/Moderation";
const fs = require("fs").promises;

class Client extends discord.Client {
  // maintinance mode
  private _maintenanceMode: boolean = false;
  _prefix: string = config.prefix;
  Guild!: discord.Guild;
  //Rules = new Rules();

  //rare commands
  _commands: apiCommand[] = [];

  // modules
  InteractionCommands = new InteractionCommand(this);
  messageLogger = new MessageLogger();
  sqlDataBase = new sql();
  moderation!:Moderation;
  cDM = new CoolDown();

  public async onReady() {
    this.Guild = this.guilds.cache.get(config.guildId) as discord.Guild;
    this.moderation = new Moderation(this);
    await this.registerParentCommands();
  }

  public getMaintenanceMode() {
    return this._maintenanceMode;
  }

  public setMaintenanceMode(value: boolean) {
    this._maintenanceMode = value;
  }

  async runInteractionCommand(command: discord.CommandInteraction) {
    const channelId = command.channelId;
    const userId = command.user.id;
    // if (await this.cDM.isOnCoolDown(userId, channelId)) {
    //   console.log("On cd");
    //   return;
    // }
    this.cDM.createCoolDown(userId, channelId);
    await this.InteractionCommands.executeCommand(command, this);
  }

  async getMember(member: discord.GuildMember): Promise<MemberApi> {
    const findMember = await memberDb.findOne({ discordId: member.id });

    let data = null;
    try {
      data = await this.sqlDataBase.getMember(
        "SELECT * FROM users WHERE guild = ? AND uid = ?",
        [config.guildId, member.id]
      );
    } catch (err) {
      console.log(`Unable to fetch ${member.id} from sql dataBase`);
    }

    if (findMember) {
      data = data ? data[0] : null;
      findMember.sql = data;
      return findMember as MemberApi;
    }

    const firstTimeJoined = member.joinedAt
      ? member.joinedAt
      : new Date(Date.now());
    const createMember = (await memberDb.create({
      guildId: config.guildId,
      discordId: member.id,
      roles: [...member.roles.cache.keys()],
      firstTimeJoined,
    })) as MemberApi;
    data = data ? data[0] : null;
    createMember.sql = data;
    return createMember;
  }

  async findOneAndRunCommand(message: discord.Message) {
    const content = message.content;
    for (let command of this._commands) {
      if (this._maintenanceMode == false && command.maintenance == true)
        continue; // skip command witch requires maintenanceMode
      if (command.prefix) {
        if (command.prefix.includes(content[0])) {
          const args = this.parseArgs(message.content, content[0]);
          if (command.isThisCommand(args[0])) {
            try {
              const channelId = message.channelId;
              const userId = message.author.id;
              if (await this.cDM.isOnCoolDown(userId, channelId)) {
                console.log("On cd");
                return;
              }
              this.cDM.createCoolDown(userId, channelId);
              await command.runCommand(args, message, this);
              break;
            } catch (err) {
              console.error(err);
            }
          }
        }
      } else {
        if (config.prefix == content[0]) {
          const args = this.parseArgs(message.content, content[0]);
          if (command.isThisCommand(args[0])) {
            try {
              const channelId = message.channelId;
              const userId = message.author.id;
              if (await this.cDM.isOnCoolDown(userId, channelId)) {
                console.log("On cd");
                return;
              }
              this.cDM.createCoolDown(userId, channelId);
              await command.runCommand(args, message, this);
              break;
            } catch (err) {
              console.error(err);
            }
          }
        }
      }
    }
  }

  private parseArgs(content: string, prefix: string) {
    content = content.replace(prefix, "");
    const args = content.split(" ");
    return args;
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
