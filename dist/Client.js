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
const rules_1 = __importDefault(require("./commands/rules/rules"));
const interactions_1 = __importDefault(require("./interactions/interactions"));
const member_1 = __importDefault(require("./database/schemas/member"));
const config_1 = __importDefault(require("./config"));
const message_1 = __importDefault(require("./database/schemas/message"));
const Cooldown_1 = __importDefault(require("./modules/cooldown/Cooldown"));
const fs = require("fs").promises;
class Client extends discord_js_1.default.Client {
    constructor() {
        // extending Client Class
        super(...arguments);
        this._maintenanceMode = false;
        this._prefix = config_1.default.prefix;
        this._commands = [];
        this.Rules = new rules_1.default();
        this.InteractionCommands = new interactions_1.default(this);
        this.coolDownManager = new Cooldown_1.default();
    }
    getMaintenanceMode() {
        return this._maintenanceMode;
    }
    setMaintenanceMode(value) {
        this._maintenanceMode = value;
    }
    runInteractionCommand(command) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.InteractionCommands.executeCommand(command, this);
        });
    }
    getMember(member) {
        return __awaiter(this, void 0, void 0, function* () {
            const findMember = yield member_1.default.findOne({ discordId: member.id });
            if (findMember)
                return findMember;
            const firstTimeJoined = member.joinedAt ? member.joinedAt : new Date(Date.now());
            const createMember = yield member_1.default.create({ guildId: config_1.default.guildId, discordId: member.id, roles: [...member.roles.cache.keys()], firstTimeJoined });
            return createMember;
        });
    }
    logMessage(message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const guildId = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.id;
            const channelId = message.channelId;
            const content = message.content;
            const timeStamp = new Date(Date.now());
            let attachments = message.attachments;
            const discordId = message.author.id;
            const messageId = message.id;
            yield message_1.default.create({ guildId, channelId, messageId, content, timeStamp, attachments, discordId });
        });
    }
    deleteMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageId = message.id;
            yield message_1.default.findOneAndUpdate({ messageId }, { deleted: true, deletedTimeStamp: new Date(Date.now()) });
        });
    }
    updateMessage(oldMessage, newMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageId = oldMessage.id;
            yield message_1.default.findOneAndUpdate({ messageId }, { $push: { edits: Object.assign({}, newMessage) } });
        });
    }
    findOneAndRunCommand(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = message.content;
            for (let command of this._commands) {
                if (this._maintenanceMode == false && command.maintenance == true)
                    return;
                if (command.maintenance != true) {
                    const userId = message.author.id;
                    const channelId = message.channelId;
                }
                if (command.prefix) {
                    if (command.prefix.includes(content[0])) {
                        const args = this.parseArgs(message.content, content[0]);
                        if (command.isThisCommand(args[0])) {
                            try {
                                yield command.runCommand(args, message, this);
                            }
                            catch (err) {
                                console.error(err);
                            }
                        }
                    }
                }
                else {
                    if (config_1.default.prefix == content[0]) {
                        const args = this.parseArgs(message.content, content[0]);
                        if (command.isThisCommand(args[0])) {
                            try {
                                yield command.runCommand(args, message, this);
                            }
                            catch (err) {
                                console.error(err);
                            }
                        }
                    }
                }
            }
        });
    }
    parseArgs(content, prefix) {
        content = content.replace(prefix, "");
        const args = content.split(" ");
        return args;
    }
    registerParentCommands() {
        return __awaiter(this, void 0, void 0, function* () {
            const folderPath = "./dist/commands";
            const folders = (yield fs.readdir(folderPath)).filter((item) => !item.includes(`.`));
            for (let folder of folders) {
                try {
                    const path = `${__dirname}/commands/${folder}`;
                    const command = yield require(`${path}/${folder}`).default;
                    const cmd = new command();
                    this._commands.push(cmd);
                }
                catch (err) {
                    console.log(folder);
                    console.error(err);
                }
            }
            console.log(this._commands);
            return;
        });
    }
}
exports.default = Client;