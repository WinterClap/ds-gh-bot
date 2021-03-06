import { Message, ThreadChannel } from "discord.js";
import {
  error400BadRequestResponse,
  server200Response,
  server200ResponseNoPRComment,
  server200ResposePRcomment,
} from "./../../utils/serverResponses";
import { Request, Response, NextFunction } from "express";
import * as codeReviewControllers from "../../controller/githubCodeReviewWebhook.controller";
import { codeReviewMiddleware, webhookPullRequestGeneralMiddleware } from "../../middlewares/webhookMiddlewares";

describe("Middlewares", () => {
  let req: Partial<Request> = {};
  let res: Partial<Response> = {
    status: jest.fn(),
    json: jest.fn(),
  };
  const next = jest.fn();

  beforeEach(() => {
    jest.restoreAllMocks();
    req = {};
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  describe("webhookPullRequestGeneralMiddleware", () => {
    it("should respond with status code 200 as validation success.", async () => {
      const isPullRequestBodyValidSpy = jest
        .spyOn(codeReviewControllers, "isPullRequestBodyValid")
        .mockImplementation(() => true);

      webhookPullRequestGeneralMiddleware(req as Request, res as Response, next as NextFunction);
      expect(isPullRequestBodyValidSpy).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalled();
    });

    it("should respond with status code 400 as validation fails.", async () => {
      const isPullRequestBodyValidSpy = jest
        .spyOn(codeReviewControllers, "isPullRequestBodyValid")
        .mockImplementation(() => false);

      webhookPullRequestGeneralMiddleware(req as Request, res as Response, next as NextFunction);
      expect(isPullRequestBodyValidSpy).toHaveBeenCalledTimes(1);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(error400BadRequestResponse);
    });
  });

  describe("codeReviewMiddleware", () => {
    it("should respond with default200Response response for a request with body.action value other than 'created'.", () => {
      const publishCodeReviewToChannelSpy = jest
        .spyOn(codeReviewControllers, "publishCodeReviewToChannel")
        .mockImplementation(() => Promise.resolve("messageInstace" as unknown as Message));

      req = { body: { action: "action-name-different-than-created" } };

      codeReviewMiddleware(req as Request, res as Response, next as NextFunction);
      expect(res.json).toHaveBeenCalledWith(server200ResponseNoPRComment);
      expect(publishCodeReviewToChannelSpy).not.toHaveBeenCalled();
    });

    it("should respond with default200NoPRRequest for a request with body.action value of 'created' with valid/positive code-review request. ", async () => {
      const publishCodeReviewToChannelSpy = jest
        .spyOn(codeReviewControllers, "publishCodeReviewToChannel")
        .mockImplementation(() => Promise.resolve("messageInstance" as unknown as Message));
      req = { body: { action: "created", comment: { body: "Indeed a code-review request comment." } } };
      const createThreadFromMessageSpy = jest
        .spyOn(codeReviewControllers, "createThreadFromMessage")
        .mockImplementation(() => Promise.resolve("threadInstance" as unknown as ThreadChannel));

      const testMiddleware = () =>
        new Promise((resolve, reject) =>
          resolve(codeReviewMiddleware(req as Request, res as Response, next as NextFunction))
        );
      await testMiddleware();
      // codeReviewMiddleware(req as Request, res as Response, next as NextFunction);
      expect(publishCodeReviewToChannelSpy).toHaveBeenCalledTimes(1);
      expect(createThreadFromMessageSpy).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalled();
    });
  });
});
