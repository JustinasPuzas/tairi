import discord from "discord.js";
import MemberApi from "../../../database/schemas/memberApi";
import reputationDb from "../../../database/schemas/reputation";
import ReputationApi from "../../../database/schemas/reputationApi";
import milToHR from "pretty-ms";
import Top from "../Top";

class ReputationTopPage {
  authorMember: discord.GuildMember;
  private pageId: number = 0;
  private page: discord.MessageOptions = { embeds: [], components: [] };
  private selectMenu!: discord.MessageSelectMenu;
  private list: { _id: string; total: number }[];
  private reverse = false;
  private authorPageId: number = 0;
  private parent:Top;

  private embedColor: "#3AE5B1" | "#EF3457"  = "#3AE5B1";

  reverseOrder(){
    if(this.reverse == false){
      this.reverse = true;
      this.embedColor = "#EF3457"
      this.list.reverse();
      
      (this.parent.navRow.components[0] as discord.MessageButton).setEmoji("<:minus:911929648311574538>")
      console.log(`NOW POSITIVE TO NEGATIVE`)
    }else {
      this.reverse = false
      this.embedColor = "#3AE5B1"
      this.list.reverse();
      (this.parent.navRow.components[0] as discord.MessageButton).setEmoji("<:plus:911929035838357505>")
      console.log(`NOW NEGATIVE TO POSITIVE`)
    }
  }

  constructor(
    authorMember: discord.GuildMember,
    list: { _id: string; total: number }[],
    parent: Top,
  ) {
    this.parent = parent;
    this.authorMember = authorMember;
    this.list = list;
  }

  getPage(
    navRow: discord.MessageActionRow
    // selectMenu: discord.MessageSelectMenu
  ) {
    // this.selectMenu = selectMenu;
    this.parent.pageId = "reputationPage";
    (this.parent.navRow.components[0] as discord.MessageButton).setStyle(this.reverse? "DANGER" : "SUCCESS");
    (this.parent.navRow.components[1] as discord.MessageButton).setStyle("SECONDARY");
    this.buttonClickHandler("initial", navRow);
    return this.page;
  }

  async buttonClickHandler(customId: string, navRow: discord.MessageActionRow) {
    // handle updating info on btn click
    switch (customId) {
      case "nextRepPage":
        this.pageId++;
        this.updateNavRow(navRow);
        this.updateButtons(navRow);
        this.updateEmbed();
        return this.page;
      case "prevRepPage":
        this.pageId--;
        this.updateNavRow(navRow);
        this.updateButtons(navRow);
        this.updateEmbed();
        return this.page;
      case "findMeRepPage":
        this.findAuthorId();
        this.pageId = this.authorPageId;
        this.updateNavRow(navRow);
        this.updateButtons(navRow);
        this.updateEmbed();
        return this.page;
      case "reputationPage":
        console.log(`Minus rep top UwU`);
        this.updateButtons(navRow);
        this.updateEmbed();
        return this.page;
      case "initial":
        this.updateNavRow(navRow);
        this.updateButtons(navRow);
        this.updateEmbed();
        return this.page;
      default:
        return null;
    }
    // update pages buttons
  }

  private updateNavRow(navRow: discord.MessageActionRow) {
    const messageButton = navRow.components[0] as discord.MessageButton;

    const updatedMessageButton =
      this.pageId == 0
        ? messageButton.setLabel(`Reputacijos TOP ${(this.pageId + 1) * 10}`)
        : messageButton.setLabel(
            `Reputacijos TOP ${this.pageId * 10}-${(this.pageId + 1) * 10}`
          );
    return (navRow.components[0] = updatedMessageButton);
  }

  private updateButtons(navRow: discord.MessageActionRow) {
    //navRow: discord.MessageActionRow
    const nextPage = new discord.MessageButton()
      .setCustomId("nextRepPage")
      .setStyle("SECONDARY")
      .setLabel(" ")
      .setEmoji("<:rightact:927166908816556032>");
    const prevPage = new discord.MessageButton()
      .setCustomId("prevRepPage")
      .setStyle("SECONDARY")
      .setLabel(" ")
      .setEmoji("<:leftact:927166928550772756>");
    const findMePage = new discord.MessageButton()
      .setCustomId("findMeRepPage")
      .setStyle("SECONDARY")
      .setLabel(" ")
      .setEmoji("<:findme:927323872095768596>");

    if (this.pageId == 0) prevPage.setDisabled(true).setEmoji("<:leftinc:927166954249285662>");
    if ((this.pageId + 1) * 10 >= this.list.length) nextPage.setDisabled(true).setEmoji("<:rightinc:927166976361660448>");
    const row = new discord.MessageActionRow().addComponents([
      prevPage,
      nextPage,
      findMePage,
    ]);
    this.page.components = [navRow, row];
  }

  findAuthorId() {
    this.list.forEach((item, index) => {
      if (item?._id == this.authorMember.id) {
        this.authorPageId = Math.floor(index / 10);
        return;
      }
    });
  }

  updateEmbed() {
    const authorNickName =
      this.authorMember.nickname || this.authorMember.user.username;
    const authorAvatarUrl =
      this.authorMember.avatarURL() ||
      this.authorMember.user.avatarURL() ||
      this.authorMember.user.defaultAvatarURL;
    let authorPlace: number = 0;
    let description = "";
    let index = 10 * this.pageId;
    let place = 1 + (10 * this.pageId);
    for (; index < 10 * (this.pageId + 1); index++) {
      if (this.list[index]._id == this.authorMember.id) authorPlace = index;
      let name = `${
        this.list[index]._id == this.authorMember.id ? "**" : ""
      } ${place}. <@${this.list[index]._id}>`;
      let score = `${this.list[index].total} ${
        this.list[index].total >= 0
          ? "<:plus:911929035838357505>"
          : "<:minus:911929648311574538>"
      }${this.list[index]._id == this.authorMember.id ? "**" : ""}\n`;
      description += name + score;
      place++;
      if (index == this.list.length - 1) break;
    }

    const embed = new discord.MessageEmbed()
      .setTitle(`🏆 Reputacijos Top 10`)
      .setFooter(`${authorNickName}`, `${authorAvatarUrl}`)
      .setDescription(description)
      .setColor(this.embedColor);
    this.page.embeds = [embed];
  }

  public loadData() {}

  async updateData() {}
}

export default ReputationTopPage;
