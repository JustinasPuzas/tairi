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
class DiscordPage {
    constructor(authorMember, targetMember) {
        this.page = { embeds: [], components: [] };
        this.targetMember = targetMember;
        this.authorMember = authorMember;
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
    updateEmbed() {
        const targetUserName = this.targetMember.user.username + "#" + this.targetMember.user.discriminator;
        const targetAvatarUrl = this.targetMember.user.avatarURL() || this.authorMember.user.defaultAvatarURL;
        const targetBannerUrl = this.targetMember.user.bannerURL({ size: 512, dynamic: true }) || this.targetMember.guild.bannerURL({ size: 512 }) || this.targetMember.guild.iconURL({ size: 128 });
        const authorNickName = this.authorMember.nickname ? this.authorMember.nickname : this.authorMember.user.username;
        const authorAvatarUrl = this.authorMember.avatarURL() || this.authorMember.user.avatarURL() || this.authorMember.user.defaultAvatarURL;
        const accountAge = this.targetMember.user.createdAt;
        const color = this.targetMember.displayHexColor;
        const embed = new discord_js_1.default.MessageEmbed()
            .setTitle(`${targetUserName} | Discord Info`)
            .setThumbnail(`${targetAvatarUrl}`)
            .setFields([
            { name: `Paskyros amžius:`, value: `📆 **${(0, pretty_ms_1.default)(Math.floor((Date.now() - accountAge.getTime()) / (60 * 60 * 1000)) * 60 * 60 * 1000)}**`, inline: true },
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
exports.default = DiscordPage;
