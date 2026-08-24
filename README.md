# 📈 Finlenss — Financial Blog, Valuation Models & Executive Collaboration Platform

[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg?logo=supabase&logoColor=white)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933.svg?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000.svg?logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57.svg?logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000.svg?logo=vercel&logoColor=white)](https://vercel.com/)
[![SEO Verified](https://img.shields.io/badge/Google_Search_Console-Compliant-4285F4.svg?logo=google&logoColor=white)](https://search.google.com/search-console)
[![License](https://img.shields.io/badge/License-MIT-22C55E.svg)](LICENSE)

---

## 🌐 Overview & Live Deployment

**Finlenss** is an institutional-grade **Financial Research Blog, 3-Statement DCF Valuation Models & Executive Advisory Platform** engineered with **React 18**, **Vite 6**, **Supabase (PostgreSQL, Storage, & Realtime)**, **TailwindCSS 3**, and a resilient **Express.js / SQLite** dual-database architecture.

Designed for financial analysts, institutional investors, and strategic executives, Finlenss seamlessly unifies high-yield macroeconomic research, equity valuation models, interactive financial engineering tools, an executive CFA advisory portfolio, and an enterprise administrative CMS.

* 🚀 **Production Deployment**: [https://finlenss-portfolio-aayush-6845.vercel.app](https://finlenss-portfolio-aayush-6845.vercel.app)
* 🐙 **GitHub Repository**: [https://github.com/ayushtete20/Finlenss](https://github.com/ayushtete20/Finlenss)
* 👨‍💼 **Author & Lead Analyst**: **Tushar Singh, CFA**

---

## 📑 Table of Contents

1. [🌟 Key Platform Capabilities](#-key-platform-capabilities)
   - [1. Main Research Platform (`frontend-main`)](#1-main-research-platform-frontend-main--port-5173)
   - [2. Realtime Engagement Engine](#2-realtime-engagement-engine-like-comment-share)
   - [3. Executive Advisor Portfolio (`frontend-portfolio`)](#3-executive-advisor-portfolio-frontend-portfolio--port-5174)
   - [4. Lead Generation & Collaboration CRM](#4-lead-generation--collaboration-crm)
   - [5. Reader Feedback & Rating System](#5-reader-feedback--rating-system)
   - [6. Enterprise Admin Management Suite](#6-enterprise-admin-management-suite-admindashboard)
   - [7. Centralized Interaction Telemetry & Audit Logger](#7-centralized-interaction-telemetry--audit-logger)
2. [🏗️ System Architecture & Dual-Database Resilience](#-system-architecture--dual-database-resilience)
3. [🗄️ Database Tables & Schema Specification](#️-database-tables--schema-specification)
4. [📁 Monorepo File Structure](#-monorepo-file-structure)
5. [🛠️ Tech Stack & Dependencies](#️-tech-stack--dependencies)
6. [🚀 Quick Start & Installation](#-quick-start--installation)
7. [🔑 Environment Variables Setup](#-environment-variables-setup)
8. [🏃 Running the Applications](#-running-the-applications)
9. [📡 REST API Endpoints Reference](#-rest-api-endpoints-reference)
10. [🔍 SEO, Indexing & Web Performance](#-seo-indexing--web-performance)
11. [🛡️ Security, Verification & Row-Level Security](#️-security-verification--row-level-security)
12. [🚢 Production Build & Deployment Guide](#-production-build--deployment-guide)
13. [📄 License & Author](#-license--author)

---

## 🌟 Key Platform Capabilities

### 📰 1. Main Research Platform (`frontend-main` — Port 5173)
* **Institutional Domain Filtering**: Real-time category filtering across *Financial Valuation*, *Macroeconomics*, *Stocks*, *Wealth Management*, *SaaS & Tech*, and *DeFi 3.0*.
* **Supabase Realtime Live Synchronization**: Instant updates across *Featured Selection*, *Pinned Trending*, and *Latest Insights* with a ⚡ *Live Updated* badge whenever articles are published or modified.
* **Curated Layout Structure**:
  * **Hero Spotlight Article**: Showcases lead macroeconomic research.
  * **Trending Insights Grid**: Displays pinned and highest-engaged research articles.
  * **Latest Insights**: Capped to display exactly the **6 latest research articles** to preserve sub-second render performance.
* **Instant Article Search**: Real-time client-side search across titles, content, categories, and author metadata.
* **Floating WhatsApp Advisory Button**: Fixed bottom-right quick-consultation widget with live status indicator.

---

### ❤️ 2. Realtime Engagement Engine (Like, Comment, Share)
Every research article view (`/post/:id`) includes an interactive action bar:
* **Interactive Like Toggle**: Instant visual state change (turns to a filled red heart with micro-bounce animation), updates the article's like counter in the Supabase database, and displays live counts.
* **Expandable Realtime Discussion & Comments**:
  * Readers can publish their analysis and commentary directly.
  * Powered by **Supabase Realtime** — newly submitted comments immediately broadcast across all connected clients with zero page reloads.
* **Instant URL Share**: Programmatically copies the canonical article URL to the clipboard and triggers a floating `"Link Copied!"` toast notification.

---

### 💼 3. Executive Advisor Portfolio (`frontend-portfolio` — Port 5174)
* **Hardware-Accelerated 3D Financial Canvas (`FinancialBackground.jsx`)**: Real-time HTML5 3D candlestick and financial wave chart background animation.
* **Executive Experience & Education Timeline**: Detailed career progression covering CFA designation, institutional financial advisory, equity research, and financial modeling.
* **Verified Credentials & Certifications Grid**:
  * Dynamic Supabase data fetching for accredited licenses and certifications.
  * Direct downloads for **Dabur 3-Statement Financial Models (.xlsx)** and official certification documents (.pdf).
* **Solutions Accordion & Advisory Grid**: Comprehensive breakdown of institutional services, valuation modeling, DCF forecasts, and strategic asset allocation.

---

### 🤝 4. Lead Generation & Collaboration CRM
* Centered executive partnership intake form embedded in both the portfolio and main platform.
* **Structured Input Scope**: Full Name, Business Email, Project Type dropdown (*Financial Modeling & Valuation*, *Equity Research & DCF*, *Strategic Advisory*, *Data Analytics*, *Full-Stack Web Apps*, *Other*), and detailed Message scope.
* **Direct Database Sync**: Inserts submissions directly into the Supabase **`collaborations`** table with automatic email/status categorization for admin review.

---

### ⭐ 5. Reader Feedback & Rating System
* Interactive 1–5 star rating system with hover glow and click selection powered by `lucide-react` `Star` icons.
* Dedicated suggestions textarea for readers to recommend upcoming valuation models, macroeconomic topics, or analytical critiques.
* Inserts ratings and reviews directly into the Supabase **`feedback`** table.

---

### 👑 6. Enterprise Admin Management Suite (`/admin/dashboard`)
* **Unified Administrative CMS Dashboard**:
  * 📝 **Articles Manager**: Full rich editor (Drafts, Published, Pinned Trending, Supabase Storage Thumbnail Uploader, Rich Markdown/HTML formatting, Live Likes, Views, and Comments stats).
  * 💬 **Comments Moderation Tab**: Live comment tracking per article with instant deletion and content moderation controls.
  * 🤝 **Collaboration CRM Tab**: Review inbound consultation requests with search, status controls (`Pending`, `In Review`, `Contacted`, `Completed`), and direct client mailto actions.
  * ⭐ **Reader Feedback Tab**: Visual 5-star ratings breakdown, calculated average review scores, score distribution charts, and analytical critique review.
  * 🎓 **Licenses & Certifications Manager**: Add accredited credentials, link case study articles, and attach downloadable Excel models or Certificate documents.
  * ⚡ **Supabase Cloud Seeder (`/admin/seed`)**: One-click cloud seeding for the **Dabur 3-Statement Financial Model** and portfolio credentials.

---

### 📊 7. Centralized Interaction Telemetry & Audit Logger
* **Engineered in `AuditLogger.js`**: Captures, formats, and tracks state and setting changes across the entire Finlenss ecosystem.
* **In-Memory Circular Buffer**: Stores up to 200 sequential user actions and state transitions.
* **Rich Console Visualization**: Renders collapsible, styled console tables in DevTools displaying timestamps, actions, previous states, new states, routes, and component metadata.
* **Data Export Hook**: Built-in `exportAuditLogs()` to download session telemetry as JSON for QA testing, and `flushLogsToBackend()` for API synchronization.

---

## 🏗️ System Architecture & Dual-Database Resilience

```
                                ┌─────────────────────────────────────────────────────────┐
                                │                     CLIENT LAYER                        │
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

* **Primary Cloud Layer**: Direct Supabase SDK operations with PostgreSQL, Realtime WebSocket listeners, and Storage Buckets for sub-second latency.
* **Secondary / Offline Resilience**: Node.js / Express.js REST API with a local SQLite database (`database.sqlite`) ensuring high availability and seamless fallback during network disruption.

---

## 🗄️ Database Tables & Schema Specification

All tables, constraints, and column specifications are documented in **[`new_supabase_tables.csv`](file:///d:/Tushar/financial-blog-platform/new_supabase_tables.csv)** and configured via **[`supabase_setup.sql`](file:///d:/Tushar/financial-blog-platform/supabase_setup.sql)**:

| Table Name | Key Columns | Description & Purpose |
| :--- | :--- | :--- |
| **`articles`** | `id`, `title`, `content`, `excerpt`, `category`, `thumbnail_url`, `author`, `read_time`, `views`, `likes`, `is_trending`, `created_at` | Published financial insights and research papers with live engagement metrics |
| **`collaborations`** | `id`, `name`, `email`, `project_type`, `message`, `status`, `created_at` | Inbound executive consultation and advisory requests |
| **`feedback`** | `id`, `rating` (1–5), `suggestion`, `name`, `email`, `article_id`, `created_at` | Reader feedback ratings and quantitative model critiques |
| **`comments`** | `id`, `article_id`, `author`, `content`, `created_at` | Real-time discussion comments per individual research article |
| **`certifications`** | `id`, `title`, `issuer`, `dates`, `icon`, `article_id`, `excel_url`, `cert_doc_url`, `status`, `created_at` | Verified professional licenses, credentials, and downloadable financial models |
| **`categories`** | `id`, `name` (UNIQUE), `created_at` | Dynamic financial insight domain categories |
| **`site_stats`** | `key` (PRIMARY KEY), `value` | Platform telemetry, visitor counts, and global click metrics |

### 🚀 1-Click Supabase Database Setup
Execute the SQL script in **[`supabase_setup.sql`](file:///d:/Tushar/financial-blog-platform/supabase_setup.sql)** within your **Supabase Dashboard > SQL Editor** to create all tables, indexes, and Row-Level Security (RLS) policies in one click.

---

## 📁 Monorepo File Structure

```
financial-blog-platform/
├── backend/                             # Express.js REST API & Local SQLite Database
│   ├── src/
│   │   ├── config/                      # Database connection and table initializers (db.js)
│   │   ├── controllers/                 # Route controllers (articles, auth, feedback, etc.)
│   │   ├── middleware/                  # Rate limiters, authentication, error handlers
│   │   ├── routes/                      # Express route definitions
│   │   └── server.js                    # Express server entry point (:5000)
│   ├── database.sqlite                  # Local SQLite database
│   ├── seed_dabur.js                    # Dabur 3-Statement financial model seeder
│   └── package.json
│
├── frontend-main/                       # Main Financial Blog Platform & Admin Suite (:5173)
│   ├── public/                          # Static assets, sitemap.xml, robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── pages/
│   │   │   │   ├── Public/              # Home.jsx, Post.jsx
│   │   │   │   └── Admin/               # Dashboard.jsx, Editor.jsx, Login.jsx, AdminSeedPanel.jsx
│   │   │   └── UI/                      # Header, Footer, FinancialBackground, WhatsAppFloatingBtn
│   │   ├── services/                    # Supabase client & REST API service abstractions
│   │   ├── utils/                       # AuditLogger.js (telemetry and state tracking)
│   │   ├── App.jsx                      # React Router route definitions & lazy loading
│   │   └── main.jsx
│   ├── tailwind.config.js               # Seafoam & Navy theme tokens and typography
│   └── package.json
│
├── frontend-portfolio/                  # Executive CFA Portfolio (:5174)
│   ├── public/                          # Headshots, resume documents, model assets
│   ├── src/
│   │   ├── components/                  # Hero, ExperienceEducation, Certifications, Contact,
│   │   │                                # Collaboration, ArticleFeedback, FinancialBackground
│   │   ├── pages/                       # Index.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
│
├── scripts/                             # Automation and verification utilities
│   ├── check-backlinks.js               # Automated web mention & backlink scanner
│   └── test-google-inspection.js        # Google Search Console compliance tester
│
├── generate_sitemap.js                  # Dynamic XML Sitemap generator for SEO
├── supabase_setup.sql                   # Complete Supabase PostgreSQL schema & RLS policies
├── vercel.json                          # Vercel deployment configuration & security headers
├── package.json                         # Root monorepo workspace scripts
└── README.md
```

---

## 🛠️ Tech Stack & Dependencies

| Area | Technologies |
| :--- | :--- |
| **Frontend Frameworks** | React 18.3, Vite 6.0, React Router DOM 7.1 |
| **Styling & Icons** | TailwindCSS 3.4, PostCSS, Lucide React Icons (`lucide-react`) |
| **Animations & Graphics** | Framer Motion 13.0, HTML5 Canvas 3D Graphics Engine |
| **Cloud Database & Storage**| Supabase (`@supabase/supabase-js`), PostgreSQL, Supabase Realtime, Supabase Storage |
| **Local API & Fallback** | Node.js 18+, Express.js 4.21, SQLite3, Multer (file uploads) |
| **Data Processing & Models**| SheetJS (`xlsx`) for parsing & downloading Excel financial models |
| **SEO & Telemetry** | Dynamic XML Sitemaps, JSON-LD Schema, Google Search Console Verification, Centralized Audit Logger |
| **Deployment & Security** | Vercel Edge Network, HTTP Security Headers (HSTS, CSP, X-Frame-Options) |

---

## 🚀 Quick Start & Installation

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **Git**: Installed and configured

### 1. Clone the Repository
```bash
git clone https://github.com/ayushtete20/Finlenss.git
cd Finlenss
```

### 2. Install All Dependencies
Install dependencies across root and all sub-packages:

```bash
# 1. Install root package dependencies (optional helper scripts)
npm install

# 2. Install Main Blog dependencies
cd frontend-main
npm install

# 3. Install Portfolio dependencies
cd ../frontend-portfolio
npm install

# 4. Install Backend dependencies
cd ../backend
npm install

# 5. Return to project root
cd ..
```

---

## 🔑 Environment Variables Setup

Create a `.env` file in **`frontend-main/`**, **`frontend-portfolio/`**, and **`backend/`**:

### `frontend-main/.env` & `frontend-portfolio/.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
VITE_API_URL=http://localhost:5000
VITE_ADMIN_PASSWORD=your_secure_admin_password
```

### `backend/.env`:
```env
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_PASSWORD=your_secure_admin_password
```

---

## 🏃 Running the Applications

You can start the services simultaneously using the root monorepo scripts or individual terminals:

### Option A: From Root Directory
```bash
# Start Main Blog Platform (:5173)
npm run dev

# Start Advisor Portfolio (:5174)
npm run dev:portfolio

# Start Express Backend API Server (:5000)
npm run dev:backend
```

### Option B: Individual Terminals
```bash
# Terminal 1: Main Blog Platform (:5173)
cd frontend-main && npm run dev

# Terminal 2: Advisor Portfolio (:5174)
cd frontend-portfolio && npm run dev

# Terminal 3: Express API Server (:5000)
cd backend && npm run dev
```

### 📍 Local Access URLs:
* 📰 **Main Blog Platform**: [http://localhost:5173](http://localhost:5173)
* 🔐 **Admin Dashboard**: [http://localhost:5173/admin/dashboard](http://localhost:5173/admin/dashboard)
* ⚡ **Supabase Cloud Seeder**: [http://localhost:5173/admin/seed](http://localhost:5173/admin/seed)
* 💼 **Executive Portfolio**: [http://localhost:5174](http://localhost:5174)
* 🚀 **Backend REST API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📡 REST API Endpoints Reference

The Express.js backend provides complete CRUD support with rate limiting and local SQLite fallbacks:

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/blogs` | Retrieve all published articles | Public |
| `GET` | `/api/blogs/:id` | Retrieve single article by ID & increment views | Public |
| `POST` | `/api/blogs` | Create a new research article | Admin |
| `PUT` | `/api/blogs/:id` | Update an existing article | Admin |
| `DELETE` | `/api/blogs/:id` | Delete an article | Admin |
| `POST` | `/api/blogs/:id/like` | Increment like count for an article | Public |
| `POST` | `/api/collaborations` | Submit partnership / consultation request | Public |
| `GET` | `/api/collaborations` | Retrieve all collaboration requests | Admin |
| `PATCH`| `/api/collaborations/:id/status` | Update collaboration status | Admin |
| `POST` | `/api/feedback` | Submit 1–5 star rating & feedback review | Public |
| `GET` | `/api/feedback` | Retrieve all reader feedback entries | Admin |
| `GET` | `/api/certifications` | Retrieve verified licenses and models | Public |
| `POST` | `/api/certifications` | Add new certification or financial model | Admin |
| `POST` | `/api/upload` | Upload Excel models (.xlsx) or Certificate PDFs | Admin |
| `GET` | `/api/sitemap.xml` | Dynamic XML sitemap endpoint | Public |
| `GET` | `/api/health` | Service uptime and status check | Public |

---

## 🔍 SEO, Indexing & Web Performance

Finlenss is fully optimized for top-ranking search engine visibility and crawler compliance:

* **Google Search Console & Bing Webmaster Verification**:
  * Configured with `google-site-verification` and `msvalidate.01` tags in `index.html`.
  * Explicit `robots` directives: `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`.
* **Dynamic Canonical URLs**: Automatically generates canonical URLs for both index and dynamic `/post/:id` articles.
* **Structured Data (JSON-LD)**: Schema.org `Article` structured data dynamically populated with author, dates, thumbnails, and headlines.
* **Automated XML Sitemap Generator**:
  ```bash
  npm run sitemap
  ```
  Generates an updated `sitemap.xml` in `frontend-main/public/sitemap.xml`.
* **Backlink & Mention Scanner**:
  ```bash
  npm run check:backlinks
  ```
  Scans and reports external mentions across major financial and fintech domains.
* **Sub-Second Performance**:
  * Route-level code splitting via `React.lazy` and `Suspense`.
  * Hardware-accelerated canvas animations throttled to 60fps.
  * Optimized Google Fonts preloading for `Inter` and `Playfair Display`.

---

## 🛡️ Security, Verification & Row-Level Security

* **Dual-Database Resilience**: Direct Supabase PostgreSQL transactions are coupled with automatic fallback to local SQLite stores upon any connectivity disruption.
* **Row-Level Security (RLS)**:
  * Public read/write policies configured for anonymous engagement (comments, feedback, collaboration leads, and view/like increments).
  * Storage bucket policies for public downloads of financial models and certification documents.
* **HTTP Security Headers (`vercel.json`)**:
  * `X-Frame-Options: DENY`
  * `X-Content-Type-Options: nosniff`
  * `Referrer-Policy: strict-origin-when-cross-origin`
  * `Permissions-Policy: camera=(), microphone=(), geolocation=()`
* **Build Integrity**: Both `frontend-main` and `frontend-portfolio` compile cleanly with `npm run build` with **0 errors**.

---

## 🚢 Production Build & Deployment Guide

### Building for Production
```bash
# Build Main Blog & Admin Platform
npm run build

# Build Executive Portfolio
npm run build:portfolio
```

### Vercel Deployment
The platform includes a production-ready **`vercel.json`** configured with SPA rewrites, caching rules, and security headers:

1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete Finlenss production build"
   git push origin main
   ```
2. Connect the repository in your **Vercel Dashboard**.
3. Set the Root Directory to `frontend-main` (or deploy `frontend-portfolio` as a sub-domain).
4. Add your Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`, `VITE_ADMIN_PASSWORD`).
5. Deploy! 🚀

---

## 📄 License & Author

* **Lead Analyst & Author**: **Tushar Singh, CFA**
* **Repository**: [https://github.com/ayushtete20/Finlenss](https://github.com/ayushtete20/Finlenss)
* **License**: [MIT License](LICENSE) — free to use, modify, and distribute for personal and institutional projects.

---

<div align="center">
  <sub>Built with precision for institutional finance, equity valuation, and macroeconomic intelligence.</sub>
</div>
