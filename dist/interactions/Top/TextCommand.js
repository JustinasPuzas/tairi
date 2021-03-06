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
class TopTextCommand {
    constructor(mainClass) {
        this.name = ['top'];
        this.description = "Top sąrašai";
        this.Parent = mainClass;
    }
    isThisCommand(commandName) {
        return this.name.includes(commandName);
    }
    runCommand(args, message, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorId = message.author.id;
            yield this.Parent.executeCommand(authorId, "reputation", message, client);
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                if (!message.deleted)
                    yield message.delete();
            }), 2 * 60 * 1000);
        });
    }
    badInputs(message, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const errorMessage = `${error}`.replace("Error: ", "**Klaida naudojant komandą:** ");
            const embed = new discord_js_1.default.MessageEmbed()
                .setTitle("Klaida")
                .setColor("DARK_RED")
                .setDescription(errorMessage + `\n**Teisingas naudojimas:**\n\n**Jūs parašėte:**\n*${message.content}*`);
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
exports.default = TopTextCommand;
