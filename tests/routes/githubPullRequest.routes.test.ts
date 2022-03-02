import { baseReq } from "./../controllers/utils";
import {
  error400BadRequestResponse,
  server200Response,
  server200ResponseNoPRComment,
  server200ResposePRcomment,
} from "../../utils/serverResponses";
import request from "supertest";
import { app } from "../../app";

import * as controllers from "../../controller/githubCodeReviewWebhook.controller";
import { Message, ThreadChannel } from "discord.js";
import { ServerMessage } from "../../utils/ServerMessage";
import { ALERTS_CHANNEL_ID } from "../../utils/globalConstants";

describe("githubPullRequest route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it("GET / Universal route should respond with status code 200.", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });

  it("should respond with status code 400 due to invalid Content-Type header", async () => {
    const response = await request(app).post("/github/pull-request/code-review").send({});
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(error400BadRequestResponse);
  });

  it("should respond with a status code 200 due to correct request validation and code-review request identification valid.", async () => {
    jest
      .spyOn(controllers, "publishCodeReviewToChannel")
      .mockImplementation(() => Promise.resolve("messageInstance" as unknown as Message));

    jest
      .spyOn(controllers, "createThreadFromMessage")
      .mockImplementation(() => Promise.resolve("Instance" as unknown as ThreadChannel));

    const response = await request(app)
      .post("/github/pull-request/code-review")
      .send(baseReq.body)
      .set("content-type", "application/json");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(server200Response);
  });

  it("should respond with a status code 200 due to correct request validation but code-review request identification invalid.", async () => {
    const req = {
      ...baseReq.body,
      comment: { ...baseReq.body.comment, body: "Not triggering comment." },
    };
    const createMessageInThreadSpy = jest
      .spyOn(controllers, "createMessageInThread")
      .mockImplementation(() => Promise.resolve("Instance" as unknown as Message));

    const response = await request(app)
      .post("/github/pull-request/code-review")
      .set("content-type", "application/json")
      .send(req);

    expect(createMessageInThreadSpy).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200), expect(response.body).toEqual(server200ResposePRcomment);
  });
});
