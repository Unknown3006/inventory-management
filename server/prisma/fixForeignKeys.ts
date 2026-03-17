import fs from 'fs';
import path from 'path';

// Load new products
const productsPath = path.join(__dirname, 'seedData', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
const newProductIds = products.map((p: any) => p.productId);

// Function to update a data file
function updateFileWithNewProductIds(filename: string) {
  const filePath = path.join(__dirname, 'seedData', filename);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  // Create a map to consistently map old IDs to new IDs
  const idMap = new Map<string, string>();
  
  data.forEach((item: any) => {
    if (item.productId) {
      if (!idMap.has(item.productId)) {
        // Pick a random new product ID
        const randomNewId = newProductIds[Math.floor(Math.random() * newProductIds.length)];
        idMap.set(item.productId, randomNewId);
      }
      item.productId = idMap.get(item.productId);
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated ${filename} with new product IDs.`);
}

updateFileWithNewProductIds('sales.json');
updateFileWithNewProductIds('purchases.json');
