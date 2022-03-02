import { ServerMessage } from "./ServerMessage";

export const error400BadRequestResponse = new ServerMessage("error", 400, "Bad Request");
export const server200Response = new ServerMessage("Received", 200);
export const server200ResponseNoPRComment = new ServerMessage("Received. It's not a PR comment.", 200);
export const server200ResposePRcomment = new ServerMessage("Received. PR comment", 200);
