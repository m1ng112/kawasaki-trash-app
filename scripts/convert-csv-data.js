const fs = require('fs');
const path = require('path');

// Category mapping from Kawasaki CSV to our system
const categoryMapping = {
  '普通ごみ': 'burnable',
  'プラスチック製容器包装': 'recyclable',
  'ミックスペーパー': 'recyclable',
  '空きびん': 'recyclable',
  '空き缶・ペットボトル': 'recyclable',
  '資源集団回収': 'recyclable',
  '小物金属': 'nonBurnable',
  '使用済み乾電池': 'nonBurnable',
  '粗大ごみ': 'oversized',
  'その他': 'burnable', // Default to burnable for "other"
  '': 'burnable' // Default for empty categories
};

// Function to get emoji based on item name and category
function getEmoji(itemName, category) {
  const name = itemName.toLowerCase();
  
  // Food-related items
  if (name.includes('食') || name.includes('生ごみ') || name.includes('野菜') || name.includes('魚') || name.includes('肉')) {
    return '🗑️';
  }
  
  // Paper items
  if (name.includes('紙') || name.includes('新聞') || name.includes('雑誌') || name.includes('本') || name.includes('チラシ')) {
    return '📄';
  }
  
  // Bottles and containers
  if (name.includes('ペットボトル') || name.includes('ボトル')) {
    return '🍶';
  }
  
  // Cans
  if (name.includes('缶') || name.includes('アルミ') || name.includes('スチール')) {
    return '🥫';
  }
  
  // Electronics
  if (name.includes('電') || name.includes('バッテリー') || name.includes('充電')) {
    return '🔌';
  }
  
  // Batteries
  if (name.includes('電池') || name.includes('バッテリー')) {
    return '🔋';
  }
  
  // Furniture
  if (name.includes('家具') || name.includes('椅子') || name.includes('机') || name.includes('テーブル')) {
    return '🪑';
  }
  
  // Plastic items
  if (name.includes('プラスチック') || name.includes('ビニール')) {
    return '🛍️';
  }
  
  // Default by category
  switch (category) {
    case 'burnable': return '🗑️';
    case 'recyclable': return '♻️';
    case 'nonBurnable': return '🔩';
    case 'oversized': return '📦';
    default: return '📦';
  }
}

// Function to clean and split keywords
function processKeywords(keywordsStr, itemName, reading) {
  const keywords = [];
  
  // Add the main item name
  keywords.push(itemName);
  
  // Add reading (pronunciation)
  if (reading && reading.trim()) {
    keywords.push(reading);
  }
  
  // Split and clean the keywords from the CSV
  if (keywordsStr && keywordsStr.trim()) {
    const rawKeywords = keywordsStr.split(/[\s　]+/); // Split by space or full-width space
    rawKeywords.forEach(keyword => {
      const cleaned = keyword.trim();
      if (cleaned && !keywords.includes(cleaned)) {
        keywords.push(cleaned);
      }
    });
  }
  
  return keywords;
}

// Function to process disposal instructions
function processInstructions(detailsStr, pointsStr) {
  let instructions = '';
  
  if (detailsStr && detailsStr.trim()) {
    instructions += detailsStr.trim();
  }
  
  if (pointsStr && pointsStr.trim()) {
    if (instructions) {
      instructions += ' ';
    }
    instructions += pointsStr.trim();
  }
  
  // Clean up instructions - remove URLs and excessive formatting
  instructions = instructions
    .replace(/http[s]?:\/\/[^\s,]+/g, '') // Remove URLs
    .replace(/\/+/g, ' ') // Replace multiple slashes with space
    .replace(/【[^】]*】/g, '') // Remove bracketed region info
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  return instructions || '適切に分別して出してください。';
}

