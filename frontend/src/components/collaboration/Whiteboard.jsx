import React, { useState, useEffect } from 'react';
import { useSocket } from './SocketContext';

const Whiteboard = ({ color, setColor, lineWidth, setLineWidth, canvasRef, savedCanvasData, sessionId }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit('join', sessionId);
    }
  }, [sessionId, socket]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && !context) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setContext(ctx);
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
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  useEffect(() => {
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    return () => window.removeEventListener('resize', setCanvasSize);
  }, [canvasRef]);

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

  const draw = (e) => {
    if (!isDrawing) return;
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

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (socket) {
      socket.emit('clearWhiteboard', sessionId);
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
        clearCanvas();
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

  return (
    <div style={{ textAlign: 'left' }}>
      <h3>Whiteboard</h3>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="colorPicker">Color:</label>
        <input
          type="color"
          id="colorPicker"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ marginLeft: '10px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="lineWidth">Line Width:</label>
        <input
          type="number"
          id="lineWidth"
          value={lineWidth}
          min="1"
          max="20"
          onChange={(e) => setLineWidth(e.target.value)}
          style={{ marginLeft: '10px', width: '60px' }}
        />
      </div>
      <button
        onClick={clearCanvas}
        style={{
          padding: '10px 15px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}
      >
        Clear
      </button>
      <div style={{ marginTop: '20px', marginBottom: '10px' }}>
        <canvas
          ref={canvasRef}
          style={{ border: '1px solid black', width: '100%', height: '300px' }}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
        />
      </div>
    </div>
  );
};

export default Whiteboard;
