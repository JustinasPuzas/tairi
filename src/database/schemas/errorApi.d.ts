interface ErrorApi {
    guildId: string,
    channelId: string,
    author: string,
    content?: string,
    path: string,
    errorMessage: string,
    timeStamp: Date
}

export default ErrorApi;