// Read and parse CSV
function convertCsvToWasteItems() {
  const csvPath = path.join(__dirname, '..', 'assets', 'garbage_data_utf8.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');
  
  const wasteItems = [];
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse CSV line (simple split by comma - may need improvement for complex cases)
    const columns = line.split(',');
    if (columns.length < 6) continue;
    
    const [id, firstLetter, itemName, reading, keywords, disposalCategory, disposalDetails, disposalPoints, url] = columns;
    
    if (!itemName || !itemName.trim()) continue;
    
    const category = categoryMapping[disposalCategory] || 'burnable';
    const processedKeywords = processKeywords(keywords, itemName, reading);
    const instructions = processInstructions(disposalDetails, disposalPoints);
    
    const wasteItem = {
      id: `csv-${id}`,
      names: {
        ja: itemName.trim(),
        en: itemName.trim(), // Would need translation
        zh: itemName.trim(), // Would need translation
        ko: itemName.trim()  // Would need translation
      },
      keywords: {
        ja: processedKeywords,
        en: [itemName.trim()], // Would need translation
        zh: [itemName.trim()], // Would need translation
        ko: [itemName.trim()]  // Would need translation
      },
      category: category,
      instructions: {
        ja: instructions,
        en: instructions, // Would need translation
        zh: instructions, // Would need translation
        ko: instructions  // Would need translation
      },
      icon: getEmoji(itemName, category)
    };
    
    wasteItems.push(wasteItem);
  }
  
  return wasteItems;
}

