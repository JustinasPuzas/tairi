import discord from "discord.js";
import MemberApi from "../../../database/schemas/memberApi";
import reputationDb from "../../../database/schemas/reputation";
import ReputationApi from "../../../database/schemas/reputationApi";
import PageApi from "./Page";
import milToHR from 'pretty-ms';
import ReputationPage from "./ReputationPage";
import DiscordPage from "./DiscordPage";
import EconomyPage from "./EconomyPage";

class HomePage implements PageApi {
  readonly name = "reputationPage";
  authorMember: discord.GuildMember;
  targetMember: discord.GuildMember;
  private page: discord.MessageOptions = { embeds: [], components: [] };
  private selectMenu!: discord.MessageSelectMenu;
  private memberData: MemberApi;
  private reputationData: ReputationPage;
  private messageCount: number;
  private discordPage: DiscordPage;
  private economyPage: EconomyPage;
  private pageId: "profile" | "discord" | "bank" = "profile";
  
  private placeHolderMap = {
    "profile" : "Lounge Profilis",
    "bank": "Lounge Ekonomika",
    "discord" : "Discord Profilis",
  }

  constructor(
    authorMember: discord.GuildMember,
    targetMember: discord.GuildMember,
    memberData: MemberApi,
    reputationData: ReputationPage,
    messageCount: number,
    
  ) {
    this.targetMember = targetMember;
    this.authorMember = authorMember;
    this.memberData = memberData;
    this.reputationData = reputationData;
    this.messageCount = messageCount;
    
    this.discordPage = new DiscordPage(this.authorMember, this.targetMember);
    this.economyPage = new EconomyPage(this.authorMember, this.targetMember, memberData);
  }

  getPage(navRow: discord.MessageActionRow) {
    this.updateButtons(navRow);
    this.updateEmbed();
    switch (this.pageId) {
      case "profile":
        return this.page;
      case "discord":
        return this.discordPage.getPage(navRow, this.selectMenu);
      case "bank":
        return this.discordPage.getPage(navRow, this.selectMenu);
      default:
        return this.page;
    }
  }

  private async updateButtons(navRow: discord.MessageActionRow) {
    this.buildActionRow();
    const row = new discord.MessageActionRow().addComponents([this.selectMenu]);
    this.page.components = [navRow, row]
  }

  private buildActionRow(){
    let options = [
      {
        emoji: "<:lounge:914670459147124796>",
        default: this.pageId == "profile"? true : false,
        label: 'Lounge Profilis',
        description: 'Lounge Profilio informacija',
        value: 'profile',
      },
      this.memberData.sql? 
      {
        default: this.pageId == "bank"? true : false,
        emoji: "<:auksas:889548108160172062>",
        label: 'Lounge Ekonomika',
        description: 'Lounge Ekonomikos informacija',
        value: 'bank',
      } : null,
      {

        default: this.pageId == "discord"? true : false,
        emoji: "<:discordwhite:914651582338043974>",
        label: 'Discord Profilis',
        description: 'Discord Profilio informacija',
        value: 'discord',
      },
    ]

    function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
      return value !== null && value !== undefined;
    }

    this.selectMenu = new discord.MessageSelectMenu()
      .setCustomId('profileSelectMenu')
      .setMaxValues(1)
      .setPlaceholder(`${this.placeHolderMap[`${this.pageId}`]}`)
      .addOptions(options.filter(notEmpty) as discord.MessageSelectOptionData[]);
  }

  async buttonClickHandler(interaction: discord.SelectMenuInteraction, navRow: discord.MessageActionRow) {
    const value = interaction.values[0];
    return this.servePage(value, navRow);
  }

  private servePage(value: string, navRow: discord.MessageActionRow){

    switch (value) {
      case "profile":
        this.pageId = "profile";
        (navRow.components[0] as discord.MessageButton).setLabel("Profilis").setEmoji("<:lounge:914670459147124796>")

        return this.getPage(navRow);
      case "discord":
        this.pageId = "discord";
        //this.selectMenu.setPlaceholder("Discord");
        (navRow.components[0] as discord.MessageButton).setLabel("Discord").setEmoji("<:discordwhite:914651582338043974>")
        this.updateButtons(navRow);
        return this.discordPage.getPage(navRow, this.selectMenu);
      case "bank":
        this.pageId = "bank";
        (navRow.components[0] as discord.MessageButton).setLabel("Ekonomika").setEmoji("<:auksas:889548108160172062>");
        this.updateButtons(navRow);
        return this.economyPage.getPage(navRow, this.selectMenu);
      default:
        return null;
    }
  }

  updateEmbed() {
    const targetNickName = this.targetMember.nickname? this.targetMember.nickname : this.targetMember.user.username;
    const targetAvatarUrl = this.targetMember.avatarURL() || this.targetMember.user.avatarURL() ||  this.targetMember.user.defaultAvatarURL;
    const targetBannerUrl = this.targetMember.user.bannerURL({size: 512, dynamic: true}) || this.targetMember.guild.bannerURL({size: 512}) || this.targetMember.guild.iconURL({size: 128})
    const targetPremiumSince = this.targetMember.premiumSince? milToHR(Date.now() - this.targetMember.premiumSince.getTime(), {compact: true}) : null
    const authorNickName = this.authorMember.nickname? this.authorMember.nickname : this.authorMember.user.username;
    const authorAvatarUrl = this.authorMember.avatarURL() ||  this.authorMember.user.avatarURL() || this.authorMember.user.defaultAvatarURL;
    const targetFirstTimeJoined = this.memberData.firstTimeJoined
    const reputationCount = this.reputationData.reputationCount
    const reputationEmote = reputationCount >= 0? "<:plusIcon:911780569694740510>" : "<:minusIcon:911780550983970836>"
    const color = this.targetMember.displayHexColor
    const embed = new discord.MessageEmbed()
      .setTitle(`${targetNickName} | Profilis`)
      .setThumbnail(`${targetAvatarUrl}`)
      .setFields([
        {name: `Narys jau`, value: `📆 **${milToHR(Date.now() - targetFirstTimeJoined.getTime(), {compact: true})}**`, inline: true},
        {name: `Reputacija`, value: `${reputationEmote} **${reputationCount}**`, inline: true},
        {name: `Žinutės`, value: `📨 **${this.messageCount}**`, inline: true},
      ])
      .setFooter(`${authorNickName}`, `${authorAvatarUrl}`)
      .setImage(`${targetBannerUrl}`)
      .setColor(color);
      if(targetPremiumSince) embed.addField(`Premium`, `<a:nitro:911619302107525130> **${targetPremiumSince}**`);
    this.page.embeds = [embed];
  }

  public loadData() {
    
  }

  async updateData() {}
}

export default HomePage;
