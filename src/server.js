const app = require("./app");
const http = require("http");
const { PORT } = require("../config/config");
const cors = require("cors");

// const server = http.createServer(app);
// const SocketServer = require("../socket");
// SocketServer(server);

// const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
