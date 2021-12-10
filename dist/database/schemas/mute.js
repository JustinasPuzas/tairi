"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const muteDb = (0, mongoose_1.model)("Mute", new mongoose_1.Schema({
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
}));
exports.default = muteDb;
