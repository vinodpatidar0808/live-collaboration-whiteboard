import { useState } from 'react';

import Canvas from "./components/Canvas"
import Toolbar from "./components/Toolbar";

// styles
import './App.css'

function App() {
  const [selectedTool, setSelectedTool] = useState("line");
  return (
    <div className="h-screen w-screen bg-gray-300 flex flex-col items-center gap-4  ">
      <main className="text-3xl font-bold">Hello white board</main>
      <Toolbar
        setSelectedTool={setSelectedTool}
        selectedTool={selectedTool}
      />
      <Canvas selectedTool={selectedTool} />
    </div>
  );
}

export default App;
