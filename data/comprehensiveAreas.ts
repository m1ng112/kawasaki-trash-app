import { Area } from '@/types';
import { kawasakiWardTownMap } from './wardTownMapComplete';

// Collection schedule patterns for different areas
const schedulePatterns = {
  // Pattern A: Mon/Thu for burnable, 1st/3rd Tue for recyclable, 2nd/4th Tue for non-burnable
  patternA: {
    burnable: [1, 4], // Monday, Thursday
    recyclable: { weekday: 2, weeks: [1, 3] }, // 1st/3rd Tuesday
    nonBurnable: { weekday: 2, weeks: [2, 4] }, // 2nd/4th Tuesday
  },
  // Pattern B: Tue/Fri for burnable, 1st/3rd Wed for recyclable, 2nd/4th Wed for non-burnable
  patternB: {
    burnable: [2, 5], // Tuesday, Friday
    recyclable: { weekday: 3, weeks: [1, 3] }, // 1st/3rd Wednesday
    nonBurnable: { weekday: 3, weeks: [2, 4] }, // 2nd/4th Wednesday
  },
  // Pattern C: Wed/Sat for burnable, 1st/3rd Thu for recyclable, 2nd/4th Thu for non-burnable
  patternC: {
    burnable: [3, 6], // Wednesday, Saturday
    recyclable: { weekday: 4, weeks: [1, 3] }, // 1st/3rd Thursday
    nonBurnable: { weekday: 4, weeks: [2, 4] }, // 2nd/4th Thursday
  },
};

// Assign schedule patterns to wards
const wardSchedulePatterns: Record<string, keyof typeof schedulePatterns> = {
  '川崎区': 'patternA',
  '幸区': 'patternB',
  '中原区': 'patternC',
  '高津区': 'patternA',
  '宮前区': 'patternB',
  '多摩区': 'patternC',
  '麻生区': 'patternA',
};

// Generate comprehensive area data for all towns
export const comprehensiveKawasakiAreas: Area[] = [];

Object.entries(kawasakiWardTownMap).forEach(([ward, towns]) => {
  const pattern = schedulePatterns[wardSchedulePatterns[ward]];
  
  towns.forEach((town, index) => {
    comprehensiveKawasakiAreas.push({
      id: `${ward}-${town}`,
      ward: ward as any, // We'll fix the type later
      area: town,
      schedule: pattern,
    });
  });
});

// Helper function to get area by ward and town
export function getAreaByWardAndTown(ward: string, town: string): Area | undefined {
  return comprehensiveKawasakiAreas.find(
    area => area.ward === ward && area.area === town
  );
}

// Helper function to get areas by ward
export function getAreasByWardComprehensive(ward: string): Area[] {
  return comprehensiveKawasakiAreas.filter(area => area.ward === ward);
}

// Helper function to get area by ID
export function getAreaByIdComprehensive(id: string): Area | undefined {
  return comprehensiveKawasakiAreas.find(area => area.id === id);
}