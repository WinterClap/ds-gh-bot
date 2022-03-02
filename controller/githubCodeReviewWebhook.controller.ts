import { saySimpleEmbed } from "./../bot/utils/botUtils";
import { CODE_REVIEW_INITIAL_MESSAGE } from "./../utils/globalConstants";
import { Request } from "express";
import { say, sayEmbed, EmbedMessageInterface } from "../bot/utils/botUtils";
import { Client, EmbedFieldData, Message, MessageEmbed, TextChannel, ThreadChannel } from "discord.js";
import { client } from "../bot";

export const isPullRequestBodyValid = (req: Request) => {
  const isValid =
    req &&
    req.body &&
    req.headers["content-type"] &&
    req.headers["content-type"].match(/application\/json/) &&
    req.body.action &&
    req.body.issue &&
    req.body.comment &&
    req.body.repository &&
    req.body.sender &&
    req.body.issue.title &&
    req.body.issue.number &&
    req.body.issue.user.login &&
    req.body.issue.html_url &&
    req.body.comment.body &&
    req.body.comment.user.avatar_url &&
    true;

  return isValid;
};

export const getInformationFromRequest = (req: Request) => {
  return {
    title: req.body.issue.title,
    pullRequestNumber: req.body.issue.number,
    author: req.body.issue.user.login,
    commentAuthor: req.body.comment.user.login,
    pullRequestBody: req.body.issue.body,
    pullRequestURL: req.body.issue.html_url,
    triggeringComment: req.body.comment.body,
    userImageURL: req.body.comment.user.avatar_url,
  };
};
export const getJiraTicket = (pullRequesTitle: string) => {
  const matchedText = pullRequesTitle.match(/SH-\d+/);
  return matchedText || null;
};

export const getCodeReviewEmbed = (req: Request): EmbedMessageInterface => {
  const jiraTicket = getJiraTicket(req.body.issue.title);
  const {
    title,
    author,
    commentAuthor,
    pullRequestBody,
    triggeringComment,
    pullRequestURL,
    pullRequestNumber,
    userImageURL,
  } = getInformationFromRequest(req);
  let jiraContent: string | undefined;
  if (jiraTicket) {
    jiraContent = `https://share-hub.atlassian.net/browse/${jiraTicket}`;
  } else {
    jiraContent =
      "Invalid Pull Request Title: Missing 'SH-[TicketNumber]' sequence. Please edit your Pull Request and ask for code-review again.";
  }

  const fields: EmbedFieldData[] = [
    { name: "Author", value: author },
    { name: "Jira issue", value: jiraContent },
    { name: "GitHub PR:", value: pullRequestURL },
  ];
  pullRequestBody && fields.push({ name: "Thread: ", value: pullRequestBody });

  return {
    title,
    description: triggeringComment,
    type: jiraTicket ? "informative" : "error",
    fields,
    footer: {
      text: `This code-review request was triggered in PR No.${pullRequestNumber} by ${commentAuthor}`,
      iconURL: userImageURL,
    },
  };
};

export const publishCodeReviewToChannel = async (req: Request, channelId: string) => {
  const embed = getCodeReviewEmbed(req);
  await say(client, channelId, `@here ${CODE_REVIEW_INITIAL_MESSAGE}`);
  return await sayEmbed(client, embed, channelId);
};

export const createThreadFromMessage = async (message: Message) => {
  if (message.embeds[0].fields.filter((field) => field.value.startsWith("https://")).length !== 2) return;
  return message.startThread({
    name: message.embeds[0].title.replace(":", " ·"),
    autoArchiveDuration: "MAX",
  });
};

export const createMessageInThread = async (req: Request, channelID: string, client: Client) => {
  const jiraTicket = getJiraTicket(req.body.issue.title);
  const comment = req.body.comment.body;
  const { commentAuthor: author, userImageURL } = getInformationFromRequest(req);
  try {
    const { threads } = await (client.channels.cache.get(channelID) as TextChannel).threads.fetchActive();
    const [thread] = Array.from(threads.filter((thread) => thread.name.startsWith(`${jiraTicket}`)));
    const embed = new MessageEmbed()
      .setAuthor({ name: author, iconURL: userImageURL })
      .setDescription(`New comment from ${author} in GH: ${comment}`);
    await (thread[thread.length - 1] as ThreadChannel).send({ embeds: [embed] });
  } catch (error) {
    return await saySimpleEmbed(
      client,
      `Error trying to publish GitHub comment in thread for ticket ${jiraTicket}: ${error.message}`,
      channelID,
      { name: author, iconURL: userImageURL },
      { type: "error" }
    );
  }
};
