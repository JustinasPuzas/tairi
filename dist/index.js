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
const dotenv_1 = __importDefault(require("dotenv")); // env import
const discord_js_1 = require("discord.js");
const Client_1 = __importDefault(require("./Client"));
const config_1 = __importDefault(require("./config"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config(); // start dot env
const client = new Client_1.default({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
        discord_js_1.Intents.FLAGS.GUILD_BANS,
        discord_js_1.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        discord_js_1.Intents.FLAGS.GUILD_INTEGRATIONS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES,
        discord_js_1.Intents.FLAGS.GUILD_INVITES,
    ],
    partials: ['USER', 'GUILD_MEMBER', 'MESSAGE', 'CHANNEL', 'REACTION']
});
mongoose_1.default.connect(`${config_1.default.dataBase}`);
client.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    // load commands
    // load integrations
    yield client.registerParentCommands();
    console.log(`Bot is ready in ${client.guilds.cache.size} guilds`);
}));
client.on("messageCreate", (message) => {
    client.findOneAndRunCommand(message);
    client.logMessage(message);
});
client.on("messageUpdate", (oldMessage, newMessage) => __awaiter(void 0, void 0, void 0, function* () {
    oldMessage = yield oldMessage.fetch();
    newMessage = yield newMessage.fetch();
    yield client.updateMessage(oldMessage, newMessage);
}));
client.on("messageDelete", (message) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.deleteMessage(message);
}));
client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand())
        client.runInteractionCommand(interaction);
});
client.login(process.env.TOKEN);
