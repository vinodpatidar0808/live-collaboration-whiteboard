import { useState } from "react"
import Canvas from './../components/Canvas';
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
    // console.log("typeof newValue: ", typeof newValue, newValue)
    // console.log("CanvasStates: ", canvasStates)
    // console.log("updateCanvasState: ", newValue)
    // put condition for the cases when you update state using state setter function-> caused problem in createElement
    const tempValue = typeof newValue === "function" ? newValue(canvasStates[currentStage]) : newValue;

        if (overwrite) {
          const canvasCopy = [...canvasStates];
          canvasCopy[currentStage] = tempValue;
          setCanvasStates(canvasCopy);
        } else {
          const updatedState = [...canvasStates].slice(0, currentStage + 1);
          setCanvasStates([...updatedState, tempValue]);
          setCurrentStage((curr) => curr + 1);
        }
  }

  // currentStage > 0 -> undo only when canvas is not starting stage (empty canvas)
  const undo = () => currentStage>0 && setCurrentStage(curr => curr - 1);
  // currentStage < history.length -1 -> redo only when canvas is not in latest stage 
  const redo = () => currentStage<history.length-1 && setCurrentStage(curr => curr + 1);


  return [canvasStates[currentStage], updateCanvasState, undo, redo];
}