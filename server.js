import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import Razorpay from 'razorpay';
import crypto from 'crypto';

import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const API_KEY = process.env.NVIDIA_API_KEY;
const MODEL = 'meta/llama-3.1-8b-instruct';

// ─────────────────────────────────────────────────────────
// CONSULTANT SYSTEM — simple JSON-file storage (no DB needed)
// ─────────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const DATA_DIR             = path.join(__dirname, 'data');
const CONSULTANTS_FILE     = path.join(DATA_DIR, 'consultants.json');
const APPLICATIONS_FILE    = path.join(DATA_DIR, 'applications.json');

const SEED_CONSULTANTS = [
  { id: 1, name:'Dr. Priya Sharma', spec:'Anxiety & CBT',            rating:4.9, sessions:240, color:'#ec4899', avail:true,  exp:'8 yrs',  price:199 },
  { id: 2, name:'Dr. Arjun Mehta',  spec:'Depression & Mindfulness', rating:4.8, sessions:180, color:'#8b5cf6', avail:true,  exp:'6 yrs',  price:199 },
  { id: 3, name:'Dr. Sara Ali',     spec:'Trauma & PTSD',            rating:4.9, sessions:320, color:'#2dd4bf', avail:false, exp:'12 yrs', price:249 },
  { id: 4, name:'Dr. Ravi Nair',    spec:'Stress & Burnout',         rating:4.7, sessions:150, color:'#f59e0b', avail:true,  exp:'5 yrs',  price:199 },
  { id: 5, name:'Rajat Kamal',      spec:'Founder · Peer Support',   rating:5.0, sessions:60,  color:'#5eb8ad', avail:true,  exp:'2 yrs',  price:199 },
];

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  // Always reset consultants to the fixed list (clears any extra/test names)
  fs.writeFileSync(CONSULTANTS_FILE, JSON.stringify(SEED_CONSULTANTS, null, 2));
  if (!fs.existsSync(APPLICATIONS_FILE)) fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify([], null, 2));
}
ensureDataFiles();

// ─────────────────────────────────────────────────────────
// EMAIL — Resend.com (simple API key, no Gmail setup needed)
// .env: RESEND_API_KEY=re_xxxx  FOUNDER_EMAIL=you@gmail.com
// ─────────────────────────────────────────────────────────
async function sendMail({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    console.log('📧 Email skipped (RESEND_API_KEY not set in .env)');
    return;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PsychoLink <onboarding@resend.dev>',
        to,
        subject,
        html,
      }),
    });
    const data = await res.json();
    if (res.ok) { console.log(`📧 Email sent → ${to}`); }
    else { console.error('Resend error:', data); }
  } catch (e) { console.error('Email error:', e.message); }
}

function readJSON(file)  { return JSON.parse(fs.readFileSync(file, 'utf-8')); }
function writeJSON(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2)); }

const CONSULTANT_COLORS = ['#ec4899','#8b5cf6','#2dd4bf','#f59e0b','#3b82f6','#10b981','#f43f5e','#a78bfa'];

// ── GET /api/consultants — public list of APPROVED consultants ──
app.get('/api/consultants', (req, res) => {
  res.json(readJSON(CONSULTANTS_FILE));
});

// ── DELETE /api/consultants/:id — remove a consultant from the platform ──
app.delete('/api/consultants/:id', (req, res) => {
  const id = Number(req.params.id);
  const consultants = readJSON(CONSULTANTS_FILE);
  const filtered = consultants.filter(c => c.id !== id);
  if (filtered.length === consultants.length) {
    return res.status(404).json({ error: 'Consultant not found' });
  }
  writeJSON(CONSULTANTS_FILE, filtered);
  console.log('🗑️  Consultant removed:', id);
  res.json({ success: true, removed: id });
});

