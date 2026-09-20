# AI SQL Assistant

Ask questions about your database in plain English. The app reads your database schema, sends it to an LLM along with your question, generates a SQL query, validates it's safe, and runs it — showing you real results and the exact SQL that produced them.

Built to close a specific gap: hands-on experience with relational databases (Postgres) and the security problems that come with letting an LLM write SQL.

---

## Why this project

Most "AI wrapper" projects call an LLM API and display the text response. That's not hard, and it doesn't teach much.

This project's actual problem is: **an LLM can generate any SQL it wants, including destructive statements. How do you let it write queries without giving it the ability to break your database?**

The answer here is two independent layers of defense — one at the database level, one at the application code level — so that even if one fails, the other still holds.

---

## How it works

```
User question (plain English)
        │
        ▼
Fetch target DB schema (information_schema introspection)
        │
        ▼
Build a schema-aware prompt → send to Gemini
        │
        ▼
LLM returns a SQL query
        │
        ▼
Layer 1: SQL parsed with node-sql-parser
         → reject anything that isn't a single SELECT statement
        │
        ▼
Layer 2: Query runs through a Postgres role with SELECT-only
         grants, a 5-second statement timeout, and a 100-row cap
        │
        ▼
Results + the generated SQL are returned to the user
and saved to query history (linked to their account)
```

## Security design

| Layer | What it does | Why it's not enough alone |
|---|---|---|
| Prompt instructions | Tells the LLM to only write SELECT queries | LLMs are not a security boundary — instructions can be ignored or bypassed |
| Code-level validator | Parses the generated SQL into an AST (`node-sql-parser`) and rejects anything that isn't a single `SELECT` | Doesn't protect against a leaked/misused DB credential elsewhere in the stack |
| Database-level role | A dedicated Postgres user (`readonly_ai`) with `SELECT`-only grants on the target database | Doesn't stop a badly-formed but technically valid SELECT from being expensive (e.g. no `LIMIT`) |
| Query execution guards | `statement_timeout` + row cap (100 rows) applied at execution time | Doesn't validate query intent, only bounds its cost |

Each layer covers a different failure mode. Relying on any single one would leave a gap.

---

## Tech stack

**Backend:** Node.js, Express, PostgreSQL, Prisma (app data), raw `pg` (target/sandboxed data), JWT, bcrypt, Nodemailer, Google Gemini API, `node-sql-parser`

**Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios

**Auth:** Email/password + mandatory two-step email OTP verification on every login (not just signup)

---

## Features

- **Real two-factor authentication** — signup requires email verification; every login (not just the first one) requires a fresh OTP sent to the user's email before a session token is issued
- **Natural language to SQL** — ask a question, get a real, executable query back with an explanation of what ran
- **Schema-aware generation** — the LLM is given the live database structure (tables, columns, types) at request time, so it can write correct JOINs across relations
- **Query history** — every question, its generated SQL, and its result set are saved per-user via a foreign-key relation, and can be revisited without re-running the query
- **Case-insensitive matching** — the prompt is tuned to use `ILIKE` for text comparisons, since a user typing "ahmedabad" should still match a row stored as "Ahmedabad"

---

## Project structure

```
backend/
  src/
    modules/
      auth/       signup, OTP verification, login, login OTP, JWT issuance
      schema/      introspects the target database's structure
      query/       orchestrates: schema → prompt → LLM → validate → execute → save
      history/     fetches a user's saved query history
    core/
      llm/         LLM client + prompt construction (isolated so the provider can be swapped)
      sqlSafety/   AST-based SQL validator + sandboxed executor
    middleware/    JWT auth guard
    prisma/        schema for the app's own data (User, QueryHistory)

frontend/
  src/
    pages/         Signup, Login, VerifyOtp, VerifyLoginOtp, Dashboard
    components/    QueryInput, SqlDisplay, ResultsTable, HistorySidebar
    api/           axios client + per-feature API calls
    context/       auth state (token/user), persisted across refreshes
```

---

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL running locally
- A Gemini API key ([aistudio.google.com/apikey](https://aistudio.google.com/apikey))
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) for sending OTP emails

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:
```
PORT=3000
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/ai_sql_assistant
TARGET_DATABASE_URL=postgresql://readonly_ai:<password>@localhost:5432/target_ecommerce
JWT_SECRET=<a long random string>
EMAIL_USER=<your gmail address>
EMAIL_PASS=<your gmail app password>
GEMINI_API_KEY=<your gemini api key>
```

Set up the databases:
```sql
CREATE DATABASE ai_sql_assistant;
CREATE DATABASE target_ecommerce;

-- inside target_ecommerce: create a read-only role for the AI to query through
CREATE USER readonly_ai WITH PASSWORD '<password>';
GRANT CONNECT ON DATABASE target_ecommerce TO readonly_ai;
GRANT USAGE ON SCHEMA public TO readonly_ai;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_ai;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO readonly_ai;
```

Run migrations and seed the target database with sample tables (`customers`, `products`, `orders`, `order_items`), then start the server:
```bash
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## What I'd improve next

- Support connecting to any user-supplied database rather than one fixed target
- Add a schema visualizer (table/column browser) in the UI
- Move from a single long-lived JWT to short-lived access tokens + refresh tokens
- Add query cost estimation (`EXPLAIN`) before execution, not just a row cap after