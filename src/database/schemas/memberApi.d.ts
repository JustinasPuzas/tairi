interface MemberApi {
    _id: string,
    guildId: string,
    discordId: string,
    description: string,
    roles: string[],
    firstTimeJoined: Date
    sql: MemberSqlApi | null
}

export interface MemberSqlApi {
    guild: string,
    uid: string,
    xp: number,
    money: number,
    gold: number,
    stats: string,
}

export default MemberApi;