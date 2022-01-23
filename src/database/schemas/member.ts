import { Schema, model } from "mongoose";
import config from "../../config";

const memberDb = model(
  "Member",
  new Schema({
    guildId: {
      type: String,
      required: true,
      default: config.guildId,
    },
    discordId: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    roles: {
      type: Array,
      required: true,
      default: [],
    },
    firstTimeJoined: {
      type: Date,
      required: true,
    },
  })
);

export default memberDb;
