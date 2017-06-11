import { GuildMember, Message } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import { adminCheck, getModlogChannel, isAllowed } from "../Common";
import { staffOnlyMsg, timeoutRoleName } from "../config";
import Case from "../Utils/Case";

// create 'dictionary' to save roles in
const cache = new Map<string, string[]>();

export class Timeout extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "timeout",
      group: "ll-mod",
      memberName: "timeout",
      description: "Removes all the roles of a given user and assigns \`silenced\` role.",
      examples: ["!timeout Jarrku#4768 <reason>", "!timeout @Jarrku <reason>", "!timeout Jarrku <reason>"],
      args: [
        {
          key: "naughtyMember",
          label: "User to time out",
          prompt: "Can't time out nothing, silly :^)",
          type: "member",
        },
        {
          key: "reason",
          label: "Reason of the timeout",
          prompt: "What's the reason for the time out?",
          type: "string",
        },
      ],
      guildOnly: true,
    });
  }

  hasPermission({ member }: CommandMessage): boolean | string {
    return isAllowed(member.roles) ? true : staffOnlyMsg;
  }

  async run(message: CommandMessage, { naughtyMember, reason }: { naughtyMember: GuildMember, reason: string }):
    Promise<Message | Message[]> {
    const { guild, member, createdAt } = message;

    if (this.client.isOwner(naughtyMember)) {
      return message.say(`Do you think I'm going to timeout my master!? NEVER!!!`);
    }

    const checkResult = adminCheck(message, naughtyMember);
    if (checkResult) return checkResult;

    const report = new Case("TIMEOUT", naughtyMember, member, createdAt, reason).createReport();
    const modLogChannel = getModlogChannel(guild);
    modLogChannel.send({ embed: report });

    // save current roles of target member in cache ('user.id':['role1',..,'rolen'])
    cache.set(naughtyMember.id, Array.from(naughtyMember.roles.keys()));
    // create new array for new roles and add 'silenced' role to newly created array
    const timeoutRole = new Array<string>();
    timeoutRole.push(guild.roles.find((role) => role.name.toLowerCase() === timeoutRoleName).id);

    // set target users' roles to newly created array and log in channel of command message
    await naughtyMember.setRoles(timeoutRole);

    const reply = message.say(`${naughtyMember.displayName} has been timed out by ${member.displayName}.`);
    reply.then((postedMessage: Message) => setTimeout(() => postedMessage.delete(), 5000));

    return reply;
  }
}

// tslint:disable-next-line:max-classes-per-file
export class Timein extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "timein",
      group: "ll-mod",
      aliases: ["untimeout"],
      memberName: "timein",
      description: "Readds all the roles of a given user and removes \`silenced\` role.",
      examples: ["!timein Jarrku#4768", "!untimeout @Jarrku", "!timein Jarrku"],
      args: [
        {
          key: "naughtyMember",
          label: "User to time in",
          prompt: "Can't time in nothing, silly :^)",
          type: "member",
        },
      ],
      guildOnly: true,
    });
  }

  hasPermission({ member }: CommandMessage): boolean | string {
    return isAllowed(member.roles) ? true : staffOnlyMsg;
  }
  async run(message: CommandMessage, { naughtyMember }: { naughtyMember: GuildMember }):
    Promise<Message | Message[]> {
    const { guild, member, createdAt } = message;

    const report = new Case("TIMEIN", naughtyMember, member, createdAt).createReport();
    const modLogChannel = getModlogChannel(guild);
    modLogChannel.send({ embed: report });
    // get old target members' roles from cache
    const userRoles = cache.get(naughtyMember.id);

    // check if roles could be loaded
    if (!userRoles) return message.say("Roles not in cache anymore, do it yourself haHAA");
    // set target member's roles to previous roles
    await naughtyMember.setRoles(userRoles);

    const reply = message.say(`Timing in: ${naughtyMember.displayName}`);
    reply.then((postedMessage: Message) => setTimeout(() => postedMessage.delete(), 5000));

    return reply;
  }
}
