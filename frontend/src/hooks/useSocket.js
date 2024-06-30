import {useState, useEffect } from 'react';

const useSocket = (sessionId, canvasState) => {
  const [socket, setSocket] = useState(null);
 
  useEffect(() => {
    if(!sessionId)  return;
    // TODO: replace connection url
    const newSocket = new WebSocket('ws://localhost:8080');
    newSocket.onopen = () => {
      console.log('Connection established');
      // const dummy = { name: 'vinod', sessionId: sessionId, date: new Date(), canvasState };
      // newSocket.send(JSON.stringify(dummy));
    };
    newSocket.onmessage = (message) => {
      console.log('Message received:', message.data);
      
    };
    setSocket(newSocket);
    return () => newSocket.close();
  }, [sessionId]);

  return socket;
};

export default useSocket;
