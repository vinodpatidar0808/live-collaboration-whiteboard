/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import { tools } from '../utils';

// generator
const generator = rough.generator();
const Canvas = ({ selectedTool }) => {
  const canvasRef = useRef(null);
  const [canvasState, setCanvasState] = useState([]);
  const canvasCoordinatesRef = useRef({});
  // selectedElement will hold current element you are working with, this is introduced to loose connecttion when you release mouse button
  const [selectedElement, setSelectedElement] = useState(null);

  // TODO: remove console.logs once testing done.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      console.log('canvas:', canvas);
      const { x, y, left, right, top, bottom } = canvas.getBoundingClientRect();
      canvasCoordinatesRef.current = { x, y, left, right, top, bottom };
      console.log(canvasCoordinatesRef.current);
      // context: simply the thing on which drawing will be rendered.
      const context = canvas.getContext('2d');
      const rc = rough.canvas(canvas);

      // clears the canvas when loading first time.
      context.clearRect(0, 0, canvas.width, canvas.height);

      // saves the current state of canvas, with all properties like stroke, fills etc.
      context.save();

      // you can use translate to move the canvas to some specific position
      // context.translate(10, 10);

      // startDrawing based on tool selected
      canvasState.forEach((shape) => {
        drawElement(rc, context, shape);
      });
    }
  }, [canvasState, selectedTool]);

  const drawElement = (rc, context, element) => {
    rc.draw(element.rcElement);
  };

  const createElement = (tool, x1, y1, x2, y2) => {
    console.log(tool);
    if (tool === tools.line) {
      // return current elements along with coordinate and type.
      return { tool, x1, y1, x2, y2, rcElement: generator.line(x1, y1, x2, y2) };
    }

    if (tool === tools.rectangle) {
      return generator.rectangle(x1, y1, x2 - x1, y2 - y1);
    }
  };

  // helper function: this will update the shape, coordinate and type of current element we are drawing.
  const updateElement = (tool, x1, y1, x2, y2) => {
    const tempCanvasState = [...canvasState];
    tempCanvasState[tempCanvasState.length - 1] = createElement(tool, x1, y1, x2, y2);
    setCanvasState(tempCanvasState);
  };

  const handleMouseDown = (e) => {
    console.log('mouse button pressed inside canvas', e);
    /**  event.button holds the info about which button is pressed
     * for my mouse: 0 for left button, 1 for wheel button and 2 for right button
     */

    // get coordinate of mouse pointer: this will be starting point for drawing
    // console.log(e.clientX, e.clientY);
    const { clientX, clientY } = e;
    console.log('click: actual ', clientX, clientY);
    const x1 = clientX - canvasCoordinatesRef.current.x;
    const y1 = clientY - canvasCoordinatesRef.current.y;
    console.log('click: calculated: ', x1, y1);
    if (e.button === 1) {
      // wheel mouse button: can do selection and move elements with this
      // for now do nothing
      return;
    }

    if (e.button === 0) {
      // left mouse button: start drawing from here

      const element = createElement(selectedTool, x1, y1, x1, y1);
      console.log("element", element);
      // store element
      setCanvasState((curr) => [...curr, element]);
      setSelectedElement(element);
    }
  };

  const handleMouseMove = (e) => {
    // when you are moving inside canvas without pressing mouse button first, this will throw error when there are no elements in canvasState.
    if (canvasState.length === 0) return;

    // get mouse coordinates at each mouse movement, as we will store temporary drawing untill mouse button is released.
    const { clientX, clientY } = e;
    const x2 = clientX - canvasCoordinatesRef.current.x;
    const y2 = clientY - canvasCoordinatesRef.current.y;

    // the element under process will be last in the elements state
    const lastElement = canvasState[canvasState.length - 1];
    const { x1, y1 } = lastElement;
    // keep updating the current element as long as mouse button is pressed and mouse is moving inside canvas.
    updateElement(selectedTool, x1, y1, x2, y2);
    // console.log(x1, y1);
  };

  const handleMouseUp = (e) => {
    // console.log("mouse button released inside canvas",e)
    setSelectedElement(null);
  };

  return (
    /**
     * when drawing on canvas primarily 3 things will happen: (handle this 3 events as first step for drawing lines and rectangles then scale for other shapes)
     * 1. you pres the mouse button on the canvas
     * 2. you start moving the mouse
     * 3. and you stop the mouse and release the mouse button
     * */

    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className=" w-10/12 h-4/6 border-2 border-gray-950 box-border"></canvas>
  );
};

export default Canvas;
