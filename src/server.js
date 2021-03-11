const app = require("./app");
const http = require("http");
const { PORT } = require("../config/config");

const server = http.createServer(app);
const SocketServer = require("../socket");
SocketServer(server);

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