// ── POST /api/consultants/apply — "Join as Consultant" form submit ──
app.post('/api/consultants/apply', async (req, res) => {
  const { fullName, email, skills, therapyApproach, qualifications, multilingualAggressive } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({ error: 'fullName and email are required' });
  }

  const applications = readJSON(APPLICATIONS_FILE);
  const application = {
    id: Date.now(),
    fullName,
    email,
    skills:         skills || '',
    therapyApproach: therapyApproach || '',
    qualifications: qualifications || '',
    multilingualAggressive: multilingualAggressive || '',
    submittedAt: new Date().toISOString(),
    status: 'pending',
  };
  applications.push(application);
  writeJSON(APPLICATIONS_FILE, applications);

  // ── Email to founder (you) ──────────────────────────────
  await sendMail({
    to: process.env.FOUNDER_EMAIL || process.env.GMAIL_USER,
    subject: `🆕 New Consultant Application — ${fullName}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8f5ff;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#7c3aed,#be185d);padding:32px 28px;">
          <h1 style="color:#fff;margin:0;font-size:1.5rem;">🧠 PsychoLink</h1>
          <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:0.9rem;">Founder Notification</p>
        </div>
        <div style="padding:28px;">
          <h2 style="color:#1a1a2e;margin:0 0 20px;">New Consultant Application 🎉</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:0.85rem;width:40%;">Full Name</td><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-weight:700;color:#1a1a2e;">${fullName}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:0.85rem;">Email</td><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#7c3aed;">${email}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:0.85rem;">Skills</td><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#1a1a2e;">${skills||'—'}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:0.85rem;">Therapy Approach</td><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#1a1a2e;">${therapyApproach||'—'}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:0.85rem;">Qualifications</td><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;color:#1a1a2e;">${qualifications||'—'}</td></tr>
            <tr><td style="padding:10px 0;color:#6b7280;font-size:0.85rem;">Multilingual/Aggressive</td><td style="padding:10px 0;color:#1a1a2e;">${multilingualAggressive||'—'}</td></tr>
          </table>
          <div style="margin-top:28px;display:flex;gap:14px;justify-content:center;">
            <a href="http://localhost:3001/api/admin/applications/${application.id}/interview"
              style="padding:16px 32px;background:linear-gradient(135deg,#7c3aed,#be185d);color:#fff;text-decoration:none;border-radius:14px;font-weight:700;font-size:1rem;display:inline-block;">
              🎯 Send Interview Invite
            </a>
            <a href="http://localhost:3001/api/admin/applications/${application.id}/reject"
              style="padding:16px 24px;background:#f1f5f9;color:#64748b;text-decoration:none;border-radius:14px;font-weight:600;font-size:0.9rem;display:inline-block;border:1px solid #e2e8f0;">
              ✕ Not a Fit
            </a>
          </div>
          <p style="text-align:center;color:#9ca3af;font-size:0.75rem;margin-top:10px;">One click — no login needed</p>
        </div>
        <div style="padding:16px 28px;background:#f1f5f9;text-align:center;">
          <p style="margin:0;color:#94a3b8;font-size:0.75rem;">PsychoLink · Cognitive Social Consultation Platform</p>
        </div>
      </div>
    `,
  });
  console.log('📩 Application received:', fullName, '-', email);

  res.json({ success: true, application });
});

// ── GET /api/admin/applications — pending applications (Admin tab) ──
app.get('/api/admin/applications', (req, res) => {
  const applications = readJSON(APPLICATIONS_FILE);
  res.json(applications.filter(a => a.status === 'pending'));
});

