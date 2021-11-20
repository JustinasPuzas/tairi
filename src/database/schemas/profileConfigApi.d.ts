interface ProfileConfigApi {
    _id: string,
    guildId: string,
    defaultActiveTime: number // in milliseconds

    maxActiveTime: number // in milliseconds
    userCoolDown: number // in milliseconds
    whiteListedChannels: string[], // only user coolDown
    blackListedChannels: string[], // not allowed to use
}