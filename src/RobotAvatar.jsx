import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Modern SaaS AI "Particle Sphere" Avatar
 * Creates a mesmerizing 3D dotted sphere using calculated box-shadows.
 */
export default function RobotAvatar({
  expression = 'smile',
  size = 'md',
  glowColor = '#00e5ff',
  isTyping = false,
  className = '',
  style = {}
}) {
  // Map standard sizes to pixel dimensions (scaled up for more impact)
  const sizeMap = { lg: 240, md: 140, sm: 64, xs: 36 };
  const d = sizeMap[size] || sizeMap.md;

  const isSleep = expression === 'sleep';
  const isError = expression === 'dizzy' || expression === 'sad' || expression === 'cry';

  // State-based animation properties
  const activeColor = isError ? '#f43f5e' : glowColor; 
  const pulseDuration = isTyping ? 0.8 : isSleep ? 4 : 2.5;
  const spinDuration = isTyping ? 8 : isSleep ? 30 : 15;
  
  const baseOpacity = isSleep ? 0.4 : 1;

  // Memoize the generation of the 3D particle sphere to keep performance extremely high
  const { layer1, layer2, layer3 } = useMemo(() => {
    // Generates a 2D projection of points uniformly distributed on a 3D sphere surface
    const generateSphereShadows = (count, radius, colorHex) => {
      let r = 255, g = 255, b = 255;
      if (colorHex.startsWith('#')) {
        const hex = colorHex.replace('#', '');
        r = parseInt(hex.substring(0, 2), 16) || 255;
        g = parseInt(hex.substring(2, 4), 16) || 255;
        b = parseInt(hex.substring(4, 6), 16) || 255;
      }
      
      let shadows = [];
      for (let i = 0; i < count; i++) {
        // Spherical coordinates
        const theta = Math.random() * 2 * Math.PI;
        const v = Math.random();
        const phi = Math.acos(2 * v - 1);
        
        // 3D to 2D projection
        const x = (radius * Math.sin(phi) * Math.cos(theta)).toFixed(1);
        const y = (radius * Math.sin(phi) * Math.sin(theta)).toFixed(1);
        const z = radius * Math.cos(phi);
        
        // Calculate opacity based on depth (z). 
        // Edge of sphere (z=0) is brightest, center of sphere (z=radius) is dimmest.
        // This gives it that hollow, glowing rim effect perfectly!
        const zRatio = Math.abs(z) / radius;
        const op = (0.15 + 0.85 * (1 - zRatio)).toFixed(2);
        
        shadows.push(`${x}px ${y}px 0px rgba(${r},${g},${b},${op})`);
      }
      return shadows.join(', ') || '0px 0px 0px transparent';
    };
    
    // Scale the number of dots based on the container size
    // so `xs` sizes don't waste performance rendering dense dots you can't see,
    // and `lg` sizes look beautifully dense.
    const scale = d / 100;
    
    return {
      // Layer 1: Super dense, main color dots (Front/edge mostly)
      layer1: generateSphereShadows(Math.floor(2000 * scale), d/2 - 2, activeColor),
      // Layer 2: Ultra bright white stars
      layer2: generateSphereShadows(Math.floor(600 * scale), d/2 - 3, '#ffffff'),
      // Layer 3: Inner volume, blurred for depth of field
      layer3: generateSphereShadows(Math.floor(1200 * scale), d/2 - 6, activeColor),
    };
  }, [d, activeColor]);

  return (
    <motion.div 
      className={`ai-particle-sphere ${className}`}
      animate={{ scale: isSleep ? [0.95, 1, 0.95] : [1, 1.03, 1] }}
      transition={{ duration: pulseDuration * 2, repeat: Infinity, ease: "easeInOut" }}
      style={{
        width: d, height: d,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        ...style
      }}
    >
      
      {/* Container Glowing Rim (Matches the bright edge in the user's reference) */}
      <motion.div
        animate={{
          boxShadow: isTyping 
            ? [`inset 0 0 ${d*0.15}px ${activeColor}, 0 0 ${d*0.3}px ${activeColor}80`, `inset 0 0 ${d*0.25}px ${activeColor}, 0 0 ${d*0.4}px ${activeColor}A0`, `inset 0 0 ${d*0.15}px ${activeColor}, 0 0 ${d*0.3}px ${activeColor}80`]
            : [`inset 0 0 ${d*0.1}px ${activeColor}, 0 0 ${d*0.15}px ${activeColor}50`, `inset 0 0 ${d*0.15}px ${activeColor}, 0 0 ${d*0.25}px ${activeColor}70`, `inset 0 0 ${d*0.1}px ${activeColor}, 0 0 ${d*0.15}px ${activeColor}50`]
        }}
        transition={{ duration: pulseDuration, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          opacity: baseOpacity,
          zIndex: 1
        }}
      />

      {/* Rotating Particle Layers Container (mix-blend-mode for insane brightness on overlaps) */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', zIndex: 2, mixBlendMode: 'screen' }}>
        
        {/* Layer 1: Main color */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: spinDuration, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '50%', left: '50%', width: '1.5px', height: '1.5px', borderRadius: '50%', boxShadow: layer1, opacity: baseOpacity }}
        />
        
        {/* Layer 2: White bright dots (Rotates opposite) */}
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: spinDuration * 1.2, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '50%', left: '50%', width: '2px', height: '2px', borderRadius: '50%', boxShadow: layer2, opacity: baseOpacity * 0.9 }}
        />
        
        {/* Layer 3: Inner volume (Blurred for depth of field / volumetric look) */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: spinDuration * 0.8, repeat: Infinity, ease: "linear" }}
          style={{ position: 'absolute', top: '50%', left: '50%', width: '1px', height: '1px', borderRadius: '50%', boxShadow: layer3, opacity: baseOpacity * 0.5, filter: 'blur(1px)' }}
        />

        {/* Core Processing Swirl (Only visible when typing) */}
        {isTyping && (
          <motion.div
            animate={{ 
              scale: [0.6, 0.9, 0.6], 
              opacity: [0.2, 0.6, 0.2],
              rotate: [0, -360]
            }}
            transition={{ 
              scale: { duration: pulseDuration, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: pulseDuration, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: spinDuration * 0.5, repeat: Infinity, ease: "linear" }
            }}
            style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '60%', height: '60%', borderRadius: '50%',
              background: `conic-gradient(from 0deg, transparent 0%, ${activeColor} 50%, transparent 100%)`,
              filter: 'blur(8px)'
            }}
          />
        )}
      </div>

    </motion.div>
  );
}
