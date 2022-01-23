interface RulesConfig {
    _id: string,
    guildId: string,
    channelId: string,
    messages: string[],
    webhookId: string,
}

export default RulesConfig;