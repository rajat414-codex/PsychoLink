import React from 'react';
import { motion } from 'framer-motion';

/**
 * Ultra-Premium SaaS AI Avatar: "The Modern Intelligence Aura"
 * Inspired by the absolute peak of current AI design (Apple Intelligence / ChatGPT Voice).
 * Features a deep, pure black core surrounded by a fluid, multi-colored, spinning holographic aura.
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

  // Base colors for the aura
  const primaryColor = isError ? '#f43f5e' : glowColor;
  
  // Create a stunning multi-color fluid gradient based on the primary color
  // If the primary color is teal, it blends teal, purple, deep blue, and white.
  // If it's pink, it blends pink, orange, purple, and white.
  const gradient = isError 
    ? `conic-gradient(from 0deg, #f43f5e, #fb923c, #9333ea, #f43f5e)`
    : `conic-gradient(from 0deg, ${primaryColor}, #8b5cf6, #3b82f6, #e0e7ff, ${primaryColor})`;

  // Animation timings
  const spinSpeed = isTyping ? 1.5 : isSleep ? 8 : 4;
  const pulseSpeed = isTyping ? 1 : isSleep ? 4 : 2;

  // When typing, the black core shrinks slightly, exposing MORE of the raging colorful energy
  const coreScale = isTyping ? 0.8 : isSleep ? 0.95 : 0.9;
  const auraScale = isTyping ? 1.15 : isSleep ? 0.95 : 1.05;

  return (
    <div className={`ai-modern-aura ${className}`} style={{
      width: d, height: d,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...style
    }}>
      
      {/* 1. The Raging Holographic Aura (The glowing edge) */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [auraScale * 0.98, auraScale * 1.02, auraScale * 0.98]
        }}
        transition={{ 
          rotate: { duration: spinSpeed, repeat: Infinity, ease: "linear" },
          scale: { duration: pulseSpeed, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          position: 'absolute',
          inset: '-5%', // Extend slightly beyond the container
          borderRadius: '50%',
          background: gradient,
          // Extreme blur creates the "Apple Intelligence" fluid light bleed
          filter: `blur(${d * 0.15}px)`,
          opacity: isSleep ? 0.4 : 1,
          zIndex: 0
        }}
      />

      {/* 2. Secondary Inner Aura (For intense brightness near the edge) */}
      <motion.div
        animate={{ 
          rotate: [360, 0]
        }}
        transition={{ 
          rotate: { duration: spinSpeed * 1.5, repeat: Infinity, ease: "linear" }
        }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: gradient,
          filter: `blur(${d * 0.05}px)`,
          opacity: isSleep ? 0.2 : 0.8,
          zIndex: 1
        }}
      />

      {/* 3. The Deep Void Core (The solid black center) */}
      <motion.div
        animate={{ 
          scale: [coreScale, coreScale * 0.98, coreScale] 
        }}
        transition={{ 
          duration: pulseSpeed * 0.5, repeat: Infinity, ease: "easeInOut" 
        }}
        style={{
          position: 'absolute',
          width: '100%', height: '100%',
          borderRadius: '50%',
          background: '#080808',
          zIndex: 2,
          // Subtle physical rim light on the black sphere itself
          boxShadow: `inset 0 0 ${d * 0.05}px rgba(255,255,255,0.08), 0 0 ${d * 0.02}px rgba(0,0,0,0.5)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Subtle physical sheen reflection on the core surface */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 50%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 4
        }} />

        {/* Dynamic Concentric Ring 1 (Dashed, outer) */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            width: '68%', height: '68%',
            borderRadius: '50%',
            border: `1px dashed rgba(255, 255, 255, 0.1)`,
            borderColor: `${primaryColor}20`,
            zIndex: 1
          }}
        />

        {/* Dynamic Concentric Ring 2 (Dotted, inner) */}
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{
            position: 'absolute',
            width: '48%', height: '48%',
            borderRadius: '50%',
            border: `1px dotted rgba(255, 255, 255, 0.08)`,
            zIndex: 2
          }}
        />

        {/* Glowing Neural Node in the exact center */}
        <motion.div
          animate={{ 
            scale: isSleep ? [0.85, 1.05, 0.85] : [1, 1.18, 1],
            opacity: isSleep ? [0.3, 0.5, 0.3] : [0.7, 0.95, 0.7]
          }}
          transition={{ 
            duration: pulseSpeed, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          style={{
            position: 'absolute',
            width: '24%', height: '24%',
            borderRadius: '50%',
            background: `radial-gradient(circle, #ffffff 0%, ${primaryColor} 60%, transparent 100%)`,
            boxShadow: `0 0 ${d * 0.08}px ${primaryColor}80, inset 0 0 4px rgba(255,255,255,0.8)`,
            filter: 'blur(0.5px)',
            zIndex: 3
          }}
        />

        {/* Subtle processing ring inside the core (Only visible when typing) */}
        {isTyping && (
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [0.8, 1, 0.8],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{
              position: 'absolute',
              width: '80%', height: '80%',
              borderRadius: '50%',
              border: `1.5px solid transparent`,
              borderTopColor: primaryColor,
              borderBottomColor: primaryColor,
              filter: 'blur(1.5px)',
              zIndex: 0
            }}
          />
        )}
      </motion.div>
      
    </div>
  );
}
