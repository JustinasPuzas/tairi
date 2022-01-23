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
const member_1 = __importDefault(require("../../../database/schemas/member"));
const SubCommandGroup_1 = __importDefault(require("./SubCommandGroup"));
class Description extends SubCommandGroup_1.default {
    constructor(authorMember, interaction, client) {
        super(authorMember, interaction, client);
        this.interaction = interaction;
        this.authorMember = authorMember;
        this.client = client;
        this.loadOptions();
    }
    loadOptions() {
        this.options.set("edit", this.editDescription);
    }
    editDescription() {
        return __awaiter(this, void 0, void 0, function* () {
            const description = this.interaction.options.getString("description", true);
            yield member_1.default.findOneAndUpdate({ discordId: this.authorMember.id }, { description: `${description}` });
        });
    }
    deleteDescription() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    resetDescription() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = Description;
