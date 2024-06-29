/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import { useHistory } from '../hooks/useHistory';
import { tools } from '../utils';

// generator
const generator = rough.generator();

const Canvas = ({ selectedTool }) => {
  const canvasRef = useRef(null);
  const [canvasState, setCanvasState, undo, redo] = useHistory([]);
  const canvasCoordinatesRef = useRef({});
  // selectedElement will hold current element you are working with, this is introduced to loose connecttion when you release mouse button
  const [selectedElement, setSelectedElement] = useState(null);

  // TODO: remove console.logs once testing done.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const { x, y, left, right, top, bottom } = canvas.getBoundingClientRect();

      canvasCoordinatesRef.current = {
        x: Math.floor(x),
        y: Math.floor(y),
        left: Math.floor(left),
        right: Math.floor(right),
        top: Math.floor(top),
        bottom: Math.floor(bottom),
      };
      // context: simply the thing on which drawing will be rendered.
      const context = canvas.getContext('2d');
      const rc = rough.canvas(canvas);

      // clears the canvas .
      context.clearRect(0, 0, canvas.width, canvas.height);

      // saves the current state of canvas, with all properties like stroke, fills etc.
      context.save();

      // you can use translate to move the canvas to some specific position
      // context.translate(10, 10);

      // drawElement(rc, context);
      // startDrawing based on tool selected
      canvasState.forEach((shape) => {
        drawElement(rc, context, shape);
      });
      // restores the most recently saved canvas state by popping the top entry in the drawing state stack.
      context.restore();
    }
  }, [canvasState, selectedElement]);

  useEffect(() => {
    const undoRedo = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        undo();
      } else if (e.ctrlKey && e.key === 'y') {
        redo();
      }
    };

    document.addEventListener('keydown', undoRedo);

    return () => document.removeEventListener('keydown', undoRedo);
  }, []);

  const drawElement = (rc, context, element) => {
    rc.draw(element.rcElement);
  };

  const createElement = (id, tool, x1, y1, x2, y2) => {
    if (tool === tools.line) {
      // return current elements along with coordinate and type.
      return { id, tool, x1, y1, x2, y2, rcElement: generator.line(x1, y1, x2, y2) };
    }

    if (tool === tools.rectangle) {
      // generator.rectangle(x1, y1, width, height, height))
      return { id, tool, x1, y1, x2, y2, rcElement: generator.rectangle(x1, y1, x2 - x1, y2 - y1) };
    }
  };

  const adjustElementCoordinates = (element) => {
    const { type, x1, y1, x2, y2 } = element;
    if (type === 'rectangle') {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    } else {
      if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return { x1, y1, x2, y2 };
      } else {
        return { x1: x2, y1: y2, x2: x1, y2: y1 };
      }
    }
  };

  const getMouseCoordinatesRelativeToCanvas = (e) => {
    const { clientX, clientY } = e;
    return {
      x: clientX - canvasCoordinatesRef.current.x,
      y: clientY - canvasCoordinatesRef.current.y,
    };
  };

  // helper function: this will update the shape, coordinate and type of current element we are drawing.
  const updateElement = (id, tool, x1, y1, x2, y2) => {
    const tempCanvasState = [...canvasState];
    tempCanvasState[id] = createElement(id, tool, x1, y1, x2, y2);
    setCanvasState(tempCanvasState, true);
  };

  const handleMouseDown = (e) => {
    /**  event.button holds the info about which button is pressed
     * 0 for left button, 1 for wheel button and 2 for right button
     */

    // get coordinates of mouse pointer: this will be starting point for drawing
    // console.log(e.clientX, e.clientY);
    const { x, y } = getMouseCoordinatesRelativeToCanvas(e);
    // return;

    if (e.button === 0) {
      // left mouse button: start drawing from here
      // TODO: store id for each element, will be needed when updating a particular element or moving/selecting
      // TODO: generate unique id using uuid or something else.
      const id = canvasState.length;
      const element = createElement(id, selectedTool, x, y, x, y);
      // store element
      setCanvasState((curr) => [...curr, element]);

      // store currently selected element
      setSelectedElement(element);
    }

    if (e.button === 1) {
      // wheel mouse button: can do selection and move elements with this
      // for now do nothing
      return;
    }
  };

  const handleMouseMove = (e) => {
    // when you are moving inside canvas without pressing mouse button first, this will throw error when there are no elements in canvasState.
    if (canvasState.length === 0 || !selectedElement) return;
    const { x, y } = getMouseCoordinatesRelativeToCanvas(e);

    // get mouse coordinates at each mouse movement, as we will store temporary drawing untill mouse button is released.

    // the element under process will be last in the elements state
    const ind = canvasState.length - 1;
    const lastElement = canvasState[ind];
    const { x1, y1 } = lastElement;
    // keep updating the current element as long as mouse button is pressed and mouse is moving inside canvas.
    updateElement(ind, selectedTool, x1, y1, x, y);
    // console.log(x1, y1);
  };

  const handleMouseUp = (e) => {
    // console.log("mouse button released inside canvas",e)
    const index = selectedElement.id;
    const { id, tool } = canvasState[index];
    const { x1, y1, x2, y2 } = adjustElementCoordinates(canvasState[index]);
    updateElement(id, tool, x1, y1, x2, y2);
    setSelectedElement(null);
  };

  return (
    /**
     * when drawing on canvas primarily 3 things will happen: (handle this 3 events as first step for drawing lines and rectangles then scale for other shapes)
     * 1. you pres the mouse button on the canvas
     * 2. you start moving the mouse
     * 3. and you stop the mouse and release the mouse button
     * */

    // Learning: width and height you have to provide specifically to canvas else it will take default width and height
    <canvas
      ref={canvasRef}
      width={"1000px"}
      height={"500px"}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className=" bg-white shadow-md box-border "></canvas>
  );
};

export default Canvas;
