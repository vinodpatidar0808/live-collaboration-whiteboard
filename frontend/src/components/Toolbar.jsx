// this is not the way i will use icon in production level project, i will use icons from one family, so that they look consisten, using here different icons to reduce search time and focus more on important stuff.
import { GoPencil } from 'react-icons/go';
import { LiaRedoSolid, LiaUndoSolid } from 'react-icons/lia';
import { LuRectangleHorizontal } from 'react-icons/lu';
import { PiLineVertical } from 'react-icons/pi';

import { tools } from './../utils';

const Toolbar = ({ setSelectedTool, selectedTool, undo, redo }) => {
  const changeDrawingElement = (name) => {
    setSelectedTool(name);
  };

  const handleUndoRedo = (type) => {
    if (type === 'undo') {
      undo();
    } else {
      redo();
    }
  };

  return (
    <div className="flex overflow-hidden  border border-gray-800 rounded-md shadow-md ">
      <div
        className={`py-1 px-2 border-r-2 border-gray-500 hover:bg-blue-100  ${
          selectedTool === tools.line ? 'bg-blue-200' : ''
        }`}
        onClick={() => {
          changeDrawingElement(tools.line);
        }}>
        <PiLineVertical className="rotate-45" />
      </div>
      <div
        className={`py-1 px-2 border-r-2 border-gray-500 hover:bg-blue-100 ${
          selectedTool === tools.rectangle ? 'bg-blue-200' : ''
        }`}
        onClick={() => {
          changeDrawingElement(tools.rectangle);
        }}>
        <LuRectangleHorizontal />
      </div>
      <div
        onClick={() => {
          changeDrawingElement(tools.pencil);
        }}
        className={`py-1 px-2 border-r-2 border-gray-500 hover:bg-blue-100 ${
          selectedTool === tools.pencil ? 'bg-blue-200' : ''
        }`}>
        <GoPencil />
      </div>
      <div
        onClick={() => handleUndoRedo('undo')}
        className={`py-1 px-2 border-r-2 border-gray-500 hover:bg-blue-100`}>
        <LiaUndoSolid />
      </div>
      <div
        onClick={() => handleUndoRedo('redo')}
        className={`py-1 px-2  hover:bg-blue-100`}>
        <LiaRedoSolid />
      </div>
    </div>
  );
};

export default Toolbar;
