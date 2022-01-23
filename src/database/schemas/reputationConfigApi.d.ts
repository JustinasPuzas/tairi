interface reputationConfigApi {
    _id: string,
    guildId: string,
    color: string,
    coolDown: number,
    blackListed: string[],
}

export default reputationConfigApi