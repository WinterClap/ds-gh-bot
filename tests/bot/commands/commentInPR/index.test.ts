import { octokit } from "./../../../../octokit";
import { commentInPR, showCommentPRCommandUsage } from "./../../../../bot/commands/commentInPR";
import { AnyChannel, ChannelManager, Client, Collection, Message, MessageEmbed, ThreadChannel } from "discord.js";
import * as botUtils from "../../../../bot/utils/botUtils";
import * as commandFunctions from "./../../../../bot/commands/commentInPR";
import {
  commandMustBeSentInAThreadMessage,
  usageMessage,
} from "../../../../bot/commands/commentInPR/response-messages";
import { COMMANDS } from "../../../../bot/commands/commands-list";

jest.mock("./../../../../octokit");
jest.mock("@octokit/core", () => {
  const octokitMock = {
    request: jest.fn(),
  };
  return { Octokit: jest.fn().mockImplementation(() => octokitMock) };
});

describe("commentPR COMMAND", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const textTest = "text";
  const usernameTest = "username";
  const channelIdTest = "channelId";
  const avatarURLTest = "avatar_url";
  const identifierTest = "WinterClap/share-hub-be/7";
  const commentTest = "comment";

  const starterMessageMock: Partial<Message> = {
    embeds: [
      {
        fields: [{ name: "PR identifier", value: identifierTest }],
      },
    ] as unknown as MessageEmbed[],
  } as unknown as Message;

  const clientMock: Client = {
    channels: {
      cache: {
        get: jest.fn(() => channelIdTest as unknown as AnyChannel),
      } as unknown as Collection<any, any>,
    } as unknown as ChannelManager,
  } as unknown as Client;

  const messageMock: Message = {
    client: clientMock,
    channel: {
      isThread: jest.fn().mockImplementation(() => true),
      fetchStarterMessage: jest
        .fn()
        .mockImplementation(() => Promise.resolve(starterMessageMock as unknown as Message)),
    },
    channelId: channelIdTest,
    author: {
      username: usernameTest,
      avatarURL: jest.fn(() => avatarURLTest),
    },
  } as unknown as Message;

  describe("commentInPR function", () => {
    let saySimpleEmbedSpy: jest.SpyInstance<Promise<Message<boolean>>>;
    beforeEach(() => {
      saySimpleEmbedSpy = jest
        .spyOn(botUtils, "saySimpleEmbed")
        .mockImplementation(() => Promise.resolve("messageInstance" as unknown as Message));
    });

    it("should call the showCommentPRCommandUsage function when there's no args within the message", async () => {
      const argsSet: (string[] | undefined)[] = [[], undefined];

      argsSet.forEach(async (args) => {
        const showCommentPRCommandUsageSpy = jest
          .spyOn(commandFunctions, "showCommentPRCommandUsage")
          .mockImplementation(() => Promise.resolve("messageInstance" as unknown as Message));

        await commentInPR(args, messageMock);

        expect(showCommentPRCommandUsageSpy).toHaveBeenCalledWith(messageMock);
      });
    });

    it("should call saySimpleEmbed with the given parameters when the channel where the message was sent is not a thread.", async () => {
      (messageMock.channel.isThread as jest.Mock<any, any>).mockImplementationOnce(() => false);

      await commentInPR(["comment"], messageMock);

      expect(saySimpleEmbedSpy).toHaveBeenCalledWith(
        messageMock.client,
        commandMustBeSentInAThreadMessage,
        messageMock.channelId,
        { name: `${usernameTest} | commentPR`, iconURL: avatarURLTest },
        { type: "error" }
      );
    });

    it("should call octokit.request with the correct URL params", async () => {
      await commentInPR([commentTest], messageMock);

      expect(octokit.request).toHaveBeenCalledWith(`POST /repos/WinterClap/share-hub-be/issues/7/comments`, {
        body: `${usernameTest} from Discord says: ${commentTest}`,
      });
      expect((messageMock.channel as ThreadChannel).fetchStarterMessage).toHaveBeenCalledTimes(1);
      expect(saySimpleEmbedSpy).not.toHaveBeenCalled();
      expect(await (messageMock.channel as ThreadChannel).fetchStarterMessage()).toEqual(starterMessageMock);
    });

    it("should call saySimpleEmbed function as the try block encounters an error.", async () => {
      const errorMessageTest = "error";
      ((messageMock.channel as ThreadChannel).fetchStarterMessage as jest.Mock<any, any>).mockImplementationOnce(() =>
        Promise.reject(new Error(errorMessageTest))
      );
      await commentInPR([commentTest], messageMock);

      expect(octokit.request).not.toHaveBeenCalled();
      expect((messageMock.channel as ThreadChannel).fetchStarterMessage).toHaveBeenCalledTimes(1);
      expect(saySimpleEmbedSpy).toHaveBeenCalledWith(
        messageMock.client,
        `Error: ${errorMessageTest}`,
        messageMock.channelId,
        { name: `${usernameTest} | \`${COMMANDS.commentInPR}\``, iconURL: avatarURLTest },
        { type: "error" }
      );
      expect(await (messageMock.channel as ThreadChannel).fetchStarterMessage()).toEqual(starterMessageMock);
    });
  });

  describe("showCommentPRCommandUsage function", () => {
    it("should call saySimpleEmbed with the given parameters/args", async () => {
      const saySimpleEmbedSpy = jest
        .spyOn(botUtils, "saySimpleEmbed")
        .mockImplementation(() => Promise.resolve("messageInstance" as unknown as Message));

      await showCommentPRCommandUsage(messageMock, textTest);
      await showCommentPRCommandUsage(messageMock);

      expect(saySimpleEmbedSpy).toHaveBeenCalledWith(
        clientMock,
        textTest,
        channelIdTest,
        { name: usernameTest, iconURL: avatarURLTest },
        { type: "error" }
      );
      expect(saySimpleEmbedSpy).toHaveBeenCalledWith(
        clientMock,
        usageMessage,
        channelIdTest,
        { name: usernameTest, iconURL: avatarURLTest },
        { type: "error" }
      );
    });
  });
});
