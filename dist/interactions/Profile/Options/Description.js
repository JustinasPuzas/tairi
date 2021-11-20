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
class Description {
    executeCommand(authorMember, description, request, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldMemberData = yield client.getMember(authorMember);
            const response = yield request.reply(Object.assign(Object.assign({}, payload), { fetchReply: true }));
            const collector = response.createMessageComponentCollector({
                componentType: "BUTTON",
                time: 2 * 60 * 1000,
            });
            collector.on("collect", (i) => __awaiter(this, void 0, void 0, function* () {
                if (i.user.id != authorMember.id) {
                    yield i.reply({ content: `Tikrink profilius su /profile view arba +profile`, ephemeral: true });
                    return;
                }
                const handlers = [
                    yield this.buttonClickHandler(i.customId, { reputationPage, homePage, discordPage }),
                ].filter(handler => handler != null);
                if (handlers[0])
                    yield i.update(handlers[0]);
            }));
            collector.on("end", (i) => __awaiter(this, void 0, void 0, function* () {
                yield response.delete().catch(err => console.error(err));
            }));
        });
    }
    buildNavActionRow() {
        const save = new discord_js_1.default.MessageButton()
            .setCustomId("save")
            .setLabel("Išsaugoti")
            .setStyle("SUCCESS");
        const cancel = new discord_js_1.default.MessageButton()
            .setCustomId("cancel")
            .setLabel("Atšaukti")
            .setStyle("DANGER");
        return new discord_js_1.default.MessageActionRow().addComponents([save, cancel]);
    }
    buttonClickHandler(customId, pages) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reputationPage, homePage, discordPage } = pages;
            switch (customId) {
                case "save":
                    return yield homePage.getPage();
                case "cancel":
                    return yield reputationPage.getPage();
                default:
                    return null;
            }
        });
    }
}
exports.default = Description;
