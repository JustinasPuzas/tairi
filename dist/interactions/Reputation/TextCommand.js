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
class ReputationTextCommand {
    constructor(mainClass) {
        this.name = ['rep'];
        this.prefix = ["+", "-"];
        this.description = "Duok teigiamą arba neigiamą reputacijos tašką pasirinktam vartotojui";
        this.usage = `${this.prefix[0] + this.name[0]} @UserName Komentaras - Teigiamas reputacijos taškas\n${this.prefix[1] + this.name[0]} @UserName Komentaras - Neigiamas reputacijos taškas`;
        this.Parent = mainClass;
    }
    isThisCommand(commandName) {
        return this.name.includes(commandName);
    }
    runCommand(args, message, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const guild = client.guilds.cache.get(config_1.default.guildId);
            const authorId = message.author.id;
            const authorMember = guild.members.cache.get(authorId);
            const positive = message.content.startsWith(this.prefix[0]) ? true : false;
            let targetId = args[1];
            try {
                this.verifyInputs(targetId);
                targetId = targetId.replace(/\D/g, "");
            }
            catch (err) {
                console.log(err);
                yield this.badInputs(message, err);
                return;
            }
            const targetMember = guild.members.cache.get(targetId);
            const content = args[2] ? args.join(" ").replace(`rep ${args[1]} `, "") : null;
            const roles = authorMember.roles.cache;
            try {
                if (!targetMember)
                    throw new Error(`Negalite duoti reputacijos taškų šiam vartotojui <@${targetId}>`);
                if (targetMember.user.bot)
                    throw new Error(`Negalite duoti reputacijos taškų BOT'ams`);
                yield this.Parent.executeCommand(authorId, targetId, content, positive, roles);
                const embeds = this.Parent.constructResponseEmbed(authorMember, targetMember, positive, content);
                const response = yield message.reply({ embeds });
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield message.delete().catch(err => console.log(err));
                    yield response.delete().catch(err => console.log(err));
                }), 30 * 1000);
            }
            catch (err) {
                console.log(err);
                yield this.executionError(message, err);
            }
        });
    }
    badInputs(message, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const errorMessage = `${error}`.replace("Error: ", "**Klaida naudojant komandą:** ");
            const embed = new discord_js_1.default.MessageEmbed()
                .setTitle("Klaida")
                .setColor("DARK_RED")
                .setDescription(errorMessage + `\n**Teisingas naudojimas:**\n${this.usage}\n**Jūs parašėte:**\n*${message.content}*`);
            const response = yield message.reply({ embeds: [embed] });
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield message.delete().catch(err => console.log(err));
                yield response.delete().catch(err => console.log(err));
            }), 15 * 1000);
        });
    }
    executionError(message, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const errorMessage = `${error}**`.replace("Error: ", "Klaida vykdant komandą: **");
            const embed = new discord_js_1.default.MessageEmbed()
                .setTitle("Klaida")
                .setColor("DARK_RED")
                .setDescription(`${errorMessage}`);
            const response = yield message.reply({ embeds: [embed] });
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield message.delete().catch(err => console.log(err));
                yield response.delete().catch(err => console.log(err));
            }), 10 * 1000);
        });
    }
    verifyInputs(targetId) {
        if (!targetId)
            throw new Error("Nepaminėjote vartotojo");
    }
}
exports.default = ReputationTextCommand;
