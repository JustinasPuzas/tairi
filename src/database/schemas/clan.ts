import { Schema, model } from "mongoose";
import config from "../../config";

const clanDb = model(
  "Clan",
  new Schema({
      guildId: {
          type: String,
          required: true,
          default: config.guildId,
      },
      tag: {
          type: String,
          required: true
      },
      name: {
          type: String,
          required: true
      },
      emote: {
          type: String,
          required: false
      },
      ownerId: {
          type: String,
          required: true,
      },
      members: {
          type: Array,
          required: true,
      },
      bannerURL: {
          type: String,
          required: false
      },

    })
);

export default clanDb;