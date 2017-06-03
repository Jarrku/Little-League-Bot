import { GuildMember, Message, Role, User } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";

// create 'dictionary' to save roles in
const cache = new Map<string, string[]>();

const isAllowed = ({ roles }: GuildMember): boolean => {
  const memberRoles = Array.from(roles.values()).map((role: Role) => role.name.toLowerCase());
  return memberRoles.includes("admin") || memberRoles.includes("moderator");
};

export class Timeout extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "timeout",
      group: "ll",
      memberName: "timeout",
      description: "Removes all the roles of a given user and assigns silenced role.",
      examples: ["!timeout Jarrku#4768", "!timeout @Jarrku", "!timeout Jarrku"],
      args: [
        {
          key: "naughtyMember",
          label: "User to time out",
          prompt: "Can't time out emptiness :^)",
          type: "member",
        },
      ],
      guildOnly: true,
    });
  }

  hasPermission({ member }: CommandMessage): boolean | string {
    return isAllowed(member) ? true : "dis not for u bitch";
  }

  async run(message: CommandMessage, { naughtyMember }: { naughtyMember: GuildMember }):
    Promise<Message | Message[]> {
    const { channel, guild, member, author } = message;

    if (this.client.isOwner(naughtyMember)) {
      return message.reply(`Do you think I'm going to timeout my master!? NEVER!!!`);
    }

    const naughtyMemberRoles = Array.from(naughtyMember.roles.values()).map((role: Role) => role.name.toLowerCase());
    if (naughtyMemberRoles.includes("admin")) {
      channel.send(`Who do you think you are puny moderator`);
      return new Promise<Message>((resolve) => {
        setTimeout(() => {
          const noun = naughtyMember.user.username === "Trafficlights" ? "mommy" : "daddy";
          resolve(channel.send(`${naughtyMember} someone tried to be sneaky ${noun} :^)`));
        }, 5000);
      });
    }
    // save current roles of target member in cache ('user.id':['role1',..,'rolen'])
    cache.set(naughtyMember.id, Array.from(naughtyMember.roles.keys()));
    // create new array for new roles and add 'silenced' role to newly created array
    const timeoutRole = new Array<string>();
    timeoutRole.push(guild.roles.find((role) => role.name.toLowerCase() === "silenced").id);

    // set target users' roles to newly created array and log in channel of command message
    await naughtyMember.setRoles(timeoutRole);
    return channel.send(`${naughtyMember.displayName} has been timed out by ${member.displayName}`);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class Timein extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "timein",
      group: "ll",
      aliases: ["untimeout"],
      memberName: "timein",
      description: "Removes all the roles of a given user and assigns silenced role.",
      examples: ["!timein Jarrku#4768", "!timein @Jarrku", "!untimeout Jarrku"],
      args: [
        {
          key: "naughtyMember",
          label: "User to time in",
          prompt: "Can't time in emptiness :^)",
          type: "member",
        },
      ],
      guildOnly: true,
    });
  }

  hasPermission({ member }: CommandMessage): boolean | string {
    return isAllowed(member) ? true : "dis not for u bitch";
  }
  async run(message: CommandMessage, { naughtyMember }: { naughtyMember: GuildMember }):
    Promise<Message | Message[]> {
    const { channel, guild } = message;

    // get old target members' roles from cache
    const userRoles = cache.get(naughtyMember.id);

    // check if roles could be loaded
    if (!userRoles) return channel.send("Roles not in cache anymore, do it yourself haHAA");

    // set target member's roles to previous roles
    await naughtyMember.setRoles(userRoles);
    return channel.send(`Timing in: ${naughtyMember.displayName}`);
  }
}
