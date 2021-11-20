import DiscordPage from "../../interactions/Profile/Pages/DiscordPage";

interface MessageApi {
    _id: string,
    guildId: string,
    channelId:string,
    messageId: string,
    content?: string,
    timeStamp: Date,
    attachments?: Map[],
    discordId: string,
    edits: DiscordPage.Message[],
    deleted: boolean,
    deletedTimeStamp: Date,
}