// ── POST /api/admin/applications/:id/approve — promote to real consultant ──
app.post('/api/admin/applications/:id/approve', async (req, res) => {
  const id = Number(req.params.id);
  const applications = readJSON(APPLICATIONS_FILE);
  const idx = applications.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Application not found' });

  const application = applications[idx];
  const consultants = readJSON(CONSULTANTS_FILE);

  const newConsultant = {
    id: Date.now(),
    name: application.fullName,
    spec: application.skills || 'General Counseling',
    rating: 5.0,
    sessions: 0,
    color: CONSULTANT_COLORS[consultants.length % CONSULTANT_COLORS.length],
    avail: true,
    exp: 'New',
    price: 199,
    qualifications:  application.qualifications,
    therapyApproach: application.therapyApproach,
  };
  consultants.push(newConsultant);
  writeJSON(CONSULTANTS_FILE, consultants);

  applications[idx].status = 'approved';
  writeJSON(APPLICATIONS_FILE, applications);

  // Email to approved consultant
  await sendMail({
    to: application.email,
    subject: '🎉 Your PsychoLink Consultant Application is Approved!',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8f5ff;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#7c3aed,#be185d);padding:32px 28px;">
          <h1 style="color:#fff;margin:0;font-size:1.5rem;">🧠 PsychoLink</h1>
        </div>
        <div style="padding:28px;">
          <h2 style="color:#1a1a2e;margin:0 0 12px;">Congratulations, ${application.fullName}! 🎉</h2>
          <p style="color:#374151;line-height:1.7;">Your application to join PsychoLink as a consultant has been <b style="color:#059669;">approved</b>. You are now live on our platform and clients can book sessions with you.</p>
          <div style="margin:20px 0;padding:16px;background:#ecfdf5;border-radius:10px;border-left:4px solid #10b981;">
            <p style="margin:0;color:#065f46;font-size:0.88rem;">✅ Your profile is now visible to all PsychoLink users<br/>✅ First session with each client is free — you'll be notified of bookings<br/>✅ Subsequent sessions: ₹199/session</p>
          </div>
          <p style="color:#6b7280;font-size:0.85rem;">Welcome to the PsychoLink family. Together we make mental health accessible for everyone. 💜</p>
        </div>
        <div style="padding:16px 28px;background:#f1f5f9;text-align:center;">
          <p style="margin:0;color:#94a3b8;font-size:0.75rem;">PsychoLink · Cognitive Social Consultation Platform</p>
        </div>
      </div>
    `,
  });

  res.json({ success: true, consultant: newConsultant });
});

// ── POST /api/admin/applications/:id/reject ──
app.post('/api/admin/applications/:id/reject', async (req, res) => {
  const id = Number(req.params.id);
  const applications = readJSON(APPLICATIONS_FILE);
  const idx = applications.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Application not found' });

  applications[idx].status = 'rejected';
  writeJSON(APPLICATIONS_FILE, applications);

  // Email to rejected applicant
  await sendMail({
    to: applications[idx].email,
    subject: 'Your PsychoLink Consultant Application Update',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8f5ff;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#7c3aed,#be185d);padding:32px 28px;">
          <h1 style="color:#fff;margin:0;font-size:1.5rem;">🧠 PsychoLink</h1>
        </div>
        <div style="padding:28px;">
          <h2 style="color:#1a1a2e;margin:0 0 12px;">Application Update</h2>
          <p style="color:#374151;line-height:1.7;">Hi ${applications[idx].fullName},<br/><br/>Thank you for your interest in joining PsychoLink. After careful review, we are unable to move forward with your application at this time.</p>
          <p style="color:#374151;line-height:1.7;">We encourage you to reapply in the future with additional qualifications or experience. We appreciate your commitment to mental health support.</p>
          <p style="color:#6b7280;font-size:0.85rem;margin-top:20px;">Warm regards,<br/>PsychoLink Team</p>
        </div>
        <div style="padding:16px 28px;background:#f1f5f9;text-align:center;">
          <p style="margin:0;color:#94a3b8;font-size:0.75rem;">PsychoLink · Cognitive Social Consultation Platform</p>
        </div>
      </div>
    `,
  });

  res.json({ success: true });
});


