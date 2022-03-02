import { typeHelpForHelpMessage } from "../../constants";
import { COMMANDS } from "./../commands-list";
const MAXIMUM_QUANTITY_OF_BULK_DELETE = 100;
export const usageMessage = `Invalid parameters received for command: \`${COMMANDS.clear}\` or you don't have enough permissions to do this operation. ${typeHelpForHelpMessage}`;
export const invalidNumberOfMessagesToDelete = `Maximum quantity of messages to be removed is ${MAXIMUM_QUANTITY_OF_BULK_DELETE}`;
