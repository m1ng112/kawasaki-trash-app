import { getCollectionTypes, getNextCollection, getTodayCollection } from '../scheduleCalculator';
import { isHoliday } from '../holidays';
import type { Area, WasteCategory } from '@/types';

// Mock the holidays module
jest.mock('../holidays');

describe('scheduleCalculator', () => {
  const mockIsHoliday = isHoliday as jest.MockedFunction<typeof isHoliday>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsHoliday.mockReturnValue(false);
  });

  // Mock area data
  const mockArea: Area = {
    id: 'test-area',
    name_jp: 'テストエリア',
    name_en: 'Test Area',
    district: 'test-district',
    schedule: {
      normalGarbage: [1, 5], // Monday and Friday
      cansBottles: [3], // Wednesday
      glassBottles: [2], // Tuesday
      usedBatteries: [2], // Tuesday
      mixedPaper: [4], // Thursday
      plasticPackaging: [6], // Saturday
      smallMetal: {
        weekday: 0, // Sunday
        weeks: [1, 3] // 1st and 3rd week
      },
      oversizedWaste: 'reservation'
    }
  };

  describe('getWeekOfMonth', () => {
    it('should calculate week of month correctly', () => {
      // Test internal function indirectly through getCollectionTypes
      // January 1, 2024 is a Monday
      const date1 = new Date(2024, 0, 1); // 1st week
      const date2 = new Date(2024, 0, 8); // 2nd week
      const date3 = new Date(2024, 0, 15); // 3rd week
      const date4 = new Date(2024, 0, 22); // 4th week

      // Set these dates to Sunday to test smallMetal collection
      date1.setDate(7); // Jan 7, 2024 - 1st Sunday
      date3.setDate(21); // Jan 21, 2024 - 3rd Sunday

      const types1 = getCollectionTypes(date1, mockArea);
      const types3 = getCollectionTypes(date3, mockArea);

      expect(types1).toContain('smallMetal');
      expect(types3).toContain('smallMetal');
    });
  });

  describe('getCollectionTypes', () => {
    it('should return empty array for holidays', () => {
      mockIsHoliday.mockReturnValue(true);
      const date = new Date(2024, 0, 1); // Monday
      
      const types = getCollectionTypes(date, mockArea);
      
      expect(types).toEqual([]);
      // Use the actual date string that getCollectionTypes will generate
      const expectedDateString = date.toISOString().split('T')[0];
      expect(mockIsHoliday).toHaveBeenCalledWith(expectedDateString);
    });

    it('should return normalGarbage on Mondays and Fridays', () => {
      const monday = new Date(2024, 0, 1); // Monday
      const friday = new Date(2024, 0, 5); // Friday
      
      const mondayTypes = getCollectionTypes(monday, mockArea);
      const fridayTypes = getCollectionTypes(friday, mockArea);
      
      expect(mondayTypes).toContain('normalGarbage');
      expect(fridayTypes).toContain('normalGarbage');
    });

    it('should return multiple collection types on the same day', () => {
      const tuesday = new Date(2024, 0, 2); // Tuesday
      
      const types = getCollectionTypes(tuesday, mockArea);
      
      expect(types).toContain('glassBottles');
      expect(types).toContain('usedBatteries');
      expect(types.length).toBe(2);
    });

    it('should return cansBottles on Wednesday', () => {
      const wednesday = new Date(2024, 0, 3); // Wednesday
      
      const types = getCollectionTypes(wednesday, mockArea);
      
      expect(types).toContain('cansBottles');
    });

    it('should return mixedPaper on Thursday', () => {
      const thursday = new Date(2024, 0, 4); // Thursday
      
      const types = getCollectionTypes(thursday, mockArea);
      
      expect(types).toContain('mixedPaper');
    });

    it('should return plasticPackaging on Saturday', () => {
      const saturday = new Date(2024, 0, 6); // Saturday
      
      const types = getCollectionTypes(saturday, mockArea);
      
      expect(types).toContain('plasticPackaging');
    });

    it('should return smallMetal on 1st and 3rd Sunday', () => {
      const firstSunday = new Date(2024, 0, 7); // 1st Sunday
      const thirdSunday = new Date(2024, 0, 21); // 3rd Sunday
      const secondSunday = new Date(2024, 0, 14); // 2nd Sunday
      
      const firstTypes = getCollectionTypes(firstSunday, mockArea);
      const thirdTypes = getCollectionTypes(thirdSunday, mockArea);
      const secondTypes = getCollectionTypes(secondSunday, mockArea);
      
      expect(firstTypes).toContain('smallMetal');
      expect(thirdTypes).toContain('smallMetal');
      expect(secondTypes).not.toContain('smallMetal');
    });

    it('should not include oversizedWaste in collection types', () => {
      // Test all days of the week
      for (let i = 0; i < 7; i++) {
        const date = new Date(2024, 0, i + 1);
        const types = getCollectionTypes(date, mockArea);
        expect(types).not.toContain('oversizedWaste');
      }
    });

    it('should handle areas with empty schedules', () => {
      const emptyArea: Area = {
        ...mockArea,
        schedule: {
          normalGarbage: [],
          cansBottles: [],
          glassBottles: [],
          usedBatteries: [],
          mixedPaper: [],
          plasticPackaging: [],
          smallMetal: { weekday: 0, weeks: [] },
          oversizedWaste: 'reservation'
        }
      };

      const date = new Date(2024, 0, 1);
      const types = getCollectionTypes(date, emptyArea);
      
      expect(types).toEqual([]);
    });
  });

  describe('getNextCollection', () => {
    beforeEach(() => {
      // Mock Date to be January 1, 2024 (Monday)
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2024, 0, 1, 10, 0, 0));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return next collection date and types', () => {
      const result = getNextCollection(mockArea);
      
      expect(result).not.toBeNull();
      expect(result?.date).toBe('2024-01-02'); // Tuesday
      expect(result?.types).toContain('glassBottles');
      expect(result?.types).toContain('usedBatteries');
    });

    it('should skip holidays when finding next collection', () => {
      mockIsHoliday.mockImplementation((date) => date === '2024-01-02');
      
      const result = getNextCollection(mockArea);
      
      expect(result).not.toBeNull();
      expect(result?.date).toBe('2024-01-03'); // Wednesday (skipping Tuesday holiday)
      expect(result?.types).toContain('cansBottles');
    });

    it('should return null if no collection in next 14 days', () => {
      const emptyArea: Area = {
        ...mockArea,
        schedule: {
          normalGarbage: [],
          cansBottles: [],
          glassBottles: [],
          usedBatteries: [],
          mixedPaper: [],
          plasticPackaging: [],
          smallMetal: { weekday: 0, weeks: [] },
          oversizedWaste: 'reservation'
        }
      };

      const result = getNextCollection(emptyArea);
      
      expect(result).toBeNull();
    });
  });

  describe('getTodayCollection', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return today\'s collection if available', () => {
      // Set today to Monday
      jest.setSystemTime(new Date(2024, 0, 1, 10, 0, 0));
      
      const result = getTodayCollection(mockArea);
      
      expect(result).not.toBeNull();
      expect(result?.date).toBe('2024-01-01');
      expect(result?.types).toContain('normalGarbage');
    });

    it('should return null if no collection today', () => {
      // Set today to Sunday (no normal collection except smallMetal on specific weeks)
      jest.setSystemTime(new Date(2024, 0, 14, 10, 0, 0)); // 2nd Sunday - no smallMetal
      
      const result = getTodayCollection(mockArea);
      
      expect(result).toBeNull();
    });

    it('should return null if today is a holiday', () => {
      mockIsHoliday.mockReturnValue(true);
      jest.setSystemTime(new Date(2024, 0, 1, 10, 0, 0)); // Monday
      
      const result = getTodayCollection(mockArea);
      
      expect(result).toBeNull();
    });
  });
});