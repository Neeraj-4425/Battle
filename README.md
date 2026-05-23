🎮 BattleArena — E-Sports Tournament Management

🎓 BCA Final Year Minor Project

📂 Project Structure

📂 battlearena \\
                  📄 server.js — 🚀  Main Backend (Express server + API routes)
                  📄 database.js — 🧠 In-Memory Database (Tournaments, Users, Registrations)
                  📄package.json — 📦

*Project Dependencies*

📂 public/🌐 index.html — 🎨 Frontend UI (HTML + CSS + JS)⚡

Setup & Execution Step 1 — Install Node.jsDownload from: https://nodejs.org (LTS Version)

Step 2 — Install Dependencies👉 npm install

Step 3 — Start the Server👉 node server.js

Step 4 — Launch ProjectOpen browser to: http://localhost:3000🔌 API EndpointsMethodEndpoint URLDescriptionGET/api/tournamentsFetch all active tournamentsGET/api/tournaments/:idGet specific tournament detailsPOST/api/registerRegister a team for a tournamentGET/api/registrationsView all sign-ups (Admin Only)POST/api/loginUser AuthenticationPOST/api/signupCreate a new user accountGET/api/leaderboardFetch live ranking data🧪 API Interaction Examples(Useful for testing in Postman or Browser Console)

1. Team RegistrationJSON// POST /api/register

{
  "name": "Rahul Kumar",
  "email": "rahul@email.com",
  "teamName": "PhoenixSquad",
  "tournamentId": 1
}


2. User LoginJSON// POST /api/login
{
  "email": "admin@battlearena.com",
  "password": "admin123"
}

🛠️ *Tech StackFrontend:*

HTML5, CSS3, Vanilla JavaScriptBackend: Node.js + Express.jsDatabase: In-memory store (Efficient JS Arrays)⚠️ Technical NotesVolatile Storage: Data is stored in RAM; it will reset if the server is restarted.Scalability: The database.js file is designed for easy migration to MongoDB or SQLite for future persistent storage.
