import { GuildMember, Message } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import { adminCheck, getModlogChannel, isAllowed } from "../Common";
import { staffOnlyMsg } from "../config";
import Case from "../Utils/Case";

export class Ban extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "ban",
      group: "ll-mod",
      memberName: "ban",
      description: "Bans a given user from the server.",
      examples: ["!ban Jarrku#4768 <reason>", "!ban @Jarrku <reason>", "!ban Jarrku <reason>"],
      args: [
        {
          key: "naughtyMember",
          label: "User to ban",
          prompt: "Can't ban nothing, silly :^)",
          type: "member",
        },
        {
          key: "reason",
          label: "Reason of the ban",
          prompt: "What's the reason of the ban??",
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
      return message.say(`Do you think I'm going to ban my master!? NEVER!!!`);
    }

    const checkResult = adminCheck(message, naughtyMember);
    if (checkResult) return checkResult;

    const report = new Case("BAN", naughtyMember, member, createdAt, reason).createReport();
    await getModlogChannel(guild).send({ embed: report });

    await guild.ban(naughtyMember, { days: 2, reason });

    const reply = message.say(`${naughtyMember.displayName} has been banned by ${member.displayName}.`);
    reply.then((postedMessage: Message) => setTimeout(() => postedMessage.delete(), 5000));

    return reply;
  }
}

// tslint:disable-next-line:max-classes-per-file
export class Permaban extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "permaban",
      group: "ll-mod",
      aliases: ["perma"],
      memberName: "permaban",
      description: "Permabans a given user from the server and deletes their messages from the last 48 hours.",
      examples: ["!permaban Jarrku#4768 <reason>", "!perma @Jarrku <reason>", "!perma Jarrku <reason>"],
      args: [
        {
          key: "naughtyMember",
          label: "User to permaban",
          prompt: "Can't permaban nothing, silly :^)",
          type: "member",
        },
        {
          key: "reason",
          label: "Reason of the permaban",
          prompt: "What's the reason of the permaban?",
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
      return message.say(`Do you think I'm going to permaban my master!? NEVER!!!`);
    }

    const checkResult = adminCheck(message, naughtyMember);
    if (checkResult) return checkResult;

    const report = new Case("PERMABAN", naughtyMember, member, createdAt, reason).createReport();
    const modLogChannel = getModlogChannel(guild);
    await modLogChannel.send({ embed: report });

    await guild.ban(naughtyMember, { days: 2, reason });

    const reply = message.say(`${naughtyMember.displayName} has been permabanned by ${member.displayName}.`);
    reply.then((postedMessage: Message) => setTimeout(() => postedMessage.delete(), 5000));

    return reply;
  }
}
