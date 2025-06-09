// Category display names for UI
export const getCategoryDisplayName = function getCategoryDisplayName(category, language) {
  const displayNames = {
    burnable: {
      ja: '普通ごみ',
      en: 'Burnable Waste',
      zh: '可燃垃圾',
      ko: '타는쓰레기'
    },
    recyclable: {
      ja: 'リサイクル資源',
      en: 'Recyclable Resources',
      zh: '可回收资源',
      ko: '재활용 자원'
    },
    nonBurnable: {
      ja: '小物金属・燃やさないごみ',
      en: 'Small Metal Items / Non-burnable',
      zh: '小型金属・不可燃垃圾',
      ko: '소형금속・안타는쓰레기'
    },
    oversized: {
      ja: '粗大ごみ',
      en: 'Oversized Waste',
      zh: '大型垃圾',
      ko: '대형폐기물'
    }
  };
  
  return displayNames[category]?.[language] || displayNames[category]?.ja || category;
};

export const wasteCategories = {
  "普通ごみ": {
    "ja": "普通ごみ",
    "en": "Burnable Waste",
    "zh": "可燃垃圾",
    "ko": "타는쓰레기"
  },
  "小物金属": {
    "ja": "小物金属",
    "en": "Small Metal Items",
    "zh": "小型金属",
    "ko": "소형금속"
  },
  "プラスチック資源": {
    "ja": "プラスチック資源",
    "en": "Plastic Resources",
    "zh": "塑料资源",
    "ko": "플라스틱 자원"
  },
  "ミックスペーパー": {
    "ja": "ミックスペーパー",
    "en": "Mixed Paper",
    "zh": "混合纸张",
    "ko": "혼합 종이"
  },
  "空き缶・ペットボトル": {
    "ja": "空き缶・ペットボトル",
    "en": "Empty Cans & PET Bottles",
    "zh": "空罐・PET瓶",
    "ko": "빈캔・페트병"
  },
  "空きびん": {
    "ja": "空きびん",
    "en": "Empty Glass Bottles",
    "zh": "空瓶",
    "ko": "빈병"
  },
  "使用済み乾電池": {
    "ja": "使用済み乾電池",
    "en": "Used Batteries",
    "zh": "废电池",
    "ko": "사용한 건전지"
  },
  "粗大ごみ": {
    "ja": "粗大ごみ",
    "en": "Oversized Waste",
    "zh": "大型垃圾",
    "ko": "대형폐기물"
  }
};

export const categoryMapping = {
  "普通ごみ": "burnable",
  "プラスチック製容器包装": "recyclable",
  "プラスチック資源": "recyclable",
  "ミックスペーパー": "recyclable",
  "空きびん": "recyclable",
  "空き缶・ペットボトル": "recyclable",
  "資源集団回収": "recyclable",
  "小物金属": "nonBurnable",
  "使用済み乾電池": "nonBurnable",
  "粗大ごみ": "oversized",
  "その他": "burnable"
};
