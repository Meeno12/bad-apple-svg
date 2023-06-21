const http = require("http");
const fs = require("fs");
const url = require("url");
const config = require("../appConfig.json");

const host = config.host;
const port = config.port;
const routes = {
  ["/config/appConfig.json"]: (res) => {
    res.writeHead(200);
    res.end(fs.readFileSync("./appConfig.json"));
  },
};

fs.readdirSync("./src/assets").forEach((x, i) => {
  routes["/assets/" + x] = (res) => {
    res.writeHead(200);
    res.end(fs.readFileSync("./src/assets/" + x));
  };
});

const server = http.createServer((req, res) => {
  const path = url.parse(req.url).path;

  if (routes[path]) return routes[path](res);
  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  res.end(fs.readFileSync("./index.html").toString());
});
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
