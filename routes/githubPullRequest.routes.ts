import express, { Request, Response } from "express";
import { codeReviewMiddleware, webhookPullRequestGeneralMiddleware } from "../middlewares/webhook.middleware";
import { say, sayEmbed } from "../utils/botUtils";
import { TESTING_CHANNEL_ID } from "../utils/globalConstants";

export const githubRouter = express.Router();

//  Route Middlewares

//  Route Endpoints
githubRouter.post(
  "/code-review",
  webhookPullRequestGeneralMiddleware,
  codeReviewMiddleware,
  (req: Request, res: Response) => {
    res.json({ message: "Received", status: res.statusCode });
  }
);

githubRouter.get("/testing", (req: Request, res: Response) => {
  say("@here New code-review, bitcheeees!", TESTING_CHANNEL_ID);
  sayEmbed(
    {
      type: "informative",
      description:
        "@everyone Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      title: "TITLE",
      fields: [
        { name: "GIT", value: "GIT_URL" },
        { name: "JIRA", value: "JIRA_URL" },
      ],
    },
    TESTING_CHANNEL_ID
  );
  // say("Hellow", TESTING_CHANNEL_ID);
  res.json("check DS");
});
