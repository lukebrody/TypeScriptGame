import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { AddressInfo } from 'net';
import Timer = NodeJS.Timer;

const app = express();

app.use(express.static("../client/build"))

// initialize a simple http server
const server = http.createServer(app);

// initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

let timer: Timer;

wss.on('connection', (ws: WebSocket) => {
    console.log('connection recieved');
});

// start our server
server.listen(process.env.PORT || 8080, () => {
    console.log(`Server started on port ${(server.address() as AddressInfo).port} :)`);
});