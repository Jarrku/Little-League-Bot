import { Guild, GuildMember, Message, Role, TextChannel, User } from "discord.js";
import { Argument, Command, CommandMessage, CommandoClient } from "discord.js-commando";
import getConfig from "../config";
import { addRoles, removeRoles } from "../Utils/RoleMutations";

const noRoleChangeText = "no rolechanges to you.";

export class AddRole extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "+",
      group: "common",
      aliases: ["add"],
      memberName: "addrole",
      description: "Adds given role(s) to a user, NOTE THE SPACE AFTER + :)",
      details: "Space after + has to be added, afterwards you're just limited to separating the roles with \`,\`. Spaces and casing don't matter.",
      examples: ["!+ NLFG, Gold"],
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

  async run(message: CommandMessage, { rolesToParse }: { rolesToParse: string }):
    Promise<Message | Message[]> {
    const { roleAssignmentChannel, notInRoleAssignmentError } = getConfig(message.guild.id);
    if ((message.channel as TextChannel).name !== roleAssignmentChannel)
      return message.author.send(notInRoleAssignmentError);

    const { guild, member } = message;
    const response = addRoles(guild, member, rolesToParse);

    if (typeof response === "string") return message.reply(response);
    const { toAdd, toRemove } = response;

    const addedRolesText = toAdd.map((r) => r.name).join(" | ");
    const removedRolesText = toRemove.map((r) => r.name).join(" | ");

    if (addedRolesText.length !== 0 && removedRolesText.length !== 0) {
      const textToSend = `role(s) added to you: \`${addedRolesText}\`\nRole(s) removed from you: \`${removedRolesText}\``;

      const memberRoles = Array.from(member.roles.values());
      const resultingRoles = memberRoles.filter((memberR) => !toRemove.includes(memberR)).concat(toAdd);

      await member.setRoles(resultingRoles).catch(console.error);
      return message.reply(textToSend);

    } else {
      const textToSend = addedRolesText.length !== 0 ?
        `role(s) added to you: \`${addedRolesText}\`` : noRoleChangeText;
      await member.addRoles(toAdd).catch(console.error);
      return message.reply(textToSend);
    }
  }
}

// tslint:disable-next-line:max-classes-per-file
export class RemoveRole extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "-",
      group: "common",
      aliases: ["rm", "remove"],
      memberName: "removerole",
      description: "Removes given role(s) to a user, NOTE THE SPACE AFTER - :)",
      details: "Space after - has to be added, afterwards you're just limited to separating the roles with \`,\`. Spaces and casing don't matter",
      examples: ["!- NPVS, Gold"],
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

  async run(message: CommandMessage, { rolesToParse }: { rolesToParse: string }):
    Promise<Message | Message[]> {
    const { roleAssignmentChannel, notInRoleAssignmentError } = getConfig(message.guild.id);

    if ((message.channel as TextChannel).name !== roleAssignmentChannel)
      return message.author.send(notInRoleAssignmentError);

    const { guild, member } = message;
    const response = removeRoles(guild, member, rolesToParse);

    if (typeof response === "string") return message.reply(response);
    const { toRemove } = response;
    const removedRolesText = toRemove.map((r) => r.name).join(" | ");

    const textToSend = removedRolesText.length !== 0 ?
      `role(s) removed from you: \`${removedRolesText}\`` : noRoleChangeText;

    await member.removeRoles(toRemove).catch(console.error);
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
