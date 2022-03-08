import { saySimpleEmbed } from "./../../utils/botUtils";
import { Message, ThreadChannel } from "discord.js";
import { octokit } from "./../../../octokit";
import { COMMANDS } from "../commands-list";
import { commandMustBeSentInAThreadMessage, usageMessage } from "./response-messages";

export const commentInPR = async (args: string[] | undefined, message: Message) => {
  const minimumExpectedArgs = 1;
  const comment = args && args.join(" ");
  if (!args || (args && args.length < minimumExpectedArgs)) return showCommentPRCommandUsage(message);
  if (!message.channel.isThread())
    return saySimpleEmbed(
      message.client,
      commandMustBeSentInAThreadMessage,
      message.channelId,
      { name: `${message.author.username} | ${COMMANDS.commentInPR}`, iconURL: message.author.avatarURL() },
      { type: "error" }
    );

  const thread = message.channel as ThreadChannel;
  try {
    const starterMessage = await thread.fetchStarterMessage();
    const [repoOwner, repoName, pullRequestNumber] = starterMessage.embeds[0].fields
      .filter((field) => field.name === "PR identifier")[0]
      .value.split("/");
    await octokit.request(`POST /repos/${repoOwner}/${repoName}/issues/${pullRequestNumber}/comments`, {
      body: `${message.author.username} from Discord says: ${comment}`,
    });
  } catch (error) {
    saySimpleEmbed(
      message.client,
      `Error: ${error.message}`,
      message.channelId,
      { name: `${message.author.username} | \`${COMMANDS.commentInPR}\``, iconURL: message.author.avatarURL() },
      { type: "error" }
    );
  }
  //    TODO: Find the thread first message (starterMessage) [... (thread as ThreadChannel).starterMessage()]
  //    Having that first thread message, find the field within the fields attribute with name: "PR indentifier"
  //    Find the variables required to make a request like below
  //    octokit.request("GET /repos/${owner}/pulls/${repoName}/${pullNumber}/comments");
  //    POST /repos/{owner}/{repo}/issues/{issue_number}/comments -> To create comments in issue.
};

export const showCommentPRCommandUsage = (message: Message, text = usageMessage) => {
  return saySimpleEmbed(
    message.client,
    text,
    message.channelId,
    { name: message.author.username, iconURL: message.author.avatarURL() },
    { type: "error" }
  );
};
