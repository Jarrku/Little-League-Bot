import { DMChannel, GroupDMChannel, Guild, GuildChannel, GuildMember, Message, Role, TextChannel } from "discord.js";

export default class Logger {
  readonly chatlogChannel = "talk-log-pogpog";
  private excludedChannels =
  [this.chatlogChannel, "admin", "botpogpog", "arths-bot-test-channel", "moderator", "staff"];

  async new(msg: Message) {
    const { createdTimestamp, cleanContent, channel, author, guild } = msg;

    if (this.isUntrackedChannel(channel)) return;

    const logChannel = this.getLogchannel(guild);
    const time = this.formatDate(createdTimestamp);

    const logMessage =
      `${time} UTC: \`SENT\` **${(channel as TextChannel).name}** ${author.username}: ${cleanContent}`;

    await logChannel.send(logMessage);
  }

  async edit(before: Message, after: Message) {
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

  async delete(msg: Message) {
    const { createdTimestamp, author, cleanContent, guild, channel } = msg;

    if (this.isUntrackedChannel(channel)) return;
    const logChannel = this.getLogchannel(guild);
    const time = this.formatDate(createdTimestamp);

    const logMessage =
      `${time} UTC: \`DELETED\` **${(channel as TextChannel).name}** ${author.username}: ${cleanContent}`;

    await logChannel.send(logMessage);
  }

  private isUntrackedChannel(channel: TextChannel | DMChannel | GroupDMChannel): boolean {
    return channel instanceof TextChannel ? this.excludedChannels.findIndex((ch) => ch === channel.name) !== -1 : true;
  }

  private formatDate(timestamp: number): string {
    const timeString = new Date(timestamp).toISOString().replace(/T/, " ").replace(/\..+/, "");
    return timeString.slice(5, timeString.length - 3);
  }

  private getLogchannel(guild: Guild): TextChannel {
    return guild.channels.find((c) => c.name === this.chatlogChannel) as TextChannel;
  }
}
