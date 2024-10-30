import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const Whiteboard = ({ color, setColor, lineWidth, setLineWidth, canvasRef, savedCanvasData, sessionId }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8084');
    setSocket(newSocket);

    newSocket.emit('join', sessionId);

    return () => {
      newSocket.disconnect();
    };
  }, [sessionId]);

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
      <div style={{ marginBottom: '10px' }}>
        <button onClick={clearCanvas} style={{ marginRight: '10px' }}>
          Clear Canvas
        </button>
      </div>
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
