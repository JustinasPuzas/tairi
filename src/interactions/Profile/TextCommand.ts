import discord from "discord.js";
import Client from "../../Client";
import config from "../../config";
import TextCommandApi from "../command";
import Profile from './Profile'

class ProfileTextCommand implements TextCommandApi {
    name = ['profile']
    description = "Patikrink Profili"
    usage = `+profile @UserName`

    private Parent: Profile

    constructor(mainClass: Profile){
        this.Parent = mainClass;
    }

    isThisCommand(commandName: string){
        return this.name.includes(commandName)
    }



    async runCommand(args: string[], message: discord.Message, client: Client ){
        const guild = client.guilds.cache.get(config.guildId) as discord.Guild;
        const authorId = message.author.id;
        const authorMember = guild.members.cache.get(authorId) as discord.GuildMember;
        const targetMember = message.mentions.members?.first()
        
        if(targetMember){
            await this.Parent.executeCommand(authorMember, targetMember, message, client)
        }else{
            await this.Parent.executeCommand(authorMember, authorMember, message, client)}
        setTimeout(async () => {
            await message.delete().catch(err => console.log(err))
        }, 2 * 60 * 1000);
    }
}

export default ProfileTextCommand;