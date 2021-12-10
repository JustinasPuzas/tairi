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
class Uzmusti {
    constructor() {
        this.name = ["uzmusti", "užmušti", "uzmušti", "užmusti"];
        this.maintenance = false;
        this.description = "`+užmušti` for owner";
        this._ready = true;
    }
    isThisCommand(commandName) {
        return this.name.includes(commandName);
    }
    hasPerms(member) {
        const guild = member.guild;
        return guild.ownerId === member.user.id;
    }
    isReady() {
        return this._ready;
    }
    getImage() {
        return config_1.default.mute.uzmusti.images[Math.floor(Math.random() * config_1.default.mute.uzmusti.images.length)];
    }
    getDescription(authorId, targetId) {
        const text = config_1.default.mute.uzmusti.text[Math.floor(Math.random() * config_1.default.mute.uzmusti.text.length)];
        return text
            .replace("{targetId}", `<@${targetId}>`)
            .replace("{authorId}", `<@${authorId}>`);
    }
    runCommand(args, message, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const guildId = config_1.default.guildId;
            const memberId = message.author.id;
            if (!this.hasPerms(message.member))
                return;
            const moderation = client.moderation;
            const targetMember = (_a = message.mentions.members) === null || _a === void 0 ? void 0 : _a.first();
            let embed = this.buildCoreMessage(message.member, client);
            if (!targetMember)
                return console.log(`No mentions`);
            try {
                yield moderation.muteMember(targetMember, message.member, 2 * 60 * 60 * 15 * 1000 // 2 * 60 * 60
                );
                embed = this.buildSuccessMessage(embed, memberId, targetMember.id);
            }
            catch (err) {
                embed = this.buildErrorMessage(embed, err);
                console.log(err);
            }
            yield message.reply({ embeds: [embed] });
        });
    }
    buildCoreMessage(author, client) {
        const avatarURL = author.avatarURL() ||
            author.user.avatarURL() ||
            author.user.defaultAvatarURL;
        const embed = new discord_js_1.default.MessageEmbed().setAuthor("Žudyti narį", avatarURL);
        return embed;
    }
    buildErrorMessage(embed, error) {
        const descriptionText = `${error}`.replace("Error: ", "");
        return embed.setTitle("Klaida").setDescription(descriptionText).setColor("DARK_RED");
    }
    buildSuccessMessage(embed, authorId, targetId) {
        const image = this.getImage();
        const description = this.getDescription(authorId, targetId);
        embed.setDescription(description).setImage(image);
        return embed;
    }
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
}
exports.default = Uzmusti;
