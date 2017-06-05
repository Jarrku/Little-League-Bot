import { GuildMember, Message, Role, User } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import { staff, staffOnlyMsg, timeoutRoleName } from "../config";

// create 'dictionary' to save roles in
const cache = new Map<string, string[]>();

const isAllowed = ({ roles }: GuildMember): boolean => {
  const memberRoles = Array.from(roles.values()).map((role: Role) => role.name.toLowerCase());
  return staff.some((staffRole) => memberRoles.includes(staffRole));
};

export class Timeout extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "timeout",
      group: "ll",
      memberName: "timeout",
      description: "Removes all the roles of a given user and assigns \`silenced\` role.",
      examples: ["!timeout Jarrku#4768", "!timeout @Jarrku", "!timeout Jarrku"],
      args: [
        {
          key: "naughtyMember",
          label: "User to time out",
          prompt: "Can't time out nothing, silly :^)",
          type: "member",
        },
      ],
      guildOnly: true,
    });
  }

  hasPermission({ member }: CommandMessage): boolean | string {
    return isAllowed(member) ? true : staffOnlyMsg;
  }

  async run(message: CommandMessage, { naughtyMember }: { naughtyMember: GuildMember }):
    Promise<Message | Message[]> {
    const { guild, member, author } = message;

    if (this.client.isOwner(naughtyMember)) {
      return message.reply(`Do you think I'm going to timeout my master!? NEVER!!!`);
    }

    const naughtyMemberRoles = Array.from(naughtyMember.roles.values()).map((role: Role) => role.name.toLowerCase());
    if (naughtyMemberRoles.includes("admin")) {
      message.say(`Who do you think you are puny moderator`);
      return new Promise<Message>((resolve) => {
        setTimeout(() => {
          const noun = naughtyMember.user.username === "Trafficlights" ? "mommy" : "daddy";
          resolve(message.say(`${naughtyMember} someone tried to be sneaky ${noun} :^)`));
        }, 5000);
      });
    }
    // save current roles of target member in cache ('user.id':['role1',..,'rolen'])
    cache.set(naughtyMember.id, Array.from(naughtyMember.roles.keys()));
    // create new array for new roles and add 'silenced' role to newly created array
    const timeoutRole = new Array<string>();
    timeoutRole.push(guild.roles.find((role) => role.name.toLowerCase() === timeoutRoleName).id);

    // set target users' roles to newly created array and log in channel of command message
    await naughtyMember.setRoles(timeoutRole);
    return message.say(`${naughtyMember.displayName} has been timed out by ${member.displayName}`);
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
      description: "Readds all the roles of a given user and removes \`silenced\` role.",
      examples: ["!timein Jarrku#4768", "!timein @Jarrku", "!untimeout Jarrku"],
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
    return isAllowed(member) ? true : staffOnlyMsg;
  }
  async run(message: CommandMessage, { naughtyMember }: { naughtyMember: GuildMember }):
    Promise<Message | Message[]> {
    const { guild } = message;

    // get old target members' roles from cache
    const userRoles = cache.get(naughtyMember.id);

    // check if roles could be loaded
    if (!userRoles) return message.say("Roles not in cache anymore, do it yourself haHAA");

    // set target member's roles to previous roles
    await naughtyMember.setRoles(userRoles);
    return message.say(`Timing in: ${naughtyMember.displayName}`);
  }
}
