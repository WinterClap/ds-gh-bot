import { MessageEmbed, TextChannel, EmbedFieldData, Client } from "discord.js";
import { BOT_EMBED_MESSAGES_COLORS } from "./globalConstants";

export const say = async (client: Client<boolean>, channelID: string, phrase?: string) => {
  (client.channels.cache.get(channelID) as TextChannel).send(`${phrase ? phrase : "mother fuckers"}`);
};

export interface EmbedMessageInterface {
  type: "success" | "warning" | "informative" | "error";
  description?: string;
  title: string;
  fields?: EmbedFieldData[];
  footer?: { text: string; iconURL?: string };
}

export const sayEmbed = async (
  client: Client<boolean>,
  { type, title, description, footer, fields }: EmbedMessageInterface,
  channelID: string
) => {
  const embed = new MessageEmbed()
    .setColor(BOT_EMBED_MESSAGES_COLORS[type])
    .setTitle(title)
    .setDescription(description);
  fields && embed.addFields(fields).setTimestamp();
  footer && embed.setFooter(footer);
  (client.channels.cache.get(channelID) as TextChannel).send({ embeds: [embed] });
};
