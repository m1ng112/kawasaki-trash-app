const fs = require('fs');
const path = require('path');

// Correct waste category names and translations
const wasteCategories = {
  '普通ごみ': {
    ja: '普通ごみ',
    en: 'Burnable Waste',  // 燃えるゴミ
    zh: '可燃垃圾',        // 燃えるゴミ
    ko: '타는쓰레기'       // 燃えるゴミ
  },
  '小物金属': {
    ja: '小物金属',
    en: 'Small Metal Items',
    zh: '小型金属',
    ko: '소형금속'
  },
  'プラスチック資源': {
    ja: 'プラスチック資源',
    en: 'Plastic Resources',
    zh: '塑料资源',
    ko: '플라스틱 자원'
  },
  'ミックスペーパー': {
    ja: 'ミックスペーパー',
    en: 'Mixed Paper',
    zh: '混合纸张',
    ko: '혼합 종이'
  },
  '空き缶・ペットボトル': {
    ja: '空き缶・ペットボトル',
    en: 'Empty Cans & PET Bottles',
    zh: '空罐・PET瓶',
    ko: '빈캔・페트병'
  },
  '空きびん': {
    ja: '空きびん',
    en: 'Empty Glass Bottles',
    zh: '空瓶',
    ko: '빈병'
  },
  '使用済み乾電池': {
    ja: '使用済み乾電池',
    en: 'Used Batteries',
    zh: '废电池',
    ko: '사용한 건전지'
  },
  '粗大ごみ': {
    ja: '粗大ごみ',
    en: 'Oversized Waste',
    zh: '大型垃圾',
    ko: '대형폐기물'
  }
};

// Category mapping to our system
const categoryMapping = {
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

// Instructions for each category
const categoryInstructions = {
  burnable: {
    ja: '普通ごみ（燃やすごみ）として出してください。',
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
    en: 'Application required for oversized waste disposal.',
    zh: '需要申请大型垃圾处理。',
    ko: '대형폐기물로 신청이 필요합니다.'
  }
};

// Update waste items with proper instructions
function updateCategoryInstructions() {
  const wasteItemsPath = path.join(__dirname, '..', 'data', 'wasteItems.ts');
  const wasteItemsContent = fs.readFileSync(wasteItemsPath, 'utf-8');
  
  // Extract the wasteItemsData array
  const dataMatch = wasteItemsContent.match(/const wasteItemsData: WasteItemData\[\] = (\[[\s\S]*?\]);/);
  if (!dataMatch) {
    throw new Error('Could not find wasteItemsData in file');
  }
  
  const wasteItemsData = JSON.parse(dataMatch[1]);
  
  console.log(`Updating category instructions for ${wasteItemsData.length} items...`);
  
  let updatedCount = 0;
  
  // Update each item with proper category instructions
  wasteItemsData.forEach((item, index) => {
    const category = item.category;
    
    // Update instructions based on category
    if (categoryInstructions[category]) {
      const oldInstructions = item.instructions;
      item.instructions = {
        ja: oldInstructions.ja || categoryInstructions[category].ja,
        en: categoryInstructions[category].en,
        zh: categoryInstructions[category].zh,
        ko: categoryInstructions[category].ko
      };
      updatedCount++;
    }
    
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
  
  console.log(`✅ Successfully updated category instructions for ${updatedCount} items`);
  
  // Show examples of category distribution
  console.log('\n📊 Category distribution:');
  const categoryCounts = {};
  wasteItemsData.forEach(item => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });
  
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`${category}: ${count} items`);
  });
  
  // Show some examples
  console.log('\n📝 Instruction examples:');
  const examples = ['burnable', 'recyclable', 'nonBurnable', 'oversized'];
  examples.forEach(category => {
    const example = wasteItemsData.find(item => item.category === category);
    if (example) {
      console.log(`\n${category.toUpperCase()} example: ${example.names.ja}`);
      console.log(`Japanese: ${example.instructions.ja}`);
      console.log(`English: ${example.instructions.en}`);
      console.log(`Korean: ${example.instructions.ko}`);
      console.log(`Chinese: ${example.instructions.zh}`);
    }
  });
}

// Add function to display proper category names in UI
function getCategoryDisplayName(category, language) {
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
}

// Run the update
if (require.main === module) {
  try {
    updateCategoryInstructions();
    
    // Save the category display function to a separate file for use in the app
    const categoryHelperContent = `// Category display names for UI
export const getCategoryDisplayName = ${getCategoryDisplayName.toString()};

export const wasteCategories = ${JSON.stringify(wasteCategories, null, 2)};

export const categoryMapping = ${JSON.stringify(categoryMapping, null, 2)};
`;
    
    fs.writeFileSync(
      path.join(__dirname, '..', 'data', 'categoryHelper.ts'),
      categoryHelperContent
    );
    
    console.log('\n✅ Also created categoryHelper.ts for UI category display');
    
  } catch (error) {
    console.error('❌ Error updating category instructions:', error);
    process.exit(1);
  }
}

module.exports = { updateCategoryInstructions };