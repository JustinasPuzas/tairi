import { Schema, model } from "mongoose";
import config from "../../config";

const errorDb = model(
  "Error",
  new Schema({
      guildId: {
          type: String,
          required: true,
          default: config.guildId,
          unique: true,
      },
      channelId: {
          type: String,
          required: true,
      },
      author: {
          type: String,
          required: false
      },
      errorMessage: {
          type: String,
          required: true,
      },
    })
);

export default errorDb;