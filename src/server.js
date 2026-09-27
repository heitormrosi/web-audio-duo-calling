const express = require("express");
const path = require("node:path");
const http = require("node:http");
const { Server } = require("socket.io");

const app = express();

app.use(express.static(path.resolve(__dirname, "..", "public")));

const server = http.createServer(app);

const io = new Server(server);

io.on("connection", socket => {
    socket.on("localDescription", msg => {
        socket.broadcast.emit("localDescription", msg);
    });

    socket.on("iceCandidate", msg => {
        socket.broadcast.emit("iceCandidate", msg);
    });
});

server.listen(3000, () => {
    console.log("0.0.0.0:3000");
});