// ─────────────────────────────────────────────────────────
// GET approve/reject — triggered from email buttons
// ─────────────────────────────────────────────────────────
app.get('/api/admin/applications/:id/approve', async (req, res) => {
  const id = Number(req.params.id);
  const applications = readJSON(APPLICATIONS_FILE);
  const idx = applications.findIndex(a => a.id === id);

  if (idx === -1) return res.send(htmlPage('❌ Not Found', 'Application not found or already processed.', '#ef4444'));
  if (applications[idx].status !== 'pending') {
    return res.send(htmlPage('Already Processed', `This application was already ${applications[idx].status}.`, '#f59e0b'));
  }

  const application = applications[idx];
  const consultants  = readJSON(CONSULTANTS_FILE);
  const newConsultant = {
    id: Date.now(), name: application.fullName,
    spec: application.skills || 'General Counseling',
    rating: 5.0, sessions: 0,
    color: CONSULTANT_COLORS[consultants.length % CONSULTANT_COLORS.length],
    avail: true, exp: 'New', price: 199,
    qualifications: application.qualifications,
    therapyApproach: application.therapyApproach,
  };
  consultants.push(newConsultant);
  writeJSON(CONSULTANTS_FILE, consultants);
  applications[idx].status = 'approved';
  writeJSON(APPLICATIONS_FILE, applications);

  await sendMail({
    to: application.email,
    subject: "🎉 PsychoLink — You're Approved as a Consultant!",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8f5ff;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#7c3aed,#be185d);padding:32px 28px;">
          <h1 style="color:#fff;margin:0;font-size:1.5rem;">🧠 PsychoLink</h1>
        </div>
        <div style="padding:28px;">
          <h2 style="color:#1a1a2e;">Congratulations, ${application.fullName}! 🎉</h2>
          <p style="color:#374151;line-height:1.7;">Your application has been <b style="color:#059669;">approved</b>. You are now live on PsychoLink and clients can book sessions with you.</p>
          <div style="padding:16px;background:#ecfdf5;border-radius:10px;border-left:4px solid #10b981;margin:20px 0;">
            <p style="margin:0;color:#065f46;">✅ Profile live on PsychoLink<br/>✅ First session with each client is free<br/>✅ Subsequent sessions: ₹199/session</p>
          </div>
          <p style="color:#6b7280;">Welcome aboard! 💜</p>
        </div>
      </div>
    `,
  });

  res.send(htmlPage('✅ Approved!', `${application.fullName} has been approved and added to PsychoLink. A confirmation email has been sent to ${application.email}.`, '#10b981'));
});

app.get('/api/admin/applications/:id/reject', async (req, res) => {
  const id = Number(req.params.id);
  const applications = readJSON(APPLICATIONS_FILE);
  const idx = applications.findIndex(a => a.id === id);

  if (idx === -1) return res.send(htmlPage('❌ Not Found', 'Application not found or already processed.', '#ef4444'));
  if (applications[idx].status !== 'pending') {
    return res.send(htmlPage('Already Processed', `This application was already ${applications[idx].status}.`, '#f59e0b'));
  }

  const application = applications[idx];
  applications[idx].status = 'rejected';
  writeJSON(APPLICATIONS_FILE, applications);

  await sendMail({
    to: application.email,
    subject: 'PsychoLink — Consultant Application Update',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8f5ff;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#7c3aed,#be185d);padding:32px 28px;">
          <h1 style="color:#fff;margin:0;font-size:1.5rem;">🧠 PsychoLink</h1>
        </div>
        <div style="padding:28px;">
          <h2 style="color:#1a1a2e;">Application Update</h2>
          <p style="color:#374151;line-height:1.7;">Hi ${application.fullName},<br/><br/>Thank you for applying to PsychoLink. After careful review, we are unable to move forward at this time. We encourage you to reapply in the future.</p>
          <p style="color:#6b7280;">Warm regards,<br/>PsychoLink Team</p>
        </div>
      </div>
    `,
  });

  res.send(htmlPage('❌ Rejected', `${application.fullName}'s application has been rejected. A notification email has been sent to ${application.email}.`, '#ef4444'));
});

