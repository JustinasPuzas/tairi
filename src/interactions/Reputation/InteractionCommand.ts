import InteractionCommandApi from "../interaction";
import discord from 'discord.js'
import Client from "../../Client";
import Reputation from "./Reputation";
import config from "../../config";



class ReputationInteraction implements InteractionCommandApi {
    readonly name = "rep";
    private Parent: Reputation;
    
    constructor(mainClass: Reputation){
        this.Parent = mainClass
    }

    async runCommand(interaction: discord.CommandInteraction, client: Client ){
        console.log(`REP COMMAND`)
        const guild = client.guilds.cache.get(config.guildId) as discord.Guild
        const authorId = interaction.user.id;
        const authorMember = guild.members.cache.get(authorId) as discord.GuildMember;
        const targetId = interaction.options.getUser('username')?.id as string;
        const targetMember = guild.members.cache.get(targetId) as discord.GuildMember;
        const positive = interaction.options.getSubcommand() == "plus"? true : false;
        const content = interaction.options.getString('comment');
        const roles = authorMember.roles.cache;

        try{
            await this.Parent.executeCommand(authorId, targetId, content, positive, roles)
        }catch (err){
            console.log(err)
            this.Parent.replyError(interaction, err)
            return;
        }

        const embeds = this.Parent.constructResponseEmbed(authorMember, targetMember, positive, content);
        const responseMessage = await interaction.reply({content: `${targetMember}`,embeds, ephemeral: false});
        setTimeout( async () => {
            await interaction.deleteReply().catch(err => console.log(err))
        }, 30000)
    }
}

export default ReputationInteraction;