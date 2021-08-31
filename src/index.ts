// import mediasoup from "mediasoup";
import express, { Express } from "express";
import { createServer } from "http";
import config from "./config";
import { Server } from "socket.io";

(async () => {
  const expressApp: Express = express();

  //   let workers: Worker;

  // express middlewares
  expressApp.use(express.json());
  expressApp.use(express.static(__dirname));

  const webServer = createServer(expressApp);

  webServer.on("error", (err) => {
    console.error("starting web server failed:", err.message);
  });

  await new Promise<void>((resolve) => {
    webServer.listen(config.listenPort, config.listenIp, () => {
      const listenIps = config.mediasoup.webRtcTransport.listenIps[0];
      const ip = listenIps.announcedIp || listenIps.ip;
      console.log("server is running");
      console.log(
        `open https://${ip}:${config.listenPort} in your web browser`
      );
      resolve();
    });
  });

  const socketServer = new Server(webServer, {
    path: "/server",
  });

  socketServer.on("message", () => {
    console.log("hello");
  });
})();
