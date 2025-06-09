import { WasteItem } from '@/types';

// Multilingual waste sorting database for Kawasaki City
// Based on official Kawasaki City waste sorting guidelines

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

const wasteItemsData: WasteItemData[] = [
  // Kitchen/Food items (燃やすごみ)
  {
    id: 'food-1',
    names: {
      ja: '生ごみ',
      en: 'Food Waste',
      zh: '厨余垃圾',
      ko: '음식물쓰레기'
    },
    keywords: {
      ja: ['生ごみ', '野菜くず', '魚の骨', '肉', '魚', 'なまごみ', '残飯', '食べ残し', '野菜', 'やさい'],
      en: ['food waste', 'vegetable scraps', 'fish bone', 'meat', 'fish', 'leftovers', 'organic waste', 'kitchen waste'],
      zh: ['厨余垃圾', '蔬菜残渣', '鱼骨', '肉类', '鱼', '剩菜', '剩饭', '食物垃圾', '有机垃圾'],
      ko: ['음식물쓰레기', '야채찌꺼기', '생선뼈', '고기', '생선', '음식쓰레기', '남은음식', '채소', '잔반']
    },
    category: 'burnable',
    instructions: {
      ja: '水気をよく切って出してください。新聞紙などに包んで出すとより良いです。',
      en: 'Drain water well before disposal. It\'s better to wrap in newspaper.',
      zh: '请充分沥干水分后丢弃。用报纸包装更好。',
      ko: '물기를 잘 빼고 버려주세요. 신문지에 싸서 버리면 더 좋습니다.'
    },
    icon: '🗑️',
  },
  {
    id: 'food-2',
    names: {
      ja: '紙おむつ',
      en: 'Diaper',
      zh: '纸尿裤',
      ko: '기저귀'
    },
    keywords: {
      ja: ['紙おむつ', 'オムツ', 'おむつ', 'かみおむつ', 'diaper', 'パンツ', 'おしめ', '赤ちゃん'],
      en: ['diaper', 'nappy', 'disposable diaper', 'baby diaper', 'training pants', 'pull-ups'],
      zh: ['纸尿裤', '尿布', '一次性尿裤', '婴儿尿裤', '纸尿片', '尿不湿'],
      ko: ['기저귀', '패드', '일회용기저귀', '아기기저귀', '기저귀팬티', '유아용품']
    },
    category: 'burnable',
    instructions: {
      ja: '汚物を取り除いてから出してください。',
      en: 'Remove waste before disposal.',
      zh: '请清除污物后丢弃。',
      ko: '오물을 제거한 후 버려주세요.'
    },
    icon: '👶',
  },
  {
    id: 'paper-1',
    names: {
      ja: '新聞紙',
      en: 'Newspaper',
      zh: '报纸',
      ko: '신문지'
    },
    keywords: {
      ja: ['新聞', '新聞紙', 'しんぶん', 'しんぶんし', 'newspaper', 'ニュース', 'news', '朝刊', '夕刊'],
      en: ['newspaper', 'news paper', 'daily paper', 'morning paper', 'evening paper', 'broadsheet', 'tabloid'],
      zh: ['报纸', '新闻纸', '日报', '晚报', '早报', '新闻', '报刊'],
      ko: ['신문', '신문지', '일간지', '조간', '석간', '뉴스', '신문용지']
    },
    category: 'recyclable',
    instructions: {
      ja: 'きれいに束ねて、ひもで十字にしばって出してください。雨の日は避けてください。',
      en: 'Bundle neatly and tie with string in a cross pattern. Avoid rainy days.',
      zh: '请整齐捆扎，用绳子十字绑好后丢弃。请避免雨天。',
      ko: '깔끔하게 묶어서 끈으로 십자로 묶어 버려주세요. 비오는 날은 피해주세요.'
    },
    icon: '📰',
  },
  {
    id: 'paper-2',
    names: {
      ja: '段ボール',
      en: 'Cardboard',
      zh: '纸箱',
      ko: '골판지'
    },
    keywords: {
      ja: ['段ボール', 'ダンボール', 'だんぼーる', 'cardboard', 'box', 'ボックス', '箱', 'はこ', '梱包', '配送'],
      en: ['cardboard', 'box', 'corrugated', 'shipping box', 'packaging', 'carton', 'delivery box'],
      zh: ['纸箱', '瓦楞纸', '纸盒', '包装箱', '快递箱', '运输箱', '纸板'],
      ko: ['골판지', '박스', '상자', '포장박스', '택배박스', '운송박스', '골판지박스']
    },
    category: 'recyclable',
    instructions: {
      ja: 'テープや金具を取り除き、平らにたたんでひもでしばって出してください。',
      en: 'Remove tape and metal fittings, flatten and tie with string.',
      zh: '请撕掉胶带和金属配件，压平后用绳子捆扎。',
      ko: '테이프와 금속 부품을 제거하고 평평하게 접어서 끈으로 묶어주세요.'
    },
    icon: '📦',
  },
  {
    id: 'container-1',
    names: {
      ja: 'ペットボトル',
      en: 'PET Bottle',
      zh: 'PET瓶',
      ko: 'PET병'
    },
    keywords: {
      ja: ['ペットボトル', 'pet bottle', 'プラスチックボトル', 'ぺっとぼとる', 'ボトル', '飲料ボトル', 'ジュース', '水'],
      en: ['pet bottle', 'plastic bottle', 'beverage bottle', 'water bottle', 'juice bottle', 'soda bottle', 'drink bottle'],
      zh: ['PET瓶', '塑料瓶', '饮料瓶', '水瓶', '果汁瓶', '汽水瓶', '饮品瓶', '矿泉水瓶'],
      ko: ['PET병', '플라스틱병', '음료수병', '물병', '주스병', '탄산음료병', '음료병', '생수병']
    },
    category: 'recyclable',
    instructions: {
      ja: 'キャップとラベルを外し、中を軽く洗って出してください。',
      en: 'Remove cap and label, rinse lightly before disposal.',
      zh: '请取下瓶盖和标签，轻微清洗后丢弃。',
      ko: '뚜껑과 라벨을 제거하고 가볍게 헹군 후 버려주세요.'
    },
    icon: '🍶',
  },
  {
    id: 'container-2',
    names: {
      ja: '缶',
      en: 'Can',
      zh: '罐头',
      ko: '캔'
    },
    keywords: {
      ja: ['缶', 'can', 'アルミ缶', 'スチール缶', 'かん', '空き缶', 'あきかん', 'ビール缶', 'ジュース缶', 'コーヒー缶'],
      en: ['can', 'aluminum can', 'steel can', 'tin can', 'beer can', 'soda can', 'coffee can', 'empty can'],
      zh: ['罐头', '铝罐', '钢罐', '马口铁罐', '易拉罐', '啤酒罐', '饮料罐', '咖啡罐', '空罐'],
      ko: ['캔', '알루미늄캔', '스틸캔', '깡통', '맥주캔', '음료캔', '커피캔', '빈캔', '통조림']
    },
    category: 'recyclable',
    instructions: {
      ja: '中を軽く洗って出してください。アルミ缶とスチール缶は分けなくて結構です。',
      en: 'Rinse lightly before disposal. No need to separate aluminum and steel cans.',
      zh: '请轻微清洗后丢弃。铝罐和钢罐无需分开。',
      ko: '가볍게 헹군 후 버려주세요. 알루미늄캔과 스틸캔을 구분할 필요 없습니다.'
    },
    icon: '🥫',
  },
  {
    id: 'electronics-1',
    names: {
      ja: '小型家電',
      en: 'Small Appliances',
      zh: '小型家电',
      ko: '소형가전'
    },
    keywords: {
      ja: ['小型家電', 'ドライヤー', 'トースター', 'small appliances'],
      en: ['small appliances', 'hair dryer', 'toaster', 'electronics'],
      zh: ['小型家电', '吹风机', '烤面包机', '电器'],
      ko: ['소형가전', '드라이어', '토스터', '전자제품']
    },
    category: 'nonBurnable',
    instructions: {
      ja: '30cm以下の家電製品。電池は取り外してください。',
      en: 'Appliances under 30cm. Remove batteries before disposal.',
      zh: '30厘米以下的家电产品。请取出电池。',
      ko: '30cm 이하의 가전제품. 배터리를 제거해 주세요.'
    },
    icon: '🔌',
  },
  {
    id: 'electronics-2',
    names: {
      ja: '電池',
      en: 'Battery',
      zh: '电池',
      ko: '배터리'
    },
    keywords: {
      ja: ['電池', 'battery', 'バッテリー', '乾電池'],
      en: ['battery', 'dry cell', 'batteries'],
      zh: ['电池', '干电池', '蓄电池'],
      ko: ['배터리', '건전지', '전지']
    },
    category: 'nonBurnable',
    instructions: {
      ja: '透明な袋に入れて出してください。充電式電池は販売店にお返しください。',
      en: 'Put in a transparent bag. Return rechargeable batteries to stores.',
      zh: '请放入透明袋中丢弃。充电电池请退回销售店。',
      ko: '투명한 봉지에 넣어 버려주세요. 충전식 배터리는 판매점에 반납해 주세요.'
    },
    icon: '🔋',
  },
  {
    id: 'oversized-1',
    names: {
      ja: '家具',
      en: 'Furniture',
      zh: '家具',
      ko: '가구'
    },
    keywords: {
      ja: ['家具', 'furniture', '机', 'desk', '椅子', 'chair'],
      en: ['furniture', 'desk', 'chair', 'table'],
      zh: ['家具', '桌子', '椅子', '柜子'],
      ko: ['가구', '책상', '의자', '테이블']
    },
    category: 'oversized',
    instructions: {
      ja: '事前に粗大ごみ受付センターに申し込みが必要です。処理券を購入してください。',
      en: 'Prior application to the oversized waste center is required. Purchase disposal tickets.',
      zh: '需要事先向大型垃圾受理中心申请。请购买处理券。',
      ko: '사전에 대형폐기물 접수센터에 신청이 필요합니다. 처리권을 구입해 주세요.'
    },
    icon: '🪑',
  },
  {
    id: 'plastic-1',
    names: {
      ja: 'プラスチック容器',
      en: 'Plastic Container',
      zh: '塑料容器',
      ko: '플라스틱 용기'
    },
    keywords: {
      ja: ['プラスチック', 'plastic', 'レジ袋', 'shopping bag', 'ぷらすちっく', '弁当箱', 'べんとうばこ', 'トレー', 'カップ', 'ふた'],
      en: ['plastic', 'container', 'shopping bag', 'plastic bag', 'bento box', 'tray', 'cup', 'lid', 'packaging'],
      zh: ['塑料', '容器', '购物袋', '塑料袋', '便当盒', '托盘', '杯子', '盖子', '包装'],
      ko: ['플라스틱', '용기', '쇼핑백', '비닐봉지', '도시락통', '트레이', '컵', '뚜껑', '포장재']
    },
    category: 'recyclable',
    instructions: {
      ja: '汚れを軽く落として、プラマークがついているものは資源ごみ。ついていないものは燃やすごみ。',
      en: 'Clean lightly. Items with plastic mark are recyclable, others are burnable.',
      zh: '轻微清洁后，有塑料标记的是资源垃圾，没有的是可燃垃圾。',
      ko: '가볍게 청소한 후, 플라스틱 마크가 있는 것은 자원쓰레기, 없는 것은 일반쓰레기입니다.'
    },
    icon: '🛍️',
  },
  {
    id: 'paper-3',
    names: {
      ja: '雑誌・書籍',
      en: 'Magazines & Books',
      zh: '杂志书籍',
      ko: '잡지서적'
    },
    keywords: {
      ja: ['雑誌', 'ざっし', 'マガジン', 'magazine', '本', 'ほん', '書籍', 'しょせき', '週刊誌', '月刊誌', 'コミック', '漫画', 'まんが', '小説', 'カタログ', 'パンフレット'],
      en: ['magazine', 'book', 'catalog', 'brochure', 'pamphlet', 'periodical', 'publication', 'comic', 'novel', 'manual', 'guidebook', 'textbook'],
      zh: ['杂志', '书籍', '目录', '小册子', '宣传册', '期刊', '出版物', '画册', '漫画', '小说', '手册', '指南', '教科书'],
      ko: ['잡지', '책', '도서', '서적', '카탈로그', '팜플렛', '브로셔', '간행물', '화보', '만화', '소설', '매뉴얼', '가이드북', '교과서']
    },
    category: 'recyclable',
    instructions: {
      ja: 'ホチキスなどの金属部分は取り除いて、紙だけを束ねて出してください。',
      en: 'Remove metal staples and bundle paper only.',
      zh: '请取除订书钉等金属部分，只将纸张捆扎后丢弃。',
      ko: '스테이플러 등 금속 부분을 제거하고 종이만 묶어서 버려주세요.'
    },
    icon: '📚',
  },
  {
    id: 'paper-4',
    names: {
      ja: 'チラシ・広告',
      en: 'Flyers & Advertisements',
      zh: '传单广告',
      ko: '전단지광고'
    },
    keywords: {
      ja: ['チラシ', 'ちらし', '広告', 'こうこく', 'フライヤー', 'flyer', 'DM', 'ダイレクトメール', 'ポスター', '宣伝', '案内'],
      en: ['flyer', 'advertisement', 'ad', 'poster', 'leaflet', 'direct mail', 'promotional material', 'brochure', 'handout'],
      zh: ['传单', '广告', '海报', '宣传单', '直邮', '宣传材料', '单页', '手册'],
      ko: ['전단지', '광고', '포스터', '홍보물', '안내문', '광고지', '선전물', '홍보지']
    },
    category: 'recyclable',
    instructions: {
      ja: '汚れていないものは古紙として出してください。汚れがひどい場合は燃やすごみです。',
      en: 'Clean flyers go to paper recycling. Heavily soiled ones go to burnable waste.',
      zh: '没有污渍的作为废纸处理。污渍严重的归入可燃垃圾。',
      ko: '오염되지 않은 것은 폐지로 버려주세요. 오염이 심한 경우 일반쓰레기입니다.'
    },
    icon: '📄',
  },
  {
    id: 'paper-5',
    names: {
      ja: '封筒・手紙',
      en: 'Envelopes & Letters',
      zh: '信封信件',
      ko: '봉투편지'
    },
    keywords: {
      ja: ['封筒', 'ふうとう', '手紙', 'てがみ', '郵便', 'ゆうびん', 'はがき', 'ハガキ', '葉書', 'envelope', 'letter'],
      en: ['envelope', 'letter', 'mail', 'postcard', 'correspondence', 'stationery'],
      zh: ['信封', '信件', '邮件', '明信片', '信函', '文具'],
      ko: ['봉투', '편지', '우편', '엽서', '서신', '문구']
    },
    category: 'recyclable',
    instructions: {
      ja: 'プラスチック窓は取り除いて、紙の部分のみリサイクルに出してください。',
      en: 'Remove plastic windows and recycle paper parts only.',
      zh: '请取除塑料窗口，只将纸质部分回收。',
      ko: '플라스틱 창을 제거하고 종이 부분만 재활용해 주세요.'
    },
    icon: '✉️',
  },
  {
    id: 'paper-6',
    names: {
      ja: '包装紙・紙袋',
      en: 'Wrapping Paper & Paper Bags',
      zh: '包装纸纸袋',
      ko: '포장지종이봉투'
    },
    keywords: {
      ja: ['包装紙', 'ほうそうし', '紙袋', 'かみぶくろ', 'ギフト', 'gift', 'プレゼント', 'ラッピング', 'wrapping'],
      en: ['wrapping paper', 'paper bag', 'gift wrap', 'shopping bag', 'packaging', 'gift bag'],
      zh: ['包装纸', '纸袋', '礼品袋', '购物袋', '包装材料'],
      ko: ['포장지', '종이봉투', '선물포장', '쇼핑백', '포장재']
    },
    category: 'recyclable',
    instructions: {
      ja: 'テープやリボンは取り除いて、紙の部分のみ古紙として出してください。',
      en: 'Remove tape and ribbons, recycle paper parts only.',
      zh: '请取除胶带和丝带，只将纸质部分作为废纸处理。',
      ko: '테이프와 리본을 제거하고 종이 부분만 폐지로 버려주세요.'
    },
    icon: '🎁',
  },
];

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
    .replace(/[\s\-_.,!?()]/g, '')
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
  return text.replace(/[\u30A1-\u30F6]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) - 0x60);
  });
};

// Decompose Hangul characters to jamo for Korean phonetic matching
const decomposeHangul = (text: string): string => {
  return text.replace(/[\uAC00-\uD7AF]/g, (char) => {
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
  const minLength = /[\u4e00-\u9fff\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(query) ? 1 : 2;
  
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