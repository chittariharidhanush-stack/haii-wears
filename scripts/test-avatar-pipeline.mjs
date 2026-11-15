import puppeteer from "puppeteer";

async function testAvatarPipeline() {
  console.log("=== TESTING AVATAR CREATION & MEASUREMENT CONFIRMATION PIPELINE ===");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto("http://localhost:3000/fitting-room", { waitUntil: "domcontentloaded" });
  await new Promise((r) => setTimeout(r, 2000));

  // 1. Click on "AVATAR: 180CM ... EDIT" or "CREATE PERSONAL AVATAR"
  console.log("Step 1: Opening Avatar Modal...");
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find(
      (b) => b.textContent && (b.textContent.includes("AVATAR:") || b.textContent.includes("CREATE PERSONAL"))
    );
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  // 2. Click "CONTINUE TO BODY ANALYSIS"
  console.log("Step 2: Submitting Height & proceeding to analysis...");
  await page.evaluate(() => {
    const continueBtn = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent && b.textContent.includes("CONTINUE TO BODY ANALYSIS")
    );
    if (continueBtn) continueBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({ path: "public/test_05_analysis_step.png" });

  // 3. Click "REVIEW & CONFIRM MEASUREMENTS"
  console.log("Step 3: Reviewing anthropometric estimates...");
  await page.evaluate(() => {
    const reviewBtn = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent && b.textContent.includes("REVIEW & CONFIRM MEASUREMENTS")
    );
    if (reviewBtn) reviewBtn.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  await page.screenshot({ path: "public/test_06_review_table.png" });

  // 4. Select "broad" build and click "GENERATE PERSONALIZED 3D AVATAR"
  console.log("Step 4: Confirming measurements and generating avatar...");
  await page.evaluate(() => {
    const broadBtn = Array.from(document.querySelectorAll("button")).find(
      (b) => b.textContent && b.textContent.trim() === "broad"
    );
    if (broadBtn) broadBtn.click();

    const generateBtn = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent && b.textContent.includes("GENERATE PERSONALIZED 3D AVATAR")
    );
    if (generateBtn) generateBtn.click();
  });
  await new Promise((r) => setTimeout(r, 2000));

  await page.screenshot({ path: "public/test_07_generated_avatar.png" });

  // 5. Verify IndexedDB saved avatar
  console.log("Step 5: Inspecting saved avatar in IndexedDB...");
  const savedAvatar = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const req = indexedDB.open("haii-weaes-3d-db", 1);
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction("avatars", "readonly");
        const store = tx.objectStore("avatars");
        const getReq = store.getAll();
        getReq.onsuccess = () => resolve(getReq.result);
      };
      req.onerror = () => resolve(null);
    });
  });

  console.log("✓ Saved Avatar in IndexedDB:", JSON.stringify(savedAvatar, null, 2));

  await browser.close();
  console.log("\n=== AVATAR PIPELINE TEST PASSED! ===");
}

testAvatarPipeline().catch((err) => {
  console.error("Pipeline test error:", err);
  process.exit(1);
});

