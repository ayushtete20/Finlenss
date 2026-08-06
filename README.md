# 📈 Finlenss. Financial Blog & Executive Advisory Platform

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg?logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An institutional-grade **Financial Insights Blog & Legal Advisory Portfolio** web ecosystem powered by **React (Vite)**, **Supabase (PostgreSQL, Storage, & Realtime)**, **TailwindCSS**, and **HTML5 3D Canvas** chart graphics.

---

## 🌟 Key Features

### 📰 1. Main Blog Platform (`frontend-main` - Port 5173)
* **Institutional Market Insights**: Real-time category filtering across *Stocks*, *Macroeconomics*, *Cryptocurrency*, *Wealth Management*, and *DeFi 3.0*.
* **Realtime Live Refresh**: Powered by **Supabase Realtime** — all sections (Featured, Trending, and Latest Insights) auto-refresh instantly when new articles are created, updated, or deleted. Shows a ⚡ *Live Updated* badge on updates.
* **Capped Latest Insights**: Capped to display exactly the **6 latest blog posts** so the UI remains clean and premium, automatically rolling over when new posts are published.
* **Owner & Admin Management Portal (`/admin/dashboard`)**:
  * **Article Operations**: Publish, edit, delete markdown articles, manage dynamic categories, and toggle trending pins.
  * **Consultation Lead Reservations**: Manage prospective client advisory requests (`Pending`, `Contacted`, `Completed`).
  * **Licenses & Certifications Manager**: Add accredited credentials, link case study articles, and attach Excel financial models or PDF certificates.
* **Direct Server Asset Upload**: File upload system prioritizes direct upload to the local Express backend server with instant image previews inside the admin upload modal.
* **Supabase Cloud Initializer (`/admin/seed`)**: Protected database initialization panel with one-click cloud seeding for the **Dabur 3-Statement Financial Model**.

### 💼 2. Legal & Financial Advisor Portfolio (`frontend-portfolio` - Port 5174)
* **3D Financial Canvas (`FinancialBackground.jsx`)**: Real-time HTML5 3D candlestick and financial wave chart background animation.
* **Verified Credentials & Case Studies**: Accredited certifications grid featuring dynamic Supabase data fetching, displaying **interactive certificate document previews** directly on the cards and details modal.
* **Supabase Storage Download Engine**: Asynchronous public URL generator for downloading 3-Statement Excel models (`Dabur_Model.xlsx`).
* **Executive Consultation Modal**: Online advisory reservation form submitting leads directly to Supabase PostgreSQL.

### 💬 3. Integrated WhatsApp Chat Widget (Both Platforms)
* **Interactive Floating Chat Button**: Fixed in the bottom-right corner of both the Blog and Portfolio platforms.
* **Live Hover Options**: Hovering reveals a sleek floating status card ("Tushar Singh - WhatsApp Advisory Group") with a direct action button to join the community, along with a clean "Chat on WhatsApp" tooltip pill.
* **Smooth Animations**: Animated with subtle scaling hover effects (`hover:scale-110`) and ambient ping pulses.

---

## 🏗️ System Architecture

```
                               ┌─────────────────────────────────────────────────────────┐
                               │                      CLIENT LAYER                       │
                               └────────────────────────────┬────────────────────────────┘
                                                            │
                      ┌─────────────────────────────────────┴─────────────────────────────────────┐
                      ▼                                                                           ▼
        ┌───────────────────────────┐                                               ┌───────────────────────────┐
        │   Finlenss Blog Platform  │                                               │     Advisor Portfolio     │
        │  (frontend-main - :5173)   │                                               │(frontend-portfolio - :5174)│
        └─────────────┬─────────────┘                                               └─────────────┬─────────────┘
                      │                                                                           │
                      ├─────────────────────────────────────┬─────────────────────────────────────┤
                      │                                     │                                     │
                      ▼ Direct Supabase SDK                 ▼ REST APIs / Fallback                ▼ Direct Supabase SDK
       ┌──────────────────────────────┐              ┌──────────────────────────────┐              ┌──────────────────────────────┐
       │     Supabase PostgreSQL      │              │      Express.js Backend      │              │       Supabase Storage       │
       │    (Cloud DB & Realtime)     │              │       (Node.js - :5000)      │              │   (Bucket: financial-models) │
       └──────────────────────────────┘              └──────────────┬───────────────┘              └──────────────────────────────┘
                                                                    │
                                                                    ▼
                                                             ┌──────────────┐
                                                             │ SQLite Local │
                                                             └──────────────┘
```

