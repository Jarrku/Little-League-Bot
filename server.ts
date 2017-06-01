import { Client, TextChannel } from "discord.js";
import { Commander, Logger, RoleAssigner } from "./classes";

import * as dotenv from "dotenv";
dotenv.config();

const BOT_SECRET = process.env.NODE_ENV !== "production" ? process.env.BOT_SECRET_DEV : process.env.BOT_SECRET_PROD;

const config = {
  ownerID: "131418385610309633",
  prefix: "!",
  role_assignment: "role_assignment",
};

const client = new Client({
  disabledEvents: ["TYPING_START"],
});

const roleAssignment = new RoleAssigner();
const logger = new Logger();
const commander = new Commander();

client.on("error", (e) => console.error(e));

if (process.env.NODE_ENV !== "production") {
  client.on("warn", (e) => console.warn(e));
  client.on("debug", (e) => console.info(e));
}


client.on("message", (msg) => {
  const { content, channel } = msg;
  const { name } = (channel as TextChannel);
  const { role_assignment, prefix } = config;

  if (name === undefined) return;

  logger.log(msg);

  if (name === role_assignment) {
    if (content.startsWith("+!") || content.startsWith("-!")) roleAssignment.handleMessage(msg);
    if (content.startsWith(prefix)) commander.execute(msg);
  }
});

client.on("messageUpdate", (before, after) => logger.logEdit(before, after));
client.on("messageDelete", (msg) => logger.logDelete(msg));

client.login(BOT_SECRET);

process.on("SIGINT", () => {
  client.destroy();
  process.exit(0);
});
