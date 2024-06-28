import { GoPencil } from 'react-icons/go';
import { LuRectangleHorizontal } from 'react-icons/lu';

const Toolbar = ({ setSelectedTool, selectedTool }) => {
  const changeDrawingElement = (name) => {
    setSelectedTool(name);
  };

  return (
    <div className="flex px-3 py-1 border border-gray-800 rounded-md ">
      <div
        className={`p-1 hover:bg-blue-100 ${selectedTool === 'rectangle' ? 'bg-blue-200' : ''}`}
        onClick={() => {
          changeDrawingElement('rectangle');
        }}>
        <LuRectangleHorizontal />
      </div>
      <div className="border mx-2 border-gray-600"></div>
      <div
        onClick={() => {
          changeDrawingElement('pencil');
        }}
        className={`p-1 hover:bg-blue-100-300 ${selectedTool === 'pencil' ? 'bg-blue-200' : ''}`}>
        <GoPencil />
      </div>
    </div>
  );
};

export default Toolbar;
