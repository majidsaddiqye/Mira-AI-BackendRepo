require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/db/db");
const initSocketServer = require("./src/sockets/socket.server");
const httpServer = require("http").createServer(app);

// Connect Database
connectDB();

//Socketio Server
initSocketServer(httpServer);

//Server Start
const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  console.log(`Server is Listening on port ${PORT}`);
});
