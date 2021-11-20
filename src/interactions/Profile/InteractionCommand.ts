import discord from 'discord.js'
import Client from "../../Client";
import Profile from './Profile';
import config from "../../config";
import InteractionCommandApi from '../interaction';
import reputationDb from '../../database/schemas/reputation';



class ProfileInteraction implements InteractionCommandApi {
    readonly name = "profile";
    private Parent: Profile;
    
    constructor(mainClass: Profile){
        this.Parent = mainClass
    }

    // CommandInteractionOptionResolver {
    //     _group: null,
    //     _subcommand: 'view',
    //     _hoistedOptions: [
    //       {
    //         name: 'member',
    //         type: 'USER',
    //         value: '655175393342521383',
    //         user: [User],
    //         member: [GuildMember]
    //       }
    //     ]
    //   }

    async runCommand(interaction: discord.CommandInteraction, client: Client){
        console.log(interaction.options)
        const guild = client.guilds.cache.get(config.guildId) as discord.Guild;
        const members = guild.members.cache;
        const authorId = interaction.user.id;
        const authorMember = members.get(authorId) as discord.GuildMember;
        const channel = interaction.channel as discord.TextChannel;
        const options = interaction.options
        const targetId = options.getUser("member")? options.getUser("member")?.id : authorId as string
        let targetMember = (members.get(`${targetId}`)? members.get(`${targetId}`) : authorMember) as discord.GuildMember
        if(targetMember.user.bot) targetMember = authorMember;
        // handle input errors O.o
        

        await this.Parent.executeCommand(authorMember, targetMember, interaction, client)
    }
}

export default ProfileInteraction;

