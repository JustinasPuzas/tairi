import discord, { ColorResolvable, TextChannel } from "discord.js";
import config from "../../config";
import apiCommand from "../command";
import Client from "../../Client";
import reputationConfigDb from "../../database/schemas/reputationConfig";
import reputationConfigApi from "../../database/schemas/reputationConfigApi";
import mysql from "mysql";

class Uzmusti implements apiCommand {
  readonly name = ["uzmusti", "užmušti", "uzmušti", "užmusti"];
  readonly maintenance: boolean = false;
  readonly description = "`+užmušti` for owner";
  private _ready: boolean = true;

  public isThisCommand(commandName: string): boolean {
    return this.name.includes(commandName);
  }

  public hasPerms(member: discord.GuildMember): boolean {
    const guild = member.guild;
    return guild.ownerId === member.user.id;
  }

  public isReady(): boolean {
    return this._ready;
  }

  private getImage(): string {
    return config.mute.uzmusti.images[
      Math.floor(Math.random() * config.mute.uzmusti.images.length)
    ];
  }

  private getDescription(authorId: string, targetId: string): string {
    const text =
      config.mute.uzmusti.text[
        Math.floor(Math.random() * config.mute.uzmusti.text.length)
      ];
    return text
      .replace("{targetId}", `<@${targetId}>`)
      .replace("{authorId}", `<@${authorId}>`);
  }

  public async runCommand(
    args: string[],
    message: discord.Message,
    client: Client
  ) {
    const guildId = config.guildId;
    const memberId = message.author.id;
    if(!this.hasPerms(message.member as discord.GuildMember)) return;
    const moderation = client.moderation;
    const targetMember = message.mentions.members?.first();

    let embed = this.buildCoreMessage(
      message.member as discord.GuildMember,
      client
    );

    if (!targetMember) return console.log(`No mentions`);
      try {
        await moderation.muteMember(
          targetMember,
          message.member as discord.GuildMember,
          2 * 60 * 60 * 1000 // 2 * 60 * 60
        );
        embed = this.buildSuccessMessage(embed, memberId, targetMember.id)
      } catch (err) {
        embed = this.buildErrorMessage(embed, err)
        console.log(err);
      }

    await message.reply({ embeds: [embed] });
  }

  private buildCoreMessage(author: discord.GuildMember, client: Client) {
    const avatarURL =
      author.avatarURL() ||
      author.user.avatarURL() ||
      author.user.defaultAvatarURL;
    const embed = new discord.MessageEmbed().setAuthor(
      "Žudyti narį",
      avatarURL
    );
    return embed;
  }

  private buildErrorMessage(embed: discord.MessageEmbed, error: unknown) {
    const descriptionText = `${error}`.replace("Error: ", "");
    return embed.setTitle("Klaida").setDescription(descriptionText).setColor("DARK_RED");
  }

  private buildSuccessMessage(
    embed: discord.MessageEmbed,
    authorId: string,
    targetId: string
  ) {
    const image = this.getImage();
    const description = this.getDescription(authorId, targetId)
    embed.setDescription(description).setImage(image);
    return embed;
  }

  private async loadData() {
    return;
  }
}

export default Uzmusti;
