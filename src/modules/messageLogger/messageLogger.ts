import messageDb from "../../database/schemas/message";
import discord from "discord.js";

class MessageLogger {
  async logMessage(message: discord.Message) {
    const guildId = message.guild?.id as string;
    const channelId = message.channelId;
    const content = message.content;
    const timeStamp = new Date(Date.now());
    let attachments = message.attachments;
    const discordId = message.author.id;
    const messageId = message.id;
    await messageDb.create({
      guildId,
      channelId,
      messageId,
      content,
      timeStamp,
      attachments,
      discordId,
    });
  }

  async deleteMessage(message: discord.Message | discord.PartialMessage) {
    const messageId = message.id;
    await messageDb.findOneAndUpdate(
      { messageId },
      { deleted: true, deletedTimeStamp: new Date(Date.now()) }
    );
  }

  async updateMessage(
    oldMessage: discord.Message,
    newMessage: discord.Message
  ) {
    const messageId = oldMessage.id;
    await messageDb.findOneAndUpdate(
      { messageId },
      { $push: { edits: { ...newMessage } } }
    );
  }
}

export default MessageLogger;