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
    // Generates a woven "Torus Knot" particle pattern (hollow center, sweeping lines on the rim)
    const generateWovenShadows = (count, R, r_minor, wraps, k_waves, colorHex) => {
      let r = 255, g = 255, b = 255;
      if (colorHex.startsWith('#')) {
        const hex = colorHex.replace('#', '');
        r = parseInt(hex.substring(0, 2), 16) || 255;
        g = parseInt(hex.substring(2, 4), 16) || 255;
        b = parseInt(hex.substring(4, 6), 16) || 255;
      }
      
      let shadows = [];
      for (let i = 0; i < count; i++) {
        // Continuous line wrapping around the circle `wraps` times
        const theta = (i / count) * 2 * Math.PI * wraps;
        
        // The secondary angle creating the sweeping Moiré/wave patterns
        const phi = k_waves * theta;
        
        // Add a tiny bit of scatter so it looks like organic particles
        const scatter = (Math.random() - 0.5) * (R * 0.05);
        
        // Torus 3D to 2D projection
        const x = ((R + r_minor * Math.cos(phi) + scatter) * Math.cos(theta)).toFixed(1);
        const y = ((R + r_minor * Math.cos(phi) + scatter) * Math.sin(theta)).toFixed(1);
        const z = r_minor * Math.sin(phi);
        
        // Opacity based on 3D depth (z). Front is bright, back is dim.
        const zRatio = (z + r_minor) / (2 * r_minor); // 0 (back) to 1 (front)
        const op = (0.1 + 0.9 * zRatio).toFixed(2);
        
        shadows.push(`${x}px ${y}px 0px rgba(${r},${g},${b},${op})`);
      }
      return shadows.join(', ') || '0px 0px 0px transparent';
    };
    
    // Scale the number of dots based on the container size
    // so `xs` sizes don't waste performance rendering dense dots you can't see,
    // and `lg` sizes look beautifully dense.
    const scale = d / 100;
    
    return {
      // Layer 1: The main sweeping waves. R = d/2 - 10, r_minor = 10, wraps = 50, k = 12.5
      layer1: generateWovenShadows(Math.floor(1500 * scale), d/2 - d*0.1, d*0.1, 80, 18.5, activeColor),
      // Layer 2: Sparse, ultra bright white stars offset slightly
      layer2: generateWovenShadows(Math.floor(400 * scale), d/2 - d*0.1, d*0.12, 40, 12.2, '#ffffff'),
      // Layer 3: Inner subtle weave, slightly smaller major radius
      layer3: generateWovenShadows(Math.floor(800 * scale), d/2 - d*0.15, d*0.08, 60, 24.1, activeColor),
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
            ? [`inset 0 0 ${d*0.05}px ${activeColor}, 0 0 ${d*0.1}px ${activeColor}80`, `inset 0 0 ${d*0.1}px ${activeColor}, 0 0 ${d*0.2}px ${activeColor}A0`, `inset 0 0 ${d*0.05}px ${activeColor}, 0 0 ${d*0.1}px ${activeColor}80`]
            : [`inset 0 0 ${d*0.02}px ${activeColor}, 0 0 ${d*0.05}px ${activeColor}50`, `inset 0 0 ${d*0.05}px ${activeColor}, 0 0 ${d*0.1}px ${activeColor}70`, `inset 0 0 ${d*0.02}px ${activeColor}, 0 0 ${d*0.05}px ${activeColor}50`]
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
