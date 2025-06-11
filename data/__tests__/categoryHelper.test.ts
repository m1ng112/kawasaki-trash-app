import { getCategoryDisplayName, wasteCategories, categoryMapping } from '../categoryHelper';
import type { Language, WasteCategory } from '@/types';

describe('categoryHelper', () => {
  describe('getCategoryDisplayName', () => {
    const testCases: Array<{
      category: WasteCategory;
      language: Language;
      expected: string;
    }> = [
      // Normal Garbage
      { category: 'normalGarbage', language: 'ja', expected: '普通ゴミ' },
      { category: 'normalGarbage', language: 'en', expected: 'Normal Garbage' },
      { category: 'normalGarbage', language: 'zh', expected: '普通垃圾' },
      { category: 'normalGarbage', language: 'ko', expected: '일반쓰레기' },
      
      // Cans & Bottles
      { category: 'cansBottles', language: 'ja', expected: '空き缶・ペットボトル' },
      { category: 'cansBottles', language: 'en', expected: 'Empty Cans & PET Bottles' },
      { category: 'cansBottles', language: 'zh', expected: '空罐・PET瓶' },
      { category: 'cansBottles', language: 'ko', expected: '빈캔・페트병' },
      
      // Glass Bottles
      { category: 'glassBottles', language: 'ja', expected: '空きびん' },
      { category: 'glassBottles', language: 'en', expected: 'Empty Glass Bottles' },
      { category: 'glassBottles', language: 'zh', expected: '空瓶' },
      { category: 'glassBottles', language: 'ko', expected: '빈병' },
      
      // Used Batteries
      { category: 'usedBatteries', language: 'ja', expected: '使用済み乾電池' },
      { category: 'usedBatteries', language: 'en', expected: 'Used Batteries' },
      { category: 'usedBatteries', language: 'zh', expected: '废电池' },
      { category: 'usedBatteries', language: 'ko', expected: '사용한 건전지' },
      
      // Mixed Paper
      { category: 'mixedPaper', language: 'ja', expected: 'ミックスペーパー' },
      { category: 'mixedPaper', language: 'en', expected: 'Mixed Paper' },
      { category: 'mixedPaper', language: 'zh', expected: '混合纸张' },
      { category: 'mixedPaper', language: 'ko', expected: '혼합 종이' },
      
      // Plastic Packaging
      { category: 'plasticPackaging', language: 'ja', expected: 'プラスチック製容器包装' },
      { category: 'plasticPackaging', language: 'en', expected: 'Plastic Packaging' },
      { category: 'plasticPackaging', language: 'zh', expected: '塑料包装' },
      { category: 'plasticPackaging', language: 'ko', expected: '플라스틱 포장' },
      
      // Small Metal
      { category: 'smallMetal', language: 'ja', expected: '小物金属' },
      { category: 'smallMetal', language: 'en', expected: 'Small Metal Items' },
      { category: 'smallMetal', language: 'zh', expected: '小型金属' },
      { category: 'smallMetal', language: 'ko', expected: '소형금속' },
      
      // Oversized Waste
      { category: 'oversizedWaste', language: 'ja', expected: '粗大ごみ' },
      { category: 'oversizedWaste', language: 'en', expected: 'Oversized Waste' },
      { category: 'oversizedWaste', language: 'zh', expected: '大型垃圾' },
      { category: 'oversizedWaste', language: 'ko', expected: '대형폐기물' },
      
      // Legacy categories for backward compatibility
      { category: 'burnable', language: 'ja', expected: '普通ごみ' },
      { category: 'burnable', language: 'en', expected: 'Burnable Waste' },
      { category: 'recyclable', language: 'ja', expected: 'リサイクル資源' },
      { category: 'recyclable', language: 'en', expected: 'Recyclable Resources' },
      { category: 'nonBurnable', language: 'ja', expected: '小物金属・燃やさないごみ' },
      { category: 'nonBurnable', language: 'en', expected: 'Small Metal Items / Non-burnable' },
      { category: 'oversized', language: 'ja', expected: '粗大ごみ' },
      { category: 'oversized', language: 'en', expected: 'Oversized Waste' },
    ];

    test.each(testCases)(
      'returns $expected for category $category in language $language',
      ({ category, language, expected }) => {
        expect(getCategoryDisplayName(category, language)).toBe(expected);
      }
    );

    it('should fall back to Japanese if language is not supported', () => {
      // @ts-expect-error Testing invalid language
      expect(getCategoryDisplayName('normalGarbage', 'fr')).toBe('普通ゴミ');
    });

    it('should return category name if category is not found', () => {
      // @ts-expect-error Testing invalid category
      expect(getCategoryDisplayName('unknownCategory', 'en')).toBe('unknownCategory');
    });

    it('should handle undefined language gracefully', () => {
      // @ts-expect-error Testing undefined language
      expect(getCategoryDisplayName('normalGarbage', undefined)).toBe('普通ゴミ');
    });
  });

  describe('wasteCategories', () => {
    it('should have all required categories', () => {
      const expectedCategories = [
        '普通ごみ',
        '小物金属',
        'プラスチック資源',
        'ミックスペーパー',
        '空き缶・ペットボトル',
        '空きびん',
        '使用済み乾電池',
        '粗大ごみ'
      ];

      expectedCategories.forEach(category => {
        expect(wasteCategories).toHaveProperty(category);
      });
    });

    it('should have translations for all languages', () => {
      const languages = ['ja', 'en', 'zh', 'ko'];
      
      Object.entries(wasteCategories).forEach(([category, translations]) => {
        languages.forEach(lang => {
          expect(translations).toHaveProperty(lang);
          expect(translations[lang]).toBeTruthy();
        });
      });
    });

    it('should have Japanese names matching the category keys', () => {
      Object.entries(wasteCategories).forEach(([category, translations]) => {
        expect(translations.ja).toBe(category);
      });
    });
  });

  describe('categoryMapping', () => {
    it('should map all waste categories to collection types', () => {
      const expectedMappings = {
        '普通ごみ': 'burnable',
        'プラスチック製容器包装': 'recyclable',
        'プラスチック資源': 'recyclable',
        'ミックスペーパー': 'recyclable',
        '空きびん': 'recyclable',
        '空き缶・ペットボトル': 'recyclable',
        '資源集団回収': 'recyclable',
        '小物金属': 'nonBurnable',
        '使用済み乾電池': 'nonBurnable',
        '粗大ごみ': 'oversized',
        'その他': 'burnable'
      };

      expect(categoryMapping).toEqual(expectedMappings);
    });

    it('should only map to valid collection types', () => {
      const validTypes = ['burnable', 'recyclable', 'nonBurnable', 'oversized'];
      
      Object.values(categoryMapping).forEach(type => {
        expect(validTypes).toContain(type);
      });
    });

    it('should have consistent mappings for similar categories', () => {
      // All plastic-related categories should map to recyclable
      expect(categoryMapping['プラスチック製容器包装']).toBe('recyclable');
      expect(categoryMapping['プラスチック資源']).toBe('recyclable');
      
      // All metal/battery categories should map to nonBurnable
      expect(categoryMapping['小物金属']).toBe('nonBurnable');
      expect(categoryMapping['使用済み乾電池']).toBe('nonBurnable');
    });
  });

  describe('Integration tests', () => {
    it('should have consistent category names between getCategoryDisplayName and wasteCategories', () => {
      const categoryKeys = Object.keys(wasteCategories);
      
      // Map of new category names to old Japanese names
      const newToOld = {
        normalGarbage: '普通ごみ',
        smallMetal: '小物金属',
        mixedPaper: 'ミックスペーパー',
        cansBottles: '空き缶・ペットボトル',
        glassBottles: '空きびん',
        usedBatteries: '使用済み乾電池',
        oversizedWaste: '粗大ごみ'
      };

      Object.entries(newToOld).forEach(([newCat, oldCat]) => {
        const displayNameJa = getCategoryDisplayName(newCat as WasteCategory, 'ja');
        const wasteCategoryJa = wasteCategories[oldCat]?.ja;
        
        // They should match (allowing for slight variations like ゴミ vs ごみ)
        expect(displayNameJa.replace(/ゴミ/g, 'ごみ')).toBe(wasteCategoryJa);
      });
    });
  });
});