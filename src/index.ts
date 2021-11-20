import dotenv from "dotenv"; // env import
import discord, { Intents } from "discord.js";
import Client from "./Client";
import config from "./config";
import mongoose from "mongoose";

dotenv.config(); // start dot env

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_INVITES,
  ],
  partials: ['USER','GUILD_MEMBER', 'MESSAGE', 'CHANNEL', 'REACTION']
});

mongoose.connect(`${config.dataBase}`);

client.on("ready", async () => {
  // load commands
  // load integrations
  await client.registerParentCommands();
  console.log(`Bot is ready in ${client.guilds.cache.size} guilds`);
});

client.on("messageCreate", (message) => {
  client.findOneAndRunCommand(message);
  client.logMessage(message);
})

client.on("messageUpdate", async (oldMessage, newMessage)=> {
    oldMessage = await oldMessage.fetch();
    newMessage = await newMessage.fetch();
    await client.updateMessage(oldMessage, newMessage)
})

client.on("messageDelete", async (message) => {
  await client.deleteMessage(message)
})

client.on("interactionCreate", (interaction) => {
  if(interaction.isCommand()) client.runInteractionCommand(interaction)
})

client.login(process.env.TOKEN);
