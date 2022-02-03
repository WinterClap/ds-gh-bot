import { githubRouter } from "./routes/github.routes";
import "dotenv/config";
import { Client, Intents } from "discord.js";
import express, { Request, Response, NextFunction } from "express";

const app = express();

//  Universal Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//  Universal endpoints
app.get("/testing", (req: Request, res: Response, next: NextFunction) => {
  console.log("/testing route is working");
});

//  Routes
app.use("/github/webhooks", githubRouter);

const { SERVER_PORT_PRODUCTION, SERVER_PORT_DEVELOPMENT, NODE_ENV } = process.env;
const PORT =
  NODE_ENV !== "test" ? (NODE_ENV === "production" ? SERVER_PORT_PRODUCTION : SERVER_PORT_DEVELOPMENT) : null;

PORT && app.listen(PORT, () => console.log(`Bot Server initiated in port ${PORT}.`));

//  BOT Stuff
const intents = new Intents().add(
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_SCHEDULED_EVENTS
);

export const client = new Client({
  partials: ["MESSAGE"],
  intents,
});

client.on("ready", () => console.log(`Connected!`));

client.login(process.env.BOT_TOKEN);

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  const triggerWords = ["María", "Elisa", "Pedro", "Santiago"];
  triggerWords.includes(message.content) ? message.react("❤️") : message.channel.send("Ah?");
});
