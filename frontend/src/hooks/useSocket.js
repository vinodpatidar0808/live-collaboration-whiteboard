import { useEffect, useState } from 'react';
import { sendDataToServer } from '../utils';

const useSocket = (isCollaborating, canvasState, setSharedCanvas, setLoading) => {
  const socketURL = import.meta.env.VITE_API_SOCKET_URL;
  const [socket, setSocket] = useState(null);
  console.log('socketURL: ', socketURL);

  useEffect(() => {
    if (!isCollaborating.collab) {
      socket ? socket.close() : null;
      return;
    }
    setLoading(true);
    const newSocket = new WebSocket(socketURL);
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
