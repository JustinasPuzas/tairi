"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const messageDb = (0, mongoose_1.model)("Message", new mongoose_1.Schema({
    messageId: {
        type: String,
        required: true,
        unique: true,
    },
    guildId: {
        type: String,
        required: true,
        default: config_1.default.guildId,
    },
    channelId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: false
    },
    timeStamp: {
        type: Date,
        required: true,
    },
    attachments: {
        type: Map,
        required: false
    },
    discordId: {
        type: String,
        required: true,
    },
    edits: {
        type: Array,
        required: true,
        default: []
    },
    deleted: {
        type: Boolean,
        required: true,
        default: false
    },
    deletedTimeStamp: {
        type: Date,
        required: false,
    }
}));
exports.default = messageDb;
