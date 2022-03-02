import * as botUtils from "./../../../../bot/utils/botUtils";
import { Client, GuildMember, PermissionResolvable, Permissions, TextChannel, ThreadChannel, User } from "discord.js";
import { Message } from "discord.js";
import { clearMessages, showClearCommandUsage } from "./../../../../bot/commands/clear/index";
import * as clearFunctions from "./../../../../bot/commands/clear/index";
import { invalidNumberOfMessagesToDelete } from "../../../../bot/commands/clear/response-messages";

describe("clear COMMAND", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const avatarURL = "avatarURL";
  const messageMock: Partial<Message<boolean>> = {
    channel: {
      bulkDelete: jest.fn(),
    } as unknown as ThreadChannel,
    author: {
      username: "testUsername",
      avatarURL: jest.fn(() => avatarURL),
    } as unknown as User,
    client: {} as unknown as Client,
    channelID: "testChannelID" as string,
    member: {
      permissions: {
        has: jest.fn(() => true),
      } as unknown as Permissions,
    } as unknown as GuildMember,
  } as unknown as Message;
  describe("clearMessages function", () => {
    const saySimpleEmbedSpy = jest
      .spyOn(botUtils, "saySimpleEmbed")
      .mockImplementation(() => Promise.resolve("messageInstance" as unknown as Message));

    it("should call bulkDelete with the correct argument extracted from args.", async () => {
      const messagesToDelete = "78";
      const args: string[] = [messagesToDelete];

      await clearMessages(args, messageMock as Message);

      expect((messageMock.channel as TextChannel).bulkDelete).toHaveBeenCalledWith(Number(messagesToDelete));
    });

    it("should fail and call showClearCommandUsage due to there's no messagesToDelete, there's no args or there are more that expected arguments", async () => {
      const testOptions = [[], ["1", "2"], ["NaN"]];
      const showClearCommandUsageSpy = jest.spyOn(clearFunctions, "showClearCommandUsage");
      testOptions.forEach(async (args) => {
        await clearMessages(args, messageMock as Message);

        expect(showClearCommandUsageSpy).toHaveBeenCalledWith(messageMock);
        expect((messageMock.channel as TextChannel).bulkDelete).not.toHaveBeenCalled();
      });
    });

    it("should fail and call showClearCommandUsage due to the user that triggers the command has no enough permissions to do so.", async () => {
      const args: string[] = ["1"];
      jest.spyOn(messageMock.member!.permissions, "has").mockReturnValueOnce(false);
      const showClearCommandUsageSpy = jest.spyOn(clearFunctions, "showClearCommandUsage");

      await clearMessages(args, messageMock as Message);

      expect(showClearCommandUsageSpy).toHaveBeenCalledWith(messageMock);
      expect((messageMock.channel as TextChannel).bulkDelete).not.toHaveBeenCalled();
    });

    it("should call showClearCommandUsage function when the number of messages to be deleted is more than 100", async () => {
      const showClearCommandUsageSpy = jest.spyOn(clearFunctions, "showClearCommandUsage");
      const args: string[] = ["101"];

      await clearMessages(args, messageMock as Message);

      expect(showClearCommandUsageSpy).toHaveBeenCalledWith(messageMock, invalidNumberOfMessagesToDelete);
    });

    it("should catch the error produced during bulkDelete and call showClearCommandUsage", async () => {
      const args: string[] = ["1"];
      const errorMessage = "Error Message";
      const showClearCommandUsageSpy = jest.spyOn(clearFunctions, "showClearCommandUsage");
      jest
        .spyOn(messageMock.channel as TextChannel, "bulkDelete")
        .mockImplementation(() => Promise.reject(new Error(errorMessage)));

      try {
        await clearMessages(args, messageMock as Message);
      } catch (error) {
        expect(error.message).toBe(errorMessage);
        expect(showClearCommandUsageSpy).toHaveBeenCalledWith(messageMock, errorMessage);
      }
    });
  });

  describe("showClearCommandUsage function", () => {
    it("should call saySimpleEmbed function with the given arguments.", () => {
      const textTest = "textTest";
      const saySimpleEmbedSpy = jest
        .spyOn(botUtils, "saySimpleEmbed")
        .mockImplementation(() => Promise.resolve("messageInstance" as unknown as Message));

      showClearCommandUsage(messageMock as Message, textTest);

      expect(saySimpleEmbedSpy).toHaveBeenCalledWith(
        messageMock.client,
        textTest,
        messageMock.channelId,
        { name: messageMock.author?.username, iconURL: avatarURL },
        { type: "error" }
      );
    });
  });
});
