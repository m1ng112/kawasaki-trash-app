const fs = require('fs');
const path = require('path');

// Read and parse the schedule CSV file
const csvPath = path.join(__dirname, '../assets/kawasaki-schedule.csv');
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

// Helper function to parse specific collection patterns
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
  
  return null;
}

// Skip header
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  const parts = line.split(',');
  if (parts.length < 6) continue;
  
  const [ward, town, normalGarbage, cansBottles, bottlesBatteries, mixedPaper, plasticPackaging, oversized] = parts;
  
  if (!ward || !town) continue;
  
  const areaId = `${ward}-${town}`;
  
  // Parse each collection type according to actual garbage categories
  const schedule = {
    normalGarbage: parseJapaneseDays(normalGarbage),     // 普通ゴミ
    cansBottles: parseJapaneseDays(cansBottles),         // 空き缶・ペットボトル
    glassBottles: parseJapaneseDays(bottlesBatteries),   // 空きびん (from 空きびん・使用済み乾電池)
    usedBatteries: parseJapaneseDays(bottlesBatteries),  // 使用済み乾電池 (same day as bottles)
    mixedPaper: parseJapaneseDays(mixedPaper),           // ミックスペーパー
    plasticPackaging: parseSpecialCollection(plasticPackaging), // プラスチック製容器包装
  };
  
  scheduleMap[areaId] = {
    id: areaId,
    ward,
    area: town,
    schedule
  };
}

// Generate TypeScript file
console.log('// Generated from kawasaki-schedule.csv');
console.log('import type { Area } from "@/types";');
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
  
  if (data.schedule.plasticPackaging) {
    console.log(`      plasticPackaging: { weekday: ${data.schedule.plasticPackaging.weekday}, weeks: [${data.schedule.plasticPackaging.weeks.join(', ')}] },`);
  } else {
    console.log(`      plasticPackaging: { weekday: 3, weeks: [1, 3] },`);
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