import { saySimpleEmbed } from "./../../utils/botUtils";
import { Message, TextChannel } from "discord.js";
import { invalidNumberOfMessagesToDelete, usageMessage } from "./response-messages";

export const clearMessages = async (args: string[], message: Message<boolean>) => {
  const expectedArgs = 1;
  const [messagesToDelete] = args;
  const messageQuantityToDelete = parseInt(messagesToDelete);
  if (
    !messagesToDelete ||
    isNaN(messageQuantityToDelete) ||
    args.length > expectedArgs ||
    !message.member.permissions.has("KICK_MEMBERS")
  )
    return showClearCommandUsage(message);

  if (messageQuantityToDelete > 100) return showClearCommandUsage(message, invalidNumberOfMessagesToDelete);
  //  Future: FetchMessages, then erase.
  //  const channel = message.client.channels.cache.get(message.channelId);
  //  (channel as TextChannel).messages.fetch();
  try {
    await (message.channel as TextChannel).bulkDelete(messageQuantityToDelete);
  } catch (error) {
    showClearCommandUsage(message, error.message);
    console.log(error);
  }
};

export const showClearCommandUsage = (message: Message, text = usageMessage) => {
  saySimpleEmbed(
    message.client,
    text,
    message.channelId,
    { name: message.author.username, iconURL: message.author.avatarURL() },
    { type: "error" }
  );
};
