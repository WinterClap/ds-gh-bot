import { NextFunction, Request, Response } from "express";
import { isPullRequestBodyValid, publishCodeReviewToChannel } from "../controller/githubCodeReviewWebhook.controller";
import { TESTING_CHANNEL_ID } from "../utils/globalConstants";

const error400BadRequestResponse = { message: "error", type: "Bad Request", status: "400" };

export const webhookPullRequestGeneralMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const isValid = isPullRequestBodyValid(req); //   TODO: Add extra validations
  isValid ? next() : res.status(400).json(error400BadRequestResponse);
};

export const codeReviewMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const TRIGGER_WORD = "code-review";
  const regexp = new RegExp(TRIGGER_WORD, "g");
  if (req.body.comment.body.match(regexp)) {
    //PUBLISH CODE-REVIEW
    publishCodeReviewToChannel(req, TESTING_CHANNEL_ID);
  }
  next();
};
