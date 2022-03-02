import { ALERTS_CHANNEL_ID } from "./../../utils/globalConstants";
import {
  createMessageInThread,
  createThreadFromMessage,
  getCodeReviewEmbed,
  getInformationFromRequest,
  getJiraTicket,
  isPullRequestBodyValid,
  publishCodeReviewToChannel,
} from "../../controller/githubCodeReviewWebhook.controller";
import { Request } from "express";
import * as botUtils from "../../bot/utils/botUtils";

import {
  baseReq,
  correctInformationObject,
  PR_invalidTitle,
  PR_validTitle,
  ticketNumber,
  correctGeneratedEmbedMessage,
  PRBody,
} from "./utils";
import { AnyChannel, ChannelManager, Client, Collection, Message, MessageEmbed, ThreadManager } from "discord.js";

describe("Controller methods", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
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

  it("getJira ticket should return expected value as the PR title is valid", () => {
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

  it("should call publishCodeReviewToChannel with the given arguments", async () => {
    const saySpy = jest
      .spyOn(botUtils, "say")
      .mockImplementation((clientMock, phrase, channelID) => Promise.resolve("messageInstance" as unknown as Message));
    const sayEmbedSpy = jest
      .spyOn(botUtils, "sayEmbed")
      .mockImplementation((client, embedObject, channelID) => Promise.resolve("messageInstance" as unknown as Message));

    await publishCodeReviewToChannel(baseReq as Request, ALERTS_CHANNEL_ID);
    expect(saySpy).toHaveBeenCalled();
    expect(sayEmbedSpy).toHaveBeenCalled();
  });

  describe("Controller Thread methods", () => {
    const channelIdTest = "channelIdTest";
    const PRTitleTest = "SH-1234: PR Title Test";
    const jiraTicketTest = "SH-1234";
    const threadTitleTest = "thread title test";
    const errorMessageTest = "errorMessageTest";

    const messageMock: Partial<Message> = {
      startThread: jest.fn(),
      embeds: [
        {
          title: threadTitleTest,
          fields: [
            { value: "https://1", name: "name1", inline: false },
            { value: "https://2", name: "name2", inline: false },
          ],
        },
      ] as unknown as MessageEmbed[],
    } as unknown as Message;

    const sendMock = jest.fn();

    const channelMock: Partial<AnyChannel> = {
      threads: {
        fetchActive: jest.fn(() =>
          Promise.resolve({ threads: new Collection().set("channelId", { name: PRTitleTest, send: sendMock }) })
        ),
      } as unknown as ThreadManager<any>,
    } as unknown as AnyChannel;

    const clientMock: Partial<Client> = {
      channels: {
        cache: {
          get: jest.fn().mockImplementation(() => channelMock),
        } as unknown as Collection<any, any>,
      } as unknown as ChannelManager,
    };

    const saySimpleEmbedSpy = jest
      .spyOn(botUtils, "saySimpleEmbed")
      .mockImplementation(() => Promise.resolve("messageInstance" as unknown as Message));

    it("createThreadFromMessage function should return the message instance for the just created thread. Message.startThread should be called.", async () => {
      await createThreadFromMessage(messageMock as Message);
      expect(messageMock.startThread).toHaveBeenCalledWith({ name: threadTitleTest, autoArchiveDuration: "MAX" });
    });

    it("createThreadFromMessage function should return null because message has no 2 matches for fields that start with 'https://'", async () => {
      /*  which means that the message has no jiraTicket identified. At the same time, this happens because the PR title does not contain the jira ticket. */
      const messageMockFailure: Partial<Message> = {
        startThread: jest.fn(),
        embeds: [
          {
            title: threadTitleTest,
            fields: [
              { value: "https://1", name: "name1", inline: false },
              { value: "", name: "name2", inline: false },
            ],
          },
        ] as unknown as MessageEmbed[],
      } as unknown as Message;

      const result = await createThreadFromMessage(messageMockFailure as Message);

      expect(result).toBeUndefined();
    });

    it("createMessageInThread function should send an embed message in the thread channel", async () => {
      await createMessageInThread(
        { body: { ...baseReq.body, issue: { ...baseReq.body.issue, title: PRTitleTest } } } as Request,
        channelIdTest,
        clientMock as Client
      );

      expect(clientMock!.channels!.cache.get).toHaveBeenCalledWith(channelIdTest);
      expect(sendMock).toHaveBeenCalled();
      expect(saySimpleEmbedSpy).not.toHaveBeenCalled();
    });

    it("createMessageInThread function should not send an embed message to the thread channel. Instead, it should send a general error in the alerts channel", async () => {
      sendMock.mockReturnValueOnce(Promise.reject(new Error(errorMessageTest)));
      try {
        await createMessageInThread(
          { body: { ...baseReq.body, issue: { ...baseReq.body.issue, title: PRTitleTest } } } as Request,
          channelIdTest,
          clientMock as Client
        );
      } catch (error) {
        expect(clientMock!.channels!.cache.get).toHaveBeenCalledWith(channelIdTest);
        expect(sendMock).not.toHaveBeenCalled();
        expect(saySimpleEmbedSpy).toHaveBeenCalledWith(
          clientMock,
          `Error trying to publish GitHub comment in thread for ticket ${jiraTicketTest}: ${errorMessageTest}`,
          channelIdTest,
          { name: baseReq.body.comment.user.login, iconURL: baseReq.body.comment.user.avatar_url },
          { type: "error" }
        );
      }
    });
  });
});
