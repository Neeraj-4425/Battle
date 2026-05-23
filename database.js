const fs   = require('fs');
const path = require('path');

// ── Data folder & file paths ──────────────────
const DATA_DIR   = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const REGS_FILE  = path.join(DATA_DIR, 'registrations.json');

// ── Create data/ folder if it doesn't exist ───
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

// ── Load or create users.json ─────────────────
function loadUsers() {
  if (fs.existsSync(USERS_FILE)) {
    try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')); }
    catch (e) { console.error('Error reading users.json:', e.message); }
  }
  // First time ever — create admin account
  const defaults = [{ id: 1, name: 'Admin', email: 'admin@battlearena.com', password: 'admin123' }];
  fs.writeFileSync(USERS_FILE, JSON.stringify(defaults, null, 2));
  console.log('✅ Created data/users.json with default admin account');
  return defaults;
}

// ── Load or create registrations.json ─────────
function loadRegistrations() {
  if (fs.existsSync(REGS_FILE)) {
    try { return JSON.parse(fs.readFileSync(REGS_FILE, 'utf-8')); }
    catch (e) { console.error('Error reading registrations.json:', e.message); }
  }
  fs.writeFileSync(REGS_FILE, JSON.stringify([], null, 2));
  return [];
}

// ── In-memory state ───────────────────────────
let users         = loadUsers();
let registrations = loadRegistrations();
let userIdCounter = users.length ? Math.max(...users.map(u => u.id)) + 1 : 2;
let regIdCounter  = registrations.length ? Math.max(...registrations.map(r => r.id)) + 1 : 1;

// ── Save to file ──────────────────────────────
function saveUsers()         { fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2)); }
function saveRegistrations() { fs.writeFileSync(REGS_FILE,  JSON.stringify(registrations, null, 2)); }

// ── Static data ───────────────────────────────
const tournaments = [
  { id: 1, name: 'BGMI Weekly Scrims',    date: '15 March 2026', format: 'Squad (Erangel & Miramar)', entry: 'Free',       prize: '₹10,000', game: 'BGMI'      },
  { id: 2, name: 'Valorant Pro League',   date: '20 March 2026', format: '5v5 Custom',                entry: '₹500/Team', prize: '₹50,000', game: 'Valorant'  },
  { id: 3, name: 'Free Fire Clash Squad', date: '25 March 2026', format: '4v4',                       entry: 'Free',       prize: '₹5,000',  game: 'Free Fire' },
];

const leaderboard = [
  { rank: 1, team: 'TotalGaming',   game: 'BGMI',      wins: 15, points: 4500 },
  { rank: 2, team: 'Soul Esports',  game: 'BGMI',      wins: 12, points: 3800 },
  { rank: 3, team: 'GodLike',       game: 'Valorant',  wins: 10, points: 3200 },
  { rank: 4, team: 'S8UL',          game: 'Free Fire', wins: 9,  points: 2900 },
  { rank: 5, team: 'Marcos Gaming', game: 'BGMI',      wins: 8,  points: 2600 },
];

// ── Tournament functions ──────────────────────
function getAllTournaments()    { return tournaments; }
function getTournamentById(id) { return tournaments.find(t => t.id === id) || null; }

// ── Registration functions ────────────────────
function isAlreadyRegistered(email, tournamentId) {
  return registrations.some(r => r.email === email && r.tournamentId === tournamentId);
}
function addRegistration({ name, email, teamName, tournamentId }) {
  const reg = { id: regIdCounter++, name, email, teamName, tournamentId, registeredAt: new Date().toISOString() };
  registrations.push(reg);
  saveRegistrations();
  return reg;
}
function getAllRegistrations() { return registrations; }

// ── User functions ────────────────────────────
function findUser(email, password) {
  // trim both sides to avoid invisible space issues
  const e = email.trim().toLowerCase();
  const p = password.trim();
  return users.find(u => u.email.trim().toLowerCase() === e && u.password.trim() === p) || null;
}
function userExists(email) {
  return users.some(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
}
function addUser({ name, email, password }) {
  const user = { id: userIdCounter++, name: name.trim(), email: email.trim().toLowerCase(), password: password.trim() };
  users.push(user);
  saveUsers();
  return user;
}
function getAllUsers() { return users.map(u => ({ id: u.id, name: u.name, email: u.email })); } // no passwords

// ── Leaderboard ───────────────────────────────
function getLeaderboard() { return leaderboard; }

// ─────────────────────────────────────────────
module.exports = {
  getAllTournaments, getTournamentById,
  isAlreadyRegistered, addRegistration, getAllRegistrations,
  findUser, userExists, addUser, getAllUsers,
  getLeaderboard,
};
