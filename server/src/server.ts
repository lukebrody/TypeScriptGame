import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { AddressInfo } from 'net';

const app = express();

app.use(express.static("../client/build"))

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

let sockets: Set<WebSocket> = new Set<WebSocket>();

wss.on('connection', (ws: WebSocket) => {
    ws.onopen = event => {
        sockets.add(ws);
    };
    ws.close = event => {
        sockets.delete(ws);
    }
    ws.onmessage = event => {
        sockets.forEach(otherSocket => {
            if(otherSocket != ws) {
                otherSocket.send(event.data);
            }
        });
    };
});

server.listen(process.env.PORT || 8080, () => {
    console.log(`Server started on port ${(server.address() as AddressInfo).port} :)`);
});