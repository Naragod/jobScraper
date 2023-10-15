import express from "express";
import { searchRouter } from "./routers/search";
import { workerRouter } from "./routers/worker";

export const server = express();

server.use(express.json());
server.use("/search", searchRouter);
server.use("/worker", workerRouter);
