"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const profileConfigDb = (0, mongoose_1.model)("ProfileConfig", new mongoose_1.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
        default: config_1.default.guildId,
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
}));
exports.default = profileConfigDb;
