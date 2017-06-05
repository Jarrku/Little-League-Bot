import { DMChannel, GroupDMChannel, Guild, GuildChannel, GuildMember, Message, Role, TextChannel } from "discord.js";

import { chatlogChannel, excludedLogChannels } from "../config";

export default class Chatlog {
  log = async (msg: Message) => {
    const { createdTimestamp, cleanContent, channel, author, guild } = msg;

    if (this.isUntrackedChannel(channel)) return;

    const logChannel = this.getLogchannel(guild);
    const time = this.formatDate(createdTimestamp);

    const logMessage =
      `${time} UTC: \`SENT\` **${(channel as TextChannel).name}** ${author.username}: ${cleanContent}`;

    await logChannel.send(logMessage);
  }

  edit = async (before: Message, after: Message) => {
    const { cleanContent: beforeCleanContent } = before;
    const { createdTimestamp, author, cleanContent, guild, channel } = after;

    if (this.isUntrackedChannel(channel)) return;
    const logChannel = this.getLogchannel(guild);
    const time = this.formatDate(createdTimestamp);

    const logMessage = `${time} UTC: \`EDITED\` **${(channel as TextChannel).name}** ${author.username}:
    \t\`BEFORE:\` ${beforeCleanContent}
    \t\`AFTER:\` ${cleanContent}`;

    await logChannel.send(logMessage);
  }

  delete = async (msg: Message) => {
    const { createdTimestamp, author, cleanContent, guild, channel } = msg;

    if (this.isUntrackedChannel(channel)) return;
    const logChannel = this.getLogchannel(guild);
    const time = this.formatDate(createdTimestamp);

    const logMessage =
      `${time} UTC: \`DELETED\` **${(channel as TextChannel).name}** ${author.username}: ${cleanContent}`;

    await logChannel.send(logMessage);
  }

  private isUntrackedChannel = (channel: TextChannel | DMChannel | GroupDMChannel): boolean => {
    return channel instanceof TextChannel ? excludedLogChannels.findIndex((ch) => ch === channel.name) !== -1 : true;
  }

  private formatDate = (timestamp: number): string => {
    const timeString = new Date(timestamp).toISOString().replace(/T/, " ").replace(/\..+/, "");
    return timeString.slice(5, timeString.length - 3);
  }

  private getLogchannel = (guild: Guild): TextChannel => {
    return guild.channels.find((c) => c.name === chatlogChannel) as TextChannel;
  }
}
