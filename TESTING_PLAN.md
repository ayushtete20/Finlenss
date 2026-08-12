# Comprehensive Testing Plan & QA Strategy
**Project:** Finlenss Financial & Institutional Advisory Platform  
**Architecture:** React (Vite) Frontend + Node.js/Express Backend + Supabase Realtime / PostgreSQL  
**Version:** 1.0.0 Production  

---

## 1. Overview & Testing Strategy

This document provides an exhaustive, step-by-step test execution manual for the entire Finlenss platform. It covers functional testing, edge cases, mobile responsiveness, state persistence, error boundaries, and integration flows across all public and administrative modules.

### Severity & Priority Definitions
- **Critical (P0):** Application crash, broken core business funnel (e.g. consultation booking fails, articles fail to render, security breaches).
- **High (P1):** Major feature malfunction without a workaround (e.g. search filter returns no results, admin editor cannot publish).
- **Medium (P2):** Minor functional bug or styling anomaly with a viable workaround (e.g. accordion transition glitch, delay in realtime badge).
- **Low (P3):** Cosmetic issues, typo, minor spacing misalignment.

---

## 2. Test Execution Matrix by Feature Area

```
+-------------------------------------------------------------------------+
|                        FINLENSS TEST SUITE                              |
+-------------------------------------------------------------------------+
| 1. Navigation & Routing (Public, Admin, Fallback)                       |
| 2. Header, Sticky Bar & Mobile Responsive Navigation                    |
| 3. Market Intelligence Search & Category Filtering                     |
| 4. Interactive Portfolio Components (Hero, Accordion, Skills, Awards)   |
| 5. Article Detail & Model Download Engine                               |
| 6. Reader Community Feedback & Star Rating System                       |
| 7. Consultation Booking & Client Lead Intake                            |
| 8. Admin Authentication & Protected Route Guards                        |
| 9. Admin Dashboard, Post Editor & Realtime Database Seed                |
| 10. WhatsApp Floating Assistant & External Link Verifications           |
| 11. Cross-Browser, Cache-Busting & Mobile Viewport QA                   |
+-------------------------------------------------------------------------+
```

---

## Section 1: Navigation & Routing

### TC-NAV-01: Public Route Accessibility
- **Feature:** Client-Side Navigation & Deep Linking
- **Preconditions:** Server is running, user is not authenticated.
- **Steps to Reproduce:**
  1. Open browser and navigate to `http://localhost:5173/` (Home).
  2. Navigate directly via URL bar to `/post/1` or any valid article slug/ID.
  3. Navigate to an invalid route like `/non-existent-page-xyz`.
- **Expected Behavior:**
  - `GET /` loads the Home page with Hero, Insights, Portfolio, and Consultation sections.
  - `GET /post/:id` renders the specific article detail view.
  - `GET /non-existent-page-xyz` triggers client-side redirect fallback (`Navigate to="/" replace`) returning smoothly to Home without a 404 crash.
- **Pass/Fail Criteria:** All valid routes resolve; invalid routes redirect seamlessly.

---

### TC-NAV-02: Scroll-to-Top on Route Change
- **Feature:** Seamless Reading Scroll Position Reset
- **Preconditions:** User is on the Home page and scrolls to the bottom (e.g., Footer).
- **Steps to Reproduce:**
  1. Scroll down to the Footer on the Home page.
  2. Click any article card or link leading to `/post/:id`.
  3. Observe the viewport scroll position.
- **Expected Behavior:**
  - Viewport automatically smoothly scrolls to coordinate `(0, 0)` at the very top of the newly loaded page.
- **Pass/Fail Criteria:** Top of the post is visible immediately upon navigation.

---

## Section 2: Header, Sticky Bar & Mobile Responsive Navigation

### TC-HDR-01: Desktop Sticky Header & Brand Anchor
- **Feature:** Persistent Navigation Bar with Glassmorphic Backdrop
- **Preconditions:** Desktop viewport (> 1024px width).
- **Steps to Reproduce:**
  1. Scroll down through the page.
  2. Click on the "Finlenss." brand logo with the TrendingUp icon.
  3. Click navigation links: "Insights", "Markets", "Research", "Solutions", "Collaboration".
