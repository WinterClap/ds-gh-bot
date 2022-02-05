import { githubRouter } from "./routes/githubPullRequest.routes";
import "dotenv/config";
import { Client, Intents } from "discord.js";
import express, { Request, Response, NextFunction } from "express";

const app = express();
const BACKED_PORT = 5000;

//  Universal Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//  Universal endpoints
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log("/ route is working");
  res.json("/ route is working.");
});

//  Routes
app.use("/github/pull-request", githubRouter);

//  Initialization
const { PORT: SERVER_PORT_PRODUCTION, SERVER_PORT_DEVELOPMENT, NODE_ENV } = process.env;
let useBackedPort = false;
if (NODE_ENV !== "test" && (SERVER_PORT_DEVELOPMENT || SERVER_PORT_PRODUCTION)) {
  let PORT = Number(NODE_ENV === "production" ? SERVER_PORT_PRODUCTION : SERVER_PORT_DEVELOPMENT);
  if (!PORT) {
    PORT = BACKED_PORT;
    useBackedPort = true;
  }
  app.listen(PORT, () => console.log(`Bot server ${useBackedPort ? "backed up" : "booted"} in port ${PORT}`));
}

//  BOT Stuff
const intents = new Intents().add(
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  Intents.FLAGS.GUILD_SCHEDULED_EVENTS
);

export const client = new Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents,
});

client.on("ready", () => console.log(`Connected!`));

client.login(process.env.BOT_TOKEN);

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  const triggerLikedWords = ["María", "Elisa", "Santiago"];
  const triggerHatedWords = ["Pedro", "pedro"];
  triggerLikedWords.includes(message.content) && message.react("❤️");
  triggerHatedWords.includes(message.content) && message.react("🚩") && message.react("💀");
});
