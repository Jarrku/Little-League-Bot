import { Message, TextChannel } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";

export default class Rolelist extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "apoligy",
      group: "ll",
      memberName: "apoligy",
      description: "Send apoligy",
    });
  }

  hasPermission({ author }: CommandMessage): boolean | string {
    return this.client.isOwner(author);
  }

  async run(message: CommandMessage): Promise<Message | Message[] | undefined> {
    const { channel, guild } = message;
    const generalChat = guild.channels.get("314417120568147968");
    if (!generalChat) return;

    if (generalChat instanceof TextChannel) {
      return generalChat.send("My master is sorry about being a naughty boy, can you give him a second chance? :c ");
    }
    return;
  }
}
