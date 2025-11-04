// print-app-components-with-content.js
const fs = require('fs');
const path = require('path');

const TARGET_DIRS = ['app', 'components'];
const IMPORTANT_EXT = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.module.css']);

function printFileContent(filePath, prefix = '') {
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`${prefix}--- Begin file: ${path.basename(filePath)} ---`);
  console.log(content);
  console.log(`${prefix}--- End file: ${path.basename(filePath)} ---\n`);
}

function traverse(dirPath, prefix = '') {
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);
    if (item.isDirectory()) {
      console.log(`${prefix}📁 ${item.name}/`);
      traverse(fullPath, prefix + '    ');
    } else if (item.isFile()) {
      const ext = path.extname(item.name);
      if (IMPORTANT_EXT.has(ext)) {
        console.log(`${prefix}📄 ${item.name}`);
        printFileContent(fullPath, prefix + '    ');
      }
    }
  }
}

function run() {
  const root = process.cwd();
  console.log(`Project structure and file contents for folders: ${TARGET_DIRS.join(', ')} from ${root}`);
  for (const dir of TARGET_DIRS) {
    const full = path.join(root, dir);
    if (fs.existsSync(full) && fs.statSync(full).isDirectory()) {
      console.log(`\n== ${dir}/`);
      traverse(full, '   ');
    } else {
      console.log(`\n== ${dir}/  (folder tidak ditemukan)`);
    }
  }
}

run();
