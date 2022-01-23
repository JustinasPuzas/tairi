import InteractionCommandApi from "../interaction";
import discord from 'discord.js'
import Client from "../../Client";
import Top from "./Top";
import config from "../../config";



class TopInteraction implements InteractionCommandApi {
    readonly name = "top";
    private Parent: Top;
    
    constructor(mainClass: Top){
        this.Parent = mainClass
    }

    async runCommand(interaction: discord.CommandInteraction, client: Client ){
        const guild = client.guilds.cache.get(config.guildId) as discord.Guild;
        const authorId = interaction.user.id;
        const authorMember = guild.members.cache.get(authorId) as discord.GuildMember;
        const subCommand: "reputation" | "messages" = interaction.options.getSubcommand()? interaction.options.getSubcommand() as "reputation" | "messages" : "reputation";
        await this.Parent.executeCommand(authorId, subCommand, interaction, client);
    }
}

export default TopInteraction;