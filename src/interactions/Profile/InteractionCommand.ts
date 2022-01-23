import discord from 'discord.js'
import Client from "../../Client";
import Profile from './Profile';
import config from "../../config";
import InteractionCommandApi from '../interaction';
import reputationDb from '../../database/schemas/reputation';
import SubCommandGroup from './Settings/SubCommandGroup';
import Description from './Settings/Description';
//import Settings from './Settings/Settings';



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
        //const settings = new Settings(authorMember, interaction, client);
        try{

        }catch (err){

        }

        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case "view":
                await this.Parent.executeCommand(authorMember, targetMember, interaction, client)
                break;
            case "description":
                const description = new Description(authorMember, interaction, client)
                
                break;
            default:
                break;
        }
    }
}

export default ProfileInteraction;

