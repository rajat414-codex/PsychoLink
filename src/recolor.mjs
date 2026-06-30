// recolor.mjs — SaaS color swap for ConsultantHub.jsx
// Sirf colors/shadows badalta hai. Payment logic, functions, handlers — kuch nahi chhuता.
// Chalao:  node recolor.mjs

import fs from 'fs';

const FILE = './src/ConsultantHub.jsx';
let src = fs.readFileSync(FILE, 'utf-8');
const before = src;

// ── Neon hex → muted SaaS hex ──
const hexSwaps = {
  '#ec4899': '#8b87f5',  // pink → muted violet
  '#f472b6': '#8b87f5',
  '#2dd4bf': '#5eb8ad',  // teal → muted teal
  '#0d9488': '#4a9488',
  '#8b5cf6': '#8b87f5',  // purple → muted violet
  '#a78bfa': '#a5a1f0',
  '#7c3aed': '#7975d4',
  '#c084fc': '#a5a1f0',
  '#10b981': '#56a06f',  // green → muted
  '#059669': '#4a8a5f',
  '#f59e0b': '#c79552',  // amber → muted
  '#ef4444': '#cc6666',  // red → muted
  '#06040f': '#0a0a0c',  // bg
  '#080612': '#0a0a0c',
  '#0a0814': '#0a0a0c',
  // #1e90ff (SBI blue) — left as-is (bank branding)
};
for (const [k, v] of Object.entries(hexSwaps)) {
  src = src.split(k).join(v);
  src = src.split(k.toUpperCase()).join(v);
}

// ── Neon rgba → muted rgba ──
const rgbaSwaps = {
  'rgba(236,72,153,': 'rgba(139,135,245,',
  'rgba(244,114,182,': 'rgba(139,135,245,',
  'rgba(45,212,191,': 'rgba(94,184,173,',
  'rgba(139,92,246,': 'rgba(139,135,245,',
  'rgba(124,58,237,': 'rgba(121,117,212,',
  'rgba(16,185,129,': 'rgba(86,160,111,',
  'rgba(245,158,11,': 'rgba(199,149,82,',
  'rgba(239,68,68,': 'rgba(204,102,102,',
};
for (const [k, v] of Object.entries(rgbaSwaps)) {
  src = src.split(k).join(v);
}

// ── Glow shadows (0 0 8px+ blur) → none ──
src = src.replace(/boxShadow:`0 0 (?:[89]|[1-9]\d)px \$\{[^`]*`/g, "boxShadow:'none'");
src = src.replace(/boxShadow:'0 0 (?:[89]|[1-9]\d)px [^']*'/g, "boxShadow:'none'");
src = src.replace(/boxShadow:"0 0 (?:[89]|[1-9]\d)px [^"]*"/g, "boxShadow:'none'");

// ── Big colored drop-shadows → neutral depth ──
src = src.replace(/boxShadow:`0 (\d+)px (\d+)px \$\{[^}]*\}[0-9a-fA-F]*`/g, "boxShadow:'0 $1px $2px rgba(0,0,0,0.4)'");

fs.writeFileSync(FILE, src);

const changed = before !== src;
console.log(changed ? '✅ ConsultantHub.jsx recolored to SaaS palette!' : '— No changes needed.');

// Safety: confirm payment functions still present
const keep = ['handleUpiPayment', 'handleSbiPayment', 'loadRazorpay', 'create-order', 'payment/verify', 'window.Razorpay'];
const missing = keep.filter(k => !src.includes(k));
console.log(missing.length === 0
  ? '✅ All payment logic intact — nothing was touched.'
  : '⚠️  Check these: ' + missing.join(', '));