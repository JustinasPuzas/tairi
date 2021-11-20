import discord from "discord.js";
import reputationDb from "../../../database/schemas/reputation";
import ReputationApi from "../../../database/schemas/reputationApi";
import PageApi from "./Page";

class ReputationPage implements PageApi{
  readonly name = "reputationPage";
  authorMember: discord.GuildMember;
  targetMember: discord.GuildMember;
  private navActionRow: discord.MessageActionRow;
  // data
  private reputationList!: ReputationApi[];
  private reputationWithCommentsList!: ReputationApi[];
  private positiveReputationCount: number = 0;
  private negativeReputationCount: number = 0;
  public reputationCount: number = this.positiveReputationCount - this.negativeReputationCount;
  //response data
  private pageId = 0;
  private page: discord.MessageOptions = {embeds: [], components: []}
  private buttons!: discord.MessageButton[];

  constructor(
    authorMember: discord.GuildMember,
    targetMember: discord.GuildMember,
    navActionRow: discord.MessageActionRow,
    reputationData: ReputationApi[]
  ) {
    this.targetMember = targetMember;
    this.authorMember = authorMember;
    this.navActionRow = navActionRow;
    this.reputationList = reputationData;
    this.loadData();
    this.updateButtons();
    this.updateEmbed();
  }

  async getPage(){
    this.loadData();
    this.updateButtons();
    this.updateEmbed();
    return this.page;
  }

  async buttonClickHandler(customId: string){
    // handle updating info on btn click
    switch (customId) {
      case "nextRepPage":
        this.pageId++
        this.updateButtons();
        this.updateEmbed();
        return this.page;
      case "prevRepPage":
        this.pageId--
        this.updateButtons();
        this.updateEmbed();
        return this.page;
      default:
        return null;
    }
    // update pages buttons
  }

  private updateButtons() {
    this.buildActionRow();
    const btnRow = this.buttons.values()
    const row = new discord.MessageActionRow().addComponents([
      ...btnRow
    ]);
    this.page.components = [this.navActionRow, row]
  }

  private buildActionRow(){
    const displayDownloadButton = (this.authorMember.id == this.targetMember.id) ? true : false;
    const prevPageBtn = this.pageId != 0? new discord.MessageButton()
      .setCustomId("prevRepPage")
      .setStyle("SECONDARY")
      .setLabel(" ")
      .setEmoji("◀️") : new discord.MessageButton()
      .setCustomId("prevRepPage")
      .setStyle("SECONDARY")
      .setDisabled(true)
      .setLabel(" ")
      .setEmoji("◀️")
    const nextPageBtn = ((this.pageId + 1) * 10) < this.reputationWithCommentsList.length? new discord.MessageButton()
      .setCustomId("nextRepPage")
      .setStyle("SECONDARY")
      .setLabel(" ")
      .setEmoji("▶️") : null
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
      const color = this.targetMember.displayHexColor
      const userName = this.targetMember.nickname? this.targetMember.nickname: this.targetMember.user.username;
    let description = `***+REP:*** **${this.positiveReputationCount}** | ***-REP:*** **${this.negativeReputationCount}**\n***Viso:*** **${this.reputationCount}**\n`;
    const embed = new discord.MessageEmbed()
      .setTitle(`${userName} | REPUTACIJA`)
      .setThumbnail(`${avatarUrl}`);
    //let index = 0;
    for (const rep of this.reputationWithCommentsList.slice(0 + (this.pageId * 10), 10 + (this.pageId * 10))){
        const comment = rep.content?.slice(0, 100);
        description += `\n ${rep.positive? "<:plusRep:911045255904784434>" : "<:minusRep:911044834767274004>"} <@${rep.authorId}>: ${comment} `
        //index++;
      //if(index == 10) break;
    }
    embed.setDescription(description)
    .setFooter(`Page: ${this.pageId + 1}/${ Math.ceil(this.reputationWithCommentsList.length / 10)}`, `${authorAvatarUrl}`)
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

    console.log(this.reputationWithCommentsList);
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
    console.log(this.reputationWithCommentsList);
    this.positiveReputationCount = positiveReputation;
    this.negativeReputationCount = negativeReputation
    this.reputationCount = positiveReputation - negativeReputation;
  }
}

export default ReputationPage;
