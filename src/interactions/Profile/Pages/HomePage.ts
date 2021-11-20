import discord from "discord.js";
import MemberApi from "../../../database/schemas/memberApi";
import reputationDb from "../../../database/schemas/reputation";
import ReputationApi from "../../../database/schemas/reputationApi";
import PageApi from "./Page";
import milToHR from 'pretty-ms';
import ReputationPage from "./ReputationPage";

class HomePage implements PageApi {
  readonly name = "reputationPage";
  authorMember: discord.GuildMember;
  targetMember: discord.GuildMember;
  private navActionRow: discord.MessageActionRow;
  private page: discord.MessageOptions = { embeds: [], components: [] };
  private memberData: MemberApi;
  private reputationData: ReputationPage;
  private messageCount: number

  constructor(
    authorMember: discord.GuildMember,
    targetMember: discord.GuildMember,
    navActionRow: discord.MessageActionRow,
    memberData: MemberApi,
    reputationData: ReputationPage,
    messageCount: number,
  ) {
    this.targetMember = targetMember;
    this.authorMember = authorMember;
    this.navActionRow = navActionRow;
    this.memberData = memberData;
    this.reputationData = reputationData;
    this.messageCount = messageCount;
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
    const targetNickName = this.targetMember.nickname? this.targetMember.nickname : this.targetMember.user.username;
    const targetAvatarUrl = this.targetMember.avatarURL() || this.targetMember.user.avatarURL() ||  this.targetMember.user.defaultAvatarURL;
    const targetBannerUrl = this.targetMember.user.bannerURL({size: 512, dynamic: true}) || this.targetMember.guild.bannerURL({size: 512}) || this.targetMember.guild.iconURL({size: 128})
    const targetPremiumSince = this.targetMember.premiumSince? milToHR(Date.now() - this.targetMember.premiumSince.getTime(), {compact: true}) : "Not Subscribed big OOF"
    const authorNickName = this.authorMember.nickname? this.authorMember.nickname : this.authorMember.user.username;
    const authorAvatarUrl = this.authorMember.avatarURL() ||  this.authorMember.user.avatarURL() || this.authorMember.user.defaultAvatarURL;
    const targetFirstTimeJoined = this.memberData.firstTimeJoined
    const reputationCount = this.reputationData.reputationCount
    const reputationEmote = reputationCount >= 0? "<:upvote:290672088761761792>" : "<:downvote:290672130515795969>"
    const color = this.targetMember.displayHexColor
    const embed = new discord.MessageEmbed()
      .setTitle(`${targetNickName} Profilis`)
      .setThumbnail(`${targetAvatarUrl}`)
      .setFields([
        {name: `Narys jau:`, value: `📆 **${milToHR(Date.now() - targetFirstTimeJoined.getTime(), {compact: true})}**`, inline: true},
        {name: `Reputacija`, value: `${reputationEmote} **${reputationCount}**`, inline: true},
        {name: `Žinutės:`, value: `📨 **${this.messageCount}**`, inline: true},
        {name: `Premium`, value: `<a:nitro:911619302107525130> **${targetPremiumSince}**`}
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

export default HomePage;
