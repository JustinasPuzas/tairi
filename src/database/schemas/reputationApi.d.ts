interface ReputationApi {
    _id: string,
    guildId: string,
    authorId: string,
    positive: boolean,
    content?: string,
    timeStamp: Date,
}

export default ReputationApi