const fs = require('fs');
const path = require('path');

// Comprehensive translation dictionary
const completeTranslations = {
  // Electronics and appliances
  'アームスタンド': { en: 'Arm Stand', zh: '支架', ko: '암 스탠드' },
  'アームバンド': { en: 'Armband', zh: '臂章', ko: '완장' },
  'IH調理器': { en: 'IH Cooktop', zh: 'IH炉灶', ko: 'IH 조리기' },
  'ICレコーダー': { en: 'IC Recorder', zh: 'IC录音机', ko: 'IC 레코더' },
  'アイスクラッシャー': { en: 'Ice Crusher', zh: '碎冰机', ko: '아이스 크러셔' },
  'アイスクリームメーカー': { en: 'Ice Cream Maker', zh: '冰淇淋机', ko: '아이스크림 메이커' },
  'アイスピック': { en: 'Ice Pick', zh: '冰锥', ko: '아이스픽' },
  'アイスペール': { en: 'Ice Bucket', zh: '冰桶', ko: '아이스 버킷' },
  'アイスボックス': { en: 'Ice Box', zh: '冰箱', ko: '아이스박스' },
  'アイロン': { en: 'Iron', zh: '熨斗', ko: '다리미' },
  'アイロン台': { en: 'Ironing Board', zh: '熨衣板', ko: '다리미판' },
  'アイロンケース': { en: 'Iron Case', zh: '熨斗盒', ko: '다리미 케이스' },
  'アイロンマット': { en: 'Iron Mat', zh: '熨烫垫', ko: '다리미 매트' },
  'エアコン': { en: 'Air Conditioner', zh: '空调', ko: '에어컨' },
  'テレビ': { en: 'Television', zh: '电视', ko: '텔레비전' },
  '冷蔵庫': { en: 'Refrigerator', zh: '冰箱', ko: '냉장고' },
  '洗濯機': { en: 'Washing Machine', zh: '洗衣机', ko: '세탁기' },
  '電子レンジ': { en: 'Microwave', zh: '微波炉', ko: '전자레인지' },
  'ドライヤー': { en: 'Hair Dryer', zh: '吹风机', ko: '드라이어' },
  '掃除機': { en: 'Vacuum Cleaner', zh: '吸尘器', ko: '청소기' },
  'パソコン': { en: 'Computer', zh: '电脑', ko: '컴퓨터' },
  'ノートパソコン': { en: 'Laptop', zh: '笔记本电脑', ko: '노트북' },
  'スマートフォン': { en: 'Smartphone', zh: '智能手机', ko: '스마트폰' },
  '携帯電話': { en: 'Mobile Phone', zh: '手机', ko: '휴대폰' },
  
  // Cosmetics and personal care
  'アイシャドウチップ': { en: 'Eyeshadow Applicator', zh: '眼影棒', ko: '아이섀도 칩' },
  'アイマスク': { en: 'Eye Mask', zh: '眼罩', ko: '아이마스크' },
  'アイライナー': { en: 'Eyeliner', zh: '眼线笔', ko: '아이라이너' },
  'アイブロー': { en: 'Eyebrow Pencil', zh: '眉笔', ko: '아이브로우' },
  'アクセサリー': { en: 'Accessory', zh: '饰品', ko: '액세서리' },
  '化粧品': { en: 'Cosmetics', zh: '化妆品', ko: '화장품' },
  'シャンプー': { en: 'Shampoo', zh: '洗发水', ko: '샴푸' },
  '歯ブラシ': { en: 'Toothbrush', zh: '牙刷', ko: '칫솔' },
  '歯磨き粉': { en: 'Toothpaste', zh: '牙膏', ko: '치약' },
  
  // Kitchen and dining
  'あく取り': { en: 'Skimmer', zh: '撇油勺', ko: '거품 제거기' },
  '握力計': { en: 'Grip Strength Meter', zh: '握力计', ko: '악력계' },
  '皿': { en: 'Plate', zh: '盘子', ko: '접시' },
  'コップ': { en: 'Cup', zh: '杯子', ko: '컵' },
  '茶碗': { en: 'Rice Bowl', zh: '饭碗', ko: '밥그릇' },
  'フライパン': { en: 'Frying Pan', zh: '平底锅', ko: '프라이팬' },
  '鍋': { en: 'Pot', zh: '锅', ko: '냄비' },
  '包丁': { en: 'Kitchen Knife', zh: '菜刀', ko: '식칼' },
  'まな板': { en: 'Cutting Board', zh: '菜板', ko: '도마' },
  
  // Storage and containers
  'アクリルケース': { en: 'Acrylic Case', zh: '丙烯酸盒', ko: '아크릴 케이스' },
  'アタッシュケース': { en: 'Attaché Case', zh: '公文包', ko: '서류가방' },
  'アルミケース': { en: 'Aluminum Case', zh: '铝箱', ko: '알루미늄 케이스' },
  
  // Paper and reading materials
  '雑誌': { en: 'Magazine', zh: '杂志', ko: '잡지' },
  '本': { en: 'Book', zh: '书', ko: '책' },
  '書籍': { en: 'Books', zh: '书籍', ko: '서적' },
  '新聞': { en: 'Newspaper', zh: '报纸', ko: '신문' },
  '新聞紙': { en: 'Newspaper', zh: '报纸', ko: '신문지' },
  'チラシ': { en: 'Flyer', zh: '传单', ko: '전단지' },
  '広告': { en: 'Advertisement', zh: '广告', ko: '광고' },
  'カタログ': { en: 'Catalog', zh: '目录', ko: '카탈로그' },
  'パンフレット': { en: 'Pamphlet', zh: '小册子', ko: '팸플릿' },
  '封筒': { en: 'Envelope', zh: '信封', ko: '봉투' },
  '手紙': { en: 'Letter', zh: '信件', ko: '편지' },
  'はがき': { en: 'Postcard', zh: '明信片', ko: '엽서' },
  '包装紙': { en: 'Wrapping Paper', zh: '包装纸', ko: '포장지' },
  '紙袋': { en: 'Paper Bag', zh: '纸袋', ko: '종이봉투' },
  '段ボール': { en: 'Cardboard', zh: '纸箱', ko: '골판지' },
  
  // Containers and bottles
  'ペットボトル': { en: 'PET Bottle', zh: 'PET瓶', ko: 'PET병' },
  'びん': { en: 'Bottle', zh: '瓶子', ko: '병' },
  '瓶': { en: 'Bottle', zh: '瓶子', ko: '병' },
  'ガラス瓶': { en: 'Glass Bottle', zh: '玻璃瓶', ko: '유리병' },
  '缶': { en: 'Can', zh: '罐', ko: '캔' },
  'アルミ缶': { en: 'Aluminum Can', zh: '铝罐', ko: '알루미늄캔' },
  'スチール缶': { en: 'Steel Can', zh: '钢罐', ko: '스틸캔' },
  '空き缶': { en: 'Empty Can', zh: '空罐', ko: '빈캔' },
  
  // Plastic items
  'プラスチック': { en: 'Plastic', zh: '塑料', ko: '플라스틱' },
  'ビニール': { en: 'Vinyl', zh: '乙烯基', ko: '비닐' },
  'ビニール袋': { en: 'Plastic Bag', zh: '塑料袋', ko: '비닐봉지' },
  'レジ袋': { en: 'Shopping Bag', zh: '购物袋', ko: '쇼핑백' },
  
  // Electronics
  '電池': { en: 'Battery', zh: '电池', ko: '배터리' },
  'バッテリー': { en: 'Battery', zh: '电池', ko: '배터리' },
  '乾電池': { en: 'Dry Cell Battery', zh: '干电池', ko: '건전지' },
  
  // Furniture
  '家具': { en: 'Furniture', zh: '家具', ko: '가구' },
  '椅子': { en: 'Chair', zh: '椅子', ko: '의자' },
  'テーブル': { en: 'Table', zh: '桌子', ko: '테이블' },
  '机': { en: 'Desk', zh: '书桌', ko: '책상' },
  'ベッド': { en: 'Bed', zh: '床', ko: '침대' },
  'ソファ': { en: 'Sofa', zh: '沙发', ko: '소파' },
  
  // Clothing and textiles
  '服': { en: 'Clothes', zh: '衣服', ko: '옷' },
  '衣類': { en: 'Clothing', zh: '服装', ko: '의류' },
  'シャツ': { en: 'Shirt', zh: '衬衫', ko: '셔츠' },
  'ズボン': { en: 'Pants', zh: '裤子', ko: '바지' },
  '靴': { en: 'Shoes', zh: '鞋子', ko: '신발' },
  'バッグ': { en: 'Bag', zh: '包', ko: '가방' },
  'タオル': { en: 'Towel', zh: '毛巾', ko: '수건' },
  
  // Food and organic waste
  '生ごみ': { en: 'Food Waste', zh: '厨余垃圾', ko: '음식물쓰레기' },
  '野菜': { en: 'Vegetables', zh: '蔬菜', ko: '채소' },
  '肉': { en: 'Meat', zh: '肉类', ko: '고기' },
  '魚': { en: 'Fish', zh: '鱼', ko: '생선' },
  '果物': { en: 'Fruit', zh: '水果', ko: '과일' },
  'パン': { en: 'Bread', zh: '面包', ko: '빵' },
  '米': { en: 'Rice', zh: '米饭', ko: '쌀' },
  
  // Personal care items
  'おむつ': { en: 'Diaper', zh: '尿布', ko: '기저귀' },
  '紙おむつ': { en: 'Disposable Diaper', zh: '纸尿裤', ko: '일회용기저귀' },
  
  // Sports and outdoor
  '自転車': { en: 'Bicycle', zh: '自行车', ko: '자전거' },
  'ボール': { en: 'Ball', zh: '球', ko: '공' },
  'ラケット': { en: 'Racket', zh: '球拍', ko: '라켓' },
  'ゴルフクラブ': { en: 'Golf Club', zh: '高尔夫球杆', ko: '골프클럽' },
  
  // Materials
  'ガラス': { en: 'Glass', zh: '玻璃', ko: '유리' },
  '陶器': { en: 'Pottery', zh: '陶器', ko: '도자기' },
  '金属': { en: 'Metal', zh: '金属', ko: '금속' },
  'アルミ': { en: 'Aluminum', zh: '铝', ko: '알루미늄' },
  '鉄': { en: 'Iron', zh: '铁', ko: '철' },
  '銅': { en: 'Copper', zh: '铜', ko: '구리' },
  
  // Common descriptors
  '小型': { en: 'Small', zh: '小型', ko: '소형' },
  '大型': { en: 'Large', zh: '大型', ko: '대형' },
  '電気': { en: 'Electric', zh: '电', ko: '전기' },
  '使い捨て': { en: 'Disposable', zh: '一次性', ko: '일회용' },
  '古い': { en: 'Old', zh: '旧', ko: '오래된' },
  '壊れた': { en: 'Broken', zh: '破损', ko: '고장난' },
  '金属製': { en: 'Metal', zh: '金属制', ko: '금속제' },
  'プラスチック製': { en: 'Plastic', zh: '塑料制', ko: '플라스틱제' },
  '紙製': { en: 'Paper', zh: '纸制', ko: '종이제' },
  'ガラス製': { en: 'Glass', zh: '玻璃制', ko: '유리제' },
  '木製': { en: 'Wood', zh: '木制', ko: '목제' }
};

