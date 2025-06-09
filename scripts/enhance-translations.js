const fs = require('fs');
const path = require('path');

// Enhanced translation dictionary with more comprehensive mappings
const enhancedTranslations = {
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
  'ダンボール': { en: 'Cardboard', zh: '纸箱', ko: '골판지' },
  
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
  'ペットボトルキャップ': { en: 'PET Bottle Cap', zh: 'PET瓶盖', ko: 'PET병뚜껑' },
  
  // Electronics
  '電池': { en: 'Battery', zh: '电池', ko: '배터리' },
  'バッテリー': { en: 'Battery', zh: '电池', ko: '배터리' },
  '乾電池': { en: 'Dry Cell Battery', zh: '干电池', ko: '건전지' },
  '携帯電話': { en: 'Mobile Phone', zh: '手机', ko: '휴대폰' },
  'スマートフォン': { en: 'Smartphone', zh: '智能手机', ko: '스마트폰' },
  'テレビ': { en: 'Television', zh: '电视机', ko: '텔레비전' },
  'パソコン': { en: 'Computer', zh: '电脑', ko: '컴퓨터' },
  'ノートパソコン': { en: 'Laptop', zh: '笔记本电脑', ko: '노트북' },
  
  // Appliances
  '冷蔵庫': { en: 'Refrigerator', zh: '冰箱', ko: '냉장고' },
  '洗濯機': { en: 'Washing Machine', zh: '洗衣机', ko: '세탁기' },
  'エアコン': { en: 'Air Conditioner', zh: '空调', ko: '에어컨' },
  '電子レンジ': { en: 'Microwave', zh: '微波炉', ko: '전자레인지' },
  'ドライヤー': { en: 'Hair Dryer', zh: '吹风机', ko: '드라이어' },
  'アイロン': { en: 'Iron', zh: '熨斗', ko: '다리미' },
  '掃除機': { en: 'Vacuum Cleaner', zh: '吸尘器', ko: '청소기' },
  
  // Furniture
  '家具': { en: 'Furniture', zh: '家具', ko: '가구' },
  '椅子': { en: 'Chair', zh: '椅子', ko: '의자' },
  'テーブル': { en: 'Table', zh: '桌子', ko: '테이블' },
  '机': { en: 'Desk', zh: '书桌', ko: '책상' },
  'ベッド': { en: 'Bed', zh: '床', ko: '침대' },
  'ソファ': { en: 'Sofa', zh: '沙发', ko: '소파' },
  'タンス': { en: 'Chest of Drawers', zh: '衣柜', ko: '장롱' },
  
  // Clothing and textiles
  '服': { en: 'Clothes', zh: '衣服', ko: '옷' },
  '衣類': { en: 'Clothing', zh: '服装', ko: '의류' },
  'シャツ': { en: 'Shirt', zh: '衬衫', ko: '셔츠' },
  'ズボン': { en: 'Pants', zh: '裤子', ko: '바지' },
  '靴': { en: 'Shoes', zh: '鞋子', ko: '신발' },
  'バッグ': { en: 'Bag', zh: '包', ko: '가방' },
  'カバン': { en: 'Bag', zh: '包', ko: '가방' },
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
  '化粧品': { en: 'Cosmetics', zh: '化妆品', ko: '화장품' },
  'シャンプー': { en: 'Shampoo', zh: '洗发水', ko: '샴푸' },
  '歯ブラシ': { en: 'Toothbrush', zh: '牙刷', ko: '칫솔' },
  '歯磨き粉': { en: 'Toothpaste', zh: '牙膏', ko: '치약' },
  'おむつ': { en: 'Diaper', zh: '尿布', ko: '기저귀' },
  '紙おむつ': { en: 'Disposable Diaper', zh: '纸尿裤', ko: '일회용기저귀' },
  
  // Tools and hardware
  '工具': { en: 'Tools', zh: '工具', ko: '도구' },
  'ハンマー': { en: 'Hammer', zh: '锤子', ko: '망치' },
  'ドライバー': { en: 'Screwdriver', zh: '螺丝刀', ko: '드라이버' },
  'ペンチ': { en: 'Pliers', zh: '钳子', ko: '펜치' },
  'はさみ': { en: 'Scissors', zh: '剪刀', ko: '가위' },
  'ナイフ': { en: 'Knife', zh: '刀', ko: '칼' },
  
  // Sports and leisure
  '自転車': { en: 'Bicycle', zh: '自行车', ko: '자전거' },
  'ボール': { en: 'Ball', zh: '球', ko: '공' },
  'ラケット': { en: 'Racket', zh: '球拍', ko: '라켓' },
  'ゴルフクラブ': { en: 'Golf Club', zh: '高尔夫球杆', ko: '골프클럽' },
  
  // Kitchen items
  '皿': { en: 'Plate', zh: '盘子', ko: '접시' },
  'コップ': { en: 'Cup', zh: '杯子', ko: '컵' },
  '茶碗': { en: 'Rice Bowl', zh: '饭碗', ko: '밥그릇' },
  'フライパン': { en: 'Frying Pan', zh: '平底锅', ko: '프라이팬' },
  '鍋': { en: 'Pot', zh: '锅', ko: '냄비' },
  '包丁': { en: 'Kitchen Knife', zh: '菜刀', ko: '식칼' },
  'まな板': { en: 'Cutting Board', zh: '菜板', ko: '도마' },
  
  // Glass and ceramics
  'ガラス': { en: 'Glass', zh: '玻璃', ko: '유리' },
  '陶器': { en: 'Pottery', zh: '陶器', ko: '도자기' },
  '磁器': { en: 'Porcelain', zh: '瓷器', ko: '자기' },
  
  // Metal items
  '金属': { en: 'Metal', zh: '金属', ko: '금속' },
  'アルミ': { en: 'Aluminum', zh: '铝', ko: '알루미늄' },
  '鉄': { en: 'Iron', zh: '铁', ko: '철' },
  '銅': { en: 'Copper', zh: '铜', ko: '구리' },
  
  // Common prefixes and suffixes
  '小型': { en: 'Small', zh: '小型', ko: '소형' },
  '大型': { en: 'Large', zh: '大型', ko: '대형' },
  '電気': { en: 'Electric', zh: '电', ko: '전기' },
  '使い捨て': { en: 'Disposable', zh: '一次性', ko: '일회용' },
  '古い': { en: 'Old', zh: '旧', ko: '오래된' },
  '壊れた': { en: 'Broken', zh: '破损', ko: '고장난' }
};

