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
const source_1 = __importDefault(require("./source"));
const rulesConfig_1 = __importDefault(require("../../database/schemas/rulesConfig"));
const config_1 = __importDefault(require("../../config"));
const colorGrandient_1 = __importDefault(require("../../utils/colors/colorGrandient"));
class Rules {
    constructor() {
        this.name = ["rules"];
        this.maintenance = true;
        this.description = "Rules command Only available with `+maintenance` mode on";
        this._ready = false;
        this._rules = source_1.default;
        this._channelId = undefined;
        this._messages = undefined; // used to log rules messages posible addition to update rules
        this._webhookId = undefined;
        this._startColor = "ffffff";
        this._endColor = "0055ff";
        this.loadData();
    }
    isReady() {
        return this._ready;
    }
    isThisCommand(commandName) {
        return this.name.includes(commandName);
    }
    hasPerms(member) {
        return member.permissions.has("ADMINISTRATOR");
    }
    runCommand(args, message, client) {
        return __awaiter(this, void 0, void 0, function* () {
            // add options to update rule messages
            // add option to set color gradient
            const prevChannelId = this._channelId;
            const prevWebhookId = this._webhookId;
            const { channel, member } = message;
            if (!member)
                return;
            if (!this.hasPerms(member))
                return;
            yield this.sendToChannelViaWebHooks(channel);
            if (this._channelId == channel.id)
                return console.log(`Same channel`);
            yield this.changeRuleChannel(message, prevWebhookId, prevChannelId);
            // add rule channel check if diff
        });
    }
    changeRuleChannel(message, prevWebhookId, prevChannelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { member, channel, guild } = message;
            if (!member || !channel)
                return;
            const buttons = new Map()
                .set("setNewRulesChannel", new discord_js_1.default.MessageButton()
                .setCustomId("setNewRulesChannel")
                .setLabel("Taip")
                .setStyle("PRIMARY"))
                .set("dontSetNewRulesChannel", new discord_js_1.default.MessageButton()
                .setCustomId("dontSetNewRulesChannel")
                .setLabel("Ne")
                .setStyle("DANGER"));
            const verifyNewChannelEmbed = new discord_js_1.default.MessageEmbed()
                .setTitle("Naujas kanalas")
                .setDescription(`Nustatyti kaip įprastinį serverio taisyklių kanalą?`);
            const row = new discord_js_1.default.MessageActionRow().addComponents([
                buttons.get("setNewRulesChannel"),
                buttons.get("dontSetNewRulesChannel"),
            ]);
            const verifyMessage = yield message.reply({
                embeds: [verifyNewChannelEmbed],
                components: [row],
            });
            const collector = verifyMessage.createMessageComponentCollector({
                componentType: "BUTTON",
                time: 30 * 1000,
            });
            let collectorActive = false;
            collector.on("collect", (i) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (i.user.id === member.id) {
                    if (collectorActive)
                        return;
                    collectorActive = true;
                    let res;
                    if (i.customId == "setNewRulesChannel") {
                        // if TAIP
                        res = new discord_js_1.default.MessageEmbed()
                            .setTitle("Nustatytas naujas taisyklių kanalas")
                            .setColor("GREEN");
                        yield this.setChannelId(channel.id);
                        if (prevWebhookId && prevChannelId) {
                            const guild = message.guild;
                            const prevChannel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get(prevChannelId);
                            yield this.removeChannelWebHook(prevChannel, prevWebhookId);
                        }
                    }
                    else {
                        // if NE
                        res = new discord_js_1.default.MessageEmbed().setTitle("Canceled").setColor("RED");
                        if (prevWebhookId && prevChannelId) {
                            const guild = message.guild;
                            const prevChannel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get(prevChannelId);
                            if (this._webhookId)
                                yield this.removeChannelWebHook(channel, this._webhookId);
                            yield this.setWebhookId(prevWebhookId);
                        }
                    }
                    const row = new discord_js_1.default.MessageActionRow().addComponents((_a = buttons.get(`${i.customId}`)) === null || _a === void 0 ? void 0 : _a.setDisabled(true).setStyle("SUCCESS"));
                    //i.reply(`${i.user.id} clicked on the ${i.customId} button.`);
                    yield i.update({ embeds: [res], components: [row] });
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        console.log(`Delete msg`);
                        yield i.deleteReply().catch(err => console.log(err));
                    }), 5 * 1000);
                }
                else {
                    i.reply({ content: `Nekisk nagu nahuj`, ephemeral: true });
                }
            }));
            collector.on("end", (collected) => __awaiter(this, void 0, void 0, function* () {
                if (channel.messages.cache.get(verifyMessage.id)) {
                    yield verifyMessage.delete().catch(err => console.log(err));
                    ;
                }
                if (prevWebhookId && prevChannelId) {
                    const guild = message.guild;
                    const prevChannel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get(prevChannelId);
                    if (this._webhookId)
                        yield this.removeChannelWebHook(channel, this._webhookId);
                    yield this.setWebhookId(prevWebhookId);
                }
                console.log(`Collected ${collected.size} interactions.`);
            }));
        });
    }
    sendToChannelViaWebHooks(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const webhook = yield this.getChannelWebHook(channel);
            let arrSize = 0;
            this._rules.rules.map((rule) => {
                arrSize += rule.Contents.length;
            });
            arrSize += this._rules.rules.length;
            const gradient = (0, colorGrandient_1.default)(`${this._startColor}`, `${this._endColor}`, arrSize + 1);
            let id = 0;
            for (let text of this._rules.rules) {
                id++;
                let subId = 0;
                const { Title: username, TitlePicURL: avatarURL, SubTitlePicURL: thumbnail, Desc: description, Color: color, } = text;
                const titleCard = new discord_js_1.default.MessageEmbed()
                    .setTitle(`${id}: ` + description)
                    .setImage(thumbnail)
                    //.setThumbnail(thumbnail)
                    .setColor(`${gradient.next().value}`);
                const embeds = [titleCard];
                for (let rule of text.Contents) {
                    subId++;
                    let desc = rule.explain;
                    if (rule.Punishments.length > 0) {
                        desc = desc + `\n\n**${rule.Punishments}**`;
                    }
                    const embed = new discord_js_1.default.MessageEmbed()
                        .setTitle(`${id}.${subId} ${rule.Name}`)
                        .setDescription(desc)
                        .setColor(`${gradient.next().value}`);
                    embeds.push(embed);
                }
                yield webhook.send({
                    username,
                    avatarURL,
                    embeds,
                });
            }
            // send rules to channel
        });
    }
    getChannelWebHook(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._webhookId) {
                console.log(`Create webHook`);
                return yield this.createWebhook(channel);
            }
            else {
                console.log(`FindWebHook`);
                const webhooks = yield channel.fetchWebhooks();
                const webhook = webhooks.get(this._webhookId);
                return webhook ? webhook : yield this.createWebhook(channel);
            }
        });
    }
    removeChannelWebHook(channel, webhookId) {
        return __awaiter(this, void 0, void 0, function* () {
            const webhooks = yield channel.fetchWebhooks();
            const webhook = webhooks.get(webhookId);
            yield (webhook === null || webhook === void 0 ? void 0 : webhook.delete());
        });
    }
    createWebhook(channel) {
        return __awaiter(this, void 0, void 0, function* () {
            const webhook = yield channel.createWebhook("TaiRi", {
                avatar: `${channel.guild.iconURL()}`,
            });
            yield rulesConfig_1.default.findOneAndUpdate({ guildId: channel.guild.id }, { webhookId: webhook.id });
            this._webhookId = webhook.id;
            return webhook;
        });
    }
    setChannelId(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const guildId = config_1.default.guildId;
            yield rulesConfig_1.default.findOneAndUpdate({ guildId }, { channelId });
            this._channelId = channelId;
        });
    }
    setWebhookId(webhookId) {
        return __awaiter(this, void 0, void 0, function* () {
            const guildId = config_1.default.guildId;
            yield rulesConfig_1.default.findOneAndUpdate({ guildId }, { webhookId });
            this._webhookId = webhookId;
        });
    }
    getChannelId() {
        return this._channelId;
    }
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            const guildId = config_1.default.guildId;
            try {
                const rulesConfig = yield rulesConfig_1.default.findOne({ guildId });
                if (!rulesConfig) {
                    yield rulesConfig_1.default.create({ guildId: config_1.default.guildId });
                    this._ready = true;
                }
                this._channelId = rulesConfig.channelId;
                this._messages = rulesConfig.messages;
                this._webhookId = rulesConfig.webhookId;
                this._ready = true;
            }
            catch (err) {
                console.error(err);
            }
        });
    }
}
exports.default = Rules;
