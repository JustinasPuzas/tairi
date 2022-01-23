import discord from 'discord.js';

interface PageApi {
    readonly name: string
    private targetMember: discord.GuildMember;
    private authorMember: discord.GuildMember;



    getPage(navRow: discord.MessageActionRow): discord.discord.MessageOptions;
    public loadData():void
    async updateData():Promise<Void>
}

export default PageApi;