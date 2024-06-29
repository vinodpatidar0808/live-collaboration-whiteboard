// this is not the way i will use icon in production level project, i will use icons from one family, so that they look consisten, using here different icons to reduce search time and focus more on important stuff.
import { GoPencil } from 'react-icons/go';
import { LuRectangleHorizontal } from 'react-icons/lu';
import { PiLineVertical } from 'react-icons/pi';
import { tools } from './../utils';

const Toolbar = ({ setSelectedTool, selectedTool }) => {
  const changeDrawingElement = (name) => {
    setSelectedTool(name);
  };

  return (
    <div className="flex px-3 py-1 border border-gray-800 rounded-md ">
      <div
        className={`p-1 hover:bg-blue-100  ${selectedTool === tools.line ? 'bg-blue-200' : ''}`}
        onClick={() => {
          changeDrawingElement(tools.line);
        }}>
        <PiLineVertical className="rotate-45" />
      </div>
      <div
        className={`p-1 hover:bg-blue-100 ${selectedTool === tools.rectangle ? 'bg-blue-200' : ''}`}
        onClick={() => {
          changeDrawingElement(tools.rectangle);
        }}>
        <LuRectangleHorizontal />
      </div>
      <div className="border mx-2 border-gray-600"></div>
      <div
        onClick={() => {
          changeDrawingElement(tools.pencil);
        }}
        className={`p-1 hover:bg-blue-100-300 ${selectedTool === tools.pencil ? 'bg-blue-200' : ''}`}>
        <GoPencil />
      </div>
    </div>
  );
};

export default Toolbar;
