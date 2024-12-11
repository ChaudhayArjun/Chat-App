const express = require("express");
const http = require("http");
const WebSocket = require("ws");

// Create an Express app
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files
app.use(express.static("public"));

// Store connected clients
const clients = new Map();

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const parsedData = JSON.parse(data);

    if (parsedData.type === "join") {
      clients.set(parsedData.username, ws);
      console.log(`${parsedData.username} joined`);
    } else if (parsedData.type === "message") {
      const { username, message } = parsedData;

      // Broadcast message to all users
      clients.forEach((client, clientUsername) => {
        client.send(
          JSON.stringify({
            type: "message",
            username,
            message,
          })
        );
      });
    }
  });

  ws.on("close", () => {
    clients.forEach((client, username) => {
      if (client === ws) {
        clients.delete(username);
        console.log(`${username} left`);
      }
    });
  });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
