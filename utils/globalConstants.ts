import { ColorResolvable } from "discord.js";

const ALERTS_CHANNEL_ID_MAP = {
  production: "938549498278461521",
  development: "938917145436360736",
  test: "938917145436360736",
};

export const ALERTS_CHANNEL_ID = ALERTS_CHANNEL_ID_MAP[process.env.NODE_ENV];

export const TESTING_CHANNEL_ID = "946540093076820038";

interface BOT_EMBED_MESSAGES_COLORS_INTERFACE {
  [key: string]: ColorResolvable;
}
export const BOT_EMBED_MESSAGES_COLORS: BOT_EMBED_MESSAGES_COLORS_INTERFACE = {
  success: "GREEN",
  warning: "ORANGE",
  informative: "BLUE",
  error: "RED",
};

export const CODE_REVIEW_INITIAL_MESSAGE = "New Code Review, bitcheees";
export const COMMAND_PREFIX = "me!";
