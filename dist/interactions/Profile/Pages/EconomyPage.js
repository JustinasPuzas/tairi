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
class EconomyPage {
    constructor(authorMember, targetMember, memberData) {
        this.page = { embeds: [], components: [] };
        this.targetMember = targetMember;
        this.authorMember = authorMember;
        this.memberData = memberData;
    }
    getPage(navRow, selectMenu) {
        this.selectMenu = selectMenu;
        this.updateButtons(navRow);
        this.updateEmbed();
        return this.page;
    }
    updateButtons(navRow) {
        //this.buildActionRow();
        //const btnRow = this.buttons.values()
        const row = new discord_js_1.default.MessageActionRow().addComponents([this.selectMenu]);
        this.page.components = [navRow, row];
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
        const targetUserName = this.targetMember.user.username + "#" + this.targetMember.user.discriminator;
        const targetAvatarUrl = this.targetMember.user.avatarURL() || this.authorMember.user.defaultAvatarURL;
        const targetBannerUrl = this.targetMember.user.bannerURL({ size: 512, dynamic: true }) || this.targetMember.guild.bannerURL({ size: 512 }) || this.targetMember.guild.iconURL({ size: 128 });
        const authorNickName = this.authorMember.nickname ? this.authorMember.nickname : this.authorMember.user.username;
        const authorAvatarUrl = this.authorMember.avatarURL() || this.authorMember.user.avatarURL() || this.authorMember.user.defaultAvatarURL;
        const { money, gold, xp } = this.memberData.sql;
        const color = this.targetMember.displayHexColor;
        const embed = new discord_js_1.default.MessageEmbed()
            .setTitle(`${targetUserName} Discord Info`)
            .setThumbnail(`${targetAvatarUrl}`)
            .setFields([
            { name: "Auksas", value: `<:auksas:889548108160172062> **${gold}**`, inline: true },
            { name: "Pinigai", value: `💶 **${money}**`, inline: true },
            { name: "XP", value: `🌟 **${xp}**`, inline: true }
            //{name: `Id: `, value: `**${this.targetMember.id}**`, inline: true},
            //{name: `Žinutės:`, value: `📨 **${this.messageCount}**`, inline: true},
        ])
            .setFooter(`${authorNickName}`, `${authorAvatarUrl}`)
            .setImage(`${targetBannerUrl}`)
            .setColor(color);
        this.page.embeds = [embed];
    }
    loadData() {
    }
    updateData() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = EconomyPage;
