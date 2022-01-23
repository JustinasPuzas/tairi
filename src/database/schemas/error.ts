import { Schema, model } from "mongoose";
import config from "../../config";

const errorDb = model(
  "Error",
  new Schema({
      guildId: {
          type: String,
          required: true,
          default: config.guildId,
      },
      channelId: {
          type: String,
          required: true,
      },
      author: {
          type: String,
          required: false
      },
      content: {
          type: String,
          required: false
      },
      path: {
          type: String,
          required: true,
      },
      errorMessage: {
          type: String,
          required: true,
      },
      timeStamp: {
          type: Date,
          required: true,
      }
    })
);

export default errorDb;