import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from './config';
import {
  FaBrain, FaRobot, FaHistory, FaSignOutAlt, FaPlus, FaPlay,
  FaPaperPlane, FaMicrophone, FaStop, FaVolumeUp,
  FaHome, FaComments, FaUserMd, FaChartLine, FaBell, FaUser,
  FaHeart, FaFire, FaSmile, FaArrowRight, FaLeaf, FaBolt,
  FaBook, FaWind, FaCloudSun, FaCopy, FaCheck
} from 'react-icons/fa';
import BrainReport from './NeurologicalReport';
import BreathingModal from './BreathingModal';
import CrisisButton from './CrisisButton';
import CalmLibrary from './CalmLibrary';
import DashboardHome from './DashboardHome';
import VideoCall from './VideoCall';
import { FaVideo, FaPhone } from 'react-icons/fa';
import ProgressDashboard from './ProgressDashboard';
import { FaSpa, FaCrown } from 'react-icons/fa';
import { JoinConsultantModal, ApplicationsPanel, PaymentModal, FreeSessionToast, ConsultantProfile, ReelsViewerModal, PRESET_AVATARS, parsePresetAvatar, renderAvatar, compressImage, VIDEO_PRESETS, saveVideoBlob, useVideoUrl } from './ConsultantHub';
import RobotAvatar from './RobotAvatar';
import FloatingChatbot from './FloatingChatbot';


const AURA_PROMPT = `You are AURA (Affective Understanding and Reflective AI), a warm empathetic AI therapist inside PsychoLink app. Personality: Warm, nurturing, emotionally intelligent. Specialization: anxiety, depression, stress, relationships, self-esteem, mindfulness. VERY IMPORTANT: You fully understand and converse naturally in English, Hindi, and Hinglish (Hindi written in Roman script like 'Aap kaise hain?', 'Mujhe stress ho raha hai'). Always respond with empathy first, then guidance. Keep responses warm, encouraging, conversational, and concise (2-4 sentences). Never diagnose. Use occasional emojis 🌸.`;

const MAX_PROMPT = `You are MAX (Mental Analytical eXpert), a logical structured AI consultant inside PsychoLink app. Personality: Analytical, precise, solution-focused. Specialization: cognitive restructuring, behavioral patterns, productivity + mental health, habit formation. VERY IMPORTANT: You fully understand and converse naturally in English, Hindi, and Hinglish. Keep responses concise and structured. Always analyze using CBT frameworks and provide: 1) Pattern 2) Analysis 3) Action steps.`;

const SUGGESTIONS = {
  AURA: ["I've been feeling anxious lately", "Mujhe thoda stress ho raha hai", "Help me with self-esteem", "Aap kaise help kar sakte ho?"],
  MAX:  ["Analyze my thought patterns", "I procrastinate too much", "Break a bad habit", "Focus aur concentration kaise badhaye?"]
};

const SUGGESTIONS_ENHANCED = {
  AURA: [
    { text: "I've been feeling anxious lately", sub: "Emotional support & grounding", icon: "🌸" },
    { text: "Mujhe thoda stress ho raha hai", sub: "Instant stress relief chat", icon: "🍃" },
    { text: "Help me with self-esteem", sub: "Boost confidence & resilience", icon: "✨" },
    { text: "Aap kaise help kar sakte ho?", sub: "Learn about Aura's features", icon: "💡" }
  ],
  MAX: [
    { text: "Analyze my thought patterns", sub: "CBT behavioral assessment", icon: "🧠" },
    { text: "I procrastinate too much", sub: "Productivity hack & structure", icon: "⚡" },
    { text: "Break a bad habit", sub: "Habit loop reprogramming", icon: "🎯" },
    { text: "Focus aur concentration kaise badhaye?", sub: "Deep work focus guidelines", icon: "🔍" }
  ]
};

function VisualWaveform({ accent, active }) {
  return (
    <div style={{ display: 'flex', gap: '3.5px', alignItems: 'center', height: '24px', padding: '0 8px' }}>
      {[...Array(15)].map((_, i) => {
        const heights = [10, 22, 14, 28, 18, 24, 12, 26, 16, 20, 10, 18, 26, 14, 8];
        const h = heights[i % heights.length];
        return (
          <motion.div
            key={i}
            animate={active ? {
              scaleY: [0.3, 1, 0.3],
              height: [h * 0.4, h, h * 0.4],
            } : {
              scaleY: 0.3,
              height: 8,
            }}
            transition={{
              duration: 0.8 + (i % 3) * 0.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.05
            }}
            style={{
              width: '3px',
              backgroundColor: accent,
              borderRadius: '2px',
              transformOrigin: 'center'
            }}
          />
        );
      })}
    </div>
  );
}

// Consultants loaded from backend

const MOOD_DATA = [62, 71, 55, 80, 66, 74, 82];
const DAYS      = ['M','T','W','T','F','S','S'];

function TypingDots({ color }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'5px', padding:'12px 16px', background:'rgba(255,255,255,0.05)', borderRadius:'18px 18px 18px 4px', border:`1px solid ${color}20`, width:'fit-content' }}>
      {[0,1,2].map(i=>(
        <motion.div key={i} animate={{ scale:[1,1.5,1], opacity:[0.3,1,0.3] }} transition={{ duration:0.8, repeat:Infinity, delay:i*0.2 }}
          style={{ width:'6px', height:'6px', borderRadius:'50%', background:color }}/>
      ))}
    </div>
  );
}

