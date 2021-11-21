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
const InteractionCommand_1 = __importDefault(require("./InteractionCommand"));
const ReputationPage_1 = __importDefault(require("./Pages/ReputationPage"));
const discord_js_1 = __importDefault(require("discord.js"));
const TextCommand_1 = __importDefault(require("./TextCommand"));
const reputation_1 = __importDefault(require("../../database/schemas/reputation"));
const HomePage_1 = __importDefault(require("./Pages/HomePage"));
const DiscordPage_1 = __importDefault(require("./Pages/DiscordPage"));
const message_1 = __importDefault(require("../../database/schemas/message"));
const pretty_ms_1 = __importDefault(require("pretty-ms"));
class Profile {
    // default active time 30s 
    // each interaction +30s
    // max 2min
    // cd after usage end for member 30s
    // wite list channel with no cd O.o 
    constructor() {
        this.ready = true;
        this.interactionCommand = new InteractionCommand_1.default(this);
        this.textCommand = new TextCommand_1.default(this);
        this.openDisplayIn = new Map();
        console.log(`PROFILE`);
    }
    executeCommand(authorMember, targetMember, request, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const navActionRow = this.buildNavActionRow();
            const reputationData = this.getReputation(targetMember.id);
            const memberData = client.getMember(targetMember);
            const memberMessageCount = this.getMessageCount(targetMember.id);
            if (yield this.checkCoolDown(authorMember.id, request.channelId, request))
                return;
            this.createCoolDown(authorMember.id, request.channelId);
            const results = yield Promise.all([reputationData, memberData, memberMessageCount, yield targetMember.user.fetch()]);
            const discordPage = new DiscordPage_1.default(authorMember, targetMember, navActionRow);
            const reputationPage = new ReputationPage_1.default(authorMember, targetMember, navActionRow, results[0]);
            const homePage = new HomePage_1.default(authorMember, targetMember, navActionRow, results[1], reputationPage, results[2]);
            const payload = homePage.getPage();
            const response = yield request.reply(Object.assign(Object.assign({}, payload), { fetchReply: true }));
            const collector = response.createMessageComponentCollector({
                componentType: "BUTTON",
                time: 2 * 60 * 1000,
            });
            collector.on("collect", (i) => __awaiter(this, void 0, void 0, function* () {
                if (i.user.id != authorMember.id) {
                    yield i.reply({ content: `UwU Tikrink profilius su /profile view arba +profile`, ephemeral: true });
                    return;
                }
                const handlers = [
                    yield this.buttonClickHandler(i.customId, { reputationPage, homePage, discordPage }),
                    yield reputationPage.buttonClickHandler(i.customId),
                ].filter(handler => handler != null);
                if (handlers[0])
                    yield i.update(handlers[0]);
            }));
            collector.on("end", (i) => __awaiter(this, void 0, void 0, function* () {
                yield response.delete().catch(err => console.error(err));
            }));
        });
    }
    getReputation(discordId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield reputation_1.default.find({ discordId }).sort({ timeStamp: -1 }));
        });
    }
    getMessageCount(discordId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield message_1.default.countDocuments({ discordId }));
        });
    }
    buildNavActionRow() {
        const homePage = new discord_js_1.default.MessageButton()
            .setCustomId("homePage")
            .setLabel("Profilis")
            .setStyle("PRIMARY");
        const reputationPage = new discord_js_1.default.MessageButton()
            .setCustomId("reputationPage")
            .setLabel("Reputacija")
            .setStyle("PRIMARY");
        const discordPage = new discord_js_1.default.MessageButton()
            .setCustomId("discordPage")
            .setLabel("Discord")
            .setStyle("SECONDARY");
        //.setEmoji("<a:discord:911592752658128926>")
        return new discord_js_1.default.MessageActionRow().addComponents([homePage, reputationPage, discordPage]);
    }
    buttonClickHandler(customId, pages) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reputationPage, homePage, discordPage } = pages;
            switch (customId) {
                case "homePage":
                    return yield homePage.getPage();
                case "reputationPage":
                    return yield reputationPage.getPage();
                case "discordPage":
                    return yield discordPage.getPage();
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
            const greenLight = ["903249149615538179", "889528960029954049"];
            if (greenLight.includes(channelId))
                return false; // jei kanalas skirtas botu komandoms
            const openSince = this.openDisplayIn.get(channelId);
            if (!openSince)
                return false;
            if (openSince.getTime() + 2 * 60 * 1000 < Date.now())
                return false;
            const response = yield interaction.reply({ content: `naudoti komandą Profile galėsite už ${(0, pretty_ms_1.default)((openSince.getTime() + (2 * 60 * 1000)) - Date.now())}`, ephemeral: true, fetchReply: true });
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                //await response.delete().catch(err => console.log(err))
            }), 5 * 1000);
            return true;
            // save active windows and delete them ignore whiteListed Cannels hardCode in
        });
    }
}
exports.default = Profile;
