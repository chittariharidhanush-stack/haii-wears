# HAII WEARS — Premium Luxury Streetwear & 3D Fashion Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=threedotjs)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**HAII WEARS** (HAII WEAES) is an international luxury streetwear and fashion e-commerce platform featuring an interactive editorial aesthetic, full e-commerce checkout flow, administrative content management, and an in-browser **3D Live Avatar & Virtual Fitting Room Studio**.

---

## ⚡ Core Highlights

### 1. 3D Live Avatar & Virtual Try-On Studio
- **Personalized 3D Avatar Creation**: Generate custom parametric 3D body models reflecting user proportions (height, chest, waist, hips, inseam) via WebAssembly OxiHuman integration.
- **AI Body Estimation**: Optional front & side photo analysis using client-side **MediaPipe Pose Landmarker** with 100% on-device privacy (images never leave the browser).
- **Interactive Garment Fitting**: Real binary `.glb` 3D clothing assets fitted dynamically across standard sizes (`S`, `M`, `L`, `XL`, `XXL`).
- **Interactive 3D Viewport**: Studio lighting, orbit/pan/zoom camera controls, silhouette wireframe toggles, and multi-angle fashion inspection.

### 2. Two-Stage Asset Download & Browser Storage Manager
- **Stage 1 (Essential)**: Low-overhead initial assets (UI skeletons, manifests, low-poly base mesh) load instantly.
- **Stage 2 (Background)**: Large 3D models, WebAssembly binaries, and textures prefetch in the background with progress tracking.
- **Multi-Tier Persistence**:
  - **Service Worker**: Cache-first routing for 3D binary assets and wasm runtimes.
  - **Cache Storage API**: 4 versioned storage buckets (`haii-3d-models-v1`, `haii-3d-wasm-v1`, `haii-3d-textures-v1`, `haii-3d-manifests-v1`).
  - **IndexedDB**: Persistent customer avatar configurations, privacy tokens, and fit profiles via `haii-weaes-3d-db`.

### 3. Editorial Luxury Brand Experience
- **High-Fashion Editorial Layouts**: Asymmetrical grids, dark monochrome palette (`#080808`, `#111111`, `#1A1A1A`) with selective accent red (`#F2342B`).
- **Dynamic Product Catalog**: 14+ categories (T-Shirts, Oversized Tees, Hoodies, Jackets, Denim, Accessories, Co-ords).
- **E-Commerce Suite**: Dynamic currency selector (INR, USD, EUR, GBP), smart search, filter drawer, slide-out cart drawer, and multi-step checkout.
- **Admin Control Center**: Integrated dashboard for inventory management, drop schedules, order tracking, and brand announcements.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router), React 19
- **Languages**: TypeScript, WebAssembly (Wasm)
- **3D & Vision**: Three.js, GLTFLoader, MediaPipe Pose Landmarker (`@mediapipe/tasks-vision`)
- **Styling & Motion**: Tailwind CSS, PostCSS, Lucide React
- **Storage & Offline**: Service Worker API, Cache Storage API, IndexedDB API
- **Testing**: Node.js & Playwright/Puppeteer browser automation scripts

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/chittariharidhanush-stack/haii-wears.git
   cd haii-wears
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗 Build & Production

```bash
# Production optimized build
npm run build

# Start production server
npm run start
```

---

## 🧪 Testing & Verification

Run automated headless verification of the 3D pipeline and asset managers:

```bash
# Verify 3D avatar generation pipeline & WASM loader
node scripts/test-avatar-pipeline.mjs

# Verify end-to-end 3D Live fitting room experience
node scripts/test-3d-live-e2e.mjs
```

---

## 📁 Project Architecture

```
haii-wears/
├── public/
│   ├── assets/3d/             # Binary GLB garments, WASM modules, pose landmarker models
│   ├── service-worker.js      # Two-stage asset cache-first Service Worker
│   └── manifests/             # 3D model & asset manifests
├── scripts/                   # Asset generation & E2E verification suites
├── src/
│   ├── app/                   # Next.js App Router pages (Home, Shop, Product, Admin, Checkout)
│   ├── components/            # Luxury UI design system, navigation, cart, footer
│   ├── features/three-d/      # Complete 3D Live & Asset Management Subsystem
│   │   ├── components/        # Viewport, Fitting Room, Controls, Avatar Modal
│   │   ├── services/          # AssetManager, AvatarGenerator, GarmentFitting, SceneManager
│   │   └── types/             # TypeScript interfaces for 3D, Assets, and Measurements
│   ├── context/               # Global Cart, Wishlist, Currency, and Toast providers
│   └── data/                  # Curated product catalog, categories, brand config
└── package.json
```

---

## 📄 License

Private & Proprietary — Developed for HAII WEARS / HAII WEAES. All rights reserved.
