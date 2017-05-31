import { Client, TextChannel } from "discord.js";
import { Commander, Logger, RoleAssigner } from "./classes";

import * as dotenv from "dotenv";
dotenv.config();

const BOT_SECRET = process.env.NODE_ENV !== "production" ? process.env.BOT_SECRET_DEV : process.env.BOT_SECRET_PROD;

const config = {
  ownerID: "131418385610309633",
  prefix: "+",
  role_assignment: "role_assignment",
};

const client = new Client({
  disabledEvents: ["TYPING_START"],
});

const roleAssignment = new RoleAssigner();
const logger = new Logger();
const commander = new Commander();

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

client.on("message", (msg) => {
  const { content, channel } = msg;
  const { name } = (channel as TextChannel);
  const { role_assignment, prefix } = config;

  if (name === undefined) return;

  if (name !== logger.chatlogChannel) logger.log(msg);

  if (name === role_assignment) {
    if (content.startsWith("+!") || content.startsWith("-!")) roleAssignment.handleMessage(msg);
    if (content.startsWith(prefix)) commander.execute(msg);
  }
});

client.on("messageUpdate", (before, after) => {
  const { name } = (after.channel as TextChannel);
  if (name !== logger.chatlogChannel) logger.logEdit(before, after);
});

client.on("messageDelete", (msg) => {
  const { name } = (msg.channel as TextChannel);
  if (name !== logger.chatlogChannel) logger.logDelete(msg);
});

client.login(BOT_SECRET);

process.on("SIGINT", () => {
  client.destroy();
  process.exit(0);
});

/*
const handleCommand = (message: Message) => {
  const { content, channel } = message;
  const command = content.slice(1).trim().toLowerCase();

  COMMANDS[command] ? COMMANDS[command](message) : COMMANDS.default(message);

  if (command === "help") {
    const textToSend = `Check pin for help. Also here is a list of assignable roles: ${roles.join(", ")}`;
    channel.send(textToSend).catch(console.error);
  }
};*/
