const fs = require('fs');
const path = require('path');

// Read and parse the comprehensive garbage collection CSV file
const csvPath = path.join(__dirname, '../assets/garbage_collection.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const lines = csvContent.trim().split('\n');
const scheduleMap = {};

// Helper function to parse Japanese day names to weekday numbers
function parseJapaneseDays(dayString) {
  const dayMap = {
    '月': 1, // Monday
    '火': 2, // Tuesday  
    '水': 3, // Wednesday
    '木': 4, // Thursday
    '金': 5, // Friday
    '土': 6, // Saturday
    '日': 0  // Sunday
  };
  
  const days = [];
  for (const char of dayString) {
    if (dayMap[char] !== undefined) {
      days.push(dayMap[char]);
    }
  }
  return days;
}

// Helper function to parse special collection patterns for oversized waste
function parseOversizedSchedule(collectionString) {
  if (!collectionString) return null;
  
  // Extract weekday and week numbers from patterns like "第1・3回目　水"
  const weekMatch = collectionString.match(/第([1-4])・([1-4])回目/);
  const dayMatch = collectionString.match(/([月火水木金土日])$/);
  
  if (weekMatch && dayMatch) {
    const weeks = [parseInt(weekMatch[1]), parseInt(weekMatch[2])];
    const weekday = parseJapaneseDays(dayMatch[1])[0];
    return { weekday, weeks };
  }
  
  // Single week pattern like "第2回目　金"
  const singleWeekMatch = collectionString.match(/第([1-4])回目\s*([月火水木金土日])/);
  if (singleWeekMatch) {
    const weeks = [parseInt(singleWeekMatch[1])];
    const weekday = parseJapaneseDays(singleWeekMatch[2])[0];
    return { weekday, weeks };
  }
  
  return null;
}

// Helper function to parse plastic packaging schedule
function parseSpecialCollection(collectionString) {
  if (!collectionString) return null;
  
  // Extract weekday and week numbers from patterns like "第1・3回目　水"
  const weekMatch = collectionString.match(/第([1-4])・([1-4])回目/);
  const dayMatch = collectionString.match(/([月火水木金土日])$/);
  
  if (weekMatch && dayMatch) {
    const weeks = [parseInt(weekMatch[1]), parseInt(weekMatch[2])];
    const weekday = parseJapaneseDays(dayMatch[1])[0];
    return { weekday, weeks };
  }
  
  // Single week pattern like "第2回目　金"
  const singleWeekMatch = collectionString.match(/第([1-4])回目\s*([月火水木金土日])/);
  if (singleWeekMatch) {
    const weeks = [parseInt(singleWeekMatch[1])];
    const weekday = parseJapaneseDays(singleWeekMatch[2])[0];
    return { weekday, weeks };
  }
  
  // Simple day pattern like "土" (single day without week specification)
  // Default to first and third weeks for compatibility
  const simpleDayMatch = collectionString.match(/^([月火水木金土日])$/);
  if (simpleDayMatch) {
    const weekday = parseJapaneseDays(simpleDayMatch[1])[0];
    return { weekday, weeks: [1, 3] };
  }
  
  return null;
}

// Skip header
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const parts = line.split(',');
  if (parts.length < 6) continue;
  
  const [ward, town, normalGarbage, cansBottles, glassBottlesBatteries, mixedPaper, plasticPackaging, oversizedWaste] = parts;
  
  if (!ward || !town) continue;
  
  const areaId = `${ward}-${town}`;
  
  // Parse each collection type
  const schedule = {
    normalGarbage: parseJapaneseDays(normalGarbage.replace('・', '')),     // 普通ゴミ
    cansBottles: parseJapaneseDays(cansBottles),                          // 空き缶・ペットボトル
    glassBottles: parseJapaneseDays(glassBottlesBatteries),               // 空きびん
    usedBatteries: parseJapaneseDays(glassBottlesBatteries),              // 使用済み乾電池 (same day as bottles)
    mixedPaper: parseJapaneseDays(mixedPaper),                            // ミックスペーパー
    plasticPackaging: parseJapaneseDays(plasticPackaging),               // プラスチック製容器包装 (weekly collection)
    smallMetal: parseOversizedSchedule(oversizedWaste),                   // 小物金属 (same schedule as oversized)
    // oversizedWaste is intentionally excluded from regular calendar display
  };
  
  scheduleMap[areaId] = {
    id: areaId,
    ward,
    area: town,
    schedule
  };
}

// Generate TypeScript file
console.log('// Generated from garbage_collection.csv - Comprehensive Kawasaki City Waste Collection Schedule');
console.log('import type { Area } from \"@/types\";');
console.log('');
console.log('export const kawasakiScheduleData: Record<string, Area> = {');

Object.entries(scheduleMap).forEach(([areaId, data], index) => {
  const isLast = index === Object.entries(scheduleMap).length - 1;
  console.log(`  '${areaId}': {`);
  console.log(`    id: '${data.id}',`);
  console.log(`    ward: '${data.ward}',`);
  console.log(`    area: '${data.area}',`);
  console.log(`    schedule: {`);
  console.log(`      normalGarbage: [${data.schedule.normalGarbage.join(', ')}],`);
  console.log(`      cansBottles: [${data.schedule.cansBottles.join(', ')}],`);
  console.log(`      glassBottles: [${data.schedule.glassBottles.join(', ')}],`);
  console.log(`      usedBatteries: [${data.schedule.usedBatteries.join(', ')}],`);
  console.log(`      mixedPaper: [${data.schedule.mixedPaper.join(', ')}],`);
  console.log(`      plasticPackaging: [${data.schedule.plasticPackaging.join(', ')}],`);
  
  if (data.schedule.smallMetal) {
    console.log(`      smallMetal: { weekday: ${data.schedule.smallMetal.weekday}, weeks: [${data.schedule.smallMetal.weeks.join(', ')}] },`);
  } else {
    console.log(`      smallMetal: { weekday: 1, weeks: [1, 3] },`);
  }
  
  console.log(`    },`);
  console.log(`  }${isLast ? '' : ','}`);
});

console.log('};');
console.log('');
console.log('export function getAreaScheduleData(areaId: string): Area | undefined {');
console.log('  return kawasakiScheduleData[areaId];');
console.log('}');
console.log('');
console.log('export function getAreasByWardFromSchedule(ward: string): Area[] {');
console.log('  return Object.values(kawasakiScheduleData).filter(area => area.ward === ward);');
console.log('}');

console.log('');
console.log('// Statistics');
console.log(`// Total areas: ${Object.keys(scheduleMap).length}`);
const wardCounts = {};
Object.values(scheduleMap).forEach(area => {
  wardCounts[area.ward] = (wardCounts[area.ward] || 0) + 1;
});
console.log('// Areas per ward:');
Object.entries(wardCounts).forEach(([ward, count]) => {
  console.log(`//   ${ward}: ${count} areas`);
});