// Generate the new wasteItems.ts file
function generateWasteItemsFile() {
  const wasteItems = convertCsvToWasteItems();
  
  console.log(`Converted ${wasteItems.length} items from CSV`);
  
  // Group by category for statistics
  const categoryStats = {};
  wasteItems.forEach(item => {
    categoryStats[item.category] = (categoryStats[item.category] || 0) + 1;
  });
  
  console.log('Category distribution:', categoryStats);
  
  // Generate TypeScript content
  const tsContent = `import { WasteItem } from '@/types';

// Multilingual waste sorting database for Kawasaki City
// Based on official Kawasaki City waste sorting guidelines
// Converted from official CSV database (${new Date().toISOString()})

type WasteItemData = {
  id: string;
  names: {
    ja: string;
    en: string;
    zh: string;
    ko: string;
  };
  keywords: {
    ja: string[];
    en: string[];
    zh: string[];
    ko: string[];
  };
  category: 'burnable' | 'recyclable' | 'nonBurnable' | 'oversized';
  instructions: {
    ja: string;
    en: string;
    zh: string;
    ko: string;
  };
  icon: string;
};

const wasteItemsData: WasteItemData[] = ${JSON.stringify(wasteItems, null, 2)};

// Helper function to get localized waste items
export const getLocalizedWasteItems = (language: string): WasteItem[] => {
  const lang = language as 'ja' | 'en' | 'zh' | 'ko';
  
  return wasteItemsData.map(item => ({
    id: item.id,
    name: item.names[lang] || item.names.ja,
    keywords: [
      ...item.keywords[lang] || item.keywords.ja,
      ...item.keywords.ja, // Always include Japanese keywords for fallback
      // Add cross-language keywords for better search
      ...(lang !== 'en' ? item.keywords.en : []),
      ...(lang !== 'zh' ? item.keywords.zh : []),
      ...(lang !== 'ko' ? item.keywords.ko : [])
    ].filter((keyword, index, array) => array.indexOf(keyword) === index), // Remove duplicates
    category: item.category,
    instructions: item.instructions[lang] || item.instructions.ja,
    icon: item.icon,
  }));
};

// Export default Japanese version for compatibility
export const wasteItems: WasteItem[] = getLocalizedWasteItems('ja');

// Helper function to calculate Levenshtein distance for fuzzy matching
const calculateLevenshteinDistance = (str1: string, str2: string): number => {
  const matrix = [];
  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,     // deletion
        matrix[i][j - 1] + 1,     // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
};

// Helper function to normalize text for search (handles multi-language)
const normalizeSearchText = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    // Remove common punctuation and whitespace
    .replace(/[\\s\\-_.,!?()]/g, '')
    // Normalize full-width characters to half-width
    .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
    .replace(/[Ａ-Ｚａ-ｚ]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
};

// Language-specific phonetic similarity functions
const getPhoneticSimilarity = (query: string, target: string, language: string): number => {
  const normalizedQuery = normalizeSearchText(query);
  const normalizedTarget = normalizeSearchText(target);
  
  // Japanese phonetic similarity (hiragana/katakana conversion)
  if (language === 'ja') {
    const hiraganaQuery = convertToHiragana(normalizedQuery);
    const hiraganaTarget = convertToHiragana(normalizedTarget);
    
    if (hiraganaQuery === hiraganaTarget) {
      return 800;
    }
    if (hiraganaTarget.includes(hiraganaQuery)) {
      return 400;
    }
  }
  
  // Korean phonetic similarity (jamo decomposition)
  if (language === 'ko') {
    const jamoQuery = decomposeHangul(normalizedQuery);
    const jamoTarget = decomposeHangul(normalizedTarget);
    
    if (jamoQuery === jamoTarget) {
      return 800;
    }
    if (jamoTarget.includes(jamoQuery)) {
      return 400;
    }
  }
  
  return 0;
};

// Convert katakana to hiragana for Japanese phonetic matching
const convertToHiragana = (text: string): string => {
  return text.replace(/[\\u30A1-\\u30F6]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) - 0x60);
  });
};

// Decompose Hangul characters to jamo for Korean phonetic matching
const decomposeHangul = (text: string): string => {
  return text.replace(/[\\uAC00-\\uD7AF]/g, (char) => {
    const code = char.charCodeAt(0) - 0xAC00;
    const jong = code % 28;
    const jung = (code - jong) / 28 % 21;
    const cho = ((code - jong) / 28 - jung) / 21;
    
    const choBase = 0x1100;
    const jungBase = 0x1161;
    const jongBase = 0x11A7;
    
    let result = String.fromCharCode(choBase + cho) + String.fromCharCode(jungBase + jung);
    if (jong > 0) {
      result += String.fromCharCode(jongBase + jong);
    }
    return result;
  });
};

// Helper function to calculate fuzzy similarity score
const calculateFuzzyScore = (query: string, target: string, language: string): number => {
  const normalizedQuery = normalizeSearchText(query);
  const normalizedTarget = normalizeSearchText(target);
  
  // Exact match
  if (normalizedQuery === normalizedTarget) {
    return 1000;
  }
  
  // Contains match
  if (normalizedTarget.includes(normalizedQuery)) {
    const containsScore = 500 + (100 * normalizedQuery.length / normalizedTarget.length);
    return Math.round(containsScore);
  }
  
  // Starts with match
  if (normalizedTarget.startsWith(normalizedQuery)) {
    return 300;
  }
  
  // Phonetic similarity check
  const phoneticScore = getPhoneticSimilarity(query, target, language);
  if (phoneticScore > 0) {
    return phoneticScore;
  }
  
  // Fuzzy match using Levenshtein distance
  const distance = calculateLevenshteinDistance(normalizedQuery, normalizedTarget);
  const maxLength = Math.max(normalizedQuery.length, normalizedTarget.length);
  
  if (distance <= 1 && maxLength >= 3) {
    return 250 - (distance * 50);
  } else if (distance <= 2 && maxLength >= 4) {
    return 150 - (distance * 25);
  } else if (distance <= 3 && maxLength >= 6) {
    return 100 - (distance * 10);
  }
  
  return 0;
};

// Enhanced search function with multi-stage algorithm and fuzzy matching
export const searchWasteItems = (query: string, language: string = 'ja'): WasteItem[] => {
  if (!query || query.trim() === '') {
    return [];
  }

  const items = getLocalizedWasteItems(language);
  const normalizedQuery = normalizeSearchText(query);
  
  // If query is too short, require exact match or close fuzzy match
  const minLength = /[\\u4e00-\\u9fff\\u3400-\\u4dbf\\u3040-\\u309f\\u30a0-\\u30ff\\uac00-\\ud7af]/.test(query) ? 1 : 2;
  
  if (normalizedQuery.length < minLength) {
    return items.filter(item => {
      const normalizedName = normalizeSearchText(item.name);
      return normalizedName === normalizedQuery ||
        item.keywords.some(keyword => normalizeSearchText(keyword) === normalizedQuery);
    });
  }

  // Multi-stage search with comprehensive scoring
  const results = items.map(item => {
    let maxScore = 0;
    
    // Check item name
    const nameScore = calculateFuzzyScore(query, item.name, language);
    maxScore = Math.max(maxScore, nameScore);
    
    // Check all keywords
    item.keywords.forEach(keyword => {
      const keywordScore = calculateFuzzyScore(query, keyword, language);
      // Keywords get slightly lower priority than names
      maxScore = Math.max(maxScore, Math.floor(keywordScore * 0.9));
    });
    
    // Apply bonus for exact character count matches
    if (maxScore > 0) {
      const queryLength = normalizedQuery.length;
      const nameLength = normalizeSearchText(item.name).length;
      
      if (queryLength === nameLength) {
        maxScore += 100; // Exact length bonus
      } else if (Math.abs(queryLength - nameLength) <= 2) {
        maxScore += 50; // Close length bonus
      }
    }
    
    return { item, score: maxScore };
  })
  .filter(result => result.score > 0)
  .sort((a, b) => {
    // Sort by score first, then by name length (shorter = more specific)
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    return a.item.name.length - b.item.name.length;
  })
  .map(result => result.item);

  return results;
};

export const getItemsByCategory = (category: string, language: string = 'ja'): WasteItem[] => {
  const items = getLocalizedWasteItems(language);
  return items.filter(item => item.category === category);
};

export const getItemById = (id: string, language: string = 'ja'): WasteItem | undefined => {
  const items = getLocalizedWasteItems(language);
  return items.find(item => item.id === id);
};

// Get search suggestions based on query
export const getSearchSuggestions = (query: string, language: string = 'ja', limit: number = 5): string[] => {
  if (!query || query.trim().length === 0) {
    return getPopularSearchTerms(language, limit);
  }

  const items = getLocalizedWasteItems(language);
  const normalizedQuery = normalizeSearchText(query.toLowerCase());
  
  const suggestions = new Set<string>();
  
  // Collect potential suggestions from names and keywords
  items.forEach(item => {
    // Check item name
    const normalizedName = normalizeSearchText(item.name.toLowerCase());
    if (normalizedName.includes(normalizedQuery) || normalizedQuery.includes(normalizedName)) {
      suggestions.add(item.name);
    }
    
    // Check keywords
    item.keywords.forEach(keyword => {
      const normalizedKeyword = normalizeSearchText(keyword.toLowerCase());
      if (normalizedKeyword.includes(normalizedQuery) || normalizedQuery.includes(normalizedKeyword)) {
        suggestions.add(keyword);
      }
    });
  });
  
  // Convert to array and sort by relevance
  return Array.from(suggestions)
    .map(suggestion => ({
      text: suggestion,
      score: calculateFuzzyScore(query, suggestion, language)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.text);
};

// Get popular search terms by language
export const getPopularSearchTerms = (language: string = 'ja', limit: number = 10): string[] => {
  const popularTerms = {
    ja: ['生ごみ', 'ペットボトル', '缶', '新聞', '雑誌', 'プラスチック', '段ボール', '紙おむつ', 'チラシ', '包装紙'],
    en: ['food waste', 'plastic bottle', 'can', 'newspaper', 'magazine', 'plastic', 'cardboard', 'diaper', 'flyer', 'paper'],
    zh: ['厨余垃圾', '塑料瓶', '罐头', '报纸', '杂志', '塑料', '纸箱', '纸尿裤', '传单', '包装纸'],
    ko: ['음식물쓰레기', '플라스틱병', '캔', '신문', '잡지', '플라스틱', '골판지', '기저귀', '전단지', '포장지']
  };
  
  const terms = popularTerms[language as keyof typeof popularTerms] || popularTerms.ja;
  return terms.slice(0, limit);
};

// Get "Did you mean" suggestions for no results
export const getDidYouMeanSuggestions = (query: string, language: string = 'ja', limit: number = 3): string[] => {
  const items = getLocalizedWasteItems(language);
  const allTerms: string[] = [];
  
  // Collect all possible terms
  items.forEach(item => {
    allTerms.push(item.name);
    allTerms.push(...item.keywords);
  });
  
  // Find closest matches using Levenshtein distance
  return allTerms
    .map(term => ({
      term,
      distance: calculateLevenshteinDistance(normalizeSearchText(query), normalizeSearchText(term))
    }))
    .filter(item => item.distance <= 3 && item.distance > 0) // Close but not exact
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map(item => item.term);
};
`;

  return { content: tsContent, stats: categoryStats, count: wasteItems.length };
}

// Main execution
if (require.main === module) {
  try {
    const result = generateWasteItemsFile();
    
    // Write to backup file first
    const backupPath = path.join(__dirname, '..', 'data', 'wasteItems.backup.ts');
    const originalPath = path.join(__dirname, '..', 'data', 'wasteItems.ts');
    
    // Backup original file
    if (fs.existsSync(originalPath)) {
      fs.copyFileSync(originalPath, backupPath);
      console.log('Original file backed up to wasteItems.backup.ts');
    }
    
    // Write new file
    fs.writeFileSync(originalPath, result.content);
    
    console.log('\\n✅ Successfully generated new wasteItems.ts file');
    console.log(`📊 Total items: ${result.count}`);
    console.log('📊 Category distribution:');
    Object.entries(result.stats).forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`);
    });
    
  } catch (error) {
    console.error('❌ Error converting CSV:', error);
    process.exit(1);
  }
}

module.exports = { generateWasteItemsFile };