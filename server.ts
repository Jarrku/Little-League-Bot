import { Client, Guild, Message, Role, TextChannel } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();
const client = new Client({
  disabledEvents: ["TYPING_START"],
});

process.on("SIGINT", () => {
  client.destroy();
  process.exit(0);
});

const BOT_SECRET = process.env.NODE_ENV !== "production" ? process.env.BOT_SECRET_DEV : process.env.BOT_SECRET_PROD;

const CHANNELS = {
  CHATLOG: "talk_log_pogpog",
  ROLE_ASSIGNMENT: "role_assignment",
};

const roles = ["silenced", "NA", "EUW", "Challenger", "Master", "Diamond 1", "Diamond 2", "Diamond 3",
  "Diamond 4", "Diamond 5", "Platinum 1- 2", "Platinum 3- 5", "Gold", "Silver", "Bronze",
  "Custom Games", "CSGO", "Overwatch", "OSRS", "Minecraft", "Hearthstone", "HOTS", "PUBG",
  "Workout", "Sports", "test"];

const rolesMap = roles.reduce((prev, curr: string) => prev.set(curr.toLowerCase(), curr), new Map<string, string>());

const handleRoleAssignment = async (message: Message) => {
  const { channel, member: { displayName }, member, content, guild } = message;
  const { rolesFound, rolesNotFound } = roleResolver(content, guild);

  if (content.startsWith("+!")) {
    const addedRolesText = rolesFound.map((r) => r.name).join(" | ");
    const textToSend = addedRolesText.length !== 0 ?
      `Role(s) added to ${displayName}: \`${addedRolesText}\`` :
      `No rolechanges to ${displayName}`;

    // const rolesNotFoundText = rolesNotFound.join(" | ");
    /*
    if (addedRolesText.length !== 0) {
      textToSend += `Roles added to ${displayName}: \`${addedRolesText}\``;

      if (rolesNotFoundText.length !== 0) {
        textToSend += "\n";
      }
    }
    if (rolesNotFoundText.length !== 0) {
      textToSend += `Roles that weren't found: \`${rolesNotFoundText}\``;
    }*/

    member.addRoles(rolesFound).catch(console.error);
    channel.send(textToSend).catch(console.error);

  } else {
    const memberRoles = Array.from(member.roles.values());

    const rolesToRemove = rolesFound.filter((r) => memberRoles.some((memberRole) => memberRole.name === r.name));
    const removedRolesText = rolesToRemove.map((r) => r.name).join(" | ");

    const textToSend = removedRolesText.length !== 0 ?
      `Role(s) removed from ${displayName}: \`${removedRolesText}\`` :
      `No rolechanges to ${displayName}`;

    member.removeRoles(rolesToRemove).catch(console.error);
    channel.send(textToSend).catch(console.error);
  }
};

const handleCommand = (message: Message) => {
  const { content, channel } = message;
  const command = content.slice(1).trim().toLowerCase();

  COMMANDS[command] ? COMMANDS[command](message) : COMMANDS.default(message);


  if (command === "help") {
    const textToSend = `Check pin for help. Also here is a list of assignable roles: ${roles.join(", ")}`;
    channel.send(textToSend).catch(console.error);
  }
};



class Commands {
  private _msg: Message;
  constructor(msg: Message) {
    this._msg = msg;
  }

  help() {
    this._msg.attachments.clear();
  }
}

const COMMANDS: { [index: string]: (msg: Message) => void } = {
  help: handleCommand,
  default: returnError
}

client.on("message", (msg) => {
  const { content, channel } = msg;
  const { name } = (channel as TextChannel);
  const { CHATLOG, ROLE_ASSIGNMENT } = CHANNELS;

  if (name !== undefined) {
    if (name !== CHATLOG) {
      handleChatlog(msg);
    }

    if (name === ROLE_ASSIGNMENT) {
      if (content.startsWith("+!") || content.startsWith("-!")) {
        handleRoleAssignment(msg);
      }

      if (content.startsWith("!")) {

        handleCommand(msg);
      }
    }
  }
});

client.login(BOT_SECRET);

const roleResolver = (content: string, guild: Guild) => {
  const rolesToResolve = content.slice(2).split(",").map((rawRole) => rawRole.trim().toLowerCase());

  return rolesToResolve.reduce((prev, role) => {
    const roleToGet = rolesMap.get(role);
    if (roleToGet === undefined) {
      prev.rolesNotFound.push(role);
    } else {
      const roleOnServer = guild.roles.find((r) => r.name === roleToGet);
      prev.rolesFound.push(roleOnServer);
    }

    return prev;
  }, { rolesFound: new Array<Role>(), rolesNotFound: new Array<string>() });
};
