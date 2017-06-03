import { Guild, GuildMember, Message, Role, TextChannel, User } from "discord.js";
import { Argument, Command, CommandMessage, CommandoClient } from "discord.js-commando";
import rolesData from "./roles";

const roleAssignmentChannel = "role-assignment";
const wrongChannelError = "Role commands only work in #role_assignment to keep the other chats clean, sorry!";
const roles = Object.values(rolesData).reduce((res, roleArray) => res.concat(roleArray), new Array<string>());

const getNeededVars = (message: CommandMessage, rolesToParse: string) => {
  const { guild, member, channel } = message;
  const rolesFound = resolveRoles(rolesToParse, guild);
  const memberRoles = Array.from(member.roles.values());
  return { rolesFound, memberRoles, member, channel };
};

const resolveRoles = (content: string, guild: Guild): Role[] => {
  const rolesToResolve = content.split(",").map((rawRole) => rawRole.trim().toLowerCase());
  return rolesToResolve.reduce((rolesFound, role) => {
    const roleToGet = roles.find((r) => r.toLowerCase() === role);
    if (roleToGet !== undefined) rolesFound.push(guild.roles.find((r) => r.name === roleToGet));
    return rolesFound;
  }, new Array<Role>());
};

export class AddRole extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "+",
      group: "ll",
      memberName: "addrole",
      description: "Adds given role(s) to a user",
      examples: ["!+ test, workout"],
      args: [
        {
          key: "rolesToParse",
          label: "roles",
          prompt: "Can't add emptiness :^) Respond with the roles you want orrrr",
          type: "string",
        },
      ],
      guildOnly: true,
    });
  }

  hasPermission(): string | boolean {
    return true;
  }

  async run(message: CommandMessage, { rolesToParse }: { rolesToParse: string }):
    Promise<Message | Message[]> {

    if ((message.channel as TextChannel).name !== roleAssignmentChannel)
      return message.author.send(wrongChannelError);

    const { rolesFound, memberRoles, member, channel } = getNeededVars(message, rolesToParse);

    const rolesToAdd = rolesFound.filter((r) => !memberRoles.some((memberRole) => memberRole.name === r.name));
    const addedRolesText = rolesToAdd.map((r) => r.name).join(" | ");

    const textToSend = addedRolesText.length !== 0 ?
      `role(s) added to you: \`${addedRolesText}\`` :
      `no rolechanges to you`;

    await member.addRoles(rolesToAdd).catch(console.error);
    return channel.send(textToSend);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class RemoveRole extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "-",
      group: "ll",
      memberName: "removerole",
      description: "Removes given role(s) to a user",
      examples: ["!- test, workout"],
      args: [
        {
          key: "rolesToParse",
          label: "roles",
          prompt: "Can't remove emptiness :^) Respond with the roles you want to remove orrrr",
          type: "string",
        },
      ],
      guildOnly: true,
    });
  }

  hasPermission(): string | boolean {
    return true;
  }

  async run(message: CommandMessage, { rolesToParse }: { rolesToParse: string }):
    Promise<Message | Message[]> {

    if ((message.channel as TextChannel).name !== roleAssignmentChannel)
      return message.author.send(wrongChannelError);

    const { rolesFound, memberRoles, member, channel } = getNeededVars(message, rolesToParse);

    const rolesToRemove = rolesFound.filter((r) => memberRoles.some((memberRole) => memberRole.name === r.name));
    const removedRolesText = rolesToRemove.map((r) => r.name).join(" | ");

    const textToSend = removedRolesText.length !== 0 ?
      `role(s) removed from you: \`${removedRolesText}\`` :
      `no rolechanges to you`;

    await member.removeRoles(rolesToRemove).catch(console.error);
    return message.reply(textToSend);
  }
}

/* more accurate parser that also returns not found roles
const resolveRoles = (content: string, guild: Guild): { rolesFound: Role[], rolesNotFound: string[] } => {
  const rolesToResolve = content.split(",").map((rawRole) => rawRole.trim().toLowerCase());
  return rolesToResolve.reduce((prev, role) => {
    const roleToGet = roles.find((r) => r.toLowerCase() === role);

    roleToGet === undefined ?
      prev.rolesNotFound.push(role) :
      prev.rolesFound.push(guild.roles.find((r) => r.name === roleToGet));

    return prev;
  }, { rolesFound: new Array<Role>(), rolesNotFound: new Array<string>() });
};*/
