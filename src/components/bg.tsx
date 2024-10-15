/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import React, { useEffect, useRef, useState } from 'react';

interface Character {
  char: string;
  code: number;
}

const characters: Character[] = [
  // Devanagari Characters
  { char: 'अ', code: 2304 },
  { char: 'आ', code: 2305 },
  { char: 'इ', code: 2306 },
  // Code Symbols and Characters
  { char: '!', code: 33 },
  { char: '@', code: 64 },
  // Latin Letters and Numbers
  { char: 'A', code: 65 },
  { char: 'B', code: 66 },
  // Add more characters as needed
];

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);
  // Initialize the ref with an empty array
  const dropsRef = useRef<number[]>([]);

  useEffect(() => {
    setIsClient(true);
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontSize = 16;
    const columns = Math.floor(dimensions.width / fontSize);
    dropsRef.current = Array(columns).fill(1);

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const draw = () => {
      // Directly use dropsRef.current without optional chaining
      const drops = dropsRef.current;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((drop, i) => {
        const charIndex = Math.floor(Math.random() * characters.length);
        const char = characters[charIndex]?.char ?? 'A';
        ctx.fillText(char, i * fontSize, drop * fontSize);

        if (drop * fontSize > canvas.height && Math.random() > 0.975) {
          // Assign a new value without optional chaining
          dropsRef.current[i] = 0;
        } else {
          dropsRef.current[i] = (dropsRef.current[i] ?? 0) + 1; // Use the value directly
        }
      });

      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      // Cleanup code if necessary
    };
  }, [dimensions, isClient]);

  if (!isClient) {
    return null; // Return null on server-side
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      aria-hidden="true"
    />
  );
};

export default MatrixBackground;
