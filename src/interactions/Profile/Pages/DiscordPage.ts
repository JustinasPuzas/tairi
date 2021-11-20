import discord from "discord.js";
import MemberApi from "../../../database/schemas/memberApi";
import reputationDb from "../../../database/schemas/reputation";
import ReputationApi from "../../../database/schemas/reputationApi";
import PageApi from "./Page";
import milToHR from 'pretty-ms';

class DiscordPage implements PageApi {
  readonly name = "reputationPage";
  authorMember: discord.GuildMember;
  targetMember: discord.GuildMember;
  private navActionRow: discord.MessageActionRow;
  private page: discord.MessageOptions = { embeds: [], components: [] };

  constructor(
    authorMember: discord.GuildMember,
    targetMember: discord.GuildMember,
    navActionRow: discord.MessageActionRow,
  ) {
    this.targetMember = targetMember;
    this.authorMember = authorMember;
    this.navActionRow = navActionRow;
  }

  getPage() {
    this.updateButtons();
    this.updateEmbed();
    return this.page;
  }

  private updateButtons() {
    //this.buildActionRow();
    //const btnRow = this.buttons.values()
    // const row = new discord.MessageActionRow().addComponents([
    //   ...btnRow
    // ]);
    this.page.components = [this.navActionRow]
  }

  async buttonClickHandler(customId: string) {
    switch (customId) {
      case "plusRep":
        return this.page;
      case "minusRep":
        return this.page;
      default:
        return null;
    }
  }

  updateEmbed() {
    const targetUserName = this.targetMember.user.username + "#" + this.targetMember.user.discriminator;
    const targetAvatarUrl = this.targetMember.user.avatarURL() || this.authorMember.user.defaultAvatarURL;
    const targetBannerUrl = this.targetMember.user.bannerURL({size: 512, dynamic: true}) || this.targetMember.guild.bannerURL({size: 512}) || this.targetMember.guild.iconURL({size: 128})
    console.log(targetBannerUrl)
    const authorNickName = this.authorMember.nickname? this.authorMember.nickname : this.authorMember.user.username;
    const authorAvatarUrl = this.authorMember.avatarURL() ||  this.authorMember.user.avatarURL() || this.authorMember.user.defaultAvatarURL;
    const accountAge = this.targetMember.user.createdAt;
    const color = this.targetMember.displayHexColor
    const embed = new discord.MessageEmbed()
      .setTitle(`${targetUserName} Discord Info`)
      .setThumbnail(`${targetAvatarUrl}`)
      .setFields([
        {name: `Paskyros amžius:`, value: `📆 **${milToHR(Date.now() - accountAge.getTime())}**`, inline: true},
        {name: `Id: `, value: `**${this.targetMember.id}**`, inline: true},
        //{name: `Žinutės:`, value: `📨 **${this.messageCount}**`, inline: true},
      ])
      .setFooter(`${authorNickName}`, `${authorAvatarUrl}`)
      .setImage(`${targetBannerUrl}`)
      .setColor(color)
    this.page.embeds = [embed];
  }

  public loadData() {
    
  }

  async updateData() {}
}

export default DiscordPage;
