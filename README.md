# Fullstack CI/CD Demo

A full-stack Node.js + Express + PostgreSQL project with a **frontend, backend, and CI/CD pipeline** deployed on Render. This project demonstrates a complete **end-to-end workflow** from local development to automatic deployment in the cloud.

---

## Project Structure

```
fullstack-cicd-demo
 ├─ backend
 │   ├─ db.js
 │   ├─ package.json
 │   └─ server.js
 ├─ frontend
 │   └─ index.html
 └─ .github
     └─ workflows
         └─ ci.yml
```

---

## Tech Stack

- **Frontend:** HTML + JavaScript  
- **Backend:** Node.js + Express  
- **Database:** PostgreSQL (local or Render-hosted)  
- **CI/CD:** GitHub Actions  
- **Deployment:** Render (Free Plan supported)

---

## How the Project Works

1. **Frontend** – Simple message board:
   - Input box to send messages
   - List of messages fetched from backend
2. **Backend** – Express API:
   - `GET /api/messages` → fetch all messages
   - `POST /api/messages` → add a new message
   - Initializes database table automatically
3. **Database** – PostgreSQL:
   - Local database for development
   - Hosted database on Render for deployment
4. **CI/CD** – GitHub Actions:
   - Runs on every push to `main`
   - Installs backend dependencies
   - (Optional) Runs tests
   - Auto-deploys to Render

---

## Local Development

### Prerequisites

- Node.js >= 18
- PostgreSQL installed locally
- Git

### Steps

1. Clone the repository:

```bash
git clone https://github.com/N-PanhaMony/fullstack_cicd_demo.git
cd fullstack-cicd_demo
```

2. Create `.env` in `backend/`:

```env
DATABASE_URL=postgres://<local_user>:<password>@localhost:5432/<database_name>
```

3. Install dependencies:

```bash
cd backend
npm install
```

4. Start backend server:

```bash
node server.js
```

5. Open browser:

```
http://localhost:3000
```

- Frontend served automatically by backend  
- Messages are stored in **local PostgreSQL**

---

## Deployment on Render

### 1. Create PostgreSQL on Render

1. Go to **Render Dashboard → New → PostgreSQL**  
2. Choose **Free Plan**  
3. Copy **Internal Database URL** (for backend deployment)  
4. Copy **External Database URL** (for local development/CI)

### 2. Deploy Backend on Render

1. Go to **Render → New → Web Service**  
2. Connect your GitHub repo  
3. Set the following:

| Field             | Value                                  |
|------------------|----------------------------------------|
| Root Directory    | backend                                 |
| Build Command     | `npm install`                           |
| Start Command     | `node server.js`                        |
| Environment Var   | `DATABASE_URL=<Internal Database URL>` |

4. Deploy → backend will serve frontend and API  
5. Backend URL example:

```
https://fullstack-cicd-demo.onrender.com
```

### 3. Optional: Deploy Frontend as Static Site

1. Go to **Render → New → Static Site**  
2. Settings:

| Field             | Value                     |
|------------------|---------------------------|
| Root Directory    | frontend                  |
| Build Command     | (leave blank)             |
| Publish Directory | `.`                        |

3. Update fetch calls in `frontend/index.html`:

```javascript
fetch("https://fullstack-cicd-demo-backend.onrender.com/api/messages")
```

---

## CI/CD with GitHub Actions

- Workflow file: `.github/workflows/ci.yml`  
- Triggers on **push or pull request to main**  
- Steps:

  1. Checkout code
  2. Setup Node.js environment
  3. Install backend dependencies
  4. (Optional) Run backend tests
  5. Deploy automatically via Render

Example snippet:

```yaml
name: Node CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd backend && npm install
      - run: echo "✅ CI pipeline passed"
```

---

## Database Environment Switching

- **Local development:** `.env` points to local PostgreSQL  
- **Render deployment:** environment variable `DATABASE_URL` points to Render-hosted PostgreSQL  
- **CI/CD testing:** can use either hosted DB or GitHub Actions PostgreSQL service  

Example in `backend/db.js`:

```javascript
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://localuser:localpass@localhost:5432/mydb"
});

module.exports = pool;
```

---

## Architecture Overview

```
User Browser
      ↓
Frontend (served by backend or static site)
      ↓
Backend API (Node.js + Express)
      ↓
PostgreSQL (local or hosted)
      ↓
GitHub Actions (CI)
      ↓
Render Deployment (CD)
```

---

## Notes

- Free Render instances **sleep after inactivity** — wake by visiting the URL  
- Frontend fetch calls must point to deployed backend URL when not running locally  
- CI/CD ensures code is tested and deployed automatically

---