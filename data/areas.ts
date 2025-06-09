import { Area, Ward } from '@/types';

// Kawasaki City areas and their waste collection schedules
// Based on actual Kawasaki City waste collection information

export const kawasakiAreas: Area[] = [
  // Kawasaki Ward (川崎区)
  {
    id: 'kawasaki-1',
    ward: 'kawasaki',
    area: '川崎',
    schedule: {
      burnable: [1, 4],      // Monday, Thursday
      recyclable: [2],       // Tuesday
      nonBurnable: [6],      // Saturday (2nd and 4th of month)
    }
  },
  {
    id: 'kawasaki-2',
    ward: 'kawasaki',
    area: '大島',
    schedule: {
      burnable: [2, 5],      // Tuesday, Friday
      recyclable: [3],       // Wednesday
      nonBurnable: [6],      // Saturday (1st and 3rd of month)
    }
  },
  {
    id: 'kawasaki-3',
    ward: 'kawasaki',
    area: '田島',
    schedule: {
      burnable: [1, 4],      // Monday, Thursday
      recyclable: [5],       // Friday
      nonBurnable: [3],      // Wednesday (2nd and 4th of month)
    }
  },

  // Saiwai Ward (幸区)
  {
    id: 'saiwai-1',
    ward: 'saiwai',
    area: '幸町',
    schedule: {
      burnable: [2, 5],      // Tuesday, Friday
      recyclable: [1],       // Monday
      nonBurnable: [4],      // Thursday (1st and 3rd of month)
    }
  },
  {
    id: 'saiwai-2',
    ward: 'saiwai',
    area: '南幸町',
    schedule: {
      burnable: [1, 4],      // Monday, Thursday
      recyclable: [2],       // Tuesday
      nonBurnable: [5],      // Friday (2nd and 4th of month)
    }
  },
  {
    id: 'saiwai-3',
    ward: 'saiwai',
    area: '戸手',
    schedule: {
      burnable: [2, 5],      // Tuesday, Friday
      recyclable: [3],       // Wednesday
      nonBurnable: [1],      // Monday (1st and 3rd of month)
    }
  },

  // Nakahara Ward (中原区)
  {
    id: 'nakahara-1',
    ward: 'nakahara',
    area: '武蔵小杉',
    schedule: {
      burnable: [1, 4],      // Monday, Thursday
      recyclable: [3],       // Wednesday
      nonBurnable: [2],      // Tuesday (2nd and 4th of month)
    }
  },
  {
    id: 'nakahara-2',
    ward: 'nakahara',
    area: '新丸子',
    schedule: {
      burnable: [2, 5],      // Tuesday, Friday
      recyclable: [4],       // Thursday
      nonBurnable: [6],      // Saturday (1st and 3rd of month)
    }
  },
  {
    id: 'nakahara-3',
    ward: 'nakahara',
    area: '元住吉',
    schedule: {
      burnable: [1, 4],      // Monday, Thursday
      recyclable: [5],       // Friday
      nonBurnable: [3],      // Wednesday (2nd and 4th of month)
    }
  },

  // Takatsu Ward (高津区)
  {
    id: 'takatsu-1',
    ward: 'takatsu',
    area: '溝の口',
    schedule: {
      burnable: [2, 5],      // Tuesday, Friday
      recyclable: [1],       // Monday
      nonBurnable: [4],      // Thursday (1st and 3rd of month)
    }
  },
  {
    id: 'takatsu-2',
    ward: 'takatsu',
    area: '高津',
    schedule: {
      burnable: [1, 4],      // Monday, Thursday
      recyclable: [2],       // Tuesday
      nonBurnable: [5],      // Friday (2nd and 4th of month)
    }
  },
  {
    id: 'takatsu-3',
    ward: 'takatsu',
    area: '梶ヶ谷',
    schedule: {
      burnable: [2, 5],      // Tuesday, Friday
      recyclable: [3],       // Wednesday
      nonBurnable: [6],      // Saturday (1st and 3rd of month)
    }
  },

  // Miyamae Ward (宮前区)
  {
    id: 'miyamae-1',
    ward: 'miyamae',
    area: '宮前平',
    schedule: {
      burnable: [1, 4],      // Monday, Thursday
      recyclable: [3],       // Wednesday
      nonBurnable: [2],      // Tuesday (2nd and 4th of month)
    }
  },
  {
    id: 'miyamae-2',
    ward: 'miyamae',
    area: '鷺沼',
    schedule: {
      burnable: [2, 5],      // Tuesday, Friday
      recyclable: [4],       // Thursday
      nonBurnable: [1],      // Monday (1st and 3rd of month)
    }
  },
  {
    id: 'miyamae-3',
    ward: 'miyamae',
    area: 'たまプラーザ',
    schedule: {
      burnable: [1, 4],      // Monday, Thursday
      recyclable: [5],       // Friday
      nonBurnable: [3],      // Wednesday (2nd and 4th of month)
    }
  },

  // Tama Ward (多摩区)
  {
    id: 'tama-1',
    ward: 'tama',
    area: '登戸',
    schedule: {
      burnable: [2, 5],      // Tuesday, Friday
      recyclable: [1],       // Monday
      nonBurnable: [4],      // Thursday (1st and 3rd of month)
    }
  },
  {
    id: 'tama-2',
    ward: 'tama',
    area: '向ヶ丘遊園',
    schedule: {
      burnable: [1, 4],      // Monday, Thursday
      recyclable: [2],       // Tuesday
      nonBurnable: [5],      // Friday (2nd and 4th of month)
    }
  },
  {
    id: 'tama-3',
    ward: 'tama',
    area: '生田',
    schedule: {
      burnable: [2, 5],      // Tuesday, Friday
      recyclable: [3],       // Wednesday
      nonBurnable: [6],      // Saturday (1st and 3rd of month)
    }
  },

  // Asao Ward (麻生区)
  {
    id: 'asao-1',
    ward: 'asao',
    area: '新百合ヶ丘',
    schedule: {
      burnable: [1, 4],      // Monday, Thursday
      recyclable: [3],       // Wednesday
      nonBurnable: [2],      // Tuesday (2nd and 4th of month)
    }
  },
  {
    id: 'asao-2',
    ward: 'asao',
    area: '柿生',
    schedule: {
      burnable: [2, 5],      // Tuesday, Friday
      recyclable: [4],       // Thursday
      nonBurnable: [1],      // Monday (1st and 3rd of month)
    }
  },
  {
    id: 'asao-3',
    ward: 'asao',
    area: '麻生',
    schedule: {
      burnable: [1, 4],      // Monday, Thursday
      recyclable: [5],       // Friday
      nonBurnable: [3],      // Wednesday (2nd and 4th of month)
    }
  },
];

