const config = {
    mute:{
        uzmusti:{
            images: ["https://c.tenor.com/6c5L7dzkvfsAAAAd/fight-me.gif", "https://cdn.discordapp.com/attachments/903249149615538179/918952086090182686/ezgif.com-gif-maker.gif"],
            text: ["{authorId} užmušė {targetId}","{authorId} nužudė {targetId}"]
        }
    },
    botCommandChannel: ["903249149615538179", "889528960029954049"],
    muteRoleId: "916865448589549600",
    guildId: "902273635560063016",
    emojiGuildId: "902273635560063016",
    clientId: "902275830078644224",
    dataBase: {
        link: "localhost/loungeTest",
        username: undefined,
        authSource: undefined,
        options: {},
    },
    prefix: "+",
    globalCoolDown: 3 * 1000, // in miliseconds
}
export default config;