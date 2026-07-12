import React from 'react';
import { motion } from 'framer-motion';

/**
 * Modern SaaS AI "Neural Core" Avatar
 * Replaces the old SVG robot with a sleek, dynamic, fluid holographic orb.
 * Fits perfectly into modern UI designs (like Siri, Gemini, or OpenAI).
 */
export default function RobotAvatar({
  expression = 'smile',
  size = 'md',
  glowColor = '#00e5ff',
  isTyping = false,
  className = '',
  style = {}
}) {
  // Map standard sizes to pixel dimensions that fit the existing UI layouts
  const sizeMap = { lg: 150, md: 100, sm: 48, xs: 28 };
  const d = sizeMap[size] || sizeMap.md;

  const isSleep = expression === 'sleep';
  const isError = expression === 'dizzy' || expression === 'sad' || expression === 'cry';

  // State-based animation properties
  const activeColor = isError ? '#f43f5e' : glowColor; // Turn red/pink on error
  const pulseDuration = isTyping ? 0.8 : isSleep ? 4 : 2;
  const spinDuration = isTyping ? 1.5 : isSleep ? 8 : 4;
  
  // Opacity for the sleep state
  const baseOpacity = isSleep ? 0.6 : 1;

  // Render varying thicknesses based on size to ensure it scales beautifully
  const borderWidth = Math.max(1, Math.round(d * 0.02));

  return (
    <div className={`ai-core-avatar ${className}`} style={{
      width: d, height: d,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }}>
      
      {/* 1. Ambient Glow Halo */}
      <motion.div
        animate={{
          scale: isTyping ? [0.9, 1.2, 0.9] : isSleep ? [0.95, 1, 0.95] : [1, 1.05, 1],
          opacity: [baseOpacity * 0.3, baseOpacity * 0.6, baseOpacity * 0.3],
        }}
        transition={{ duration: pulseDuration, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${activeColor}55 0%, transparent 70%)`,
          filter: `blur(${d * 0.15}px)`,
          zIndex: 1,
        }}
      />

      {/* 2. Fluid Liquid Ring 1 */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: spinDuration, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          width: '85%',
          height: '85%',
          borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
          border: `${borderWidth}px solid ${activeColor}70`,
          boxShadow: `0 0 ${d * 0.1}px ${activeColor}40, inset 0 0 ${d * 0.05}px ${activeColor}40`,
          zIndex: 2,
        }}
      />

      {/* 3. Fluid Liquid Ring 2 (Opposite rotation, offsets for organic feel) */}
      <motion.div
        animate={{ rotate: [360, 0] }}
        transition={{ duration: spinDuration * 1.3, repeat: Infinity, ease: "linear" }}
        style={{
          position: 'absolute',
          width: '75%',
          height: '75%',
          borderRadius: '60% 40% 30% 70% / 50% 40% 50% 60%',
          border: `${borderWidth}px solid ${activeColor}A0`,
          zIndex: 3,
          opacity: isSleep ? 0.3 : 0.8,
        }}
      />

      {/* 4. The Solid Neural Core Sphere */}
      <motion.div
        animate={{ 
          scale: isTyping ? [0.85, 1.1, 0.85] : [0.95, 1, 0.95],
          boxShadow: isTyping 
            ? [`0 0 ${d*0.1}px ${activeColor}`, `0 0 ${d*0.3}px ${activeColor}`, `0 0 ${d*0.1}px ${activeColor}`]
            : [`0 0 ${d*0.05}px ${activeColor}`, `0 0 ${d*0.15}px ${activeColor}`, `0 0 ${d*0.05}px ${activeColor}`]
        }}
        transition={{ duration: pulseDuration, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'relative',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          // 3D sphere gradient effect with a bright top-left highlight
          background: `radial-gradient(circle at 30% 30%, #ffffff 0%, ${activeColor} 60%, #000000 100%)`,
          zIndex: 4,
          opacity: baseOpacity,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Core Swirl Animation (Simulating data processing inside) */}
        {isTyping && (
           <motion.div
             animate={{ rotate: [0, 360] }}
             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
             style={{
               position: 'absolute',
               width: '150%',
               height: '150%',
               background: `conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)`,
               mixBlendMode: 'overlay'
             }}
           />
        )}

        {/* Glossy Glass Highlight */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: '35%',
          height: '25%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.1) 100%)',
          borderRadius: '50%',
          filter: 'blur(1px)',
          transform: 'rotate(-25deg)',
          zIndex: 5
        }} />
      </motion.div>
    </div>
  );
}
