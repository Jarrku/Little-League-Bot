import { Guild, Message, Role, TextChannel } from "discord.js";
import rolesData from "./roles";

const roles = Object.values(rolesData).reduce((res, roleArray) => res.concat(roleArray), new Array<string>());
const rolesLower = roles.reduce((prev, curr: string) => prev.set(curr.toLowerCase(), curr),
  new Map<string, string>());

const resolveRoles = (content: string, guild: Guild): { rolesFound: Role[], rolesNotFound: string[] } => {
  const rolesToResolve = content.slice(2).split(",").map((rawRole) => rawRole.trim().toLowerCase());
  return rolesToResolve.reduce((prev, role) => {
    const roleToGet = rolesLower.get(role);

    roleToGet === undefined ?
      prev.rolesNotFound.push(role) :
      prev.rolesFound.push(guild.roles.find((r) => r.name === roleToGet));

    return prev;
  }, { rolesFound: new Array<Role>(), rolesNotFound: new Array<string>() });
};

const handleRoleAssignment = (msg: Message) => {
  const { channel, member: { displayName }, member, content, guild } = msg;
  const { rolesFound, rolesNotFound } = resolveRoles(content, guild);

  const memberRoles = Array.from(member.roles.values());

  let textToSend = "";

  if (content.startsWith("+!")) {
    const rolesToAdd = rolesFound.filter((r) => !memberRoles.some((memberRole) => memberRole.name === r.name));
    const addedRolesText = rolesToAdd.map((r) => r.name).join(" | ");

    textToSend = addedRolesText.length !== 0 ?
      `Role(s) added to ${displayName}: \`${addedRolesText}\`` :
      `No rolechanges to ${displayName}`;

    member.addRoles(rolesToAdd).catch(console.error);
  } else {
    const rolesToRemove = rolesFound.filter((r) => memberRoles.some((memberRole) => memberRole.name === r.name));
    const removedRolesText = rolesToRemove.map((r) => r.name).join(" | ");

    textToSend = removedRolesText.length !== 0 ?
      `Role(s) removed from ${displayName}: \`${removedRolesText}\`` :
      `No rolechanges to ${displayName}`;

    member.removeRoles(rolesToRemove).catch(console.error);
  }

  channel.send(textToSend).catch(console.error);
};

export default handleRoleAssignment;
