import { Guild, Message, Role, TextChannel } from "discord.js";

export default class RoleAssigner {

  readonly roles = ["silenced", "NA", "EUW", "Challenger", "Master", "Diamond 1", "Diamond 2", "Diamond 3",
    "Diamond 4", "Diamond 5", "Platinum 1-2", "Platinum 3-5", "Gold", "Silver", "Bronze",
    "Custom Games", "CSGO", "Overwatch", "OSRS", "Minecraft", "Hearthstone", "HOTS", "PUBG",
    "Workout", "Sports", "test"];
  private rolesLower = this.roles.reduce((prev, curr: string) => prev.set(curr.toLowerCase(), curr),
    new Map<string, string>());

  async handleMessage(msg: Message) {
    const { channel, member: { displayName }, member, content, guild } = msg;
    const { rolesFound, rolesNotFound } = this.resolveRoles(content, guild);

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
  }

  private resolveRoles(content: string, guild: Guild): { rolesFound: Role[], rolesNotFound: string[] } {
    const rolesToResolve = content.slice(2).split(",").map((rawRole) => rawRole.trim().toLowerCase());

    return rolesToResolve.reduce((prev, role) => {
      const roleToGet = this.rolesLower.get(role);

      roleToGet === undefined ?
        prev.rolesNotFound.push(role) :
        prev.rolesFound.push(guild.roles.find((r) => r.name === roleToGet));

      return prev;
    }, { rolesFound: new Array<Role>(), rolesNotFound: new Array<string>() });
  }
}
