import discord, { ColorResolvable, TextChannel } from "discord.js";
import config from "../../config";
import apiCommand from "../command";
import Client from "../../Client";
import reputationConfigDb from "../../database/schemas/reputationConfig";
import reputationConfigApi from "../../database/schemas/reputationConfigApi";

class Maintenance implements apiCommand {
  readonly name = ["maintenance", "settings"];
  readonly maintenance: boolean = false;
  readonly description = "`+maintenance` enables or disables maintenance mode";
  private reputationConfig!: reputationConfigApi;
  private _ready: boolean = false;

  constructor() {
    this.loadData();
  }

  public isThisCommand(commandName: string): boolean {
    return this.name.includes(commandName);
  }

  public hasPerms(member: discord.GuildMember): boolean {
    const guild = member.guild;
    return guild.ownerId === member.user.id;
  }

  public isReady(): boolean {
    return this._ready;
  }

  public async runCommand(
    args: string[],
    message: discord.Message,
    client: Client
  ) {
    const member = message.member as discord.GuildMember;
    if (!this.hasPerms(member)) return;
    const channel = message.channel as discord.TextChannel;
    let msgContent = this.buildMessage(client)
    const response = await message.reply(msgContent)
    const collector = response.createMessageComponentCollector({
        componentType: "BUTTON",
        time: 10 * 60 * 1000
    })

    collector.on("collect", async (i) => {
        if(i.user.id != member.id){
            await i.reply({content: "O.o No."})
            return;
        } 
        if(i.customId == 'exit'){
            await i.reply({content: "Closed"})
            await response.delete().catch(err => {
                console.log(err)
            })
        }
        if(i.customId != "toggleMaintenance") return;
        client.setMaintenanceMode(!client.getMaintenanceMode())
        msgContent = this.buildMessage(client)
        await i.update(msgContent)
    })

    collector.on("end", async ()=> {
        await response.delete().catch(err => {
            console.log(err)
        })
    })

  }

  private buildMessage(client: Client){
    const maintenanceMode = client.getMaintenanceMode()
    const color = maintenanceMode? "PURPLE" : "GREEN"
    const embed = new discord.MessageEmbed()
    .setTitle(`Maintenance Mode ${maintenanceMode}`)
    .setColor(color);
    const label = maintenanceMode? "Disable" : "Enable"
    const style = maintenanceMode? "SUCCESS" : "DANGER"
    const row = new discord.MessageActionRow().addComponents([
        new discord.MessageButton()
              .setCustomId("toggleMaintenance")
              .setLabel(label)
              .setStyle(style),
        new discord.MessageButton()
              .setCustomId("exit")
              .setLabel("Exit")
              .setStyle("PRIMARY")  
    ]);

    return {embeds:[embed], components: [row]}
  }
  
  private async loadData() {
    return;
  }
}

export default Maintenance;
