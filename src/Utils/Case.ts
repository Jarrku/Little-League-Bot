import { GuildMember, RichEmbed } from "discord.js";
type Action = "WARNING" | "TIMEOUT" | "TIMEIN" | "BAN" | "PERMABAN";

export default class Case {
  private _type: Action;
  private offender: GuildMember;
  private moderator: GuildMember;
  private timestamp: Date;
  private reason?: string;

  constructor(type: Action, offender: GuildMember, moderator: GuildMember, timestamp: Date, reason?: string) {
    this._type = type;
    this.offender = offender;
    this.moderator = moderator;
    this.timestamp = timestamp;
    this.reason = reason;
  }

  private get color() {
    switch (this._type) {
      case "WARNING":
      case "TIMEOUT":
      case "PERMABAN":
      case "BAN": return 16724736;
      case "TIMEIN": return 6750003;
    }
  }

  private get duration() {
    if (this._type === "TIMEOUT")
      return "24 Hours";
    if (this._type === "BAN")
      return "3 Days";

    return;
  }

  private get type(): string {
    const firstL = this._type.substr(0, 1);
    const rest = this._type.substr(1).toLowerCase();
    return firstL + rest;
  }

  createReport() {
    let baseEmbed = new RichEmbed({
      color: this.color,
      timestamp: this.timestamp,
      footer: {
        text: `USER ID: ${this.offender.id}`,
      },
      author: {
        name: `${this.type} | ${this.offender.user.tag}`,
        icon_url: this.offender.user.displayAvatarURL,
      },
      fields: [
        {
          name: "User",
          value: `${this.offender}`,
          inline: true,
        },
        {
          name: "Moderator",
          value: `${this.moderator}`,
          inline: true,
        },
      ],
    });
    if (this.duration) {
      baseEmbed = baseEmbed.addField("Duration", this.duration, true);
    }
    if (this.reason) {
      baseEmbed = baseEmbed.addField("Reason", this.reason, true);
    }
    return baseEmbed;
  }
}
