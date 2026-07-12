import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Ultra-Premium SaaS AI Avatar: "Liquid Metal Bubble"
 * Uses an advanced SVG Gooey Filter applied to spinning metallic gradients
 * to create a mesmerizing, hyper-realistic liquid mercury/lava-lamp effect.
 */
export default function RobotAvatar({
  expression = 'smile',
  size = 'md',
  glowColor = '#00e5ff',
  isTyping = false,
  className = '',
  style = {}
}) {
  const sizeMap = { lg: 240, md: 140, sm: 64, xs: 36 };
  const d = sizeMap[size] || sizeMap.md;

  const isSleep = expression === 'sleep';
  const isError = expression === 'dizzy' || expression === 'sad' || expression === 'cry';

  const activeColor = isError ? '#f43f5e' : glowColor;
  
  // Base speed multiplier. Sleep is slow, Typing is fast.
  const speed = isTyping ? 0.4 : isSleep ? 2.5 : 1;

  // Unique ID for the SVG filter to avoid collisions if multiple avatars are rendered on the same page
  const filterId = useMemo(() => `gooey-${Math.random().toString(36).substr(2, 9)}`, []);

  // Extremely realistic metallic liquid gradients.
  // The harsh contrast from white to color to black gives it a glossy, 3D rendered look.
  const liquidGradient = `radial-gradient(circle at 35% 35%, #ffffff 0%, ${activeColor} 45%, #111111 90%)`;
  const hotGradient = `radial-gradient(circle at 35% 35%, #ffffff 0%, #ffffff 40%, ${activeColor} 90%)`;

  return (
    <div className={`ai-liquid-metal ${className}`} style={{
      width: d, height: d,
      position: 'relative',
      // Drop shadow applies to the final merged gooey shape, lifting it off the page
      filter: `drop-shadow(0 ${d*0.05}px ${d*0.1}px ${activeColor}60)`,
      ...style
    }}>
      
      {/* 1. Invisible SVG defining the Gooey Liquid Filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id={filterId}>
            {/* The blur amount dictates how "sticky" or "viscous" the liquid is */}
            <feGaussianBlur in="SourceGraphic" stdDeviation={d * 0.07} result="blur" />
            {/* The color matrix crushes the alpha channel back to sharp edges, melting overlapping shapes together */}
            <feColorMatrix in="blur" mode="matrix" values="
              1 0 0 0 0  
              0 1 0 0 0  
              0 0 1 0 0  
              0 0 0 25 -10" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* 2. Gooey Physics Container */}
      <div style={{
        width: '100%', height: '100%',
        position: 'absolute',
        // Apply the liquid metal filter to all children inside this container
        filter: `url(#${filterId})`,
      }}>
        
        {/* Central Core Metal Mass */}
        <motion.div
          animate={{ scale: isTyping ? [0.9, 1.1, 0.9] : [1, 1.05, 1] }}
          transition={{ duration: 3 * speed, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '20%', left: '20%',
            width: '60%', height: '60%',
            borderRadius: '50%',
            background: liquidGradient,
          }}
        />

        {/* Orbiting Droplet 1 (Large, slow, stretches the core massively) */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 5 * speed, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <div style={{
            position: 'absolute', top: '10%', left: '35%',
            width: '45%', height: '45%',
            borderRadius: '50%',
            background: liquidGradient
          }} />
        </motion.div>

        {/* Orbiting Droplet 2 (Medium, reverses direction, cuts across) */}
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 7 * speed, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <div style={{
            position: 'absolute', top: '25%', left: '60%',
            width: '35%', height: '35%',
            borderRadius: '50%',
            background: liquidGradient
          }} />
        </motion.div>

        {/* Orbiting Droplet 3 (Small, erratic edge droplet) */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4 * speed, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <div style={{
            position: 'absolute', top: '60%', left: '20%',
            width: '25%', height: '25%',
            borderRadius: '50%',
            background: liquidGradient
          }} />
        </motion.div>

        {/* Hot Energy Droplet (Only visible when typing/processing) */}
        {isTyping && (
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 2 * speed, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <div style={{
              position: 'absolute', top: '45%', left: '65%',
              width: '25%', height: '25%',
              borderRadius: '50%',
              background: hotGradient
            }} />
          </motion.div>
        )}
      </div>

      {/* 3. Global Specular Highlight Overlay 
          This sits OVER the liquid effect to unify the entire mass,
          making it look like a single 3D glossy object reflecting a studio light. */}
      <div style={{
        position: 'absolute',
        top: '12%', left: '18%',
        width: '35%', height: '20%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 65%)',
        transform: 'rotate(-25deg)',
        pointerEvents: 'none',
        zIndex: 10,
        filter: 'blur(1px)'
      }} />
    </div>
  );
}
