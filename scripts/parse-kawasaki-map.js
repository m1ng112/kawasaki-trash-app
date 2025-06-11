const fs = require('fs');
const path = require('path');

// Read and parse the CSV file
const csvPath = path.join(__dirname, '../assets/kawasaki-map.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const lines = csvContent.trim().split('\n');
const wardTownMap = {};

// Skip header
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const [ward, town] = line.split(',');
  if (!ward || !town) continue;
  
  if (!wardTownMap[ward]) {
    wardTownMap[ward] = [];
  }
  wardTownMap[ward].push(town);
}

// Generate the data structure
console.log('export const kawasakiWardTownMap = {');
Object.entries(wardTownMap).forEach(([ward, towns]) => {
  console.log(`  '${ward}': [`);
  towns.forEach((town, index) => {
    const comma = index < towns.length - 1 ? ',' : '';
    console.log(`    '${town}'${comma}`);
  });
  console.log('  ],');
});
console.log('};');

// Generate ward list
console.log('\nexport const kawasakiWards = [');
Object.keys(wardTownMap).forEach((ward, index) => {
  const comma = index < Object.keys(wardTownMap).length - 1 ? ',' : '';
  console.log(`  '${ward}'${comma}`);
});
console.log('] as const;');

// Generate type
console.log('\nexport type KawasakiWard = typeof kawasakiWards[number];');