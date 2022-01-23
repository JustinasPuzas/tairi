import { Schema, model } from "mongoose";
import config from "../../config";

const messageDb = model(
  "Message",
  new Schema({
    messageId: {
        type: String,
        required: true,
        unique: true,
    },
      guildId: {
          type: String,
          required: true,
          default: config.guildId,
      },
      channelId: {
          type: String,
          required: true,
      },
      content: {
          type: String,
          required: false
      },
      timeStamp: {
          type: Date,
          required: true,
      },
      attachments: {
          type: Map,
          required: false
      },
      discordId: {
          type: String,
          required: true,
      },
      edits: {
          type: Array,
          required: true,
          default: []
      },
      deleted: {
          type: Boolean,
          required: true,
          default: false
      },
      deletedTimeStamp: {
          type: Date,
          required: false,
      }
  })
);

export default messageDb;