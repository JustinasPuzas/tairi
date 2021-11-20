import reputationConfigApi from "../../database/schemas/reputationConfigApi";
import { CommandModuleApi } from "../module";
import ProfileInteraction from "./InteractionCommand";
import ReputationPage from "./Pages/ReputationPage";
import discord from "discord.js";
import Client from "../../Client";
import PageApi from "./Pages/Page";
import ProfileTextCommand from "./TextCommand";
import reputationDb from "../../database/schemas/reputation";
import ReputationApi from "../../database/schemas/reputationApi";
import HomePage from "./Pages/HomePage";
import DiscordPage from "./Pages/DiscordPage";
import messageDb from "../../database/schemas/message";

class Profile implements CommandModuleApi {
  private reputationConfig!: reputationConfigApi;
  ready: boolean = true;

  interactionCommand = new ProfileInteraction(this);
  textCommand = new ProfileTextCommand(this);
  // default active time 30s 
  // each interaction +30s
  // max 2min
  // cd after usage end for member 30s
  // wite list channel with no cd O.o 
  constructor() {
    console.log(`PROFILE`);
  }

  async executeCommand(
    authorMember: discord.GuildMember,
    targetMember: discord.GuildMember,
    request: discord.CommandInteraction | discord.Message,
    client: Client
  ) {
    const navActionRow = this.buildNavActionRow();
    const reputationData = this.getReputation(targetMember.id)
    const memberData = client.getMember(targetMember)
    const memberMessageCount = this.getMessageCount(targetMember.id)
    const results = await Promise.all([reputationData, memberData, memberMessageCount, await targetMember.user.fetch()])

    const discordPage = new DiscordPage(authorMember, targetMember, navActionRow);

    const reputationPage = new ReputationPage(authorMember, targetMember, navActionRow, results[0]);
    const homePage = new HomePage(authorMember, targetMember, navActionRow, results[1], reputationPage, results[2]);
    const payload = homePage.getPage();
    const response = await request.reply({...payload, fetchReply:true},) as discord.Message

    const collector = response.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 2 * 60 * 1000,
    });

    collector.on("collect", async (i) => {
      if(i.user.id != authorMember.id){
        await i.reply({content: `UwU Tikrink profilius su /profile view arba +profile`, ephemeral: true})
        return;
      }
      const handlers = [
        await this.buttonClickHandler(i.customId, {reputationPage, homePage, discordPage}),
        await reputationPage.buttonClickHandler(i.customId),
      ].filter(handler => handler != null)
      
      if(handlers[0])
        await i.update(handlers[0]);
    })

    collector.on("end", async (i) => {
      await response.delete().catch(err => console.error(err))
    })
  }

  private async getReputation(discordId: string){
    return (await reputationDb.find({ discordId }).sort({ timeStamp: -1 })) as ReputationApi[];
  }

  private async getMessageCount(discordId: string){
    return (await messageDb.countDocuments({discordId}))
  }

  private buildNavActionRow() {
    const homePage = new discord.MessageButton()
      .setCustomId("homePage")
      .setLabel("Profilis")
      .setStyle("PRIMARY");

    const reputationPage = new discord.MessageButton()
      .setCustomId("reputationPage")
      .setLabel("Reputacija")
      .setStyle("PRIMARY");

    const discordPage = new discord.MessageButton()
      .setCustomId("discordPage")
      .setLabel("Discord")
      .setStyle("SECONDARY")
      //.setEmoji("<a:discord:911592752658128926>")
    return new discord.MessageActionRow().addComponents([homePage, reputationPage, discordPage]);
  }

  async buttonClickHandler(customId: string, pages: any){
    const {reputationPage, homePage, discordPage} = pages
    switch (customId) {
      case "homePage":

        return await homePage.getPage()
      case "reputationPage":

        return await reputationPage.getPage()
      case "discordPage":

        return await discordPage.getPage()
      default:
        return null;
    }
  }
  // create nav buttons
  // create pages
  // with buttons
  //
}

export default Profile;