- **Expected Behavior:**
  - Header stays pinned to the top of the viewport with a frosted glass backdrop (`backdrop-blur-md`).
  - Clicking the brand logo smoothly scrolls the viewport back to the top of the page.
  - Section links smoothly scroll to their respective IDs (`#markets`, `#research`, `#solutions`, `#collaboration`, `#contact`).
- **Pass/Fail Criteria:** All anchors scroll to correct sections without page jump or layout shift.

---

### TC-HDR-02: Mobile Drawer Menu Toggle & Touch Targets
- **Feature:** Responsive Hamburger Menu for Mobile Viewports
- **Preconditions:** Mobile viewport (< 768px width) or Mobile Device.
- **Steps to Reproduce:**
  1. Open website on a mobile device or responsive emulator (375px - 414px width).
  2. Verify desktop navigation links are hidden.
  3. Tap the Hamburger Menu icon (`Menu`).
  4. Tap a navigation link (e.g., "Solutions").
  5. Tap the Close icon (`X`).
- **Expected Behavior:**
  - Hamburger button opens an animated slide-down menu.
  - Tapping a navigation link scrolls to the section and automatically closes the mobile drawer.
  - Tapping the `X` button closes the drawer.
- **Pass/Fail Criteria:** Mobile drawer opens/closes fluidly without horizontal scrollbars.

---

## Section 3: Search, Categorization & Filtering Engine

### TC-SRC-01: Real-Time Keyword Search
- **Feature:** Instant Article Filtering by Title, Excerpt, and Author
- **Preconditions:** Multiple articles loaded in database (e.g. Dabur Valuation, Crypto, Macro).
- **Steps to Reproduce:**
  1. In the search input field in the Header or Hero section, type `"Dabur"`.
  2. Clear search input and type `"Cryptocurrency"`.
  3. Type a non-existent string like `"xyz999nonsense"`.
- **Expected Behavior:**
  - Typing `"Dabur"` filters articles in real-time, displaying only cards matching the query.
  - Typing `"Cryptocurrency"` displays crypto-related articles.
  - Typing non-matching query displays an empty-state message with a clear search prompt.
- **Pass/Fail Criteria:** Instant debounce filtering without unhandled errors.

---

### TC-SRC-02: Category Pill Filter Selection
- **Feature:** Category Filtering (All, Macroeconomics, Valuation, Cryptoeconomics, Stocks)
- **Preconditions:** Articles with distinct categories are seeded.
- **Steps to Reproduce:**
  1. On the Latest Insights section, note the "All" pill is selected by default.
  2. Click on `"Macroeconomics"`.
  3. Click on `"Valuation"`.
  4. Click back to `"All"`.
- **Expected Behavior:**
  - Active pill receives active navy styling (`bg-[#0D47A1] text-white`).
  - The articles list re-filters immediately to match the selected category.
  - "Showing X of Y" counter badge updates accurately.
- **Pass/Fail Criteria:** Filtered articles match category; state changes are recorded.

---

## Section 4: Interactive Portfolio Components

### TC-PORT-01: Solutions Accordion Single-Item Expansion
- **Feature:** Collapsible Advisory Pillars with Animated Framer Motion Height
- **Preconditions:** Navigate to `#solutions` section.
- **Steps to Reproduce:**
  1. Observe Item 01 ("Digital & Financial Strategy") is open by default.
  2. Click on Item 02 ("Corporate Brand & Wealth Development").
  3. Click on Item 02 again.
- **Expected Behavior:**
  - Clicking Item 02 expands Item 02 with smooth height and opacity transitions while collapsing Item 01.
  - Clicking an already open item collapses it, leaving none open.
  - Pill badges (e.g., Strategy, Analytics, Financial Modeling) remain crisp and legible.
- **Pass/Fail Criteria:** Only the selected accordion card expands; animations are smooth (60fps).

---

