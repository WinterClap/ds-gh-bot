import { COMMANDS } from "./commands/commands-list";
import { Command } from "./commands/CommandsTypes";
import { Client, Intents } from "discord.js";
import { COMMAND_PREFIX } from "./../utils/globalConstants";
import "dotenv/config";
import { saySimpleEmbed } from "./utils/botUtils";
import { clearMessages } from "./commands/clear";

const { NODE_ENV, BOT_TOKEN } = process.env;
//  BOT Stuff
const intents = new Intents().add(
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_SCHEDULED_EVENTS
);

export const client = new Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents,
});

/* istanbul ignore next */
if (NODE_ENV !== "test") {
  client.login(BOT_TOKEN);
  client.on("ready", () => console.log(`Connected!`));

  client.on("messageCreate", (message) => {
    if (
      !message.content.startsWith(COMMAND_PREFIX) ||
      message.author.bot ||
      message.content.split(" ")[0].trim() === COMMAND_PREFIX
    )
      return;
    const command: Command = message.content.split(" ")[0].slice(COMMAND_PREFIX.length) as Command;
    console.log("command: ", command);
    const args: string[] = message.content.replace(/\s+/g, " ").trim().split(" ").slice(1) || [];
    console.log("args: ", args);
    switch (command) {
      case COMMANDS.clear:
        clearMessages(args, message);
        break;

      default:
        const defaultMessage = `Command not recognized. Type \`${COMMAND_PREFIX}help\` to see all available commands.`;
        saySimpleEmbed(
          client,
          defaultMessage,
          message.channelId,
          { name: `${message.author.username} | ${command}`, iconURL: message.author.avatarURL() },
          { type: "error" }
        );
        break;
    }
  });
}
