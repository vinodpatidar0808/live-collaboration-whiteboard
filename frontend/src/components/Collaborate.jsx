import { useState, useEffect } from 'react';
import {createPortal} from "react-dom";

const Collaborate = ({setSessionId}) => {
  const [showModal, setShowModal] = useState(false);

  const handleBoardShare = () => {
    console.log("sharing board.")
    setSessionId("firstboard-sharing");
  };

  const Modal = () => {
    return (
      <div>show modal</div>
    )
  }

  return (
    <>
      <div>
        <button
          onClick={handleBoardShare}
          className="text-md px-3 py-2 border bg-blue-400 rounded-md absolute top-24 right-10 ">
          Share board
        </button>
      </div>
      {showModal && (createPortal(
        <Modal />,
        document.body
      )) }
    </>
  );
};

export default Collaborate;
