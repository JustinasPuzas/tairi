"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const reputationDb = (0, mongoose_1.model)("reputation", new mongoose_1.Schema({
    guildId: {
        type: String,
        required: true,
        default: config_1.default.guildId,
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
}));
exports.default = reputationDb;
