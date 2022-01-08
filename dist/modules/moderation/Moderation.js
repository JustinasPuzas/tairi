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
const mute_1 = __importDefault(require("../../database/schemas/mute"));
const Mute_1 = __importDefault(require("./Mute"));
const config_1 = __importDefault(require("../../config"));
const cron_1 = require("cron");
class Moderation {
    constructor(client) {
        this.muteRoleId = config_1.default.muteRoleId;
        this.Jobs = new Map();
        this.client = client;
        this.loadData();
    }
    isMuted(member) {
        return member.roles.cache.has(this.muteRoleId);
    }
    findMute(discordId) {
        return this.mutedMembers.find((mute) => mute.isThisUser(discordId));
    }
    muteMember(member, author, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isMuted(member))
                throw new Error(`<@${member.id}> Jau palaidotas 🥀`);
            const currentTime = new Date(Date.now());
            const data = {
                discordId: member.id,
                authorId: author.id,
                roleId: this.muteRoleId,
                mutedOn: currentTime,
                unMuteOn: new Date(currentTime.getTime() + duration),
                duration: duration,
            };
            const mute = new Mute_1.default(yield mute_1.default.create(data));
            this.mutedMembers.push(mute);
            this.startCronJob(mute);
            yield member.roles.add(this.muteRoleId);
        });
    }
    unMuteMember(discordId) {
        return __awaiter(this, void 0, void 0, function* () {
            const guild = this.client.Guild;
            let member = guild.members.cache.get(discordId);
            if (!member)
                member = yield guild.members.fetch(discordId);
            const memberMute = this.mutedMembers.filter((mute) => mute.isThisUser(discordId))[0];
            if (!memberMute)
                throw new Error(`<@${discordId}> Šis vartotojas gyvas`);
            this.mutedMembers = this.mutedMembers.filter((mute) => !mute.isThisAuthor(discordId));
            if (member)
                yield member.roles.remove(memberMute.getData().roleId).catch((err) => console.error(err));
            // istrina is mute listo O.o
        });
    }
    startCronJob(mute) {
        return __awaiter(this, void 0, void 0, function* () {
            const discordId = mute.getData().discordId;
            const job = new cron_1.CronJob(mute.getEndDate(), () => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.unMuteMember(mute.getData().discordId).catch(err => console.log(err));
                }
                catch (err) {
                    console.log(err);
                }
            }));
            job.start();
            this.Jobs.set(discordId, job);
        });
    }
    // private async loop() {
    //   console.log(`LOOP = start`);
    //   if (!this.mutedMembers) return;
    //   console.log(this.mutedMembers);
    //   if (this.mutedMembers.length == 0) return;
    //   this.mutedMembers = this.mutedMembers.filter((muted) => {
    //     console.log(`LOOP =`);
    //     if (muted.getEndDate().getTime() <= Date.now()) {
    //       this.unMuteMember(muted.getData().discordId);
    //       return false;
    //     }
    //   });
    // }
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Load Data`);
            const muteRole = this.client.Guild.roles.cache.get(this.muteRoleId);
            if (muteRole)
                this.muteRole = muteRole;
            else {
                // log error that role wasnt found O.o
            }
            this.mutedMembers = (yield mute_1.default.find({ unMuteOn: { $gt: new Date(Date.now()) } })).map((data) => {
                const muteObj = new Mute_1.default(data);
                this.startCronJob(muteObj);
                return new Mute_1.default(data);
            });
            console.log(this.mutedMembers);
            // muteDb.find(); // load active mutes O.o
        });
    }
}
exports.default = Moderation;
