import { typeHelpForHelpMessage } from "../../constants";
import { COMMANDS } from "../commands-list";

export const usageMessage = `Invalid use of command. Usage: \`${COMMANDS.commentInPR} comment\`. ${typeHelpForHelpMessage}`;
export const commandMustBeSentInAThreadMessage = `Send the command \`${COMMANDS.commentInPR}\` inside a Thread Channel.`;
