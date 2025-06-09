import { Holiday } from '@/types';

// Kawasaki City holidays and special collection dates for 2024-2025
// Waste collection is typically suspended on these days and moved to alternative dates

export const holidays2024: Holiday[] = [
  // 2024 holidays
  { date: '2024-01-01', name: '元日', alternativeDate: '2024-01-04' },
  { date: '2024-01-08', name: '成人の日' },
  { date: '2024-02-11', name: '建国記念の日', alternativeDate: '2024-02-12' },
  { date: '2024-02-12', name: '振替休日' },
  { date: '2024-02-23', name: '天皇誕生日' },
  { date: '2024-03-20', name: '春分の日' },
  { date: '2024-04-29', name: '昭和の日' },
  { date: '2024-05-03', name: '憲法記念日' },
  { date: '2024-05-04', name: 'みどりの日' },
  { date: '2024-05-05', name: 'こどもの日' },
  { date: '2024-05-06', name: '振替休日' },
  { date: '2024-07-15', name: '海の日' },
  { date: '2024-08-11', name: '山の日' },
  { date: '2024-08-12', name: '振替休日' },
  { date: '2024-09-16', name: '敬老の日' },
  { date: '2024-09-22', name: '秋分の日' },
  { date: '2024-09-23', name: '振替休日' },
  { date: '2024-10-14', name: 'スポーツの日' },
  { date: '2024-11-03', name: '文化の日' },
  { date: '2024-11-04', name: '振替休日' },
  { date: '2024-11-23', name: '勤労感謝の日' },
  { date: '2024-12-29', name: '年末特別期間開始' },
  { date: '2024-12-30', name: '年末' },
  { date: '2024-12-31', name: '大晦日' },
];

export const holidays2025: Holiday[] = [
  // 2025 holidays
  { date: '2025-01-01', name: '元日' },
  { date: '2025-01-02', name: '年始' },
  { date: '2025-01-03', name: '年始' },
  { date: '2025-01-13', name: '成人の日' },
  { date: '2025-02-11', name: '建国記念の日' },
  { date: '2025-02-23', name: '天皇誕生日' },
  { date: '2025-02-24', name: '振替休日' },
  { date: '2025-03-20', name: '春分の日' },
  { date: '2025-04-29', name: '昭和の日' },
  { date: '2025-05-03', name: '憲法記念日' },
  { date: '2025-05-04', name: 'みどりの日' },
  { date: '2025-05-05', name: 'こどもの日' },
  { date: '2025-05-06', name: '振替休日' },
  { date: '2025-07-21', name: '海の日' },
  { date: '2025-08-11', name: '山の日' },
  { date: '2025-09-15', name: '敬老の日' },
  { date: '2025-09-23', name: '秋分の日' },
  { date: '2025-10-13', name: 'スポーツの日' },
  { date: '2025-11-03', name: '文化の日' },
  { date: '2025-11-23', name: '勤労感謝の日' },
  { date: '2025-11-24', name: '振替休日' },
  { date: '2025-12-29', name: '年末特別期間開始' },
  { date: '2025-12-30', name: '年末' },
  { date: '2025-12-31', name: '大晦日' },
];

// Combine all holidays
export const allHolidays: Holiday[] = [...holidays2024, ...holidays2025];

// Helper functions
export const isHoliday = (date: string): boolean => {
  return allHolidays.some(holiday => holiday.date === date);
};

export const getHoliday = (date: string): Holiday | undefined => {
  return allHolidays.find(holiday => holiday.date === date);
};

export const getHolidaysByMonth = (year: number, month: number): Holiday[] => {
  const monthStr = month.toString().padStart(2, '0');
  const targetYearMonth = `${year}-${monthStr}`;
  
  return allHolidays.filter(holiday => 
    holiday.date.startsWith(targetYearMonth)
  );
};

export const hasAlternativeCollection = (date: string): string | null => {
  const holiday = getHoliday(date);
  return holiday?.alternativeDate || null;
};

// Special collection rules for Kawasaki City
export const specialCollectionRules = {
  // Year-end collection suspension period
  yearEndSuspension: {
    start: '12-29',
    end: '01-03',
    message: {
      ja: '年末年始期間中はごみ収集を休止します。次回収集日をご確認ください。',
      en: 'Waste collection is suspended during the year-end and New Year period.',
      zh: '年末年初期间暂停垃圾收集。',
      ko: '연말연시 기간 중 쓰레기 수거를 중단합니다.',
    }
  },
  
  // Golden Week adjustments
  goldenWeekAdjustment: {
    period: ['05-03', '05-04', '05-05'],
    message: {
      ja: 'ゴールデンウィーク期間中は収集日程が変更される場合があります。',
      en: 'Collection schedule may be adjusted during Golden Week.',
      zh: '黄金周期间收集时间可能会调整。',
      ko: '골든위크 기간 중 수거 일정이 조정될 수 있습니다.',
    }
  },
  
  // Typhoon/weather warnings
  weatherWarning: {
    message: {
      ja: '台風や大雨の際は、安全のため収集を中止する場合があります。',
      en: 'Collection may be suspended during typhoons or heavy rain for safety.',
      zh: '台风或大雨时，为了安全可能会暂停收集。',
      ko: '태풍이나 폭우 시 안전을 위해 수거를 중단할 수 있습니다.',
    }
  }
};