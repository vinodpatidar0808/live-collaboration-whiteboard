const express = require('express');
const ws = require('ws');

const app = express();

const port = process.env.PORT || 8080;


const httpServer = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
})

const wss = new ws.WebSocketServer({server: httpServer});
const rooms = {};
const canvasState = {};

wss.on('connection', function connection(ws){
  ws.on('error', console.error);

  // this will send messages to other member when it receives a message from one of the client
  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach(function each(client) {
      const parsedData = JSON.parse(data).message;
      // if room exist, store the information of joined client
      if(rooms[parsedData.sessionId]){
        rooms[parsedData.sessionId][parsedData.name] = {name:parsedData.name, owner: parsedData.isOwner};
        canvasState[parsedData.sessionId] = parsedData.canvasState;
      }else{
        // create new room and store the information of owner
        rooms[parsedData.sessionId] = {[parsedData.name]:{name:parsedData.name, owner: parsedData.isOwner}};
        canvasState[parsedData.sessionId] = parsedData.canvasState;
      }

      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(data, {binary: isBinary});
      }
    }); 
  })

})