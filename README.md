# Julian Waterman — Fine Art Portfolio & Catalogue

An elegant, museum-grade contemporary art portfolio catalogue with custom collections management, image upload, and direct artist contact. Designed with an **Editorial Aesthetic** (linen canvas colors, spacious grid layouts, and classic serif-to-sans contrast).

## Features

- **Thematic Collections**: Structured curation of works grouped by aesthetic theme.
- **Dynamic Catalogue**: Interactive search, medium filters, and artwork detail view.
- **PWA Ready**: Offline caching, customizable icons, and mobile install support via a registered Service Worker and `manifest.json`.
- **Hybrid Storage Architecture**: 
  - **Server-Side Mode**: Standard Express server backed by local database routing.
  - **Static / Decoupled Mode (Netlify/Vercel/GitHub Pages)**: Runs fully in-browser with seamless `localStorage` fallback. Admin uploads, message curation, and collection additions persist directly inside the visitor's local browser instance.

---

## How to Publish to GitHub & Netlify

Since this environment operates inside a sandboxed container, you can export your codebase and publish it directly to your GitHub repository using these simple steps:

### Step 1: Export from AI Studio
1. Open the **Settings** menu at the top or bottom corner of the AI Studio workspace.
2. Select **Export to GitHub** or **Download ZIP**.
3. If downloading as a ZIP, extract it locally on your computer.

### Step 2: Push to GitHub manually (if downloaded as ZIP)
Open your terminal in the extracted folder and run:
```bash
git init
git add .
git commit -m "Initialize Julian Waterman Catalogue Portfolio"
git branch -M main
git remote add origin https://github.com/markmaguire-sudo/julian-waterman-catalogue.git
git push -u origin main
```

### Step 3: Deploy to Netlify
1. Log in to [Netlify](https://www.netlify.com/).
2. Click **Add new site** -> **Import an existing project**.
3. Connect your **GitHub** account and choose the `julian-waterman-catalogue` repository.
4. Netlify will auto-detect the configuration from our included `netlify.toml` file:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Click **Deploy Site**!

---

## Local Development

To run this project locally on your machine:

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Development Server**:
   ```bash
   npm run dev
   ```
3. **Build and Run Production Server locally**:
   ```bash
   npm run build
   ```
   ```bash
   npm run start
   ```

---

## Theme & Typography Details

- **Typography**: Paired serif headings (*Cormorant Garamond*) with premium, high-legibility body typography (*Inter*).
- **Palette**: Solid warm white linen cream base (`#f5f2ed`), stark flat charcoal lettering (`#1a1a1a`), light stone canvas panels (`#e2dfd9`), and rich warm-gold accents (`#b0a080`).
- **Icons**: Sourced from *Lucide React* for vector precision.
