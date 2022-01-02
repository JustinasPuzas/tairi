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
class TopInteraction {
    constructor(mainClass) {
        this.name = "top";
        this.Parent = mainClass;
    }
    runCommand(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const guild = client.guilds.cache.get(config_1.default.guildId);
            const authorId = interaction.user.id;
            const authorMember = guild.members.cache.get(authorId);
            const subCommand = interaction.options.getSubcommand() ? interaction.options.getSubcommand() : "reputation";
            yield this.Parent.executeCommand(authorId, subCommand, interaction, client);
        });
    }
}
exports.default = TopInteraction;
