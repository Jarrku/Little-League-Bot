import { Guild, GuildMember, Message, Role, TextChannel } from "discord.js";
import roles from "./roles";

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

const cache = new Map<string, string[]>();

const timeoutHelper = (msg: Message, args?: string[]) => {
  const { member, guild, channel } = msg;
  const memberRoles =
    Array.from(member.roles.values()).map((role: Role) => role.name.toLowerCase());

  if (!(memberRoles.includes("admin") || memberRoles.includes("moderator"))) return;
  if (!args) return;

  const mentionedUser = msg.mentions.members.first();
  if (mentionedUser) return mentionedUser;

  const userToLookFor = args.join("");
  return guild.members.find((m) => `${m.user.tag}` === userToLookFor);
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
    author.send(formattedRoles);
    const text = `Check your private messages!`;
    await (channel as TextChannel).send(text);
  }

  private async timeout(msg: Message, args?: string[]) {
    const { channel, guild } = msg;
    const naughtyMember = timeoutHelper(msg, args);

    if (!naughtyMember) {
      channel.send("Learn to type :^)");
      return;
    }

    cache.set(naughtyMember.id, Array.from(naughtyMember.roles.keys()));
    const timeoutRole = new Array<string>();

    timeoutRole.push(guild.roles.find((role) => role.name.toLowerCase() === "silenced").id);

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

    const userRoles = cache.get(naughtyMember.id);

    if (!userRoles) {
      channel.send("Roles not in cache anymore, do it yourself haHAA");
      return;
    }
    naughtyMember.setRoles(userRoles);
  }
}
