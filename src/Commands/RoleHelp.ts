import { Message, TextChannel } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import getConfig from "../config";

export default class Rolelist extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "rolelist",
      group: "common",
      memberName: "rolelist",
      description: "Displays all assignables roles",
      details: "Shows you an overview of all the roles you can assign with the \`!-\` and \`!+\` commands!",
      guildOnly: true,
    });
  }

  async run(message: CommandMessage): Promise<Message | Message[]> {
    const { rolehelpText } = getConfig(message.guild.id);

    if (message.channel instanceof TextChannel) {
      await message.author.send(rolehelpText);
      return message.reply(`Sent you a DM with information.`);
    }
    return message.reply(rolehelpText);
  }
}
