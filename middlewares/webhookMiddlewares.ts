import {
  error400BadRequestResponse,
  server200ResponseNoPRComment,
  server200ResposePRcomment,
} from "./../utils/serverResponses";
import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  createMessageInThread,
  createThreadFromMessage,
  isPullRequestBodyValid,
  publishCodeReviewToChannel,
} from "../controller/githubCodeReviewWebhook.controller";
import { ALERTS_CHANNEL_ID } from "../utils/globalConstants";
import { client } from "../bot";

const TRIGGER_WORD = "code-review";
const regExp = new RegExp(TRIGGER_WORD, "g");
export const webhookPullRequestGeneralMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isValid = isPullRequestBodyValid(req); //   TODO: Add extra validations
  isValid ? next() : res.status(400).json(error400BadRequestResponse);
};

export const codeReviewMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.action !== "created") {
    return res.json(server200ResponseNoPRComment);
  }
  if (req.body.comment.body.match(regExp)) {
    //PUBLISH CODE-REVIEW
    const embedMessageSent = await publishCodeReviewToChannel(req, ALERTS_CHANNEL_ID);
    await createThreadFromMessage(embedMessageSent);
  }
  next();
};

export const codeReviewTrackingMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.comment.body.match(regExp)) {
    await createMessageInThread(req, ALERTS_CHANNEL_ID, client);
    return res.json(server200ResposePRcomment);
  }
  next();
};
