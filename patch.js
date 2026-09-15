const fs = require('fs');

const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Backgrounds
  content = content.replace(/bg-\[#050505\]/g, 'bg-slate-50 dark:bg-[#050505]');
  content = content.replace(/bg-\[#161616\]/g, 'bg-slate-100 dark:bg-[#161616]');
  content = content.replace(/bg-\[#121212\]/g, 'bg-slate-100 dark:bg-[#121212]');
  content = content.replace(/bg-\[#141414\]/g, 'bg-slate-100 dark:bg-[#141414]');
  content = content.replace(/bg-\[#0a0a0a\]/g, 'bg-white dark:bg-[#0a0a0a]');
  content = content.replace(/bg-\[#090D1A\]/g, 'bg-slate-100 dark:bg-[#090D1A]');
  content = content.replace(/bg-\[#101726\]/g, 'bg-white dark:bg-[#101726]');
  content = content.replace(/bg-\[#0c101c\]/g, 'bg-white dark:bg-[#0c101c]');
  content = content.replace(/bg-\[#131b2e\]/g, 'bg-slate-50 dark:bg-[#131b2e]');
  content = content.replace(/bg-bento-card/g, 'bg-white dark:bg-bento-card');

  // Text
  content = content.replace(/text-white/g, 'text-slate-900 dark:text-white');
  content = content.replace(/text-\[#999999\]/g, 'text-slate-500 dark:text-[#999999]');
  content = content.replace(/text-slate-200/g, 'text-slate-700 dark:text-slate-200');
  content = content.replace(/text-slate-300/g, 'text-slate-600 dark:text-slate-300');
  content = content.replace(/text-slate-400/g, 'text-slate-500 dark:text-slate-400');
  content = content.replace(/text-\[#050505\]/g, 'text-white dark:text-[#050505]');

  // Borders
  content = content.replace(/border-white\/10/g, 'border-slate-200 dark:border-white/10');
  content = content.replace(/border-white\/5/g, 'border-slate-100 dark:border-white/5');
  content = content.replace(/border-white\/20/g, 'border-slate-300 dark:border-white/20');
  
  // Overlays
  content = content.replace(/bg-white\/5/g, 'bg-slate-100 dark:bg-white/5');
  content = content.replace(/bg-white\/10/g, 'bg-slate-200 dark:bg-white/10');
  
  // Custom
  content = content.replace(/bg-black\/50/g, 'bg-slate-900/10 dark:bg-black/50');
  
  fs.writeFileSync(filePath, content, 'utf8');
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath);
    }
  }
}

walk('./src');
console.log('Replaced successfully');
