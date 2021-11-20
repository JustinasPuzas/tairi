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
const reputationConfig_1 = __importDefault(require("../../database/schemas/reputationConfig"));
class Reputation {
    constructor() {
        this.name = ["reputation"];
        this.maintenance = true;
        this.description = "`+reputation` returns reputation configuration";
        this._ready = false;
        this.loadData();
    }
    isThisCommand(commandName) {
        return this.name.includes(commandName);
    }
    hasPerms(member) {
        return member.permissions.has("ADMINISTRATOR");
    }
    isReady() {
        return this._ready;
    }
    runCommand(args, message, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = message.member;
            const channel = message.channel;
            if (!this.hasPerms(member))
                return;
            console.log(args);
            if (args[1]) {
                this.subCommands(args, message, channel, client);
                // send config of +rep
                // colors Custom | defined hex color
                //
                return;
            }
            yield this.sendConfig(message);
        });
    }
    subCommands(args, message, channel, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const guild = message.guild;
            try {
                switch (args[1]) {
                    case "color":
                        yield this.updateColor(args[2]);
                        break;
                    case "cd":
                        yield this.updateCoolDown(args[2]);
                        break;
                    case "bl":
                        yield this.updateBlackList(args[2], args[3], guild);
                        break;
                    default:
                        throw new Error("Bad input, check `+reputation` for specific config commands");
                        break;
                }
            }
            catch (err) {
                this.replyError(message, err);
            }
        });
    }
    replyError(message, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = new discord_js_1.default.MessageEmbed()
                .setTitle("Error X.X")
                .setDescription(`${error}`)
                .setColor("DARK_RED");
            const messageReply = yield message.reply({ embeds: [embed] });
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield messageReply.delete().catch((err) => console.log(err));
            }), 10000);
        });
    }
    updateColor(color) {
        return __awaiter(this, void 0, void 0, function* () {
            color = color.toLowerCase();
            if (color.startsWith("#")) {
                if (color.length == 7) {
                    this.reputationConfig = yield reputationConfig_1.default.findOneAndUpdate({ guildId: config_1.default.guildId }, { color }, { new: true });
                }
            }
            else if (color == "custom") {
                this.reputationConfig = yield reputationConfig_1.default.findOneAndUpdate({ guildId: config_1.default.guildId }, { color }, { new: true });
            }
            else {
                throw new Error("Bad input, should be: CUSTOM | #______");
            }
        });
    }
    updateCoolDown(time) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeToNumber = Number.parseInt(time);
            if (!timeToNumber)
                throw new Error("Bad input, should be: Integer as Minutes");
            const coolDown = timeToNumber * 60 * 1000;
            this.reputationConfig = yield reputationConfig_1.default.findOneAndUpdate({ guildId: config_1.default.guildId }, { coolDown }, { new: true });
        });
    }
    updateBlackList(action, roleId, guild) {
        return __awaiter(this, void 0, void 0, function* () {
            const add = ["+", "a", "add"];
            const remove = ["-", "r", "remove"];
            if (add.includes(action)) {
                const role = yield this.checkIfValueIsRole(guild, roleId);
                yield this.addToBlackList(role);
            }
            else if (remove.includes(action)) {
                const role = yield this.checkIfValueIsRole(guild, roleId);
                yield this.removeFromBlackList(role);
            }
            else {
                throw new Error("Bad input, should be:\n + a add to add role\n - r remove to remove role");
            }
        });
    }
    checkIfValueIsRole(guild, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            roleId = roleId.replace(/\D/g, "");
            yield guild.roles.fetch();
            const role = guild.roles.cache.get(roleId);
            if (!role)
                throw new Error(`Bad input, role with id: ${roleId} doesn't exist`);
            return role;
        });
    }
    addToBlackList(role) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.reputationConfig.blackListed.includes(role.id))
                throw new Error(`Role <@&${role.id}> already is blackListed`);
            this.reputationConfig = yield reputationConfig_1.default.findOneAndUpdate({ guildId: config_1.default.guildId }, { $push: { blackListed: role.id } }, { new: true });
        });
    }
    removeFromBlackList(role) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.reputationConfig.blackListed.includes(role.id))
                throw new Error(`No such Role <@&${role.id}> in blackList`);
            this.reputationConfig = yield reputationConfig_1.default.findOneAndUpdate({ guildId: config_1.default.guildId }, { $pull: { blackListed: role.id } }, { new: true });
        });
    }
    sendConfig(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = message.channel;
            const conf = this.reputationConfig;
            const member = message.member;
            const displayColor = conf.color == "custom"
                ? member.displayHexColor
                : conf.color;
            const embed = new discord_js_1.default.MessageEmbed()
                .setTitle(`Reputation Configuration`)
                .setDescription("Prefix for all settings `+reputation `")
                .setColor(displayColor)
                .setFields([
                { name: `Color: ${conf.color}`, value: "`color ` new value in HEX" },
                {
                    name: `Cooldown: ${conf.coolDown / 1000 / 60}`,
                    value: "`cd ` new value in minutes",
                },
                {
                    name: `BlackListed:`,
                    value: `${conf.blackListed.map(el => `<@&${el}>`)}\n\`bl +/- \` new value as @RoleName or Role id`,
                },
            ]);
            yield channel.send({ embeds: [embed] });
        });
    }
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            const guildId = config_1.default.guildId;
            this.reputationConfig = yield reputationConfig_1.default.findOne({ guildId });
            if (!this.reputationConfig) {
                this.reputationConfig = (yield reputationConfig_1.default.create({
                    guildId,
                }));
            }
            this._ready = true;
            return;
        });
    }
}
exports.default = Reputation;
