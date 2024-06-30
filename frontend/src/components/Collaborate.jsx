import {  useState } from 'react';
import { createPortal } from 'react-dom';
import Modal from "./Modal";


const Collaborate = ({ sessionId, setSessionId, isCollaborating, setIsCollaborating }) => {
  const [showModal, setShowModal] = useState({open: false, type: ''});

  const handleBoardShare = (type) => {
    if(type === 'startSession') {
      setShowModal({open: true, type: 'startSession'});
    }else{
      setShowModal({open: true, type: 'joinSession'});
    }
  };

  return (
    <>
      <div>
        <button
          onClick={() => handleBoardShare("startSession")}
          className="text-md px-3 py-2 bg-blue-400 rounded-md shadow-md absolute top-24 right-10 ">
          Share board
        </button>
        <button onClick={()=>handleBoardShare("joinSession")} className="text-md px-3 py-2 bg-blue-400 rounded-md shadow-md absolute top-44 right-10 ">
          Join session
        </button>
      </div>
      {showModal.open && createPortal(<Modal showModal={showModal} setShowModal={setShowModal} sessionId={sessionId} setSessionId={setSessionId} isCollaborating={isCollaborating} setIsCollaborating={setIsCollaborating} />, document.body)}
    </>
  );
};

export default Collaborate;
