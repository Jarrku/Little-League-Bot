import { GuildMember, Message, Role, TextChannel, User } from "discord.js";
import { Command, CommandMessage, CommandoClient } from "discord.js-commando";
import { fetchRank, servers } from "../Utils/RiotApi";
import { addRoles } from "../Utils/RoleMutations";

// TODO abstact role assing u
const roleAssignmentChannel = "role-assignment";
const wrongChannelError = "Role/verify commands only work in #role-assignment to keep the other chats clean, sorry!";

const toUpperCase = (value: string): string => value.toUpperCase();

export class VerifyRank extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "verify",
      group: "ll",
      memberName: "verify",
      description: `Verifies your Soloq rank to get the appriopiate tag on the server and \`Verified\` tag.`,
      details: `Make sure one of your runepages is named \`littleleague\`!\nAvailable regions are: ${Object.keys(servers).join(", ")}`,
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
    if ((message.channel as TextChannel).name !== roleAssignmentChannel)
      return message.author.send(wrongChannelError);

    const result = await fetchRank(server, username);
    // if string got returned = error -> return error msg
    const { guild, member } = message;

    if (typeof result === "string") return message.say(`:x:${member}, ${result}`);
    const { rank, tier } = result;

    let roleString = "";
    if (tier === "DIAMOND") {
      switch (rank) {
        case "I":
          roleString = "Diamond 1"; break;
        case "II":
          roleString = "Diamond 2"; break;
        case "III":
          roleString = "Diamond 3"; break;
        case "IV":
          roleString = "Diamond 4"; break;
        case "V":
          roleString = "Diamond 5"; break;
      }
    } else if (tier === "PLATINUM") {
      switch (rank) {
        case "I":
        case "II":
          roleString = "Platinum 1-2"; break;
        case "III":
        case "IV":
        case "V":
          roleString = "Platinum 3-5"; break;
      }
    } else {
      roleString = tier;
    }
    roleString += `, ${server}`;

    const rolechanges = addRoles(guild, member, roleString, true);
    if (typeof rolechanges === "string") return message.say("This shouldnt happen, please contact Jarrku");

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
