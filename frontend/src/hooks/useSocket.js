import { useEffect, useState } from 'react';

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
      const data = {
        message: {
          sessionId: isCollaborating.userDetail.sessionId,
          name: isCollaborating.userDetail.name,
          canvasState: canvasState,
          isOwner: isCollaborating.userDetail.isOwner,
        },
      };
      newSocket.send(JSON.stringify(data));
    };
    newSocket.onmessage = (message) => {
      // update canvasState
      console.log('message: ', message);
      // const parseMessage = JSON.parse(message)
      // console.log('parseMessage: ', parseMessage);
      const data = JSON.parse(message.data).message;
      console.log('data: ', data);

      if (data?.canvasState) {
        console.log('calling canvas update: ');
        setSharedCanvas([data]);
        // setCanvasState(data.canvasState, true);
      }
    };
    setSocket(newSocket);
    return () => newSocket.close();
  }, [JSON.stringify(isCollaborating)]);

  return socket;
};

export default useSocket;
