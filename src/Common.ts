import { Collection, Guild, GuildMember, Message, Role, TextChannel } from "discord.js";
import { CommandMessage } from "discord.js-commando";
import getConfig from "./config";

export const isAllowed = (roles: Collection<string, Role>, guildId: string): boolean => {
  const { staff } = getConfig(guildId);
  const memberRoles = Array.from(roles.values()).map((role: Role) => role.name.toLowerCase());
  return staff.some((staffRole) => memberRoles.includes(staffRole));
};
export const getModlogChannel = (guild: Guild) => {
  const { modlogChannel } = getConfig(guild.id);
  return (guild.channels.find((ch) => ch.name === modlogChannel) as TextChannel);
};

export const adminCheck = (message: CommandMessage, naughtyMember: GuildMember): Promise<Message> | undefined => {
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
  return;
};
