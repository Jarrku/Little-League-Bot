import { Guild, Message, Role, TextChannel } from "discord.js";
import RoleAssigner from "./RoleAssigner";

const roleList = new RoleAssigner().roles.join(", ");

interface ICommand {
  [index: string]: (msg: Message, args?: string[]) => void;
  execute(msg: Message): void;
}

export default class Commander implements ICommand {
  [index: string]: (msg: Message, args?: string[]) => void;

  execute(msg: Message) {
    const [command, ...args] = msg.content.slice(1).split(" ");

    if (this[command]) this[command](msg, args);
  }

  private async help(msg: Message) {
    const { channel } = msg;
    const text = `Check pin for help. Also here is a list of assignable roles:\n\`${roleList}\``;
    await (channel as TextChannel).send(text);
  }
}