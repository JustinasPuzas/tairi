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
const config_1 = __importDefault(require("../../config"));
class ProfileTextCommand {
    constructor(mainClass) {
        this.name = ['profile'];
        this.description = "Patikrink Profili";
        this.usage = `+profile @UserName`;
        this.Parent = mainClass;
    }
    isThisCommand(commandName) {
        return this.name.includes(commandName);
    }
    runCommand(args, message, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const guild = client.guilds.cache.get(config_1.default.guildId);
            const authorId = message.author.id;
            const authorMember = guild.members.cache.get(authorId);
            const targetMember = (_a = message.mentions.members) === null || _a === void 0 ? void 0 : _a.first();
            if (targetMember) {
                yield this.Parent.executeCommand(authorMember, targetMember, message, client);
            }
            else {
                yield this.Parent.executeCommand(authorMember, authorMember, message, client);
            }
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield message.delete().catch(err => console.log(err));
            }), 2 * 60 * 1000);
        });
    }
}
exports.default = ProfileTextCommand;
