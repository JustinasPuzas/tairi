import { SlashCommandBuilder } from "@discordjs/builders";

const data = new SlashCommandBuilder()
  .setName("profile")
  .setDescription("Reputacija")
  // .addSubcommandGroup((subCommandGroup) =>
  //   subCommandGroup
  //     .setName("description")
  //     .setDescription("Suasmeninkite savo profilį uwu")
  //     .addSubcommand((subCommand) =>
  //       subCommand
  //         .setName("edit")
  //         .setDescription("Pakeisk Apie save skiltį")
  //         .addStringOption((option) =>
  //           option
  //             .setName("about")
  //             .setDescription("Apie jus MAX: 128 simbolių")
  //             .setRequired(true)
  //         )
  //     )
  //     .addSubcommand((subCommand) =>
  //       subCommand
  //         .setName("import")
  //         .setDescription("Perkelia discord about į jūsų profilį")
  //     )
  //     .addSubcommand((subCommand) =>
  //       subCommand.setName("remove").setDescription("Pašalina jūsų apibūdinimą")
  //     )
  // )
  .addSubcommand((subCommand) =>
    subCommand
      .setName("view")
      .setDescription("Adidaryti profilį")
      .addUserOption((option) =>
        option
          .setName("member")
          .setDescription("Pasirinkite kieno prifilį norite atidaryti")
      )
  );

export default data;
