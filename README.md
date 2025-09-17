
# 📚 Smart Learning Companion – AI-Powered Knowledge Recommender

### Department of Computer Science and Applications

**Mini Project on Open-Source Technologies**
**Project Name:** Smart Learning Companion
**Division:** SYMCA – A
**Academic Year:** 2025–2026

---

## 👥 Project Members

| Sr. No. | Name           |
| ------- | -------------- 
| 1       | Yuvraj Mandlik |
| 2       | Kaustubh Begde |

---

## 🌍 Project Vision

The **Smart Learning Companion** is an **AI-powered, open-source learning assistant** that integrates conventional resources (college library, textbooks) with **modern digital platforms** (YouTube, MOOCs, blogs, research portals). It helps students:

* Discover relevant books, research articles, videos, and courses.
* Get **personalized AI-powered recommendations**.
* Preview **summaries** of long documents/videos.
* Track **learning progress and knowledge maps**.
* Use an **AI study buddy** for instant clarifications.

The project emphasizes **accessibility** and **open-source collaboration**, ensuring education remains **inclusive and free for everyone**.

---

## 🚀 Features

* 🔑 **Authentication & User Profiles** (JWT-based secure login).
* 🔍 **Unified Knowledge Search** (library DB + open APIs).
* 🤖 **AI Recommendation Engine** (personalized content ranking).
* ✨ **AI Summarizer & Study Buddy** (instant previews + Q\&A).
* 📊 **Knowledge Dashboard** (progress, streaks, visual charts).
* ♿ **Accessibility-first design** (ARIA support, keyboard navigation, high-contrast mode).
* 🌐 **Open source & modular** (easy for contributors to add features).

---

## 🛠️ Tech Stack

### **Frontend**

* Next.js + React
* Tailwind CSS
* ShadCN UI (accessible components)
* Framer Motion (animations)
* Recharts (visualizations)

### **Backend**

* Node.js + Express.js
* PostgreSQL (local or Neon)
* Drizzle ORM (type-safe queries)
* JWT + bcryptjs (authentication)
* CORS + dotenv (config/security)

### **AI & APIs**

* OpenAI / Gemini API (summarization & Q\&A)
* YouTube Data API (lecture search)
* ArXiv API (research papers)
* Library DB (college/institutional sources)

### **Deployment**

* Vercel (frontend)
* Render/Railway (backend)
* Docker (optional for DB setup)

---

## 📂 File Directory Structure

```bash
smart-learning-companion/
│
├── backend/                         # Backend (Node.js + Express + Drizzle)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts              # Login, signup, JWT auth
│   │   │   ├── dashboard.ts         # Dashboard API (stats, activities, recommendations)
│   │   │   └── resources.ts         # Unified resource fetcher
│   │   ├── db/
│   │   │   ├── schema.ts            # Drizzle schema definitions
│   │   │   ├── index.ts             # DB connection (Postgres/Neon)
│   │   │   └── migrations/          # Migration files
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts    # JWT verification middleware
│   │   ├── utils/
│   │   │   ├── ai.ts                # OpenAI/Gemini integration
│   │   │   └── apiClients.ts        # YouTube/ArXiv API wrappers
│   │   ├── app.ts                   # Express app config
│   │   └── server.ts                # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                         # Backend environment variables
│
├── frontend/                        # Frontend (Next.js + React + Tailwind)
│   ├── app/
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Homepage
│   │   ├── dashboard/
│   │   │   └── page.tsx             # Dashboard UI
│   │   └── auth/
│   │       ├── login.tsx            # Login page
│   │       └── signup.tsx           # Signup page
│   ├── components/
│   │   ├── Navbar.tsx               # Top navigation
│   │   ├── ResourceCard.tsx         # Resource display card
│   │   ├── ActivityFeed.tsx         # Recent activities
│   │   └── ProgressChart.tsx        # Dashboard charts
│   ├── styles/
│   │   └── globals.css              # Tailwind base styles
│   ├── utils/
│   │   └── api.ts                   # API fetch helpers
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── shared/                          # Shared types, constants, helpers
│   └── types.ts                     # TypeScript interfaces
│
├── docs/                            # Documentation
│   ├── schema.sql                   # SQL schema (Postgres tables)
│   ├── seed.sql                     # Example seed data
│   └── architecture.md              # System architecture overview
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## ⚙️ Setup & Installation

### 1. Install Prerequisites

* Node.js (v18+)
* PostgreSQL (v14+) or Docker
* Git

```bash
node -v
npm -v
psql --version
```

---

### 2. Clone Repository

```bash
git clone https://github.com/YOUR-USERNAME/smart-learning-companion.git
cd smart-learning-companion
```

---

### 3. Backend Setup

```bash
cd backend
npm install express pg drizzle-orm pg-pool jsonwebtoken bcryptjs cors dotenv
npm install -D typescript ts-node @types/node @types/express @types/jsonwebtoken
```

* Create `.env`:

  ```
  DATABASE_URL=postgres://username:password@localhost:5432/smart_learning
  JWT_SECRET=your-secret
  OPENAI_API_KEY=your-api-key
  ```

* Run migrations:

  ```bash
  npx drizzle-kit generate
  npx drizzle-kit push
  ```

* Start server:

  ```bash
  npm run dev
  ```

---

### 4. Frontend Setup

```bash
cd frontend
npm install next react react-dom tailwindcss framer-motion lucide-react recharts @shadcn/ui
npm install -D typescript @types/react @types/node autoprefixer postcss
```

* Start dev server:

  ```bash
  npm run dev
  ```

App runs at: [http://localhost:3000](http://localhost:3000)

---

## Database Schema (Example)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE resources (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type VARCHAR(20), -- book, video, article
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_resources (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  resource_id INT REFERENCES resources(id)
);

CREATE TABLE user_activities (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  action TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

## Limitations

* Reliant on external APIs (YouTube, ArXiv, MOOCs).
* Summarization may oversimplify.
* Scaling large datasets needs indexing/caching.

---

## Conclusion

The **Smart Learning Companion** fosters an **open, accessible, AI-powered education ecosystem**. It combines **traditional and digital resources** while empowering students to learn **faster, smarter, and more inclusively**.

---

## Contribution

1. Fork repo
2. Create a feature branch
3. Submit PR

---

## License

MIT License – Open for all.

---


