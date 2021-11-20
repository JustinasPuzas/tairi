"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const errorDb = (0, mongoose_1.model)("Error", new mongoose_1.Schema({
    guildId: {
        type: String,
        required: true,
        default: config_1.default.guildId,
        unique: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: false
    },
    errorMessage: {
        type: String,
        required: true,
    },
}));
exports.default = errorDb;
