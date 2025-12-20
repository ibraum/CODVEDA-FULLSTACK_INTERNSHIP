# Codveda Internship : Full-Stack Development (Levels 1 → 3)

Welcome to Codveda Technology — congratulations on completing Level 1!

This README summarizes the internship structure (Level 1 → Level 3), submission and LinkedIn instructions, how to run and navigate the project files, and the tasks you completed and will complete.

---

**Table of Contents**

- About Codveda
- How to Use This Repository
- Instructions & Submission
- Task List (Level 1 — Level 3)
- How to run the Level 1 project (local)
- File structure and navigation
- Contact

---

**About Codveda**

Codveda Technology empowers businesses with tailored IT solutions: web & app development, digital marketing, SEO, AI/ML automation, and data analysis. Our internships are designed to grow practical, production-minded developers.

As part of the program you will:
- Build full-stack projects (backend API + frontend UI)
- Learn version control and deployment basics
- Practice modern toolchains and testing

When you complete a level, update your LinkedIn profile with the offer letter and completion certificate, tag @Codveda, and use hashtags like `#CodvedaJourney`, `#CodvedaExperience`, and `#FutureWithCodveda` when sharing your work.

---

**Instructions**

1. Keep a separate folder or file per level and store your code in a GitHub repository.
2. Create a short, professional video demonstrating your work (what you built, your role, technical choices) — host the video on LinkedIn and include the GitHub repo link.
3. Use the provided SUBMISSION FORM (will be shared) to submit your projects within the allocated 15-day window for each level.

When posting on LinkedIn, include:
- A short summary of the project
- A demo video (or link) and the GitHub repository
- Tag `@Codveda` and use the recommended hashtags

---

**Submission**

Submit completed tasks with the Codveda submission form (link after share). Provide:
- GitHub repository link (public or access granted)
- Short video demo (LinkedIn link accepted)
- Brief README for each level with instructions to run the project

---

**Task List**

Level 1 : Basic (Completed)

- Task 1: Setup Development Environment
	- Install Node.js, npm, VS Code, Git
	- Setup GitHub repository and practice Git commands
	- Install a local database if needed (Postgres)

- Task 2: Build a Simple REST API
	- Express server with CRUD routes for a resource (e.g., users)
	- Test endpoints with Postman 
	- Proper error handling and HTTP responses

- Task 3: Frontend with HTML/CSS/JavaScript
	- Static frontend using HTML/CSS and vanilla JS
	- Fetch API data from your REST API and render dynamically
	- Basic styling and responsive layout

Level 2 : Intermediate

- Task 1: Frontend using a JavaScript framework (React / Vue / Angular)
	- Component-driven architecture
	- State management and reusable components
	- API integration and loading states

- Task 2: Authentication & Authorization
	- Implement signup/login with bcrypt and JWT
	- Store tokens securely (HTTP-only cookies or local storage)
	- Protect routes and implement role-based access

- Task 3: Database Integration
	- Use MongoDB (Mongoose) or SQL (Prisma/Sequelize)
	- Create models, relations, validation, and indexing

Level 3 : Advanced

- Task 1: Full-Stack Application (MERN / MEVN / PERN)
	- Integrate auth, DB, and a framework frontend
	- Performance optimizations and deployment

- Task 2: Real-Time with WebSockets (Socket.io)
	- Setup server and client for real-time messaging/notifications

- Task 3: GraphQL API Development
	- Build GraphQL server (Apollo or express-graphql)
	- Define queries, mutations, and resolvers; secure them

---

**How to run the Level 1 project (local)**

Assuming you are in the workspace root (`/home/ibraum/Documents/DEV/codveda/fullstack`):

1. Install backend dependencies and start server

```bash
cd level1_basic/task1/backend
npm install
node server.js
```

2. Open the frontend

```bash
# In a separate terminal
cd level1_basic/task1/frontend
# open index.html in the browser or use a static server
xdg-open index.html
```

Notes:
- The Express server runs on `http://localhost:3000` by default (see `server.js`).
- Use Postman or the browser to test API endpoints.

---

**File structure & navigation (Level 1 example)**

Project: `level1_basic/task1`

- Backend: `level1_basic/task1/backend`
	- `server.js` — Express server implementation, CRUD endpoints
	- `package.json` — dependencies and scripts
	- `readme.md` — backend-specific notes (if present)

- Frontend: `level1_basic/task1/frontend`
	- `index.html` — main UI (tables, modals)
	- `style.css` — styles for UI
	- `script.js` — frontend logic: fetch users, open modals, form submit
	- `resources/` — images and icons

Navigation tips:
- To inspect how the frontend talks to your API, open `script.js` and locate `construct_url()`.
- Modal and UI behavior lives in `script.js` (functions: `getUsers()`, `renderUsers()`, `showViewModal()`, `openEditModal()`).
- To change API paths or ports, edit `construct_url()` in `script.js` and `server.js`.

---

**Contact**

- Codveda: [www.codveda.com](https://www.codveda.com)
- Support email: support@codveda.com
- Social: @codveda

---

Good work on finishing Level 1.

