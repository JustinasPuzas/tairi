import {SlashCommandBuilder} from "@discordjs/builders"


const data = new SlashCommandBuilder()
	.setName('rep')
	.setDescription('Reputacija')
	.addSubcommand(subcommand =>
		subcommand
			.setName('plus')
			.setDescription('Duoti reputacijos tašką')
			.addUserOption(option => option.setName('username').setDescription('Vartotojo slapyvardis kuriam norite duoti reputacijos tašką').setRequired(true))
			.addStringOption(option => option.setName('comment').setDescription('Komentaras')))
	.addSubcommand(subcommand =>
		subcommand
			.setName('minus')
			.setDescription('Atimti reputacijos tašką')
			.addUserOption(option => option.setName('username').setDescription('Vartotojo slapyvardis kuriam norite duoti neigiamą reputacijos tašką').setRequired(true))
			.addStringOption(option => option.setName('comment').setDescription('Komentaras')))

export default data;