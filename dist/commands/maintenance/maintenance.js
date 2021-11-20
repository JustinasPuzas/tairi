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
class Maintenance {
    constructor() {
        this.name = ["maintenance", "settings"];
        this.maintenance = false;
        this.description = "`+maintenance` enables or disables maintenance mode";
        this._ready = false;
        this.loadData();
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
    runCommand(args, message, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = message.member;
            if (!this.hasPerms(member))
                return;
            const channel = message.channel;
            let msgContent = this.buildMessage(client);
            const response = yield message.reply(msgContent);
            const collector = response.createMessageComponentCollector({
                componentType: "BUTTON",
                time: 10 * 60 * 1000
            });
            collector.on("collect", (i) => __awaiter(this, void 0, void 0, function* () {
                if (i.user.id != member.id) {
                    yield i.reply({ content: "O.o No." });
                    return;
                }
                if (i.customId == 'exit') {
                    yield i.reply({ content: "Closed" });
                    yield response.delete().catch(err => {
                        console.log(err);
                    });
                }
                if (i.customId != "toggleMaintenance")
                    return;
                client.setMaintenanceMode(!client.getMaintenanceMode());
                msgContent = this.buildMessage(client);
                yield i.update(msgContent);
            }));
            collector.on("end", () => __awaiter(this, void 0, void 0, function* () {
                yield response.delete().catch(err => {
                    console.log(err);
                });
            }));
        });
    }
    buildMessage(client) {
        const maintenanceMode = client.getMaintenanceMode();
        const color = maintenanceMode ? "PURPLE" : "GREEN";
        const embed = new discord_js_1.default.MessageEmbed()
            .setTitle(`Maintenance Mode ${maintenanceMode}`)
            .setColor(color);
        const label = maintenanceMode ? "Disable" : "Enable";
        const style = maintenanceMode ? "SUCCESS" : "DANGER";
        const row = new discord_js_1.default.MessageActionRow().addComponents([
            new discord_js_1.default.MessageButton()
                .setCustomId("toggleMaintenance")
                .setLabel(label)
                .setStyle(style),
            new discord_js_1.default.MessageButton()
                .setCustomId("exit")
                .setLabel("Exit")
                .setStyle("PRIMARY")
        ]);
        return { embeds: [embed], components: [row] };
    }
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
}
exports.default = Maintenance;
