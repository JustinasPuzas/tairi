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
const reputation_1 = __importDefault(require("../../../database/schemas/reputation"));
class ReputationPage {
    constructor(authorMember, targetMember, reputationData) {
        this.name = "reputationPage";
        this.positiveReputationCount = 0;
        this.negativeReputationCount = 0;
        this.reputationCount = this.positiveReputationCount - this.negativeReputationCount;
        //response data
        this.pageId = 0;
        this.page = { embeds: [], components: [] };
        this.targetMember = targetMember;
        this.authorMember = authorMember;
        this.reputationList = reputationData;
        this.loadData();
        this.updateEmbed();
    }
    getPage(navRow) {
        return __awaiter(this, void 0, void 0, function* () {
            this.loadData();
            this.updateButtons(navRow);
            this.updateEmbed();
            return this.page;
        });
    }
    buttonClickHandler(customId, navRow) {
        return __awaiter(this, void 0, void 0, function* () {
            // handle updating info on btn click
            switch (customId) {
                case "nextRepPage":
                    this.pageId++;
                    this.updateButtons(navRow);
                    this.updateEmbed();
                    return this.page;
                case "prevRepPage":
                    this.pageId--;
                    this.updateButtons(navRow);
                    this.updateEmbed();
                    return this.page;
                default:
                    return null;
            }
            // update pages buttons
        });
    }
    updateButtons(navRow) {
        this.buildActionRow();
        const btnRow = this.buttons.values();
        const row = new discord_js_1.default.MessageActionRow().addComponents([
            ...btnRow
        ]);
        this.page.components = [navRow, row];
    }
    buildActionRow() {
        const displayDownloadButton = (this.authorMember.id == this.targetMember.id) ? true : false;
        const prevPageBtn = this.pageId != 0 ? new discord_js_1.default.MessageButton()
            .setCustomId("prevRepPage")
            .setStyle("SECONDARY")
            .setLabel(" ")
            .setEmoji("◀️") : new discord_js_1.default.MessageButton()
            .setCustomId("prevRepPage")
            .setStyle("SECONDARY")
            .setDisabled(true)
            .setLabel(" ")
            .setEmoji("◀️");
        const nextPageBtn = ((this.pageId + 1) * 10) < this.reputationWithCommentsList.length ? new discord_js_1.default.MessageButton()
            .setCustomId("nextRepPage")
            .setStyle("SECONDARY")
            .setLabel(" ")
            .setEmoji("▶️") : null;
        const allReputation = displayDownloadButton ? new discord_js_1.default.MessageButton()
            .setCustomId("getAllRep")
            .setStyle("SECONDARY")
            .setLabel("All")
            .setEmoji("📃") : null;
        const buttons = [prevPageBtn, nextPageBtn].filter(btn => btn != null);
        this.buttons = buttons;
    }
    updateEmbed() {
        var _a;
        const authorAvatarUrl = this.authorMember.avatarURL() || this.authorMember.user.avatarURL() || this.authorMember.user.defaultAvatarURL;
        const avatarUrl = this.targetMember.avatarURL() || this.targetMember.user.avatarURL() || this.targetMember.user.defaultAvatarURL;
        const color = this.targetMember.displayHexColor;
        const userName = this.targetMember.nickname ? this.targetMember.nickname : this.targetMember.user.username;
        let description = `***+REP:*** **${this.positiveReputationCount}** | ***-REP:*** **${this.negativeReputationCount}**\n***Viso:*** **${this.reputationCount}**\n`;
        const embed = new discord_js_1.default.MessageEmbed()
            .setTitle(`${userName} | REPUTACIJA`)
            .setThumbnail(`${avatarUrl}`);
        //let index = 0;
        for (const rep of this.reputationWithCommentsList.slice(0 + (this.pageId * 10), 10 + (this.pageId * 10))) {
            const comment = (_a = rep.content) === null || _a === void 0 ? void 0 : _a.slice(0, 100);
            description += `\n ${rep.positive ? "<:plus:911929035838357505>" : "<:minus2:911930596530454539>"} <@${rep.authorId}>: ${comment} `;
            //index++;
            //if(index == 10) break;
        }
        embed.setDescription(description)
            .setFooter(`Page: ${this.pageId + 1}/${Math.ceil(this.reputationWithCommentsList.length / 10)}`, `${authorAvatarUrl}`)
            .setColor(color);
        this.page.embeds = [embed];
    }
    updateData() {
        return __awaiter(this, void 0, void 0, function* () {
            const discordId = this.targetMember.id;
            let positiveReputation = 0;
            let negativeReputation = 0;
            this.reputationList = yield reputation_1.default
                .find({ discordId })
                .sort({ timeStamp: -1 });
            this.reputationWithCommentsList = this.reputationList.filter((doc) => doc.content);
            console.log(this.reputationWithCommentsList);
            this.reputationList.forEach((reputation) => {
                reputation.positive ? positiveReputation++ : negativeReputation++;
            });
            this.reputationCount = positiveReputation - negativeReputation;
        });
    }
    loadData() {
        let positiveReputation = 0;
        let negativeReputation = 0;
        this.reputationWithCommentsList = this.reputationList.filter((doc) => {
            if (doc.positive) {
                positiveReputation++;
            }
            else {
                negativeReputation++;
            }
            ;
            return doc.content;
        });
        console.log(this.reputationWithCommentsList);
        this.positiveReputationCount = positiveReputation;
        this.negativeReputationCount = negativeReputation;
        this.reputationCount = positiveReputation - negativeReputation;
    }
}
exports.default = ReputationPage;