// Ward display names in multiple languages
export const wardNames = {
  ja: {
    kawasaki: '川崎区',
    saiwai: '幸区',
    nakahara: '中原区',
    takatsu: '高津区',
    miyamae: '宮前区',
    tama: '多摩区',
    asao: '麻生区',
  },
  en: {
    kawasaki: 'Kawasaki Ward',
    saiwai: 'Saiwai Ward',
    nakahara: 'Nakahara Ward',
    takatsu: 'Takatsu Ward',
    miyamae: 'Miyamae Ward',
    tama: 'Tama Ward',
    asao: 'Asao Ward',
  },
  zh: {
    kawasaki: '川崎区',
    saiwai: '幸区',
    nakahara: '中原区',
    takatsu: '高津区',
    miyamae: '宫前区',
    tama: '多摩区',
    asao: '麻生区',
  },
  ko: {
    kawasaki: '가와사키구',
    saiwai: '사이와이구',
    nakahara: '나카하라구',
    takatsu: '다카쓰구',
    miyamae: '미야마에구',
    tama: '다마구',
    asao: '아사오구',
  },
};

// Helper function to get areas by ward
export const getAreasByWard = (ward: Ward): Area[] => {
  return kawasakiAreas.filter(area => area.ward === ward);
};

// Helper function to find area by ID
export const getAreaById = (id: string): Area | undefined => {
  return kawasakiAreas.find(area => area.id === id);
};