import { Message, TextChannel } from "discord.js";

interface IEnhancedMsg extends Message {
  textChannel: () => TextChannel;
  formattedTimestamp: () => string;
}

const textChannel = (msg: Message) => (msg.channel as TextChannel);
const formattedTimestamp = (msg: Message) => msg.createdTimestamp.toString();

const makeEnhancedMsg = (msg: Message): IEnhancedMsg => {


  return Object.assign({}, msg, { textChannel, formattedTimestamp });
};

export default makeEnhancedMsg;
