import { AuditLogEvent } from "discord-api-types";
import discord from "discord.js";
import reputationDb from "../../../database/schemas/reputation";
import ReputationApi from "../../../database/schemas/reputationApi";
import PageApi from "./Page";
import milToHR from 'pretty-ms';

class ReputationPage implements PageApi{
  readonly name = "reputationPage";
  authorMember: discord.GuildMember;
  targetMember: discord.GuildMember;
  // data
  private reputationList!: ReputationApi[];
  private reputationWithCommentsList!: ReputationApi[];
  private positiveReputationCount: number = 0;
  private negativeReputationCount: number = 0;
  public reputationCount: number = this.positiveReputationCount - this.negativeReputationCount;
  public reputationCoolDown: number | null;
  //response data
  private pageId = 0;
  private page: discord.MessageOptions = {embeds: [], components: []}
  private buttons!: discord.MessageButton[];

  constructor(
    authorMember: discord.GuildMember,
    targetMember: discord.GuildMember,
    reputationData: ReputationApi[],
    reputationCoolDown: number | null,
  ) {
    this.targetMember = targetMember;
    this.authorMember = authorMember;
    this.reputationList = reputationData;
    this.reputationCoolDown = reputationCoolDown;
    this.loadData();
    this.updateEmbed();
  }

  async getPage(navRow: discord.MessageActionRow){
    this.loadData();
    this.updateButtons(navRow);
    this.updateEmbed();
    return this.page;
  }

  async buttonClickHandler(customId: string, navRow: discord.MessageActionRow ){
    // handle updating info on btn click
    switch (customId) {
      case "nextRepPage":
        this.pageId++
        this.updateButtons(navRow);
        this.updateEmbed();
        return this.page;
      case "prevRepPage":
        this.pageId--
        this.updateButtons(navRow);
        this.updateEmbed();
        return this.page;
      default:
        return null;
    }
    // update pages buttons
  }

  private updateButtons(navRow: discord.MessageActionRow) {
    this.buildActionRow();

    if(this.buttons.length == 0){
      this.page.components = [navRow]
      return
    }

    const btnRow = this.buttons.values()

    const row = new discord.MessageActionRow().addComponents([
      ...btnRow
    ]);
    
    this.page.components = [navRow, row]
    return;
  }

  private buildActionRow(){
    const displayDownloadButton = (this.authorMember.id == this.targetMember.id) ? true : false;
    let prevPageBtn: discord.MessageButton | null;

    if(this.reputationWithCommentsList.length <=10){
      prevPageBtn = null;
    }else{
      prevPageBtn = this.pageId != 0? new discord.MessageButton()
      .setCustomId("prevRepPage")
      .setStyle("SECONDARY")
      .setLabel(" ")
      .setEmoji("<:leftact:927166928550772756>") : new discord.MessageButton()
      .setCustomId("prevRepPage")
      .setStyle("SECONDARY")
      .setDisabled(true)
      .setLabel(" ")
      .setEmoji("<:leftinc:927166954249285662>")
    }

    const nextPageBtn = ((this.pageId + 1) * 10) < this.reputationWithCommentsList.length? new discord.MessageButton()
      .setCustomId("nextRepPage")
      .setStyle("SECONDARY")
      .setLabel(" ")
      .setEmoji("<:rightact:927166908816556032>") : null
    const allReputation = displayDownloadButton? new discord.MessageButton()
      .setCustomId("getAllRep")
      .setStyle("SECONDARY")
      .setLabel("All")
      .setEmoji("📃") : null
    const buttons = [prevPageBtn, nextPageBtn].filter(btn => btn != null) as discord.MessageButton[];

    this.buttons = buttons;
  }

  private updateEmbed() {
    const authorAvatarUrl = this.authorMember.avatarURL() ||  this.authorMember.user.avatarURL() || this.authorMember.user.defaultAvatarURL;
    const avatarUrl = this.targetMember.avatarURL() || this.targetMember.user.avatarURL() ||  this.targetMember.user.defaultAvatarURL;
    const color = this.targetMember.displayHexColor;
    const userName = this.targetMember.nickname? this.targetMember.nickname: this.targetMember.user.username;
    const authorName = this.authorMember.nickname || this.authorMember.user.username;
    const authorFooter = this.reputationWithCommentsList.length <= 10 ? authorName : `Page: ${this.pageId + 1}/${ Math.ceil(this.reputationWithCommentsList.length / 10)}`
    let description = `***+REP:*** **${this.positiveReputationCount}** | ***-REP:*** **${this.negativeReputationCount}**\n***Viso:*** **${this.positiveReputationCount + this.negativeReputationCount}**  | `;
    console.log(this.reputationCoolDown);
    if(this.targetMember.id == this.authorMember.id){
      description += this.reputationCoolDown? `${milToHR(this.reputationCoolDown,{compact: true})}\n` : "<:plus:911929035838357505>\n";
    }else{
      description += this.reputationCoolDown?  "\n" : `<:plus:911929035838357505>\n`;
    }
    
    const embed = new discord.MessageEmbed()
      .setTitle(`${userName} | REPUTACIJA`)
      .setThumbnail(`${avatarUrl}`);
    //let index = 0;
    for (const rep of this.reputationWithCommentsList.slice(0 + (this.pageId * 10), 10 + (this.pageId * 10))){
        const comment = rep.content?.slice(0, 100);
        description += `\n ${rep.positive? "<:plus:911929035838357505>" : "<:minus2:911930596530454539>"} <@${rep.authorId}>: ${comment} `
        //index++;
      //if(index == 10) break;
    }
    embed.setDescription(description)
    .setFooter(authorFooter, `${authorAvatarUrl}`)
    .setColor(color);
    this.page.embeds = [embed];
  }

  async updateData(){
    const discordId = this.targetMember.id;
    let positiveReputation = 0;
    let negativeReputation = 0;
    this.reputationList = await reputationDb
      .find({ discordId })
      .sort({ timeStamp: -1 });

    this.reputationWithCommentsList = this.reputationList.filter(
      (doc) => doc.content
    );

    this.reputationList.forEach((reputation) => {
      reputation.positive ? positiveReputation++ : negativeReputation++;
    });

    this.reputationCount = positiveReputation - negativeReputation;
  }

  public loadData() {
    let positiveReputation = 0;
    let negativeReputation = 0;
    this.reputationWithCommentsList = this.reputationList.filter(
      (doc) => {
        if(doc.positive){
          positiveReputation++
        }else{
          negativeReputation++
        };
        return doc.content
      }
    );
    this.positiveReputationCount = positiveReputation;
    this.negativeReputationCount = negativeReputation
    this.reputationCount = positiveReputation - negativeReputation;
  }
}

export default ReputationPage;
