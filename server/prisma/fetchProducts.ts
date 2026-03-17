/**
 * Fetch real product data from DummyJSON API and save to products.json
 * Run: npx ts-node prisma/fetchProducts.ts
 * Then run: npm run seed
 */

import fs from "fs";
import path from "path";

interface DummyProduct {
  id: number;
  title: string;
  price: number;
  rating: number;
  stock: number;
  category: string;
  brand?: string;
}

interface DummyResponse {
  products: DummyProduct[];
  total: number;
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function fetchAndSaveProducts() {
  console.log("🔄 Fetching products from DummyJSON API...");

  // Fetch all 194 products (paginated)
  const allProducts: DummyProduct[] = [];
  const limit = 100;

  for (let skip = 0; skip < 200; skip += limit) {
    const response = await fetch(
      `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
    );
    const data: DummyResponse = await response.json();
    allProducts.push(...data.products);

    if (allProducts.length >= data.total) break;
  }

  console.log(`✅ Fetched ${allProducts.length} products from DummyJSON`);

  // Map to our Prisma schema format
  const products = allProducts.map((p) => ({
    productId: generateUUID(),
    name: p.brand ? `${p.brand} ${p.title}` : p.title,
    price: Math.round(p.price * 100) / 100,
    rating: Math.round(p.rating * 100) / 100,
    stockQuantity: p.stock,
  }));

  // Save to seedData/products.json
  const outputPath = path.join(__dirname, "seedData", "products.json");
  fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));

  console.log(`💾 Saved ${products.length} products to ${outputPath}`);
  console.log("\n📋 Sample products:");
  products.slice(0, 5).forEach((p) => {
    console.log(
      `   - ${p.name} | $${p.price} | ⭐${p.rating} | Stock: ${p.stockQuantity}`
    );
  });

  console.log(`\n🚀 Now run: npm run seed`);
}

fetchAndSaveProducts().catch(console.error);
