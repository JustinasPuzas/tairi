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
const pretty_ms_1 = __importDefault(require("pretty-ms"));
const InteractionCommand_1 = __importDefault(require("./InteractionCommand"));
const TextCommand_1 = __importDefault(require("./TextCommand"));
const Messages_1 = __importDefault(require("./Pages/Messages"));
const Reputation_1 = __importDefault(require("./Pages/Reputation"));
const message_1 = __importDefault(require("../../database/schemas/message"));
class Top {
    constructor() {
        this.ready = false;
        this.interactionCommand = new InteractionCommand_1.default(this);
        this.textCommand = new TextCommand_1.default(this);
        this.openDisplayIn = new Map();
        this.pageId = "reputationPage";
    }
    replyError(interaction, error) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.reply({ content: `${error}`, ephemeral: true });
        });
    }
    executeCommand(authorId, subCommand, interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            // load correct page
            const authorMember = client.Guild.members.cache.get(authorId);
            if (yield this.checkCoolDown(authorMember.id, interaction.channelId, interaction)) {
                console.log(`On Cd`);
                return;
            }
            this.createCoolDown(authorMember.id, interaction.channelId);
            this.createNavRow();
            const positiveRep = yield reputation_1.default.aggregate([
                {
                    $group: {
                        _id: "$discordId",
                        total: { $sum: { $cond: [{ $eq: ["$positive", true] }, 1, -1] } },
                    },
                },
                { $sort: { total: -1 } },
            ]);
            const messages = yield message_1.default.aggregate([
                {
                    $group: {
                        _id: "$discordId",
                        total: { $sum: 1 },
                    },
                },
                { $sort: { total: -1 } },
            ]);
            const reputationPage = new Reputation_1.default(authorMember, positiveRep);
            const messagesPage = new Messages_1.default(authorMember, messages);
            const reply = subCommand == "reputation" ? reputationPage.getPage(this.navRow) : messagesPage.getPage(this.navRow);
            const response = yield interaction.reply(Object.assign(Object.assign({}, reply), { fetchReply: true }));
            const responseId = response.id;
            const collector = response.createMessageComponentCollector({
                componentType: "BUTTON",
                time: 2 * 60 * 1000,
            });
            let interactionReply = null;
            collector.on("collect", (i) => __awaiter(this, void 0, void 0, function* () {
                if (i.user.id != authorMember.id) {
                    yield i.reply({ content: `UwU pažiūrėk top list su /top reputation, /top messages arba +top`, ephemeral: true });
                    return;
                }
                const handlers = [
                    yield this.buttonClickHandler(i.customId, { reputationPage, messagesPage }, this.navRow),
                    yield reputationPage.buttonClickHandler(i.customId, this.navRow),
                    yield messagesPage.buttonClickHandler(i.customId, this.navRow),
                ].filter(handler => handler != null);
                interactionReply = i;
                if (handlers[0])
                    yield i.update(handlers[0]);
            }));
            collector.on("end", (i) => __awaiter(this, void 0, void 0, function* () {
                const channel = client.Guild.channels.cache.get(interaction.channelId);
                const msg = channel.messages.cache.get(responseId);
                yield (msg === null || msg === void 0 ? void 0 : msg.delete().catch(err => console.error(err)));
                //await (await response.fetch()).delete().catch(err => console.error(err))
                //await response.delete().catch(err => console.error(err))
            }));
            console.log(positiveRep);
            // serve page
            // wait for btn click
            // serve chosen page
            // delete after 2 mins
        });
    }
    createNavRow() {
        this.navRow = new discord_js_1.default.MessageActionRow().addComponents([
            new discord_js_1.default.MessageButton()
                .setCustomId("reputationPage")
                .setLabel("Reputacijos TOP 10")
                .setStyle("SECONDARY")
                .setEmoji("<:plus:911929035838357505>"),
            new discord_js_1.default.MessageButton()
                .setCustomId("messagesPage")
                .setLabel("Žinučių TOP 10")
                .setStyle("SECONDARY")
                .setEmoji("📨")
        ]);
    }
    buttonClickHandler(customId, pages, navRow) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reputationPage, messagesPage } = pages;
            console.log(`Click Button ${customId}`);
            switch (customId) {
                case "reputationPage":
                    //if(this.pageId === customId) return null;
                    console.log(`REP`);
                    return yield reputationPage.getPage(navRow);
                case "messagesPage":
                    console.log(`MSG`);
                    return yield messagesPage.getPage(navRow);
                default:
                    return null;
            }
        });
    }
    createCoolDown(userId, channelId) {
        this.openDisplayIn.set(channelId, new Date(Date.now()));
    }
    checkCoolDown(userId, channelId, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`CoolDown`);
            if (config_1.default.botCommandChannel.includes(channelId))
                return false; // jei kanalas skirtas botu komandoms
            const openSince = this.openDisplayIn.get(channelId);
            if (!openSince)
                return false;
            const diff = openSince.getTime() + (2 * 60 * 1000) - Date.now();
            if (openSince.getTime() + 2 * 60 * 1000 < Date.now())
                return false;
            const embed = new discord_js_1.default.MessageEmbed()
                .setTitle('CoolDown')
                .setColor("BLURPLE")
                .setDescription(`Komandą Top galėsite naudoti už ${(0, pretty_ms_1.default)(diff)}`);
            const response = yield interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true });
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield response.delete().catch(err => console.log(err));
            }), diff);
            return true;
            // save active windows and delete them ignore whiteListed Cannels hardCode in
        });
    }
}
exports.default = Top;
