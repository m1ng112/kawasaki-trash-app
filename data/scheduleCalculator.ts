import type { Area, WasteCategory } from '@/types';
import { isHoliday } from './holidays';

// Get the week number of month (1-4)
function getWeekOfMonth(date: Date): number {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstWeekday = firstDayOfMonth.getDay();
  const offsetDate = date.getDate() + firstWeekday - 1;
  return Math.ceil(offsetDate / 7);
}

// Check if a date matches the collection schedule for recyclable/non-burnable items
function matchesSpecialSchedule(date: Date, schedule: { weekday: number; weeks: number[] }): boolean {
  const dayOfWeek = date.getDay();
  const weekOfMonth = getWeekOfMonth(date);
  
  return dayOfWeek === schedule.weekday && schedule.weeks.includes(weekOfMonth);
}

// Get collection types for a specific date
export function getCollectionTypes(date: Date, area: Area): WasteCategory[] {
  const dateString = date.toISOString().split('T')[0];
  
  // No collection on holidays
  if (isHoliday(dateString)) {
    return [];
  }
  
  const types: WasteCategory[] = [];
  const dayOfWeek = date.getDay();
  
  // Check normalGarbage (普通ゴミ - simple weekday array)
  if (Array.isArray(area.schedule.normalGarbage) && area.schedule.normalGarbage.includes(dayOfWeek)) {
    types.push('normalGarbage');
  }
  
  // Check cansBottles (空き缶・ペットボトル - simple weekday array)
  if (Array.isArray(area.schedule.cansBottles) && area.schedule.cansBottles.includes(dayOfWeek)) {
    types.push('cansBottles');
  }
  
  // Check glassBottles (空きびん - simple weekday array)
  if (Array.isArray(area.schedule.glassBottles) && area.schedule.glassBottles.includes(dayOfWeek)) {
    types.push('glassBottles');
  }
  
  // Check usedBatteries (使用済み乾電池 - simple weekday array)
  if (Array.isArray(area.schedule.usedBatteries) && area.schedule.usedBatteries.includes(dayOfWeek)) {
    types.push('usedBatteries');
  }
  
  // Check mixedPaper (ミックスペーパー - simple weekday array)
  if (Array.isArray(area.schedule.mixedPaper) && area.schedule.mixedPaper.includes(dayOfWeek)) {
    types.push('mixedPaper');
  }
  
  // Check plasticPackaging (プラスチック製容器包装 - simple weekday array)
  if (Array.isArray(area.schedule.plasticPackaging) && area.schedule.plasticPackaging.includes(dayOfWeek)) {
    types.push('plasticPackaging');
  }
  
  // Check smallMetal (小物金属 - complex schedule with weeks)
  if (area.schedule.smallMetal && typeof area.schedule.smallMetal === 'object' && 'weekday' in area.schedule.smallMetal) {
    if (matchesSpecialSchedule(date, area.schedule.smallMetal)) {
      types.push('smallMetal');
    }
  }
  
  // Note: oversizedWaste (粗大ごみ) is intentionally excluded from calendar display
  
  return types;
}

// Get next collection date and types
export function getNextCollection(area: Area): { date: string; types: WasteCategory[] } | null {
  const today = new Date();
  let checkDate = new Date(today);
  checkDate.setDate(checkDate.getDate() + 1); // Start from tomorrow
  
  // Check up to 14 days in the future
  for (let i = 0; i < 14; i++) {
    const types = getCollectionTypes(checkDate, area);
    
    if (types.length > 0) {
      return {
        date: checkDate.toISOString().split('T')[0],
        types
      };
    }
    
    checkDate.setDate(checkDate.getDate() + 1);
  }
  
  return null;
}

// Get today's collection types
export function getTodayCollection(area: Area): { date: string; types: WasteCategory[] } | null {
  const today = new Date();
  const types = getCollectionTypes(today, area);
  
  if (types.length > 0) {
    return {
      date: today.toISOString().split('T')[0],
      types
    };
  }
  
  return null;
}