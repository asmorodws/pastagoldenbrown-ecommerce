const fs = require('fs');
const path = require('path');

const baseDir = './public/assets/products';
const sizes = ['30g', '100g', '1kg'];

// Map to store product -> sizes
const productMap = new Map();

sizes.forEach(size => {
  const dirPath = path.join(baseDir, size);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.png'));
    files.forEach(file => {
      const productName = file.replace('.png', '');
      if (!productMap.has(productName)) {
        productMap.set(productName, []);
      }
      productMap.get(productName).push(size);
    });
  }
});

// Sort by number of sizes available
const sorted = Array.from(productMap.entries())
  .sort((a, b) => b[1].length - a[1].length);

console.log('\n=== PRODUCT IMAGE ANALYSIS ===\n');
console.log(`Total unique products: ${sorted.length}\n`);

console.log('Products with ALL 3 sizes (30g, 100g, 1kg):');
const allSizes = sorted.filter(([_, sizes]) => sizes.length === 3);
allSizes.forEach(([name, sizes]) => {
  console.log(`  - ${name}: ${sizes.join(', ')}`);
});

console.log(`\nProducts with 2 sizes:`);
const twoSizes = sorted.filter(([_, sizes]) => sizes.length === 2);
twoSizes.forEach(([name, sizes]) => {
  console.log(`  - ${name}: ${sizes.join(', ')}`);
});

console.log(`\nProducts with only 1 size:`);
const oneSize = sorted.filter(([_, sizes]) => sizes.length === 1);
oneSize.forEach(([name, sizes]) => {
  console.log(`  - ${name}: ${sizes.join(', ')}`);
});

console.log(`\n=== SUMMARY ===`);
console.log(`All 3 sizes: ${allSizes.length} products`);
console.log(`2 sizes: ${twoSizes.length} products`);
console.log(`1 size only: ${oneSize.length} products`);
