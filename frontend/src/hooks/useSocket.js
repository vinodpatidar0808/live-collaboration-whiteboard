import { useEffect, useState } from 'react';
import { sendDataToServer } from "../utils";

const useSocket = (isCollaborating, canvasState, setCanvasState, setSharedCanvas, setLoading) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!isCollaborating.collab) {
      socket ? socket.close() : null;
      return;
    }
    // TODO: replace connection url
    setLoading(true);
    const newSocket = new WebSocket('ws://localhost:8080');
    newSocket.onopen = () => {
      setLoading(false);
      console.log('Connection established');
      sendDataToServer(newSocket, isCollaborating, canvasState);
    };
    newSocket.onmessage = (message) => {
      // update canvasState
      const data = JSON.parse(message.data).message;

      if (data?.canvasState) {
        // TODO: modify this to support more than one collaborator.
        setSharedCanvas([data]);
      }
    };
    setSocket(newSocket);
    return () => newSocket.close();
  }, [JSON.stringify(isCollaborating)]);

  return socket;
};

export default useSocket;
