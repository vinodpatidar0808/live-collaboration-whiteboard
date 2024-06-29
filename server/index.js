const express = require('express');
const ws = require('ws');

const app = express();

const port = process.env.PORT || 8080;


const httpServer = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})

const wss = new ws.WebSocketServer({server: httpServer});

wss.on('connection', function connection(ws){
  ws.on('error', console.error);
  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(data, {binary: isBinary});
      }
    }); 
  })
})