### TC-PORT-02: Skills & Competencies Grid
- **Feature:** Dynamic Category Chips & Professional Tooling
- **Preconditions:** Navigate to `#skills` section.
- **Steps to Reproduce:**
  1. Hover over individual competency badges (e.g., "Financial Modeling", "Power BI", "Corporate Finance").
- **Expected Behavior:**
  - Badges render with institutional dark blue and subtle glassmorphic borders.
  - Hover states trigger subtle lift and color glow.
- **Pass/Fail Criteria:** Zero overflow or text wrapping artifacts on small screens.

---

## Section 5: Article Detail & Interactive Reader Features

### TC-POST-01: Full Article Rendering & Metadata Header
- **Feature:** Post View with Reading Time, Views Counter & Author Badge
- **Preconditions:** Valid article exists at `/post/:id`.
- **Steps to Reproduce:**
  1. Click an article card from Home.
  2. Verify the URL is `/post/:id`.
  3. Check article title, author avatar, read time, formatted published date, view counter.
  4. Check markdown/HTML body formatting (tables, bullet points, headers).
- **Expected Behavior:**
  - Full article content renders with clear typography and styling.
  - View count increments on load via backend `trackVisit()` / API.
- **Pass/Fail Criteria:** Full article renders without layout breaks or missing assets.

---

### TC-POST-02: Excel Financial Model Download
- **Feature:** Downloadable Financial Deliverables (e.g. `Dabur_India_3_Statement_Financial_Model.xlsx`)
- **Preconditions:** Article with attached financial model is open.
- **Steps to Reproduce:**
  1. Locate the "Download Complete 3-Statement Financial Model (.xlsx)" button.
  2. Click the download button.
  3. Open the downloaded file in Microsoft Excel or Google Sheets.
- **Expected Behavior:**
  - Browser prompts file download for `Dabur_India_3_Statement_Financial_Model.xlsx`.
  - Excel file opens cleanly with valid financial statements (Income Statement, Balance Sheet, Cash Flow, DCF).
- **Pass/Fail Criteria:** File downloads successfully without corruption.

---

## Section 6: Reader Community Feedback & Star Rating System

### TC-FDBK-01: Interactive Star Rating & Description Feedback
- **Feature:** 5-Star Rating Widget with Dynamic Quality Labels
- **Preconditions:** Navigate to the Feedback section on an article or Home page.
- **Steps to Reproduce:**
  1. Hover over 1, 2, 3, 4, 5 stars and observe hover label changes.
  2. Click 4 stars ("Very Insightful").
  3. Click 5 stars ("Outstanding Research & Models!").
- **Expected Behavior:**
  - Stars fill with vibrant amber color on hover and selection.
  - Text description dynamically matches selected rating.
- **Pass/Fail Criteria:** Selected star rating is saved into local state accurately.

---

### TC-FDBK-02: Feedback Submission & Form Validation
- **Feature:** Feedback Lead Submission to Database & API
- **Preconditions:** Feedback form visible.
- **Steps to Reproduce:**
  1. Leave the suggestion text box empty and click "Submit Review".
  2. Enter valid feedback text in the textarea.
  3. Enter Name: "Alex Morgan" and Email: "alex@example.com".
  4. Click "Submit Review".
- **Expected Behavior:**
  - Step 1 displays validation notice: "Please provide your suggestions or feedback before submitting."
  - Step 4 shows loading spinner, saves data to Supabase/API, and displays success banner ("Thank you for your valuable feedback!").
  - Form fields reset automatically after submission.
- **Pass/Fail Criteria:** Valid feedback records stored in database; UI displays success state.

---

## Section 7: Consultation Booking & Client Lead Intake

### TC-CONS-01: Advisory Consultation Form Validation & Submission
- **Feature:** Institutional Advisory Appointment Booking Form
- **Preconditions:** Scroll to `#contact` section.
- **Steps to Reproduce:**
  1. Submit form with empty fields -> verify HTML5/React validation blocks submission.
  2. Fill Name: `"Dev Sharma"`, Email: `"dev.sharma@investments.com"`, Phone: `"+91 9876543210"`.
  3. Select Topic: `"Financial Valuation & DCF Modeling"`.
  4. Enter Message: `"Inquiring for valuation advisory on an FMCG acquisition."`.
  5. Click "Confirm Advisory Reservation".
