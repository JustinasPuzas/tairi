import discord from "discord.js";
import MemberApi, { MemberSqlApi } from "../../../database/schemas/memberApi";
import reputationDb from "../../../database/schemas/reputation";
import ReputationApi from "../../../database/schemas/reputationApi";
import PageApi from "./Page";
import milToHR from 'pretty-ms';

class EconomyPage{
  authorMember: discord.GuildMember;
  targetMember: discord.GuildMember;
  private memberData: MemberApi;
  private page: discord.MessageOptions = { embeds: [], components: [] };
  private selectMenu!: discord.MessageSelectMenu

  constructor(
    authorMember: discord.GuildMember,
    targetMember: discord.GuildMember,
    memberData: MemberApi,
  ) {
    this.targetMember = targetMember;
    this.authorMember = authorMember;
    this.memberData = memberData;
  }

  getPage(navRow: discord.MessageActionRow, selectMenu: discord.MessageSelectMenu) {
    this.selectMenu = selectMenu;
    this.updateButtons(navRow);
    this.updateEmbed();
    return this.page;
  }

  private updateButtons(navRow: discord.MessageActionRow) {
    //this.buildActionRow();
    //const btnRow = this.buttons.values()
    const row = new discord.MessageActionRow().addComponents([this.selectMenu]);
    this.page.components = [navRow, row]
  }

  updateEmbed() {
    const targetNickName = this.targetMember.nickname? this.targetMember.nickname : this.targetMember.user.username;
    const targetAvatarUrl = this.targetMember.avatarURL() || this.targetMember.user.avatarURL() ||  this.targetMember.user.defaultAvatarURL;
    const targetBannerUrl = this.targetMember.user.bannerURL({size: 512, dynamic: true}) || this.targetMember.guild.bannerURL({size: 512}) || this.targetMember.guild.iconURL({size: 128})
    const authorNickName = this.authorMember.nickname? this.authorMember.nickname : this.authorMember.user.username;
    const authorAvatarUrl = this.authorMember.avatarURL() ||  this.authorMember.user.avatarURL() || this.authorMember.user.defaultAvatarURL;
    const {money, gold, xp} = this.memberData.sql as MemberSqlApi;
    
    const currentLevel = this.toLevel(xp)
    const nextLevelIn = this.toXP(currentLevel + 1)

    const color = this.targetMember.displayHexColor
    const embed = new discord.MessageEmbed()
      .setTitle(`${targetNickName} | Ekonomika`)
      .setThumbnail(`${targetAvatarUrl}`)
      .setFields([
        {name: "Auksas", value: `<:auksas:889548108160172062> **${gold}**`, inline: true},
        {name: "Pinigai", value: `💶 **${money}**`, inline: true},
        {name: "Patirtis", value: `💡 **${xp}/${nextLevelIn}**`, inline: true,},
        {name: "Lygis", value: `🌟 **${currentLevel}**`, inline: true}

        //{name: `Id: `, value: `**${this.targetMember.id}**`, inline: true},
        //{name: `Žinutės:`, value: `📨 **${this.messageCount}**`, inline: true},
      ])
      .setFooter(`${authorNickName}`, `${authorAvatarUrl}`)
      .setImage(`${targetBannerUrl}`)
      .setColor(color)
    this.page.embeds = [embed];
  }

  private equate = (level:number) =>{
    return level*30;
  }

  private toXP = (level: number) => {
    let xp = 0;
    for(let i = 1; i < level; i++)
        xp += this.equate(i);
    return xp;
  }
  
  private toLevel = (xp: number) => {
    if(xp == 0) return 1;
    let level = 1;
    while (this.toXP(level) <= xp)
        level++;
    return level-1;
  }

  public loadData() {
    
  }

  async updateData() {}
}

export default EconomyPage;
