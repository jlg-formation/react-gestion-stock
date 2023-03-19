console.log("About to start a server");

import express, { Request, Response } from "express";
import fs from "fs/promises";
import serveIndex from "serve-index";
import { pathToFileURL } from "url";
import api from "./api";

const app = express();
const port = +(process.env.GSTOCK_PORT || 3000);
const publicDir = "../front/dist/client";
const serverDir = "../front/dist/server";

const ssrMiddleware = (req: Request, res: Response) => {
  (async () => {
    const template = await fs.readFile(publicDir + "/index.html", "utf-8");
    const serverFile = pathToFileURL(serverDir + "/entry-server.js").toString();
    const render = (await import(serverFile)).render;
    const appHtml = await render(req);
    const html = template.replace(`<!--ssr-outlet-->`, appHtml);
    res.status(200).send(html);
  })();
};

app.use((req, res, next) => {
  console.log("req: ", req.method, req.url);
  next();
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

app.use("/api", api);

app.get("/", ssrMiddleware);

app.use(express.static(publicDir));
app.use(serveIndex(publicDir, { icons: true }));

app.use("*", ssrMiddleware);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
