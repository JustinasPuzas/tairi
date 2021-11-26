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
const mysql_1 = __importDefault(require("mysql"));
class Test {
    constructor() {
        this.name = ["test"];
        this.maintenance = false;
        this.description = "`+test` for developers";
        this._ready = false;
        this.pool = this.conntentToSqlDataBase();
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
            console.log(`TESTING`);
            const guildId = config_1.default.guildId;
            const memberId = message.author.id;
            const data = yield this.getUserInfoFromSqlDataBase("SELECT * FROM users WHERE guild = ? AND uid = ?", [guildId, memberId]);
            console.log(data);
            message.reply({ content: `fromDb: ${data}` });
            // const member = message.member as discord.GuildMember;
            // if (!this.hasPerms(member)) return;
            // const channel = message.channel as discord.TextChannel;
            // let msgContent = this.buildMessage(client)
            // const response = await message.reply(msgContent)
        });
    }
    getUserInfoFromSqlDataBase(q, v) {
        return __awaiter(this, void 0, void 0, function* () {
            let stacktrace = new Error();
            return new Promise((res, rej) => {
                this.pool.query(q, v, (err, data) => {
                    //console.log(stacktrace);
                    if (err) {
                        console.log(`ERROR CONECTING TO DV O.o`);
                        //this.logger.error(Object.assign(err,{fullTrace:stacktrace}));
                        return rej(err);
                    }
                    else
                        res(data);
                });
            });
        });
    }
    conntentToSqlDataBase() {
        const details = {
            host: "91.211.247.59",
            user: "discord",
            password: "cHiRMSudhpzdeeAzF4taBxlaDdo6NAip",
            port: 3307,
            database: "lounge",
            charset: "utf8mb4_unicode_ci",
            connectionLimit: 100
        };
        return mysql_1.default.createPool(details);
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
exports.default = Test;
