import discord, { TextChannel } from "discord.js";
import rules_text from "./source";
import rulesDb from "../../database/schemas/rulesConfig";
import RulesConfig from "../../database/schemas/rulesConfig";
import config from "../../config";
import apiCommand from "../command";
import Client from "../../Client";
import ColorGradient from "../../utils/colors/colorGrandient";

class Rules implements apiCommand {
  readonly name = ["rules"];
  readonly maintenance: boolean = true;
  readonly description =
    "Rules command Only available with `+maintenance` mode on";
  private _ready: boolean = false;
  private _rules = rules_text;
  private _channelId?: string = undefined;
  private _messages?: string[] = undefined; // used to log rules messages posible addition to update rules
  private _webhookId?: string = undefined;
  private _startColor: string = "ffffff";
  private _endColor: string = "0055ff";

  constructor() {
    this.loadData();
  }

  public isReady() {
    return this._ready;
  }

  public isThisCommand(commandName: string) {
    return this.name.includes(commandName);
  }

  public hasPerms(member: discord.GuildMember): boolean {
    return member.permissions.has("ADMINISTRATOR");
  }

  public async runCommand(
    args: string[],
    message: discord.Message,
    client: Client
  ) {
    // add options to update rule messages
    // add option to set color gradient
    const prevChannelId = this._channelId;
    const prevWebhookId = this._webhookId;
    const { channel, member } = message;
    if (!member) return;
    if (!this.hasPerms(member)) return;
    await this.sendToChannelViaWebHooks(channel as discord.TextChannel);
    if (this._channelId == channel.id) return console.log(`Same channel`);
    await this.changeRuleChannel(message, prevWebhookId, prevChannelId);

    // add rule channel check if diff
  }

