import { join } from "path";
import { unlinkSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { baseFolder } from "./email_config.json";
import { createLogger, transports } from "winston";

const logFolder = `/home/mateo/Desktop/projects/jobScraper/src/emailer/logs`;
export const getLogger = () => {
  if (logger) return logger;
  return createLogger({
    transports: [
      new transports.Console(),
      new transports.File({ level: "info", filename: `${logFolder}/logs.log` }),
      new transports.File({
        level: "error",
        filename: `${logFolder}/exceptions.log`,
      }),
    ],
  });
};
export let logger: any = getLogger();

export const deleteFile = (path: string) => unlinkSync(path);
export const writeToFile = (path: string, data: any) => writeFileSync(path, data);

export const getAllPendingEmailFiles = () => {
  const pendingDirectory = `${baseFolder}/src/emails/pending`;
  const filePaths = readdirSync(pendingDirectory);
  return filePaths.map((path: string) => ({
    filePath: join(pendingDirectory, path),
    content: readFileSync(join(pendingDirectory, path)),
  }));
};
