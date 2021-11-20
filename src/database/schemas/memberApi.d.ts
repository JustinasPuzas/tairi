interface MemberApi {
    _id: string,
    guildId: string,
    discordId: string,
    description: string,
    roles: string[],
    firstTimeJoined: Date
}

export default MemberApi;