"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const clanDb = (0, mongoose_1.model)("Clan", new mongoose_1.Schema({
    guildId: {
        type: String,
        required: true,
        default: config_1.default.guildId,
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
}));
exports.default = clanDb;
