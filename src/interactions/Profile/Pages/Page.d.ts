import discord from 'discord.js';

interface PageApi {
    readonly name: string
    private targetMember: discord.GuildMember;
    private authorMember: discord.GuildMember;



    getPage(): discord.discord.MessageOptions;
    async buttonClickHandler(customId: string,):Promise<Void>
    public loadData():void
    async updateData():Promise<Void>
}

export default PageApi;