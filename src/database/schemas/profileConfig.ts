import { Schema, model } from "mongoose";
import config from "../../config";

const profileConfigDb = model(
  "ProfileConfig",
  new Schema({
    guildId:{
        type: String,
        required: true,
        unique: true,
        default: config.guildId,
    },
    defaultActiveTime: {
      type: Number,
      required: true,
      default: 30 * 1000,
    },
    maxActiveTime: {
      type: Number,
      required: true,
      default: 2 * 60 * 1000
    },
    userCoolDown: {
      type: Number,
      required: true,
      default: 15 * 1000
    },
    whiteListedChannels: {
      type: String,
      required: true,
      default: []
    },
    blackListedChannels: {
      type: String,
      required: true,
      default: []
    }
  })
);

export default profileConfigDb;