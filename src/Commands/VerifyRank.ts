import { GuildMember, Message, Role, TextChannel, User } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import getConfig from "../config";
import { fetchRank, servers } from "../Utils/RiotApi";
import { addRoles } from "../Utils/RoleMutations";

// runepage to check on;
const runepageName = "checkmyrank";

const toUpperCase = (value: string): string => value.toUpperCase();

export class VerifyRank extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "verify",
      group: "common",
      memberName: "verify",
      description: `Verifies your Soloq rank to get the appropriate tag on the server and \`Verified\` tag.`,
      details: `Make sure one of your runepages is named \`${runepageName}\`!\nAvailable regions are: ${Object.keys(servers).join(", ")}`,
      examples: ["!verify euw Jarrku", "!verify na Dyrus"],
      args: [
        {
          key: "server",
          label: "Server",
          prompt: "Need to provide a server to check on.",
          type: "string",
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

    const { channel, guild, author, member } = message;
    const { roleAssignmentChannel, notInRoleAssignmentError } = getConfig(guild.id);

    if ((channel as TextChannel).name !== roleAssignmentChannel)
      return author.send(notInRoleAssignmentError);

    const result = await fetchRank(server, username, runepageName);

    // if string got returned = error -> return error msg
    if (typeof result === "string") return message.say(`:x:${member}, ${result}`);
    const { rank, tier } = result;

    const { getRolestring } = getConfig(guild.id);
    const roleString = getRolestring(tier, server, rank);

    const rolechanges = addRoles(guild, member, roleString, true);
    if (typeof rolechanges === "string") return message.say(`This shouldnt happen :(, MASTERRRRR ${this.client.owners[0]}`);

    const { toAdd, toRemove } = rolechanges;

    if (toRemove.length !== 0) {
      const memberRoles = Array.from(member.roles.values());
      const resultingRoles = memberRoles.filter((memberR) => !toRemove.includes(memberR)).concat(toAdd);
      await member.setRoles(resultingRoles).catch(console.error);
    } else {
      await member.addRoles(toAdd).catch(console.error);
    }

    return message.say(`:white_check_mark: ${member}, you have been succesfully verified!`);
  }
}
