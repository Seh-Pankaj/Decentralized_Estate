const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const {
  writeJsonFileSync,
  pushJsonFileSync,
  readJsonFileSync,
} = require("./fsC");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

const allowedOrigins = [
  "http://192.168.1.9:5173", // <- frontend-host
  // Add more allowed origins here
];

// Middleware to enable CORS with dynamic origin
app.use(
  cors({
    origin: (origin, callback) => {
      console.log(origin, " tried to hit a req");
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Use express.json() middleware with a 10MB limit
app.use(express.json({ limit: "10mb" }));

let onlineUser = [];
const connectedSockets = {};

app.get("/all", (req, res) => {
  res.send(onlineUser);
});

//____________________________________________________
app.get("/confirm/:id", (req, res) => {
  const query = req.params.id;
  try {
    const data = {};
    data[query] = connectedSockets[query].id;
    res.send(data);
  } catch (err) {
    res.send("client not found");
  }
});
//____________________________________________________
app.post("/addData", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const keys = Object.keys(connectedSockets);
  const randomIndex = Math.floor(Math.random() * keys.length);
  try {
    const socket = connectedSockets[keys[randomIndex]];
    console.log(`data to be stored at ${socket.clientId} `);
    socket.emit("createDag", data, (response) => {
      pushJsonFileSync("./output.json", response.response, socket.clientId);
      console.log("sending response...");
      res.send(response);
    });
  } catch (err) {
    res.send("client not found");
  }
});

//_____________________________________________________
app.get("/getData/:cid", (req, res) => {
  const data = readJsonFileSync("output.json");

  const cid = req.params.cid;
  const id = data[cid];
  try {
    const socket = connectedSockets[id];
    socket.emit("getDag", cid, (response) => {
      console.log(response);
      res.json(response);
    });
  } catch (err) {
    res.send("client not found");
  }
});
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

io.on("connection", (socket) => {
  socket.on("register", (clientId) => {
    console.log("Client registered with ID:", clientId);
    socket.clientId = clientId; // Store clientId in the socket instance
    connectedSockets[clientId] = socket;
  });
  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.clientId);
    if (socket.clientId) {
      delete connectedSockets[socket.clientId];
    }
  });
});

const PORT = process.env.PORT || 4007;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