---

## 🛠️ Tech Stack

* **Frontend Core**: React 18, Vite 6, React Router DOM 7
* **Database & Storage**: Supabase (PostgreSQL), `@supabase/supabase-js`, Supabase Storage Buckets
* **Styling & Icons**: TailwindCSS 3 (Dark `#0A0F1D`, Card `#111827`), Lucide React
* **Typography**: `Plus Jakarta Sans` (Body text), `Outfit` (Display headings)
* **Animations**: Framer Motion 12, HTML5 Canvas 3D Graphics
* **Backend (Fallback & Upload)**: Node.js, Express.js 4, SQLite3, Multer, JWT

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

Create a `.env` file in both `frontend-main` and `frontend-portfolio` directories:

```env
# frontend-main/.env & frontend-portfolio/.env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key_here
```

---

## 🏃 Running the Application

Run the dev servers simultaneously from separate terminal windows:

```bash
# Terminal 1: Start Main Blog Platform (:5173)
cd frontend-main
npm run dev

# Terminal 2: Start Advisor Portfolio (:5174)
cd frontend-portfolio
npm run dev

# Terminal 3: Start Express API Server & File Uploader (:5000)
cd backend
npm run dev
```

### Access Ports:
* 📰 **Main Blog**: [http://localhost:5173](http://localhost:5173)
* 🔐 **Admin Portal**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
* ⚡ **Supabase Seed Tool**: [http://localhost:5173/admin/seed](http://localhost:5173/admin/seed)
* 💼 **Advisor Portfolio**: [http://localhost:5174](http://localhost:5174)
* 🚀 **Backend Express API**: [http://localhost:5000](http://localhost:5000)

---

## ⚡ Supabase Data Initialization

1. Navigate to the protected seed panel: **[http://localhost:5173/admin/seed](http://localhost:5173/admin/seed)**
2. Click **"Initialize Dabur Database"** to automatically push the 3-Statement Financial Model JSON and certification data to your Supabase PostgreSQL cloud database.

---

## 📂 Project Structure

```
.
├── backend/                              # Node.js Express REST API server
│   ├── src/
│   │   ├── config/db.js                  # SQLite fallback database initialization
│   │   ├── controllers/                  # Articles, auth, credentials, & lead controllers
│   │   └── routes/                       # Express route definitions
│   └── uploads/                          # Local asset uploads folder
│
├── frontend-main/                        # Main Blog & Insights Web App (:5173)
│   ├── .env                              # Supabase project URL & ANON key
│   ├── src/
│   │   ├── components/
│   │   │   ├── pages/Admin/              # AdminSeedPanel, Dashboard, Editor, Login
│   │   │   ├── pages/Public/             # Home, Post detail view
│   │   │   └── UI/                       # ClayCard, ClayButton, Header, Footer
│   │   ├── services/api.js               # Supabase direct queries & API service wrapper
│   │   └── utils/supabaseClient.js       # Central Supabase SDK client utility
│   └── tailwind.config.js                # Theme colors (#0A0F1D, #111827) & fonts
│
└── frontend-portfolio/                   # Advisor Portfolio App (:5174)
    ├── .env                              # Supabase project URL & ANON key
    └── src/
        ├── components/                   # Certifications, Contact, ShowcaseGrid, Hero
        └── utils/supabaseClient.js       # Central Supabase SDK client utility
```

---

## 🔒 Security & Best Practices

* **Master Authorization Bypass**: Supports both local dev token and direct Express admin verification for seamless upload operations.
* **MIME & Extension Security**: File uploader validates allowed document formats (`.xlsx`, `.xls`, `.csv`, `.pdf`, `.png`, `.jpg`, `.docx`). Executables are strictly rejected.
* **Private Secrets**: Real Supabase keys `.env` files are excluded from Git via `.gitignore`.

---

## 📄 License & Author

* **Author**: Tushar Singh
* **License**: [MIT License](LICENSE)
