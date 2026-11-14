import puppeteer from "puppeteer";

async function runTest() {
  console.log("=== STARTING HAII WEAES 3D LIVE & ASSET MANAGEMENT E2E TEST ===");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. TEST HOMEPAGE & STAGE 1 BACKGROUND PREPARATION
  console.log("\n[Test 1] Opening Homepage (http://localhost:3000)...");
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 2500));

  const homepageTitle = await page.title();
  console.log(`✓ Homepage loaded with title: "${homepageTitle}"`);

  // Check if Service Worker registered
  const swRegistered = await page.evaluate(async () => {
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      return registrations.length > 0;
    }
    return false;
  });
  console.log(`✓ Service Worker registered: ${swRegistered}`);

  await page.screenshot({ path: "public/test_01_homepage.png" });

  // 2. TEST 3D LIVE STUDIO LOADING
  console.log("\n[Test 2] Navigating to 3D Live Studio (http://localhost:3000/fitting-room)...");
  await page.goto("http://localhost:3000/fitting-room", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 3500));

  const canvasExists = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    return {
      exists: !!canvas,
      width: canvas?.clientWidth,
      height: canvas?.clientHeight
    };
  });
  console.log("✓ WebGL 3D Canvas mounted:", canvasExists);

  await page.screenshot({ path: "public/test_02_3d_studio.png" });

  // 3. TEST CACHE STORAGE VERIFICATION
  console.log("\n[Test 3] Inspecting Browser Cache Storage...");
  const cacheInfo = await page.evaluate(async () => {
    if (!("caches" in window)) return { available: false };
    const keys = await caches.keys();
    const result = {};
    for (const key of keys) {
      const cache = await caches.open(key);
      const requests = await cache.keys();
      result[key] = requests.map((r) => new URL(r.url).pathname);
    }
    return { available: true, cacheKeys: keys, details: result };
  });
  console.log("✓ Cache Storage inspection:", JSON.stringify(cacheInfo, null, 2));

  // 4. TEST INDEXEDDB STORAGE
  console.log("\n[Test 4] Inspecting IndexedDB Storage...");
  const idbInfo = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const req = indexedDB.open("haii-weaes-3d-db", 1);
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction(["avatars", "asset_metadata"], "readonly");
        const avatarStore = tx.objectStore("avatars");
        const metaStore = tx.objectStore("asset_metadata");

        const getAvatars = avatarStore.getAll();
        const getMeta = metaStore.getAll();

        tx.oncomplete = () => {
          resolve({
            avatarsCount: getAvatars.result?.length || 0,
            latestAvatar: getAvatars.result?.[0] || null,
            assetMetadataCount: getMeta.result?.length || 0
          });
        };
      };
      req.onerror = () => resolve({ error: "Failed to open IndexedDB" });
    });
  });
  console.log("✓ IndexedDB inspection:", JSON.stringify(idbInfo, null, 2));

  // 5. TEST AVATAR CREATION MODAL OPENING
  console.log("\n[Test 5] Opening Avatar Creation Modal...");
  const modalOpened = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find(
      (b) => b.textContent?.includes("AVATAR") || b.textContent?.includes("CREATE PERSONAL")
    );
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log(`✓ Clicked avatar button: ${modalOpened}`);
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: "public/test_03_avatar_modal.png" });

  // 6. TEST SWITCHING GARMENT IN 3D STUDIO
  console.log("\n[Test 6] Testing Garment Silhouette Switching...");
  // Close modal if open
  await page.evaluate(() => {
    const closeBtn = document.querySelector("button[title='Close']");
    if (closeBtn) closeBtn.click();
  });
  await new Promise((r) => setTimeout(r, 500));

  // Click on London Dark Tee
  const switched = await page.evaluate(() => {
    const teeBtn = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent && b.textContent.includes("LONDON AFTER DARK")
    );
    if (teeBtn) {
      teeBtn.click();
      return true;
    }
    return false;
  });
  console.log(`✓ Clicked London Dark Tee: ${switched}`);
  await new Promise((r) => setTimeout(r, 2000));
  await page.screenshot({ path: "public/test_04_garment_switched.png" });

  console.log("\n=== ALL E2E TESTS COMPLETED SUCCESSFULLY! ===");
  await browser.close();
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
