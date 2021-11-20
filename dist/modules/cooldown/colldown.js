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
const pretty_ms_1 = __importDefault(require("pretty-ms"));
class CoolDown {
    constructor() {
        this.coolDowns = new Map();
        // user each user after active display cmd 15 sec on close
        // channel one display command per channel
        // 
    }
    checkCoolDown(userId, channelId, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCoolDown = this.coolDowns.get(userId);
            const channelCoolDown = this.coolDowns.get(userId);
            if (userCoolDown) {
                if (userCoolDown.getTime() < Date.now()) {
                    this.coolDowns.delete(userId);
                    return false;
                }
                const timeLeft = userCoolDown.getTime() - Date.now();
                const response = yield request.reply({ content: `Galėsite naudotis komandandomis po ${(0, pretty_ms_1.default)(timeLeft)}\n arba pranykus šiai žinutei` });
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield response.delete().catch(err => console.log(err));
                }), timeLeft);
                // reply on cd for user aka you can use commands after
                return true;
            }
            if (channelCoolDown) {
                if (channelCoolDown.getTime() < Date.now()) {
                    this.coolDowns.delete(channelId);
                    return false;
                }
                const timeLeft = channelCoolDown.getTime() - Date.now();
                const response = yield request.reply({ content: `Šią komandą bus galima naudoti po ${(0, pretty_ms_1.default)(timeLeft)}\n arba dabar kitame kanale` });
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield response.delete().catch(err => console.log(err));
                }), timeLeft);
                // reply on cd for user aka you can use commands after
                return true;
            }
            // checks if there is active coolDown for channel and user
            // called before calling command
            return false;
        });
    }
    /**
     * for display command pass channelId
     * for user pass userId
     */
    createCoolDown(Id, end) {
        this.coolDowns.set(Id, end);
        //creates coolDown for channel and user
        //called from command
    }
    /**
     *
     * used for premature cd removing
     */
    deleteCoolDown(Id) {
        this.coolDowns.delete(Id);
        //deletes coolDown for channel and user
        //called from command
    }
}
class Command {
    constructor() {
    }
}
class activeCommand extends Command {
}
class displayCommand extends Command {
}
exports.default = CoolDown;
