import server from "../app.js";
import { Server } from 'socket.io';
const io = new Server(server);
io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});
