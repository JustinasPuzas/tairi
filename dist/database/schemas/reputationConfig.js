"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const reputationConfigDb = (0, mongoose_1.model)("ReputationConfig", new mongoose_1.Schema({
    guildId: {
        type: String,
        required: true,
        default: config_1.default.guildId,
        unique: true,
    },
    color: {
        type: String,
        required: true,
        default: "CUSTOM"
    },
    coolDown: {
        type: Number,
        required: true,
        default: 24 * 60 * 60 * 1000, // 24h hours
    },
    blackListed: {
        type: Array,
        required: true,
        default: []
    }
}));
exports.default = reputationConfigDb;