// Function to enhance existing translations with better matches
function enhanceTranslations() {
  const wasteItemsPath = path.join(__dirname, '..', 'data', 'wasteItems.ts');
  const wasteItemsContent = fs.readFileSync(wasteItemsPath, 'utf-8');
  
  // Extract the wasteItemsData array
  const dataMatch = wasteItemsContent.match(/const wasteItemsData: WasteItemData\[\] = (\[[\s\S]*?\]);/);
  if (!dataMatch) {
    throw new Error('Could not find wasteItemsData in file');
  }
  
  const wasteItemsData = JSON.parse(dataMatch[1]);
  
  console.log(`Enhancing translations for ${wasteItemsData.length} items...`);
  
  let enhancedCount = 0;
  
  // Update each item with better translations
  wasteItemsData.forEach((item, index) => {
    const japaneseName = item.names.ja;
    let wasEnhanced = false;
    
    // Try to find better translations
    for (const [jpTerm, translations] of Object.entries(enhancedTranslations)) {
      if (japaneseName.includes(jpTerm)) {
        // Enhance names
        if (japaneseName === jpTerm) {
          // Exact match - use direct translation
          item.names.en = translations.en;
          item.names.zh = translations.zh;
          item.names.ko = translations.ko;
          wasEnhanced = true;
        } else if (japaneseName.startsWith(jpTerm) || japaneseName.includes(jpTerm)) {
          // Partial match - replace the term
          const enhancedEn = japaneseName.replace(jpTerm, translations.en);
          const enhancedZh = japaneseName.replace(jpTerm, translations.zh);
          const enhancedKo = japaneseName.replace(jpTerm, translations.ko);
          
          // Only update if it's different from original
          if (enhancedEn !== japaneseName) {
            item.names.en = enhancedEn;
            wasEnhanced = true;
          }
          if (enhancedZh !== japaneseName) {
            item.names.zh = enhancedZh;
            wasEnhanced = true;
          }
          if (enhancedKo !== japaneseName) {
            item.names.ko = enhancedKo;
            wasEnhanced = true;
          }
        }
        
        // Enhance keywords by adding translated terms
        if (!item.keywords.en.includes(translations.en)) {
          item.keywords.en.unshift(translations.en);
          wasEnhanced = true;
        }
        if (!item.keywords.zh.includes(translations.zh)) {
          item.keywords.zh.unshift(translations.zh);
          wasEnhanced = true;
        }
        if (!item.keywords.ko.includes(translations.ko)) {
          item.keywords.ko.unshift(translations.ko);
          wasEnhanced = true;
        }
      }
    }
    
    if (wasEnhanced) {
      enhancedCount++;
    }
    
    if ((index + 1) % 500 === 0) {
      console.log(`Processed ${index + 1} items... (Enhanced: ${enhancedCount})`);
    }
  });
  
  // Replace the data in the original content
  const updatedContent = wasteItemsContent.replace(
    /const wasteItemsData: WasteItemData\[\] = \[[\s\S]*?\];/,
    `const wasteItemsData: WasteItemData[] = ${JSON.stringify(wasteItemsData, null, 2)};`
  );
  
  // Write back to file
  fs.writeFileSync(wasteItemsPath, updatedContent);
  
  console.log(`✅ Successfully enhanced translations for ${enhancedCount} items`);
  
  // Show some examples of enhanced translations
  console.log('\\n📝 Enhanced translation examples:');
  const magazineItems = wasteItemsData.filter(item => 
    item.names.ja.includes('雑誌') || item.names.ja.includes('本') || item.names.ja.includes('書籍')
  ).slice(0, 5);
  
  magazineItems.forEach(item => {
    console.log(`Japanese: ${item.names.ja}`);
    console.log(`Korean: ${item.names.ko}`);
    console.log(`Chinese: ${item.names.zh}`);
    console.log(`English: ${item.names.en}`);
    console.log('---');
  });
}

// Run the enhancement
if (require.main === module) {
  try {
    enhanceTranslations();
  } catch (error) {
    console.error('❌ Error enhancing translations:', error);
    process.exit(1);
  }
}

module.exports = { enhanceTranslations };