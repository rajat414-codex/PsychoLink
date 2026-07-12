import React from 'react';
import { motion } from 'framer-motion';

/**
 * Ultra-Premium SaaS AI Avatar: "Fluid Aurora Glass Orb"
 * Completely abandons SVG and Particles for a hyper-realistic, 
 * glassmorphic lens housing organic, flowing liquid light.
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

  // Animation speeds
  const rotateSpeed = isTyping ? 3 : isSleep ? 20 : 8;
  const morphSpeed = isTyping ? 2 : isSleep ? 10 : 5;
  const pulseSpeed = isTyping ? 1.5 : isSleep ? 5 : 3;

  return (
    <div className={`ai-aurora-glass ${className}`} style={{
      width: d, height: d,
      position: 'relative',
      borderRadius: '50%',
      // Dropshadow for the entire orb hitting the page
      boxShadow: `0 ${d*0.1}px ${d*0.25}px rgba(0,0,0,0.15), 0 ${d*0.05}px ${d*0.1}px ${activeColor}30`,
      ...style
    }}>
      
      {/* 1. Base glow to illuminate the backdrop behind the glass */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: isSleep ? [0.3, 0.5, 0.3] : [0.6, 1, 0.6] }}
        transition={{ duration: pulseSpeed, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at 50% 50%, ${activeColor} 0%, transparent 80%)`,
          filter: `blur(${d*0.15}px)`,
          zIndex: 0
        }}
      />

      {/* 2. Fluid Inner Blobs (The "Aurora") */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        overflow: 'hidden', // Contain the liquid inside the sphere
        zIndex: 1,
        // Dark base inside the orb to make the light pop
        background: '#0d1117' 
      }}>
        {/* Blob 1: Main Color */}
        <motion.div
          animate={{
            rotate: [0, 360],
            borderRadius: [
              "40% 60% 70% 30% / 40% 50% 60% 50%",
              "60% 40% 30% 70% / 50% 60% 40% 50%",
              "40% 60% 70% 30% / 40% 50% 60% 50%"
            ],
            scale: isTyping ? [0.8, 1.3, 0.8] : [0.9, 1.15, 0.9]
          }}
          transition={{
            rotate: { duration: rotateSpeed, repeat: Infinity, ease: "linear" },
            borderRadius: { duration: morphSpeed, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: pulseSpeed, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            position: 'absolute',
            top: '-25%', left: '-25%',
            width: '150%', height: '150%',
            background: `radial-gradient(circle at 50% 50%, ${activeColor} 0%, transparent 65%)`,
            filter: `blur(${d*0.12}px)`,
            mixBlendMode: 'screen',
            opacity: isSleep ? 0.5 : 1
          }}
        />

        {/* Blob 2: Secondary Color / White Highlight */}
        <motion.div
          animate={{
            rotate: [360, 0],
            borderRadius: [
              "60% 40% 30% 70% / 50% 60% 40% 50%",
              "40% 60% 70% 30% / 40% 50% 60% 50%",
              "60% 40% 30% 70% / 50% 60% 40% 50%"
            ]
          }}
          transition={{
            rotate: { duration: rotateSpeed * 1.2, repeat: Infinity, ease: "linear" },
            borderRadius: { duration: morphSpeed * 1.1, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            position: 'absolute',
            bottom: '-15%', right: '-15%',
            width: '110%', height: '110%',
            background: `radial-gradient(circle at 50% 50%, #ffffff 0%, transparent 60%)`,
            filter: `blur(${d*0.1}px)`,
            mixBlendMode: 'overlay', // Overlay makes the white pop intensely when overlapping the color
            opacity: isSleep ? 0.2 : 0.9
          }}
        />
        
        {/* Blob 3: Deep Core (Only visible when typing) */}
        {isTyping && (
           <motion.div
             animate={{ rotate: [0, -360], scale: [0.6, 1.1, 0.6] }}
             transition={{ duration: pulseSpeed, repeat: Infinity, ease: "easeInOut" }}
             style={{
               position: 'absolute',
               top: '10%', left: '10%',
               width: '80%', height: '80%',
               background: `conic-gradient(from 0deg, transparent 0%, ${activeColor} 50%, transparent 100%)`,
               filter: `blur(${d*0.06}px)`,
               mixBlendMode: 'screen',
             }}
           />
        )}
      </div>

      {/* 3. The Physical Glass Lens (Glassmorphism Overlay) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        zIndex: 2,
        // The frosted glass effect over the liquid
        backdropFilter: `blur(${d*0.06}px)`,
        // Surface glare
        background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.05) 100%)',
        // Physical rim light
        border: '1px solid rgba(255,255,255,0.5)',
        // 3D thickness (inset shadow)
        boxShadow: `
          inset 0 ${d*0.05}px ${d*0.08}px rgba(255,255,255,0.6),
          inset 0 -${d*0.03}px ${d*0.06}px rgba(0,0,0,0.4)
        `
      }}>
        {/* High-end specular highlight (the sharp dot reflection of a light source) */}
        <div style={{
          position: 'absolute',
          top: '10%', left: '18%',
          width: '25%', height: '15%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)',
          transform: 'rotate(-30deg)',
          filter: 'blur(1px)'
        }} />
      </div>

    </div>
  );
}
