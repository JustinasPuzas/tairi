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
class ReputationTopPage {
    constructor(authorMember, list) {
        this.pageId = 0;
        this.page = { embeds: [], components: [] };
        this.authorPageId = 0;
        this.authorMember = authorMember;
        this.list = list;
    }
    getPage(navRow
    // selectMenu: discord.MessageSelectMenu
    ) {
        // this.selectMenu = selectMenu;
        this.buttonClickHandler("initial", navRow);
        return this.page;
    }
    buttonClickHandler(customId, navRow) {
        return __awaiter(this, void 0, void 0, function* () {
            // handle updating info on btn click
            switch (customId) {
                case "nextRepPage":
                    this.pageId++;
                    this.updateNavRow(navRow);
                    this.updateButtons(navRow);
                    this.updateEmbed();
                    return this.page;
                case "prevRepPage":
                    this.pageId--;
                    this.updateNavRow(navRow);
                    this.updateButtons(navRow);
                    this.updateEmbed();
                    return this.page;
                case "findMeRepPage":
                    this.findAuthorId();
                    this.pageId = this.authorPageId;
                    this.updateNavRow(navRow);
                    this.updateButtons(navRow);
                    this.updateEmbed();
                    return this.page;
                case "reputationPage":
                    console.log(`Minus rep top UwU`);
                    this.updateButtons(navRow);
                    this.updateEmbed();
                    return this.page;
                case "initial":
                    this.updateNavRow(navRow);
                    this.updateButtons(navRow);
                    this.updateEmbed();
                    return this.page;
                default:
                    return null;
            }
            // update pages buttons
        });
    }
    updateNavRow(navRow) {
        const messageButton = navRow.components[0];
        const updatedMessageButton = this.pageId == 0
            ? messageButton.setLabel(`Reputacijos TOP ${(this.pageId + 1) * 10}`)
            : messageButton.setLabel(`Reputacijos TOP ${this.pageId * 10}-${(this.pageId + 1) * 10}`);
        return (navRow.components[0] = updatedMessageButton);
    }
    updateButtons(navRow) {
        //navRow: discord.MessageActionRow
        const nextPage = new discord_js_1.default.MessageButton()
            .setCustomId("nextRepPage")
            .setStyle("SECONDARY")
            .setLabel(" ")
            .setEmoji("<:rightact:927166908816556032>");
        const prevPage = new discord_js_1.default.MessageButton()
            .setCustomId("prevRepPage")
            .setStyle("SECONDARY")
            .setLabel(" ")
            .setEmoji("<:leftact:927166928550772756>");
        const findMePage = new discord_js_1.default.MessageButton()
            .setCustomId("findMeRepPage")
            .setStyle("SECONDARY")
            .setLabel(" ")
            .setEmoji("<:findme:927323872095768596>");
        if (this.pageId == 0)
            prevPage.setDisabled(true).setEmoji("<:leftinc:927166954249285662>");
        if ((this.pageId + 1) * 10 >= this.list.length)
            nextPage.setDisabled(true).setEmoji("<:rightinc:927166976361660448>");
        const row = new discord_js_1.default.MessageActionRow().addComponents([
            prevPage,
            nextPage,
            findMePage,
        ]);
        this.page.components = [navRow, row];
    }
    findAuthorId() {
        this.list.forEach((item, index) => {
            console.log(item);
            console.log(index);
            if ((item === null || item === void 0 ? void 0 : item._id) == this.authorMember.id) {
                this.pageId = index;
            }
        });
    }
    updateEmbed() {
        const authorNickName = this.authorMember.nickname || this.authorMember.user.username;
        const authorAvatarUrl = this.authorMember.avatarURL() ||
            this.authorMember.user.avatarURL() ||
            this.authorMember.user.defaultAvatarURL;
        let authorPlace = 0;
        let description = "";
        let index = 10 * this.pageId;
        let place = 1 + (10 * this.pageId);
        for (; index < 10 * (this.pageId + 1); index++) {
            if (this.list[index]._id == this.authorMember.id)
                authorPlace = index;
            let name = `${this.list[index]._id == this.authorMember.id ? "**" : ""} ${place}. <@${this.list[index]._id}>`;
            let score = `${this.list[index].total} ${this.list[index].total >= 0
                ? "<:plus:911929035838357505>"
                : "<:minus:911929648311574538>"}${this.list[index]._id == this.authorMember.id ? "**" : ""}\n`;
            description += name + score;
            place++;
            if (index == this.list.length - 1)
                break;
        }
        const embed = new discord_js_1.default.MessageEmbed()
            .setTitle(`🏆 Reputacijos Top 10`)
            .setFooter(`${authorNickName}`, `${authorAvatarUrl}`)
            .setDescription(description)
            .setColor("YELLOW");
        this.page.embeds = [embed];
    }
    loadData() { }
    updateData() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = ReputationTopPage;
