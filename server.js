const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let lightsStatus = {};
const numberOfLights = 100;
for (let i = 0; i < numberOfLights; i++) {
    lightsStatus[i] = 'off';
}

app.use(express.static('.')); // Serve static files

wss.on('connection', (ws) => {
    ws.send(JSON.stringify({ type: 'init', lightsStatus }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        lightsStatus[data.lightId] = lightsStatus[data.lightId] === 'on' ? 'off' : 'on';

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ lightId: data.lightId, status: lightsStatus[data.lightId] }));
            }
        });
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
