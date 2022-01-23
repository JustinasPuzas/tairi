"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_1 = __importDefault(require("../../database/schemas/message"));
class MessageLogger {
    logMessage(message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const guildId = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id;
            const channelId = message.channelId;
            const content = message.content;
            const timeStamp = new Date(Date.now());
            let attachments = message.attachments;
            const discordId = message.author.id;
            const messageId = message.id;
            yield message_1.default.create({
                guildId,
                channelId,
                messageId,
                content,
                timeStamp,
                attachments,
                discordId,
            });
        });
    }
    deleteMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageId = message.id;
            yield message_1.default.findOneAndUpdate({ messageId }, { deleted: true, deletedTimeStamp: new Date(Date.now()) });
        });
    }
    updateMessage(oldMessage, newMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageId = oldMessage.id;
            yield message_1.default.findOneAndUpdate({ messageId }, { $push: { edits: Object.assign({}, newMessage) } });
        });
    }
}
exports.default = MessageLogger;
