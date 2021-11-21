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
const pretty_ms_1 = __importDefault(require("pretty-ms"));
class HomePage {
    constructor(authorMember, targetMember, navActionRow, memberData, reputationData, messageCount) {
        this.name = "reputationPage";
        this.page = { embeds: [], components: [] };
        this.targetMember = targetMember;
        this.authorMember = authorMember;
        this.navActionRow = navActionRow;
        this.memberData = memberData;
        this.reputationData = reputationData;
        this.messageCount = messageCount;
    }
    getPage() {
        this.updateButtons();
        this.updateEmbed();
        return this.page;
    }
    updateButtons() {
        //this.buildActionRow();
        //const btnRow = this.buttons.values()
        // const row = new discord.MessageActionRow().addComponents([
        //   ...btnRow
        // ]);
        this.page.components = [this.navActionRow];
    }
    buttonClickHandler(customId) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (customId) {
                case "plusRep":
                    return this.page;
                case "minusRep":
                    return this.page;
                default:
                    return null;
            }
        });
    }
    updateEmbed() {
        const targetNickName = this.targetMember.nickname ? this.targetMember.nickname : this.targetMember.user.username;
        const targetAvatarUrl = this.targetMember.avatarURL() || this.targetMember.user.avatarURL() || this.targetMember.user.defaultAvatarURL;
        const targetBannerUrl = this.targetMember.user.bannerURL({ size: 512, dynamic: true }) || this.targetMember.guild.bannerURL({ size: 512 }) || this.targetMember.guild.iconURL({ size: 128 });
        const targetPremiumSince = this.targetMember.premiumSince ? (0, pretty_ms_1.default)(Date.now() - this.targetMember.premiumSince.getTime(), { compact: true }) : null;
        const authorNickName = this.authorMember.nickname ? this.authorMember.nickname : this.authorMember.user.username;
        const authorAvatarUrl = this.authorMember.avatarURL() || this.authorMember.user.avatarURL() || this.authorMember.user.defaultAvatarURL;
        const targetFirstTimeJoined = this.memberData.firstTimeJoined;
        const reputationCount = this.reputationData.reputationCount;
        const reputationEmote = reputationCount >= 0 ? "<:plusIcon:911780569694740510>" : "<:minusIcon:911780550983970836>";
        const color = this.targetMember.displayHexColor;
        const embed = new discord_js_1.default.MessageEmbed()
            .setTitle(`${targetNickName} Profilis`)
            .setThumbnail(`${targetAvatarUrl}`)
            .setFields([
            { name: `Narys jau`, value: `📆 **${(0, pretty_ms_1.default)(Date.now() - targetFirstTimeJoined.getTime(), { compact: true })}**`, inline: true },
            { name: `Reputacija`, value: `${reputationEmote} **${reputationCount}**`, inline: true },
            { name: `Žinutės`, value: `📨 **${this.messageCount}**`, inline: true },
        ])
            .setFooter(`${authorNickName}`, `${authorAvatarUrl}`)
            .setImage(`${targetBannerUrl}`)
            .setColor(color);
        if (targetPremiumSince)
            embed.addField(`Premium`, `<a:nitro:911619302107525130> **${targetPremiumSince}**`);
        this.page.embeds = [embed];
    }
    loadData() {
    }
    updateData() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = HomePage;
