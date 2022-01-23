interface MuteApi {
    _id: string
    discordId: string;
    roleId: string;
    mutedOn: Date;
    unMuteOn: Date;
    duration: number;
    authorId: string;
    revoked: boolean;
}

export default MuteApi;