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
const banner_1 = __importDefault(require("../../modules/banner/banner"));
class Test {
    constructor() {
        this.name = ["test"];
        this.maintenance = false;
        this.description = "`+test` for developers";
        this._ready = false;
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
            const ban = new banner_1.default();
            const banner = yield ban.execute(message.author);
            yield message.reply({ files: [banner] });
        });
    }
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
}
exports.default = Test;
