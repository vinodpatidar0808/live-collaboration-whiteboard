import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const Modal = ({ sessionId, setSessionId, showModal, setShowModal, isCollaborating, setIsCollaborating }) => {
  const [name, setName] = useState('');
  // const [sessionId, setSessionId] = useState(sessionId || uuidv4());
  useEffect(() => {
    if (!sessionId && showModal.type === 'startSession') {
      setSessionId(uuidv4());
    }
  }, []);

  const startCollaboration = () => {
    // startSession -> user will start a new session
    // joinSession -> user will join an existing session with given id
      setIsCollaborating({collab: true, userDetail: {name: name, sessionId: sessionId, isOwner: showModal.type === 'startSession'}});
      setShowModal({open: false, type: ''});
  };

  return (
    <div className="z-10 h-full w-full absolute top-0  flex justify-center items-center">
      <div className="w-[50%] h-[50%] flex flex-col items-center justify-center gap-5 shadow-md bg-slate-100 ">
        <p className="text-xl ">Live collaboration</p>
        <div className="flex flex-col gap-4">
          <input
          placeholder="Enter your name"
            type="text"
            value={name}
            className="border-2 rounded-md px-3 py-2"
            onChange={(e) => setName(e.target.value)}
          />

          <input
          placeholder="Enter a session Id to join"
            readOnly={showModal.type === 'startSession'}
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="border-2 rounded-md px-3 py-2"
          />

          <button
            onClick={startCollaboration}
            className={`bg-blue-400 py-2 rounded-md shadow-md disabled:bg-gray-500 ${
              !name.trim() || !sessionId ? 'pointer-events-none bg-gray-400' : 'cursor-pointer'
            }`}>
            {showModal.type === 'startSession' ? "Start Session":"Join Session"}
          </button>
          <button
            className="py-2 rounded-md border-2 shadow-md"
            onClick={() => setShowModal(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