- **Expected Behavior:**
  - Form displays loading state (`Loader2` spinner).
  - Record is inserted into `consultations` table with status `'Pending'`.
  - Green confirmation card appears ("Advisory Session Reserved").
  - Form resets gracefully.
- **Pass/Fail Criteria:** Consultation record created in Supabase database with all field data intact.

---

## Section 8: Admin Authentication & Protected Route Guards

### TC-AUTH-01: Admin Login with Credentials
- **Feature:** Secure Token-Based Admin Authentication
- **Preconditions:** Navigate to `/admin/login`.
- **Steps to Reproduce:**
  1. Enter invalid email `"wrong@admin.com"` and password `"badpass"`. Click Sign In.
  2. Enter valid admin credentials. Click Sign In.
- **Expected Behavior:**
  - Invalid credentials display error: "Invalid email or password."
  - Valid credentials store JWT/session in localStorage, trigger `auth-state-change` event, and redirect to `/admin/dashboard`.
- **Pass/Fail Criteria:** Access is granted only with valid credentials.

---

### TC-AUTH-02: Unauthorized Route Protection & Logout
- **Feature:** Protected Dashboard Routes
- **Preconditions:** Clear localStorage (unauthenticated state).
- **Steps to Reproduce:**
  1. Type `/admin/dashboard` directly in URL bar.
  2. Log in, then click the "Logout" button in Header or Dashboard sidebar.
- **Expected Behavior:**
  - Unauthenticated access redirects user to `/admin/login`.
  - Logging out clears session token, updates header to hide admin options, and redirects to `/`.
- **Pass/Fail Criteria:** Zero access to administrative features when unauthenticated.

---

## Section 9: Admin Dashboard, Post Editor & Seed Management

### TC-DASH-01: Dashboard Navigation & Tab Switcher
- **Feature:** Admin Tab Views (Articles, Consultations, Feedback, Analytics)
- **Preconditions:** Logged in as Admin on `/admin/dashboard`.
- **Steps to Reproduce:**
  1. Click "Articles" tab.
  2. Click "Consultations" tab.
  3. Click "Feedback" tab.
  4. Change status of a consultation from "Pending" to "Confirmed".
- **Expected Behavior:**
  - Each tab renders its respective table and KPI metrics.
  - Consultation status dropdown updates the record in database immediately.
- **Pass/Fail Criteria:** CRUD operations succeed with immediate UI reflection.

---

### TC-DASH-02: Article Editor (Create & Edit)
- **Feature:** Markdown Article Publishing
- **Preconditions:** Navigate to `/admin/editor`.
- **Steps to Reproduce:**
  1. Fill Title: `"Q3 2026 Sovereign Debt Dynamics"`.
  2. Fill Category: `"Macroeconomics"`, Read Time: `"10 min read"`.
  3. Enter Markdown body with headers, lists, and code.
  4. Toggle "Publish" and click "Save & Publish Article".
- **Expected Behavior:**
  - Article is saved to database.
  - Redirects back to Dashboard or Post view.
  - Realtime channel broadcasts event, updating Home page "Latest Insights".
- **Pass/Fail Criteria:** Post appears on Home page immediately.

---

## Section 10: WhatsApp Floating Assistant & External Link Verifications

### TC-EXT-01: WhatsApp Floating Widget Interaction
- **Feature:** Direct WhatsApp Community & Advisory Access
- **Preconditions:** Page loaded on any route.
- **Steps to Reproduce:**
  1. Hover on bottom-right WhatsApp button (Desktop) or Tap (Mobile).
  2. Verify popup card content ("Tushar Singh - WhatsApp Advisory Group").
  3. Click "Join Group on WhatsApp".
- **Expected Behavior:**
  - Popup card transitions in with smooth opacity and scale.
  - Click opens `https://chat.whatsapp.com/...` in a new browser tab with `rel="noopener noreferrer"`.
