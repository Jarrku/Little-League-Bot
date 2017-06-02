import { Client, Message, TextChannel } from "discord.js";
import { Commander, handleRoleAssignment, Logger } from "./Handlers";

import * as dotenv from "dotenv";
dotenv.config();

const BOT_SECRET = process.env.NODE_ENV !== "production" ? process.env.BOT_SECRET_DEV : process.env.BOT_SECRET_PROD;

const config = {
  ownerID: "131418385610309633",
  prefix: "!",
  role_assignment: "role-assignment",
};

const client = new Client({
  disabledEvents: ["TYPING_START"],
});

const logger = new Logger();
const commander = new Commander();

client.on("error", (e) => console.error(e));
if (process.env.NODE_ENV !== "production") {
  client.on("warn", (e) => console.warn(e));
  client.on("debug", (e) => console.info(e));
}

client.on("ready", () => {
  client.user.setGame("!help in #role-assignment");
});

client.on("message", (msg) => {
  // ignore DM and GroupDM for now;
  const { content, channel } = msg;
  if (channel instanceof TextChannel) {
    const { role_assignment, prefix } = config;
    logger.new(msg);
    if (content.startsWith(prefix)) commander.execute(msg);
    if (channel.name !== role_assignment) return;
    if (content.startsWith("+!") || content.startsWith("-!")) handleRoleAssignment(msg);
  }
});

client.on("messageUpdate", (before, after) => logger.edit(before, after));
client.on("messageDelete", (msg) => logger.delete(msg));

client.login(BOT_SECRET);

process.on("SIGINT", () => {
  client.destroy();
  process.exit(0);
});
