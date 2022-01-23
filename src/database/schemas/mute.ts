import { Schema, model } from "mongoose";
import config from "../../config";

const muteDb = model(
  "Mute",
  new Schema({
     discordId: {
        type: String,
        required: true,
     },
     roleId: {
         type: String,
         required: true,

     },
     mutedOn: {
         type: Date,
         required: true,
     },
     unMuteOn: {
         type: Date,
         required: true,
     },
     duration: {
         type: Number,
         required: true,

     },
     authorId: {
         type: String,
         required: true,
     },
     revoked: {
         type: Boolean,
         required: true,
         default: false
     }
    })
);

export default muteDb;