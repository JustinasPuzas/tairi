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
//import Settings from './Settings/Settings';
class ProfileInteraction {
    constructor(mainClass) {
        this.name = "profile";
        this.Parent = mainClass;
    }
    // CommandInteractionOptionResolver {
    //     _group: null,
    //     _subcommand: 'view',
    //     _hoistedOptions: [
    //       {
    //         name: 'member',
    //         type: 'USER',
    //         value: '655175393342521383',
    //         user: [User],
    //         member: [GuildMember]
    //       }
    //     ]
    //   }
    runCommand(interaction, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.log(interaction.options);
            const guild = client.guilds.cache.get(config_1.default.guildId);
            const members = guild.members.cache;
            const authorId = interaction.user.id;
            const authorMember = members.get(authorId);
            const channel = interaction.channel;
            const options = interaction.options;
            const targetId = options.getUser("member") ? (_a = options.getUser("member")) === null || _a === void 0 ? void 0 : _a.id : authorId;
            let targetMember = (members.get(`${targetId}`) ? members.get(`${targetId}`) : authorMember);
            if (targetMember.user.bot)
                targetMember = authorMember;
            // handle input errors O.o
            //const settings = new Settings(authorMember, interaction, client);
            try {
            }
            catch (err) {
            }
            if (interaction.options.getSubcommand()) {
                console.log(interaction.options.getSubcommand());
                yield this.Parent.executeCommand(authorMember, targetMember, interaction, client);
            }
            else if (interaction.options.getSubcommandGroup()) {
                console.log(interaction.options.getSubcommandGroup());
                yield this.Parent.executeCommand(authorMember, targetMember, interaction, client);
            }
            else {
                console.log(`FATAL ERR IN PROFILE`);
            }
        });
    }
}
exports.default = ProfileInteraction;