// Function to translate a Japanese name using multiple strategies
function translateItemName(japaneseName, targetLang) {
  // Strategy 1: Direct lookup
  if (completeTranslations[japaneseName]) {
    return completeTranslations[japaneseName][targetLang];
  }
  
  // Strategy 2: Component-based translation
  let translatedName = japaneseName;
  let wasTranslated = false;
  
  // Sort keys by length (longest first) to handle compound words correctly
  const sortedKeys = Object.keys(completeTranslations).sort((a, b) => b.length - a.length);
  
  for (const jpTerm of sortedKeys) {
    if (japaneseName.includes(jpTerm)) {
      const translation = completeTranslations[jpTerm][targetLang];
      translatedName = translatedName.replace(jpTerm, translation);
      wasTranslated = true;
    }
  }
  
  // Strategy 3: Pattern-based translation for common patterns
  if (!wasTranslated) {
    // Handle parenthetical descriptions like (金属製), (プラスチック製), etc.
    translatedName = translatedName.replace(/（([^）]+)）/g, (match, content) => {
      if (completeTranslations[content]) {
        return `(${completeTranslations[content][targetLang]})`;
      }
      return match;
    });
    
    // Handle の connector
    if (targetLang === 'en') {
      translatedName = translatedName.replace(/の/g, ' ');
    } else if (targetLang === 'zh') {
      translatedName = translatedName.replace(/の/g, '的');
    } else if (targetLang === 'ko') {
      translatedName = translatedName.replace(/の/g, '의');
    }
  }
  
  return translatedName;
}

