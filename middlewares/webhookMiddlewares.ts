import { error400BadRequestResponse, server200ResponseNoPRComment } from "./../utils/serverResponses";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { isPullRequestBodyValid, publishCodeReviewToChannel } from "../controller/githubCodeReviewWebhook.controller";
import { ALERTS_CHANNEL_ID } from "../utils/globalConstants";

export const webhookPullRequestGeneralMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isValid = isPullRequestBodyValid(req); //   TODO: Add extra validations
  isValid ? next() : res.status(400).json(error400BadRequestResponse);
};

export const codeReviewMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const TRIGGER_WORD = "code-review";
  const regexp = new RegExp(TRIGGER_WORD, "g");
  if (req.body.action !== "created" || !req.body.comment.body.match(regexp)) {
    return res.json(server200ResponseNoPRComment);
  }
  if (req.body.comment.body.match(regexp)) {
    //PUBLISH CODE-REVIEW
    await publishCodeReviewToChannel(req, ALERTS_CHANNEL_ID);
  }
  next();
};

// export default { webhookPullRequestGeneralMiddleware, codeReviewMiddleware };
