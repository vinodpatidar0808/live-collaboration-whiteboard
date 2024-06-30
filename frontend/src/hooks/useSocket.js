import {useState, useEffect } from 'react';

const useSocket = (isCollaborating, canvasState) => {
  const [socket, setSocket] = useState(null);
 
  useEffect(() => {
    if(!isCollaborating.collab){
      socket ? socket.close(): null;
      return;
    };
    // TODO: replace connection url
    const newSocket = new WebSocket('ws://localhost:8080');
    newSocket.onopen = () => {
      console.log('Connection established');
      const data = {
        message:{
          sessionId: isCollaborating.userDetail.sessionId,
          name: isCollaborating.userDetail.name,
          canvasState: canvasState,
          isOwner: isCollaborating.userDetail.isOwner
        }
      }
      newSocket.send(JSON.stringify(data));
    };
    newSocket.onmessage = (message) => {
      console.log('Message received:', message.data);
      
    };
    setSocket(newSocket);
    return () => newSocket.close();
  }, [JSON.stringify(isCollaborating), JSON.stringify(canvasState)]);

  return socket;
};

export default useSocket;
