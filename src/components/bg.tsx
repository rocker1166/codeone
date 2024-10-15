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
  { char: 'ई', code: 2307 },
  { char: 'उ', code: 2308 },
  { char: 'ऊ', code: 2309 },
  { char: 'ऋ', code: 2310 },
  { char: 'ए', code: 2311 },
  { char: 'ऐ', code: 2312 },
  { char: 'ओ', code: 2313 },
  { char: 'औ', code: 2314 },
  { char: 'अं', code: 2319 },
  { char: 'अः', code: 2320 },
  // More Devanagari characters can be added here

  // Code Symbols and Characters
  { char: '!', code: 33 },
  { char: '@', code: 64 },
  { char: '#', code: 35 },
  { char: '$', code: 36 },
  { char: '%', code: 37 },
  { char: '^', code: 94 },
  { char: '&', code: 38 },
  { char: '*', code: 42 },
  { char: '(', code: 40 },
  { char: ')', code: 41 },
  { char: '-', code: 45 },
  { char: '=', code: 61 },
  { char: '{', code: 123 },
  { char: '}', code: 125 },
  { char: '[', code: 91 },
  { char: ']', code: 93 },
  { char: '|', code: 124 },
  { char: '\\', code: 92 },
  { char: ':', code: 58 },
  { char: ';', code: 59 },
  { char: '"', code: 34 },
  { char: "'", code: 39 },
  { char: '<', code: 60 },
  { char: '>', code: 62 },
  { char: ',', code: 44 },
  { char: '.', code: 46 },
  { char: '/', code: 47 },

  // Latin Letters
  ...Array.from({ length: 26 }, (_, i) => ({
    char: String.fromCharCode(65 + i), // A-Z
    code: 65 + i,
  })),
  ...Array.from({ length: 26 }, (_, i) => ({
    char: String.fromCharCode(97 + i), // a-z
    code: 97 + i,
  })),

  // Digits
  ...Array.from({ length: 10 }, (_, i) => ({
    char: String(i), // 0-9
    code: 48 + i,
  })),

 
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
