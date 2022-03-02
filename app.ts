import { githubRouter } from "./routes/githubPullRequest.routes";
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import "./bot";
export const app = express();
const BACKED_PORT = 5000;

//  Universal Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Universal endpoints
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  console.log("/ route is working");
  res.json("/ route is working.");
});

//  Routes
app.use("/github/pull-request", githubRouter);

//  Initialization
const { PORT: SERVER_PORT_PRODUCTION, SERVER_PORT_DEVELOPMENT, NODE_ENV } = process.env;
let usedBackedPort = false;

/* istanbul ignore next */
if (NODE_ENV !== "test" && (SERVER_PORT_DEVELOPMENT || SERVER_PORT_PRODUCTION)) {
  let PORT = Number(NODE_ENV === "production" ? SERVER_PORT_PRODUCTION : SERVER_PORT_DEVELOPMENT);
  if (!PORT) {
    PORT = BACKED_PORT;
    usedBackedPort = true;
  }
  app.listen(PORT, () => {
    console.log(`### ----- Environment: ${NODE_ENV} ----- ####`);
    console.log(`Bot server ${usedBackedPort ? "backed up" : "booted"} in port ${PORT}`);
  });
}
