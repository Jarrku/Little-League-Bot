import { TextChannel } from "discord.js";
import { Command, CommandoClient } from "discord.js-commando";
import * as path from "path";
import configureErrorLogging from "./ErrorLogger";
import { Commander, handleRoleAssignment, Logger } from "./Handlers";

import * as dotenv from "dotenv";
dotenv.config();

const BOT_SECRET = process.env.NODE_ENV !== "production" ? process.env.BOT_SECRET_DEV : process.env.BOT_SECRET_PROD;

const config = {
  role_assignment: "role-assignment",
};

const client = new CommandoClient({
  disabledEvents: ["TYPING_START"],
  commandPrefix: "!",
  unknownCommandResponse: false,
  owner: "131418385610309633",
});

configureErrorLogging(client);

const logger = new Logger();
const commander = new Commander();

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

client.on("messageUpdate", logger.edit);
client.on("messageDelete", logger.delete);

client.login(BOT_SECRET);

// close websocket before exiting process
process.on("SIGINT", () => {
  client.destroy();
  process.exit(0);
});
