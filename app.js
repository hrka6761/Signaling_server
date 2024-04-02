import { HTTP_PORT, WEBSOCKET_PORT } from "./utilities/env.js";
import express from "express";
import { WebSocketServer } from "ws";
import {
  onMessageSignaling,
  onCloseSignaling,
} from "./user_signaling_routers.js";

const http = express();
const signaling = new WebSocketServer({ port: WEBSOCKET_PORT });

http.listen(HTTP_PORT, () => {
  console.log("API listening on port " + HTTP_PORT);
});

signaling.on("connection", (ws) => {
  ws.on("error", console.error);
  ws.on("message", (data, isBinary) => onMessageSignaling(ws, data, isBinary));
  ws.on("close", (code, reason) => onCloseSignaling(ws, code, reason));
});
