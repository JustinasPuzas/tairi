import discord from "discord.js";
import Client from "../../Client";
import config from "../../config";
import reputationDb from "../../database/schemas/reputation";
import ReputationApi from "../../database/schemas/reputationApi";
import TextCommandApi from "../command";
import Reputation from "./Reputation";
import milToHR from 'pretty-ms';

class ReputationTextCommand implements TextCommandApi {
    name = ['rep']
    prefix = ["+", "-"]
    description = "Duok teigiamą arba neigiamą reputacijos tašką pasirinktam vartotojui"
    usage = `${this.prefix[0] + this.name[0]} @UserName Komentaras - Teigiamas reputacijos taškas\n${this.prefix[1] + this.name[0]} @UserName Komentaras - Neigiamas reputacijos taškas`

    private Parent: Reputation

    constructor(mainClass: Reputation){
        this.Parent = mainClass;
    }

    isThisCommand(commandName: string){
        return this.name.includes(commandName)
    }



    async runCommand(args: string[], message: discord.Message, client: Client ){
        const guild = client.guilds.cache.get(config.guildId) as discord.Guild;
        const authorId = message.author.id;
        const authorMember = guild.members.cache.get(authorId) as discord.GuildMember;
        const positive = message.content.startsWith(this.prefix[0])? true : false; 
        let targetId = args[1];

        if(!args[1]){ // cd check
            const title = positive? "+" : "-"
            const emote = positive? "<:plus:911929035838357505>" : "<:minus2:911930596530454539>"
            const embed = new discord.MessageEmbed()
                .setTitle(`${title}REP`);

            const coolDown = await this.checkCoolDown(authorMember.id);
            if(coolDown){
                embed.setDescription(`Galėsite naudoti už **${milToHR(coolDown)}**`)
                .setColor("BLURPLE")
            }else{
                embed.setDescription(`Turite laisvą reputacijos tašką ${emote} \nnaudojimas:\n**+rep @mention komentaras\n-rep @mention komentaras**\narba\n**/rep plus\n/rep minus**`)
                .setColor("GREEN")
            }
            const response = await message.reply({embeds: [embed]});
            setTimeout(async () => {
                await message.delete().catch(err => console.log(err));
                await response.delete().catch(err => console.log(err));
            }, 15 * 1000);
            return;
        }

        try{
            targetId = targetId.replace(/\D/g, "");
            this.verifyInputs(targetId)
            
        }catch (err){
            console.log(err)
            await this.badInputs(message, err);
            return;
        }

        const targetMember = guild.members.cache.get(targetId)

        const content = args.length > 2? args.join(" ").replace(`rep ${args[1]} `, "") : null
        const roles = authorMember.roles.cache
        try{
            if(!targetMember) throw new Error(`Negalite duoti reputacijos taškų šiam vartotojui <@${targetId}>`)
            if(targetMember.user.bot) throw new Error(`Negalite duoti reputacijos taškų BOT'ams`)
            await this.Parent.executeCommand(authorId, targetId, content, positive, roles)
            const embeds = this.Parent.constructResponseEmbed(authorMember, targetMember, positive, content)
            const response = await message.reply({embeds});
            setTimeout(async () => {
                await message.delete().catch(err => console.log(err))
                await response.delete().catch(err => console.log(err))
            }, 30*1000);
        }catch (err){
            console.log(err)
            await this.executionError(message, err);
        }
    }

    async checkCoolDown(authorId: string){
        const lastRecord = await reputationDb.findOne({authorId}).sort({timeStamp: -1}) as ReputationApi
        if(!lastRecord) return null;
        const timeStamp = new Date(lastRecord.timeStamp)
        const currentTime = new Date(Date.now());
        const diff = (timeStamp.getTime() + this.Parent.reputationConfig.coolDown) - currentTime.getTime()
        console.log(timeStamp.getTime(), this.Parent.reputationConfig.coolDown, currentTime.getTime())
        if(diff > 0) return diff
        else return null
    }

    async badInputs(message: discord.Message, error: unknown){
        const errorMessage = `${error}`.replace("Error: ", "**Klaida naudojant komandą:** ")

        const embed = new discord.MessageEmbed()
            .setTitle("Klaida")
            .setColor("DARK_RED")
            .setDescription(errorMessage + `\n**Teisingas naudojimas:**\n${this.usage}\n**Jūs parašėte:**\n*${(message as discord.Message).content }*`);

        const response = await message.reply({embeds: [embed]})
        setTimeout(async () => {
            await message.delete().catch(err => console.log(err));
            await response.delete().catch(err => console.log(err));
        }, 15 * 1000);
    }


    async executionError(message: discord.Message, error: unknown){
        const errorMessage = `${error}**`.replace("Error: ", "Klaida vykdant komandą: **")

        const embed = new discord.MessageEmbed()
            .setTitle("Klaida")
            .setColor("DARK_RED")
            .setDescription(`${errorMessage}`);

        const response = await message.reply({ embeds: [embed]})
        setTimeout(async () => {
            await message.delete().catch(err => console.log(err));
            await response.delete().catch(err => console.log(err));
        }, 10 * 1000);
    }

    private verifyInputs(targetId: string | undefined,){
        if(!targetId)throw new Error("Nepaminėjote vartotojo");
    }
}

export default ReputationTextCommand;