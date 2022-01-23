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
const booster_1 = __importDefault(require("./pages/booster"));
const node_html_to_image_1 = __importDefault(require("node-html-to-image"));
class Banner {
    constructor() {
        this.booster = new booster_1.default;
    }
    execute(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield (0, node_html_to_image_1.default)({
                output: './image.png',
                html: this.booster.page(),
                content: { name: user.username, avatar: user.avatarURL() },
                transparent: true,
            });
            console.log("DONE");
            return image;
        });
    }
}
exports.default = Banner;
