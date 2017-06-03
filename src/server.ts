import { TextChannel } from "discord.js";
import { Command, CommandoClient } from "discord.js-commando";
import * as path from "path";
import Chatlog from "./Chatlog";
import configureErrorLogging from "./ErrorLogger";

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

const logger = new Chatlog();

client
  .on("ready", () => client.user.setGame("!help in #role-assignment"))
  .on("message", logger.log)
  .on("messageUpdate", logger.edit)
  .on("messageDelete", logger.delete)
  /*.on("guildMemberAdd", (member) => {
    const welcomeText = "DO SMTHING ASWELL LAZY ASSES !! jk im good boi no punish";
    member.send(welcomeText);
  })*/;

client.registry
  .registerGroups([["ll", "Little League"], ["util", "Utilities"]])
  .registerDefaultTypes()
  .registerDefaultCommands({
    prefix: false,
    eval_: false,
    ping: false,
    commandState: false,
  })
  .registerCommandsIn(path.join(__dirname, "Commands"));

client.login(BOT_SECRET);

// close websocket before exiting process
process.on("SIGINT", () => {
  client.destroy();
  process.exit(0);
});
