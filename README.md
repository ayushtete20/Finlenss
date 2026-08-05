# 📈 Financial Insights Blog Platform & Advisor Portfolio

A full-stack, monorepo financial blog platform featuring a centralized Express.js REST API with SQLite database, a main blog application with an Admin Management Dashboard built with React, Vite, Tailwind CSS, and Seafoam & Navy Claymorphic design tokens, and a dedicated subdomain portfolio application.

---

## 🏗️ Monorepo Structure

```
financial-blog-platform/
├── backend/                  # Express.js REST API & SQLite Database
│   ├── database.sqlite       # Local persistent SQLite database
│   ├── src/
│   │   ├── config/           # Database configuration & seeding (db.js)
│   │   ├── controllers/      # Article & Auth controllers
│   │   ├── middleware/       # JWT admin authentication guard
│   │   ├── routes/           # REST endpoints (/api/blogs, /api/admin)
│   │   └── server.js         # Main Express entry point (Port 5000)
│   └── package.json
│
├── frontend-main/            # React + Vite + Tailwind CSS (Main Blog & Admin)
│   ├── .superdesign/         # Design tokens & draft assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── UI/           # ClayCard, ClayButton, Header, Footer
│   │   │   └── pages/
│   │   │       ├── Public/   # Home.jsx (Staggered masonry grid), Post.jsx
│   │   │       └── Admin/    # Login.jsx, Dashboard.jsx, Editor.jsx
│   │   ├── services/         # API service layer (api.js)
│   │   ├── App.jsx           # React Router DOM configuration
│   │   └── main.jsx
│   ├── tailwind.config.js    # Seafoam, Navy, and Claymorphic shadow tokens
│   └── package.json
│
└── frontend-portfolio/       # React + Vite + Tailwind CSS (Subdomain Portfolio)
    ├── src/
    │   ├── components/       # Hero, Services, Stats, Contact
    │   ├── pages/            # Index.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── tailwind.config.js
    └── package.json
```

---

## ⚡ Quick Start Guide

### 1. Start the Backend API Server
```bash
cd backend
npm install
npm start
```
> Server will listen on **`http://localhost:5000`** and auto-seed initial financial articles into `database.sqlite`.

### 2. Start the Main Blog & Admin Dashboard (`frontend-main`)
```bash
cd frontend-main
npm install
npm run dev
```
> Application will run on **`http://localhost:5173`**.

### 3. Start the Portfolio Subdomain (`frontend-portfolio`)
```bash
cd frontend-portfolio
npm install
npm run dev
```
> Portfolio site will run on **`http://localhost:5174`**.

---

## 🔑 Admin Portal Access

- **Login URL**: `http://localhost:5173/admin/login`
- **Default Password**: `admin123`

### Features:
- **Authentication**: Password login issuing JWT session token.
- **Operations Dashboard**: Data table displaying all articles, search filter, reader metrics, and deletion confirmation modal.
- **Content Editor**: Form interface to publish or edit articles, category selector, thumbnail image URL input with presets, and tabbed **Live Markdown Preview**.

---

## 🎨 Theme & Aesthetic Tokens

- **Seafoam Accent Palette**: `#2DD4BF`, `#14B8A6`, `#0D9488`, `#E6FFFA`
- **Deep Navy Palette**: `#070A13`, `#0B132B`, `#0F172A`, `#1E293B`
- **Claymorphic 3D Elevation**: Custom dual soft box-shadows (`shadow-clay`, `shadow-clay-seafoam`, `clay-card-base`, `clay-button-base`).
