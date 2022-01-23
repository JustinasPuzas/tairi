import { Schema, model } from "mongoose";
import config from "../../config";

const reputationConfigDb = model(
  "ReputationConfig",
  new Schema({
      guildId: {
          type: String,
          required: true,
          default: config.guildId,
          unique: true,
      },
      color: {
          type: String,
          required: true,
          default: "CUSTOM"
      },
      coolDown: {
          type: Number,
          required:true,
          default: 24 * 60 * 60 * 1000, // 24h hours
      },
      blackListed: {
          type: Array,
          required: true,
          default: []
      }
  })
);

export default reputationConfigDb;