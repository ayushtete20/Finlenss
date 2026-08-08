# 📈 Finlenss — Financial Blog, Research & Executive Collaboration Platform

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg?logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An institutional-grade **Financial Insights Blog, DCF Valuation Models & Executive Collaboration Ecosystem** powered by **React 18 (Vite)**, **Supabase (PostgreSQL, Storage, & Realtime)**, **TailwindCSS**, and **Express.js / SQLite** dual-database resilience.

---

## 🌟 Key Platform Capabilities

### 📰 1. Main Blog Platform (`frontend-main` — Port 5173)
* **Institutional Market Insights**: Real-time category filtering across *Financial Valuation*, *Macroeconomics*, *Stocks*, *Wealth Management*, *SaaS & Tech*, and *DeFi 3.0*.
* **Realtime Live Refresh**: Powered by **Supabase Realtime** — all sections (Featured Selection, Pinned Trending, and Latest Insights) refresh live when new articles are published or updated, featuring a ⚡ *Live Updated* badge.
* **Capped Latest Insights**: Capped to display exactly the **6 latest research articles** to maintain a clean, high-performance layout.

---

### ❤️ 2. Article Engagement Engine (Like, Comment, Share)
Every individual article view (`/post/:id`) includes a bottom action bar with live interactions:
* **Like Interaction**: Instant visual toggle (turns to a filled red heart with micro-bounce animation), updates the article's like count in the Supabase database, and displays the live like counter.
* **Expandable Discussion & Comments**: Clicking the comment button toggles a hidden comment box. Readers can post their perspectives, which push directly to the Supabase `comments` table and immediately render in the live discussion thread below.
* **Instant URL Share**: Programmatically copies the current live article URL to the clipboard and triggers a floating `"Link Copied!"` toast notification for seamless public sharing.

---

### 🤝 3. "Let's Collaborate" Section
* Horizontally centered, modern partnership form replacing legacy consultation layouts.
* **Input Fields**: Full Name, Email Address, Project Type dropdown (*Financial Modeling & Valuation*, *Equity Research & DCF*, *Strategic Advisory*, *Data Analytics*, *Full-Stack Web Apps*, *Other*), and detailed Message scope.
* Solid-colored primary submit button with loading spinner and instant success confirmation banner.
* Inserts submissions directly into the Supabase **`collaborations`** table.

---

### ⭐ 4. "Article Feedback" Rating Section
* Interactive 1–5 star rating system with hover glow and click selection powered by `lucide-react` `Star` icons.
* Dedicated suggestions textarea for readers to recommend upcoming valuation models, macroeconomic topics, or analytical critiques.
* Inserts ratings and feedback into the Supabase **`feedback`** table.

---

### 👑 5. Owner & Admin Management Portal (`/admin/dashboard`)
* **Real-Time Data Fetching**: Direct Supabase select queries and real-time listeners for live analytics.
* **Article Stats**: Table columns display **Live Likes** (`Heart` icon + count), **Total Comments** (`MessageCircle` icon + count), and **Views** (`Eye` icon + count) next to each published post.
* **Collaboration Requests Tab**: Dedicated panel displaying incoming partnership submissions with search, project type badges, client mailto links, and status controls (`Pending`, `In Review`, `Contacted`, `Completed`).
* **Reader Feedback Tab**: Dedicated panel displaying reader reviews with visual 1–5 filled yellow stars, average score calculations, feedback distribution, and star filters.
* **Licenses & Certifications Manager**: Add accredited credentials, link case study articles, and attach downloadable Excel models or Certificate documents.
* **Supabase Cloud Initializer (`/admin/seed`)**: One-click cloud seeding for the **Dabur 3-Statement Financial Model** and credentials.

---

### 💼 6. Advisor Portfolio (`frontend-portfolio` — Port 5174)
* **3D Financial Canvas (`FinancialBackground.jsx`)**: Real-time HTML5 3D candlestick and financial wave chart background animation.
* **Verified Credentials Grid**: Accredited certifications featuring dynamic Supabase data fetching and downloadable Excel financial models.
* **Integrated Collaboration & Feedback**: Includes both the centered "Let's Collaborate" and "Article Feedback" sections.
* **WhatsApp Advisory Widget**: Fixed bottom-right chat button with live status cards.

---

## 🏗️ System Architecture

