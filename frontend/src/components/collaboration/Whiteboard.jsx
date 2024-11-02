import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const Whiteboard = ({ canvasRef, savedCanvasData, sessionId, currSocket }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const socket = currSocket;

  // Fixed color options with names and hex values
  const colorOptions = [
    { name: 'Red', hex: '#FF0000' },
    { name: 'Green', hex: '#00FF00' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Magenta', hex: '#FF00FF' }
  ];
  const [color, setColor] = useState(colorOptions[0].hex); // Default to the first color
  
  // Fixed line width options
  const lineWidthOptions = [1, 5, 10, 15, 20];
  const [lineWidth, setLineWidth] = useState(lineWidthOptions[0]); // Default to the first width

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && !context) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setContext(ctx);
      socket.emit('getDrawing', (response) => {
        initalDrawing(ctx, response.wb_data);
    });
  }
  }, [canvasRef, context]);

  useEffect(() => {
    if (savedCanvasData && context) {
      const img = new Image();
      img.src = savedCanvasData;
      img.onload = () => context.drawImage(img, 0, 0);
    }
  }, [savedCanvasData, context]);

  const setCanvasSize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const newWidth = canvas.offsetWidth;
      const newHeight = canvas.offsetHeight;

      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        if (context) {
          const imgData = context.getImageData(0, 0, canvas.width, canvas.height);

          canvas.width = newWidth;
          canvas.height = newHeight;

          context.putImageData(imgData, 0, 0);
        } else {
          canvas.width = newWidth;
          canvas.height = newHeight;

          if (context) {
            context.fillStyle = '#fff';
            context.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
      }
    }
  };

  useEffect(() => {
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    return () => window.removeEventListener('resize', setCanvasSize);
  }, [canvasRef, context]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    if (socket) {
      socket.emit('startDrawing', sessionId, offsetX, offsetY, color, lineWidth);
    }
    draw(e);
  };

  const finishDrawing = () => {
    setIsDrawing(false);
    context.beginPath();
    if (socket) {
      socket.emit('endDrawing', sessionId);
    }
  };

  const initalDrawing = (ctx, data) => {
      //Clear the canvas, then load the drawings.
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      //Load drawing
      for (let j = 0; j < data.length; j++) {
        const line = data[j];
        ctx.strokeStyle = line[2];
        ctx.lineWidth = line[3];
        ctx.beginPath();
        ctx.moveTo(line[0], line[1]);
        const drawings = line[4];
        if (drawings) {
          for (let i = 0; i < drawings.length; i++) {
            ctx.lineTo(drawings[i][0], drawings[i][1]);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(drawings[i][0], drawings[i][1]);
          }
        }
        ctx.beginPath();
      }
  }

  const draw = (e) => {
    if (!isDrawing || !context) return;
    const { offsetX, offsetY } = e.nativeEvent;

    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';

    context.lineTo(offsetX, offsetY);
    context.stroke();
    context.beginPath();
    context.moveTo(offsetX, offsetY);

    if (socket) {
      socket.emit('drawing', sessionId, offsetX, offsetY);
    }
  };

useEffect(() => {
    if (socket && context) {
      socket.on('beginDrawing', ({ startX, startY, color, lineWidth }) => {
        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.beginPath();
        context.moveTo(startX, startY);
      });

      socket.on('drawingUpdate', ({ x, y }) => {
        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
      });

      socket.on('finishDrawing', () => {
        context.beginPath();
      });

      socket.on('clearCanvas', () => {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.fillStyle = '#fff';
        context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      });
    }

    return () => {
      if (socket) {
        socket.off('beginDrawing');
        socket.off('drawingUpdate');
        socket.off('finishDrawing');
        socket.off('clearCanvas');
      }
    };
  }, [socket, context]);

const clearCanvas = () => {
  if (context) {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (socket) {
      socket.emit('clearWhiteboard', sessionId);
    }
  }
};

  return (
    <div style={{ textAlign: 'left' }}>
      <h3>Whiteboard</h3>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="colorPicker">Color:</label>
        <select
          id="colorPicker"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ marginLeft: '10px' }}
        >
          {colorOptions.map(({ name, hex }) => (
            <option key={hex} value={hex} style={{ backgroundColor: hex }}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="lineWidth">Line Width:</label>
        <select
          id="lineWidth"
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value, 10))}
          style={{ marginLeft: '10px' }}
        >
          {lineWidthOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={clearCanvas} style={{ marginRight: '10px' }}>
          Clear Canvas
        </button>
      </div>
      <div style={{ marginTop: '20px', marginBottom: '10px' }}>
        <canvas
          ref={canvasRef}
          style={{ border: '1px solid black', width: '100%', height: '400px' }}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
        />
      </div>
    </div>
  );
};

export default Whiteboard;