// Function to translate keywords
function translateKeywords(japaneseKeywords, targetLang) {
  const translatedKeywords = [];
  const addedTerms = new Set();
  
  // Add core translations for each keyword
  japaneseKeywords.forEach(keyword => {
    const translated = translateItemName(keyword, targetLang);
    if (!addedTerms.has(translated.toLowerCase())) {
      translatedKeywords.push(translated);
      addedTerms.add(translated.toLowerCase());
    }
  });
  
  // Add common search terms for the language
  const commonTerms = {
    en: ['arm', 'stand', 'monitor', 'support', 'holder', 'mount'],
    zh: ['支架', '支撑', '架子', '固定', '支持'],
    ko: ['스탠드', '지지대', '받침대', '고정대', '홀더']
  };
  
  if (commonTerms[targetLang]) {
    commonTerms[targetLang].forEach(term => {
      if (!addedTerms.has(term.toLowerCase())) {
        translatedKeywords.push(term);
        addedTerms.add(term.toLowerCase());
      }
    });
  }
  
  return translatedKeywords;
}

// Function to completely retranslate all items
function completeRetranslation() {
  const wasteItemsPath = path.join(__dirname, '..', 'data', 'wasteItems.ts');
  const wasteItemsContent = fs.readFileSync(wasteItemsPath, 'utf-8');
  
  // Extract the wasteItemsData array
  const dataMatch = wasteItemsContent.match(/const wasteItemsData: WasteItemData\[\] = (\[[\s\S]*?\]);/);
  if (!dataMatch) {
    throw new Error('Could not find wasteItemsData in file');
  }
  
  const wasteItemsData = JSON.parse(dataMatch[1]);
  
  console.log(`Retranslating ${wasteItemsData.length} items completely...`);
  
  let translatedCount = 0;
  
  // Update each item with proper translations
  wasteItemsData.forEach((item, index) => {
    const japaneseName = item.names.ja;
    const japaneseKeywords = item.keywords.ja;
    
    // Translate names
    const englishName = translateItemName(japaneseName, 'en');
    const chineseName = translateItemName(japaneseName, 'zh');
    const koreanName = translateItemName(japaneseName, 'ko');
    
    // Only update if translation is different from original
    if (englishName !== japaneseName) {
      item.names.en = englishName;
      translatedCount++;
    }
    if (chineseName !== japaneseName) {
      item.names.zh = chineseName;
    }
    if (koreanName !== japaneseName) {
      item.names.ko = koreanName;
    }
    
    // Translate keywords
    item.keywords.en = translateKeywords(japaneseKeywords, 'en');
    item.keywords.zh = translateKeywords(japaneseKeywords, 'zh');
    item.keywords.ko = translateKeywords(japaneseKeywords, 'ko');
    
    if ((index + 1) % 500 === 0) {
      console.log(`Processed ${index + 1} items... (Translated: ${translatedCount})`);
    }
  });
  
  // Replace the data in the original content
  const updatedContent = wasteItemsContent.replace(
    /const wasteItemsData: WasteItemData\[\] = \[[\s\S]*?\];/,
    `const wasteItemsData: WasteItemData[] = ${JSON.stringify(wasteItemsData, null, 2)};`
  );
  
  // Write back to file
  fs.writeFileSync(wasteItemsPath, updatedContent);
  
  console.log(`✅ Successfully retranslated all items (${translatedCount} items had name changes)`);
  
  // Show examples of the first few items
  console.log('\\n📝 Translation examples:');
  wasteItemsData.slice(0, 10).forEach(item => {
    console.log(`Japanese: ${item.names.ja}`);
    console.log(`English: ${item.names.en}`);
    console.log(`Korean: ${item.names.ko}`);
    console.log(`Chinese: ${item.names.zh}`);
    console.log('---');
  });
}

// Run the complete retranslation
if (require.main === module) {
  try {
    completeRetranslation();
  } catch (error) {
    console.error('❌ Error retranslating items:', error);
    process.exit(1);
  }
}

module.exports = { completeRetranslation };