import { createLogger, transports, format } from "winston";

/**
 * This code snippet exports a logger object that is created using the Winston library.
 * The logger has a single transport, which is the Console transport.
 * The logger's format is a combination of colorize, timestamp, and printf formats.
 * The printf format is a function that takes a timestamp, level, and message as parameters and returns a formatted log message.
 * The log message is in the format "[timestamp] level: message".
 */
export const logger = createLogger({
    transports: [new transports.Console()],
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    ),
  });