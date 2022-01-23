import discord, { ColorResolvable, TextChannel } from "discord.js";
import config from "../../config";
import apiCommand from "../command";
import Client from "../../Client";
import reputationConfigDb from "../../database/schemas/reputationConfig";
import reputationConfigApi from "../../database/schemas/reputationConfigApi";

class Reputation implements apiCommand {
  readonly name = ["reputation"];
  readonly maintenance: boolean = true;
  readonly description = "`+reputation` returns reputation configuration";
  private reputationConfig!: reputationConfigApi;
  private _ready: boolean = false;

  constructor() {
    this.loadData();
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
    const member = message.member as discord.GuildMember;
    const channel = message.channel as discord.TextChannel;
    if (!this.hasPerms(member)) return;
    console.log(args);
    if (args[1]) {
      this.subCommands(args, message, channel, client);
      // send config of +rep
      // colors Custom | defined hex color
      //
      return;
    }
    await this.sendConfig(message);
  }

  private async subCommands(
    args: string[],
    message: discord.Message,
    channel: discord.TextChannel,
    client: Client
  ) {
    const guild = message.guild as discord.Guild;
    try {
      switch (args[1]) {
        case "color":
          await this.updateColor(args[2]);
          break;
        case "cd":
          await this.updateCoolDown(args[2]);
          break;
        case "bl":
          await this.updateBlackList(args[2], args[3], guild);
          break;
        default:
          throw new Error(
            "Bad input, check `+reputation` for specific config commands"
          );
          break;
      }
    } catch (err) {
      this.replyError(message, err);
    }
  }

  private async replyError(message: discord.Message, error: unknown) {
    const embed = new discord.MessageEmbed()
      .setTitle("Error X.X")
      .setDescription(`${error}`)
      .setColor("DARK_RED");

    const messageReply = await message.reply({ embeds: [embed] });

    setTimeout(async () => {
      await messageReply.delete().catch((err) => console.log(err));
    }, 10000);
  }

  private async updateColor(color: string) {
    color = color.toLowerCase();
    if (color.startsWith("#")) {
      if (color.length == 7) {
        this.reputationConfig = await reputationConfigDb.findOneAndUpdate(
          { guildId: config.guildId },
          { color },
          { new: true }
        );
      }
    } else if (color == "custom") {
      this.reputationConfig = await reputationConfigDb.findOneAndUpdate(
        { guildId: config.guildId },
        { color },
        { new: true }
      );
    } else {
      throw new Error("Bad input, should be: CUSTOM | #______");
    }
  }

  private async updateCoolDown(time: string) {
    const timeToNumber = Number.parseInt(time);
    if (!timeToNumber)
      throw new Error("Bad input, should be: Integer as Minutes");
    const coolDown = timeToNumber * 60 * 1000;
    this.reputationConfig = await reputationConfigDb.findOneAndUpdate(
      { guildId: config.guildId },
      { coolDown },
      { new: true }
    );
  }

  private async updateBlackList(
    action: string,
    roleId: string,
    guild: discord.Guild
  ) {
    const add = ["+", "a", "add"];
    const remove = ["-", "r", "remove"];

    if (add.includes(action)) {
      const role = await this.checkIfValueIsRole(guild, roleId);
      await this.addToBlackList(role);
    } else if (remove.includes(action)) {
      const role = await this.checkIfValueIsRole(guild, roleId);
      await this.removeFromBlackList(role);
    } else {
      throw new Error(
        "Bad input, should be:\n + a add to add role\n - r remove to remove role"
      );
    }
  }

  private async checkIfValueIsRole(guild: discord.Guild, roleId: string) {
    roleId = roleId.replace(/\D/g, "");
    await guild.roles.fetch();
    const role = guild.roles.cache.get(roleId);
    if (!role)
      throw new Error(`Bad input, role with id: ${roleId} doesn't exist`);
    return role;
  }

  private async addToBlackList(role: discord.Role) {
    if (this.reputationConfig.blackListed.includes(role.id))
      throw new Error(`Role <@&${role.id}> already is blackListed`);
    this.reputationConfig = await reputationConfigDb.findOneAndUpdate(
      { guildId: config.guildId },
      { $push: { blackListed: role.id } },
      { new: true }
    );
  }

  private async removeFromBlackList(role: discord.Role) {
    if (!this.reputationConfig.blackListed.includes(role.id))
      throw new Error(`No such Role <@&${role.id}> in blackList`);
    this.reputationConfig = await reputationConfigDb.findOneAndUpdate(
      { guildId: config.guildId },
      { $pull: { blackListed: role.id } },
      { new: true }
    );
  }

  private async sendConfig(message: discord.Message) {
    const channel = message.channel as discord.TextChannel;
    const conf = this.reputationConfig;
    const member = message.member as discord.GuildMember;
    const displayColor: ColorResolvable =
      conf.color == "custom"
        ? (member.displayHexColor as ColorResolvable)
        : (conf.color as ColorResolvable);
    const embed = new discord.MessageEmbed()
      .setTitle(`Reputation Configuration`)
      .setDescription("Prefix for all settings `+reputation `")
      .setColor(displayColor)
      .setFields([
        { name: `Color: ${conf.color}`, value: "`color ` new value in HEX" },
        {
          name: `Cooldown: ${conf.coolDown / 1000 / 60}`,
          value: "`cd ` new value in minutes",
        },
        {
          name: `BlackListed:`,
          value: `${conf.blackListed.map(el => `<@&${el}>`)}\n\`bl +/- \` new value as @RoleName or Role id`,
        },
      ]);
    await channel.send({ embeds: [embed] });
  }

  private async loadData() {
    const guildId = config.guildId;
    this.reputationConfig = await reputationConfigDb.findOne({ guildId });
    if (!this.reputationConfig) {
      this.reputationConfig = (await reputationConfigDb.create({
        guildId,
      })) as reputationConfigApi;
    }
    this._ready = true;
    return;
  }
}

export default Reputation;
