import { GuildMember, Message } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import { adminCheck, getModlogChannel, isAllowed } from "../Common";
import { staffOnlyMsg } from "../config";
import Case from "../Utils/Case";

export class Warning extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "warn",
      group: "ll-mod",
      memberName: "warn",
      description: "warns a user in mod-logs.",
      examples: ["!warn Jarrku#4768 <reason>", "!warn @Jarrku <reason>", "!warn Jarrku <reason>"],
      args: [
        {
          key: "naughtyMember",
          label: "User to warn",
          prompt: "Can't warn nothing, silly :^)",
          type: "member",
        },
        {
          key: "reason",
          label: "The actual warning",
          prompt: "What's the warning about?",
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
      return message.reply(`Do you think I'm going to GIVE A WARNING to my master!? NEVER!!!`);
    }

    const checkResult = adminCheck(message, naughtyMember);
    if (checkResult) return checkResult;

    const report = new Case("WARNING", naughtyMember, member, createdAt, reason).createReport();
    await getModlogChannel(guild).send({ embed: report });

    const reply = message.say(`${naughtyMember.displayName} has been warned by ${member.displayName}.`);
    reply.then((postedMessage: Message) => setTimeout(() => postedMessage.delete(), 5000));

    return reply;
  }
}
