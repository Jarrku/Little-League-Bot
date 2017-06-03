import { GuildMember, Message, Role, User } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import { fetchRank, servers } from "../Utils/RiotApi";

const validateServer = (value: string): boolean => Object.keys(servers).includes(value.toUpperCase());
const toUpperCase = (value: string): string => value.toUpperCase();

class VerifyRank extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "verify",
      group: "ll",
      memberName: "verify",
      description: "Verifies your Soloq rank to get the appriopiate tag on the server and \`Verified\` tag ",
      details: "",
      examples: ["!verify euw Jarrku", "!verify na Dyrus"],
      args: [
        {
          key: "server",
          label: "Server",
          prompt: "Need to provide a server to check on.",
          type: "string",
          validate: validateServer,
          parse: toUpperCase,
        },
        {
          key: "username",
          label: "Your summoner's name",
          prompt: "Without a username we cant really check anything :^)",
          type: "string",
        },
      ],
      guildOnly: true,
    });
  }

  async run(message: CommandMessage, { server, username }: { server: string, username: string }):
    Promise<Message | Message[]> {
    fetchRank(server, username);
    return message.reply("Wohoo");
  }

}
