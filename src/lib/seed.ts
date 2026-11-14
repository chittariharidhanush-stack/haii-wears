import db from "./db";
import bcrypt from "bcryptjs";
import { brandConfig } from "../config/brand";

export function runSeed() {
  console.log("Starting database seed...");

  // 1. Seed Users
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync("Admin@12345", salt);
  const customerPasswordHash = bcrypt.hashSync("Customer@123", salt);

  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, name, email, password_hash, role, phone)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertUser.run("usr_admin_001", "HAII Director", "admin@haiiweaes.com", adminPasswordHash, "ADMIN", "+91 98200 12345");
  insertUser.run("usr_cust_001", "Arjun Kapoor", "customer@haiiweaes.com", customerPasswordHash, "CUSTOMER", "+91 98111 87654");

  // 2. Seed Categories
  const categories = [
    { id: "cat_1", name: "T-Shirts", slug: "t-shirts", description: "Standard & boxy cuts in heavyweight 240+ GSM combed organic cotton.", image: "/categories/t-shirts.jpg", order: 1 },
    { id: "cat_2", name: "Oversized T-Shirts", slug: "oversized-t-shirts", description: "Exaggerated dropped shoulder silhouettes with high-density typographic prints.", image: "/categories/oversized-t-shirts.jpg", order: 2 },
    { id: "cat_3", name: "Shirts", slug: "shirts", description: "Structured overshirts, boxy poplins and shadow flannel weaves.", image: "/categories/shirts.jpg", order: 3 },
    { id: "cat_4", name: "Hoodies", slug: "hoodies", description: "Signature 480 GSM double-faced French terry with double-layer hoods.", image: "/categories/hoodies.jpg", order: 4 },
    { id: "cat_5", name: "Sweatshirts", slug: "sweatshirts", description: "Loopback fleece crews and asymmetrical quarter-zip pullovers.", image: "/categories/sweatshirts.jpg", order: 5 },
    { id: "cat_6", name: "Jackets", slug: "jackets", description: "Technical bombers, waterproof trenches and modular utility outerwear.", image: "/categories/jackets.jpg", order: 6 },
    { id: "cat_7", name: "Trousers", slug: "trousers", description: "Relaxed tailored cargo trousers and pleat-front tactical silhouettes.", image: "/categories/trousers.jpg", order: 7 },
    { id: "cat_8", name: "Jeans", slug: "jeans", description: "14oz raw Japanese selvedge denim in washed phantom and charcoal.", image: "/categories/jeans.jpg", order: 8 },
    { id: "cat_9", name: "Shorts", slug: "shorts", description: "Heavyweight drop-crotch sweats and multi-pocket carpenter shorts.", image: "/categories/shorts.jpg", order: 9 },
    { id: "cat_10", name: "Dresses", slug: "dresses", description: "Architectural structured noir dresses with asymmetric drapery.", image: "/categories/dresses.jpg", order: 10 },
    { id: "cat_11", name: "Tops", slug: "tops", description: "Textured ribbed tanks, sheer layering pieces and cut-out knits.", image: "/categories/tops.jpg", order: 11 },
    { id: "cat_12", name: "Co-ord Sets", slug: "co-ord-sets", description: "Unified matching sets in premium waffle and brushed fleece.", image: "/categories/co-ord-sets.jpg", order: 12 },
    { id: "cat_13", name: "Accessories", slug: "accessories", description: "Modular sling bags, heavy sterling carabiners and tactical belts.", image: "/categories/accessories.jpg", order: 13 },
    { id: "cat_14", name: "New Arrivals", slug: "new-arrivals", description: "The latest nocturnal drop silhouettes and strictly limited releases.", image: "/categories/new-arrivals.jpg", order: 14 }
  ];

  const insertCategory = db.prepare(`
    INSERT OR REPLACE INTO categories (id, name, slug, description, image_url, display_order)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  categories.forEach(c => insertCategory.run(c.id, c.name, c.slug, c.description, c.image, c.order));

  // 3. Seed Products
  const products = [
    {
      id: "prod_01",
      title: "NOCTURN OVERSIZED HEAVYWEIGHT HOODIE",
      slug: "nocturn-oversized-heavyweight-hoodie",
      description: "Our signature silhouette crafted from 480 GSM ultra-heavyweight combed French terry. Features a double-lined crossover hood without drawstrings for an uncompromising architectural look. Finished with subtle tonal rubberized branding on chest and oversized high-density screenprint on reverse. Cut in a wide, dropped-shoulder boxy drape.",
      price: 5499,
      sale_price: 4999,
      category_id: "cat_4",
      images_json: JSON.stringify(["/products/nocturn-hoodie-1.jpg", "/products/nocturn-hoodie-2.jpg", "/campaign/hero-garage-model.jpg"]),
      sizes_json: JSON.stringify([
        { size: "S", stock: 8 },
        { size: "M", stock: 15 },
        { size: "L", stock: 22 },
        { size: "XL", stock: 10 },
        { size: "XXL", stock: 4 }
      ]),
      colors_json: JSON.stringify([
        { name: "Onyx Black", hex: "#0c0c0c" },
        { name: "Washed Slate", hex: "#262b30" },
        { name: "Crimson Red", hex: "#d62828" }
      ]),
      fabric_details: "100% Organic Combed Cotton · Double-Faced Loopback Terry",
      gsm: 480,
      fit: "Oversized Boxy Silhouette / Dropped Shoulder",
      is_featured: 1,
      is_new_drop: 1,
      in_stock: 1,
      stock_total: 59
    },
    {
      id: "prod_02",
      title: "LONDON AFTER DARK GRAPHIC TEE",
      slug: "london-after-dark-graphic-tee",
      description: "Heavyweight 280 GSM single jersey with a vintage vintage-wash treatment. Front displays the bespoke 'NOCTURN' typographic artwork with discharge water-based ink that softens into the cotton with age. Reinforced ribbed collar that never sags.",
      price: 2499,
      sale_price: null,
      category_id: "cat_2",
      images_json: JSON.stringify(["/products/london-dark-tee-1.jpg", "/products/london-dark-tee-2.jpg", "/campaign/hero-graphic-tee-model.jpg"]),
      sizes_json: JSON.stringify([
        { size: "S", stock: 12 },
        { size: "M", stock: 25 },
        { size: "L", stock: 30 },
        { size: "XL", stock: 14 }
      ]),
      colors_json: JSON.stringify([
        { name: "Washed Phantom", hex: "#181818" },
        { name: "Chalk White", hex: "#e5e5e5" }
      ]),
      fabric_details: "100% Combed Ringspun Cotton · Pre-Shrunk & Bio-Washed",
      gsm: 280,
      fit: "Relaxed Boxy Cut / True To Streetwear Sizing",
      is_featured: 1,
      is_new_drop: 1,
      in_stock: 1,
      stock_total: 81
    },
    {
      id: "prod_03",
      title: "ARCHIVE TACTICAL CARGO TROUSERS",
      slug: "archive-tactical-cargo-trousers",
      description: "Engineered from rugged 320 GSM ripstop cotton with articulated knee darts and 8 modular 3D utility pockets. Equipped with custom FIDLOCK-compatible magnetic release buckles, adjustable ankle cinches, and a relaxed wide-leg fall.",
      price: 6299,
      sale_price: 5499,
      category_id: "cat_7",
      images_json: JSON.stringify(["/products/tactical-cargo-1.jpg", "/products/tactical-cargo-2.jpg"]),
      sizes_json: JSON.stringify([
        { size: "S", stock: 5 },
        { size: "M", stock: 12 },
        { size: "L", stock: 14 },
        { size: "XL", stock: 6 }
      ]),
      colors_json: JSON.stringify([
        { name: "Pitch Black", hex: "#0a0a0a" },
        { name: "Urban Olive", hex: "#2b3024" }
      ]),
      fabric_details: "100% Heavy Ripstop Cotton · Teflon Water-Repellent Finish",
      gsm: 320,
      fit: "Articulated Wide-Leg / Adjustable Bungee Hem",
      is_featured: 1,
      is_new_drop: 0,
      in_stock: 1,
      stock_total: 37
    },
    {
      id: "prod_04",
      title: "APOCALYPSE REVERSIBLE BOMBER JACKET",
      slug: "apocalypse-reversible-bomber-jacket",
      description: "Double-sided technical outerwear. Side A is high-density matte black nylon with weather-proof PU coating and utility arm pocket. Side B reverses to a fiery crimson red silk-touch cupro lining with custom woven HAII WEAES branding tags.",
      price: 9999,
      sale_price: 8499,
      category_id: "cat_6",
      images_json: JSON.stringify(["/products/bomber-jacket-1.jpg", "/products/bomber-jacket-2.jpg"]),
      sizes_json: JSON.stringify([
        { size: "M", stock: 8 },
        { size: "L", stock: 11 },
        { size: "XL", stock: 5 }
      ]),
      colors_json: JSON.stringify([
        { name: "Matte Black / Crimson", hex: "#111111" }
      ]),
      fabric_details: "Military-Grade Ballistic Nylon Outer / Thermal Thinsulate Insulation",
      gsm: 520,
      fit: "Boxy Cropped Body with Generous Arm Volume",
      is_featured: 1,
      is_new_drop: 1,
      in_stock: 1,
      stock_total: 24
    },
    {
      id: "prod_05",
      title: "RAW SELVEDGE RELAXED DENIM",
      slug: "raw-selvedge-relaxed-denim",
      description: "14oz raw red-line selvedge denim woven on vintage shuttle looms. Left unwashed for raw break-in fades unique to the wearer. Features custom gunmetal hardware, button fly, and a relaxed straight-leg silhouette that stacks over boots.",
      price: 5899,
      sale_price: null,
      category_id: "cat_8",
      images_json: JSON.stringify(["/products/selvedge-denim-1.jpg", "/products/selvedge-denim-2.jpg"]),
      sizes_json: JSON.stringify([
        { size: "S", stock: 7 },
        { size: "M", stock: 14 },
        { size: "L", stock: 18 },
        { size: "XL", stock: 9 }
      ]),
      colors_json: JSON.stringify([
        { name: "Deep Indigo", hex: "#121926" },
        { name: "Shadow Charcoal", hex: "#202022" }
      ]),
      fabric_details: "100% Selvedge Cotton · 14oz Rigid Weight",
      gsm: 475,
      fit: "Relaxed Straight-Leg with Stacking Ankle",
      is_featured: 0,
      is_new_drop: 0,
      in_stock: 1,
      stock_total: 48
    },
    {
      id: "prod_06",
      title: "MONOLITH BOXY FLANNEL SHIRT",
      slug: "monolith-boxy-flannel-shirt",
      description: "Brushed double-face heavy cotton flannel in shadow plaid. Flat hemline, dropped shoulder, oversized chest flap pockets and mother-of-pearl buttons in gunmetal finish.",
      price: 3899,
      sale_price: 3299,
      category_id: "cat_3",
      images_json: JSON.stringify(["/products/boxy-flannel-1.jpg", "/products/boxy-flannel-2.jpg"]),
      sizes_json: JSON.stringify([
        { size: "S", stock: 9 },
        { size: "M", stock: 16 },
        { size: "L", stock: 20 },
        { size: "XL", stock: 7 }
      ]),
      colors_json: JSON.stringify([
        { name: "Shadow Plaid", hex: "#1f1f1f" }
      ]),
      fabric_details: "100% Brushed Cotton Yarn-Dyed Flannel",
      gsm: 310,
      fit: "Boxy Overshirt Silhouette",
      is_featured: 1,
      is_new_drop: 0,
      in_stock: 1,
      stock_total: 52
    },
    {
      id: "prod_07",
      title: "VELOCITY HEAVYWEIGHT ZIP SWEATSHIRT",
      slug: "velocity-heavyweight-zip-sweatshirt",
      description: "420 GSM diagonal loopback fleece equipped with two-way heavy YKK gunmetal zippers. Features seamless raglan sleeves, ribbed side stretch gussets and high mock-neck collar.",
      price: 4699,
      sale_price: 3999,
      category_id: "cat_5",
      images_json: JSON.stringify(["/products/velocity-zip-1.jpg", "/products/velocity-zip-2.jpg"]),
      sizes_json: JSON.stringify([
        { size: "S", stock: 6 },
        { size: "M", stock: 14 },
        { size: "L", stock: 15 },
        { size: "XL", stock: 8 }
      ]),
      colors_json: JSON.stringify([
        { name: "Washed Carbon", hex: "#1c1c1c" },
        { name: "Concrete Grey", hex: "#4b4b4b" }
      ]),
      fabric_details: "100% Combed Cotton Loopback",
      gsm: 420,
      fit: "Athletic Relaxed / Mock-Neck Zip",
      is_featured: 0,
      is_new_drop: 1,
      in_stock: 1,
      stock_total: 43
    },
    {
      id: "prod_08",
      title: "GOTHIC SIGNATURE LONGSLEEVE",
      slug: "gothic-signature-longsleeve",
      description: "Heavyweight jersey long sleeve with typography along both arms and subtle HAII emblem centered on the chest. Ribbed cuffs with thumbhole slits for cold evening drops.",
      price: 2999,
      sale_price: null,
      category_id: "cat_1",
      images_json: JSON.stringify(["/products/gothic-longsleeve-1.jpg", "/products/gothic-longsleeve-2.jpg"]),
      sizes_json: JSON.stringify([
        { size: "S", stock: 10 },
        { size: "M", stock: 18 },
        { size: "L", stock: 22 },
        { size: "XL", stock: 11 }
      ]),
      colors_json: JSON.stringify([
        { name: "Jet Black", hex: "#050505" }
      ]),
      fabric_details: "100% Carded Heavy Jersey",
      gsm: 260,
      fit: "Relaxed Fit with Elongated Sleeves",
      is_featured: 1,
      is_new_drop: 0,
      in_stock: 1,
      stock_total: 61
    },
    {
      id: "prod_09",
      title: "METROPOLIS WATERPROOF TRENCH",
      slug: "metropolis-waterproof-trench",
      description: "Minimalist dystopian outerwear. 3-layer laminated technical shell with taped seams, storm flap closure, magnetic collar clasp and deep side gussets.",
      price: 11499,
      sale_price: 9899,
      category_id: "cat_6",
      images_json: JSON.stringify(["/products/waterproof-trench-1.jpg", "/products/waterproof-trench-2.jpg"]),
      sizes_json: JSON.stringify([
        { size: "M", stock: 5 },
        { size: "L", stock: 7 },
        { size: "XL", stock: 3 }
      ]),
      colors_json: JSON.stringify([
        { name: "Deep Obsidian", hex: "#080808" }
      ]),
      fabric_details: "3-Layer Waterproof Technical Membrane (20,000mm Rating)",
      gsm: 380,
      fit: "Calf-Length Fluid Silhouette",
      is_featured: 1,
      is_new_drop: 1,
      in_stock: 1,
      stock_total: 15
    },
    {
      id: "prod_10",
      title: "ABSTRACT DRAPE MINI DRESS",
      slug: "abstract-drape-mini-dress",
      description: "Architectural unisex evening dress featuring asymmetrical gathering at the hip, high structured neckline and matte bonded jersey construction.",
      price: 4999,
      sale_price: 4299,
      category_id: "cat_10",
      images_json: JSON.stringify(["/products/drape-dress-1.jpg", "/products/drape-dress-2.jpg"]),
      sizes_json: JSON.stringify([
        { size: "XS", stock: 6 },
        { size: "S", stock: 11 },
        { size: "M", stock: 9 }
      ]),
      colors_json: JSON.stringify([
        { name: "Matte Noir", hex: "#0b0b0b" }
      ]),
      fabric_details: "High-Stretch Scuba Crepe · 88% Poly, 12% Spandex",
      gsm: 340,
      fit: "Sculptural Form-Fitting Drape",
      is_featured: 0,
      is_new_drop: 0,
      in_stock: 1,
      stock_total: 26
    },
    {
      id: "prod_11",
      title: "TECHNICAL CROSSBODY MODULAR BAG",
      slug: "technical-crossbody-modular-bag",
      description: "Engineered from 1000D Cordura ballistic nylon. Features quick-release aluminum cobra buckle, waterproof sealed zippers, modular detachable utility pouch and molle attachment grid.",
      price: 3499,
      sale_price: null,
      category_id: "cat_13",
      images_json: JSON.stringify(["/products/crossbody-bag-1.jpg", "/products/crossbody-bag-2.jpg", "/campaign/hero-sling-bag.jpg"]),
      sizes_json: JSON.stringify([
        { size: "ONE SIZE", stock: 35 }
      ]),
      colors_json: JSON.stringify([
        { name: "Tactical Black", hex: "#111111" }
      ]),
      fabric_details: "1000D Ballistic Cordura Nylon / Aviation Aluminum Buckle",
      gsm: 400,
      fit: "Adjustable Ergonomic Crossbody Strap",
      is_featured: 1,
      is_new_drop: 1,
      in_stock: 1,
      stock_total: 35
    },
    {
      id: "prod_12",
      title: "ASYMMETRIC RIBBED TANK TOP",
      slug: "asymmetric-ribbed-tank-top",
      description: "Heavy 2x2 ribbed cotton with diagonal shoulder straps and raw curved hem. Built for effortless summer wear or high-fashion winter under-layering.",
      price: 1899,
      sale_price: null,
      category_id: "cat_11",
      images_json: JSON.stringify(["/products/ribbed-tank-1.jpg", "/products/ribbed-tank-2.jpg"]),
      sizes_json: JSON.stringify([
        { size: "S", stock: 14 },
        { size: "M", stock: 20 },
        { size: "L", stock: 16 }
      ]),
      colors_json: JSON.stringify([
        { name: "Charcoal", hex: "#222222" },
        { name: "Bone", hex: "#d8d5ce" }
      ]),
      fabric_details: "95% Organic Cotton, 5% Elastane",
      gsm: 250,
      fit: "Body-Contouring Stretch Fit",
      is_featured: 0,
      is_new_drop: 0,
      in_stock: 1,
      stock_total: 50
    },
    {
      id: "prod_13",
      title: "MINIMALIST CO-ORD TRACKSUIT SET",
      slug: "minimalist-co-ord-tracksuit-set",
      description: "Two-piece premium loungewear set comprising a boxy mock-neck pullover and wide-leg track pant with pin-tuck front seams. Crafted from heavyweight waffle cotton.",
      price: 7999,
      sale_price: 6899,
      category_id: "cat_12",
      images_json: JSON.stringify(["/products/coord-tracksuit-1.jpg", "/products/coord-tracksuit-2.jpg"]),
      sizes_json: JSON.stringify([
        { size: "S", stock: 7 },
        { size: "M", stock: 12 },
        { size: "L", stock: 14 },
        { size: "XL", stock: 5 }
      ]),
      colors_json: JSON.stringify([
        { name: "Anthracite", hex: "#18191b" }
      ]),
      fabric_details: "100% Combed Heavy Waffle Knit",
      gsm: 450,
      fit: "Two-Piece Co-ordinated Streetwear Cut",
      is_featured: 1,
      is_new_drop: 1,
      in_stock: 1,
      stock_total: 38
    },
    {
      id: "prod_14",
      title: "UTILITY HEAVY CARPENTER SHORTS",
      slug: "utility-heavy-carpenter-shorts",
      description: "Durable 12oz canvas workwear shorts with triple-stitched tool pockets, hammer loop, heavy brass zipper and knee-length wide silhouette.",
      price: 3299,
      sale_price: 2799,
      category_id: "cat_9",
      images_json: JSON.stringify(["/products/carpenter-shorts-1.jpg", "/products/carpenter-shorts-2.jpg"]),
      sizes_json: JSON.stringify([
        { size: "S", stock: 10 },
        { size: "M", stock: 15 },
        { size: "L", stock: 18 },
        { size: "XL", stock: 8 }
      ]),
      colors_json: JSON.stringify([
        { name: "Washed Black Canvas", hex: "#1b1b1b" }
      ]),
      fabric_details: "100% Duck Canvas Cotton",
      gsm: 360,
      fit: "Wide-Leg Knee-Length Skate Cut",
      is_featured: 0,
      is_new_drop: 0,
      in_stock: 1,
      stock_total: 51
    },
    {
      id: "prod_15",
      title: "DISTRESSED ACID-WASH OVERSIZED TEE",
      slug: "distressed-acid-wash-oversized-tee",
      description: "Each tee is individually hand-treated with mineral wash and subtle micro-distressing along the collar and hemline. Printed with vintage halftone gothic typography.",
      price: 2699,
      sale_price: null,
      category_id: "cat_2",
      images_json: JSON.stringify(["/products/acid-wash-tee-1.jpg", "/products/acid-wash-tee-2.jpg"]),
      sizes_json: JSON.stringify([
        { size: "S", stock: 11 },
        { size: "M", stock: 22 },
        { size: "L", stock: 26 },
        { size: "XL", stock: 12 }
      ]),
      colors_json: JSON.stringify([
        { name: "Mineral Smoke", hex: "#232323" }
      ]),
      fabric_details: "100% Heavy Combed Cotton 280 GSM",
      gsm: 280,
      fit: "Drop-Shoulder Boxy Silhouette",
      is_featured: 1,
      is_new_drop: 1,
      in_stock: 1,
      stock_total: 71
    },
    {
      id: "prod_16",
      title: "STATEMENT CHUNKY SILVER CHAIN & CARABINER",
      slug: "statement-chunky-silver-chain-carabiner",
      description: "Heavy 925 sterling silver plated Cuban curb link chain featuring custom industrial carabiner clasp with engraved HAII WEAES hallmark. Wearable as necklace or wallet chain.",
      price: 3999,
      sale_price: 3499,
      category_id: "cat_13",
      images_json: JSON.stringify(["/products/silver-chain-1.jpg", "/products/silver-chain-2.jpg"]),
      sizes_json: JSON.stringify([
        { size: "55CM", stock: 20 },
        { size: "65CM", stock: 15 }
      ]),
      colors_json: JSON.stringify([
        { name: "Burnished Silver", hex: "#c0c0c0" },
        { name: "Gunmetal", hex: "#4a4a4a" }
      ]),
      fabric_details: "Solid Brass Base with 10-Micron 925 Sterling Silver Dip",
      gsm: 180,
      fit: "Heavy Weight (180 Grams)",
      is_featured: 1,
      is_new_drop: 0,
      in_stock: 1,
      stock_total: 35
    }
  ];

  const insertProduct = db.prepare(`
    INSERT OR REPLACE INTO products (
      id, title, slug, description, price, sale_price, category_id,
      images_json, sizes_json, colors_json, fabric_details, gsm, fit,
      is_featured, is_new_drop, in_stock, stock_total
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  products.forEach(p => {
    insertProduct.run(
      p.id, p.title, p.slug, p.description, p.price, p.sale_price, p.category_id,
      p.images_json, p.sizes_json, p.colors_json, p.fabric_details, p.gsm, p.fit,
      p.is_featured, p.is_new_drop, p.in_stock, p.stock_total
    );
  });

  // 4. Seed Initial Orders for Admin KPIs
  const insertOrder = db.prepare(`
    INSERT OR REPLACE INTO orders (
      id, order_number, user_id, customer_email, customer_name, customer_phone,
      shipping_address_json, subtotal, discount, shipping_fee, tax, total,
      currency, payment_method, payment_status, fulfilment_status, tracking_number, carrier, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertOrderItem = db.prepare(`
    INSERT OR REPLACE INTO order_items (
      id, order_id, product_id, product_title, product_image, size, color, quantity, unit_price, total_price
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const sampleAddress = JSON.stringify({
    name: "Arjun Kapoor",
    phone: "+91 98111 87654",
    address_line1: "Flat 402, Skyline Towers, Worli",
    city: "Mumbai",
    state: "Maharashtra",
    postal_code: "400018",
    country: "India"
  });

  const orders = [
    {
      id: "ord_001",
      number: "HW-ORD-78210",
      user_id: "usr_cust_001",
      email: "customer@haiiweaes.com",
      name: "Arjun Kapoor",
      phone: "+91 98111 87654",
      subtotal: 7498,
      discount: 749.8,
      shipping: 0,
      tax: 0,
      total: 6748.2,
      payment: "RAZORPAY_UPI",
      p_status: "PAID",
      f_status: "DELIVERED",
      track: "BLUEDART-88291039",
      carrier: "Blue Dart Express",
      date: "2026-11-08 14:22:00"
    },
    {
      id: "ord_002",
      number: "HW-ORD-78211",
      user_id: "usr_cust_001",
      email: "customer@haiiweaes.com",
      name: "Arjun Kapoor",
      phone: "+91 98111 87654",
      subtotal: 9999,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 9999,
      payment: "STRIPE_CARD",
      p_status: "PAID",
      f_status: "SHIPPED",
      track: "DHL-992019488",
      carrier: "DHL Express",
      date: "2026-11-11 19:10:00"
    },
    {
      id: "ord_003",
      number: "HW-ORD-78212",
      user_id: null,
      email: "guest.delhi@gmail.com",
      name: "Rohan Varma",
      phone: "+91 98765 43210",
      subtotal: 4999,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 4999,
      payment: "CASH_ON_DELIVERY",
      p_status: "PENDING",
      f_status: "PROCESSING",
      track: "DELHIVERY-5561029",
      carrier: "Delhivery",
      date: "2026-11-13 11:45:00"
    }
  ];

  orders.forEach(o => {
    insertOrder.run(
      o.id, o.number, o.user_id, o.email, o.name, o.phone, sampleAddress,
      o.subtotal, o.discount, o.shipping, o.tax, o.total, "INR",
      o.payment, o.p_status, o.f_status, o.track, o.carrier, o.date
    );
  });

  insertOrderItem.run("item_1", "ord_001", "prod_01", "NOCTURN OVERSIZED HEAVYWEIGHT HOODIE", "/products/nocturn-hoodie-1.jpg", "L", "Onyx Black", 1, 4999, 4999);
  insertOrderItem.run("item_2", "ord_001", "prod_02", "LONDON AFTER DARK GRAPHIC TEE", "/products/london-dark-tee-1.jpg", "L", "Washed Phantom", 1, 2499, 2499);
  insertOrderItem.run("item_3", "ord_002", "prod_04", "APOCALYPSE REVERSIBLE BOMBER JACKET", "/products/bomber-jacket-1.jpg", "L", "Matte Black / Crimson", 1, 9999, 9999);
  insertOrderItem.run("item_4", "ord_003", "prod_01", "NOCTURN OVERSIZED HEAVYWEIGHT HOODIE", "/products/nocturn-hoodie-1.jpg", "M", "Washed Slate", 1, 4999, 4999);

  // 5. Seed CMS Settings
  const insertCMS = db.prepare(`
    INSERT OR REPLACE INTO cms_settings (key, value_json, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
  `);

  insertCMS.run("brand_config", JSON.stringify(brandConfig));

  console.log("Database seeded successfully with 14 categories, 16 products, orders, and CMS configuration!");
}

// Run if called directly
if (require.main === module) {
  runSeed();
}

