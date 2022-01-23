"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const data = new builders_1.SlashCommandBuilder()
    .setName('rep')
    .setDescription('Reputacija')
    .addSubcommand(subcommand => subcommand
    .setName('plus')
    .setDescription('Duoti reputacijos tašką')
    .addUserOption(option => option.setName('username').setDescription('Vartotojo slapyvardis kuriam norite duoti reputacijos tašką').setRequired(true))
    .addStringOption(option => option.setName('comment').setDescription('Komentaras').setRequired(true)))
    .addSubcommand(subcommand => subcommand
    .setName('minus')
    .setDescription('Atimti reputacijos tašką')
    .addUserOption(option => option.setName('username').setDescription('Vartotojo slapyvardis kuriam norite duoti neigiamą reputacijos tašką').setRequired(true))
    .addStringOption(option => option.setName('comment').setDescription('Komentaras').setRequired(true)));
exports.default = data;
