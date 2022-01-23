"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Mute {
    constructor(data) {
        this.data = data;
    }
    getData() {
        return this.data;
    }
    getEndDate() {
        return this.data.unMuteOn;
    }
    isThisUser(discordId) {
        return this.data.discordId == discordId;
    }
    isThisAuthor(authorId) {
        return this.data.authorId == authorId;
    }
}
exports.default = Mute;
