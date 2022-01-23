import discord from "discord.js";
import Client from "../../Client";
import config from "../../config";
import reputationDb from "../../database/schemas/reputation";
import ReputationApi from "../../database/schemas/reputationApi";
import TextCommandApi from "../command";
import Top from "./Top";
import milToHR from 'pretty-ms';

class TopTextCommand implements TextCommandApi {
    name = ['top']
    description = "Top sąrašai"

    private Parent: Top;

    constructor(mainClass: Top){
        this.Parent = mainClass;
    }

    isThisCommand(commandName: string){
        return this.name.includes(commandName)
    }

    async runCommand(args: string[], message: discord.Message, client: Client ){
        const authorId = message.author.id;

        await this.Parent.executeCommand(authorId, "reputation", message, client);
        setTimeout( async () => {
            if(!message.deleted) await message.delete();
        }, 2*60*1000)
    }

    async badInputs(message: discord.Message, error: unknown){
        const errorMessage = `${error}`.replace("Error: ", "**Klaida naudojant komandą:** ")

        const embed = new discord.MessageEmbed()
            .setTitle("Klaida")
            .setColor("DARK_RED")
            .setDescription(errorMessage + `\n**Teisingas naudojimas:**\n\n**Jūs parašėte:**\n*${(message as discord.Message).content }*`);

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

export default TopTextCommand;