import discord from "discord.js";

interface clanApi {
    _id: string
    guildId: string
    tag: string
    name: string
    emote?: string
    ownerId: string
    members: discord.GuildMemberResolvable
    bannerURL: string
}

export default clanApi;