import discord, { ColorResolvable } from "discord.js";
import config from "../../config";
import reputationDb from "../../database/schemas/reputation";
import ReputationApi from "../../database/schemas/reputationApi";
import reputationConfigDb from "../../database/schemas/reputationConfig";
import reputationConfigApi from "../../database/schemas/reputationConfigApi";
import milToHR from 'pretty-ms';
import ReputationInteraction from "./InteractionCommand";
import ReputationTextCommand from "./TextCommand";
import { CommandModuleApi } from "../module";


class Reputation implements CommandModuleApi{
  reputationConfig!: reputationConfigApi;
  ready: boolean = false
  interactionCommand = new ReputationInteraction(this);
  textCommand = new ReputationTextCommand(this);
  
  constructor() {
      this.loadData();
  }

  constructResponseEmbed(authorMember:discord.GuildMember, targetMember: discord.GuildMember, positive: boolean, content: string | null){
      const reputationType = positive? "+" : "-" 
      const authorName = authorMember.nickname? authorMember.nickname : authorMember.user.username
      const authorAvatarUrl = authorMember.avatarURL() ||  authorMember.user.avatarURL() || authorMember.user.defaultAvatarURL;
      const targetName = targetMember.nickname? targetMember.nickname : targetMember.user.username
      const targetAvatarUrl =targetMember.avatarURL() || targetMember.user.avatarURL() ||  targetMember.user.defaultAvatarURL;
      const description = content? `${authorMember}: ${content}`: ``
      const color = this.reputationConfig.color == "custom"? authorMember.displayHexColor : this.reputationConfig.color as ColorResolvable
      const colorFromType = positive? "GREEN" : "RED";
      const thumbNail = positive? "https://cdn.discordapp.com/attachments/889562324678107206/911928356763750420/plus.png" : "https://cdn.discordapp.com/attachments/889562324678107206/911929683594072064/minus2.png"
      const embed1 = new discord.MessageEmbed()
        .setThumbnail(thumbNail)
        .setAuthor(`${targetName}`, `${targetAvatarUrl}`)
        .setDescription(`${description}`) //${targetMember} Gavo ${reputationType}Reputacijos nuo ${authorMember}\n
        .setColor(colorFromType)
        .setFooter(authorName, `${authorAvatarUrl}`)
      return [embed1]
  }

  async replyError(interaction: discord.CommandInteraction, error: unknown){
    await interaction.reply({content: `${error}`, ephemeral: true})
  }

  async executeCommand(authorId: string, targetId: string | undefined, content: string | null, positive: boolean, roles:discord.Collection<string, discord.Role>,){
      // is member a Bot? O.o
      await this.isBlackListed(roles); // add to take in member role array
      // is member in guild ?
      // limit content up to 250 char ???
      
      await this.isSelf( authorId, targetId);
      await this.checkCoolDown(authorId);
      await this.giveReputation(authorId, targetId as string, content, positive);
  }

  private async isSelf(authorId: string, discordId: string | undefined){
    if(!discordId) throw new Error("Negalite duodi reputacijos taškų šiam vartotojui")
    if(discordId == authorId) throw new Error("Negalite duoti reputacijos sau");
  }

  private async isBlackListed(roles: discord.Collection<string, discord.Role>){
    
      for(const blackListedRole of this.reputationConfig.blackListed){
          if(roles.has(blackListedRole)) throw new Error("Negalite duoti teigiamų ar neigiamų reputacijos taškų kitiems :/");
      }      
  }

  private async checkCoolDown(authorId: string){
    const lastRecord = await reputationDb.findOne({authorId}).sort({timeStamp: -1}) as ReputationApi
    if(!lastRecord) return;
    const timeStamp = new Date(lastRecord.timeStamp)
    const currentTime = new Date(Date.now());
    await this.loadData();
    const diff = (timeStamp.getTime() + this.reputationConfig.coolDown) - currentTime.getTime()
    if(diff > 0) throw new Error(`Galesite duoti reputacija už ${milToHR(diff, {compact: true})}`);
  }

  private async giveReputation(authorId: string, discordId: string, content: string | null, positive: boolean){
    console.log(authorId, discordId, positive, content);

    await reputationDb.create({authorId, discordId, positive, content, timeStamp: Date.now()});
  }

  private async loadData(){
      this.reputationConfig = await reputationConfigDb.findOne({guildId: config.guildId})
      this.ready = true;
  }
}

export default Reputation;