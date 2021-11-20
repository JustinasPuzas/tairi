import { Schema, model } from "mongoose";
import config from "../../config";

const reputationDb = model(
  "reputation",
  new Schema({
      guildId: {
          type: String,
          required: true,
          default: config.guildId,
      },
      discordId: {
          type: String,
          required: true,
      },
      authorId: {
          type: String,
          required: true,
      },
      positive: {
          type: Boolean,
          required: true,
      },
      content: {
          type: String,
          required: false
      },
      timeStamp: {
          type: Date,
          required: true,
      }
  })
);

export default reputationDb;