function MoodChart({ color, data }) {
  const max = Math.max(...data), min = Math.min(...data) - 5;
  const W = 220, H = 65;
  const pts = data.map((v,i) => `${(i/(data.length-1))*W},${H-((v-min)/(max-min))*H}`).join(' ');
  return (
    <svg width={W} height={H+10} style={{ overflow:'visible' }}>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,${H+5} ${pts} ${W},${H+5}`} fill="url(#cg)"/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {data.map((v,i) => (
        <motion.circle key={i} cx={(i/(data.length-1))*W} cy={H-((v-min)/(max-min))*H} r="4"
          initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay:i*0.08, type:'spring' }}
          fill={color} opacity="0.9" stroke="#0a0a0c" strokeWidth="2"/>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────
// ReelGridItem — single grid item cover loader for CalmReelsScreen
// ─────────────────────────────────────────────────────────────────
function ReelGridItem({ reel, onClick }) {
  const resolvedSrc = useVideoUrl(reel.videoUrl);
  return (
    <motion.div 
      whileHover={{ scale: 1.015 }}
      onClick={onClick}
      style={{ 
        aspectRatio: '9/16', 
        borderRadius: '16px', 
        overflow: 'hidden', 
        background: '#090b11', 
        cursor: 'pointer',
        position: 'relative',
        border: '1px solid rgba(255,255,255,0.04)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
      }}
    >
      {/* Cover Video/Image Preview */}
      {reel.imageUrl ? (
        <img src={reel.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
      ) : (
        <video src={resolvedSrc} muted playsInline referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
      )}
      
      {/* Play Overlay Button */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
          <FaPlay size={10} color="#fff" style={{ marginLeft: 2 }} />
        </div>
      </div>

      {/* Creator details overlay */}
      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.4)', padding: '4px 8px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
        {renderAvatar(reel.creator.pfp, reel.creator.name, reel.creator.color, 14, '0.45rem')}
        <span style={{ fontSize: '0.62rem', fontWeight: '600', color: '#fff' }}>{reel.creator.name.replace('Dr. ','')}</span>
      </div>

      {/* Likes count */}
      <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#fff', fontWeight: '700', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
        <FaHeart size={10} color="#fff"/> {reel.likes + (reel.liked ? 1 : 0)}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// CalmReelsScreen — Dedicated Calm Reels Tab Section
// ─────────────────────────────────────────────────────────────────
function CalmReelsScreen({ accent, accentB, accentBr, userProfile, myProfileData }) {
  const G = "'Cormorant Garamond', serif";
  const S = "'Space Grotesk', sans-serif";
  const J = "'Plus Jakarta Sans', sans-serif";

  const [reels, setReels] = useState(() => {
    try {
      const saved = localStorage.getItem('equilibrium_global_reels');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0 && !parsed[0].videoUrl.includes('mixkit')) {
          return parsed;
        }
      }
    } catch {}
    return [
      {
        id: 'global-r1',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        caption: 'Ground yourself in the present. Breathe in calm, breathe out stress. 🧘‍♂️✨ #mindfulness #innerpeace',
        likes: 184,
        liked: false,
        music: 'Aura Calming Vibes - Original Sound',
        creator: { name: 'Dr. Priya Sharma', color: '#ec4899' }
      },
      {
        id: 'global-r2',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        caption: 'Quiet river flow to calm an anxious mind. Let your thoughts wash away. 🌲🌊 #naturehealing #peace',
        likes: 242,
        liked: false,
        music: 'Calming Forest Stream - Healing Sound',
        creator: { name: 'Dr. Vikranth Mehta', color: '#10b981' }
      },
      {
        id: 'global-r3',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        caption: 'Release physical tension, embrace positive vibes. You are safe. 🌈✨ #mentalhealth #zen',
        likes: 156,
        liked: false,
        music: 'Zen Ambient Lo-Fi Chill',
        creator: { name: 'Neha Kapoor', color: '#8b5cf6' }
      }
    ];
  });

  const [activeReelIndex, setActiveReelIndex] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [music, setMusic] = useState('');
  const [videoSrc, setVideoSrc] = useState('');
  const resolvedPreviewSrc = useVideoUrl(videoSrc);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.src = URL.createObjectURL(file);
      videoElement.onloadedmetadata = () => {
        URL.revokeObjectURL(videoElement.src);
        const duration = videoElement.duration;
        if (duration > 95) {
          alert("Video duration cannot exceed 1 minute and 35 seconds (1:35).");
          return;
        }
        const videoId = `video-blob-${Date.now()}`;
        saveVideoBlob(videoId, file).then(() => {
          setVideoSrc(`db:${videoId}`);
        }).catch(err => {
          console.error("Error saving video to IndexedDB:", err);
          alert("Failed to store video. Please try again.");
        });
      };
    }
  };

  const handleUpload = () => {
    if (!videoSrc) return;
    const userName = myProfileData ? myProfileData.name : (userProfile?.name || 'You');
    const userColor = myProfileData?.color || accent;
    const userPfp = myProfileData ? myProfileData.pfp : userProfile?.picture;

    const newReel = {
      id: `custom-reel-${Date.now()}`,
      videoUrl: videoSrc,
      caption: caption || 'My mindfulness moment. 🌸',
      likes: 0,
      liked: false,
      music: music || 'Original Sound',
      creator: { name: userName, color: userColor, pfp: userPfp }
    };
    const updated = [newReel, ...reels];
    setReels(updated);
    try {
      localStorage.setItem('equilibrium_global_reels', JSON.stringify(updated));
    } catch {}

    // Also save to user's profile reels list in localStorage (under key `equilibrium_reels_my-user-profile-${email}`)
    try {
      const email = userProfile?.email || 'default';
      const savedUserReels = localStorage.getItem(`equilibrium_reels_my-user-profile-${email}`);
      let userReelsList = [];
      if (savedUserReels) {
        userReelsList = JSON.parse(savedUserReels);
      }
      const updatedUserReels = [newReel, ...userReelsList];
      localStorage.setItem(`equilibrium_reels_my-user-profile-${email}`, JSON.stringify(updatedUserReels));
    } catch (e) {
      console.error("Error saving user reel:", e);
    }

    // Reset
    setVideoSrc('');
    setCaption('');
    setMusic('');
    setUploadOpen(false);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '22px 20px 32px', color: '#fff', fontFamily: J }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
        <div>
          <h2 style={{ fontFamily: G, fontStyle: 'italic', fontWeight: 800, fontSize: '1.7rem', letterSpacing: '-0.5px', color: '#fff', margin: '0 0 4px' }}>Calm Reels</h2>
          <p style={{ color: 'rgba(255,255,255,0.32)', fontSize: '0.86rem', margin: 0 }}>Zen video loops and stress-free breathing clips</p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.03 }} 
          whileTap={{ scale: 0.97 }} 
          onClick={() => setUploadOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', background: `linear-gradient(135deg, ${accent}, #8b5cf6)`, border: 'none', borderRadius: '12px', padding: '8px 16px', color: '#fff', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', fontFamily: J }}
        >
          <FaPlay size={9}/> Upload Reel
        </motion.button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {reels.map((reel, index) => (
          <ReelGridItem 
            key={reel.id} 
            reel={reel} 
            onClick={() => setActiveReelIndex(index)} 
          />
        ))}
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setUploadOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(9,10,15,0.85)', backdropFilter: 'blur(6px)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 15 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '440px', background: '#171c28', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '26px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative' }}>
              
              <button onClick={() => setUploadOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
                ✕
              </button>

              <h3 style={{ fontFamily: G, fontStyle: 'italic', fontSize: '1.3rem', margin: '0 0 16px' }}>Upload Calm Reel</h3>
              
              {/* File Input */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600', margin: 0 }}>SELECT VIDEO FILE (Max 1.5MB)</label>
                  {videoSrc && (
                    <button type="button" onClick={() => setVideoSrc('')} style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e', fontSize: '0.62rem', padding: '1px 6px', borderRadius: '4px', cursor: 'pointer' }}>Clear</button>
                  )}
                </div>
                <input type="file" accept="video/*" onChange={handleFileChange} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }} />
              </div>

              {/* Video Presets */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginBottom: '8px' }}>OR CHOOSE ZEN VIDEO LOOP PRESET</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {VIDEO_PRESETS.map((preset) => {
                    const active = videoSrc === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setVideoSrc(preset.url)}
                        style={{
                          padding: '6px 4px',
                          background: active ? `${accent}25` : 'rgba(255,255,255,0.02)',
                          border: active ? `2px solid ${accent}` : '1.5px solid rgba(255,255,255,0.08)',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '0.68rem',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>{preset.icon}</span>
                        <span style={{ fontSize: '0.62rem', opacity: active ? 1 : 0.7 }}>{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Video Preview */}
              {videoSrc && (
                <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', background: '#10141f', marginBottom: '18px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {videoSrc.startsWith('data:image/') ? (
                    <img src={videoSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <video src={resolvedPreviewSrc} muted controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  )}
                </div>
              )}

              {/* Caption */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginBottom: '6px' }}>CAPTION</label>
                <textarea rows={2} value={caption} onChange={e => setCaption(e.target.value)} placeholder="E.g. Take a deep breath..." style={{ width: '100%', padding: '10px 12px', background: '#10141f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', color: '#fff', fontSize: '0.84rem', outline: 'none', resize: 'none' }} />
              </div>

              {/* Music Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginBottom: '6px' }}>MUSIC TRACK NAME</label>
                <input type="text" value={music} onChange={e => setMusic(e.target.value)} placeholder="E.g. Calming Waves - Original Sound" style={{ width: '100%', padding: '10px 12px', background: '#10141f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', color: '#fff', fontSize: '0.84rem', outline: 'none' }} />
              </div>

              {/* Submit button */}
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                onClick={handleUpload}
                disabled={!videoSrc}
                style={{ width: '100%', padding: '12px', background: videoSrc ? accent : 'rgba(255,255,255,0.05)', color: videoSrc ? '#fff' : 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '0.9rem', cursor: videoSrc ? 'pointer' : 'not-allowed', fontFamily: J }}
              >
                Post Reel
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reels modal viewer */}
      <AnimatePresence>
        {activeReelIndex !== null && (
          <ReelsViewerModal
            reels={reels}
            initialIndex={activeReelIndex}
            onClose={() => setActiveReelIndex(null)}
            consultant={{ name: reels[activeReelIndex].creator.name, color: reels[activeReelIndex].creator.color }}
            onUpdateReels={(updated) => {
              setReels(updated);
              try {
                localStorage.setItem('equilibrium_global_reels', JSON.stringify(updated));
              } catch {}
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}




// ─────────────────────────────────────────────────────────────────
// ProfileCreationScreen — Full-tab form setup for User Profile
// ─────────────────────────────────────────────────────────────────
function ProfileCreationScreen({ userProfile, onSave, accent }) {
  const J = "'Plus Jakarta Sans', sans-serif";
  const S = "'Space Grotesk', sans-serif";
  const G = "'Cormorant Garamond', serif";

  const [pfp, setPfp] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState(userProfile?.name || '');
  const [gender, setGender] = useState('Male');
  const [preferences, setPreferences] = useState([]);

  const [customEmoji, setCustomEmoji] = useState('😊');
  const [customColor, setCustomColor] = useState('#ec4899');

  const PREF_OPTIONS = ['Stress Relief', 'Anxiety Control', 'Meditation', 'Sleep Restoration', 'Mindfulness', 'Emotional Balance'];

  const handlePfpChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        compressImage(reader.result, (compressed) => {
          setPfp(compressed);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePref = (pref) => {
    if (preferences.includes(pref)) {
      setPreferences(preferences.filter(p => p !== pref));
    } else {
      setPreferences([...preferences, pref]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !name.trim()) return;

    let finalColor = '#ec4899';
    const parsedPreset = parsePresetAvatar(pfp);
    if (parsedPreset) {
      finalColor = parsedPreset.color;
    } else if (pfp && pfp.startsWith('preset:custom:')) {
      finalColor = customColor;
    }
    
    const profile = {
      username: username.trim().toLowerCase().replace(/\s+/g,'_'),
      name: name.trim(),
      gender,
      preferences,
      pfp: pfp || '',
      bio: `Preferences: ${preferences.join(', ')}.`,
      color: finalColor
    };
    onSave(profile);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '0 20px', fontFamily: J, color: '#fff' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontFamily: G, fontStyle: 'italic', fontWeight: 800, fontSize: '2rem', color: '#fff', margin: '0 0 8px' }}>Create Your Account</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', margin: 0 }}>Join the social wellness circle & share your posts</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* PFP Uploader */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="pfp-upload" style={{ cursor: 'pointer', position: 'relative' }}>
            {renderAvatar(pfp, name || 'User', customColor, 100, '2rem')}
          </label>
          <input id="pfp-upload" type="file" accept="image/*" onChange={handlePfpChange} style={{ display: 'none' }} />
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>SET YOUR PROFILE PICTURE</span>
            {pfp && (
              <button 
                type="button" 
                onClick={() => setPfp('')}
                style={{ padding: '0 6px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e', fontSize: '0.66rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Preset & Custom Builder Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', width: '100%' }}>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontWeight: '700', letterSpacing: '0.5px', fontFamily: S }}>OR CHOOSE AESTHETIC PRESET</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px', width: '100%', maxWidth: '360px' }}>
            {PRESET_AVATARS.map((preset) => {
              const active = pfp === `preset:${preset.id}`;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setPfp(`preset:${preset.id}`)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: preset.grad,
                    border: active ? '2px solid #fff' : '1.5px solid transparent',
                    boxShadow: active ? '0 0 8px rgba(255,255,255,0.4)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    padding: 0
                  }}
                  title={preset.name}
                >
                  {preset.emoji}
                </button>
              );
            })}
          </div>
          
          {/* Custom builder */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>Custom Builder:</span>
            <input 
              type="color" 
              value={customColor} 
              onChange={(e) => {
                setCustomColor(e.target.value);
                setPfp(`preset:custom:${customEmoji}:${e.target.value}`);
              }}
              style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', background: 'none', padding: 0 }}
            />
            <input 
              type="text" 
              maxLength={2} 
              value={customEmoji} 
              onChange={(e) => {
                setCustomEmoji(e.target.value);
                setPfp(`preset:custom:${e.target.value}:${customColor}`);
              }}
              placeholder="😊"
              style={{ width: '32px', padding: '2px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '0.8rem', textAlign: 'center', outline: 'none' }}
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <label style={{ display: 'block', fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginBottom: '6px', fontFamily: S }}>USERNAME</label>
          <div style={{ display: 'flex', alignItems: 'center', background: '#10141f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0 12px' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', marginRight: '4px', fontSize: '0.9rem' }}>@</span>
            <input 
              type="text" 
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="username" 
              style={{ width: '100%', padding: '10px 0', background: 'none', border: 'none', color: '#fff', fontSize: '0.88rem', outline: 'none' }} 
            />
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label style={{ display: 'block', fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginBottom: '6px', fontFamily: S }}>FULL NAME</label>
          <input 
            type="text" 
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="E.g. Priya Sharma" 
            style={{ width: '100%', padding: '10px 12px', background: '#10141f', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', color: '#fff', fontSize: '0.88rem', outline: 'none' }} 
          />
        </div>

        {/* Gender */}
        <div>
          <label style={{ display: 'block', fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginBottom: '8px', fontFamily: S }}>GENDER</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            {['Male', 'Female', 'Non-Binary'].map(g => (
              <button 
                key={g}
                type="button"
                onClick={() => setGender(g)}
                style={{ 
                  padding: '9px 0', 
                  borderRadius: '10px', 
                  border: `1px solid ${gender === g ? accent : 'rgba(255,255,255,0.06)'}`, 
                  background: gender === g ? `${accent}15` : 'rgba(255,255,255,0.02)', 
                  color: gender === g ? '#fff' : 'rgba(255,255,255,0.4)', 
                  fontSize: '0.82rem', 
                  fontWeight: '700', 
                  cursor: 'pointer',
                  transition: 'all 0.25s' 
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div>
          <label style={{ display: 'block', fontSize: '0.76rem', color: 'rgba(255,255,255,0.45)', fontWeight: '600', marginBottom: '8px', fontFamily: S }}>MINDFULNESS PREFERENCES</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {PREF_OPTIONS.map(opt => {
              const active = preferences.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => togglePref(opt)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: `1px solid ${active ? accent : 'rgba(255,255,255,0.08)'}`,
                    background: active ? `${accent}20` : 'rgba(255,255,255,0.015)',
                    color: active ? '#fff' : 'rgba(255,255,255,0.5)'
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={!username.trim() || !name.trim()}
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: `linear-gradient(135deg, ${accent}, #8b5cf6)`, 
            color: '#fff', 
            border: 'none', 
            borderRadius: '12px', 
            fontWeight: '700', 
            fontSize: '0.9rem', 
            cursor: 'pointer', 
            marginTop: '10px' 
          }}
        >
          Create Account & View Profile
        </motion.button>
      </form>
    </div>
  );
}




export default function Home({ userProfile, onLogout }) {
  const [tab,       setTab]       = useState('home');
  const [activeAI,  setActiveAI]  = useState('AURA');
  const [sessions,  setSessions]  = useState({
    AURA: [{ id:1, title:'New conversation', messages:[], active:true }],
    MAX:  [{ id:1, title:'New conversation', messages:[], active:true }],
  });
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [listening, setListening] = useState(false);
  const [sidebar,   setSidebar]   = useState(true);
  const [moodToday,      setMoodToday]      = useState(null);
  const [showBreath,     setShowBreath]     = useState(false);
  const [showSOS,        setShowSOS]        = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isRecording,    setIsRecording]    = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const mediaRecRef    = useRef(null);
  const recordTimerRef = useRef(null);
  const audioChunksRef = useRef([]);
  const durationRef    = useRef(0);
  const transcriptRef  = useRef('');
  const [journalInput,   setJournalInput]   = useState('');
  const [journalEntries, setJournalEntries] = useState(() => { try { return JSON.parse(localStorage.getItem('eq_journal')||'[]'); } catch { return []; } });
  const [journalInsight, setJournalInsight] = useState('');
  const [journalLoading, setJournalLoading] = useState(false);
  const [sessionSummary, setSessionSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryOpen,    setSummaryOpen]    = useState(false);
  const [consultants,    setConsultants]    = useState([]);
  const [applications,   setApplications]   = useState([]);
  const [showJoin,       setShowJoin]       = useState(false);
  const [showApps,       setShowApps]       = useState(false);
  const [payConsultant,  setPayConsultant]  = useState(null);
  const [freeConsultant, setFreeConsultant] = useState(null);
  const [isPremium,      setIsPremium]      = useState(() => {
    try { return localStorage.getItem('eq_premium') === 'true'; } catch { return false; }
  });
  const [showUpgrade,    setShowUpgrade]    = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgradePayment = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      alert("Failed to load Razorpay SDK. Please check your internet connection.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/payment/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: 199,
          consultantName: 'PsychoLink Premium Subscription'
        })
      });

      if (!res.ok) {
        throw new Error("Razorpay not configured on server.");
      }

      const { order, key } = await res.json();

      const options = {
        key: key,
        amount: order.amount,
        currency: order.currency,
        name: 'PsychoLink Premium',
        description: 'Monthly Premium Membership Subscription',
        order_id: order.id,
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
        theme: {
          color: '#c79552'
        },
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_BASE}/api/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setIsPremium(true);
              localStorage.setItem('eq_premium', 'true');
              setShowUpgrade(false);
              alert('Congratulations! Your Premium subscription is now active! 🎉');
            } else {
              alert("Payment verification failed.");
            }
          } catch (e) {
            console.error("Verification error:", e);
            alert("Payment completed but verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: function () {
            console.log('Payment modal dismissed');
          }
        },
        prefill: {
          name: myProfileData ? myProfileData.name : (userProfile?.name || 'Mindfulness Seeker'),
          email: userProfile?.email || 'seeker@psycholink.in',
          contact: '9999999999'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.warn("Backend order failed, using test checkout:", err.message);
      openFrontendTestCheckout();
    }
  };

  const openFrontendTestCheckout = () => {
    try {
      const options = {
        key: 'rzp_test_5Vb9x8y7Z6w5v4',
        amount: 19900,
        currency: 'INR',
        name: 'PsychoLink Premium',
        description: 'Monthly Premium Membership Subscription',
        theme: {
          color: '#c79552'
        },
        handler: function (response) {
          setIsPremium(true);
          localStorage.setItem('eq_premium', 'true');
          setShowUpgrade(false);
          alert('Congratulations! Your Premium subscription is now active! 🎉');
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      setIsPremium(true);
      localStorage.setItem('eq_premium', 'true');
      setShowUpgrade(false);
    }
  };
  const [call,           setCall]           = useState(null); // { consultant, audioOnly }
  const [usedFree,       setUsedFree]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('eq_used_free') || '{}'); } catch { return {}; }
  });
  const [activeProfile, setActiveProfile]   = useState(null);
  const [myProfileData, setMyProfileData] = useState(() => {
    try {
      const email = userProfile?.email || 'default';
      const saved = localStorage.getItem(`equilibrium_my_profile_${email}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);
  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);
  const srRef       = useRef(null);

  const J = "'Plus Jakarta Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
  const S = "'Space Grotesk','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',sans-serif";
  const G = "'Cormorant Garamond','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','NotoEmojiFallback',serif";

  const accent   = activeAI === 'AURA' ? '#ef4444' : '#22c55e';
  const accentB  = activeAI === 'AURA' ? 'rgba(239,68,68,0.03)' : 'rgba(34,197,94,0.03)';
  const accentBr = activeAI === 'AURA' ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)';

  const activeSession = sessions[activeAI].find(s => s.active) || sessions[activeAI][0];
  const messages      = activeSession?.messages || [];
  const firstName     = (userProfile?.name || 'User').split(' ')[0];
  const hour          = new Date().getHours();
  const greeting      = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const MOODS = [
    { e:'😊', l:'Great' }, { e:'😌', l:'Calm' }, { e:'😐', l:'Okay' },
    { e:'😟', l:'Low'   }, { e:'😔', l:'Sad'  }
  ];

  const navItems = [
    { id:'home',       icon:<FaHome size={15}/>,        label:'Home'         },
    { id:'chat',       icon:<FaComments size={15}/>,     label:'AI Chat'      },
    { id:'report',     icon:<FaBrain size={15}/>,        label:'Brain Report' },
    { id:'consult',    icon:<FaUserMd size={15}/>,       label:'Consultants'  },
    { id:'progress',   icon:<FaChartLine size={15}/>,    label:'Progress'     },
    { id:'journal',    icon:<FaBook size={15}/>,         label:'Journal'      },
    { id:'calm',       icon:<FaSpa size={15}/>,          label:'Calm Studio'  },
    { id:'calm-reels', icon:<FaPlay size={11}/>,         label:'Calm Reels'   },
    { id:'my-profile', icon:<FaUser size={13}/>,         label: myProfileData ? 'My Profile' : 'Create Account' },
  ];

  useEffect(() => {
    const l = document.createElement('link');
    l.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;700&family=Cormorant+Garamond:ital,wght@0,600;1,600;1,700&family=Playfair+Display:ital,wght@0,400;1,400&display=swap';
    document.head.appendChild(l);
    const s = document.createElement('style');
    s.innerHTML = '*{-webkit-font-smoothing:antialiased;box-sizing:border-box;}textarea,input{outline:none;}textarea::placeholder,input::placeholder{color:rgba(255,255,255,0.2);}::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:2px;}';
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(l); document.head.removeChild(s); } catch(e) {} }
  }, []);

  // Fetch consultants from backend
  useEffect(() => {
    fetch(`${API_BASE}/api/consultants`)
      .then(r => r.json()).then(setConsultants).catch(() => setConsultants([]));
  }, []);

  const fetchApplications = () => {
    fetch(`${API_BASE}/api/admin/applications`)
      .then(r => r.json()).then(setApplications).catch(() => setApplications([]));
  };

  const removeConsultant = async (c) => {
    if (!window.confirm(`Remove ${c.name} from the platform?`)) return;
    try {
      await fetch(`${API_BASE}/api/consultants/${c.id}`, { method:'DELETE' });
      setConsultants(prev => prev.filter(x => x.id !== c.id));
    } catch (e) { alert('Could not remove — check server.'); }
  };

  const handleBookConsultant = (c) => {
    if (usedFree[c.id]) {
      setPayConsultant(c);
    } else {
      setFreeConsultant(c);
      const updated = { ...usedFree, [c.id]: true };
      setUsedFree(updated);
      localStorage.setItem('eq_used_free', JSON.stringify(updated));
    }
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

  const getMsgs = () => sessions[activeAI].find(s => s.active)?.messages || [];

  const updateSession = (msgs, title) => {
    setSessions(prev => ({
      ...prev,
      [activeAI]: prev[activeAI].map(s => s.active ? { ...s, messages:msgs, title:title||s.title } : s)
    }));
  };

  // ─────────────────────────────────────────────────────────
  // sendMsg — now calls the LOCAL server (server.js) on
  // http://localhost:3001/api/chat instead of hitting
  // api.anthropic.com directly from the browser.
  // Sends AURA_PROMPT / MAX_PROMPT as a custom systemPrompt
  // so the local server uses these detailed personas.
  // ─────────────────────────────────────────────────────────
  const sendMsg = async (text) => {
    const t = (text || input).trim();
    if (!t || loading) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    const cur     = getMsgs();
    const uMsg    = { role:'user', content:t, ts:new Date() };
    const newMsgs = [...cur, uMsg];
    const title   = cur.length === 0 ? t.slice(0,36) + (t.length > 36 ? '...' : '') : undefined;
    updateSession(newMsgs, title);
    setLoading(true);
    playTone('send');
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          messages: newMsgs.map(m => ({ role:m.role, content:m.content })),
          persona: activeAI,
          systemPrompt: activeAI === 'AURA' ? AURA_PROMPT : MAX_PROMPT,
        })
      });
      if (!res.ok) {
        let detail = '';
        try { const ej = await res.json(); detail = ej.error || ''; } catch {}
        throw new Error(`${res.status}${detail ? ' - ' + detail : ''}`);
      }
      const data  = await res.json();
      const reply = data.reply || "I'm here for you 🌸";
      updateSession([...newMsgs, { role:'assistant', content:reply, ts:new Date() }], title);
      playTone('receive');
    } catch(e) {
      console.error('Chat error:', e);
      updateSession([...newMsgs, { role:'assistant', content:`⚠️ Connection lost (${e.message}). Please try again.`, ts:new Date() }], title);
    }
    setLoading(false);
  };

  const newChat = () => {
    const id = Date.now();
    setSessions(prev => ({
      ...prev,
      [activeAI]: [...prev[activeAI].map(s => ({ ...s, active:false })), { id, title:'New conversation', messages:[], active:true }]
    }));
  };

  const switchSession = id => {
    setSessions(prev => ({ ...prev, [activeAI]: prev[activeAI].map(s => ({ ...s, active:s.id===id })) }));
  };

  const toggleMic = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) return;
    if (listening) { srRef.current?.stop(); setListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    srRef.current = new SR();
    srRef.current.lang = 'en-IN';
    srRef.current.continuous = false;
    srRef.current.interimResults = false;
    srRef.current.onresult = e => { setInput(e.results[0][0].transcript); setListening(false); };
    srRef.current.onerror  = () => setListening(false);
    srRef.current.onend    = () => setListening(false);
    srRef.current.start();
    setListening(true);
  };

  const speakText = text => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u      = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const v      = activeAI === 'AURA'
      ? voices.find(v => v.name.includes('Zira') || v.name.includes('Samantha'))
      : voices.find(v => v.name.includes('David') || v.name.includes('Google UK English Male'));
    if (v) u.voice = v;
    u.rate  = speechRate;
    u.pitch = activeAI === 'AURA' ? 1.2 : 0.8;
    u.onstart = () => setIsAiSpeaking(true);
    u.onend = () => setIsAiSpeaking(false);
    u.onerror = () => setIsAiSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const handleCopyText = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearActiveSession = () => {
    if (!window.confirm("Are you sure you want to clear this conversation history?")) return;
    updateSession([], 'New conversation');
  };

  const fmt = d => d ? new Date(d).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }) : '';

  const playTone = (type) => {
    try {
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      const osc=ctx.createOscillator(), gain=ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination); osc.type='sine';
      if (type==='send') { osc.frequency.setValueAtTime(880,ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(660,ctx.currentTime+0.12); gain.gain.setValueAtTime(0.07,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.2); }
      else { osc.frequency.setValueAtTime(440,ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(550,ctx.currentTime+0.18); gain.gain.setValueAtTime(0.05,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.3); }
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime+0.35);
    } catch {}
  };

  // ── Voice recording: MediaRecorder (audio) + SpeechRecognition (transcript → AI) ──
  const startVoiceRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      durationRef.current   = 0;
      transcriptRef.current = '';

      // 1. SpeechRecognition — use ref so transcript is always fresh in callbacks
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        srRef.current = new SR();
        srRef.current.lang           = 'en-IN';
        srRef.current.continuous     = true;
        srRef.current.interimResults = true;
        srRef.current.onresult = (e) => {
          let finalText = '';
          for (let i = 0; i < e.results.length; i++) {
            if (e.results[i].isFinal) finalText += e.results[i][0].transcript + ' ';
          }
          if (finalText.trim()) transcriptRef.current = finalText.trim();
        };
        srRef.current.onerror = () => {}; // silently ignore SR errors
        try { srRef.current.start(); } catch {}
      }

      // 2. MediaRecorder for audio blob
      const mr = new MediaRecorder(stream);
      mediaRecRef.current = mr;
      mr.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };

      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        // Give SpeechRecognition 600ms to flush final results
        await new Promise(r => setTimeout(r, 600));
        try { srRef.current?.stop(); } catch {}
        await new Promise(r => setTimeout(r, 200));

        const blob       = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url        = URL.createObjectURL(blob);
        const dur        = durationRef.current;      // ref — always correct
        const transcript = transcriptRef.current || '🎤 Voice message';

        // Show audio bubble + transcript
        const cur      = getMsgs();
        const voiceMsg = { role:'user', content: transcript, audioUrl: url, audioDuration: dur, ts: new Date() };
        const newMsgs  = [...cur, voiceMsg];
        updateSession(newMsgs);
        setIsRecording(false);
        setRecordDuration(0);
        clearInterval(recordTimerRef.current);

        // Send to AI
        setLoading(true);
        playTone('send');
        try {
          const res = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: newMsgs.map(m => ({ role: m.role, content: m.content })),
              persona: activeAI,
              systemPrompt: activeAI === 'AURA' ? AURA_PROMPT : MAX_PROMPT,
            })
          });
          if (!res.ok) throw new Error(res.status);
          const data  = await res.json();
          const reply = data.reply || "I'm here for you 🌸";
          updateSession([...newMsgs, { role:'assistant', content: reply, ts: new Date() }]);
          playTone('receive');
        } catch (e) {
          updateSession([...newMsgs, { role:'assistant', content:`⚠️ Connection lost (${e.message}).`, ts: new Date() }]);
        }
        setLoading(false);
      };

      mr.start(200);
      setIsRecording(true);
      setRecordDuration(0);
      // Update both state (for display) and ref (for callback)
      recordTimerRef.current = setInterval(() => {
        durationRef.current += 1;
        setRecordDuration(d => d + 1);
      }, 1000);

    } catch (e) {
      alert('Microphone access denied. Please allow mic in browser settings.');
    }
  };

  const stopVoiceRecord = () => {
    if (mediaRecRef.current && mediaRecRef.current.state !== 'inactive') {
      mediaRecRef.current.stop();
    }
    clearInterval(recordTimerRef.current);
  };

  const handleMicClick = () => {
    if (isRecording) { stopVoiceRecord(); }
    else { startVoiceRecord(); }
  };

  const saveJournal = () => {
    if (!journalInput.trim()) return;
    const entry = { id:Date.now(), text:journalInput.trim(), date:new Date().toISOString() };
    const updated = [entry,...journalEntries].slice(0,50);
    setJournalEntries(updated);
    localStorage.setItem('eq_journal', JSON.stringify(updated));
    setJournalInput('');
  };

  const getJournalInsight = async () => {
    if (!journalEntries.length) return;
    setJournalLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/journal/summarize`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ entries: journalEntries.slice(0,10).map(e=>e.text) }) });
      const data = await res.json();
      setJournalInsight(data.insight || 'No insight generated.');
    } catch { setJournalInsight('Could not get insight — check server.'); }
    setJournalLoading(false);
  };

  const getSessionSummary = async () => {
    if (messages.length < 2) return;
    setSummaryLoading(true); setSummaryOpen(true);
    try {
      const res = await fetch(`${API_BASE}/api/session/summary`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ messages: messages.map(m=>({role:m.role,content:m.content})), persona:activeAI }) });
      const data = await res.json();
      setSessionSummary(data.summary || 'Unable to generate summary.');
    } catch { setSessionSummary('Could not generate summary.'); }
    setSummaryLoading(false);
  };

  return (
    <div style={{ width:'100vw', height:'100vh', display:'flex', background:'var(--bg-app)', fontFamily:J, overflow:'hidden', position:'relative' }}>

      {/* ── GLOBAL BG ──────────────────────────────────────────── */}
      <div style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
        {/* Subtle grid pattern */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255, 255, 255, 0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.012) 1px, transparent 1px)', backgroundSize:'60px 60px', opacity:0.65 }}/>
        
        {/* Ambient floating blobs */}
        <motion.div 
          animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position:'absolute', top:'-10%', left:'15%', width:'400px', height:'400px', borderRadius:'50%', background: activeAI === 'AURA' ? 'radial-gradient(circle, rgba(239,68,68,0.035) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(34,197,94,0.035) 0%, transparent 70%)', filter:'blur(60px)', transition:'all 1s' }}
        />
        <motion.div 
          animate={{ x: [20, -20, 20], y: [20, -20, 20] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position:'absolute', bottom:'-10%', right:'10%', width:'450px', height:'450px', borderRadius:'50%', background: activeAI === 'AURA' ? 'radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(148,163,184,0.02) 0%, transparent 70%)', filter:'blur(70px)', transition:'all 1s' }}
        />
      </div>

      {/* ══ SIDEBAR ════════════════════════════════════════════════ */}
      <AnimatePresence>
        {sidebar && (
          <motion.aside initial={{ x:-270, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:-270, opacity:0 }}
            transition={{ type:'spring', stiffness:300, damping:30 }}
            style={{ width:'255px', height:'100vh', flexShrink:0, display:'flex', flexDirection:'column', background:'var(--bg-sidebar)', backdropFilter:'blur(40px)', borderRight:'1px solid var(--border-subtle)', position:'relative', zIndex:20 }}>

            {/* Brand */}
            <div style={{ padding:'22px 16px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'9px', marginBottom:'20px', userSelect:'none' }}>
                <motion.div animate={{ scale:[1,1.3,1], opacity:[0.6,1,0.6] }} transition={{ duration:2.5, repeat:Infinity }}
                  style={{ width:'8px', height:'8px', borderRadius:'50%', background:accent, transition:'background 0.5s' }}/>
                <span style={{ fontFamily: G, fontStyle: 'italic', fontWeight: '800', fontSize: '1.2rem', color: '#fff', letterSpacing: '-0.5px' }}>equilibrium</span>
                <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', fontFamily: S, letterSpacing: '1px', marginLeft: '2px', fontWeight:'700' }}>CORE</span>
              </div>
              {/* AI Toggle */}
              <div style={{ display:'flex', background:'rgba(255,255,255,0.02)', borderRadius:'14px', padding:'4px', gap:'4px', border:'1px solid var(--border-subtle)' }}>
                {[{ k:'AURA', g:'#f43f5e' }, { k:'MAX', g:'#14b8a6' }].map(ai => {
                  const isActive = activeAI === ai.k;
                  return (
                    <button key={ai.k} onClick={() => setActiveAI(ai.k)}
                      style={{ flex:1, padding:'10px 0', border:'none', borderRadius:'10px', cursor:'pointer', fontSize:'0.75rem', fontWeight:'700', fontFamily:S, letterSpacing:'1px', transition:'all 0.3s', background: isActive ? ai.g : 'transparent', color: isActive ? '#fff' : 'rgba(255,255,255,0.3)', boxShadow: isActive ? 'var(--shadow-premium)' : 'none', userSelect:'none' }}>
                      {ai.k} Core
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Nav */}
            <div style={{ padding:'12px 10px 6px' }}>
              {navItems.map(item => {
                const isActive = tab === item.id;
                return (
                  <motion.button key={item.id} whileHover={{ background:'rgba(255,255,255,0.04)' }} whileTap={{ scale:0.98 }}
                    onClick={() => setTab(item.id)}
                    style={{ 
                      width:'100%', padding:'11px 14px', 
                      background: isActive ? 'rgba(255,255,255,0.03)' : 'transparent', 
                      border: '1px solid transparent',
                      borderLeft: isActive ? `3px solid ${accent}` : '3px solid transparent',
                      borderRadius: isActive ? '0 12px 12px 0' : '12px', 
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.45)', 
                      fontSize:'0.85rem', fontWeight: isActive ? '700' : '500', 
                      cursor:'pointer', fontFamily:J, display:'flex', alignItems:'center', gap:'12px', 
                      transition:'all 0.2s', marginBottom:'4px' 
                    }}>
                    <span style={{ color: isActive ? accent : 'rgba(255,255,255,0.25)', transition:'color 0.2s', display:'flex', alignItems:'center' }}>{item.icon}</span>
                    {item.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Chat history */}
            {tab === 'chat' && (
              <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column', padding:'6px 10px 0' }}>
                <motion.button whileHover={{ background: 'rgba(255,255,255,0.04)' }} whileTap={{ scale:0.97 }} onClick={newChat}
                  style={{ width:'100%', padding:'9px 13px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:'11px', color:'rgba(255,255,255,0.6)', fontSize:'0.82rem', fontWeight:'600', cursor:'pointer', fontFamily:J, display:'flex', alignItems:'center', gap:'9px', transition:'all 0.2s', marginBottom:'8px' }}>
                  <FaPlus size={10} color={accent}/> New conversation
                </motion.button>
                <p style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.2)', fontFamily:S, letterSpacing:'1.5px', fontWeight:'600', padding:'2px 4px 6px', margin:0 }}>HISTORY</p>
                <div style={{ overflowY:'auto', flex:1 }}>
                  {[...sessions[activeAI]].reverse().map(s => (
                    <motion.div key={s.id} whileHover={{ background:'rgba(255,255,255,0.04)' }} onClick={() => switchSession(s.id)}
                      style={{ padding:'8px 11px', borderRadius:'10px', cursor:'pointer', marginBottom:'2px', background:s.active? 'rgba(255,255,255,0.03)' :'transparent', border: s.active ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent', borderLeft: s.active ? `3px solid ${accent}` : '3px solid transparent', transition:'all 0.2s', display:'flex', alignItems:'center', gap:'8px' }}>
                      <FaHistory size={9} color={s.active?accent:'rgba(255,255,255,0.2)'}/>
                      <span style={{ fontSize:'0.79rem', color:s.active?'rgba(255,255,255,0.85)':'rgba(255,255,255,0.35)', fontWeight:s.active?'600':'400', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{s.title}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            {tab !== 'chat' && <div style={{ flex:1 }}/>}


            {/* User + Logout */}
            <div style={{ padding:'12px 14px', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'14px', background:'rgba(255,255,255,0.01)', border:'1px solid var(--border-subtle)' }}>
                {renderAvatar(
                  myProfileData ? myProfileData.pfp : userProfile?.picture,
                  myProfileData ? myProfileData.name : (userProfile?.name || 'User'),
                  myProfileData?.color || '#ec4899',
                  32,
                  '0.8rem'
                )}
                <div style={{ flex:1, overflow:'hidden', minWidth:0 }}>
                  <p style={{ margin:0, fontSize:'0.8rem', fontWeight:'600', color:'rgba(255,255,255,0.85)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{myProfileData ? myProfileData.name : (userProfile?.name || 'User')}</p>
                  <p style={{ margin:0, fontSize:'0.64rem', color:'rgba(255,255,255,0.3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{myProfileData ? `@${myProfileData.username}` : (userProfile?.email || '')}</p>
                </div>
                <motion.button whileHover={{ color:'#f43f5e', background: 'rgba(244,63,94,0.05)' }} whileTap={{ scale:0.9 }} onClick={onLogout}
                  style={{ background:'none', border:'none', color:'rgba(255,255,255,0.25)', cursor:'pointer', padding:'6px', borderRadius:'8px', transition:'all 0.2s', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <FaSignOutAlt size={12}/>
                </motion.button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ══ MAIN ════════════════════════════════════════════════════ */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', position:'relative', zIndex:5 }}>

        {/* Top bar */}
        <div style={{ height:'56px', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', borderBottom:'1px solid var(--border-subtle)', background:'rgba(8,10,16,0.55)', backdropFilter:'blur(30px)' }}>
          <motion.button whileHover={{ background:'rgba(255,255,255,0.05)' }} whileTap={{ scale:0.96 }} onClick={() => setSidebar(s => !s)}
            style={{ width:'32px', height:'32px', borderRadius:'8px', background:'rgba(255,255,255,0.01)', border:'1px solid var(--border-subtle)', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'3.5px', flexShrink:0 }}>
            {[0,1,2].map(i => <div key={i} style={{ width:'12px', height:'1.5px', background:'rgba(255,255,255,0.6)', borderRadius:'1px' }}/>)}
          </motion.button>
 
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            {tab === 'chat' ? (
              <RobotAvatar expression="smile" size="xs" glowColor={accent} style={{ marginRight: '4px' }} />
            ) : (
              <motion.div animate={{ scale:[1,1.25,1], opacity:[0.7,1,0.7] }} transition={{ duration:2, repeat:Infinity }}
                style={{ width:'6px', height:'6px', borderRadius:'50%', background:accent, transition:'background 0.5s' }}/>
            )}
            <span style={{ fontFamily:G, fontStyle:'italic', fontWeight:'600', fontSize:'0.96rem', color:'#fff' }}>
              {tab==='home'       ? 'Dashboard'
              :tab==='chat'       ? (activeAI==='AURA' ? 'Aura · Emotional AI' : 'Max · Cognitive AI')
              :tab==='report'     ? 'Neural Brain Report'
              :tab==='consult'    ? 'Consultants'
              :tab==='calm'       ? 'Calm Studio'
              :tab==='calm-reels' ? 'Calm Reels'
              :tab==='my-profile' ? (myProfileData ? 'My Profile' : 'Create Account')
              :tab==='journal'    ? 'My Journal'
              :                     'My Progress'}
            </span>
          </div>
 
          <motion.button whileHover={{ background:'rgba(255,255,255,0.05)' }} whileTap={{ scale:0.96 }}
            style={{ width:'32px', height:'32px', borderRadius:'8px', background:'rgba(255,255,255,0.01)', border:'1px solid var(--border-subtle)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
            <FaBell size={12} color="rgba(255,255,255,0.5)"/>
            <div style={{ position:'absolute', top:'6px', right:'6px', width:'5px', height:'5px', borderRadius:'50%', background:'#f43f5e' }}/></motion.button>
        </div>

        {/* ════ TABS ═══════════════════════════════════════════════ */}
        <div style={{ flex:1, overflow:'hidden', position:'relative' }}>
          <AnimatePresence mode="wait">

            {/* ══ HOME ═══════════════════════════════════════════════ */}
            {tab === 'home' && (
              <DashboardHome
                firstName={firstName}
                greeting={greeting}
                accent={accent}
                accentB={accentB}
                accentBr={accentBr}
                activeAI={activeAI}
                moodToday={moodToday}
                setMoodToday={setMoodToday}
                MOODS={MOODS}
                setShowBreath={setShowBreath}
                setTab={setTab}
                setActiveAI={setActiveAI}
                consultants={consultants}
                journalCount={journalEntries.length}
                sessionCount={sessions[activeAI].length}
              />
            )}

            {/* ══ CHAT ═══════════════════════════════════════════════ */}
            {tab === 'chat' && (
              <motion.div key="chat" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}
                style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', overflow:'hidden' }}>

                {/* Chat background */}
                <div style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
                  {activeAI==='AURA' ? (
                    <>
                      <motion.div animate={{ x:['-20%','20%','-20%'], y:['0%','12%','0%'] }} transition={{ duration:14, repeat:Infinity, ease:'easeInOut' }}
                        style={{ position:'absolute', top:'-20%', left:'-10%', width:'60%', height:'60%', borderRadius:'50%', background:'radial-gradient(circle,rgba(236,72,153,0.07),transparent 70%)', filter:'blur(40px)' }}/>
                      <motion.div animate={{ x:['20%','-20%','20%'], y:['10%','-10%','10%'] }} transition={{ duration:18, repeat:Infinity, ease:'easeInOut' }}
                        style={{ position:'absolute', bottom:'-10%', right:'-10%', width:'55%', height:'55%', borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.06),transparent 70%)', filter:'blur(40px)' }}/>
                    </>
                  ) : (
                    <>
                      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(45,212,191,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(45,212,191,0.03) 1px,transparent 1px)', backgroundSize:'40px 40px' }}/>
                      <motion.div animate={{ opacity:[0.04,0.1,0.04] }} transition={{ duration:4, repeat:Infinity }}
                        style={{ position:'absolute', top:'20%', right:'15%', width:'35%', height:'35%', borderRadius:'50%', background:'radial-gradient(circle,rgba(45,212,191,0.1),transparent 70%)', filter:'blur(30px)' }}/>
                    </>
                  )}
                </div>

                {/* Session controls top bar */}
                {messages.length > 1 && (
                  <div style={{ flexShrink:0, display:'flex', justifyContent:'flex-end', padding:'12px 24px 0', position:'relative', zIndex:10 }}>
                    <div style={{ maxWidth:'1080px', width:'100%', margin:'0 auto', display:'flex', justifyContent:'flex-end', gap:'8px' }}>
                      <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={clearActiveSession}
                        style={{ padding:'7px 14px', borderRadius:20, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)', color:'rgba(255,255,255,0.5)', fontSize:'0.75rem', fontWeight:700, cursor:'pointer', fontFamily:J, display:'flex', alignItems:'center', gap:6 }}>
                        🗑️ Clear Session
                      </motion.button>
                      <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={getSessionSummary}
                        style={{ padding:'7px 14px', borderRadius:20, border:`1px solid ${accentBr}`, background:accentB, color:accent, fontSize:'0.75rem', fontWeight:700, cursor:'pointer', fontFamily:J, display:'flex', alignItems:'center', gap:6 }}>
                        📋 Session Summary
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* 2-Column Console Layout */}
                <div style={{ flex:1, display:'flex', position:'relative', overflow:'hidden', zIndex:1 }}>
                  
                  {/* Left Column: Messages list & input */}
                  <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative' }}>
                    
                    {/* Scrollable chat thread */}
                    <div style={{ flex:1, overflowY:'auto', padding:'8px 20px 10px', display:'flex', flexDirection:'column' }}>
                      <div style={{ maxWidth:'760px', width:'100%', margin:'0 auto', display:'flex', flexDirection:'column', gap:'14px', flex:1, justifyContent:messages.length===0?'center':'flex-start' }}>
                        {messages.length === 0 && (
                          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
                            style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'30px 20px' }}>

                            <div style={{ position:'relative', marginBottom:'24px' }}>
                              <RobotAvatar expression="happy" size="lg" glowColor={accent} />
                              <div className="scanner-line" style={{ '--scanner-color': accent, width: '130px', margin: '0 auto', left: '50px' }} />
                            </div>
                            <h2 style={{ fontFamily:G, fontStyle:'italic', fontWeight:'600', fontSize:'2.2rem', color:'#fff', marginBottom:'8px' }}>
                              {activeAI === 'AURA' ? "Hi, I'm Aura 🌸" : "Hello, I'm Max"}
                            </h2>
                            <p style={{ color:'rgba(255,255,255,0.38)', fontSize:'0.88rem', lineHeight:'1.75', maxWidth:'420px', marginBottom:'32px', fontFamily:J }}>
                              {activeAI === 'AURA'
                                ? "I'm your emotional anchor. Here to listen and support you through anything."
                                : "I'm your cognitive analyst. Ready to break down patterns and build solutions."}
                            </p>
                            
                            {/* Suggestion Cards */}
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', width:'100%', maxWidth:'650px', margin:'0 auto' }}>
                              {SUGGESTIONS_ENHANCED[activeAI].map((s,i) => (
                                <motion.button key={i} whileHover={{ background:'rgba(255,255,255,0.035)', borderColor:`${accent}30`, y:-3 }} whileTap={{ scale:0.98 }}
                                  onClick={() => sendMsg(s.text)}
                                  style={{ padding:'18px', background:'rgba(255,255,255,0.015)', border:'1px solid var(--border-subtle)', borderRadius:'20px', color:'rgba(255,255,255,0.7)', fontSize:'0.84rem', cursor:'pointer', fontFamily:J, textAlign:'left', lineHeight:1.4, transition:'all 0.25s', display:'flex', flexDirection:'column', justifyContent:'space-between', gap:8, boxShadow:'var(--shadow-card)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontSize: '1.25rem' }}>{s.icon}</span>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <span style={{ fontWeight:'700', color: '#fff' }}>{s.text}</span>
                                      <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.35)', marginTop: '2px' }}>{s.sub}</span>
                                    </div>
                                  </div>
                                  <span style={{ fontSize:'0.72rem', color:accent, fontWeight:'800', letterSpacing:'0.5px', marginTop: '6px' }}>ASK ASSISTANT ➔</span>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {messages.map((msg,i) => (
                          <motion.div key={i} initial={{ opacity:0, y:8, scale:0.98 }} animate={{ opacity:1, y:0, scale:1 }} transition={{ duration:0.25 }}
                            style={{ display:'flex', justifyContent:msg.role==='user'?'flex-end':'flex-start', alignItems:'flex-end', gap:'12px' }}>

                            {msg.role !== 'user' && (
                              <RobotAvatar expression="smile" size="sm" glowColor={accent} style={{ marginBottom: '18px', flexShrink: 0 }} />
                            )}
                            <div style={{ maxWidth:'72%' }}>
                              <div style={{ 
                                padding:'12px 18px', 
                                background:msg.role==='user'?`linear-gradient(135deg, ${accent}15, ${accent}04)`:'rgba(255,255,255,0.015)', 
                                border:`1px solid ${msg.role==='user'?accent+'35':'var(--border-subtle)'}`, 
                                borderRadius:msg.role==='user'?'20px 20px 4px 20px':'20px 20px 20px 4px', 
                                color:'rgba(255,255,255,0.92)', 
                                fontSize:'0.88rem', 
                                lineHeight:'1.65', 
                                fontFamily:J, 
                                whiteSpace:'pre-wrap', 
                                backdropFilter: 'blur(10px)',
                                boxShadow:msg.role==='user'?`0 8px 32px ${accent}05, inset 0 1px 0 rgba(255,255,255,0.03)`:'var(--shadow-premium), inset 0 1px 0 rgba(255,255,255,0.03)' 
                              }}>
                                {msg.audioUrl ? (
                                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                    <audio src={msg.audioUrl} controls style={{ height:32, maxWidth:200, filter:'invert(1) hue-rotate(180deg)', opacity:0.85 }}/>
                                    <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.5)', fontFamily:S }}>{msg.audioDuration}s</span>
                                  </div>
                                ) : msg.content}
                              </div>
                              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginTop:'4px', justifyContent:msg.role==='user'?'flex-end':'flex-start', padding: '0 4px' }}>
                                <span style={{ fontSize:'0.61rem', color:'rgba(255,255,255,0.2)', fontFamily:S }}>{fmt(msg.ts)}</span>
                                {msg.role === 'assistant' && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <motion.button whileHover={{ color:accent }} whileTap={{ scale:0.9 }} onClick={() => speakText(msg.content)}
                                      title="Speak response"
                                      style={{ background:'none', border:'none', color:'rgba(255,255,255,0.22)', cursor:'pointer', padding:0, transition:'color 0.2s', display:'flex', alignItems:'center' }}>
                                      <FaVolumeUp size={10}/>
                                    </motion.button>
                                    <motion.button whileHover={{ color:accent }} whileTap={{ scale:0.9 }} onClick={() => handleCopyText(msg.content, i)}
                                      title="Copy response"
                                      style={{ background:'none', border:'none', color:'rgba(255,255,255,0.22)', cursor:'pointer', padding:0, transition:'color 0.2s', display:'flex', alignItems:'center' }}>
                                      {copiedIndex === i ? <FaCheck size={10} color="#10b981"/> : <FaCopy size={10}/>}
                                    </motion.button>
                                  </div>
                                )}
                              </div>
                            </div>
                            {msg.role === 'user' && (
                              <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:`linear-gradient(135deg,${accent},var(--accent-purple))`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginBottom:'18px', fontWeight:'800', fontSize:'0.72rem', color:'#fff', boxShadow: `0 4px 10px ${accent}25` }}>
                                {(userProfile?.name || 'U')[0].toUpperCase()}
                              </div>
                            )}
                          </motion.div>
                        ))}

                        {loading && (
                          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} style={{ display:'flex', alignItems:'flex-end', gap:'12px' }}>
                            <RobotAvatar expression="analyzing" size="sm" glowColor={accent} isTyping={true} />
                            <TypingDots color={accent}/>
                          </motion.div>
                        )}
                        <div ref={bottomRef}/>
                      </div>
                    </div>

                    {/* Text Input Panel */}
                    <div style={{ padding:'16px 20px 24px', background:'transparent', flexShrink:0, position:'relative', zIndex:5 }}>
                      <div style={{ maxWidth:'760px', width:'100%', margin:'0 auto' }}>
                        <div style={{ 
                          display:'flex', 
                          alignItems:'flex-end', 
                          gap:'9px', 
                          background:'rgba(255,255,255,0.015)', 
                          border:`1px solid ${input.trim() ? accent : listening ? accent : 'var(--border-subtle)'}`, 
                          borderRadius:'24px', 
                          padding:'9px 12px', 
                          transition:'all 0.3s', 
                          backdropFilter: 'blur(20px)',
                          boxShadow: input.trim() 
                            ? `0 0 20px -4px ${accent}45` 
                            : listening 
                              ? `0 0 20px -4px ${accent}45` 
                              : '0 8px 32px rgba(0,0,0,0.2)' 
                        }}>
                          <motion.button whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }} onClick={handleMicClick}
                            animate={isRecording ? { scale:[1,1.1,1] } : {}} transition={isRecording ? { duration:0.8, repeat:Infinity } : {}}
                            style={{ width:'36px', height:'36px', borderRadius:'50%', background:isRecording?'#ef4444':'rgba(255,255,255,0.03)', border:`1px solid ${isRecording?'#ef4444':'var(--border-subtle)'}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.3s', boxShadow:isRecording?'0 0 15px rgba(239,68,68,0.5)':'' }}>
                            {isRecording ? <FaStop size={11} color="#fff"/> : <FaMicrophone size={12} color="rgba(255,255,255,0.4)"/>}
                          </motion.button>
                          
                          <textarea ref={textareaRef} value={input}
                            onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight,110) + 'px'; }}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                            placeholder={isRecording ? `🔴 Recording... ${recordDuration}s (click mic to send)` : `Message ${activeAI==='AURA'?'Aura':'Max'}...`}
                            rows={1}
                            style={{ flex:1, background:'none', border:'none', color:'rgba(255,255,255,0.88)', fontSize:'0.9rem', fontFamily:J, resize:'none', lineHeight:'1.5', maxHeight:'110px', minHeight:'22px', padding:'7px 0', overflowY:'auto' }}/>
                          
                          {/* Recording status waveform overlay */}
                          {isRecording && (
                            <div style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                              <VisualWaveform accent="#ef4444" active={true} />
                            </div>
                          )}

                          <motion.button whileHover={input.trim()?{scale:1.06}:{}} whileTap={input.trim()?{scale:0.94}:{}} onClick={() => sendMsg()}
                            style={{ width:'36px', height:'36px', borderRadius:'50%', background:input.trim()?accent:'rgba(255,255,255,0.03)', border:`1px solid ${input.trim()?accent:'var(--border-subtle)'}`, cursor:input.trim()?'pointer':'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.3s', boxShadow:input.trim()?`0 4px 12px ${accent}40`:'' }}>
                            <FaPaperPlane size={13} color={input.trim()?'#fff':'rgba(255,255,255,0.22)'} style={{ marginLeft:'1px' }}/>
                          </motion.button>
                        </div>
                        <p style={{ textAlign:'center', fontSize:'0.61rem', color:'rgba(255,255,255,0.14)', fontFamily:S, letterSpacing:'0.5px', margin:'7px 0 0' }}>
                          {activeAI==='AURA'?'Aura · Emotional Support AI':'Max · Cognitive Analysis AI'} — Not a substitute for professional therapy
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Holographic AI Diagnostic Dock */}
                  <div className="glass-panel" style={{
                    width: '320px',
                    borderLeft: '1px solid var(--border-subtle)',
                    borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                    display: 'flex', flexDirection: 'column',
                    padding: '24px 20px',
                    overflowY: 'auto',
                    background: 'rgba(8,10,16,0.4)',
                    backdropFilter: 'blur(30px)',
                    zIndex: 5,
                    gap: '20px'
                  }}>
                    {/* Orb Portal / Scanner Container */}
                    <div className="scanner-container" style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '20px',
                      background: 'rgba(255,255,255,0.01)',
                      border: `1px solid ${accent}25`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      boxShadow: `0 8px 32px -10px ${accent}15, inset 0 0 20px ${accent}0b`
                    }}>
                      {/* Grid background */}
                      <div className="neural-grid" style={{ position: 'absolute', inset: 0, opacity: 0.3, borderRadius: '20px' }} />

                      {/* Scanner sweep line */}
                      <div className="scanner-line" style={{ '--scanner-color': accent }} />

                      {/* Avatar */}
                      <RobotAvatar
                        expression={loading ? 'analyzing' : isAiSpeaking ? 'happy' : isRecording ? 'sleep' : 'smile'}
                        size="md"
                        glowColor={accent}
                        isTyping={loading}
                      />
                    </div>

                    {/* AI Info & Sync */}
                    <div style={{ textAlign: 'center' }}>
                      <h3 style={{ margin: '0 0 4px', fontSize: '0.95rem', color: '#fff', fontFamily: S, letterSpacing: '0.5px', fontWeight: '700' }}>
                        {activeAI === 'AURA' ? 'AURA // EMOTIVE CORE' : 'MAX // COGNITIVE NEXUS'}
                      </h3>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 8px', borderRadius: '12px', background: loading ? `${accent}15` : 'rgba(16,185,129,0.08)', border: `1px solid ${loading ? `${accent}30` : 'rgba(16,185,129,0.2)'}` }}>
                        <motion.div
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          style={{ width: '6px', height: '6px', borderRadius: '50%', background: loading ? accent : '#10b981' }}
                        />
                        <span style={{ fontSize: '0.62rem', fontWeight: '800', color: loading ? accent : '#10b981', letterSpacing: '0.5px' }}>
                          {loading ? 'PROCESSING' : 'ONLINE'}
                        </span>
                      </div>
                    </div>

                    {/* Audio / Waveform monitor */}
                    <div style={{ padding: '14px', borderRadius: '16px', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <p style={{ margin: '0 0 10px', fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', fontWeight: '700', letterSpacing: '0.5px', fontFamily: S }}>VOCAL SYNC FREQUENCY</p>
                      <div style={{ display: 'flex', justifyContent: 'center', height: '32px', alignItems: 'center' }}>
                        <VisualWaveform accent={accent} active={isAiSpeaking || isRecording || loading} />
                      </div>
                    </div>

                    {/* Vocal playback configuration */}
                    <div style={{ padding: '14px', borderRadius: '16px', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.04)', display:'flex', flexDirection:'column', gap:'10px' }}>
                      <div>
                        <p style={{ margin: '0 0 6px', fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', fontWeight: '700', letterSpacing: '0.5px', fontFamily: S }}>SPEECH SYNTHESIS RATE</p>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {[0.75, 1.0, 1.25, 1.5].map(rate => (
                            <button
                              key={rate}
                              onClick={() => setSpeechRate(rate)}
                              style={{
                                flex: 1, padding: '6px 0', borderRadius: '8px',
                                border: `1px solid ${speechRate === rate ? accent : 'rgba(255,255,255,0.06)'}`,
                                background: speechRate === rate ? `${accent}15` : 'rgba(255,255,255,0.02)',
                                color: speechRate === rate ? '#fff' : 'rgba(255,255,255,0.4)',
                                fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.25s'
                              }}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Diagnostic log terminal */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <p style={{ margin: '0 0 6px', fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', fontWeight: '700', letterSpacing: '0.5px', fontFamily: S }}>DIAGNOSTIC STATUS LOG</p>
                      <div style={{
                        flex: 1, minHeight: '120px', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.03)',
                        borderRadius: '12px', padding: '12px 10px', fontFamily: S, fontSize: '0.64rem', color: 'rgba(255,255,255,0.35)',
                        lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '4px'
                      }}>
                        <div style={{ color: accent }}>&gt; Initializing {activeAI} Link...</div>
                        <div>&gt; Empathic resonance: OK</div>
                        <div>&gt; Voice modulation rate: {speechRate}x</div>
                        {listening && <div style={{ color: '#10b981' }}>&gt; WebSpeech listening...</div>}
                        {isRecording && <div style={{ color: '#ef4444' }}>&gt; MediaRecorder stream active...</div>}
                        {isAiSpeaking && <div style={{ color: accent }}>&gt; Synthesizer feeding speaker...</div>}
                        <div style={{ marginTop: 'auto', color: 'rgba(255,255,255,0.15)' }}>SYSTEM SYNC: ACTIVE</div>
                      </div>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {/* ══ BRAIN REPORT ════════════════════════════════════════ */}
            {tab === 'report' && (
              <motion.div key="report" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}
                style={{ position:'absolute', inset:0 }}>
                <BrainReport
                  messages={messages}
                  userProfile={userProfile}
                  activeAI={activeAI}
                  onHighStress={() => setShowSOS(true)}
                />
              </motion.div>
            )}

            {/* ══ CONSULTANTS ═════════════════════════════════════════ */}
            {tab === 'consult' && (
              <motion.div key="consult" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.35 }}
                style={{ position:'absolute', inset:0, overflowY:'auto', padding:'22px 20px 32px' }}>

                {activeProfile ? (
                  <ConsultantProfile
                    consultant={activeProfile}
                    onBack={() => setActiveProfile(null)}
                    accent={accent}
                  />
                ) : (
                  <>
                    {/* Header */}
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
                      <div>
                        <h2 style={{ fontFamily:J, fontWeight:800, fontSize:'1.7rem', letterSpacing:'-0.5px', color:'#fff', margin:'0 0 4px' }}>Our Experts</h2>
                        <p style={{ color:'rgba(255,255,255,0.32)', fontSize:'0.86rem', margin:0, fontFamily:J }}>First session free · ₹199/session thereafter</p>
                      </div>
                      <div style={{ display:'flex', gap:10 }}>
                        <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                          onClick={() => { setShowApps(true); fetchApplications(); }}
                          style={{ padding:'9px 16px', borderRadius:12, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'rgba(255,255,255,0.55)', fontSize:'0.78rem', fontWeight:700, cursor:'pointer', fontFamily:J }}>
                          ⚙️ Applications
                        </motion.button>
                        <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={() => setShowJoin(true)}
                          style={{ padding:'9px 16px', borderRadius:12, border:`1px solid ${accentBr}`, background:accentB, color:accent, fontSize:'0.78rem', fontWeight:700, cursor:'pointer', fontFamily:J }}>
                          + Join as Consultant
                        </motion.button>
                      </div>
                    </div>

                    {/* Empty state */}
                    {consultants.length === 0 && (
                      <div style={{ textAlign:'center', padding:'60px 20px', color:'rgba(255,255,255,0.25)', fontSize:'0.88rem', fontFamily:J }}>
                        <div style={{ fontSize:'2.5rem', marginBottom:12 }}>🔍</div>
                        No consultants yet. Be the first to join!
                      </div>
                    )}

                    {/* Consultant cards */}
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
                      {consultants.map((c,i) => (
                        <motion.div key={c.id||i} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05+i*0.07 }}
                          whileHover={{ y:-4, borderColor:'rgba(255,255,255,0.11)', boxShadow:'var(--shadow-premium)' }}
                          style={{ background:'var(--bg-card)', border:`1px solid var(--border-subtle)`, borderRadius:22, padding:22, transition:'all 0.3s', position:'relative', overflow:'hidden', boxShadow:`var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.03)` }}>
                          <div style={{ position:'absolute', top:'-20px', right:'-20px', width:100, height:100, borderRadius:'50%', background:`radial-gradient(circle,${c.color}0a,transparent 70%)`, pointerEvents:'none' }}/>
                          {/* Remove button (admin) */}
                          <motion.button whileHover={{ scale:1.12 }} whileTap={{ scale:0.9 }} onClick={(e)=>{ e.stopPropagation(); removeConsultant(c); }}
                            title="Remove consultant"
                            style={{ position:'absolute', top:14, left:14, width:26, height:26, borderRadius:8, background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.2)', color:'#f43f5e', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:800, zIndex:5 }}>
                            ✕
                          </motion.button>
                          {/* Availability badge */}
                          <div style={{ position:'absolute', top:16, right:16, display:'flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:20, background:c.avail?'rgba(16,185,129,0.08)':'rgba(255,255,255,0.04)', border:`1px solid ${c.avail?'rgba(16,185,129,0.15)':'rgba(255,255,255,0.06)'}` }}>
                            <div style={{ width:5, height:5, borderRadius:'50%', background:c.avail?'#10b981':'rgba(255,255,255,0.2)' }}/>
                            <span style={{ fontSize:'0.65rem', fontWeight:700, color:c.avail?'#10b981':'rgba(255,255,255,0.3)', fontFamily:S }}>{c.avail?'Online':'Busy'}</span>
                          </div>
                          {/* Info */}
                          <div style={{ display:'flex', gap:14, marginBottom:14, alignItems:'flex-start' }}>
                            <div style={{ width:52, height:52, borderRadius:'50%', background:`linear-gradient(135deg,${c.color}35,${c.color}15)`, border:`2px solid ${c.color}35`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontWeight:800, fontSize:'1.1rem', color:c.color, boxShadow:'var(--shadow-premium)' }}>
                              {(c.name||'?').split(' ').map(w=>w[0]).join('').slice(0,2)}
                            </div>
                            <div>
                              <p style={{ margin:'0 0 2px', fontSize:'0.95rem', fontWeight:700, color:'#fff' }}>{c.name}</p>
                              <p style={{ margin:'0 0 4px', fontSize:'0.76rem', color:'rgba(255,255,255,0.38)' }}>{c.spec}</p>
                              <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                                <span style={{ fontSize:'0.72rem', color:'#f59e0b', fontWeight:700 }}>★ {c.rating}</span>
                                <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.25)' }}>{c.sessions} sessions</span>
                                <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.25)' }}>{c.exp}</span>
                              </div>
                            </div>
                          </div>
                          {/* Free / paid badge */}
                          {!usedFree[c.id] && (
                            <div style={{ marginBottom:10, padding:'4px 10px', borderRadius:20, background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.15)', display:'inline-flex', alignItems:'center', gap:5 }}>
                              <span style={{ fontSize:'0.68rem', color:'#10b981', fontWeight:700 }}>🎁 First session free</span>
                            </div>
                          )}
                          {usedFree[c.id] && (
                            <div style={{ marginBottom:10, padding:'4px 10px', borderRadius:20, background:accentB, border:`1px solid ${accentBr}`, display:'inline-flex', alignItems:'center', gap:5 }}>
                              <span style={{ fontSize:'0.68rem', color:accent, fontWeight:700 }}>₹{c.price||199} / session</span>
                            </div>
                          )}
                          
                          {/* Actions row */}
                          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} onClick={() => setActiveProfile(c)}
                              style={{ flex: 1, padding:'11px', background:'rgba(255,255,255,0.04)', border:'1px solid var(--border-subtle)', borderRadius:12, color:'rgba(255,255,255,0.75)', fontSize:'0.8rem', fontWeight:700, cursor:'pointer', fontFamily:J }}>
                              View Profile
                            </motion.button>
                            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} onClick={() => c.avail && handleBookConsultant(c)}
                              style={{ flex: 1.2, padding:'11px', background:c.avail?`linear-gradient(135deg,${c.color},${c.color}cc)`:'rgba(255,255,255,0.03)', border:`1px solid ${c.avail?c.color:'rgba(255,255,255,0.06)'}`, borderRadius:12, color:c.avail?'#fff':'rgba(255,255,255,0.22)', fontSize:'0.8rem', fontWeight:700, cursor:c.avail?'pointer':'not-allowed', fontFamily:J, transition:'all 0.2s', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                              {!c.avail ? 'Busy' : usedFree[c.id] ? `Pay ₹${c.price||199}` : 'Book Free'}
                            </motion.button>
                          </div>

                          {/* In-app call buttons */}
                          {c.avail && (
                            <div style={{ display:'flex', gap:8 }}>
                              <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                                onClick={() => setCall({ consultant:c, audioOnly:false })}
                                style={{ flex:1, padding:'10px', background:'rgba(255,255,255,0.04)', border:`1px solid ${c.color}44`, borderRadius:12, color:c.color, fontSize:'0.78rem', fontWeight:700, cursor:'pointer', fontFamily:J, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                                <FaVideo size={12}/> Video
                              </motion.button>
                              <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                                onClick={() => setCall({ consultant:c, audioOnly:true })}
                                style={{ flex:1, padding:'10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, color:'rgba(255,255,255,0.7)', fontSize:'0.78rem', fontWeight:700, cursor:'pointer', fontFamily:J, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                                <FaPhone size={11}/> Voice
                              </motion.button>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}

              </motion.div>
            )}

            {/* ══ PROGRESS ════════════════════════════════════════════ */}
            {tab === 'progress' && (
              <ProgressDashboard accent={accent} accentB={accentB} accentBr={accentBr}/>
            )}


            {/* ══ CALM STUDIO ════════════════════════════════════════ */}
            {tab === 'calm' && (
              <motion.div key="calm" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.35 }}
                style={{ position:'absolute', inset:0 }}>
                <CalmLibrary accent={accent} accentB={accentB} accentBr={accentBr} isPremium={isPremium} onUpgrade={() => setShowUpgrade(true)}/>
              </motion.div>
            )}

            {/* ══ CALM REELS ═════════════════════════════════════════ */}
            {tab === 'calm-reels' && (
              <motion.div key="calm-reels" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.35 }}
                style={{ position:'absolute', inset:0 }}>
                <CalmReelsScreen accent={accent} accentB={accentB} accentBr={accentBr} userProfile={userProfile} myProfileData={myProfileData} />
              </motion.div>
            )}

            {/* ══ MY SOCIAL PROFILE ══════════════════════════════════ */}
            {tab === 'my-profile' && (
              <motion.div key="my-profile" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.35 }}
                style={{ position:'absolute', inset:0, overflowY:'auto', padding:'22px 20px 32px' }}>
                {myProfileData ? (
                  <ConsultantProfile 
                    consultant={{
                      id: `my-user-profile-${userProfile?.email || 'default'}`,
                      name: myProfileData.name,
                      spec: myProfileData.bio || 'Sharing my mindfulness journey.',
                      color: myProfileData.color || '#ec4899',
                      isUser: true,
                      pfp: myProfileData.pfp,
                      gender: myProfileData.gender,
                      preferences: myProfileData.preferences
                    }}
                    accent={accent}
                    onBack={() => setTab('home')}
                    onUpdateProfile={(updatedProfile) => {
                      setMyProfileData(updatedProfile);
                      try {
                        const email = userProfile?.email || 'default';
                        localStorage.setItem(`equilibrium_my_profile_${email}`, JSON.stringify(updatedProfile));
                      } catch {}
                    }}
                  />
                ) : (
                  <ProfileCreationScreen 
                    userProfile={userProfile} 
                    accent={accent}
                    onSave={(profile) => {
                      setMyProfileData(profile);
                      try {
                        const email = userProfile?.email || 'default';
                        localStorage.setItem(`equilibrium_my_profile_${email}`, JSON.stringify(profile));
                      } catch {}
                    }}
                  />
                )}
              </motion.div>
            )}

            {/* ══ JOURNAL ════════════════════════════════════════════ */}
            {tab === 'journal' && (
              <motion.div key="journal" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.35 }}
                style={{ position:'absolute', inset:0, overflowY:'auto', padding:'22px 20px 32px' }}>
                <div style={{ marginBottom:20 }}>
                  <h2 style={{ fontFamily:J, fontWeight:800, fontSize:'1.7rem', letterSpacing:'-0.5px', color:'#fff', margin:'0 0 4px' }}>My Journal</h2>
                  <p style={{ color:'rgba(255,255,255,0.32)', fontSize:'0.86rem', margin:0, fontFamily:J }}>Write your thoughts freely — AI gives you weekly insights</p>
                </div>
                <div style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)', borderRadius:20, padding:20, marginBottom:14, boxShadow:'var(--shadow-card), inset 0 1px 0 rgba(255,255,255,0.03)' }}>
                  <textarea value={journalInput} onChange={e => setJournalInput(e.target.value)}
                    placeholder="What's on your mind today? How are you feeling? Write freely..."
                    style={{ width:'100%', minHeight:120, background:'none', border:'none', outline:'none', color:'rgba(255,255,255,0.85)', fontSize:'0.9rem', fontFamily:J, lineHeight:1.7, resize:'vertical' }}/>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12 }}>
                    <span style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.25)', fontFamily:S }}>{journalInput.length} chars</span>
                    <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} onClick={saveJournal} disabled={!journalInput.trim()}
                      style={{ padding:'9px 20px', borderRadius:12, border:'none', cursor:journalInput.trim()?'pointer':'not-allowed', background:journalInput.trim()?`linear-gradient(135deg,${accent},#8b5cf6)`:'rgba(255,255,255,0.05)', color:'#fff', fontSize:'0.82rem', fontWeight:700, fontFamily:J, display:'flex', alignItems:'center', gap:6, opacity:journalInput.trim()?1:0.4 }}>
                      💾 Save Entry
                    </motion.button>
                  </div>
                </div>
                {journalEntries.length > 0 && (
                  <div style={{ marginBottom:16 }}>
                    <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={getJournalInsight} disabled={journalLoading}
                      style={{ width:'100%', padding:'13px', borderRadius:16, border:`1px solid ${accentBr}`, background:accentB, color:accent, fontSize:'0.86rem', fontWeight:700, cursor:'pointer', fontFamily:J, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                      {journalLoading ? '⏳ Analyzing...' : `✨ Get AI Insight (${Math.min(journalEntries.length,10)} entries)`}
                    </motion.button>
                    {journalInsight && (
                      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                        style={{ marginTop:12, padding:'16px 18px', borderRadius:16, background:accentB, border:`1px solid ${accentBr}` }}>
                        <p style={{ margin:'0 0 6px', fontSize:'0.68rem', color:accent, fontWeight:700, fontFamily:S, letterSpacing:'1px' }}>AI INSIGHT</p>
                        <p style={{ margin:0, fontSize:'0.85rem', color:'rgba(255,255,255,0.8)', lineHeight:1.7, fontFamily:J, whiteSpace:'pre-wrap' }}>{journalInsight}</p>
                      </motion.div>
                    )}
                  </div>
                )}
                {journalEntries.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'40px 20px', color:'rgba(255,255,255,0.25)', fontSize:'0.85rem', fontFamily:J }}>No entries yet. Write your first journal entry above 📝</div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    <p style={{ margin:'0 0 8px', fontSize:'0.68rem', color:'rgba(255,255,255,0.25)', fontFamily:S, letterSpacing:'1.5px', fontWeight:600 }}>PAST ENTRIES ({journalEntries.length})</p>
                    {journalEntries.map((entry, i) => (
                      <motion.div key={entry.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.04 }}
                        whileHover={{ y:-2, transition:{ duration:0.2 } }}
                        style={{ background:'var(--bg-card)', border:'1px solid var(--border-subtle)', borderRadius:16, padding:'14px 16px', boxShadow:'var(--shadow-premium), inset 0 1px 0 rgba(255,255,255,0.03)' }}>
                        <p style={{ margin:'0 0 6px', fontSize:'0.68rem', color:'rgba(255,255,255,0.28)', fontFamily:S }}>
                          {new Date(entry.date).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})} · {new Date(entry.date).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}
                        </p>
                        <p style={{ margin:0, fontSize:'0.84rem', color:'rgba(255,255,255,0.65)', lineHeight:1.65, fontFamily:J }}>
                          {entry.text.length > 200 ? entry.text.slice(0,200)+'...' : entry.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── JOIN MODAL ── */}
      <AnimatePresence>
        {showJoin && <JoinConsultantModal onClose={() => setShowJoin(false)} accent={accent}/>}
      </AnimatePresence>

      {/* ── APPLICATIONS PANEL MODAL ── */}
      <AnimatePresence>
        {showApps && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setShowApps(false)}
            style={{ position:'fixed', inset:0, background:'rgba(9,10,15,0.82)', backdropFilter:'blur(10px)', zIndex:150, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'20px', overflowY:'auto' }}>
            <motion.div initial={{ scale:0.94, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.94, y:20 }}
              onClick={e => e.stopPropagation()}
              style={{ width:'100%', maxWidth:560, background:'var(--bg-card)', border:'1px solid var(--border-subtle)', borderRadius:28, padding:28, marginTop:20, boxShadow:'var(--shadow-card)' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <div>
                  <h3 style={{ fontFamily:G, fontStyle:'italic', fontWeight:600, fontSize:'1.4rem', color:'#fff', margin:'0 0 3px' }}>Pending Applications</h3>
                  <p style={{ margin:0, fontSize:'0.78rem', color:'rgba(255,255,255,0.3)', fontFamily:J }}>Approve to add consultant to live list</p>
                </div>
                <button onClick={() => setShowApps(false)}
                  style={{ width:32, height:32, borderRadius:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>✕</button>
              </div>
              <ApplicationsPanel applications={applications} accent={accent}
                onRefresh={() => {
                  fetchApplications();
                  fetch(`${API_BASE}/api/consultants`).then(r=>r.json()).then(setConsultants).catch(()=>{});
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FREE SESSION TOAST ── */}
      <AnimatePresence>
        {freeConsultant && <FreeSessionToast consultant={freeConsultant} onClose={() => setFreeConsultant(null)}/>}
      </AnimatePresence>

      {/* ── PAYMENT MODAL ── */}
      <AnimatePresence>
        {payConsultant && (
          <PaymentModal consultant={payConsultant} onClose={() => setPayConsultant(null)}
            onSuccess={() => { setPayConsultant(null); }}
          />
        )}
      </AnimatePresence>

      {/* ── IN-APP VIDEO / VOICE CALL ── */}
      <AnimatePresence>
        {call && (
          <VideoCall
            roomName={`${call.consultant.id}-${userProfile?.email||'guest'}`}
            displayName={userProfile?.name || 'User'}
            audioOnly={call.audioOnly}
            accent={accent}
            onEnd={() => setCall(null)}
          />
        )}
      </AnimatePresence>

      {/* ── PREMIUM UPGRADE MODAL ── */}
      <AnimatePresence>
        {showUpgrade && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setShowUpgrade(false)}
            style={{ position:'fixed', inset:0, background:'rgba(4,3,10,0.8)', backdropFilter:'blur(8px)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
            <motion.div initial={{ scale:0.94, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.94, y:20 }} onClick={e => e.stopPropagation()}
              style={{ width:'100%', maxWidth:420, background:'#141417', border:'1px solid rgba(199,149,82,0.25)', borderRadius:24, padding:30, position:'relative', boxShadow:'0 24px 60px rgba(0,0,0,0.55)' }}>
              <button onClick={() => setShowUpgrade(false)} style={{ position:'absolute', top:16, right:16, width:30, height:30, borderRadius:9, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontWeight:700 }}>✕</button>

              <div style={{ textAlign:'center', marginBottom:22 }}>
                <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(199,149,82,0.12)', border:'1px solid rgba(199,149,82,0.3)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
                  <FaCrown size={22} color="#c79552"/>
                </div>
                <h3 style={{ fontFamily:G, fontStyle:'italic', fontWeight:600, fontSize:'1.6rem', color:'#fff', margin:'0 0 6px' }}>Go Premium</h3>
                <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.85rem', margin:0, fontFamily:J }}>Unlock everything PsychoLink offers</p>
              </div>

              {/* Benefits */}
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:22 }}>
                {[
                  'Unlimited meditation & breathwork tracks',
                  'Unlimited AI chat with Aura & Max',
                  'Advanced brain reports & analytics',
                  'Priority consultant booking',
                ].map((b,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:20, height:20, borderRadius:'50%', background:'rgba(86,160,111,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ color:'#56a06f', fontSize:'0.7rem', fontWeight:800 }}>✓</span>
                    </div>
                    <span style={{ fontSize:'0.84rem', color:'rgba(255,255,255,0.75)', fontFamily:J }}>{b}</span>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div style={{ textAlign:'center', marginBottom:18, padding:'16px', borderRadius:16, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:6 }}>
                  <span style={{ fontSize:'2rem', fontWeight:800, color:'#fff', fontFamily:S }}>₹199</span>
                  <span style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.4)', fontFamily:J }}>/month</span>
                </div>
                <p style={{ margin:'4px 0 0', fontSize:'0.72rem', color:'rgba(255,255,255,0.3)', fontFamily:J }}>Cancel anytime · 7-day money back</p>
              </div>

              <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                onClick={handleUpgradePayment}
                style={{ width:'100%', padding:'14px', borderRadius:14, border:'none', cursor:'pointer', background:'linear-gradient(135deg,#c79552,#b8843f)', color:'#0a0a0c', fontSize:'0.95rem', fontWeight:800, fontFamily:J, marginBottom:8 }}>
                Subscribe Now →
              </motion.button>
              <p style={{ textAlign:'center', margin:0, fontSize:'0.68rem', color:'rgba(255,255,255,0.25)', fontFamily:J }}>
                Secure payment via Razorpay
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CONDITIONAL SOS BAR (shown when report detects high stress) ── */}
      <AnimatePresence>
        {showSOS && (
          <motion.div initial={{ y:-80, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:-80, opacity:0 }}
            style={{ position:'fixed', top:16, left:'50%', transform:'translateX(-50%)', zIndex:200, display:'flex', alignItems:'center', gap:12, padding:'12px 20px', borderRadius:30, background:'linear-gradient(135deg,rgba(239,68,68,0.95),rgba(185,28,28,0.95))', boxShadow:'0 8px 24px rgba(239,68,68,0.25)', backdropFilter:'blur(10px)', border:'1px solid rgba(239,68,68,0.3)' }}>
            <motion.span animate={{ opacity:[1,0.5,1] }} transition={{ duration:1.2, repeat:Infinity }} style={{ fontSize:'1.1rem' }}>🆘</motion.span>
            <span style={{ color:'#fff', fontSize:'0.85rem', fontWeight:700, fontFamily:J }}>High stress detected — You're not alone</span>
            <motion.button whileHover={{ scale:1.05 }} onClick={() => { setShowSOS(false); setShowBreath(true); }}
              style={{ padding:'6px 14px', borderRadius:20, border:'1px solid rgba(255,255,255,0.4)', background:'rgba(255,255,255,0.15)', color:'#fff', fontSize:'0.78rem', fontWeight:700, cursor:'pointer', fontFamily:J }}>
              Breathe
            </motion.button>
            <motion.button whileHover={{ scale:1.05 }} onClick={() => { setShowSOS(false); setActiveAI('AURA'); setTab('chat'); }}
              style={{ padding:'6px 14px', borderRadius:20, border:'1px solid rgba(255,255,255,0.4)', background:'rgba(255,255,255,0.15)', color:'#fff', fontSize:'0.78rem', fontWeight:700, cursor:'pointer', fontFamily:J }}>
              Talk to Aura
            </motion.button>
            <button onClick={() => setShowSOS(false)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.6)', cursor:'pointer', fontSize:'1rem', padding:'0 4px' }}>✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BREATHING MODAL ── */}
      <AnimatePresence>{showBreath && <BreathingModal onClose={() => setShowBreath(false)}/>}</AnimatePresence>

      {/* ── SESSION SUMMARY ── */}
      <AnimatePresence>
        {summaryOpen && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setSummaryOpen(false)}
            style={{ position:'fixed', inset:0, background:'rgba(9,10,15,0.82)', backdropFilter:'blur(10px)', zIndex:150, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
            <motion.div initial={{ scale:0.92, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.92, y:20 }} onClick={e => e.stopPropagation()}
              style={{ width:'100%', maxWidth:460, background:'var(--bg-card)', border:'1px solid var(--border-subtle)', borderRadius:28, padding:28, maxHeight:'80vh', overflowY:'auto', boxShadow:'var(--shadow-card)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                <div style={{ width:36, height:36, borderRadius:12, background:'var(--bg-input)', border:'1px solid var(--border-subtle)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>📋</div>
                <h3 style={{ fontFamily:G, fontStyle:'italic', fontWeight:600, fontSize:'1.3rem', color:'#fff', margin:0 }}>Session Summary</h3>
              </div>
              {summaryLoading ? (
                <div style={{ display:'flex', alignItems:'center', gap:12, padding:'20px 0' }}>
                  <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }} style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${accent}30`, borderTopColor:accent }}/>
                  <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.85rem', fontFamily:J }}>Generating summary...</span>
                </div>
              ) : (
                <p style={{ color:'var(--text-secondary)', fontSize:'0.86rem', lineHeight:1.8, fontFamily:J, whiteSpace:'pre-wrap', margin:0 }}>{sessionSummary}</p>
              )}
              <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }} onClick={() => setSummaryOpen(false)}
                style={{ marginTop:20, width:'100%', padding:'11px', borderRadius:14, border:'1px solid var(--border-subtle)', background:'var(--bg-input)', color:'rgba(255,255,255,0.6)', fontSize:'0.86rem', fontWeight:700, cursor:'pointer', fontFamily:J }}>
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



    </div>
  );
}