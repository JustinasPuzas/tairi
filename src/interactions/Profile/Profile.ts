import reputationConfigApi from "../../database/schemas/reputationConfigApi";
import { CommandModuleApi } from "../module";
import ProfileInteraction from "./InteractionCommand";
import ReputationPage from "./Pages/ReputationPage";
import discord, { GuildMemberManager } from "discord.js";
import Client from "../../Client";
import PageApi from "./Pages/Page";
import ProfileTextCommand from "./TextCommand";
import reputationDb from "../../database/schemas/reputation";
import ReputationApi from "../../database/schemas/reputationApi";
import HomePage from "./Pages/HomePage";
import DiscordPage from "./Pages/DiscordPage";
import messageDb from "../../database/schemas/message";
import milToHR from 'pretty-ms';
import reputationConfigDb from "../../database/schemas/reputationConfig";
import config from "../../config";

class Profile implements CommandModuleApi {
  private reputationConfig!: reputationConfigApi;
  ready: boolean = true;

  interactionCommand = new ProfileInteraction(this);
  textCommand = new ProfileTextCommand(this);
  openDisplayIn: Map<string, Date> = new Map(); 
  // default active time 30s 
  // each interaction +30s
  // max 2min
  // cd after usage end for member 30s
  // wite list channel with no cd O.o 
  constructor(){
    this.loadData();
  }


  async executeCommand(
    authorMember: discord.GuildMember,
    targetMember: discord.GuildMember,
    request: discord.CommandInteraction | discord.Message,
    client: Client
  ){
    const reputationData = this.getReputation(targetMember.id)
    const memberData = client.getMember(targetMember)
    const memberMessageCount = this.getMessageCount(targetMember.id)
    const reputationCoolDown = this.getReputationCooldown(targetMember.id)
    if(await this.checkCoolDown(authorMember.id, request.channelId, request)) return;
    this.createCoolDown(authorMember.id, request.channelId)


    //const targetMemberAvatarEomte = this.createTargetMemberAvatarEmotr(targetMember)
    const results = await Promise.all([reputationData, memberData, memberMessageCount, reputationCoolDown,  await targetMember.user.fetch()])
    const reputationPage = new ReputationPage(authorMember, targetMember, results[0], results[3]);
    const navActionRow = this.buildNavActionRow(reputationPage.reputationCount);
    const homePage = new HomePage(authorMember, targetMember, results[1], reputationPage, results[2]);
    const payload = homePage.getPage(navActionRow);
    const response = await request.reply({...payload, fetchReply:true},) as discord.Message
    const responseId = response.id;
    const collector = response.createMessageComponentCollector({
      //componentType: "BUTTON",
      time: 2 * 60 * 1000,
    });
    let interactionReply: discord.MessageComponentInteraction | null = null
    collector.on("collect", async (i) => {
      if(i.user.id != authorMember.id){
        await i.reply({content: `UwU Tikrink profilius su /profile view arba +profile`, ephemeral: true})
        return;
      }
      const handlers = [
        await this.buttonClickHandler(i.customId, {reputationPage, homePage}, navActionRow),
        i.isSelectMenu() ? await homePage.buttonClickHandler(i, navActionRow) : null,
        await reputationPage.buttonClickHandler(i.customId, navActionRow),

      ].filter(handler => handler != null)
      interactionReply = i;
      if(handlers[0])
        await i.update(handlers[0]);
    })

    // collector.on("dispose", async (i) => {
    //   console.log("DISPOSE");
    //   await i.deleteReply()
    // })

    collector.on("end", async (i) => {
      const channel = client.Guild.channels.cache.get(request.channelId) as discord.TextChannel;
      const msg = channel.messages.cache.get(responseId)
      await msg?.delete().catch(err => console.error(err))
      //await (await response.fetch()).delete().catch(err => console.error(err))
      //await response.delete().catch(err => console.error(err))
    })
  }

  private async getReputation(discordId: string){
    return (await reputationDb.find({ discordId }).sort({ timeStamp: -1 })) as ReputationApi[];
  }

  private async getMessageCount(discordId: string){
    return (await messageDb.countDocuments({discordId}))
  }

  private async getReputationCooldown(authorId: string){
    const lastRecord = await reputationDb.findOne({authorId}).sort({timeStamp: -1}) as ReputationApi
    if(!lastRecord) return null;
    const timeStamp = new Date(lastRecord.timeStamp)
    const currentTime = new Date(Date.now());
    const diff = (timeStamp.getTime() + this.reputationConfig.coolDown) - currentTime.getTime()
    console.log(timeStamp.getTime(), this.reputationConfig.coolDown, currentTime.getTime())
    if(diff > 0) return diff
    else return null
  }

  private buildNavActionRow(reputation: number) {
    const homePage = new discord.MessageButton()
      .setCustomId("homePage")
      .setLabel("Profilis")
      .setStyle("PRIMARY")
      .setEmoji("<:lounge:914670459147124796>");

    const reputationPage = new discord.MessageButton()
      .setCustomId("reputationPage")
      .setLabel("Reputacija")
      .setStyle("PRIMARY");
    if(reputation > 0) reputationPage.setStyle("SUCCESS").setEmoji("<:plus:911929035838357505>")
    else if(reputation < 0)  reputationPage.setStyle("DANGER").setEmoji("<:minus2:911930596530454539>")
  
    return new discord.MessageActionRow().addComponents([homePage, reputationPage]);
  }

  async buttonClickHandler(customId: string, pages: any, navRow: discord.MessageActionRow){
    const {reputationPage, homePage, discordPage} = pages
    switch (customId) {
      case "homePage":

        return await homePage.getPage(navRow)
      case "reputationPage":

        return await reputationPage.getPage(navRow)
      default:
        return null;
    }
  }

  createCoolDown(userId: string, channelId: string){
    this.openDisplayIn.set(channelId, new Date(Date.now()))
  }

  async checkCoolDown(userId:string, channelId:string, interaction: discord.CommandInteraction | discord.Message){
    if(config.botCommandChannel.includes(channelId)) return false; // jei kanalas skirtas botu komandoms
    const openSince = this.openDisplayIn.get(channelId)
    if(!openSince) return false;
    const diff = openSince.getTime() + (2*60*1000) -  Date.now()
    if(openSince.getTime() + 2*60*1000 < Date.now()) return false;
    const embed = new discord.MessageEmbed()
      .setTitle('CoolDown')
      .setColor("BLURPLE")
      .setDescription(`Komandą Profile galėsite naudoti už ${milToHR(diff)}`)
    const response = await interaction.reply({embeds:[embed], ephemeral: true, fetchReply: true}) as discord.Message;
    setTimeout(async () => {
      await response.delete().catch(err => console.log(err))
    }, diff);
    return true;
    // save active windows and delete them ignore whiteListed Cannels hardCode in
  }


  async loadData(){
    this.reputationConfig = await reputationConfigDb.findOne({guildId: config.guildId})
  }
}

export default Profile;
