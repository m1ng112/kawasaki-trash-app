const fs = require('fs');
const path = require('path');

// Translation mappings for common waste items
const translations = {
  // Common items
  '生ごみ': {
    en: 'Food Waste',
    zh: '厨余垃圾',
    ko: '음식물쓰레기'
  },
  'ペットボトル': {
    en: 'PET Bottle',
    zh: 'PET瓶',
    ko: 'PET병'
  },
  '缶': {
    en: 'Can',
    zh: '罐头',
    ko: '캔'
  },
  '新聞': {
    en: 'Newspaper',
    zh: '报纸',
    ko: '신문'
  },
  '新聞紙': {
    en: 'Newspaper',
    zh: '报纸',
    ko: '신문지'
  },
  '雑誌': {
    en: 'Magazine',
    zh: '杂志',
    ko: '잡지'
  },
  '本': {
    en: 'Book',
    zh: '书籍',
    ko: '책'
  },
  '書籍': {
    en: 'Books',
    zh: '书籍',
    ko: '서적'
  },
  '段ボール': {
    en: 'Cardboard',
    zh: '纸箱',
    ko: '골판지'
  },
  'プラスチック': {
    en: 'Plastic',
    zh: '塑料',
    ko: '플라스틱'
  },
  '電池': {
    en: 'Battery',
    zh: '电池',
    ko: '배터리'
  },
  '家具': {
    en: 'Furniture',
    zh: '家具',
    ko: '가구'
  },
  'チラシ': {
    en: 'Flyer',
    zh: '传单',
    ko: '전단지'
  },
  '包装紙': {
    en: 'Wrapping Paper',
    zh: '包装纸',
    ko: '포장지'
  },
  '封筒': {
    en: 'Envelope',
    zh: '信封',
    ko: '봉투'
  },
  '手紙': {
    en: 'Letter',
    zh: '信件',
    ko: '편지'
  },
  '紙袋': {
    en: 'Paper Bag',
    zh: '纸袋',
    ko: '종이봉투'
  },
  'アルミ': {
    en: 'Aluminum',
    zh: '铝',
    ko: '알루미늄'
  },
  'アルミ缶': {
    en: 'Aluminum Can',
    zh: '铝罐',
    ko: '알루미늄캔'
  },
  'ガラス': {
    en: 'Glass',
    zh: '玻璃',
    ko: '유리'
  },
  'びん': {
    en: 'Bottle',
    zh: '瓶子',
    ko: '병'
  },
  '瓶': {
    en: 'Bottle',
    zh: '瓶子',
    ko: '병'
  },
  '紙おむつ': {
    en: 'Diaper',
    zh: '纸尿裤',
    ko: '기저귀'
  },
  'おむつ': {
    en: 'Diaper',
    zh: '纸尿裤',
    ko: '기저귀'
  },
  '携帯電話': {
    en: 'Mobile Phone',
    zh: '手机',
    ko: '휴대폰'
  },
  'スマートフォン': {
    en: 'Smartphone',
    zh: '智能手机',
    ko: '스마트폰'
  },
  'テレビ': {
    en: 'Television',
    zh: '电视',
    ko: '텔레비전'
  },
  '冷蔵庫': {
    en: 'Refrigerator',
    zh: '冰箱',
    ko: '냉장고'
  },
  '洗濯機': {
    en: 'Washing Machine',
    zh: '洗衣机',
    ko: '세탁기'
  },
  'エアコン': {
    en: 'Air Conditioner',
    zh: '空调',
    ko: '에어컨'
  }
};

// Category translations
const categoryInstructions = {
  burnable: {
    ja: '燃やすごみとして出してください。',
    en: 'Dispose as burnable waste.',
    zh: '请作为可燃垃圾处理。',
    ko: '타는쓰레기로 버려주세요.'
  },
  recyclable: {
    ja: 'リサイクル可能な資源として出してください。',
    en: 'Dispose as recyclable resource.',
    zh: '请作为可回收资源处理。',
    ko: '재활용 자원으로 버려주세요.'
  },
  nonBurnable: {
    ja: '燃やさないごみとして出してください。',
    en: 'Dispose as non-burnable waste.',
    zh: '请作为不可燃垃圾处理。',
    ko: '안타는쓰레기로 버려주세요.'
  },
  oversized: {
    ja: '粗大ごみとして申し込みが必要です。',
    en: 'Application required for oversized waste.',
    zh: '需要申请大型垃圾处理。',
    ko: '대형폐기물로 신청이 필요합니다.'
  }
};

