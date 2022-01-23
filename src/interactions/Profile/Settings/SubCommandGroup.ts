import discord from "discord.js";
import Client from "../../../Client";
import Description from "./Description";

class SubCommandGroup {
    //description: Description = new Description(this)
    interaction: discord.CommandInteraction
    authorMember: discord.GuildMember;
    client: Client
    options: Map<string, Function> = new Map();

    constructor(authorMember: discord.GuildMember, interaction: discord.CommandInteraction, client: Client){
        this.interaction = interaction;
        this.authorMember = authorMember;
        this.client = client
    }

    async runCommand(){
        const commandGroup = this.interaction.options.getSubcommandGroup();
        const action = this.options.get(`${commandGroup}`)
        if(!action) return console.error(commandGroup, " No Such Command");
        await action();
        return;
    }
}

export default SubCommandGroup;