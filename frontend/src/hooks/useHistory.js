import { useState } from 'react';
/**
 * This hook is used to maintain the history of the canvas and this will be used to undo and redo the canvas.
 *
 */

export const useHistory = (canvasStartState) => {
  // this currentStage will help us navigate the history stack
  const [currentStage, setCurrentStage] = useState(0);
  // canvasStates is an array of array : each array will store elements at a given stage (one stage is sequence of mousedown, mouse move and mouse up events)
  const [canvasStates, setCanvasStates] = useState([canvasStartState]);

  // overwrite = true -> overwrite current element/shape this will be used when you are moving mouse
  const updateCanvasState = (newValue, overwrite = false) => {
    console.log("typeof newValue: ", typeof newValue, newValue)
    // console.log("CanvasStates: ", canvasStates)
    console.log("updateCanvasState: ", newValue)
    // put condition for the cases when you update state using state setter function-> caused problem in createElement
    const tempValue =
      typeof newValue === 'function' ? newValue(canvasStates[currentStage]) : newValue;
      console.log("tempvalue: ", tempValue)
    if (overwrite) {
      console.log("overwrite: ", overwrite)
      const canvasCopy = [...canvasStates];
      console.log("canvasCopy: ", canvasCopy)
      canvasCopy[currentStage] = tempValue;
      console.log("canvasCopy:, currentStage ", canvasCopy, currentStage);
      setCanvasStates(canvasCopy);
    } else {
      const updatedState = [...canvasStates].slice(0, currentStage + 1);
      console.log("updatedState: ", updatedState);
      setCanvasStates([...updatedState, tempValue]);
      setCurrentStage((curr) => curr + 1);
    }
  };

  // currentStage > 0 -> undo only when canvas is not starting stage (empty canvas)
  const undo = () => currentStage > 0 && setCurrentStage((curr) => curr - 1);
  // currentStage < canvasStates.length -1 -> redo only when canvas is not in latest stage
  const redo = () => currentStage < canvasStates.length - 1 && setCurrentStage((curr) => curr + 1);

  return [canvasStates[currentStage], updateCanvasState, undo, redo];
};
