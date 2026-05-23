const express = require('express');
const path    = require('path');
const db      = require('./database');

const app  = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Serve frontend ────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── GET all tournaments ───────────────────────
app.get('/api/tournaments', (req, res) => {
  res.json({ success: true, data: db.getAllTournaments() });
});

// ── GET single tournament ─────────────────────
app.get('/api/tournaments/:id', (req, res) => {
  const t = db.getTournamentById(Number(req.params.id));
  if (!t) return res.status(404).json({ success: false, message: 'Tournament not found' });
  res.json({ success: true, data: t });
});

// ── POST register for tournament ──────────────
app.post('/api/register', (req, res) => {
  const { name, email, teamName, tournamentId } = req.body;
  if (!name || !email || !teamName || !tournamentId)
    return res.status(400).json({ success: false, message: 'All fields are required' });

  if (db.isAlreadyRegistered(email, Number(tournamentId)))
    return res.status(409).json({ success: false, message: 'Already registered for this tournament' });

  const reg = db.addRegistration({ name, email, teamName, tournamentId: Number(tournamentId) });
  res.status(201).json({ success: true, message: 'Registration successful!', data: reg });
});

// ── GET all registrations ─────────────────────
app.get('/api/registrations', (req, res) => {
  res.json({ success: true, data: db.getAllRegistrations() });
});

// ── POST login ────────────────────────────────
app.post('/api/login', (req, res) => {
  console.log('LOGIN ATTEMPT:', req.body);          // ← shows in terminal
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password are required' });

  const user = db.findUser(email.trim(), password.trim());
  console.log('USER FOUND:', user ? user.name : 'NOT FOUND');

  if (!user)
    return res.status(401).json({ success: false, message: 'Invalid email or password' });

  res.json({ success: true, message: `Welcome back, ${user.name}!`, user: { id: user.id, name: user.name, email: user.email } });
});

// ── POST signup ───────────────────────────────
app.post('/api/signup', (req, res) => {
  console.log('SIGNUP ATTEMPT:', req.body);         // ← shows in terminal
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'All fields are required' });

  if (db.userExists(email.trim()))
    return res.status(409).json({ success: false, message: 'Email already registered' });

  const user = db.addUser({ name: name.trim(), email: email.trim(), password: password.trim() });
  console.log('NEW USER SAVED:', user.email);

  res.status(201).json({ success: true, message: 'Account created! You can now login.', user: { id: user.id, name: user.name, email: user.email } });
});

// ── GET leaderboard ───────────────────────────
app.get('/api/leaderboard', (req, res) => {
  res.json({ success: true, data: db.getLeaderboard() });
});

// ── DEBUG: see all users (remove before submission) ──
app.get('/api/debug/users', (req, res) => {
  res.json({ success: true, data: db.getAllUsers() });
});

// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✅ BattleArena running at http://localhost:${PORT}`);
  console.log(`👤 Default login → email: admin@battlearena.com | password: admin123\n`);
});
