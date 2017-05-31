import { Guild, GuildChannel, GuildMember, Message, Role, TextChannel } from "discord.js";

export default class Logger {
  readonly chatlogChannel = "talk_log_pogpog";

  async log(msg: Message) {
    const { createdTimestamp, cleanContent, channel, author, guild } = msg;

    const logChannel = this.getLogchannel(guild);
    const time = this.formatDate(createdTimestamp);

    const logMessage =
      `${time} UTC: \`SENT\` **${(channel as TextChannel).name}** ${author.username}: ${cleanContent}`;

    await (logChannel as TextChannel).send(logMessage);
  }

  async logEdit(before: Message, after: Message) {
    const { cleanContent: beforeCleanContent } = before;
    const { createdTimestamp, author, cleanContent, guild, channel } = after;

    const logChannel = this.getLogchannel(guild);
    const time = this.formatDate(createdTimestamp);

    const logMessage = `${time} UTC: \`EDITED\` **${(channel as TextChannel).name}** ${author.username}:
    \t\`BEFORE:\` ${beforeCleanContent}
    \t\`AFTER:\` ${cleanContent}`;

    await (logChannel as TextChannel).send(logMessage);
  }

  async logDelete(msg: Message) {
    const { createdTimestamp, author, cleanContent, guild, channel } = msg;

    const logChannel = this.getLogchannel(guild);
    const time = this.formatDate(createdTimestamp);

    const logMessage =
      `${time} UTC: \`DELETED\` **${(channel as TextChannel).name}** ${author.username}: ${cleanContent}`;

    await (logChannel as TextChannel).send(logMessage);
  }

  private formatDate(timestamp: number): string {
    const timeString = new Date(timestamp).toISOString().replace(/T/, " ").replace(/\..+/, "");
    return timeString.slice(5, timeString.length - 3);
  }

  private getLogchannel(guild: Guild): GuildChannel {
    return guild.channels.find((c) => c.name === this.chatlogChannel);
  }
}
