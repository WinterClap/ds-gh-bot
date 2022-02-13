import { CODE_REVIEW_INITIAL_MESSAGE, ALERTS_CHANNEL_ID } from "./../../utils/globalConstants";
import {
  getCodeReviewEmbed,
  getInformationFromRequest,
  getJiraTicket,
  isPullRequestBodyValid,
  publishCodeReviewToChannel,
} from "../../controller/githubCodeReviewWebhook.controller";
import { Request } from "express";
import * as botUtils from "../../utils/botUtils";

import {
  baseReq,
  correctInformationObject,
  PR_invalidTitle,
  PR_validTitle,
  ticketNumber,
  correctGeneratedEmbedMessage,
  PRBody,
} from "./utils";

describe("Controller methods", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("isPullRequestBodyValid should return true with valid request", () => {
    const isValid = isPullRequestBodyValid(baseReq as Request);
    expect(isValid).toBe(true);
  });

  it("getInformationFromRequest should return a given object", () => {
    const informationObj = getInformationFromRequest(baseReq as Request);
    expect(informationObj).toEqual(correctInformationObject);
  });

  it("getJira ticket should return null as the PR title is not valid", () => {
    const jiraTicket = getJiraTicket(PR_invalidTitle);
    expect(jiraTicket).toBe(null);
  });

  it("getJira ticket should return null as the PR title is not valid", () => {
    const jiraTicket = getJiraTicket(PR_validTitle);
    expect(`${jiraTicket}`).toBe(ticketNumber);
  });

  it("getCodeReviewEmbed should return an embed message type of object without Thread field and title should be valid", () => {
    const embed = getCodeReviewEmbed({
      ...baseReq,
      body: { ...baseReq.body, issue: { ...baseReq.body.issue, body: null, title: PR_validTitle } },
    } as Request);

    expect(embed).toEqual(correctGeneratedEmbedMessage({ isPRTitleValid: true, hasPRBody: false }));
  });

  it("getCodeReviewEmbed should return an embed message type of object with Thread field and title should be invalid", () => {
    const embed = getCodeReviewEmbed({
      ...baseReq,
      body: { ...baseReq.body, issue: { ...baseReq.body.issue, body: PRBody, title: PR_invalidTitle } },
    } as Request);
    const correctObject = correctGeneratedEmbedMessage({ isPRTitleValid: false, hasPRBody: true });
    expect(embed).toEqual(correctObject);
  });

  it("should call publishCodeReviewToChannel with the given arguments", () => {
    const saySpy = jest.spyOn(botUtils, "say").mockImplementation((phrase, channelID) => {});
    const sayEmbedSpy = jest.spyOn(botUtils, "sayEmbed").mockImplementation((embedObject, channelID) => {});

    publishCodeReviewToChannel(baseReq as Request, ALERTS_CHANNEL_ID);
    expect(saySpy).toHaveBeenCalledWith(`@here ${CODE_REVIEW_INITIAL_MESSAGE}`, ALERTS_CHANNEL_ID);
    expect(sayEmbedSpy).toHaveBeenCalled();
  });
});
