"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const data = new builders_1.SlashCommandBuilder()
    .setName("profile")
    .setDescription("Reputacija")
    .addSubcommandGroup((subCommandGroup) => subCommandGroup
    .setName("edit")
    .setDescription("Suasmeninkite savo profilį uwu")
    .addSubcommand((subCommand) => subCommand
    .setName("description")
    .setDescription("Papasakok apie save")
    .addStringOption((option) => option
    .setName("description")
    .setDescription("Jūsų apibūdinimas MAX: 128 simbolių")
    .setRequired(true))))
    .addSubcommand((subCommand) => subCommand
    .setName("view")
    .setDescription("Adidaryti profilį")
    .addUserOption((option) => option
    .setName("member")
    .setDescription("Pasirinkite kieno prifilį norite atidaryti")));
exports.default = data;
