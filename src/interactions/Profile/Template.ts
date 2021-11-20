import { SlashCommandBuilder } from "@discordjs/builders";

const data = new SlashCommandBuilder()
  .setName("profile")
  .setDescription("Reputacija")
  // .addSubcommandGroup((subCommandGroup) =>
  //   subCommandGroup
  //     .setName("edit")
  //     .setDescription("Suasmeninkite savo profilį uwu")
  //     .addSubcommand((subCommand) =>
  //       subCommand
  //         .setName("description")
  //         .setDescription("Papasakok apie save")
  //         .addStringOption((option) =>
  //           option
  //             .setName("description")
  //             .setDescription("Jūsų apibūdinimas MAX: 128 simbolių")
  //             .setRequired(true)
  //         )
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