- **Pass/Fail Criteria:** External link opens correctly in a new tab without security warnings.

---

## Section 11: Cross-Browser, Cache-Busting & Mobile Viewport QA

### TC-MBL-01: Mobile Browser Cache Invalidation
- **Feature:** Fresh Asset Loading on Mobile Devices (iOS Safari, Android Chrome)
- **Preconditions:** Deploy new build with updated assets.
- **Steps to Reproduce:**
  1. Open site on iPhone (Safari) and Android (Chrome).
  2. Refresh the page without clearing browser history.
  3. Check developer response headers for `index.html`.
- **Expected Behavior:**
  - `Cache-Control: no-cache, no-store, must-revalidate` ensures `index.html` is requested fresh.
  - Hashed bundles in `/assets/*` are loaded with 100% fidelity.
- **Pass/Fail Criteria:** Changes appear immediately on mobile devices upon page reload.

---

### TC-SEO-01: Googlebot Favicon & Meta Tags
- **Feature:** 48x48 Multiples Favicon Compliance
- **Preconditions:** Inspect HTML `<head>`.
- **Steps to Reproduce:**
  1. Inspect `<link rel="icon" type="image/png" sizes="48x48" href="/favicon.png" />`.
  2. Inspect `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />`.
  3. Fetch `/favicon.png` and `/apple-touch-icon.png` via browser.
- **Expected Behavior:**
  - HTTP 200 OK returned for all icon assets.
  - Googlebot detects compliant 48x48 icon for search result snippet.
- **Pass/Fail Criteria:** All icon links resolve with valid dimensions.

---

## 3. Automated Test Execution Checklist

| ID | Test Scenario | Category | Priority | Status |
|---|---|---|---|---|
| TC-NAV-01 | Public Route Accessibility & Fallbacks | Routing | P0 | Automated / Manual |
| TC-NAV-02 | Scroll Position Reset on Route Change | Navigation | P1 | Automated / Manual |
| TC-HDR-01 | Sticky Glassmorphic Header & Section Anchors | UI/UX | P1 | Automated / Manual |
| TC-HDR-02 | Mobile Drawer Navigation & Touch Targets | Mobile | P0 | Automated / Manual |
| TC-SRC-01 | Real-Time Keyword Search Filtering | Search | P0 | Automated / Manual |
| TC-SRC-02 | Category Pill Filter Toggle | Filtering | P0 | Automated / Manual |
| TC-PORT-01 | Solutions Accordion Expansion Animation | Interactive | P1 | Automated / Manual |
| TC-PORT-02 | Skills Badges & Competency Layout | UI/UX | P2 | Automated / Manual |
| TC-POST-01 | Article Markdown & Metadata Rendering | Reader | P0 | Automated / Manual |
| TC-POST-02 | 3-Statement Excel Model Download | Deliverables| P0 | Automated / Manual |
| TC-FDBK-01 | Star Rating Dynamic Labels | Feedback | P1 | Automated / Manual |
| TC-FDBK-02 | Feedback Submission to Database | Lead Gen | P0 | Automated / Manual |
| TC-CONS-01 | Consultation Reservation Submission | Lead Gen | P0 | Automated / Manual |
| TC-AUTH-01 | Admin Authentication & JWT Storage | Security | P0 | Automated / Manual |
| TC-AUTH-02 | Protected Route Guards & Logout Flow | Security | P0 | Automated / Manual |
| TC-DASH-01 | Admin Dashboard Tabs & Status Updates | Admin | P0 | Automated / Manual |
| TC-DASH-02 | Article Creation, Markdown Edit & Publish | CMS | P0 | Automated / Manual |
| TC-EXT-01 | WhatsApp Floating Assistant Trigger | Social | P1 | Automated / Manual |
| TC-MBL-01 | Mobile Anti-Cache Headers & Revalidation | Caching | P0 | Automated / Manual |
| TC-SEO-01 | Google 48x48 Favicon Meta Tags | SEO | P1 | Automated / Manual |

---
*End of Testing Plan Document. Maintained by QA & Development Team.*