function htmlPage(title, message, color) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title></head>
  <body style="font-family:Arial,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f1f5f9;">
    <div style="text-align:center;padding:40px;background:#fff;border-radius:20px;box-shadow:0 10px 40px rgba(0,0,0,0.1);max-width:460px;">
      <div style="font-size:3rem;margin-bottom:16px;">${title.split(' ')[0]}</div>
      <h2 style="color:${color};margin:0 0 12px;">${title}</h2>
      <p style="color:#6b7280;line-height:1.6;">${message}</p>
      <a href="http://localhost:5173" style="display:inline-block;margin-top:20px;padding:12px 24px;background:linear-gradient(135deg,#7c3aed,#be185d);color:#fff;text-decoration:none;border-radius:10px;font-weight:700;">Go to PsychoLink →</a>
    </div>
  </body></html>`;
}

// ─────────────────────────────────────────────────────────
// /api/test-email  — quick test to verify Gmail works
// ─────────────────────────────────────────────────────────
app.get('/api/test-email', async (req, res) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
    return res.json({ ok: false, reason: 'GMAIL_USER or GMAIL_APP_PASS missing in .env' });
  }
  try {
    await sendMail({
      to: process.env.GMAIL_USER,
      subject: '✅ PsychoLink Email Test',
      html: '<h2>PsychoLink email is working! 🎉</h2><p>Your Gmail notification system is set up correctly.</p>',
    });
    res.json({ ok: true, msg: `Test email sent to ${process.env.GMAIL_USER}` });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// ─────────────────────────────────────────────────────────
// /api/analyze  — Emotion analysis for Neurological Report
// ─────────────────────────────────────────────────────────
app.post('/api/analyze', async (req, res) => {
  const { messages } = req.body;

  if (!API_KEY) {
    return res.status(500).json({ error: 'NVIDIA_API_KEY not set in .env' });
  }

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 900,
        messages: [
          {
            role: 'system',
            content: `You are an emotion analysis AI. Analyze user messages and return ONLY valid JSON, no extra text:
{"negative":{"anxiety":0,"depression":0,"stress":0,"loneliness":0,"overwhelm":0,"burnout":0},"projected":{"calmness":0,"happiness":0,"focus":0,"energy":0,"confidence":0,"peace":0},"overallStress":0,"dominantEmotion":"anxiety","summary":"2 sentences about emotional state","urgency":"low","insights":["insight1","insight2","insight3"]}
All scores 0-100. urgency = low | moderate | high | critical. Return ONLY the JSON object.`,
          },
          {
            role: 'user',
            content: `Analyze emotional state from: "${messages || 'No messages yet. Give neutral baseline.'}"`,
          },
        ],
      }),
    });

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content || '{}';
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);
    res.json(result);

  } catch (err) {
    console.error('Analyze error:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// ─────────────────────────────────────────────────────────
// /api/chat  — Real-time AI conversation (AURA / MAX)
// Accepts an optional `systemPrompt` so the frontend can send
// its own detailed persona prompts (AURA_PROMPT / MAX_PROMPT).
// ─────────────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { messages, persona, systemPrompt } = req.body;
  // messages    = [{ role:'user'|'assistant', content:'...' }, ...]
  // persona     = 'AURA' | 'MAX'  (fallback if no systemPrompt sent)
  // systemPrompt = optional custom system prompt from frontend

  if (!API_KEY) {
    return res.status(500).json({ error: 'NVIDIA_API_KEY not set in .env' });
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const defaultPrompt = persona === 'AURA'
    ? `You are AURA, a warm, empathetic AI psychological companion. Keep responses concise (2-4 sentences), conversational, and emotionally attuned. Not a licensed therapist — for serious concerns gently suggest professional help.`
    : `You are MAX, a sharp, supportive AI psychological companion. Keep responses concise and structured. Not a licensed therapist — for serious concerns gently suggest professional help.`;

  const finalSystemPrompt = systemPrompt || defaultPrompt;

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        temperature: 0.8,
        messages: [
          { role: 'system', content: finalSystemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('NVIDIA API error:', response.status, errBody);
      return res.status(response.status).json({ error: `NVIDIA API error ${response.status}` });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";

    res.json({ reply });

  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: err.message });
  }
});


// ─────────────────────────────────────────────────────────
// /api/journal/summarize  — AI weekly insight from journal entries
// ─────────────────────────────────────────────────────────
app.post('/api/journal/summarize', async (req, res) => {
  const { entries } = req.body;
  if (!API_KEY) return res.status(500).json({ error: 'NVIDIA_API_KEY not set' });
  if (!entries || !entries.length) return res.status(400).json({ error: 'entries required' });
  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: MODEL, max_tokens: 400, temperature: 0.7,
        messages: [
          { role: 'system', content: `You are a compassionate AI psychologist. Analyze these journal entries and give a warm, insightful 3-4 paragraph summary covering: emotional patterns you notice, positive progress, areas to focus on, and one practical suggestion. Be warm, encouraging, and specific. Don't use bullet points.` },
          { role: 'user', content: `Here are my recent journal entries:\n\n${entries.map((e,i)=>'Entry '+(i+1)+': '+e).join('\n\n')}\n\nPlease give me your insight.` }
        ],
      }),
    });
    const data = await response.json();
    const insight = data?.choices?.[0]?.message?.content || 'Unable to generate insight.';
    res.json({ insight });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ─────────────────────────────────────────────────────────
