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

console.log(`mongodb://${config.dataBase.username}:${process.env.DATA_BASE_PASSWORD}@${config.dataBase.link}`)

const options = {
    //authMechanism: "DEFAULT",
    user: config.dataBase.username,
    pass: process.env.DATA_BASE_PASSWORD,
    authSource: config.dataBase.authSource,
    //useCreateIndex: true,
    //useFindAndModify: false,
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
}

mongoose.connect(`mongodb://${config.dataBase.link}`, options);

// dataBase: "mongodb://localhost/edvBuild",
// user: 'devAdmin',
// pass: '6QF/TB_Genesis.',
// authSource: 'admin',
// authMechanism: 'DEFAULT',


//mongoose.connect(`mongodb://${config.dataBase.link}`)
client.on("ready", async () => {
  // load commands
  // load integrations
  await client.onReady();
  console.log(`Bot is ready in ${client.guilds.cache.size} guilds`);
});

client.on("messageCreate", async (message) => {
  try{
    await client.findOneAndRunCommand(message);
    await client.messageLogger.logMessage(message);
  }catch (err) {
    console.log(err)
  }
})

client.on("rateLimit", msg => {
  console.log(msg)
})

client.on("messageUpdate", async (oldMessage, newMessage)=> {
  try{
    oldMessage = await oldMessage.fetch();
    newMessage = await newMessage.fetch();
    await client.messageLogger.updateMessage(oldMessage, newMessage)
  }catch (err){
    console.log(err)
  }
})

client.on("messageDelete", async (message) => {
  try{
    await client.messageLogger.deleteMessage(message)
  }catch (err){
    console.log(err)
  }
})

client.on("interactionCreate", async (interaction) => {
  try{
    if(interaction.isCommand()) await client.runInteractionCommand(interaction)
  }catch (err){
    console.log(err)
  }
})

client.login(process.env.TOKEN);
