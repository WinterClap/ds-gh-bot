import { MessageEmbed, TextChannel, EmbedFieldData, Client, ColorResolvable } from "discord.js";
import { BOT_EMBED_MESSAGES_COLORS } from "../../utils/globalConstants";

export const say = async (client: Client<boolean>, channelID: string, phrase?: string) => {
  return await (client.channels.cache.get(channelID) as TextChannel).send(`${phrase ? phrase : "mother fuckers"}`);
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

  return await (client.channels.cache.get(channelID) as TextChannel).send({ embeds: [embed] });
};

interface SimpleEmbedExtrasInterface {
  name: string;
  iconURL?: string;
  url?: string;
  customFields?: EmbedFieldData[];
}
export const saySimpleEmbed = async (
  client: Client<boolean>,
  text: string,
  channelID: string,
  { name, iconURL, customFields, url }: SimpleEmbedExtrasInterface,
  {
    type,
    color,
  }: { type?: EmbedMessageInterface["type"]; color?: never } | { color?: ColorResolvable; type?: never } | undefined
) => {
  /* istanbul ignore next*/
  const embed = new MessageEmbed()
    .setAuthor({ name, ...(iconURL && { iconURL }), ...(url && { url }) })
    .setDescription(text)
    .setColor(type ? BOT_EMBED_MESSAGES_COLORS[type] : color);
  /* istanbul ignore next*/
  customFields && embed.addFields(customFields);

  return await (client.channels.cache.get(channelID) as TextChannel).send({ embeds: [embed] });
};
