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
const config_1 = __importDefault(require("../../config"));
class CoolDown {
    constructor() {
        this.onCoolDown = new Map();
        // user each user after active display cmd 15 sec on close
        // channel one display command per channel
        // 
    }
    isOnCoolDown(userId, channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this.onCoolDown);
            const channel = this.onCoolDown.get(channelId);
            if (!channel)
                return false;
            const user = channel.get(userId);
            if (!user)
                return false;
            if (user.getTime() + config_1.default.globalCoolDown > Date.now())
                return true;
            return false;
        });
    }
    /**
     * for display command pass channelId
     * for user pass userId
     */
    createCoolDown(userId, channelId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.onCoolDown.get(channelId)) {
                console.log(`No Channel`);
                this.onCoolDown.set(channelId, new Map());
            }
            if (!((_a = this.onCoolDown.get(channelId)) === null || _a === void 0 ? void 0 : _a.get(userId))) {
                (_b = this.onCoolDown.get(channelId)) === null || _b === void 0 ? void 0 : _b.set(userId, new Date(Date.now()));
            }
            setTimeout(() => {
                var _a;
                (_a = this.onCoolDown.get(channelId)) === null || _a === void 0 ? void 0 : _a.delete(userId);
            }, config_1.default.globalCoolDown);
        });
    }
    /**
     *
     * used for premature cd removing
     */
    deleteCoolDown(Id) {
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
