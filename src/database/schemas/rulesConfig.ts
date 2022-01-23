import { Schema, model } from "mongoose";
import config from "../../config";

const rulesDb = model(
  "RulesConfig",
  new Schema({
      guildId: {
          type: String,
          required: true,
          default: config.guildId,
          unique: true,
      },
      channelId: {
          type: String,
          required: false,
      },
      messages: {
          type: Array,
          required: true,
          default: [],
      },
      webhookId: {
          type: String,
          required: false,
      },
  })
);

export default rulesDb;