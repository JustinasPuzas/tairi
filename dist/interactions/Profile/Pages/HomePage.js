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
const DiscordPage_1 = __importDefault(require("./DiscordPage"));
const EconomyPage_1 = __importDefault(require("./EconomyPage"));
class HomePage {
    constructor(authorMember, targetMember, memberData, reputationData, messageCount) {
        this.name = "reputationPage";
        this.page = { embeds: [], components: [] };
        this.pageId = "profile";
        this.placeHolderMap = {
            "profile": "Lounge Profilis",
            "bank": "Lounge Ekonomika",
            "discord": "Discord Profilis",
        };
        this.targetMember = targetMember;
        this.authorMember = authorMember;
        this.memberData = memberData;
        this.reputationData = reputationData;
        this.messageCount = messageCount;
        this.discordPage = new DiscordPage_1.default(this.authorMember, this.targetMember);
        this.economyPage = new EconomyPage_1.default(this.authorMember, this.targetMember, memberData);
    }
    getPage(navRow) {
        this.updateButtons(navRow);
        this.updateEmbed();
        switch (this.pageId) {
            case "profile":
                return this.page;
            case "discord":
                return this.discordPage.getPage(navRow, this.selectMenu);
            case "bank":
                return this.discordPage.getPage(navRow, this.selectMenu);
            default:
                return this.page;
        }
    }
    updateButtons(navRow) {
        this.buildActionRow();
        const row = new discord_js_1.default.MessageActionRow().addComponents([this.selectMenu]);
        this.page.components = [navRow, row];
    }
    buildActionRow() {
        let options = [
            {
                label: 'Lounge Profilis',
                description: 'Lounge Profilio informacija',
                value: 'profile',
            },
            this.memberData.sql ?
                {
                    label: 'Lounge Ekonomika',
                    description: 'Lounge Ekonomikos informacija',
                    value: 'bank',
                } : null,
            {
                label: 'Discord Profilis',
                description: 'Discord Profilio informacija',
                value: 'discord',
            },
        ];
        function notEmpty(value) {
            return value !== null && value !== undefined;
        }
        this.selectMenu = new discord_js_1.default.MessageSelectMenu()
            .setCustomId('profileSelectMenu')
            .setMaxValues(1)
            .setPlaceholder(`${this.placeHolderMap[`${this.pageId}`]}`)
            .addOptions(options.filter(notEmpty));
    }
    buttonClickHandler(interaction, navRow) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = interaction.values[0];
            return this.servePage(value, navRow);
        });
    }
    servePage(value, navRow) {
        switch (value) {
            case "profile":
                this.pageId = "profile";
                navRow.components[0].setLabel("Profilis");
                return this.getPage(navRow);
            case "discord":
                this.pageId = "discord";
                //this.selectMenu.setPlaceholder("Discord");
                navRow.components[0].setLabel("Discord");
                this.updateButtons(navRow);
                return this.discordPage.getPage(navRow, this.selectMenu);
            case "bank":
                this.pageId = "bank";
                navRow.components[0].setLabel("Ekonomika");
                this.updateButtons(navRow);
                return this.economyPage.getPage(navRow, this.selectMenu);
            default:
                return null;
        }
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
            .setTitle(`${targetNickName} | Profilis`)
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
