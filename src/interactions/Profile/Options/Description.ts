import { CommandModuleApi } from "../../module";
import discord from "discord.js";
import Client from "../../../Client";

class Description{
    
  async executeCommand(
    authorMember: discord.GuildMember,
    description: string,
    request: discord.CommandInteraction | discord.Message,
    client: Client
  ) {
    const oldMemberData = await client.getMember(authorMember);

    const response = await request.reply({...payload, fetchReply:true},) as discord.Message

    const collector = response.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 2 * 60 * 1000,
    });

    collector.on("collect", async (i) => {
      if(i.user.id != authorMember.id){
        await i.reply({content: `Tikrink profilius su /profile view arba +profile`, ephemeral: true})
        return;
      }
      const handlers = [
        await this.buttonClickHandler(i.customId, {reputationPage, homePage, discordPage}),
      ].filter(handler => handler != null)
      
      if(handlers[0])
        await i.update(handlers[0]);
    })

    collector.on("end", async (i) => {
      await response.delete().catch(err => console.error(err))
    })
  }

  private buildNavActionRow() {
    const save = new discord.MessageButton()
      .setCustomId("save")
      .setLabel("Išsaugoti")
      .setStyle("SUCCESS");

    const cancel = new discord.MessageButton()
      .setCustomId("cancel")
      .setLabel("Atšaukti")
      .setStyle("DANGER");

    return new discord.MessageActionRow().addComponents([save, cancel]);
  }

  async buttonClickHandler(customId: string, pages: any){
    const {reputationPage, homePage, discordPage} = pages
    switch (customId) {
      case "save":
        
        return await homePage.getPage()
      case "cancel":

        return await reputationPage.getPage()
      default:
        return null;
    }
  }
}

export default Description;
