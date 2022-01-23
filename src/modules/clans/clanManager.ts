import discord from "discord.js";
import Client from "../../Client";
import clan from "./clan";

class ClanManager {
    client: Client;
    mainChannelId: string
    mainTextChannel: discord.TextChannel
    clans: Map<string, clan> = new Map()

    constructor(){

    }


    loadData(){
        this.main
    }


}

export default clan;