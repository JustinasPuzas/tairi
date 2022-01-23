import memberDb from "../../../database/schemas/member";
import discord from "discord.js";
import Settings from "./SubCommandGroup";
import Client from "../../../Client";

class Description extends Settings{

    constructor(authorMember: discord.GuildMember, interaction: discord.CommandInteraction, client: Client){
        super(authorMember, interaction, client)
        this.interaction = interaction;
        this.authorMember = authorMember;
        this.client = client
        this.loadOptions()
    }

    loadOptions(){
        this.options.set("edit", this.editDescription)
    }

    private async editDescription(){
        const description = this.interaction.options.getString("description", true)
        await memberDb.findOneAndUpdate({discordId: this.authorMember.id}, {description: `${description}`});

    }

    private async deleteDescription(){

    }

    private async resetDescription(){

    }

}

export default Description