  private async changeRuleChannel(
    message: discord.Message,
    prevWebhookId?: string,
    prevChannelId?: string
  ) {
    const { member, channel, guild } = message;
    if (!member || !channel) return;

    const buttons: Map<string, discord.MessageButton> = new Map()
      .set(
        "setNewRulesChannel",
        new discord.MessageButton()
          .setCustomId("setNewRulesChannel")
          .setLabel("Taip")
          .setStyle("PRIMARY")
      )
      .set(
        "dontSetNewRulesChannel",
        new discord.MessageButton()
          .setCustomId("dontSetNewRulesChannel")
          .setLabel("Ne")
          .setStyle("DANGER")
      );

    const verifyNewChannelEmbed = new discord.MessageEmbed()
      .setTitle("Naujas kanalas")
      .setDescription(`Nustatyti kaip įprastinį serverio taisyklių kanalą?`);

    const row = new discord.MessageActionRow().addComponents([
      buttons.get("setNewRulesChannel") as discord.MessageButton,
      buttons.get("dontSetNewRulesChannel") as discord.MessageButton,
    ]);

    const verifyMessage = await message.reply({
      embeds: [verifyNewChannelEmbed],
      components: [row],
    });

    const collector = verifyMessage.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 30 * 1000,
    });

    let collectorActive = false;

    collector.on("collect", async (i) => {
      if (i.user.id === member.id) {
        if (collectorActive) return;
        collectorActive = true;

        let res;
        if (i.customId == "setNewRulesChannel") {
          // if TAIP
          res = new discord.MessageEmbed()
            .setTitle("Nustatytas naujas taisyklių kanalas")
            .setColor("GREEN");
          await this.setChannelId(channel.id);
          if (prevWebhookId && prevChannelId) {
            const guild = message.guild;
            const prevChannel = guild?.channels.cache.get(prevChannelId);
            await this.removeChannelWebHook(
              prevChannel as discord.TextChannel,
              prevWebhookId
            );
          }
        } else {
          // if NE
          res = new discord.MessageEmbed().setTitle("Canceled").setColor("RED");
          if (prevWebhookId && prevChannelId) {
            const guild = message.guild;
            const prevChannel = guild?.channels.cache.get(prevChannelId);
            if (this._webhookId)
              await this.removeChannelWebHook(
                channel as discord.TextChannel,
                this._webhookId
              );
            await this.setWebhookId(prevWebhookId);
          }
        }

        const row = new discord.MessageActionRow().addComponents(
          (buttons.get(`${i.customId}`) as discord.MessageButton)
            ?.setDisabled(true)
            .setStyle("SUCCESS")
        );

        //i.reply(`${i.user.id} clicked on the ${i.customId} button.`);
        await i.update({ embeds: [res], components: [row] });
        setTimeout(async () => {
          console.log(`Delete msg`);
          await i.deleteReply();
        }, 5 * 1000);
      } else {
        i.reply({ content: `Nekisk nagu nahuj`, ephemeral: true });
      }
    });

    collector.on("end", async (collected) => {
      if (channel.messages.cache.get(verifyMessage.id)) {
        await verifyMessage.delete();
      }
      if (prevWebhookId && prevChannelId) {
        const guild = message.guild;
        const prevChannel = guild?.channels.cache.get(prevChannelId);
        if (this._webhookId)
          await this.removeChannelWebHook(
            channel as discord.TextChannel,
            this._webhookId
          );
        await this.setWebhookId(prevWebhookId);
      }
      console.log(`Collected ${collected.size} interactions.`);
    });
  }

  private async sendToChannelViaWebHooks(channel: discord.TextChannel) {
    const webhook = await this.getChannelWebHook(channel);
    let arrSize = 0;
    this._rules.rules.map((rule) => {
      arrSize += rule.Contents.length;
    });
    arrSize += this._rules.rules.length;
    const gradient = ColorGradient(
      `${this._startColor}`,
      `${this._endColor}`,
      arrSize + 1
    );
    let id = 0;
    for (let text of this._rules.rules) {
      id++;
      let subId = 0;
      const {
        Title: username,
        TitlePicURL: avatarURL,
        SubTitlePicURL: thumbnail,
        Desc: description,
        Color: color,
      } = text;
      const titleCard = new discord.MessageEmbed()
        .setTitle(`${id}: ` + description)
        .setImage(thumbnail)
        //.setThumbnail(thumbnail)
        .setColor(`${gradient.next().value}` as discord.ColorResolvable);
      const embeds = [titleCard];
      for (let rule of text.Contents) {
        subId++;
        let desc = rule.explain;
        if (rule.Punishments.length > 0) {
          desc = desc + `\n\n**${rule.Punishments}**`;
        }
        const embed = new discord.MessageEmbed()
          .setTitle(`${id}.${subId} ${rule.Name}`)
          .setDescription(desc)
          .setColor(`${gradient.next().value}` as discord.ColorResolvable);
        embeds.push(embed);
      }

      await webhook.send({
        username,
        avatarURL,
        embeds,
      });
    }
    // send rules to channel
  }

  private async getChannelWebHook(channel: discord.TextChannel) {
    if (!this._webhookId) {
      console.log(`Create webHook`);
      return await this.createWebhook(channel);
    } else {
      console.log(`FindWebHook`);
      const webhooks = await channel.fetchWebhooks();
      const webhook = webhooks.get(this._webhookId);
      return webhook ? webhook : await this.createWebhook(channel);
    }
  }

  private async removeChannelWebHook(
    channel: discord.TextChannel,
    webhookId: string
  ) {
    const webhooks = await channel.fetchWebhooks();
    const webhook = webhooks.get(webhookId);
    await webhook?.delete();
  }

  private async createWebhook(channel: discord.TextChannel) {
    const webhook = await channel.createWebhook("TaiRi", {
      avatar: `${channel.guild.iconURL()}`,
    });
    await rulesDb.findOneAndUpdate(
      { guildId: channel.guild.id },
      { webhookId: webhook.id }
    );
    this._webhookId = webhook.id;
    return webhook;
  }

  public async setChannelId(channelId: string) {
    const guildId = config.guildId;
    await rulesDb.findOneAndUpdate({ guildId }, { channelId });
    this._channelId = channelId;
  }

  public async setWebhookId(webhookId: string) {
    const guildId = config.guildId;
    await rulesDb.findOneAndUpdate({ guildId }, { webhookId });
    this._webhookId = webhookId;
  }

  public getChannelId() {
    return this._channelId;
  }

  private async loadData() {
    const guildId = config.guildId;
    try {
      const rulesConfig = await rulesDb.findOne({ guildId });
      if (!rulesConfig) {
        await rulesDb.create({ guildId: config.guildId });
        this._ready = true;
      }
      this._channelId = rulesConfig.channelId;
      this._messages = rulesConfig.messages;
      this._webhookId = rulesConfig.webhookId;
      this._ready = true;
    } catch (err) {
      console.error(err);
    }
  }
}

export default Rules;