// /api/session/summary  — AI session summary card
// ─────────────────────────────────────────────────────────
app.post('/api/session/summary', async (req, res) => {
  const { messages, persona } = req.body;
  if (!API_KEY) return res.status(500).json({ error: 'NVIDIA_API_KEY not set' });
  if (!messages || !messages.length) return res.status(400).json({ error: 'messages required' });
  try {
    const conversation = messages.map(m => `${m.role === 'user' ? 'User' : persona || 'AI'}: ${m.content}`).join('\n');
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
      body: JSON.stringify({
        model: MODEL, max_tokens: 500, temperature: 0.6,
        messages: [
          { role: 'system', content: `You are a psychologist creating a brief session summary. Format your response exactly like this (use these exact headings):

🧠 Emotional State
[1-2 sentences about how the user felt]

💡 Key Insights
[2-3 key themes or patterns noticed]

✅ Progress Made
[What positive shifts or realizations happened]

🎯 Next Steps
[1-2 actionable suggestions for the user]

Keep each section concise and warm.` },
          { role: 'user', content: `Please summarize this therapy session:

${conversation}` }
        ],
      }),
    });
    const data = await response.json();
    const summary = data?.choices?.[0]?.message?.content || 'Unable to generate summary.';
    res.json({ summary });
  } catch (err) { res.status(500).json({ error: err.message }); }
});



// ─────────────────────────────────────────────────────────
// RAZORPAY PAYMENT
// .env: RAZORPAY_KEY_ID=rzp_live_xxx  RAZORPAY_KEY_SECRET=xxx
// ─────────────────────────────────────────────────────────
const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
  : null;

