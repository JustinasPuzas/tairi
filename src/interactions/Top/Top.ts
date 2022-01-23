import discord, { ColorResolvable } from "discord.js";
import config from "../../config";
import reputationDb from "../../database/schemas/reputation";
import ReputationApi from "../../database/schemas/reputationApi";
import milToHR from "pretty-ms";
import TopInteraction from "./InteractionCommand";
import TopTextCommand from "./TextCommand";
import { CommandModuleApi } from "../module";
import MessageTopPage from "./Pages/Messages";
import ReputationTopPage from "./Pages/Reputation";
import Client from "../../Client";
import messageDb from "../../database/schemas/message";

class Top implements CommandModuleApi {
  ready: boolean = false;
  interactionCommand = new TopInteraction(this);
  textCommand = new TopTextCommand(this);
  reputationTopList!: any[];
  openDisplayIn: Map<string, Date> = new Map(); 
  pageId: "reputationPage" | "messagesPage" = "reputationPage";
  navRow!: discord.MessageActionRow;

  async replyError(interaction: discord.CommandInteraction, error: unknown) {
    await interaction.reply({ content: `${error}`, ephemeral: true });
  }

  async executeCommand(
    authorId: string,
    subCommand: "reputation" | "messages",
    interaction: discord.CommandInteraction | discord.Message,
    client: Client
  ) {
    // load correct page
    
    const authorMember = client.Guild.members.cache.get(
      authorId
    ) as discord.GuildMember;

    if(await this.checkCoolDown(authorMember.id, interaction.channelId, interaction)){
      console.log(`On Cd`)
      return;
    }
    this.createCoolDown(authorMember.id, interaction.channelId)
    this.createNavRow();

    const positiveRep = await reputationDb.aggregate([
      {
        $group: {
          _id: "$discordId",
          total: { $sum: { $cond: [{ $eq: ["$positive", true] }, 1, -1] } },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const messages = await messageDb.aggregate([
      {
        $group: {
          _id: "$discordId",
          total: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ])

    const reputationPage = new ReputationTopPage(authorMember, positiveRep, this);
    const messagesPage = new MessageTopPage(authorMember, messages, this)

    const reply = subCommand == "reputation"? reputationPage.getPage(this.navRow) : messagesPage.getPage(this.navRow);
    const response = await interaction.reply({...reply, fetchReply: true}) as discord.Message;
    const responseId = response.id;

    const collector = response.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 2 * 60 * 1000,
    });



    let interactionReply: discord.MessageComponentInteraction | null = null

    collector.on("collect", async (i) => {
      if(i.user.id != authorMember.id){
        await i.reply({content: `UwU pažiūrėk top list su /top reputation, /top messages arba +top`, ephemeral: true})
        return;
      }
      const handlers = [
        await this.buttonClickHandler(i.customId, {reputationPage, messagesPage}, this.navRow),
        await reputationPage.buttonClickHandler(i.customId, this.navRow),
        await messagesPage.buttonClickHandler(i.customId, this.navRow),

      ].filter(handler => handler != null)
      interactionReply = i;
      if(handlers[0])
        await i.update(handlers[0]);
    })

    collector.on("end", async (i) => {
      const channel = client.Guild.channels.cache.get(interaction.channelId) as discord.TextChannel;
      const msg = channel.messages.cache.get(responseId)
      await msg?.delete().catch(err => console.error(err))
    })


    console.log(positiveRep);

    // serve page
    // wait for btn click
    // serve chosen page
    // delete after 2 mins
  }

  private createNavRow(){
    this.navRow = new discord.MessageActionRow().addComponents([
      new discord.MessageButton()
        .setCustomId("reputationPage")
        .setLabel("Reputacijos TOP 10")
        .setStyle("SECONDARY")
        .setEmoji("<:plus:911929035838357505>"),
      new discord.MessageButton()
        .setCustomId("messagesPage")
        .setLabel("Žinučių TOP 10")
        .setStyle("SECONDARY")
        .setEmoji("📨")
    ])
  }

  async buttonClickHandler(customId: string, pages: any, navRow: discord.MessageActionRow) {
    const { reputationPage, messagesPage } = pages;
    console.log(`Click Button ${customId}`)
    switch (customId) {
      case "reputationPage":
        //if(this.pageId === customId) return null;
        console.log(`REP`)
        if(this.pageId == customId){
          reputationPage.reverseOrder();
        }
        return await reputationPage.getPage(navRow);
      case "messagesPage":
        console.log(`MSG`)
        return await messagesPage.getPage(navRow);
      default:
        return null;
    }
  }

  createCoolDown(userId: string, channelId: string){
    this.openDisplayIn.set(channelId, new Date(Date.now()))
  }
  async checkCoolDown(userId:string, channelId:string, interaction: discord.CommandInteraction | discord.Message){
    console.log(`CoolDown`)
    if(config.botCommandChannel.includes(channelId)) return false; // jei kanalas skirtas botu komandoms
    const openSince = this.openDisplayIn.get(channelId)
    if(!openSince) return false;
    const diff = openSince.getTime() + (2*60*1000) -  Date.now()
    if(openSince.getTime() + 2*60*1000 < Date.now()) return false;
    const embed = new discord.MessageEmbed()
      .setTitle('CoolDown')
      .setColor("BLURPLE")
      .setDescription(`Komandą Top galėsite naudoti už ${milToHR(diff)}`)
    const response = await interaction.reply({embeds:[embed], ephemeral: true, fetchReply: true}) as discord.Message;
    setTimeout(async () => {
      await response.delete().catch(err => console.log(err))
    }, diff);
    return true;
    // save active windows and delete them ignore whiteListed Cannels hardCode in
  }
  
}

export default Top;
