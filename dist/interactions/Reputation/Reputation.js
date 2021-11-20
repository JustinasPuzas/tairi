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
const discord_js_1 = __importDefault(require("discord.js"));
const config_1 = __importDefault(require("../../config"));
const reputation_1 = __importDefault(require("../../database/schemas/reputation"));
const reputationConfig_1 = __importDefault(require("../../database/schemas/reputationConfig"));
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const InteractionCommand_1 = __importDefault(require("./InteractionCommand"));
const TextCommand_1 = __importDefault(require("./TextCommand"));
class Reputation {
    constructor() {
        this.ready = false;
        this.interactionCommand = new InteractionCommand_1.default(this);
        this.textCommand = new TextCommand_1.default(this);
        this.loadData();
    }
    constructResponseEmbed(authorMember, targetMember, positive, content) {
        const reputationType = positive ? "+" : "-";
        const authorName = authorMember.nickname ? authorMember.nickname : authorMember.user.username;
        const authorAvatarUrl = authorMember.avatarURL() || authorMember.user.avatarURL() || authorMember.user.defaultAvatarURL;
        const targetName = targetMember.nickname ? targetMember.nickname : targetMember.user.username;
        const targetAvatarUrl = targetMember.avatarURL() || targetMember.user.avatarURL() || targetMember.user.defaultAvatarURL;
        const description = content ? `${authorMember}: ${content}` : ``;
        const color = this.reputationConfig.color == "custom" ? authorMember.displayHexColor : this.reputationConfig.color;
        const colorFromType = positive ? "GREEN" : "RED";
        const thumbNail = positive ? "https://cdn.discordapp.com/attachments/902273635560063019/911291922331623464/plusRep.png" : "https://cdn.discordapp.com/attachments/902273635560063019/911291922096717824/minusRep.png";
        const embed1 = new discord_js_1.default.MessageEmbed()
            .setThumbnail(thumbNail)
            .setAuthor(`${targetName}`, `${targetAvatarUrl}`)
            .setDescription(`${description}`) //${targetMember} Gavo ${reputationType}Reputacijos nuo ${authorMember}\n
            .setColor(colorFromType)
            .setFooter(authorName, `${authorAvatarUrl}`);
        return [embed1];
    }
    replyError(interaction, error) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.reply({ content: `${error}`, ephemeral: true });
        });
    }
    executeCommand(authorId, targetId, content, positive, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            // is member a Bot? O.o
            yield this.isBlackListed(roles); // add to take in member role array
            // is member in guild ?
            // limit content up to 250 char ???
            yield this.isSelf(authorId, targetId);
            yield this.checkCoolDown(authorId);
            yield this.giveReputation(authorId, targetId, content, positive);
        });
    }
    isSelf(authorId, discordId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!discordId)
                throw new Error("Negalite duodi reputacijos taškų šiam vartotojui");
            if (discordId == authorId)
                throw new Error("Negalite duoti reputacijos sau");
        });
    }
    isBlackListed(roles) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const blackListedRole of this.reputationConfig.blackListed) {
                if (roles.has(blackListedRole))
                    throw new Error("Negalite duoti teigiamų ar neigiamų reputacijos taškų kitiems :/");
            }
        });
    }
    checkCoolDown(authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastRecord = yield reputation_1.default.findOne({ authorId }).sort({ timeStamp: -1 });
            if (!lastRecord)
                return;
            const timeStamp = new Date(lastRecord.timeStamp);
            const currentTime = new Date(Date.now());
            yield this.loadData();
            const diff = (timeStamp.getTime() + this.reputationConfig.coolDown) - currentTime.getTime();
            if (diff > 0)
                throw new Error(`Galesite duoti reputacija uz ${(0, pretty_ms_1.default)(diff, { compact: true })}`);
        });
    }
    giveReputation(authorId, discordId, content, positive) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(authorId, discordId, positive, content);
            yield reputation_1.default.create({ authorId, discordId, positive, content, timeStamp: Date.now() });
        });
    }
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            this.reputationConfig = yield reputationConfig_1.default.findOne({ guildId: config_1.default.guildId });
            this.ready = true;
        });
    }
}
exports.default = Reputation;