// POST /api/payment/order — create Razorpay order
app.post('/api/payment/order', async (req, res) => {
  if (!razorpay) return res.status(500).json({ error: 'Razorpay not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env' });
  const { amount, consultantName } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: (amount || 199) * 100, // paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: { consultant: consultantName || 'PsychoLink Session' },
    });
    res.json({ order, key: process.env.RAZORPAY_KEY_ID });
  } catch (e) {
    console.error('Razorpay order error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// POST /api/payment/verify — verify payment signature
app.post('/api/payment/verify', (req, res) => {
  if (!process.env.RAZORPAY_KEY_SECRET) return res.status(500).json({ success: false });
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  try {
    const sign     = razorpay_order_id + '|' + razorpay_payment_id;
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign).digest('hex');
    if (expected === razorpay_signature) {
      console.log('💰 Payment verified:', razorpay_payment_id);
      res.json({ success: true, paymentId: razorpay_payment_id });
    } else {
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Razorpay status
if (process.env.RAZORPAY_KEY_ID) {
  console.log('💳 Razorpay configured ✅ (', process.env.RAZORPAY_KEY_ID.startsWith('rzp_live') ? 'LIVE MODE 🟢' : 'TEST MODE 🟡', ')');
} else {
  console.log('⚠️  Razorpay NOT configured — add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env');
}

// ─────────────────────────────────────────────────────────
// EMAIL LOGIN CODE — send + verify a 6-digit code
// ─────────────────────────────────────────────────────────
const emailCodes = new Map(); // email -> { code, expires }

app.post('/api/send-email-code', async (req, res) => {
  const { email } = req.body || {};
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });
  const code = String(Math.floor(100000 + Math.random() * 900000));
  emailCodes.set(email.toLowerCase(), { code, expires: Date.now() + 10 * 60 * 1000 });
  console.log(`🔐 Login code for ${email}: ${code}`); // visible in server terminal as backup
  try {
    await sendMail({
      to: email,
      subject: `${code} is your Equilibrium sign-in code`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:440px;margin:auto;padding:32px;background:#0f1020;border-radius:16px;color:#fff">
          <h2 style="margin:0 0 8px;font-size:1.4rem">Your sign-in code</h2>
          <p style="color:#a8a8c0;margin:0 0 24px;font-size:0.9rem">Enter this code in Equilibrium to continue.</p>
          <div style="font-size:2.4rem;font-weight:800;letter-spacing:10px;text-align:center;padding:18px;background:#1a1b35;border-radius:12px;color:#8b87f5">${code}</div>
          <p style="color:#6b6b85;margin:22px 0 0;font-size:0.78rem">This code expires in 10 minutes. If you didn't request it, ignore this email.</p>
        </div>`,
    });
    res.json({ success: true });
  } catch (e) {
    console.error('send-email-code error:', e.message);
    res.status(500).json({ error: 'Failed to send code' });
  }
});

app.post('/api/verify-email-code', (req, res) => {
  const { email, code } = req.body || {};
  if (!email || !code) return res.status(400).json({ valid: false, reason: 'missing' });
  const rec = emailCodes.get(String(email).toLowerCase());
  if (!rec) return res.json({ valid: false, reason: 'no_code' });
  if (Date.now() > rec.expires) { emailCodes.delete(email.toLowerCase()); return res.json({ valid: false, reason: 'expired' }); }
  if (rec.code !== String(code)) return res.json({ valid: false, reason: 'mismatch' });
  emailCodes.delete(email.toLowerCase());
  res.json({ valid: true });
});

// ── PHONE SMS OTP — send a 6-digit code via Fast2SMS ──
app.post('/api/send-sms', async (req, res) => {
  const { phoneNumber, otpCode } = req.body || {};
  if (!phoneNumber || !otpCode) {
    return res.status(400).json({ success: false, error: 'phoneNumber and otpCode are required' });
  }

  const apiKey = process.env.FAST2SMS_API_KEY || "zp8QEuUqIaerK5Rt9FYhojwcPLis31BbJVTW6fxGN70MmZAOHd53klRIvr6wQVAi1a84EjceLuUODgzb";
  console.log(`💬 Attempting to send SMS to ${phoneNumber} with code: ${otpCode}`);

  try {
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=otp&variables_values=${otpCode}&numbers=${phoneNumber}`;
    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();
    
    if (data.return === true) {
      console.log(`✅ SMS successfully sent to ${phoneNumber}`);
      res.json({ success: true });
    } else {
      console.warn("⚠️ Fast2SMS API error response:", data);
      res.status(400).json({ success: false, error: data.message });
    }
  } catch (err) {
    console.error("❌ Fast2SMS server fetch failed:", err);
    res.status(500).json({ success: false, error: err.message || "Internal server error during SMS dispatch" });
  }
});


// Email status check at startup
if (process.env.RESEND_API_KEY) {
  console.log('📧 Resend email configured ✅ → notifications go to:', process.env.FOUNDER_EMAIL || 'FOUNDER_EMAIL not set');
} else {
  console.log('⚠️  Email NOT configured — add RESEND_API_KEY to .env');
}

console.log('🔑 NVIDIA_API_KEY loaded:', API_KEY ? `${API_KEY.slice(0,12)}... (length ${API_KEY.length})` : '❌ NOT FOUND');

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('   - POST /api/analyze (emotion report)');
  console.log('   - POST /api/chat    (live AI chat)');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('');
    console.error('========================================================');
    console.error('  PORT ' + PORT + ' IS ALREADY IN USE');
    console.error('========================================================');
    console.error('');
    console.error('Another process (an old "node server.js") is still');
    console.error('running and occupying this port. Fix:');
    console.error('');
    console.error('  Windows: Open Task Manager (Ctrl+Shift+Esc)');
    console.error('           -> Details tab');
    console.error('           -> find ALL "Node.js JavaScript Runtime" entries');
    console.error('           -> select each one -> click "End Task"');
    console.error('  Then run: node server.js   again.');
    console.error('');
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});