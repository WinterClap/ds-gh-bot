import { EmbedMessageInterface } from "./../utils/botUtils";
import { Request } from "express";
import { say, sayEmbed } from "../utils/botUtils";

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
    req.body.issue.body &&
    req.body.issue.html_url &&
    req.body.comment.body &&
    req.body.issue.user.avatar_url;

  return isValid;
};

const getInformationFromRequest = (req: Request) => {
  return {
    title: req.body.issue.title,
    pullRequestNumber: req.body.issue.number,
    author: req.body.issue.user.login,
    pullRequestBody: req.body.issue.body,
    pullRequestURL: req.body.issue.html_url,
    triggeringComment: req.body.comment.body,
    userImageURL: req.body.issue.user.avatar_url,
  };
};
const getJiraTicket = (pullRequesTitle: string) => {
  const matchedText = pullRequesTitle.match(/SH-\d+/);
  return matchedText || null;
};

const getEmbed = (req: Request): EmbedMessageInterface => {
  const jiraTicket = getJiraTicket(req.body.issue.title);
  const { title, author, pullRequestBody, triggeringComment, pullRequestURL, pullRequestNumber, userImageURL } =
    getInformationFromRequest(req);
  let jiraContent: string | undefined;

  if (jiraTicket) {
    jiraContent = `https://share-hub.atlassian.net/browse/${jiraTicket}`;
  } else {
    jiraContent =
      "Invalid Pull Request Title: Missing 'SH-[TicketNumber]' sequence. Please edit your Pull Request and ask for code-review again.' ";
  }

  return {
    title,
    description: triggeringComment,
    type: "informative",
    fields: [
      { name: "Author", value: author },
      { name: "Jira issue", value: jiraContent },
      { name: "GitHub PR:", value: pullRequestURL },
    ],
    footer: {
      text: `This code-review request was triggered by PR No.${pullRequestNumber} by ${author}`,
      iconURL: userImageURL,
    },
  };
};

export const publishCodeReviewToChannel = (req: Request, channelId: string) => {
  const embed = getEmbed(req);
  say("@here New Code Review, bitcheees", channelId);
  sayEmbed(embed, channelId);
};
