import { saySimpleEmbed } from "./../../../bot/utils/botUtils";
import { correctGeneratedEmbedMessage } from "../../controllers/utils";
import { Client, ChannelManager, Collection, TextChannel } from "discord.js";
import { say, sayEmbed } from "../../../bot/utils/botUtils";

describe("botUtils", () => {
  const clientMock: Partial<Client<boolean>> = {
    channels: {
      cache: {
        get: jest.fn().mockImplementation(() => textChannelMock),
      } as unknown as Collection<any, any>,
    } as unknown as ChannelManager,
  };

  const textChannelMock: TextChannel = {
    send: jest.fn(),
  } as unknown as TextChannel;

  const testPhrase = "test-phrase";
  const testChannelID = "test-channel-id";
  const testEmbedMessageObject = correctGeneratedEmbedMessage({ isPRTitleValid: true, hasPRBody: false });

  it("say should send a message in the given channel", async () => {
    await say(clientMock as Client, testChannelID, testPhrase);

    expect(clientMock?.channels?.cache.get).toHaveBeenCalledTimes(1);
    expect(clientMock?.channels?.cache.get).toHaveBeenCalledWith(testChannelID);
    expect(textChannelMock.send).toHaveBeenCalledWith(testPhrase);
    expect(textChannelMock.send).toHaveBeenCalledTimes(1);
  });

  it("say should send a message in the given channel with 'default' message if no phrase is passed", async () => {
    await say(clientMock as Client, testChannelID, undefined);

    expect(clientMock?.channels?.cache.get).toHaveBeenCalledTimes(1);
    expect(clientMock?.channels?.cache.get).toHaveBeenCalledWith(testChannelID);
    expect(textChannelMock.send).toHaveBeenCalledWith("mother fuckers");
    expect(textChannelMock.send).toHaveBeenCalledTimes(1);
  });

  it("sayEmbed should send an embed message in the given channel", async () => {
    await sayEmbed(clientMock as Client, testEmbedMessageObject, testChannelID);

    expect(clientMock?.channels?.cache.get).toHaveBeenCalledTimes(1);
    expect(clientMock?.channels?.cache.get).toHaveBeenCalledWith(testChannelID);
    expect(textChannelMock.send).toHaveBeenCalledTimes(1);
    expect(textChannelMock.send).toHaveBeenCalled();
  });

  it("saySimpleEmbed should send an embed message in the given channel", async () => {
    const extrasObject = { name: "name", iconURL: "iconURL" };
    const colorPreference = { type: "informative" as any };

    await saySimpleEmbed(clientMock as Client, testPhrase, testChannelID, extrasObject, colorPreference);

    expect(clientMock?.channels?.cache.get).toHaveBeenCalledTimes(1);
    expect(clientMock?.channels?.cache.get).toHaveBeenCalledWith(testChannelID);
    expect(textChannelMock.send).toHaveBeenCalledTimes(1);
    expect(textChannelMock.send).toHaveBeenCalled();
  });
});