// Function to translate item name using pattern matching
function translateItemName(japaneseName, targetLang) {
  // Direct translation lookup
  if (translations[japaneseName] && translations[japaneseName][targetLang]) {
    return translations[japaneseName][targetLang];
  }
  
  // Pattern-based translations for compound items
  let translatedName = japaneseName;
  
  // Replace known components
  for (const [jpTerm, translations_obj] of Object.entries(translations)) {
    if (japaneseName.includes(jpTerm) && translations_obj[targetLang]) {
      translatedName = translatedName.replace(jpTerm, translations_obj[targetLang]);
    }
  }
  
  // If no translation found, return original for now
  // In a real implementation, you'd use a translation API
  return translatedName === japaneseName ? japaneseName : translatedName;
}

// Function to translate keywords
function translateKeywords(japaneseKeywords, targetLang) {
  const translatedKeywords = [];
  
  japaneseKeywords.forEach(keyword => {
    const translated = translateItemName(keyword, targetLang);
    translatedKeywords.push(translated);
    
    // Also add variations if different
    if (translated !== keyword) {
      translatedKeywords.push(keyword); // Keep original as fallback
    }
  });
  
  // Add some common search terms for each language
  if (targetLang === 'ko') {
    // Add common Korean waste terms
    const commonKoreanTerms = ['쓰레기', '폐기물', '재활용', '분리수거'];
    translatedKeywords.push(...commonKoreanTerms);
  } else if (targetLang === 'zh') {
    // Add common Chinese waste terms
    const commonChineseTerms = ['垃圾', '废物', '回收', '分类'];
    translatedKeywords.push(...commonChineseTerms);
  } else if (targetLang === 'en') {
    // Add common English waste terms
    const commonEnglishTerms = ['waste', 'garbage', 'trash', 'recycling'];
    translatedKeywords.push(...commonEnglishTerms);
  }
  
  return [...new Set(translatedKeywords)]; // Remove duplicates
}

// Function to translate instructions
function translateInstructions(japaneseInstructions, category, targetLang) {
  // Use category-based default instructions
  const defaultInstruction = categoryInstructions[category][targetLang];
  
  // For now, return the default instruction
  // In a real implementation, you'd translate the specific instructions
  return defaultInstruction;
}

// Update the wasteItems.ts file with translations
function addTranslationsToWasteItems() {
  const wasteItemsPath = path.join(__dirname, '..', 'data', 'wasteItems.ts');
  const wasteItemsContent = fs.readFileSync(wasteItemsPath, 'utf-8');
  
  // Extract the wasteItemsData array using regex
  const dataMatch = wasteItemsContent.match(/const wasteItemsData: WasteItemData\[\] = (\[[\s\S]*?\]);/);
  if (!dataMatch) {
    throw new Error('Could not find wasteItemsData in file');
  }
  
  const wasteItemsData = JSON.parse(dataMatch[1]);
  
  console.log(`Processing ${wasteItemsData.length} items for translation...`);
  
  // Update each item with translations
  wasteItemsData.forEach((item, index) => {
    const japaneseName = item.names.ja;
    const japaneseKeywords = item.keywords.ja;
    const japaneseInstructions = item.instructions.ja;
    
    // Translate names
    item.names.en = translateItemName(japaneseName, 'en');
    item.names.zh = translateItemName(japaneseName, 'zh');
    item.names.ko = translateItemName(japaneseName, 'ko');
    
    // Translate keywords
    item.keywords.en = translateKeywords(japaneseKeywords, 'en');
    item.keywords.zh = translateKeywords(japaneseKeywords, 'zh');
    item.keywords.ko = translateKeywords(japaneseKeywords, 'ko');
    
    // Translate instructions
    item.instructions.en = translateInstructions(japaneseInstructions, item.category, 'en');
    item.instructions.zh = translateInstructions(japaneseInstructions, item.category, 'zh');
    item.instructions.ko = translateInstructions(japaneseInstructions, item.category, 'ko');
    
    if ((index + 1) % 500 === 0) {
      console.log(`Processed ${index + 1} items...`);
    }
  });
  
  // Replace the data in the original content
  const updatedContent = wasteItemsContent.replace(
    /const wasteItemsData: WasteItemData\[\] = \[[\s\S]*?\];/,
    `const wasteItemsData: WasteItemData[] = ${JSON.stringify(wasteItemsData, null, 2)};`
  );
  
  // Write back to file
  fs.writeFileSync(wasteItemsPath, updatedContent);
  
  console.log('✅ Successfully added translations to wasteItems.ts');
  
  // Show some translation examples
  console.log('\n📝 Translation examples:');
  const examples = wasteItemsData.slice(0, 5);
  examples.forEach(item => {
    console.log(`Japanese: ${item.names.ja}`);
    console.log(`Korean: ${item.names.ko}`);
    console.log(`Chinese: ${item.names.zh}`);
    console.log(`English: ${item.names.en}`);
    console.log('---');
  });
}

// Run the translation
if (require.main === module) {
  try {
    addTranslationsToWasteItems();
  } catch (error) {
    console.error('❌ Error adding translations:', error);
    process.exit(1);
  }
}

module.exports = { addTranslationsToWasteItems };