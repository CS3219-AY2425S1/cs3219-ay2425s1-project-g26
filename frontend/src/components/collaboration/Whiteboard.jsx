import React, { useRef, useEffect, useState } from 'react';

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setContext(ctx);
  }, []);

  const setCanvasSize = () => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  useEffect(() => {
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    return () => window.removeEventListener('resize', setCanvasSize);
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const finishDrawing = () => {
    setIsDrawing(false);
    context.beginPath();
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div style={{ textAlign: 'left', padding: '0px' }}>
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
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007BFF')}
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
