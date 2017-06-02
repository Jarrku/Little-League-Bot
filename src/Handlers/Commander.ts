import { Guild, GuildMember, Message, Role, TextChannel } from "discord.js";
import roles from "./roles";

// help text (formatting roles imported from ./roles)
const formattedRoles = `
These all are the available roles, add and remove them with \`+!\` and \`-!\` (More info in the pinned message).
** __Rank__ **
${roles.rank.join(", ")}

** __Region__ **
${roles.region.join(", ")}

** __Access to flavour channels__ **
${roles.flavour.join(", ")}`;

interface ICommand {
  [index: string]: (msg: Message, args?: string[]) => void;
  execute(msg: Message): void;
}

// create 'dictionary' to save roles in
const cache = new Map<string, string[]>();

const timeoutHelper = (msg: Message, args?: string[]) => {
  // get author, server(guild) and channel of message
  const { member, guild, channel } = msg;
  // create array with roles of message author
  const memberRoles = Array.from(member.roles.values()).map((role: Role) => role.name.toLowerCase());

  // check if message author is allowed to use timeout with newly created array
  if (!(memberRoles.includes("admin") || memberRoles.includes("moderator"))) return;
  // check if arguments were given
  if (!args) return;

  // get target user from mention
  const mentionedUser = msg.mentions.members.first();
  if (mentionedUser) return mentionedUser;

  // get target user from name#discriminator
  const userToLookFor = args.join("");
  return guild.members.find((m) => `${m.user.username}#${m.user.discriminator}` === userToLookFor);
};

export default class Commander implements ICommand {
  [index: string]: (msg: Message, args?: string[]) => void;

  execute(msg: Message) {
    const [command, ...args] = msg.content.slice(1).split(" ");

    try {
      if (this[command]) this[command](msg, args);
    } catch (err) {
      console.error(err);
    }
  }

  private async help(msg: Message) {
    const { channel, author } = msg;
    // send dm to author
    author.send(formattedRoles);
    // send text to channel
    const text = `Check your private messages!`;
    await (channel as TextChannel).send(text);
  }

  private async timeout(msg: Message, args?: string[]) {
    const { channel, guild } = msg;
    // get target user via timoutHelper function
    const naughtyMember = timeoutHelper(msg, args);

    // check if target member exists
    if (!naughtyMember) {
      channel.send("Learn to type :^)");
      return;
    }

    // save current roles of target member in cache ('user.id':['role1',..,'rolen'])
    cache.set(naughtyMember.id, Array.from(naughtyMember.roles.keys()));
    // create new array for new roles
    const timeoutRole = new Array<string>();

    // add 'silenced' role to newly created array
    timeoutRole.push(guild.roles.find((role) => role.name.toLowerCase() === "silenced").id);

    // set target users' roles to newly created array and log in channel of command message
    await naughtyMember.setRoles(timeoutRole);
    channel.send(`${naughtyMember.displayName} has been timed out.`);
  }

  private async timein(msg: Message, args?: string[]) {
    const { channel, guild } = msg;
    const naughtyMember = timeoutHelper(msg, args);

    if (!naughtyMember) {
      channel.send("Learn to type :^)");
      return;
    }

    // get old target members' roles from cache
    const userRoles = cache.get(naughtyMember.id);

    // check if roles could be loaded
    if (!userRoles) {
      channel.send("Roles not in cache anymore, do it yourself haHAA");
      return;
    }
    // set target member's roles to previous roles
    naughtyMember.setRoles(userRoles);
  }
}
