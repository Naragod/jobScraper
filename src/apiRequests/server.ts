import express from "express";
import { queryRouter } from "./routers/query";
import { searchRouter } from "./routers/search";
import { workerRouter } from "./routers/worker";

export const server = express();

server.use(express.json());
server.use("/query", queryRouter);
server.use("/search", searchRouter);
server.use("/worker", workerRouter);
