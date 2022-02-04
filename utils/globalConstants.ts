import { ColorResolvable } from "discord.js";

export const ALERTS_CHANNEL_ID = "938549498278461521";
export const TESTING_CHANNEL_ID = "938917145436360736";

interface BOT_EMBED_MESSAGES_COLORS_INTERFACE {
  [key: string]: ColorResolvable;
}
export const BOT_EMBED_MESSAGES_COLORS: BOT_EMBED_MESSAGES_COLORS_INTERFACE = {
  success: "GREEN",
  warning: "ORANGE",
  informative: "BLUE",
  error: "RED",
};

export const CODE_REVIEW_TITLE_EMBED_MESSAGE = "New code-review request!";
