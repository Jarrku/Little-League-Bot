// add and remove, gives back toremove and toadd roles, to be called respectively
// Receives string of roles to add/remove ?
import { Guild, GuildMember, Message, Role, TextChannel, User } from "discord.js";
import rolesData from "./roles";

export const roles = Object.values(rolesData).reduce((res, roleArray) => res.concat(roleArray), new Array<string>());

const verifiedName = "Verified";

interface RoleRemove {
  toRemove: Role[];
}

interface RoleAdd extends RoleRemove {
  toAdd: Role[];
}

export const addRoles = (guild: Guild, member: GuildMember, rolesToParse: string, verified = false): RoleAdd | string => {
  const parsedRoles = roleParser(rolesToParse);
  if (!rankedRolesCheck(parsedRoles)) return "More than one ranked roles specified, only one is allowed!";
  const rolesFound = resolveRoles(parsedRoles, guild);
  const memberRoles = Array.from(member.roles.values());

  const rolesToAdd = rolesFound.filter((r) => !memberRoles.some((memberRole) => memberRole.id === r.id));

  const toRemove = new Array<Role>();
  const newRankRole = rolesToAdd.find(rankRoleFinder);
  if (newRankRole) {
    const oldRankRole = memberRoles.filter(rankRoleFinder);
    if (oldRankRole) toRemove.push(...oldRankRole);
    const oldVerified = memberRoles.find((r) => r.name === verifiedName);
    if (oldVerified) toRemove.push(oldVerified);
  }
  const toAdd = rolesToAdd;
  if (verified) toAdd.push(getVerified(guild));

  return { toAdd, toRemove };
  /** Flow Add
   * (Parse rolestring and check for rank duplicates to throw error?)
   * rolestoAdd: Resolve rolestring to Actual available roles Role[];
   * memberRoles: Parse member roles to Role[]
   * Filter RolesToAdd for duplicates - DONE
   * Check if rolesToAdd contains rank role
   *    true -> check if memberRoles contain rank role -> add rankRole to remove
   *            check if memberRoles contains verified -> add verified to remove
   *    false -> nothing
   * if verified = true add verified role to toAdd
   * send back { toAdd, toRemove }
   */
};

export const removeRoles = (guild: Guild, member: GuildMember, rolesToParse: string): RoleRemove => {
  const parsedRoles = roleParser(rolesToParse);
  const rolesFound = resolveRoles(parsedRoles, guild);
  const memberRoles = Array.from(member.roles.values());

  const toRemove = rolesFound.filter((r) => memberRoles.some((memberRole) => memberRole.id === r.id));
  const rankRoleRemove = toRemove.find(rankRoleFinder);
  if (rankRoleRemove) {
    const oldVerified = memberRoles.find((r) => r.name === verifiedName);
    if (oldVerified) toRemove.push(oldVerified);
  }

  return { toRemove };
  /** Flow Remve
   * Parse rolestring
   * rolestorem: Resolve to actual roles + add Verified Role to list
   * memberRoles: Parse member roles to Role[]
   * Filter RolesToRemove
   * send back { toRemove}
   */
};

const rankRoleFinder = (r: Role) => rolesData.rank.includes(r.name);

const resolveRoles = (rolesToFind: string[], guild: Guild): Role[] => {
  return rolesToFind.reduce((rolesFound, role) => {
    const roleToGet = roles.find((r) => r.toLowerCase() === role);
    if (roleToGet !== undefined) rolesFound.push(guild.roles.find((r) => r.name === roleToGet));
    return rolesFound;
  }, new Array<Role>());
};
// Parser string to string array and filters duplicates
const roleParser = (rolesToParse: string) => {
  const parsedRoles = rolesToParse.split(",").map((rawRole) => rawRole.trim().toLowerCase());
  const seen: { [index: string]: boolean } = {};
  return parsedRoles.filter((item) => seen.hasOwnProperty(item) ? false : (seen[item] = true));
};

const lowerRankRoles = rolesData.rank.map((r) => r.toLowerCase());
const rankedRolesCheck = (rolesArray: string[]): boolean => {
  let numberOfRankedRoles = 0;
  rolesArray.forEach((r) => {
    // Once 2 have been found skip through rest of the array;
    if (numberOfRankedRoles === 2) return;
    // Increase numberOfRankedRoles if its included in ranked list.
    if (lowerRankRoles.includes(r)) numberOfRankedRoles++;
  });

  return numberOfRankedRoles < 2;
};

const getVerified = ({ roles: guildroles }: Guild) => {
  return guildroles.find((r) => r.name === verifiedName);
};
