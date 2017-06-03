import { Message, TextChannel } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import roles from "./roles";

export default class Rolelist extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "rolelist",
      group: "ll",
      memberName: "rolelist",
      description: "Displays all assignables roles",
      details: "Shows you an overview of all the roles you can assign with the \`!-\` and \`!+\` commands!",
    });
  }

  get formattedRoles() {
    return `
These all are the available roles, add and remove them with \`!+\` and \`!-\` (More info in the pinned message).
** __Rank__ **
${roles.rank.join(", ")}

** __Region__ **
${roles.region.join(", ")}

** __Access to flavour channels__ **
${roles.flavour.join(", ")}`;
  }

  hasPermission(): boolean {
    // required for everything -> default to return true
    return true;
  }
  async run(message: CommandMessage): Promise<Message | Message[]> {
    if (message.channel instanceof TextChannel) {
      await message.author.send(this.formattedRoles);
      return message.reply(`Sent you a DM with information.`);
    }

    return message.reply(this.formattedRoles);
  }
}
