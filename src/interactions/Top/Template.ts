import { SlashCommandBuilder } from "@discordjs/builders";

const data = new SlashCommandBuilder()
  .setName("top")
  .setDescription("Top list")
  .addSubcommand(
    (subcommand) =>
      subcommand.setName("reputation").setDescription("Reputcijos top")
    // .addUserOption(option => option.setName('username').setDescription('Vartotojo slapyvardis kuriam norite duoti reputacijos tašką').setRequired(true))
    // .addStringOption(option => option.setName('comment').setDescription('Komentaras').setRequired(true))
  )
  .addSubcommand(
    (subcommand) => subcommand.setName("messages").setDescription("Žinučių top")
    // .addUserOption(option => option.setName('username').setDescription('Vartotojo slapyvardis kuriam norite duoti neigiamą reputacijos tašką').setRequired(true))
    // .addStringOption(option => option.setName('comment').setDescription('Komentaras').setRequired(true))
  );

export default data;