```
                               ┌─────────────────────────────────────────────────────────┐
                               │                      CLIENT LAYER                       │
                               └────────────────────────────┬────────────────────────────┘
                                                            │
                       ┌────────────────────────────────────┴─────────────────────────────────────┐
                       ▼                                                                          ▼
         ┌───────────────────────────┐                                              ┌───────────────────────────┐
         │   Finlenss Blog Platform  │                                              │     Advisor Portfolio     │
         │  (frontend-main - :5173)  │                                              │(frontend-portfolio - :5174)│
         └─────────────┬─────────────┘                                              └─────────────┬─────────────┘
                       │                                                                          │
                       ├────────────────────────────────────┬─────────────────────────────────────┤
                       │                                    │                                     │
                       ▼ Direct Supabase SDK                ▼ REST APIs / Fallback                ▼ Direct Supabase SDK
        ┌──────────────────────────────┐             ┌──────────────────────────────┐             ┌──────────────────────────────┐
        │     Supabase PostgreSQL      │             │      Express.js Backend      │             │       Supabase Storage       │
        │    (Cloud DB & Realtime)     │             │       (Node.js - :5000)      │             │   (Bucket: financial-models) │
        │  • articles (views, likes)   │             └──────────────┬───────────────┘             └──────────────────────────────┘
        │  • collaborations            │                            │
        │  • feedback                  │                            ▼
        │  • comments                  │                     ┌──────────────┐
        │  • certifications            │                     │ SQLite Local │
        │  • site_stats                │                     └──────────────┘
        └──────────────────────────────┘
```

---

## 🗄️ Database Tables & Schema

All required tables, constraints, and column specifications are documented in **[`new_supabase_tables.csv`](file:///d:/Tushar/financial-blog-platform/new_supabase_tables.csv)**:

| Table Name | Key Columns | Purpose |
| :--- | :--- | :--- |
| **`collaborations`** | `id`, `name`, `email`, `project_type`, `message`, `status`, `created_at` | Submissions from the *"Let's Collaborate"* form |
| **`feedback`** | `id`, `rating` (1–5), `suggestion`, `name`, `email`, `article_id`, `created_at` | Star ratings & suggestions from *"Article Feedback"* |
| **`comments`** | `id`, `article_id`, `author`, `content`, `created_at` | Live reader comments per article |
| **`articles`** | `id`, `title`, `content`, `excerpt`, `category`, `likes`, `views`, `is_trending` | Published insights with live engagement counters |
| **`certifications`** | `id`, `title`, `issuer`, `excel_url`, `cert_doc_url`, `status`, `created_at` | Verified licenses & downloadable financial models |
| **`categories`** | `id`, `name` (UNIQUE), `created_at` | Dynamic insight domain topics |
| **`site_stats`** | `key` (PRIMARY KEY), `value` | Visitor telemetry and click counters |

### 🚀 1-Click Supabase Setup
Run the SQL script in **[`supabase_setup.sql`](file:///d:/Tushar/financial-blog-platform/supabase_setup.sql)** inside your **Supabase Dashboard > SQL Editor** to create all tables and RLS public policies in one click.

---

## 🛠️ Tech Stack

* **Frontend Core**: React 18, Vite 6, React Router DOM 7
* **Database & Cloud**: Supabase (PostgreSQL), `@supabase/supabase-js`, Supabase Storage, Supabase Realtime
* **Styling & Icons**: TailwindCSS 3, Lucide React Icons
* **Animations**: Framer Motion, HTML5 Canvas 3D Graphics
* **Backend & Resilience**: Node.js, Express.js, SQLite3, Multer

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/ayushtete20/Mint.git
cd Mint
```

### 2. Install Dependencies
```bash
# Install Main Blog dependencies
cd frontend-main
npm install

# Install Portfolio dependencies
cd ../frontend-portfolio
npm install

# Install Backend dependencies
cd ../backend
npm install
```

---

## 🔑 Environment Variables Setup

Create a `.env` file in `frontend-main` and `frontend-portfolio`:

```env
# frontend-main/.env & frontend-portfolio/.env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key_here
VITE_API_URL=http://localhost:5000
VITE_ADMIN_PASSWORD=your_admin_password
```

---

## 🏃 Running the Application

Run the dev servers simultaneously:

```bash
# Terminal 1: Start Main Blog Platform (:5173)
cd frontend-main
npm run dev

# Terminal 2: Start Advisor Portfolio (:5174)
cd frontend-portfolio
npm run dev

# Terminal 3: Start Express API Backend Server (:5000)
cd backend
npm run dev
```

### Access URLs:
* 📰 **Main Blog**: [http://localhost:5173](http://localhost:5173)
* 🔐 **Admin Dashboard**: [http://localhost:5173/admin/dashboard](http://localhost:5173/admin/dashboard)
* ⚡ **Supabase Cloud Seeder**: [http://localhost:5173/admin/seed](http://localhost:5173/admin/seed)
* 💼 **Advisor Portfolio**: [http://localhost:5174](http://localhost:5174)
* 🚀 **Backend Express API**: [http://localhost:5000](http://localhost:5000)

---

## 🔒 Security & Verification

* **Dual-Database Resilience**: Direct Supabase SDK operations are paired with automatic fallbacks to the Express REST API and local browser caches.
* **Row-Level Security (RLS)**: Public read/write policies configured for anonymous collaborations, feedback submissions, and comments.
* **Build Verification**: Both `frontend-main` and `frontend-portfolio` compile cleanly with `npm run build` with **0 errors**.

---

## 📄 License & Author

* **Author**: Tushar Singh
* **Repository**: [Finlenss / Mint](https://github.com/ayushtete20/Mint)
* **License**: [MIT License](LICENSE)
