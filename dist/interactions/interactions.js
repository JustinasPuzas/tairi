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
const config_1 = __importDefault(require("../config"));
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const fs_1 = __importDefault(require("fs"));
class InteractionCommand {
    constructor(client) {
        this.clientId = config_1.default.clientId;
        this.guildId = config_1.default.guildId;
        this.interactionCommands = new Map();
        this.commands = [];
        this.updateCommands(client);
    }
    executeCommand(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this.interactionCommands);
            const command = this.interactionCommands.get(interaction.commandName);
            if (!command)
                throw new Error("No such command");
            yield command.runCommand(interaction, client);
            return;
        });
    }
    updateCommands(client) {
        return __awaiter(this, void 0, void 0, function* () {
            const commandFolders = fs_1.default
                .readdirSync("./dist/interactions")
                .filter((file) => !file.endsWith(".js"));
            for (const commandFolder of commandFolders) {
                const files = fs_1.default.readdirSync(`./dist/interactions/${commandFolder}`);
                const commandFiles = files.filter((file) => file == "Template.js");
                const commandClasses = files.filter((file) => file == `${commandFolder}.js`);
                for (const file of commandFiles) {
                    const command = yield require(`${__dirname}/${commandFolder}/${file}`).default;
                    this.commands.push(command.toJSON());
                }
                for (const commandClass of commandClasses) {
                    const command = yield require(`${__dirname}/${commandFolder}/${commandClass}`).default;
                    const cmd = new command();
                    this.interactionCommands.set(cmd.interactionCommand.name, cmd.interactionCommand);
                    if (cmd.textCommand)
                        client._commands.push(cmd.textCommand);
                }
            }
            const rest = new rest_1.REST({ version: "9" }).setToken(process.env.TOKEN);
            try {
                console.log("Started refreshing application (/) commands.");
                yield rest.put(v9_1.Routes.applicationGuildCommands(this.clientId, this.guildId), {
                    body: this.commands,
                });
                console.log("Successfully reloaded application (/) commands.");
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.default = InteractionCommand;
